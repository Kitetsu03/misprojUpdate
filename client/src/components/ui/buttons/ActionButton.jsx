import { FaRegTrashAlt } from "react-icons/fa";
import { FiKey } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
export function ActionButton() {
  const icons = [
    {
      id: 1,
      icon: <FaRegTrashAlt size={26} />,
    },
    {
      id: 2,
      icon: <FiKey />,
    },
    {
      id: 3,
      icon: <HiOutlinePencilSquare />,
    },
  ];
  return (
    <>
      {icons.map((icon) => {
        return (
          <button key={icon.id} className="text-gray-600 hover:text-gray-800">
            {icon.icon}
          </button>
        );
      })}
    </>
  );
}
