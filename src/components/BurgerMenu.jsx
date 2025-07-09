import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import allTools from "../utils/NavData";
import { tools as cardTools } from "../utils/cardData"; // ✅

const getToolColor = (toPath) => {
  const matched = cardTools.find((item) => item.link === toPath);
  if (!matched || !matched.color) {
    return { className: "bg-amber-200", style: {} };
  }

  const hasTailwindColor =
    matched.color.startsWith("bg-") && !matched.color.includes("#");
  const hasHexColor =
    matched.color.startsWith("bg-[") && matched.color.includes("#");

  if (hasTailwindColor) {
    return { className: matched.color, style: {} };
  } else if (hasHexColor) {
    const hexMatch = matched.color.match(/bg-\[#(.*?)\]/);
    return {
      className: "",
      style: { backgroundColor: `#${hexMatch?.[1] || "FFD700"}` },
    };
  } else {
    return { className: "bg-amber-200", style: {} };
  }
};

const BurgerMenu = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <div className='fixed top-0 right-0 w-full h-full bg-white shadow-lg z-50 transition-transform duration-300'>
      <div className='pr-6 pl-6 overflow-y-auto h-full flex flex-col'>
        <div
          className='bg-white h-auto p-4 flex justify-end sticky top-0'
          onClick={onClose}
        >
          <FiX size={24} />
        </div>

        {Object.entries(allTools).map(([section, items]) => (
          <div key={section} className='mb-6'>
            <h4 className='font-bold  text-[#707078] mb-5 text-sm uppercase tracking-wide'>
              {section}
            </h4>
            <ul className='space-y-8'>
              {items.map((item) => {
                const { className, style } = getToolColor(item.to);

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 text-sm flex items-center gap-2"
                          : "text-gray-700 text-sm flex items-center gap-2"
                      }
                    >
                      <div
                        className={`w-8 h-8 flex justify-center mr-2 items-center rounded-full ${className}`}
                        style={style}
                      >
                        {item.img}
                      </div>
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BurgerMenu;
