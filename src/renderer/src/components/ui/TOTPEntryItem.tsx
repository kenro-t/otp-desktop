import { TOTPEntry } from '../../types'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

type TOTPEntryItemProps = {
  entry: TOTPEntry
  remainingTime: number
  timeKey: number
  isUnregister: boolean
  setIsUnresisterOpen: (isOpen: boolean) => void
  setTargetAccount: (targetAccount: string) => void
}

export const TOTPEntryItem = ({
  entry,
  remainingTime,
  timeKey,
  isUnregister = false,
  setIsUnresisterOpen,
  setTargetAccount
}: TOTPEntryItemProps) => {
  const { handleCopy } = useCopyToClipboard()

  return (
    <div className="relative rounded-lg bg-white p-4 shadow-sm">
      {isUnregister && (
        <button
          onClick={() => {
            setTargetAccount(entry.id)
            //  モーダルの呼出
            setIsUnresisterOpen(true)
          }}
          className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow-md hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          aria-label="Delete"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">{entry.serviceName}</h3>
        {!isUnregister && (
          <button
            onClick={() => handleCopy(entry.token)}
            className="text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
            aria-label="Copy"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="font-mono text-2xl font-bold tracking-wider text-blue-600">{entry.token}</div>
      <div className="mt-3 h-1 rounded bg-blue-100">
        <div
          key={timeKey}
          className="h-full rounded bg-blue-500 duration-100 ease-linear"
          style={{
            width: `${(remainingTime / 30) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
