import { useEffect, useState } from 'react'

import { TOTPEntryItem } from './components/ui/TOTPEntryItem'
import { useTimer } from './hooks/useTimer'
import { TOTPEntry } from './types'

function App(): JSX.Element {
  const [entries, setEntries] = useState<TOTPEntry[]>([])
  const { now, getRemainingTime } = useTimer()

  useEffect(() => {
    const getAccounts = window.electron.ipcRenderer.on('accounts', (_, account) => {
      setEntries(account)
    })
    return () => getAccounts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-3">
          {entries.map((entry) => (
            <TOTPEntryItem key={entry.id} entry={entry} remainingTime={getRemainingTime()} now={now} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
