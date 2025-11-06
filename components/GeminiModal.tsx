
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import LoadingSpinner from './icons/LoadingSpinner';

interface GeminiModalProps {
  isOpen: boolean;
  isLoading: boolean;
  content: string;
  onClose: () => void;
}

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, isLoading, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        {isLoading ? (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Đang liên hệ với Trợ lý AI...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Vui lòng chờ trong giây lát.</p>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none text-slate-800 dark:text-slate-200">
             <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiModal;
