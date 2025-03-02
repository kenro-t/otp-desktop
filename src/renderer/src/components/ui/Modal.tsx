import { useState } from 'react'
import { ModalPortal } from '../layout/ModalPortal'

export const Modal = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState<string>('')

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div
        id="content"
        className="bg-white p-4 rounded-lg shadow-lg w-full mx-10 max-w-2xl h-[40%] flex flex-col justify-around"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium font-bold text-gray-700 mb-1">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="otpauth://example.com"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setUrl('')
              onClose()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            追加
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </div>
    </ModalPortal>
  )
}
