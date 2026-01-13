import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { buildAIPrompt } from '@/constants/options';
import { getRegionConfig } from '@/constants/regionConfigs';
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import AIPlanner from './_components/AIPlanner';
import SignInDialog from './_components/SignInDialog';
import RegionVideoBackground from '@/components/custom/RegionVideoBackground';

/**
 * RegionTripCreator - A wrapper component that handles region-specific trip creation
 * Reads region from URL params and configures AIPlanner accordingly
 */
function RegionTripCreator() {
    const { regionId = 'uae' } = useParams();
    const navigate = useNavigate();

    // Get region configuration
    const regionConfig = getRegionConfig(regionId);
    const cities = regionConfig.cities || [];

    // Form state
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [citySearch, setCitySearch] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [multiStepLoading, setMultiStepLoading] = useState(false);

    // Loading states - dynamic based on region
    const loadingStates = [
        { text: "Analyzing your travel preferences..." },
        { text: `Exploring ${regionConfig.shortName} destinations...` },
        { text: "Checking local attractions..." },
        { text: "Finding best accommodation options..." },
        { text: "Planning daily itineraries..." },
        { text: "Calculating budget estimates..." },
        { text: "Adding cultural experiences..." },
        { text: "Finalizing your personalized trip plan..." },
        { text: "Ready! Your adventure awaits..." },
    ];

    // Reset form when region changes
    useEffect(() => {
        setFormData({});
        setCitySearch("");
        setSelectedCity(null);
        setFilteredCities([]);
    }, [regionId]);

    // Handle city search
    const handleCitySearch = (value) => {
        setCitySearch(value);

        if (!value) {
            setFilteredCities([]);
            return;
        }

        const results = cities.filter(city => {
            const englishMatch = city.english?.toLowerCase().includes(value.toLowerCase());
            const localMatch = city.local?.includes(value) || city.arabic?.includes(value);
            const countryMatch = city.country?.toLowerCase().includes(value.toLowerCase());
            const stateMatch = city.state?.toLowerCase().includes(value.toLowerCase());
            return englishMatch || localMatch || countryMatch || stateMatch;
        });

        setFilteredCities(results.slice(0, 6));
    };

    // Handle form input changes
    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle city selection
    const handleCitySelect = (city) => {
        setCitySearch(city.english);
        setSelectedCity(city);
        handleInputChange('location', {
            label: regionConfig.locationFormat(city),
            english: city.english,
            local: city.local || city.arabic || '',
            country: city.country || '',
            state: city.state || ''
        });
        setFilteredCities([]);
    };

    // Google login
    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error)
    });

    // Clean JSON response
    const cleanJson = (text) => {
        if (!text) throw new Error("Empty AI response");

        let cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
        cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

        const openBraces = (cleaned.match(/{/g) || []).length;
        const closeBraces = (cleaned.match(/}/g) || []).length;
        const openBrackets = (cleaned.match(/\[/g) || []).length;
        const closeBrackets = (cleaned.match(/]/g) || []).length;

        if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
            throw new Error(`Response truncated. Try reducing trip duration.`);
        }

        try {
            JSON.parse(cleaned);
            return cleaned;
        } catch (e) {
            return cleaned;
        }
    };

    // Generate trip
    const OnGenerateTrip = async () => {
        if (!formData?.noOfDays || !formData?.budget || !formData?.traveler) {
            toast("Please fill all details");
            return;
        }

        setMultiStepLoading(true);
        setLoading(true);

        try {
            // Build dynamic prompt based on user selections and region
            const FINAL_PROMPT = buildAIPrompt({
                location: selectedCity || formData?.location,
                noOfDays: formData?.noOfDays,
                traveler: formData?.traveler,
                budget: formData?.budget,
                regionConfig: regionConfig // Pass region config for currency etc.
            });

            console.log('Generated AI Prompt:', FINAL_PROMPT);

            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const responseText = result?.response?.text();
            const cleanedJson = cleanJson(responseText);

            try {
                const parsedData = JSON.parse(cleanedJson);
                await SaveAiTrip(parsedData);
            } catch (parseError) {
                const errorPos = parseError.message.match(/position (\d+)/);
                if (errorPos) {
                    const pos = parseInt(errorPos[1]);
                    const start = Math.max(0, pos - 100);
                    const end = Math.min(cleanedJson.length, pos + 100);
                    console.error('Problematic JSON section:', cleanedJson.substring(start, end));
                }
                throw parseError;
            }
        } catch (error) {
            console.error("Error generating trip:", error);
            toast.error(`Failed to generate trip plan: ${error.message}`);
        } finally {
            setLoading(false);
            setMultiStepLoading(false);
        }
    };

    // Save trip to database
    const SaveAiTrip = async (TripData) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const docId = Date.now().toString();

            await setDoc(doc(db, "AITrips", docId), {
                userSelection: {
                    ...formData,
                    location: formData?.location || selectedCity,
                    region: regionConfig.id,
                    regionName: regionConfig.name
                },
                tripData: TripData,
                userEmail: user?.email || 'guest@tripplanner.com',
                id: docId
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/view-trip/' + docId);
        } catch (error) {
            console.error("Error saving trip:", error);
            throw error;
        }
    };

    // Get user profile after Google login
    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json'
            }
        }).then((resp) => {
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialog(false);
            OnGenerateTrip();
        });
    };

    return (
        <div>
            {/* MultiStep Loader */}
            <Loader
                loadingStates={loadingStates}
                loading={multiStepLoading}
                duration={4500}
            />

            {/* Region-specific Video Background */}
            <RegionVideoBackground regionId={regionId} />

            <div className="relative gap-5 p-5">
                {/* AI Planner Component */}
                <div className="relative">
                    <div className="lg:sticky lg:top-10">
                        <AIPlanner
                            regionConfig={regionConfig}
                            regionId={regionId}
                            citySearch={citySearch}
                            selectedCity={selectedCity}
                            filteredCities={filteredCities}
                            onCitySearch={handleCitySearch}
                            onCitySelect={handleCitySelect}
                            formData={formData}
                            onInputChange={handleInputChange}
                            loading={loading}
                            onGenerateTrip={OnGenerateTrip}
                        />
                    </div>
                </div>
            </div>

            {/* Sign In Dialog */}
            <SignInDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                onGoogleLogin={login}
            />
        </div>
    );
}

export default RegionTripCreator;
