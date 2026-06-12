import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Check if API key exists
if ( !API_KEY ) {
    console.error( 'Google Places API key is missing. Please add VITE_GOOGLE_PLACES_API_KEY to your .env file' );
}

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
            'places.photos',
            'places.displayName',
            'places.id',
            'places.formattedAddress', // Added for address
            'places.location', // Added for coordinates
            'places.rating' // Added for rating
        ]
    }
}

// Helper function to search Wikimedia/Wikipedia for a place image
const getWikipediaImage = async (placeName) => {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(placeName)}&utf8=&format=json&origin=*`;
  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const title = searchData.query?.search?.[0]?.title;
    if (!title) return null;
    
    const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1000&origin=*`;
    const res = await fetch(imgUrl);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const pageId in pages) {
        if (pages[pageId].thumbnail?.source) {
          return pages[pageId].thumbnail.source;
        }
      }
    }
  } catch (err) {
    console.error("Wiki fallback image fetch error for", placeName, err);
  }
  return null;
};

export const GetPlaceDetails = async ( data ) => {
  try {
    const resp = await axios.post( BASE_URL, data, config );
    // Map photos to their full URL so components can use them directly
    if (resp.data?.places) {
      resp.data.places = resp.data.places.map(place => {
        if (place.photos && place.photos.length > 0) {
          place.photos = place.photos.map(photo => ({
            ...photo,
            name: `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=4000&maxWidthPx=4000&key=${API_KEY}`
          }));
        }
        return place;
      });
    }
    return resp;
  } catch (error) {
    console.warn("Google Places API error, attempting Wikimedia fallback...", error);
    try {
      const fallbackImage = await getWikipediaImage(data.textQuery);
      if (fallbackImage) {
        // Return structured mock response matching Google Places format
        return {
          data: {
            places: [
              {
                photos: [
                  { name: fallbackImage },
                  { name: fallbackImage },
                  { name: fallbackImage },
                  { name: fallbackImage },
                  { name: fallbackImage }
                ]
              }
            ]
          }
        };
      }
    } catch (fallbackError) {
      console.error("Wikimedia fallback failed:", fallbackError);
    }
    throw error;
  }
}

export const PHOTO_REF_URL = '{NAME}'