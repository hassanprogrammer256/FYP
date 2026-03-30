import { useState, useEffect } from 'react';
import { Box } from '@mui/joy';
import Spinner from './spinner';

function Loading() {
  const [progress, setProgress] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [message, setMessage] = useState('Loading...');
  const [color, setColor] = useState('primary'); // default color

  useEffect(() => {
    // Simulate progress increase based on data fetch
    if (progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 2, 100); // incremental progress
          return newProgress;
        });
        setWaitingTime(prev => prev + 1); // track waiting time in seconds
      }, 100); // faster updates for smoother progress

      return () => clearInterval(timer);
    } else {
      // When progress reaches 100%, finalize message
      if (waitingTime < 5) {
        setMessage('Almost there...');
        setColor('info');
      } else if (waitingTime >= 5 && waitingTime < 15) {
        setMessage('Waiting a bit longer...');
        setColor('warning');
      } else {
        setMessage('Still loading, please wait...');
        setColor('error');
      }
    }
  }, [progress, waitingTime]);

  // Change message based on progress percentage
  useEffect(() => {
    if (progress < 20) {
      setMessage('Initializing...');
      setColor('danger');
    } else if (progress >= 20 && progress < 50) {
      setMessage('Fetching data...');
      setColor('warning');
    } else if (progress >= 50 && progress < 80) {
      setMessage('Processing...');
      setColor('primary');
    } else if (progress >= 80 && progress < 100) {
      setMessage('Almost there...');
      setColor('success');
    }
  }, [progress]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.8)', // semi-transparent overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        flexDirection: 'column',
      }}
    >
      {/* Spinner with dynamic message and color */}
      <Spinner message={`${Math.round(progress)}% - ${message}`} size="lg" color={color} />
    </Box>
  );
}

export default Loading;