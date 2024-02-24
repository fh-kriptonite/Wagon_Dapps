import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetEpoch }){
  const calculateTimeLeft = () => {
    if (targetEpoch === 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const difference = targetEpoch * 1000 - Date.now();
    let timeLeft = {};

    if (difference <= 0) {
      // If difference is negative or zero, display 0:0:0
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (targetEpoch === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const { days, hours, minutes, seconds } = timeLeft;


  return (
    <div className="flex justify-between itesm-center">
      <p className="text-sm">Crowdfund end in</p>
      <div className="flex gap-1">
        {days > 0 && <p className="text-sm font-semibold">{days ? days : "00"} days</p>}
        <p className="text-sm font-semibold">{hours? hours.toString().padStart(2, '0') : "00"}</p>
        <p className="text-sm font-semibold">:</p>
        <p className="text-sm font-semibold">{minutes ? minutes.toString().padStart(2, '0') : "00"}</p>
        <p className="text-sm font-semibold">:</p>
        <p className="text-sm font-semibold">{seconds ? seconds.toString().padStart(2, '0') : "00"}</p>
      </div>
    </div>
  );
};
