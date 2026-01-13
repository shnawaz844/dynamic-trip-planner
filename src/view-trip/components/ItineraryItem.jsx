import React, { useState, useEffect } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Assuming you have this component

function ItineraryItem({ activity }) {
  const [photoUrls, setPhotoUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    activity && GetPlacePhoto();
  }, [activity]);

  const GetPlacePhoto = async () => {
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
      <div className='border rounded-xl shadow-sm hover:shadow-md transition-all bg-transparent dark:bg-transparent border-neutral-200 dark:border-neutral-800 p-4 mb-4'>

        {/* Image Section with Carousel - Full Width on Top */}
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
                        className='w-full h-full border border-dashed rounded-lg text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800' // Make it look like a "Close" tile or just text
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
          </div>

          <div className='flex items-center justify-between mt-3'>
            <div className='flex flex-wrap gap-3'>
              {activity.time && (
                <div className='flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-200 transition-colors'>
                  ⏱️ {activity.time}
                </div>
              )}
              {activity.ticketPricing && (
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
