import React, { forwardRef } from 'react';
import './VideoContainer.scss';

interface VideoContainerProps {
    videoSrc: string;
}

const VideoContainer = forwardRef<HTMLDivElement, VideoContainerProps>(({ videoSrc }, ref) => {
    return (
        <div className="video-container" ref={ref}>
            <video autoPlay loop muted playsInline>
                <source src={videoSrc} type="video/mp4" />
            </video>
        </div>
    );
});

export default VideoContainer;
