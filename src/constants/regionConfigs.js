/**
 * Region Configurations for Multi-Region Trip Planner
 * Each region contains cities, videos, placeholders, themes, and other region-specific data
 */

// =============================================================================
// UAE REGION
// =============================================================================
export const UAE_CITIES = [
    { english: "Abu Dhabi", arabic: "أبو ظبي" },
    { english: "Dubai", arabic: "دبي" },
    { english: "Sharjah", arabic: "الشارقة" },
    { english: "Ajman", arabic: "عجمان" },
    { english: "Umm Al Quwain", arabic: "أم القيوين" },
    { english: "Ras Al Khaimah", arabic: "رأس الخيمة" },
    { english: "Fujairah", arabic: "الفجيرة" },
    { english: "Al Ain", arabic: "العين" },
    { english: "Liwa Oasis", arabic: "واحة ليوا" },
    { english: "Sir Bani Yas Island", arabic: "جزيرة صير بني ياس" },
    { english: "Yas Island", arabic: "جزيرة ياس" },
    { english: "Saadiyat Island", arabic: "جزيرة السعديات" },
    { english: "Al Marjan Island", arabic: "جزيرة المرجان" },
    { english: "Khor Fakkan", arabic: "خور فكان" },
    { english: "Dibba", arabic: "دبا" },
    { english: "Hatta", arabic: "حتا" },
    { english: "Jebel Ali", arabic: "جبل علي" },
    { english: "Palm Jumeirah", arabic: "نخلة جميرا" },
    { english: "Dubai Marina", arabic: "مرسى دبي" },
    { english: "Jebel Jais", arabic: "جبل جيس" },
    { english: "Mleiha", arabic: "مليحة" },
];

// =============================================================================
// KASHMIR REGION
// =============================================================================
export const KASHMIR_CITIES = [
    { english: "Srinagar", local: "श्रीनगर" },
    { english: "Gulmarg", local: "गुलमर्ग" },
    { english: "Pahalgam", local: "पहलगाम" },
    { english: "Sonmarg", local: "सोनमर्ग" },
    { english: "Leh", local: "लेह" },
    { english: "Ladakh", local: "लद्दाख" },
    { english: "Dal Lake", local: "डल झील" },
    { english: "Nubra Valley", local: "नुब्रा घाटी" },
    { english: "Pangong Lake", local: "पैंगोंग झील" },
    { english: "Kargil", local: "कारगिल" },
    { english: "Hemis", local: "हेमिस" },
    { english: "Patnitop", local: "पटनीटॉप" },
    { english: "Yusmarg", local: "युसमर्ग" },
    { english: "Doodhpathri", local: "दूधपथरी" },
    { english: "Betaab Valley", local: "बेताब घाटी" },
    { english: "Aru Valley", local: "अरु घाटी" },
    { english: "Zanskar Valley", local: "ज़ांस्कर घाटी" },
    { english: "Khardung La", local: "खारदुंग ला" },
    { english: "Tso Moriri", local: "त्सो मोरीरी" },
    { english: "Magnetic Hill", local: "मैग्नेटिक हिल" },
];

// =============================================================================
// EUROPE REGION
// =============================================================================
export const EUROPE_CITIES = [
    { english: "Paris", local: "Paris", country: "France" },
    { english: "Rome", local: "Roma", country: "Italy" },
    { english: "Barcelona", local: "Barcelona", country: "Spain" },
    { english: "Amsterdam", local: "Amsterdam", country: "Netherlands" },
    { english: "Prague", local: "Praha", country: "Czech Republic" },
    { english: "Vienna", local: "Wien", country: "Austria" },
    { english: "London", local: "London", country: "UK" },
    { english: "Santorini", local: "Σαντορίνη", country: "Greece" },
    { english: "Venice", local: "Venezia", country: "Italy" },
    { english: "Florence", local: "Firenze", country: "Italy" },
    { english: "Zurich", local: "Zürich", country: "Switzerland" },
    { english: "Munich", local: "München", country: "Germany" },
    { english: "Lisbon", local: "Lisboa", country: "Portugal" },
    { english: "Dublin", local: "Baile Átha Cliath", country: "Ireland" },
    { english: "Edinburgh", local: "Edinburgh", country: "Scotland" },
    { english: "Nice", local: "Nice", country: "France" },
    { english: "Bruges", local: "Brugge", country: "Belgium" },
    { english: "Copenhagen", local: "København", country: "Denmark" },
    { english: "Stockholm", local: "Stockholm", country: "Sweden" },
    { english: "Berlin", local: "Berlin", country: "Germany" },
];

