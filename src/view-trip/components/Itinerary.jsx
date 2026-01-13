import React, { useState } from 'react'
import { Timeline } from "@/components/ui/timeline";
import ItineraryItem from './ItineraryItem';
import GlobalMap from './GlobalMap';
import { Map, List } from 'lucide-react';

export default function Itinerary({ trip, showMap, setShowMap, selectedLocation }) {

    // Use real trip data or fallback to placeholder
    const TRIP_DATA = trip?.tripData || {
        "tripDetails": {
            "destination": "Sharjah (الشارقة), UAE",
            "destinationEnglish": "Sharjah",
            "destinationArabic": "الشارقة",
            "duration": "6",
            "travelers": "A Couple",
            "budget": "Cheap"
        },
        "hotels": [
            {
                "hotelName": "Radisson Blu Resort, Sharjah",
                "hotelAddress": "Corniche Street, Al Khan, Sharjah, United Arab Emirates",
                "price": "AED 350-550 per night",
                "hotelImageUrl": "https://i.ibb.co/L6z4Jq5/Radisson-Blu-Sharjah.jpg",
                "geoCoordinates": "25.3610, 55.3686",
                "rating": "4.0",
                "description": "Beachfront resort with dining options and recreational facilities."
            },
            {
                "hotelName": "Copthorne Hotel Sharjah",
                "hotelAddress": "Al Majaz 1, Jamal Abdul Nasser Street, Sharjah",
                "price": "AED 280-480 per night",
                "hotelImageUrl": "https://i.ibb.co/hK8bQYv/Copthorne-Sharjah.jpg",
                "geoCoordinates": "25.3406, 55.3813",
                "rating": "4.0",
                "description": "Lagoon-view hotel near Al Majaz Waterfront with modern amenities."
            },
            {
                "hotelName": "Hilton Garden Inn Sharjah",
                "hotelAddress": "Al Majaz 2, Al Mina Street, Sharjah",
                "price": "AED 300-500 per night",
                "hotelImageUrl": "https://i.ibb.co/k5w1F4B/Hilton-Garden-Inn-Sharjah.jpg",
                "geoCoordinates": "25.3344, 55.3826",
                "rating": "4.0",
                "description": "Modern hotel with outdoor pool and central location."
            },
            {
                "hotelName": "Sharjah Carlton Hotel",
                "hotelAddress": "Al Khan Area, Sharjah",
                "price": "AED 220-400 per night",
                "hotelImageUrl": "https://i.ibb.co/xJ04W6c/Sharjah-Carlton.jpg",
                "geoCoordinates": "25.3644, 55.3676",
                "rating": "3.5",
                "description": "Budget-friendly beachfront hotel."
            }
        ],

        "itinerary": [
            {
                "day": "Day 1",
                "activities": [
                    {
                        "time": "Afternoon",
                        "placeName": "Arrival & Hotel Check-in",
                        "details": "Arrive at SHJ or DXB and transfer to hotel."
                    },
                    {
                        "time": "Evening",
                        "placeName": "Al Majaz Waterfront",
                        "details": "Walk, fountain show, dinner by the lagoon."
                    }
                ]
            },
            {
                "day": "Day 2",
                "activities": [
                    {
                        "time": "Morning",
                        "placeName": "Sharjah Museum of Islamic Civilization",
                        "ticket": "AED 10"
                    },
                    {
                        "time": "Afternoon",
                        "placeName": "Heart of Sharjah & Souq Al Arsah"
                    },
                    {
                        "time": "Evening",
                        "placeName": "Al Noor Mosque & Khalid Lagoon"
                    }
                ]
            },
            {
                "day": "Day 3",
                "activities": [
                    {
                        "time": "Morning",
                        "placeName": "Sharjah Aquarium & Maritime Museum",
                        "ticket": "AED 25-30"
                    },
                    {
                        "time": "Afternoon",
                        "placeName": "Al Montazah Parks"
                    },
                    {
                        "time": "Evening",
                        "placeName": "Al Qasba Canal & Abra Ride"
                    }
                ]
            },
            {
                "day": "Day 4",
                "activities": [
                    {
                        "time": "Morning",
                        "placeName": "Sharjah Desert Park"
                    },
                    {
                        "time": "Afternoon",
                        "placeName": "Al Dhaid Date Farms"
                    },
                    {
                        "time": "Evening",
                        "placeName": "Local Dinner"
                    }
                ]
            },
            {
                "day": "Day 5",
                "activities": [
                    {
                        "time": "Morning",
                        "placeName": "Central Souq (Blue Souq)"
                    },
                    {
                        "time": "Afternoon",
                        "placeName": "Sharjah Art Museum / Calligraphy Museum"
                    },
                    {
                        "time": "Evening",
                        "placeName": "Rolla Square Park"
                    }
                ]
            },
            {
                "day": "Day 6",
                "activities": [
                    {
                        "time": "Morning",
                        "placeName": "Al Khan Beach"
                    },
                    {
                        "time": "Afternoon",
                        "placeName": "Last-minute Shopping"
                    },
                    {
                        "time": "Evening",
                        "placeName": "Departure"
                    }
                ]
            }
        ]
    }

    // Dynamically generate timeline data from trip itinerary
    const data = TRIP_DATA?.itinerary?.map((dayPlan, index) => {
        const dayNumber = index + 1;
        const arabicDayNumbers = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];

        return {
            title: `${dayPlan.day} | اليوم ${arabicDayNumbers[index] || dayNumber}`,
            content: (
                <div>
                    <div className="mb-8">
                        {/* Display all activities/places for this day */}
                        {dayPlan.plan ? (
                            // New format with 'plan' array
                            dayPlan.plan.map((activity, actIdx) => (
                                <ItineraryItem key={actIdx} activity={activity} />
                            ))
                        ) : dayPlan.activities ? (
                            // Old format with 'activities' array
                            dayPlan.activities.map((activity, actIdx) => (
                                <ItineraryItem key={actIdx} activity={activity} />
                            ))
                        ) : (
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                No activities planned for this day.
                            </p>
                        )}
                    </div>
                </div>
            ),
        };
    }) || [];

    return (
        <div id="itinerary-section" className="relative w-full h-full rounded-xl overflow-hidden bg-transparent">
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-800 text-purple-600 dark:text-purple-400 hover:scale-110 hover:bg-white dark:hover:bg-neutral-800 transition-all active:scale-95 group"
                    title={showMap ? "Show List View" : "Show Map View"}
                >
                    <div className="flex items-center">
                        {showMap ? (
                            <>
                                <List size={24} className="group-hover:rotate-12 transition-transform" />
                                <span className="font-semibold text-sm"></span>
                            </>
                        ) : (
                            <>
                                <Map size={24} className="group-hover:rotate-12 transition-transform" />
                                <span className="font-semibold text-sm"></span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            <div className={`h-full ${showMap ? 'overflow-hidden' : 'overflow-auto'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
                {showMap ? (
                    <GlobalMap tripData={trip} selectedLocation={selectedLocation} />
                ) : (
                    <Timeline data={data} tripData={TRIP_DATA} />
                )}
            </div>
        </div>
    );
}