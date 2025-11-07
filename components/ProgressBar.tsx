
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  helperText?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label, helperText }) => {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200/80 shadow-inner dark:bg-slate-700/80"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export default ProgressBar;
