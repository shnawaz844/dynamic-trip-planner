import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({ hotel }) {

  const [photoUrl, setPhotoUrl] = useState();
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel])

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName
    }
    const result = await GetPlaceDetails(data).then(resp => {
      const photos = resp.data?.places?.[0]?.photos;
      if (photos && photos.length > 0) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photos[0].name);
        setPhotoUrl(PhotoUrl);
      }
    })
  }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + "," + hotel?.hotelAddress} target='_blank' >
      <div className='hover:scale-105 transition-all cursor-pointer'>
        {photoUrl ? <img src={photoUrl} className='rounded-xl h-[180px] w-full object-cover' />
          : <div className='rounded-xl h-[180px] w-full bg-slate-200 animate-pulse'></div>}
        <div className='my-2 flex flex-col gap-2'>
          <h2 className='font-bold text-lg text-neutral-900 dark:text-white transition-colors'>{hotel?.hotelName}</h2>
          <h2 className='text-xs text-neutral-500 dark:text-neutral-400 '>📍 {hotel?.hotelAddress}</h2>
          <h2 className='text-sm text-neutral-700 dark:text-neutral-300'>💰 {hotel?.price}</h2>
          <h2 className='text-sm text-neutral-700 dark:text-neutral-300'>⭐ {hotel?.rating}</h2>

        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem