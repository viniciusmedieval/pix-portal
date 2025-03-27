
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialMinutes: number;
  onExpire?: () => void;
  className?: string;
}

const Timer = ({ initialMinutes, onExpire, className }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={cn("timer-container", className, { "text-red-500": timeLeft < 300 })}>
      {isExpired ? (
        <div className="text-red-500 font-bold">Oferta expirada!</div>
      ) : (
        <>
          {hours > 0 && (
            <div className="timer-box">
              <span className="timer-value">{hours.toString().padStart(2, "0")}</span>
              <span className="timer-label">HORAS</span>
            </div>
          )}
          <div className="timer-box">
            <span className="timer-value">{minutes.toString().padStart(2, "0")}</span>
            <span className="timer-label">MIN</span>
          </div>
          <span className="text-black">:</span>
          <div className="timer-box">
            <span className="timer-value">{seconds.toString().padStart(2, "0")}</span>
            <span className="timer-label">SEG</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Timer;
