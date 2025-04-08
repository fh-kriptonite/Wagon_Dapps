import React, { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface ExpiredTimerProps {
    targetEpoch: number;
}

export default function ExpiredTimer({ targetEpoch }: ExpiredTimerProps) {
    const calculateTimeLeft = (): TimeLeft => {
        if (targetEpoch === 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }

        const difference = targetEpoch - Date.now();
        let timeLeft: TimeLeft;

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

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        if (targetEpoch === 0) return;

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [targetEpoch]);

    const { days, hours, minutes, seconds } = timeLeft;

    return (
        <div className="flex gap-1 text-xs font-semibold">
            {days > 0 && <p>{days ? days : "00"} days, </p>}
            <p className="text-xs">{hours ? hours.toString().padStart(2, '0') : "00"}</p>
            <p className="text-xs">:</p>
            <p className="text-xs">{minutes ? minutes.toString().padStart(2, '0') : "00"}</p>
            <p className="text-xs">:</p>
            <p className="text-xs">{seconds ? seconds.toString().padStart(2, '0') : "00"}</p>
        </div>
    );
} 