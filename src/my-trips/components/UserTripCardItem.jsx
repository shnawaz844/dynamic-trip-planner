import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip])

  const GetPlacePhoto = async () => {
    const locationName = trip?.userSelection?.location?.label || trip?.userSelection?.location?.english || trip?.userSelection?.location;
    if (!locationName) return;

    const data = {
      textQuery: locationName
    }
    const result = await GetPlaceDetails(data).then(resp => {
      const photo = resp.data.places[0]?.photos[3] || resp.data.places[0]?.photos[0];
      if (photo) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photo.name);
        setPhotoUrl(PhotoUrl);
      }
    })
  }
  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className='hover:scale-105 transition-all '>
        <img src={photoUrl ? photoUrl : '/placeholder.jpg'}
          className="object-cover rounded-xl h-[220px] w-full" />
        <div>
          <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label || trip?.userSelection?.location?.english || "Trip to " + (trip?.userSelection?.location || "Destination")}</h2>
          <h2 className='text-sm text-gray-500 font-medium'>{trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
        </div>
      </div>
    </Link>
  )
}

export default UserTripCardItem