// =============================================================================
// SOUTHEAST ASIA REGION
// =============================================================================
export const ASIA_CITIES = [
    { english: "Bangkok", local: "กรุงเทพ", country: "Thailand" },
    { english: "Bali", local: "Bali", country: "Indonesia" },
    { english: "Singapore", local: "新加坡", country: "Singapore" },
    { english: "Phuket", local: "ภูเก็ต", country: "Thailand" },
    { english: "Hanoi", local: "Hà Nội", country: "Vietnam" },
    { english: "Ho Chi Minh City", local: "TP Hồ Chí Minh", country: "Vietnam" },
    { english: "Kuala Lumpur", local: "Kuala Lumpur", country: "Malaysia" },
    { english: "Tokyo", local: "東京", country: "Japan" },
    { english: "Kyoto", local: "京都", country: "Japan" },
    { english: "Seoul", local: "서울", country: "South Korea" },
    { english: "Hong Kong", local: "香港", country: "Hong Kong" },
    { english: "Manila", local: "Maynila", country: "Philippines" },
    { english: "Chiang Mai", local: "เชียงใหม่", country: "Thailand" },
    { english: "Siem Reap", local: "សៀមរាប", country: "Cambodia" },
    { english: "Langkawi", local: "Langkawi", country: "Malaysia" },
];

// =============================================================================
// USA REGION
// =============================================================================
export const USA_CITIES = [
    { english: "New York City", state: "New York" },
    { english: "Los Angeles", state: "California" },
    { english: "Miami", state: "Florida" },
    { english: "Las Vegas", state: "Nevada" },
    { english: "San Francisco", state: "California" },
    { english: "Orlando", state: "Florida" },
    { english: "Chicago", state: "Illinois" },
    { english: "Hawaii (Honolulu)", state: "Hawaii" },
    { english: "Grand Canyon", state: "Arizona" },
    { english: "Seattle", state: "Washington" },
    { english: "Boston", state: "Massachusetts" },
    { english: "Washington D.C.", state: "District of Columbia" },
    { english: "New Orleans", state: "Louisiana" },
    { english: "San Diego", state: "California" },
    { english: "Nashville", state: "Tennessee" },
];

