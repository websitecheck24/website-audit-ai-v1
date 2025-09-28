import React from 'react';

interface ScoreGaugeProps {
  score: number;
  title: string;
}

const getScoreColorClasses = (score: number) => {
  if (score >= 90) {
    return {
      stroke: 'stroke-green-500',
      text: 'text-green-600',
      bg: 'bg-green-50'
    };
  }
  if (score >= 50) {
    return {
      stroke: 'stroke-yellow-500',
      text: 'text-yellow-600',
      bg: 'bg-yellow-50'
    };
  }
  return {
    stroke: 'stroke-red-500',
    text: 'text-red-600',
    bg: 'bg-red-50'
  };
};

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, title }) => {
  const size = 120;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const { stroke, text, bg } = getScoreColorClasses(score);

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 ${bg} space-y-2`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="text-gray-200"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
          <circle
            className={`${stroke} transition-all duration-1000 ease-in-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${text}`}>
          {score}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-700 text-center">{title}</p>
    </div>
  );
};