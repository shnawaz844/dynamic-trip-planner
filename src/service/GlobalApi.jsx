import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Check if API key exists
if (!API_KEY) {
    console.error('Google Places API key is missing. Please add VITE_GOOGLE_PLACES_API_KEY to your .env file');
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

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config)

export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=4000&maxWidthPx=4000&key=' + API_KEY