
import React from "react";

interface RangeSelectorProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  label,
  value,
  min,
  max,
  onChange,
  unit = "",
}) => {
  return (
    <div className="flex gap-4 items-center">
      <label htmlFor={label.toLowerCase()} className="text-sm">{label}</label>
      <input
        id={label.toLowerCase()}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-black"
      />
      <span>{value}{unit && ` ${unit}`}</span>
    </div>
  );
};

export default RangeSelector;
