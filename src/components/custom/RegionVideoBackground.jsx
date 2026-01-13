import React, { useEffect, useRef, useState } from 'react';
import { getRegionConfig, getRegionVideo } from '@/constants/regionConfigs';

/**
 * RegionVideoBackground Component
 * Displays a dynamic video background based on the selected region
 * 
 * @param {string} regionId - The region ID (e.g., 'uae', 'kashmir', 'europe')
 * @param {string} className - Additional CSS classes
 * @param {string} overlayClassName - Custom overlay classes
 * @param {boolean} blur - Whether to apply blur effect
 * @param {number} opacity - Overlay opacity (0-1)
 */
const RegionVideoBackground = ({
    regionId = 'uae',
    className = '',
    overlayClassName = '',
    blur = true,
    opacity = 0.3,
}) => {
    const videoRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const regionConfig = getRegionConfig(regionId);

    // Select random video on mount or region change
    useEffect(() => {
        setIsLoaded(false);
        setHasError(false);
        const video = getRegionVideo(regionId);
        setSelectedVideo(video);
    }, [regionId]);

    // Handle video load error - fallback to default videos
    const handleVideoError = () => {
        setHasError(true);
        // Try fallback videos
        const fallbackVideos = regionConfig.fallbackVideos || ['/video/video1.mp4', '/video/video2.mp4'];
        const randomFallback = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)];
        if (selectedVideo !== randomFallback) {
            setSelectedVideo(randomFallback);
            setHasError(false);
        }
    };

    const handleVideoLoaded = () => {
        setIsLoaded(true);
    };

    // Get theme-based gradient for overlay
    const getThemeGradient = () => {
        const { theme } = regionConfig;
        const gradientMap = {
            emerald: 'from-emerald-900/20 via-transparent to-amber-900/20',
            sky: 'from-sky-900/20 via-transparent to-emerald-900/20',
            blue: 'from-blue-900/20 via-transparent to-purple-900/20',
            orange: 'from-orange-900/20 via-transparent to-pink-900/20',
            red: 'from-red-900/20 via-transparent to-blue-900/20',
        };
        return gradientMap[theme.primary] || gradientMap.emerald;
    };

    return (
        <div className={`fixed inset-0 z-0 overflow-hidden ${className}`}>
            {/* Video Element */}
            {selectedVideo && !hasError && (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                    className={`
            absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto 
            transform -translate-x-1/2 -translate-y-1/2 object-cover 
            transition-opacity duration-1000
            ${blur ? 'blur-sm scale-110' : ''}
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
                    key={selectedVideo}
                >
                    <source src={selectedVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Loading/Error Fallback Background */}
            {(!isLoaded || hasError) && (
                <div
                    className={`
            absolute inset-0 
            bg-gradient-to-br ${regionConfig.theme.gradient}
            animate-pulse
          `}
                />
            )}

            {/* Dark Overlay */}
            <div
                className={`absolute inset-0 backdrop-blur-sm ${overlayClassName}`}
                style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
            />

            {/* Theme-based Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getThemeGradient()}`} />
        </div>
    );
};

export default RegionVideoBackground;
