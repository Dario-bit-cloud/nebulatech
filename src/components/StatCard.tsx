'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  color: string;
  className?: string;
  description?: string;
}

const StatCard = ({ title, value, unit, icon, color, className = '', description }: StatCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1 transition-colors duration-300`}>
            {value}{unit && <span className="text-lg">{unit}</span>}
          </p>
        </div>
        <div className={`text-3xl ${color} transition-transform duration-300 hover:scale-110`}>{icon}</div>
      </div>
      {description && (
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
};

export default StatCard;