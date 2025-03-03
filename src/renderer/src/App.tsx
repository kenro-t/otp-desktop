import { useEffect, useState, useRef } from 'react'

import { TOTPEntryItem } from './components/ui/TOTPEntryItem'
import { RegisterAccountModal } from './components/ui/RegisterAccountModal'
import { UnregisterAccountModal } from './components/ui/UnregisterAccountModal'
import { HamburgerMenu } from './components/ui/HamburgerMenu'
import { useTimer } from './hooks/useTimer'
import { TOTPEntry } from './types'
import checkIcon from '../../../resources/check.svg'
import menuIcon from '../../../resources/menu.svg'

function App(): JSX.Element {
  const [entries, setEntries] = useState<TOTPEntry[]>([])
  const [isResisterOpen, setIsResisterOpen] = useState<boolean>(false)
  const [isUnresisterOpen, setIsUnresisterOpen] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isUnregister, setIsUnregister] = useState<boolean>(false)
  const { timeKey, getRemainingTime } = useTimer()
  const menuRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const getAccounts = window.electron.ipcRenderer.on('/accounts', (_, account) => {
      setEntries(account)
    })
    return () => getAccounts()
  }, [])

  const registerAccount = async (url: string) => {
    await window.electron.ipcRenderer.invoke('/account/register', url)
  }

  const unregisterAccount = async (url: string) => {
    await window.electron.ipcRenderer.invoke('/account/unregister', url)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
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
              isUnregister={isUnregister}
              setIsUnresisterOpen={setIsUnresisterOpen}
            />
          ))}
        </div>
      </div>

      {!isUnregister ? (
        <img
          ref={menuRef}
          className="w-15 fixed right-5 bottom-10 cursor-pointer bg-gray-500 rounded-full"
          src={menuIcon}
          alt="menuIcon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      ) : (
        <img
          className="w-15 fixed right-5 bottom-10 cursor-pointer bg-white rounded-full border border-red-600"
          src={checkIcon}
          alt="checkIcon"
          onClick={() => setIsUnregister(false)}
        />
      )}
      {isMenuOpen && (
        <HamburgerMenu setIsUnregister={setIsUnregister} setIsResisterOpen={setIsResisterOpen} />
      )}
      <RegisterAccountModal
        isResisterOpen={isResisterOpen}
        onClose={() => setIsResisterOpen(false)}
        action={registerAccount}
      />
      <UnregisterAccountModal
        isUnresisterOpen={isUnresisterOpen}
        onClose={() => setIsUnresisterOpen(false)}
        action={unregisterAccount}
      />
    </div>
  )
}

export default App
