import React, { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming you have this component

function ItineraryItem({ activity, trip }) {
  const [photoUrls, setPhotoUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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

  const isRest = isRestActivity(activity);

  const getRestEmoji = () => {
    if (!activity) return '🧘';
    const name = (activity.placeName || '').toLowerCase();
    const details = (activity.placeDetails || activity.details || '').toLowerCase();
    if (name.includes('beach') || details.includes('beach')) return '🌴';
    if (name.includes('cafe') || name.includes('coffee') || details.includes('cafe') || details.includes('coffee')) return '☕';
    if (name.includes('pool') || details.includes('pool')) return '🏊';
    if (name.includes('spa') || details.includes('spa')) return '💆';
    if (name.includes('park') || name.includes('garden') || details.includes('park')) return '🍃';
    if (name.includes('sleep') || name.includes('hotel') || name.includes('resort')) return '🛌';
    return '🧘';
  };

  // Helper to parse hotel prices and calculate estimates
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

      // Detect currency
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

  const pricingEstimates = isRest ? getHotelPricingEstimates() : null;

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
    activity && GetPlacePhoto();
  }, [activity]);

  const GetPlacePhoto = async () => {
    const name = (activity?.placeName || '').toLowerCase();
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
        textQuery: activity.placeName
      }
      const result = await GetPlaceDetails(data).then(resp => {
        const places = resp.data?.places;
        if (places && places.length > 0) {
          const photos = places[0].photos;
          if (photos && photos.length > 0) {
            // Fetch all available photo URLs (limit to 5)
            const urls = photos.slice(0, 5).map(photo =>
              PHOTO_REF_URL.replace('{NAME}', photo.name)
            );
            setPhotoUrls(urls);
          }
        }
      })
    } catch (error) {
      console.log("Error fetching place photo:", error);
    }
  }

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % photoUrls.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
  };

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query=' + activity.placeName} target='_blank' className='block'>
      <div className={`border rounded-xl shadow-sm hover:shadow-md transition-all p-4 mb-4 ${
        isRest 
          ? 'bg-gradient-to-r from-violet-50/60 to-indigo-50/40 dark:from-violet-950/20 dark:to-indigo-950/10 border-violet-200 dark:border-violet-800/60' 
          : 'bg-transparent dark:bg-transparent border-neutral-200 dark:border-neutral-800'
      }`}>

        {/* Image Section - Grid Layout with View More Toggle */}
        <div className='mb-4'>
          {photoUrls?.length > 0 ? (
            <div>
              <img
                src={photoUrls[0]}
                alt={activity.placeName}
                className='w-full h-[200px] object-cover rounded-xl mb-2'
              />
              {photoUrls.length > 1 && (
                <div className='mt-2'>
                  {!showAllPhotos ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAllPhotos(true);
                      }}
                    >
                      View {photoUrls.length - 1} More Images
                    </Button>
                  ) : (
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                      {photoUrls.slice(1).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={'image-' + index}
                          className='w-full h-[120px] object-cover rounded-lg hover:scale-105 transition-all'
                        />
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className='w-full h-full border border-dashed rounded-lg text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAllPhotos(false);
                        }}
                      >
                        Hide
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : isRest ? (
            <div className='w-full h-[200px] rounded-xl mb-2 bg-gradient-to-br from-indigo-500/80 via-purple-600/80 to-pink-500/80 flex flex-col items-center justify-center text-white p-4 shadow-inner relative overflow-hidden group'>
              {/* Decorative backgrounds */}
              <div className='absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700'></div>
              <div className='absolute -left-10 -top-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700'></div>
              
              {/* Cozy/Rest Icon */}
              <div className='relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-3 shadow-lg group-hover:scale-110 transition-transform duration-500'>
                <span className='text-3xl filter drop-shadow-md animate-pulse'>{getRestEmoji()}</span>
              </div>
              <span className='relative z-10 font-bold text-lg tracking-wide drop-shadow-sm'>Rest & Recharge</span>
              <span className='relative z-10 text-xs text-white/80 font-medium tracking-wider uppercase mt-1'>Unwind & Recharge</span>
            </div>
          ) : (
            <img src='/placeholder.jpg' className='w-full h-[200px] object-cover rounded-xl' />
          )}
        </div>

        {/* Content Section */}
        <div>
          <div className='mb-4'>
            <h2 className='font-bold text-lg text-neutral-900 dark:text-white leading-tight mb-2 transition-colors'>
              {activity.placeName}
            </h2>
            <p className='text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed transition-colors'>
              {activity.placeDetails || activity.details}
            </p>

            {/* Hotel Pricing Estimates for Rest Suggestions */}
            {isRest && displayPricing && (
              <div className="mt-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30 px-3 py-2 rounded-lg w-fit transition-all hover:scale-[1.01]">
                <span>🏨 Est. Hotel Cost:</span>
                <span className="text-violet-700 dark:text-violet-300 font-bold font-mono">
                  {displayPricing.priceStr}
                </span>
                <span className="text-[10px] bg-violet-100 dark:bg-violet-900 px-2 py-0.5 rounded-full text-violet-700 dark:text-violet-300 font-medium">
                  {displayPricing.labelStr}
                </span>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between mt-3'>
            <div className='flex flex-wrap gap-3'>
              {isRest && (
                <div className='flex items-center gap-1 bg-violet-100 dark:bg-violet-900/60 border border-violet-200 dark:border-violet-800 px-3 py-1 rounded-full text-xs font-semibold text-violet-700 dark:text-violet-300 transition-colors animate-pulse'>
                  💤 Rest Suggestion
                </div>
              )}
              {activity.time && (
                <div className='flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-200 transition-colors'>
                  ⏱️ {activity.time}
                </div>
              )}
              {activity.ticketPricing && activity.ticketPricing !== 'None' && activity.ticketPricing !== 'Free' && (
                <div className='flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-200 transition-colors'>
                  🎟️ {activity.ticketPricing}
                </div>
              )}
            </div>
          </div>
          <div className='hidden md:block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline mt-4'>
            View on Map ↗
          </div>
        </div>
      </div>
    </Link >
  )
}

export default ItineraryItem;
