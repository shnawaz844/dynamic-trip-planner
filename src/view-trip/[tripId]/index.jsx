import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import Itinerary from '../components/Itinerary';

function Viewtrip() {

    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);
    const [showMap, setShowMap] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId])

    /**
     * Used to get Trip Information from Firebase
     */
    const GetTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Dodcument:", docSnap.data());
            setTrip(docSnap.data());
        }
        else {
            console.log("No Such Document");
            toast('No trip Found!')
        }
    }

    return (
        <div className='w-full bg-white dark:bg-black min-h-screen text-neutral-900 dark:text-white transition-colors duration-500'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 p-5 md:p-10'>

                    {/* Left Side: Scrollable Content */}
                    <div className='space-y-10'>
                        {/* Information Section */}
                        <InfoSection trip={trip} />

                        {/* Recommended Hotels */}
                        <Hotels trip={trip} />

                        {/* Daily Plan */}
                        <PlacesToVisit trip={trip} setShowMap={setShowMap} setSelectedLocation={setSelectedLocation} />
                    </div>

                    {/* Right Side: Sticky Itinerary */}
                    <div className='md:sticky md:top-28 h-[calc(100vh-140px)]'>
                        <Itinerary
                            trip={trip}
                            showMap={showMap}
                            setShowMap={setShowMap}
                            selectedLocation={selectedLocation}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className='px-10 pb-10'>
                    <Footer trip={trip} />
                </div>
            </div>
        </div>
    )
}

export default Viewtrip