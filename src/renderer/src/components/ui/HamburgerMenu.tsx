import addUserIcon from '../../../../../resources/add-user.svg'
import removeUserIcon from '../../../../../resources/remove-user.svg'

interface HamburgerMenuProps {
  setIsResisterOpen: (isResisterOpen: boolean) => void
  setIsUnregister: (isUnregister: boolean) => void
}

export const HamburgerMenu = ({
  setIsResisterOpen,
  setIsUnregister
}: HamburgerMenuProps): React.JSX.Element | null => {
  return (
    <div className="fixed right-5 bottom-28 gap-1 flex flex-col">
      <button
        onClick={() => setIsResisterOpen(true)}
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-around cursor-pointer text-center hover:bg-gray-100 transition-colors"
      >
        <img
          className="w-10 mx-auto"
          src={addUserIcon}
          alt="addUserIcon"
        />
      </button>
      <button
        onClick={() => setIsUnregister(true)}
        className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-around cursor-pointer text-center hover:bg-gray-100 transition-colors"
      >
        <img
          className="w-10 mx-auto"
          src={removeUserIcon}
          alt="removeUserIcon"
        />
      </button>
    </div>
  )
}
