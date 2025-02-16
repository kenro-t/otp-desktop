import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
    };
  }
}
import { useTimer } from './hooks/useTimer';
import { TOTPEntry } from './types';
import { TOTPEntryItem } from './components/ui/TOTPEntryItem';

const App = () => {
  const [entries] = useState<TOTPEntry[]>([
    { id: '1', serviceName: 'GitHub Account', code: '852 741' },
    { id: '2', serviceName: 'Google Workspace', code: '390 628' },
  ]);
  const { now, getRemainingTime } = useTimer();

useEffect(() => {
  async function fetchData() {
    const response = await window.electronAPI.ping();
    console.log(response);
  }

  fetchData();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-3">
          {entries.map((entry) => (
            <TOTPEntryItem
              key={entry.id}
              entry={entry}
              remainingTime={getRemainingTime()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;