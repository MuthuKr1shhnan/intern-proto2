import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import allTools from "../utils/NavData";

const BurgerMenu = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", true);
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div className='fixed top-0 right-0 w-full h-full bg-white shadow-lg z-50 transition-transform duration-300'>
      <div className='pr-6 pl-6 overflow-y-auto h-full flex flex-col'>
        <div
          className='bg-white h-auto p-4 flex justify-end sticky top-0'
          onClick={onClose}
        >
          <FiX size={32} />
        </div>

        {Object.entries(allTools).map(([section, items]) => (
          <div key={section} className='mb-6'>
            <h4 className='font-bold text-[#707078] mb-3 text-sm uppercase tracking-wide'>
              {section}
            </h4>
            <ul className='space-y-3'>
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      isActive
                        ? "text-red-500 text-sm flex items-center gap-2"
                        : "text-gray-700 text-sm flex items-center gap-2"
                    }
                  >
                    {item.img} {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BurgerMenu;
