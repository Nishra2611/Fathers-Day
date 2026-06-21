import { useState, useEffect } from 'react';

export const useMicrophoneVolume = (threshold: number = 50) => {
  const [isBlowing, setIsBlowing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let stream: MediaStream;
    let requestFrame: number;

    const initAudio = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        microphone.connect(analyser);
        
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          
          if (average > threshold) {
            setIsBlowing(true);
          } else {
            setIsBlowing(false);
          }
          
          requestFrame = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch (err) {
        console.error('Error accessing microphone', err);
        setHasPermission(false);
      }
    };

    initAudio();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
      if (requestFrame) cancelAnimationFrame(requestFrame);
    };
  }, [threshold]);

  return { isBlowing, hasPermission };
};
