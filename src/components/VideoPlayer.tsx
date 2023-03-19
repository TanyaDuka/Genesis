import React, { FC, useEffect, useRef, useState } from "react";

import { Button, Box } from '@mui/material';

import Hls from "hls.js";


interface VideoItemProps {
  link: string;
}

const VideoPlayer: FC<VideoItemProps> = ({ link }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);


  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const hls = new Hls();
    hls.loadSource(link);
    hls.attachMedia(video);
   
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      hls.destroy();
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [link]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };


  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handlePictureInPicture = () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      videoRef.current.requestPictureInPicture();
    }
  };

  const handleSaveProgress = () => {
    if (!videoRef.current) return;
    localStorage.setItem(link, JSON.stringify(videoRef.current.currentTime));
  };

  const handleResumePlayback = () => {
    if (!videoRef.current) return;
    const progress = localStorage.getItem(link);
    if (progress) {
      videoRef.current.currentTime = JSON.parse(progress);
    }
  };

  return (
    <div className="video-player">
      <video ref={videoRef} width="350px" height="auto" controls></video>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
        <Button variant="contained" onClick={() => handlePlaybackRateChange(1)}>1x</Button>
        <Button variant="contained" onClick={() => handlePlaybackRateChange(1.5)}>1.5x</Button>
        <Button variant="contained" onClick={() => handlePlaybackRateChange(2)}>2x</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Button variant="contained" size="small" onClick={handlePictureInPicture}>Picture-in-picture</Button>
        <Button variant="contained" size="small" onClick={handleSaveProgress}>Save Progress</Button>
        <Button variant="contained" size="small" onClick={handleResumePlayback}>Resume Playback</Button>
      </Box>
      <Box sx={{ mt: 2, fontWeight: 'bold' }}>Time: {currentTime.toFixed(1)}</Box>
    </div>
  )
};

export default VideoPlayer;
