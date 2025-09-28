import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  status?: boolean; // true for pass, false for fail
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, status }) => {
  const valueColor = status === true ? 'text-green-600' : status === false ? 'text-red-600' : 'text-gray-900';

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            {status !== undefined && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status ? 'PASS' : 'FAIL'}
                </span>
            )}
        </div>
        <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      </div>
      {description && <p className="text-xs text-gray-600 mt-2">{description}</p>}
    </div>
  );
};