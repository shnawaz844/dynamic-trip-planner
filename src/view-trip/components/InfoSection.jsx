import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";

function InfoSection( { trip } ) {

  const [ photoUrl, setPhotoUrl ] = useState();
  useEffect( () => {
    trip && GetPlacePhoto();
  }, [ trip ] )

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.english || trip?.userSelection?.location?.label || trip?.userSelection?.location
    }
    await GetPlaceDetails( data ).then( resp => {
      const photos = resp.data?.places?.[ 0 ]?.photos;
      if ( photos && photos.length > 0 ) {
        const PhotoUrl = PHOTO_REF_URL.replace( '{NAME}', photos[ 0 ].name );
        setPhotoUrl( PhotoUrl );
      }
    } )
  }

  const handleShare = () => {
    const tripUrl = window.location.href;

    const locationData = trip?.userSelection?.location;
    const destination = locationData?.english ||
      locationData?.label ||
      ( typeof locationData === 'string' ? locationData : null ) ||
      'Your Destination';

    let itineraryText = '';
    if ( trip?.tripData?.itinerary && trip.tripData.itinerary.length > 0 ) {
      itineraryText = '\n\n📋 *Day-by-Day Itinerary:*\n';

      trip.tripData.itinerary.forEach( ( dayPlan, dayIndex ) => {
        itineraryText += `\n*${ dayPlan.day || `Day ${ dayIndex + 1 }` }*\n`;

        const places = dayPlan.plan || dayPlan.activities || [];
        if ( places.length > 0 ) {
          places.forEach( ( place, placeIndex ) => {
            itineraryText += `\n${ placeIndex + 1 }. *${ place.placeName || 'Place' }*`;
            if ( place.time ) itineraryText += ` - ${ place.time }`;
            if ( place.placeDetails ) itineraryText += `\n   📝 ${ place.placeDetails }`;
            if ( place.timeToTravel ) itineraryText += `\n   🕙 ${ place.timeToTravel }`;
            if ( place.ticketPricing ) itineraryText += `\n   🎟️ ${ place.ticketPricing }`;
            itineraryText += '\n';
          } );
        }
      } );
    }

    const message = `🌍 *Check out my trip plan!*\n\n` +
      `📍 *Destination:* ${ destination }\n` +
      `📅 *Duration:* ${ trip?.userSelection?.noOfDays } Days\n` +
      `💰 *Budget:* ${ trip?.userSelection?.budget }\n` +
      `👥 *Travelers:* ${ trip?.userSelection?.traveler }` +
      itineraryText +
      `\n\n🔗 View full trip details here: ${ tripUrl }`;

    const whatsappUrl = `https://wa.me/?text=${ encodeURIComponent( message ) }`;
    window.open( whatsappUrl, '_blank' );
  }


  return (
    <div>
      <h2 className="max-w-4xl text-center md:text-left text-3xl md:text-4xl font-extrabold tracking-tight mb-16 text-neutral-900 dark:text-white transition-colors">
        Your trip to{ " " }
        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-200 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent drop-shadow-sm">
          { trip?.tripData?.tripDetails?.destinationEnglish || trip?.userSelection?.location?.english || trip?.userSelection?.location?.label || 'Your Destination' }
        </span>{ " " }
        is ready for{ " " }
        <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-300 dark:to-cyan-400 bg-clip-text text-transparent">
          { trip?.tripData?.tripDetails?.duration || trip?.userSelection?.noOfDays } days
        </span>
      </h2>

      { photoUrl ? <img
        src={ photoUrl }
        className="h-[340px] w-full object-cover rounded-xl"
        alt=""
      />
        : <div className='h-[340px] w-full bg-slate-200 animate-pulse rounded-xl'></div> }

      <div className='my-5 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3'>
        <div className='flex flex-wrap gap-2 w-full sm:w-auto'>
          <div className='flex items-center gap-2 px-5 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-200 transition-colors'>
            <span className='text-xl'>📅</span>
            <span className='font-medium'>{ trip.userSelection?.noOfDays } Day</span>
          </div>

          <div className='flex items-center gap-2 px-5 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-200 transition-colors'>
            <span className='text-xl'>💰</span>
            <span className='font-medium'>{ trip.userSelection?.budget } Budget</span>
          </div>

          <div className='flex items-center gap-2 px-5 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-200 transition-colors'>
            <span className='text-xl'>👥</span>
            <span className='font-medium'>{ trip.userSelection?.traveler }</span>
          </div>
        </div>

        <Button
          onClick={ handleShare }
          className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg'
        >
          <IoIosSend className='text-xl' />
        </Button>
      </div>
    </div>
  )
}

export default InfoSection