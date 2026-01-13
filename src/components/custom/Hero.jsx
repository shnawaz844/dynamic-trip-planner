import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link, useParams } from 'react-router-dom'
import { Sparkles, MapPin, ShieldCheck } from 'lucide-react'
import { getRegionConfig } from '../../constants/regionConfigs'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi'

// Region-specific hero configurations
const HERO_CONTENT = {
  uae: {
    flagColors: ['bg-red-500', 'bg-green-600', 'bg-neutral-200 dark:bg-white border dark:border-none', 'bg-neutral-800 dark:bg-black'],
    backgroundGradient1: 'from-emerald-100/10 dark:from-emerald-100/20 to-amber-100/10 dark:to-amber-100/20',
    backgroundGradient2: 'from-red-100/10 dark:from-red-100/15 to-yellow-100/10 dark:to-yellow-100/15',
    headingLine1: 'Discover Your Next',
    headingLine2: 'Arabian Adventure',
    headingLine3: 'with AI Precision',
    headingGradient: 'from-emerald-600 via-yellow-500 to-red-600',
    subtitle: 'From the dunes of Liwa to the shores of Fujairah, your personal AI travel curator crafts',
    localWord: 'مخصص',
    localWordMeaning: 'custom',
    coverageBadge: 'UAE-Wide Coverage',
    welcomeLocal: 'مرحبًا بك في الإمارات العربية المتحدة',
    welcomeEnglish: 'Welcome to the United Arab Emirates',
    imageBadge: 'Experience the UAE Like Never Before',
    buttonGradient: 'from-emerald-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600',
    borderGradient: 'from-emerald-500 via-amber-400 to-red-500',
    badgeGradient: 'from-emerald-600 to-amber-500',
    heroImage: '/landing2.png',
  },
  kashmir: {
    flagColors: ['bg-sky-500', 'bg-emerald-600', 'bg-white', 'bg-sky-700'],
    backgroundGradient1: 'from-sky-100/10 dark:from-sky-100/20 to-emerald-100/10 dark:to-emerald-100/20',
    backgroundGradient2: 'from-blue-100/10 dark:from-blue-100/15 to-teal-100/10 dark:to-teal-100/15',
    headingLine1: 'Discover Paradise',
    headingLine2: 'On Earth',
    headingLine3: 'with AI Precision',
    headingGradient: 'from-sky-600 via-teal-500 to-emerald-600',
    subtitle: 'From the valleys of Gulmarg to the serene Dal Lake, your personal AI travel curator crafts',
    localWord: 'जन्नत',
    localWordMeaning: 'heaven',
    coverageBadge: 'Kashmir-Wide Coverage',
    welcomeLocal: 'कश्मीर में आपका स्वागत है',
    welcomeEnglish: 'Welcome to Kashmir - Paradise on Earth',
    imageBadge: 'Experience Kashmir Like Never Before',
    buttonGradient: 'from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600',
    borderGradient: 'from-sky-500 via-teal-400 to-emerald-500',
    badgeGradient: 'from-sky-600 to-emerald-500',
    heroImage: '/landing2.png',
  },
  europe: {
    flagColors: ['bg-blue-600', 'bg-yellow-400', 'bg-blue-600', 'bg-yellow-400'],
    backgroundGradient1: 'from-blue-100/10 dark:from-blue-100/20 to-purple-100/10 dark:to-purple-100/20',
    backgroundGradient2: 'from-indigo-100/10 dark:from-indigo-100/15 to-pink-100/10 dark:to-pink-100/15',
    headingLine1: 'Explore the Heart of',
    headingLine2: 'Europe',
    headingLine3: 'with AI Precision',
    headingGradient: 'from-blue-600 via-indigo-500 to-purple-600',
    subtitle: 'From the romance of Paris to the canals of Venice, your personal AI travel curator crafts',
    localWord: 'magnifique',
    localWordMeaning: 'magnificent',
    coverageBadge: 'Europe-Wide Coverage',
    welcomeLocal: 'Bienvenue en Europe',
    welcomeEnglish: 'Welcome to Europe',
    imageBadge: 'Experience Europe Like Never Before',
    buttonGradient: 'from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600',
    borderGradient: 'from-blue-500 via-indigo-400 to-purple-500',
    badgeGradient: 'from-blue-600 to-purple-500',
    heroImage: '/landing2.png',
  },
  asia: {
    flagColors: ['bg-orange-500', 'bg-pink-500', 'bg-orange-500', 'bg-pink-500'],
    backgroundGradient1: 'from-orange-100/10 dark:from-orange-100/20 to-pink-100/10 dark:to-pink-100/20',
    backgroundGradient2: 'from-red-100/10 dark:from-red-100/15 to-rose-100/10 dark:to-rose-100/15',
    headingLine1: 'Experience the Magic of',
    headingLine2: 'Southeast Asia',
    headingLine3: 'with AI Precision',
    headingGradient: 'from-orange-500 via-red-500 to-pink-600',
    subtitle: 'From the temples of Bangkok to the beaches of Bali, your personal AI travel curator crafts',
    localWord: 'สวย',
    localWordMeaning: 'beautiful',
    coverageBadge: 'Asia-Wide Coverage',
    welcomeLocal: 'ยินดีต้อนรับสู่เอเชีย',
    welcomeEnglish: 'Welcome to Southeast Asia',
    imageBadge: 'Experience Asia Like Never Before',
    buttonGradient: 'from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600',
    borderGradient: 'from-orange-500 via-red-400 to-pink-500',
    badgeGradient: 'from-orange-500 to-pink-500',
    heroImage: '/landing2.png',
  },
  usa: {
    flagColors: ['bg-red-600', 'bg-white border', 'bg-blue-700', 'bg-white border'],
    backgroundGradient1: 'from-red-100/10 dark:from-red-100/20 to-blue-100/10 dark:to-blue-100/20',
    backgroundGradient2: 'from-blue-100/10 dark:from-blue-100/15 to-red-100/10 dark:to-red-100/15',
    headingLine1: 'Discover the',
    headingLine2: 'American Dream',
    headingLine3: 'with AI Precision',
    headingGradient: 'from-red-600 via-white via-50% to-blue-600',
    subtitle: 'From the lights of New York to the beaches of California, your personal AI travel curator crafts',
    localWord: 'awesome',
    localWordMeaning: 'amazing',
    coverageBadge: 'USA-Wide Coverage',
    welcomeLocal: 'Welcome to America!',
    welcomeEnglish: 'Land of the Free, Home of the Brave',
    imageBadge: 'Experience the USA Like Never Before',
    buttonGradient: 'from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700',
    borderGradient: 'from-red-500 via-white to-blue-500',
    badgeGradient: 'from-red-600 to-blue-600',
    heroImage: '/landing2.png',
  },
}

