import { ModalPortal } from '../layout/ModalPortal'

interface ModalProps {
    isUnresisterOpen: boolean
  onClose: () => void
  action: (url: string) => Promise<void>
}
export const UnregisterAccountModal = ({ isUnresisterOpen, onClose, action }: ModalProps): JSX.Element | null => {

  if (!isUnresisterOpen) return null

  // TODO: エラーハンドリング
  const unregiterAccountHandler = () => {
    // アカウント登録の実行
    // action(url)
    // 閉じる
    onClose()
  }

  return (
    <ModalPortal>
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-full mx-10 max-w-2xl h-[40%] flex flex-col justify-around"
      >
        Are you sure you want to delete your account?
        <div className="flex justify-end gap-4">
          <button
            onClick={unregiterAccountHandler}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
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