// =============================================================================
// REGION CONFIGURATIONS
// =============================================================================
export const REGION_CONFIGS = {
    uae: {
        id: 'uae',
        name: 'United Arab Emirates',
        shortName: 'UAE',
        emoji: '🇦🇪',
        currency: 'AED',
        currencySymbol: 'د.إ',
        theme: {
            primary: 'emerald',
            accent: 'amber',
            gradient: 'from-emerald-600 to-amber-500',
        },
        title: 'Tell us your travel preferences 🏝️🏙️',
        description: 'Just provide some basic information, and our AI trip planner will generate a customized UAE itinerary based on your preferences.',
        placeholder: 'Search UAE destination (e.g. Dubai, Abu Dhabi, Sharjah)',
        questionLabel: 'Where in the UAE would you like to visit?',
        travelerQuestion: 'Who do you plan on traveling with on your UAE adventure?',
        budgetLabel: 'What is Your Budget? (AED)',
        cities: UAE_CITIES,
        popularCities: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Fujairah'],
        videos: [
            '/video/camel.mp4',
            '/video/building123.mp4',
            '/video/desert.mp4',
            '/video/video1.mp4',
            '/video/video2.mp4'
        ],
        locationFormat: (city) => `${city.english} (${city.arabic}), UAE`,
        cityBadge: 'UAE',
        showLocalName: true,
        localNameLabel: 'arabic',
    },

    kashmir: {
        id: 'kashmir',
        name: 'Kashmir & Ladakh',
        shortName: 'Kashmir',
        emoji: '🏔️',
        currency: 'INR',
        currencySymbol: '₹',
        theme: {
            primary: 'sky',
            accent: 'emerald',
            gradient: 'from-sky-600 to-emerald-500',
        },
        title: 'Discover Paradise on Earth 🏔️❄️',
        description: 'Let our AI create a magical journey through the valleys, mountains, and lakes of Kashmir & Ladakh.',
        placeholder: 'Search Kashmir destination (e.g. Srinagar, Gulmarg, Leh)',
        questionLabel: 'Where in Kashmir would you like to explore?',
        travelerQuestion: 'Who will join you on this Himalayan adventure?',
        budgetLabel: 'What is Your Budget? (INR)',
        cities: KASHMIR_CITIES,
        popularCities: ['Srinagar', 'Gulmarg', 'Leh', 'Pahalgam'],
        videos: [
            '/video/kashmir.mp4',
            '/video/kashmir1.mp4',
            '/video/kashmir2.mp4',
            '/video/kashmir3.mp4',
        ],
        fallbackVideos: [
            '/video/kashmir.mp4',
            '/video/kashmir1.mp4',
            '/video/kashmir2.mp4',
            '/video/kashmir3.mp4',
        ],

        locationFormat: (city) => `${city.english}, Kashmir, India`,
        cityBadge: 'Kashmir',
        showLocalName: true,
        localNameLabel: 'local',
    },

    europe: {
        id: 'europe',
        name: 'Europe',
        shortName: 'Europe',
        emoji: '🇪🇺',
        currency: 'EUR',
        currencySymbol: '€',
        theme: {
            primary: 'blue',
            accent: 'purple',
            gradient: 'from-blue-600 to-purple-500',
        },
        title: 'Explore the Heart of Europe 🏰🎭',
        description: 'From romantic Paris to ancient Rome, let AI craft your perfect European adventure.',
        placeholder: 'Search European destination (e.g. Paris, Rome, Barcelona)',
        questionLabel: 'Which European destination catches your eye?',
        travelerQuestion: 'Who will be your travel companions in Europe?',
        budgetLabel: 'What is Your Budget? (EUR)',
        cities: EUROPE_CITIES,
        popularCities: ['Paris', 'Rome', 'Barcelona', 'Amsterdam'],
        videos: [
            '/video/video1.mp4',
            '/video/video2.mp4',
        ],
        fallbackVideos: [
            '/video/video1.mp4',
            '/video/video2.mp4'
        ],
        locationFormat: (city) => `${city.english}, ${city.country}`,
        cityBadge: 'country',
        showLocalName: true,
        localNameLabel: 'local',
    },

    asia: {
        id: 'asia',
        name: 'Southeast Asia',
        shortName: 'Asia',
        emoji: '🌏',
        currency: 'USD',
        currencySymbol: '$',
        theme: {
            primary: 'orange',
            accent: 'pink',
            gradient: 'from-orange-500 to-pink-500',
        },
        title: 'Experience the Magic of Asia 🏯🌴',
        description: 'Discover ancient temples, tropical beaches, and vibrant cities across Southeast Asia.',
        placeholder: 'Search Asian destination (e.g. Bangkok, Bali, Singapore)',
        questionLabel: 'Which Asian destination would you like to explore?',
        travelerQuestion: 'Who will share this Asian adventure with you?',
        budgetLabel: 'What is Your Budget? (USD)',
        cities: ASIA_CITIES,
        popularCities: ['Bangkok', 'Bali', 'Singapore', 'Tokyo'],
        videos: [
            '/video/video1.mp4',
            '/video/video2.mp4',
        ],
        fallbackVideos: [
            '/video/video1.mp4',
            '/video/video2.mp4'
        ],
        locationFormat: (city) => `${city.english}, ${city.country}`,
        cityBadge: 'country',
        showLocalName: true,
        localNameLabel: 'local',
    },

    usa: {
        id: 'usa',
        name: 'United States',
        shortName: 'USA',
        emoji: '🇺🇸',
        currency: 'USD',
        currencySymbol: '$',
        theme: {
            primary: 'red',
            accent: 'blue',
            gradient: 'from-red-500 to-blue-600',
        },
        title: 'Discover the American Dream 🗽🌄',
        description: 'From coast to coast, plan your perfect American road trip or city adventure.',
        placeholder: 'Search USA destination (e.g. New York, Los Angeles, Miami)',
        questionLabel: 'Which US destination is calling you?',
        travelerQuestion: 'Who will join your American adventure?',
        budgetLabel: 'What is Your Budget? (USD)',
        cities: USA_CITIES,
        popularCities: ['New York City', 'Los Angeles', 'Las Vegas', 'Miami'],
        videos: [
            '/video/video1.mp4',
            '/video/video2.mp4',
        ],
        fallbackVideos: [
            '/video/video1.mp4',
            '/video/video2.mp4'
        ],
        locationFormat: (city) => `${city.english}, ${city.state}, USA`,
        cityBadge: 'state',
        showLocalName: false,
        localNameLabel: 'state',
    },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get region config by ID
 * @param {string} regionId - The region ID (e.g., 'uae', 'kashmir')
 * @returns {object} Region configuration object
 */
export const getRegionConfig = (regionId) => {
    return REGION_CONFIGS[regionId?.toLowerCase()] || REGION_CONFIGS.uae;
};

/**
 * Get all available regions for navigation
 * @returns {array} Array of region objects with id, name, emoji
 */
export const getAllRegions = () => {
    return Object.values(REGION_CONFIGS).map(region => ({
        id: region.id,
        name: region.name,
        shortName: region.shortName,
        emoji: region.emoji,
    }));
};

/**
 * Get video source for a region (with fallback)
 * @param {string} regionId - The region ID
 * @returns {string} Video path
 */
export const getRegionVideo = (regionId) => {
    const config = getRegionConfig(regionId);
    const videos = config.videos || [];
    const fallbackVideos = config.fallbackVideos || ['/video/video1.mp4'];

    // Try to get a region-specific video first
    const allVideos = [...videos, ...fallbackVideos];
    const randomIndex = Math.floor(Math.random() * allVideos.length);
    return allVideos[randomIndex];
};

/**
 * Format city for display based on region
 * @param {object} city - City object
 * @param {object} regionConfig - Region config
 * @returns {string} Formatted city string
 */
export const formatCityDisplay = (city, regionConfig) => {
    if (!city) return '';

    if (regionConfig.showLocalName && city[regionConfig.localNameLabel]) {
        return `${city.english} - ${city[regionConfig.localNameLabel]}`;
    }
    return city.english;
};

export default REGION_CONFIGS;
