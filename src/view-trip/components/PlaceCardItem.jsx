import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function PlaceCardItem({ place, setShowMap, setSelectedLocation }) {

  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    place && GetPlacePhoto();
  }, [place])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName
    }
    const result = await GetPlaceDetails(data).then(resp => {
      const photos = resp.data?.places?.[0]?.photos;
      if (photos && photos.length > 0) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photos[0].name);
        setPhotoUrl(PhotoUrl);
      }
    })
  }

  const handleCardClick = () => {
    setSelectedLocation({
      coordinates: place.geoCoordinates,
      name: place.placeName,
      photoUrl: photoUrl
    });
    setShowMap(true);
    // Optional: Smooth scroll to the itinerary/map section
    const itinerarySection = document.getElementById('itinerary-section');
    if (itinerarySection) {
      itinerarySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className='border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 h-full hover:scale-105 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-900/30 backdrop-blur-sm transition-colors duration-300'
    >
      <div>
        {photoUrl ? <img src={photoUrl}
          className='w-full h-[130px] rounded-xl object-cover'
          alt={place.placeName}
        />
          : <div className='w-full h-[130px] bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl'></div>}
        <div className='mt-2'>
          <h2 className='font-bold text-lg text-neutral-900 dark:text-neutral-100 transition-colors'>{place.placeName}</h2>
          <p className='text-sm text-neutral-500 dark:text-gray-400 max-h-[100px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-colors'>{place.placeDetails}</p>
          <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 transition-colors'>🕙 {place.timeToTravel}</h2>
          <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 transition-colors'>🎟️ {place.ticketPricing}</h2>
        </div>
      </div>
      <div className='mt-3 flex justify-end'>
        <button className='text-xs bg-purple-600 text-white px-4 py-1.5 rounded-full hover:bg-purple-700 transition-colors shadow-lg dark:shadow-purple-900/20'>
          View on Map
        </button>
      </div>
    </div>
  )
}

export default PlaceCardItem