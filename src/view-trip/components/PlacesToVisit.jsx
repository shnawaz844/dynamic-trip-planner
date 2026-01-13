import React from 'react'
import PlaceCardItem from './PlaceCardItem'

function PlacesToVisit({ trip, setShowMap, setSelectedLocation }) {
    return (
        <div>
            <h2 className='font-bold text-xl text-neutral-900 dark:text-white transition-colors'>Places to Visit</h2>

            <div>
                {trip.tripData?.itinerary.map((item, index) => (
                    <div key={index} className='mt-5'>
                        <h2 className='font-bold text-lg text-neutral-900 dark:text-white mt-10 transition-colors'>{item.day}</h2>
                        <div className='grid md:grid-cols-2 gap-5'>
                            {item.plan.map((place, index) => (
                                <div key={index} className='h-full flex flex-col'>
                                    <h2 className='font-medium text-sm text-orange-600 mb-2'>{place.time}</h2>
                                    <PlaceCardItem
                                        place={place}
                                        setShowMap={setShowMap}
                                        setSelectedLocation={setSelectedLocation}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlacesToVisit