import { ModalPortal } from '../layout/ModalPortal'
import { useShowAlert } from '@renderer/hooks/useAlert'

interface ModalProps {
  isUnresisterOpen: boolean
  onClose: () => void
  unregisterAccount: (url: string) => Promise<void>
  targetAccount: string
}
export const UnregisterAccountModal = ({
  isUnresisterOpen,
  onClose,
  unregisterAccount,
  targetAccount
}: ModalProps): React.JSX.Element | null => {
  const showAlert = useShowAlert()

  if (!isUnresisterOpen) return null

  const unregiterAccountHandler = async () => {
    // 削除の実行
    try {
      await unregisterAccount(targetAccount)
    } catch (error) {
      if (error instanceof Error) {
        showAlert(error.message)
      }
    }
    // 閉じる
    onClose()
  }

  return (
    <ModalPortal>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full mx-10 max-w-2xl h-[40%] flex flex-col justify-around">
        Are you sure you want to delete your account?
        <div className="flex justify-end gap-4">
          <button
            onClick={unregiterAccountHandler}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalPortal>
  )
}
