import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getRegionConfig } from '@/constants/regionConfigs';

const AIPlanner = ( {
    // Region config (new)
    regionConfig = null,
    regionId = 'uae',

    // City search props
    citySearch = "",
    selectedCity = null,
    filteredCities = [],
    onCitySearch = () => { },
    onCitySelect = () => { },

    // Form data props
    formData = {},
    onInputChange = () => { },

    // Button props
    loading = false,
    onGenerateTrip = () => { },

    // Optional props
    containerClassName = "",
    showPopularCities = true
} ) => {
    console.log( regionId, "regionId" );
    // Get region config from prop or ID
    const config = regionConfig || getRegionConfig( regionId );
    const cities = config.cities || [];

    // Get theme classes based on region
    const getThemeClasses = ( type ) => {
        const themeMap = {
            emerald: {
                selectedBg: 'from-emerald-50 to-amber-50 dark:from-emerald-900/20 dark:to-amber-900/20',
                selectedBorder: 'border-emerald-200 dark:border-emerald-800',
                selectedBadge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400',
                link: 'text-emerald-600 dark:text-emerald-400',
                budgetSelected: 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100',
                travelerSelected: 'border-amber-500 bg-amber-50/90 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100',
                badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400',
                button: 'from-emerald-600 to-amber-500 hover:from-emerald-700 hover:to-amber-600',
            },
            sky: {
                selectedBg: 'from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20',
                selectedBorder: 'border-sky-200 dark:border-sky-800',
                selectedBadge: 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-400',
                link: 'text-sky-600 dark:text-sky-400',
                budgetSelected: 'border-sky-500 bg-sky-50/90 dark:bg-sky-900/40 text-sky-900 dark:text-sky-100',
                travelerSelected: 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100',
                badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400',
                button: 'from-sky-600 to-emerald-500 hover:from-sky-700 hover:to-emerald-600',
            },
            blue: {
                selectedBg: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
                selectedBorder: 'border-blue-200 dark:border-blue-800',
                selectedBadge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400',
                link: 'text-blue-600 dark:text-blue-400',
                budgetSelected: 'border-blue-500 bg-blue-50/90 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100',
                travelerSelected: 'border-purple-500 bg-purple-50/90 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100',
                badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-400',
                button: 'from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600',
            },
            orange: {
                selectedBg: 'from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20',
                selectedBorder: 'border-orange-200 dark:border-orange-800',
                selectedBadge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-400',
                link: 'text-orange-600 dark:text-orange-400',
                budgetSelected: 'border-orange-500 bg-orange-50/90 dark:bg-orange-900/40 text-orange-900 dark:text-orange-100',
                travelerSelected: 'border-pink-500 bg-pink-50/90 dark:bg-pink-900/40 text-pink-900 dark:text-pink-100',
                badge: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-400',
                button: 'from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600',
            },
            red: {
                selectedBg: 'from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20',
                selectedBorder: 'border-red-200 dark:border-red-800',
                selectedBadge: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400',
                link: 'text-red-600 dark:text-red-400',
                budgetSelected: 'border-red-500 bg-red-50/90 dark:bg-red-900/40 text-red-900 dark:text-red-100',
                travelerSelected: 'border-blue-500 bg-blue-50/90 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100',
                badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400',
                button: 'from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700',
            },
        };
        return themeMap[ config.theme.primary ]?.[ type ] || themeMap.emerald[ type ];
    };

    // Get city badge text
    const getCityBadge = ( city ) => {
        if ( config.cityBadge === 'country' ) return city.country || config.shortName;
        if ( config.cityBadge === 'state' ) return city.state || config.shortName;
        return config.cityBadge || config.shortName;
    };

    // Get local name based on region config
    const getLocalName = ( city ) => {
        const localLabel = config.localNameLabel;
        return city[ localLabel ] || '';
    };

    return (
        <div className='z-50'>
            <div className="flex flex-col">
                {/* Header */ }
                <div className='w-[60vw] mx-auto text-center'>
                    <h2 className='font-bold text-5xl text-white drop-shadow-xl'>
                        { config.title }
                    </h2>
                    <p className='mt-3 text-neutral-200 text-xl drop-shadow'>
                        { config.description }
                    </p>
                </div>
                {/* Form Container */ }
                <div className={ `mt-10 flex flex-col gap-10 mx-auto max-w-4xl p-8 rounded-xl shadow-2xl bg-white/95 dark:bg-neutral-900/90 backdrop-blur-sm text-neutral-900 dark:text-white transition-colors duration-500 ${ containerClassName }` }>

                    {/* City Search Section */ }
                    <div className="relative">
                        <h2 className='text-xl my-3 font-medium text-neutral-900 dark:text-neutral-100'>
                            { config.questionLabel }
                        </h2>
                        <div className="relative">
                            <Input
                                placeholder={ config.placeholder }
                                value={ citySearch }
                                onChange={ ( e ) => onCitySearch( e.target.value ) }
                                className="text-lg py-6 bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white backdrop-blur-sm"
                            />

                            {/* Selected City Display */ }
                            { selectedCity && (
                                <div className={ `mt-2 p-3 bg-gradient-to-r ${ getThemeClasses( 'selectedBg' ) } rounded-lg border ${ getThemeClasses( 'selectedBorder' ) } backdrop-blur-sm` }>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-lg text-neutral-900 dark:text-white">{ selectedCity.english }</p>
                                            { config.showLocalName && getLocalName( selectedCity ) && (
                                                <p className="text-right text-lg text-neutral-600 dark:text-neutral-400" dir={ config.id === 'uae' ? 'rtl' : 'ltr' }>
                                                    { getLocalName( selectedCity ) }
                                                </p>
                                            ) }
                                        </div>
                                        <span className={ `text-xs ${ getThemeClasses( 'selectedBadge' ) } px-2 py-1 rounded-full` }>Selected</span>
                                    </div>
                                </div>
                            ) }

                            {/* City Suggestions Dropdown */ }
                            { filteredCities.length > 0 && (
                                <div className="absolute min-w-full z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-md w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                                    { filteredCities.map( ( city, index ) => (
                                        <div
                                            key={ index }
                                            onClick={ () => onCitySelect( city ) }
                                            className="px-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-neutral-900 dark:text-white">{ city.english }</p>
                                                    { config.showLocalName && getLocalName( city ) && (
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400" dir={ config.id === 'uae' ? 'rtl' : 'ltr' }>
                                                            { getLocalName( city ) }
                                                        </p>
                                                    ) }
                                                </div>
                                                <span className={ `text-xs ${ getThemeClasses( 'badge' ) } px-2 py-1 rounded` }>
                                                    { getCityBadge( city ) }
                                                </span>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            ) }
                        </div>

                        {/* Popular Cities */ }
                        { showPopularCities && config.popularCities?.length > 0 && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                Popular:
                                { config.popularCities.map( ( cityName, index ) => {
                                    const city = cities.find( c => c.english === cityName );
                                    if ( !city ) return null;
                                    return (
                                        <span key={ index }>
                                            <span
                                                className={ `mx-2 cursor-pointer ${ getThemeClasses( 'link' ) } hover:underline` }
                                                onClick={ () => onCitySelect( city ) }
                                            >
                                                { cityName }
                                            </span>
                                            { index < config.popularCities.length - 1 && '•' }
                                        </span>
                                    );
                                } ) }
                            </p>
                        ) }
                    </div>

                    {/* Days Input Section */ }
                    <div>
                        <h2 className='text-xl my-3 font-medium text-neutral-900 dark:text-neutral-100'>How many days are you planning your trip?</h2>
                        <Input
                            placeholder="Ex. 3 (Max 15 days)"
                            type="number"
                            min="1"
                            max="15"
                            value={ formData?.noOfDays || '' }
                            onChange={ ( e ) => onInputChange( 'noOfDays', e.target.value ) }
                            className="py-6 text-lg bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white backdrop-blur-sm"
                        />
                    </div>

                    {/* Budget Options Section */ }
                    <div>
                        <h2 className='text-xl my-3 font-medium text-neutral-900 dark:text-neutral-100'>
                            { config.budgetLabel }
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
                            { SelectBudgetOptions.map( ( item, index ) => (
                                <div
                                    key={ index }
                                    onClick={ () => onInputChange( 'budget', item.title ) }
                                    className={ `p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-300 backdrop-blur-sm
                    ${ formData?.budget === item.title ?
                                            `shadow-lg ${ getThemeClasses( 'budgetSelected' ) }` :
                                            'border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-white' }
                  `}
                                >
                                    <h2 className='text-4xl mb-3'>{ item.icon }</h2>
                                    <h2 className='font-bold text-lg'>{ item.title }</h2>
                                    <h2 className='text-sm text-neutral-500 dark:text-neutral-400'>{ item.desc }</h2>
                                </div>
                            ) ) }
                        </div>
                    </div>

                    {/* Traveler Options Section */ }
                    <div>
                        <h2 className='text-xl my-3 font-medium text-neutral-900 dark:text-neutral-100'>
                            { config.travelerQuestion }
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mt-5'>
                            { SelectTravelesList.map( ( item, index ) => (
                                <div
                                    key={ index }
                                    onClick={ () => onInputChange( 'traveler', item.people ) }
                                    className={ `p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-300 backdrop-blur-sm
                    ${ formData?.traveler === item.people ?
                                            `shadow-lg ${ getThemeClasses( 'travelerSelected' ) }` :
                                            'border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-white' }
                  `}
                                >
                                    <h2 className='text-4xl mb-3'>{ item.icon }</h2>
                                    <h2 className='font-bold text-lg'>{ item.title }</h2>
                                    <h2 className='text-sm text-neutral-500 dark:text-neutral-400'>{ item.desc }</h2>
                                </div>
                            ) ) }
                        </div>
                    </div>

                    {/* Generate Button Section */ }
                    <div className='mt-10 justify-center flex'>
                        <Button
                            disabled={ loading }
                            onClick={ onGenerateTrip }
                            className={ `bg-gradient-to-r ${ getThemeClasses( 'button' ) } text-white font-semibold px-8 py-6 text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02]` }
                        >
                            { loading ?
                                <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> :
                                <span className="flex items-center gap-2">
                                    ✨ Generate Trip Plan
                                </span>
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPlanner;
