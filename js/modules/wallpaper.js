// Wallpaper Video Module
export function initVideoBackground() {
    updateDayNightVideo();
    setInterval(updateDayNightVideo, 60000);
}

function updateDayNightVideo() {
    const videoEl = document.getElementById('bg-video');
    const now = new Date();
    const hour = now.getHours();
    
    // --- CONFIGURATION ---
    // Change these values to set when "Day" starts/ends
    const startDayHour = 7;  // 7 AM
    const endDayHour = 18;   // 6 PM

    // Change these paths to your video files
    const dayVideo = 'img/vid/day.webm';
    const nightVideo = 'img/vid/night.webm';
    // ---------------------

    const isDay = hour >= startDayHour && hour < endDayHour;
    
    const currentSrc = videoEl.getAttribute('src');
    const targetSrc = isDay ? dayVideo : nightVideo;
    
    if (!currentSrc || !currentSrc.includes(targetSrc)) {
        videoEl.src = targetSrc;
    }
}
