import React, { useEffect, useRef, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { buildAIPrompt } from '@/constants/options';
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import AIPlanner from './_components/AIPlanner';
import SignInDialog from './_components/SignInDialog';

const UAE_CITIES = [
  { english: "Abu Dhabi", arabic: "أبو ظبي" },
  { english: "Dubai", arabic: "دبي" },
  { english: "Sharjah", arabic: "الشارقة" },
  { english: "Ajman", arabic: "عجمان" },
  { english: "Umm Al Quwain", arabic: "أم القيوين" },
  { english: "Ras Al Khaimah", arabic: "رأس الخيمة" },
  { english: "Fujairah", arabic: "الفجيرة" },
  { english: "Al Ain", arabic: "العين" },
  { english: "Liwa Oasis", arabic: "واحة ليوا" },
  { english: "Sir Bani Yas Island", arabic: "جزيرة صير بني ياس" },
  { english: "Yas Island", arabic: "جزيرة ياس" },
  { english: "Saadiyat Island", arabic: "جزيرة السعديات" },
  { english: "Al Marjan Island", arabic: "جزيرة المرجان" },
  { english: "Khor Fakkan", arabic: "خور فكان" },
  { english: "Dibba", arabic: "دبا" },
  { english: "Hatta", arabic: "حتا" },
  { english: "Jebel Ali", arabic: "جبل علي" },
  { english: "Al Qusais", arabic: "القصيص" },
  { english: "Deira", arabic: "ديرة" },
  { english: "Bur Dubai", arabic: "بر دبي" },
  { english: "Jumeirah", arabic: "جميرا" },
  { english: "Palm Jumeirah", arabic: " نخلة جميرا" },
  { english: "Dubai Marina", arabic: "مرسى دبي" },
  { english: "Jebel Jais", arabic: "جبل جيس" },
  { english: "Al Dhaid", arabic: "الذيد" },
  { english: "Madinat Zayed", arabic: "مدينة زايد" },
  { english: "Ghayathi", arabic: "الغياثي" },
  { english: "Ruwais", arabic: "الرويس" },
  { english: "Sila", arabic: "سلع" },
  { english: "Dalma Island", arabic: "جزيرة دلما" },
  { english: "Arzanah Island", arabic: "جزيرة أرزنة" },
  { english: "Das Island", arabic: "جزيرة داس" },
  { english: "Zirku Island", arabic: "جزيرة زركوه" },
  { english: "Al Hamra", arabic: "الحمرا" },
  { english: "Al Jazirah Al Hamra", arabic: "الجزيرة الحمراء" },
  { english: "Al Madam", arabic: "المدام" },
  { english: "Al Shuwaib", arabic: "الشويب" },
  { english: "Dhaid", arabic: "الذيد" },
  { english: "Masafi", arabic: "مصيفي" },
  { english: "Masfout", arabic: "مصفوت" },
  { english: "Nahwa", arabic: "نحوة" },
  { english: "Manama", arabic: "المنامة" },
  { english: "Al Bithnah", arabic: "البثنة" },
  { english: "Al Hayl", arabic: "الحيل" },
  { english: "Al Hayer", arabic: "الهير" },
  { english: "Al Lisaili", arabic: "الليسيل" },
  { english: "Al Qor", arabic: "القور" },
  { english: "Al Rafaah", arabic: "الرفاعة" },
  { english: "Al Rowdah", arabic: "الرودا" },
  { english: "Al Taween", arabic: "الطووين" },
  { english: "Al Zahra", arabic: "الزهرة" },
  { english: "Awafi", arabic: "العوافي" },
  { english: "Falaj Al Mualla", arabic: "فلج المعلا" },
  { english: "Ghalilah", arabic: "غليلة" },
  { english: "Huwaylat", arabic: "الحويلات" },
  { english: "Khatt", arabic: "الخت" },
  { english: "Mleiha", arabic: "مليحة" },
  { english: "Wadi Al Helo", arabic: "وادي الحلو" },
  { english: "Wadi Al Qour", arabic: "وادي القور" },
  { english: "Wadi Bih", arabic: "وادي البيه" },
  { english: "Wadi Shawka", arabic: "وادي شوكة" },
  { english: "Al Ghail", arabic: "الغيل" },
  { english: "Al Hamraniyah", arabic: "الحمرانية" },
  { english: "Al Jeer", arabic: "الجير" },
  { english: "Al Khan", arabic: "الخان" },
  { english: "Al Mamoura", arabic: "المعمورة" },
  { english: "Al Mirfa", arabic: "المرفأ" },
  { english: "Al Mushrif", arabic: "المشرف" },
  { english: "Al Riffa", arabic: "الرفاعة" },
  { english: "Al Samha", arabic: "الصمخة" },
  { english: "Al Shahama", arabic: "الشهامة" },
  { english: "Al Wathba", arabic: "الوثبة" },
  { english: "Baniyas", arabic: "بني ياس" },
  { english: "Habshan", arabic: "حبشان" },
  { english: "Khalifa City", arabic: "مدينة خليفة" },
  { english: "Liwa City", arabic: "مدينة ليوا" },
  { english: "Mafraq", arabic: "مفرق" },
  { english: "Mazyad", arabic: "مزيد" },
  { english: "Mezaira'a", arabic: "مزيرعة" },
  { english: "Mohammad Bin Zayed City", arabic: "مدينة محمد بن زايد" },
  { english: "Murbaḥ", arabic: "مربح" },
  { english: "Musaffah", arabic: "مصفح" },
  { english: "Qasr Al Sarab", arabic: "قصر السراب" },
  { english: "Razeen", arabic: "الرزين" },
  { english: "Remah", arabic: "الرمح" },
  { english: "Sweihan", arabic: "سويحان" },
  { english: "Tarif", arabic: "طريف" },
  { english: "Zayed City", arabic: "مدينة زايد" }
];

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [multiStepLoading, setMultiStepLoading] = useState(false);
  const [aiTripData, setAiTripData] = useState(null);

  // Loading states
  const loadingStates = [
    { text: "Analyzing your travel preferences..." },
    { text: "Exploring UAE destinations..." },
    { text: "Checking local attractions..." },
    { text: "Finding best accommodation options..." },
    { text: "Planning daily itineraries..." },
    { text: "Calculating budget estimates..." },
    { text: "Adding cultural experiences..." },
    { text: "Finalizing your personalized trip plan..." },
    { text: "Ready! Your adventure awaits..." },
  ];

  // Videos
  const videos = [
    'video/camel.mp4',
    'video/building123.mp4',
    'video/desert.mp4',
    'video/video1.mp4',
    'video/video2.mp4'
  ];

  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  };

  useEffect(() => {
    const randomVideo = getRandomVideo();
    setSelectedVideo(randomVideo);
  }, []);

  const handleCitySearch = (value) => {
    setCitySearch(value);

    if (!value) {
      setFilteredCities([]);
      return;
    }

    const results = UAE_CITIES.filter(city =>
      city.english.toLowerCase().includes(value.toLowerCase()) ||
      city.arabic.includes(value)
    );

    setFilteredCities(results.slice(0, 6));
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCitySelect = (city) => {
    setCitySearch(city.english);
    setSelectedCity(city);
    handleInputChange('location', {
      label: `${city.english} - ${city.arabic}`,
      english: city.english,
      arabic: city.arabic
    });
    setFilteredCities([]);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const cleanJson = (text) => {
    if (!text) throw new Error("Empty AI response");

    let cleaned = text
      // Remove markdown code blocks
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Remove trailing commas before closing brackets/braces
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

    // Remove control characters that might break JSON
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    // Check if JSON appears to be truncated
    const openBraces = (cleaned.match(/{/g) || []).length;
    const closeBraces = (cleaned.match(/}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/]/g) || []).length;

    if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
      console.warn('JSON appears truncated:', {
        openBraces,
        closeBraces,
        openBrackets,
        closeBrackets,
        length: cleaned.length
      });
      throw new Error(`Response truncated. Try reducing trip duration or simplifying the request. (Braces: ${openBraces}/${closeBraces}, Brackets: ${openBrackets}/${closeBrackets})`);
    }

    // Try to fix common JSON issues
    try {
      // Attempt to parse - if it works, return cleaned version
      JSON.parse(cleaned);
      return cleaned;
    } catch (e) {
      // If parsing fails, try additional fixes
      console.warn('Initial JSON parse failed, attempting fixes...', e.message);

      // Fix unescaped quotes in strings (basic attempt)
      // This is a simple heuristic and may not catch all cases

      return cleaned;
    }
  };

  const OnGenerateTrip = async () => {
    // Validation only - no login required
    if (!formData?.noOfDays || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details");
      return;
    }

    setMultiStepLoading(true);
    setLoading(true);

    try {
      // Build dynamic prompt based on user selections
      const FINAL_PROMPT = buildAIPrompt({
        location: selectedCity || formData?.location,
        noOfDays: formData?.noOfDays,
        traveler: formData?.traveler,
        budget: formData?.budget
      });

      console.log('Generated AI Prompt:', FINAL_PROMPT);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result?.response?.text();

      // Clean and parse the JSON response
      const cleanedJson = cleanJson(responseText);

      try {
        const parsedData = JSON.parse(cleanedJson);

        await SaveAiTrip(parsedData);
      } catch (parseError) {
        // Log the problematic section of JSON
        const errorPos = parseError.message.match(/position (\d+)/);
        if (errorPos) {
          const pos = parseInt(errorPos[1]);
          const start = Math.max(0, pos - 100);
          const end = Math.min(cleanedJson.length, pos + 100);
          console.error('Problematic JSON section:', cleanedJson.substring(start, end));
          console.error('Error position:', pos);
        }
        throw parseError;
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      console.error("Error details:", error.message, error.stack);
      toast.error(`Failed to generate trip plan: ${error.message}`);
    } finally {
      setLoading(false);
      setMultiStepLoading(false); // CRITICAL: Always stop multistep loading
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const docId = Date.now().toString();

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: {
          ...formData,
          location: formData?.location || selectedCity
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

      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {selectedVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover blur-sm scale-110"
            key={selectedVideo}
          >
            <source src={selectedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      <div className="relative gap-5 p-5">
        {/* Left Side - AI Planner Component with scrolling */}
        <div className="relative">
          <div className="lg:sticky lg:top-10">
            <AIPlanner
              citySearch={citySearch}
              selectedCity={selectedCity}
              filteredCities={filteredCities}
              UAE_CITIES={UAE_CITIES}
              onCitySearch={handleCitySearch}
              onCitySelect={handleCitySelect}
              formData={formData}
              onInputChange={handleInputChange}
              loading={loading}
              onGenerateTrip={OnGenerateTrip}
            />
          </div>
        </div>

        {/* Right Side - Fixed Itinerary */}
        {/* <div className="lg:sticky lg:top-28 lg:h-fit">
          <Itinerary />
        </div> */}
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

export default CreateTrip;