function Hero() {
  const { regionId } = useParams()
  const regionConfig = getRegionConfig(regionId)
  const heroContent = HERO_CONTENT[regionConfig.id] || HERO_CONTENT.uae
  const createTripPath = regionId ? `/${regionId}/create-trip` : '/create-trip'

  const [photoUrl, setPhotoUrl] = useState(heroContent.heroImage)

  useEffect(() => {
    if (regionConfig) {
      GetHeroPhoto()
    }
  }, [regionId])

  const GetHeroPhoto = async () => {
    // Pick a random popular city to get iconic landmarks
    const popularCities = regionConfig.popularCities || [];
    const randomCity = popularCities.length > 0
      ? popularCities[Math.floor(Math.random() * popularCities.length)]
      : regionConfig.name;

    const query = `${randomCity} ${regionConfig.name} iconic landmark landscape tourism`;

    const data = {
      textQuery: query
    }

    try {
      const resp = await GetPlaceDetails(data);
      const place = resp.data.places[0];

      if (place && place.photos && place.photos.length > 0) {
        // Try to pick a photo that likely has high res (usually later ones are more varied, or just take index 0/1/2)
        // We'll pick a random one from the first 5 to get varied results on reload
        const photoIndex = Math.floor(Math.random() * Math.min(place.photos.length, 6));
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', place.photos[photoIndex].name);
        setPhotoUrl(PhotoUrl);
      } else {
        setPhotoUrl(heroContent.heroImage);
      }
    } catch (err) {
      console.error("Error fetching hero photo:", err);
      setPhotoUrl(heroContent.heroImage);
    }
  }

  return (
    <div className='relative flex flex-col items-center px-4 md:px-8 lg:px-20 gap-8 md:gap-12 pt-12 md:pt-20 pb-8 md:pb-16 bg-white dark:bg-black transition-colors duration-500'>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className={`absolute top-10 left-10 w-72 h-72 bg-gradient-to-br ${heroContent.backgroundGradient1} rounded-full blur-3xl opacity-50 dark:opacity-100`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr ${heroContent.backgroundGradient2} rounded-full blur-3xl opacity-50 dark:opacity-100`}></div>
      </div>

      {/* Flag Color Accent */}
      <div className="flex gap-2 mb-2">
        {heroContent.flagColors.map((color, index) => (
          <div key={index} className={`w-8 h-2 ${color} rounded-full`}></div>
        ))}
      </div>

      {/* Main Heading */}
      <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl text-center leading-tight transition-colors duration-300">
        <span className="block text-neutral-900 dark:text-white">{heroContent.headingLine1}</span>
        <span className={`bg-gradient-to-r ${heroContent.headingGradient} bg-clip-text text-transparent`}>
          {heroContent.headingLine2}
        </span>
        <span className="block text-neutral-900 dark:text-white mt-2">{heroContent.headingLine3}</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-neutral-600 dark:text-gray-100 text-center max-w-3xl leading-relaxed transition-colors duration-300">
        {heroContent.subtitle}{' '}
        <span className="text-amber-600 font-semibold italic">{heroContent.localWord}</span>{' '}
        ({heroContent.localWordMeaning}) experiences tailored to your{' '}
        <span className="text-emerald-600 font-semibold">interests</span> and
        <span className="text-amber-600 font-semibold"> budget</span>.
      </p>

      {/* Highlights */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4">
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full shadow-sm dark:shadow-lg transition-all">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-200">{heroContent.coverageBadge}</span>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full shadow-sm dark:shadow-lg transition-all">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-200">AI-Curated Plans</span>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full shadow-sm dark:shadow-lg transition-all">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span className="text-sm md:text-base font-medium text-neutral-700 dark:text-neutral-200">Premium Experiences</span>
        </div>
      </div>

      {/* Call to Action */}
      <Link to={createTripPath} className="mt-4">
        <Button className={`group relative overflow-hidden bg-gradient-to-r ${heroContent.buttonGradient} text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          Begin Your Journey - It's Free
          <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
        </Button>
      </Link>

      {/* Welcome Text */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
          {heroContent.welcomeLocal}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm">
          {heroContent.welcomeEnglish}
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative mt-8 md:mt-12 max-w-5xl w-full">
        <div className={`absolute -inset-1 bg-gradient-to-r ${heroContent.borderGradient} rounded-2xl blur opacity-20 dark:opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
        <div className="relative rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-neutral-900">
          <img
            src={photoUrl}
            alt={`${regionConfig.name} Adventure`}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
            onError={(e) => {
              e.target.src = '/landing2.png';
            }}
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${heroContent.badgeGradient} text-white px-6 py-2 rounded-full shadow-lg`}>
          <span className="font-semibold">{heroContent.imageBadge}</span>
        </div>
      </div>
    </div>
  )
}

export default Hero