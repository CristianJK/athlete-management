interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto shadow-lg shadow-rose-950/10 my-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 text-rose-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="py-1.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold rounded-lg transition duration-200 cursor-pointer"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
