import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function PlaceCardItem({ place, setShowMap, setSelectedLocation, trip }) {

  const [photoUrl, setPhotoUrl] = useState();

  const isRestActivity = (act) => {
    if (!act) return false;
    const name = (act.placeName || '').toLowerCase();
    const details = (act.placeDetails || act.details || '').toLowerCase();
    
    // Clean out the word "restaurant" to avoid false matches on "rest"
    const cleanName = name.replace(/restaurant/g, '');
    const cleanDetails = details.replace(/restaurant/g, '');

    return cleanName.includes('rest') || 
           cleanName.includes('relax') || 
           cleanName.includes('recharge') || 
           cleanName.includes('downtime') || 
           cleanName.includes('leisure') || 
           cleanName.includes('unwind') ||
           cleanName.includes('take a break') ||
           cleanDetails.includes('take rest') ||
           cleanDetails.includes('rest at') ||
           cleanDetails.includes('relax at') ||
           cleanName.includes('check-in') ||
           cleanName.includes('hotel sleep') ||
           cleanDetails.includes('check in to');
  };

  const isRest = isRestActivity(place);

  const getRestEmoji = () => {
    if (!place) return '🧘';
    const name = (place.placeName || '').toLowerCase();
    const details = (place.placeDetails || place.details || '').toLowerCase();
    if (name.includes('beach') || details.includes('beach')) return '🌴';
    if (name.includes('cafe') || name.includes('coffee') || details.includes('cafe') || details.includes('coffee')) return '☕';
    if (name.includes('pool') || details.includes('pool')) return '🏊';
    if (name.includes('spa') || details.includes('spa')) return '💆';
    if (name.includes('park') || name.includes('garden') || details.includes('park')) return '🍃';
    if (name.includes('sleep') || name.includes('hotel') || name.includes('resort')) return '🛌';
    return '🧘';
  };

  const getHotelPricingEstimates = () => {
    const hotels = trip?.tripData?.hotels || [];
    if (hotels.length === 0) return null;

    let totalMin = 0;
    let totalMax = 0;
    let count = 0;
    let currency = '';

    const parsePrice = (priceStr) => {
      if (!priceStr) return null;
      const cleanStr = priceStr.replace(/,/g, '');
      const numbers = cleanStr.match(/\d+/g);
      if (!numbers || numbers.length === 0) return null;

      let curr = '';
      const currencyMatch = priceStr.match(/(AED|INR|USD|EUR|GBP|Rs|₹|\$|£|€)/i);
      if (currencyMatch) {
        curr = currencyMatch[0];
      } else {
        const prefix = priceStr.match(/^[^\d]+/);
        if (prefix) curr = prefix[0].trim();
      }

      const minVal = parseInt(numbers[0], 10);
      const maxVal = numbers.length > 1 ? parseInt(numbers[1], 10) : minVal;
      return { minVal, maxVal, currency: curr };
    };

    hotels.forEach(h => {
      const parsed = parsePrice(h.price);
      if (parsed) {
        totalMin += parsed.minVal;
        totalMax += parsed.maxVal;
        if (!currency) currency = parsed.currency;
        count++;
      }
    });

    if (count === 0) return null;

    const avgMin = Math.round(totalMin / count);
    const avgMax = Math.round(totalMax / count);
    const finalCurrency = currency || trip?.tripData?.tripDetails?.currency || 'USD';

    return {
      perPerson: {
        min: Math.round(avgMin / 2),
        max: Math.round(avgMax / 2)
      },
      couple: {
        min: avgMin,
        max: avgMax
      },
      family: {
        min: avgMin * 2,
        max: avgMax * 2
      },
      gathering: {
        min: avgMin * 3,
        max: avgMax * 3
      },
      currency: finalCurrency
    };
  };

  const getSelectedTravelerType = () => {
    const travelerSelection = (
      trip?.tripData?.tripDetails?.travelers || 
      trip?.userSelection?.traveler || 
      ''
    ).toLowerCase();

    if (travelerSelection.includes('me') || travelerSelection.includes('single') || travelerSelection.includes('sole') || travelerSelection === '1') {
      return 'perPerson';
    }
    if (travelerSelection.includes('couple') || travelerSelection.includes('tandem') || travelerSelection.includes('2')) {
      return 'couple';
    }
    if (travelerSelection.includes('family') || travelerSelection.includes('3 to 5')) {
      return 'family';
    }
    if (travelerSelection.includes('friend') || travelerSelection.includes('gathering') || travelerSelection.includes('group') || travelerSelection.includes('5 to 10')) {
      return 'gathering';
    }
    return 'couple';
  };

  const getTravelerLabel = (type) => {
    switch (type) {
      case 'perPerson': return 'Per Person';
      case 'couple': return 'Couple';
      case 'family': return 'Family';
      case 'gathering': return 'Group';
      default: return 'Couple';
    }
  };

  const formatValRange = (minVal, maxVal, currency) => {
    const minStr = minVal.toLocaleString();
    const maxStr = maxVal.toLocaleString();
    if (minVal === maxVal) {
      return `${currency} ${minStr}`;
    }
    return `${currency} ${minStr} - ${currency} ${maxStr}`;
  };

  const pricingEstimates = isRest ? getHotelPricingEstimates() : null;
  const travelerType = getSelectedTravelerType();
  
  const getDisplayPriceAndLabel = () => {
    if (!pricingEstimates) return null;
    const est = pricingEstimates[travelerType] || pricingEstimates.couple;
    const priceStr = formatValRange(est.min, est.max, pricingEstimates.currency);
    const labelStr = getTravelerLabel(travelerType);
    return { priceStr, labelStr };
  };

  const displayPricing = getDisplayPriceAndLabel();

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place])

  const GetPlacePhoto = async () => {
    const name = (place?.placeName || '').toLowerCase();
    const isGenericRest = isRest && (
      name === 'rest' || 
      name === 'relax' || 
      name === 'recharge' || 
      name.includes('rest at hotel') || 
      name.includes('recharge at hotel') ||
      name.includes('unwind at hotel') ||
      name === 'hotel sleep' ||
      name === 'check-in'
    );

    if (isGenericRest) return;

    try {
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
    } catch (e) {
      console.log(e);
    }
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
      className={`border rounded-xl p-3 h-full hover:scale-105 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between backdrop-blur-sm transition-colors duration-300 ${
        isRest 
          ? 'bg-gradient-to-r from-violet-50/60 to-indigo-50/40 dark:from-violet-950/20 dark:to-indigo-950/10 border-violet-200 dark:border-violet-800/60' 
          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30'
      }`}
    >
      <div>
        {photoUrl ? (
          <img 
            src={photoUrl}
            className='w-full h-[130px] rounded-xl object-cover'
            alt={place.placeName}
          />
        ) : isRest ? (
          <div className='w-full h-[130px] rounded-xl bg-gradient-to-br from-indigo-500/80 via-purple-600/80 to-pink-500/80 flex flex-col items-center justify-center text-white p-2 shadow-inner relative overflow-hidden group'>
            <div className='absolute -right-10 -bottom-10 w-24 h-24 bg-white/10 rounded-full blur-xl transition-transform duration-700'></div>
            <div className='relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-md mb-1'>
              <span className='text-lg filter drop-shadow-md'>{getRestEmoji()}</span>
            </div>
            <span className='relative z-10 font-bold text-sm tracking-wide mt-1'>Rest & Recharge</span>
          </div>
        ) : (
          <div className='w-full h-[130px] bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl'></div>
        )}
        <div className='mt-2'>
          <h2 className='font-bold text-lg text-neutral-900 dark:text-neutral-100 transition-colors'>{place.placeName}</h2>
          <p className='text-sm text-neutral-500 dark:text-gray-400 max-h-[100px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-colors'>{place.placeDetails}</p>
          
          {place.time && (
            <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 transition-colors text-sm flex items-center gap-1.5'>
              ⏱️ Time: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{place.time}</span>
            </h2>
          )}
          
          {place.timeToTravel && place.timeToTravel !== '0 minutes' && place.timeToTravel !== '0 mins' && place.timeToTravel !== '0' && place.timeToTravel !== '0 min' && (
            <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 transition-colors text-sm flex items-center gap-1.5'>
              🚗 Travel: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{place.timeToTravel}</span>
            </h2>
          )}

          {isRest && displayPricing ? (
            <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 font-semibold transition-colors text-sm flex items-center gap-1.5'>
              🏨 Est. Hotel: <span className="text-violet-700 dark:text-violet-300 font-bold font-mono">{displayPricing.priceStr}</span>
              <span className="text-[9px] bg-violet-100 dark:bg-violet-900 px-2 py-0.5 rounded-full text-violet-700 dark:text-violet-300 font-medium">
                {displayPricing.labelStr}
              </span>
            </h2>
          ) : (
            <h2 className='mt-2 text-neutral-700 dark:text-neutral-300 transition-colors text-sm'>🎟️ {place.ticketPricing}</h2>
          )}
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