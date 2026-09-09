import React, { useEffect, useState } from 'react';
import { FlyingSpool } from '../types';
import { ThreadSpool } from './ThreadSpool';

interface BezierFlightLayerProps {
  flights: FlyingSpool[];
  onFlightFinish: (flightId: string) => void;
}

export const BezierFlightLayer: React.FC<BezierFlightLayerProps> = ({
  flights,
  onFlightFinish,
}) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (flights.length === 0) return;

    let animId: number;
    const updateLoop = () => {
      const now = Date.now();
      let hasActive = false;

      flights.forEach((flight) => {
        const elapsed = now - flight.startTime;
        if (elapsed >= flight.duration) {
          onFlightFinish(flight.id);
        } else {
          hasActive = true;
        }
      });

      setTick((t) => t + 1);
      if (hasActive) {
        animId = requestAnimationFrame(updateLoop);
      }
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [flights, onFlightFinish]);

  if (flights.length === 0) return null;

  const now = Date.now();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {flights.map((flight, idx) => {
        const elapsed = Math.max(0, now - flight.startTime);
        const t = Math.min(1, elapsed / flight.duration);

        // Quadratic Bezier Formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const p0x = flight.fromX;
        const p0y = flight.fromY;
        const p2x = flight.toX;
        const p2y = flight.toY;

        // Peak control point with an arch above
        const p1x = (p0x + p2x) / 2;
        const p1y = Math.min(p0y, p2y) - 90; // High arc above both points

        const curX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
        const curY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

        // Rotation along arc
        const rotation = Math.sin(t * Math.PI) * 25;
        const scale = 1 + Math.sin(t * Math.PI) * 0.25;

        return (
          <div
            key={`${flight.id}-${idx}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: `${curX}px`,
              top: `${curY}px`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
            }}
          >
            {/* Thread line trailing from start */}
            <svg
              className="absolute pointer-events-none overflow-visible"
              style={{
                left: '50%',
                top: '50%',
                width: '1px',
                height: '1px',
              }}
            >
              <path
                d={`M ${p0x - curX} ${p0y - curY} Q ${p1x - curX} ${p1y - curY} 0 0`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            </svg>

            {/* In-flight spool */}
            <div className="filter drop-shadow-xl">
              <ThreadSpool color={flight.color} size="md" isTop={true} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
