import { TOTPEntry } from '../../types';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

type TOTPEntryItemProps = {
  entry: TOTPEntry;
  remainingTime: number;
};

export const TOTPEntryItem = ({ entry, remainingTime }: TOTPEntryItemProps) => {
  const { handleCopy } = useCopyToClipboard();

  return (
    <div className="transform rounded-lg bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {entry.serviceName}
        </h3>
        <button
          onClick={() => handleCopy(entry.token)}
          className="text-gray-500 hover:text-blue-500"
          aria-label="Copy"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      <div className="font-mono text-2xl font-bold tracking-wider text-blue-600">
        {entry.token}
      </div>

      <div className="mt-3 h-1 rounded bg-blue-100">
        <div
          className="h-full rounded bg-blue-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(remainingTime / 30) * 100}%` }}
        />
      </div>
    </div>
  );
};