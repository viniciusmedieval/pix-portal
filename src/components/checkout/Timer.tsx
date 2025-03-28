
import { useEffect, useState } from 'react';

interface TimerProps {
  minutes: number;
  text?: string;
}

const Timer = ({ minutes, text = "Oferta expira em:" }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedEndTime = localStorage.getItem('checkout_timer_end');
    if (storedEndTime) {
      const remaining = Math.max(0, Math.floor((parseInt(storedEndTime) - Date.now()) / 1000));
      return remaining > 0 ? remaining : minutes * 60;
    }
    return minutes * 60;
  });

  useEffect(() => {
    // Set end time in localStorage if not already set
    if (!localStorage.getItem('checkout_timer_end')) {
      const endTime = Date.now() + (minutes * 60 * 1000);
      localStorage.setItem('checkout_timer_end', endTime.toString());
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black text-white py-2 text-center">
      <p className="text-sm font-medium">
        {text} <span className="font-bold">{formatTime(timeLeft)}</span>
      </p>
    </div>
  );
};

export default Timer;
