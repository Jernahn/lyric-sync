import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  animated = true,
}) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      {label && <label className="text-sm font-semibold mb-2 block">{label}</label>}
      <div className="bg-gray-800 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-spotify to-green-500"
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.3 } : { duration: 0 }}
        />
      </div>
    </div>
  );
};
