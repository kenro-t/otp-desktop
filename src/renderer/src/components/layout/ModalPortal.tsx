import { createPortal } from 'react-dom'

export const ModalPortal = ({ children }) => {
  return createPortal(
    <div
      id="modal-root"
      className="fixed inset-0 flex justify-center items-center"
    >
      {children}
    </div>,
    document.body
  )
}
