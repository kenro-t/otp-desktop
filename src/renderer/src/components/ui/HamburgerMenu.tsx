interface HamburgerMenuProps {
  setIsResisterOpen: (isResisterOpen: boolean) => void
  setIsUnregister: (isUnregister: boolean) => void
}

export const HamburgerMenu = ({
  setIsResisterOpen,
  setIsUnregister
}: HamburgerMenuProps): JSX.Element | null => {
  return (
    <div className="fixed right-5 bottom-28 gap-1 flex flex-col">
      <button
        onClick={() => setIsResisterOpen(true)}
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-around cursor-pointer text-center hover:bg-gray-100 transition-colors"
      >
        Register
      </button>
      <button
        onClick={() => setIsUnregister(true)}
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-around cursor-pointer text-center hover:bg-gray-100 transition-colors"
      >
        Unregister
      </button>
    </div>
  )
}
