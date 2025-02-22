import { useState } from 'react'

import { TOTPEntryItem } from './components/ui/TOTPEntryItem'
import { useTimer } from './hooks/useTimer'
import { TOTPEntry } from './types'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [entries] = useState<TOTPEntry[]>([
    { id: '1', serviceName: 'GitHub Account', code: '852 741' },
    { id: '2', serviceName: 'Google Workspace', code: '390 628' }
  ])
  const { now, getRemainingTime } = useTimer()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-3">
          {entries.map((entry) => (
            <TOTPEntryItem key={entry.id} entry={entry} remainingTime={getRemainingTime()} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
