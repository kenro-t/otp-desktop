import { useEffect, useState } from 'react'

import { TOTPEntryItem } from './components/ui/TOTPEntryItem'
import { Modal } from './components/ui/Modal'
import { useTimer } from './hooks/useTimer'
import { TOTPEntry } from './types'
import plusIcon from '../../../resources/plus.svg'

function App(): JSX.Element {
  const [entries, setEntries] = useState<TOTPEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { timeKey, getRemainingTime } = useTimer()

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
            <TOTPEntryItem
              key={entry.id}
              entry={entry}
              remainingTime={getRemainingTime()}
              timeKey={timeKey}
            />
          ))}
        </div>
      </div>
      <img
        className="w-15 fixed right-5 bottom-10 cursor-pointer bg-white rounded-full"
        src={plusIcon}
        alt="plusIcon"
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default App
