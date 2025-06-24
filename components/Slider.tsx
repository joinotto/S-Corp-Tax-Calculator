
import React from 'react';

interface SliderProps {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({ id, min, max, step, value, onChange, formatLabel }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="w-full relative"> {/* Outer container is relative */}
      {/* Value Display Bubble */}
      <div
        className="absolute px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded transform -translate-x-1/2"
        style={{
          left: `${percentage}%`,
          top: '2px', // Position bubble near the top of the space created by input's margin-top
        }}
      >
        {formatLabel ? formatLabel(value) : value}
        {/* Arrow pointing down from the bubble */}
        <div
          className="absolute w-2 h-2 bg-blue-500 transform rotate-45 -translate-x-1/2"
          style={{ left: '50%', bottom: '-4px' }}
        ></div>
      </div>

      {/* Slider Input */}
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        // Added mt-8 (32px) to ensure enough space for the bubble.
        // Bubble + arrow is ~28px high. top: '2px' means it occupies 2px to 30px.
        // mt-8 provides a 2px gap between arrow tip and slider track.
        className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-8"
      />
    </div>
  );
};
