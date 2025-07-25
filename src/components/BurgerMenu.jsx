// 🧰 IMPORTING OUR TOOLS
import { useEffect } from "react"; // 🕒 For timing things
import { FiX } from "react-icons/fi"; // ❌ The 'X' close icon
import { NavLink } from "react-router-dom"; // 🚪 For links to other pages
import allTools from "../utils/NavData"; // 🛠️ All our tools list
import { tools as cardTools } from "../utils/cardData"; // 🎨 Colors and icons

// 🎨 COLOR HELPER FUNCTION
const getToolColor = (toPath) => {
  // 🔍 Find the tool that matches this link
  const matched = cardTools.find((item) => item.link === toPath);
  
  // ⭐ If not found, use default yellow
  if (!matched || !matched.color) {
    return { className: "bg-amber-200", style: {} };
  }

  // 🏷️ Check if it's a simple color name
  const hasTailwindColor =
    matched.color.startsWith("bg-") && !matched.color.includes("#");
  
  // 💎 Check if it's a special color code
  const hasHexColor =
    matched.color.startsWith("bg-[") && matched.color.includes("#");

  // 1️⃣ Simple color? Use as-is!
  if (hasTailwindColor) {
    return { className: matched.color, style: {} };
  } 
  // 2️⃣ Special code? Extract the color!
  else if (hasHexColor) {
    const hexMatch = matched.color.match(/bg-\[#(.*?)\]/);
    return {
      className: "",
      style: { backgroundColor: `#${hexMatch?.[1] || "FFD700"}` }, // 🌟 Gold if error
    };
  } 
  // 🟡 Default to yellow if unsure
  else {
    return { className: "bg-amber-200", style: {} };
  }
};

// 🍔 BURGER MENU COMPONENT
const BurgerMenu = ({ onClose }) => {
  // 🚦 STOP SCROLLING WHEN MENU IS OPEN
  useEffect(() => {
    document.body.classList.add("overflow-hidden"); // 🛑 Freeze page scroll
    return () => document.body.classList.remove("overflow-hidden"); // 🏃‍♂️ Unfreeze when done
  }, []);

  return (
    // 📱 FULL-SCREEN PHONE MENU
    <div className='fixed top-0 right-0 w-full h-full bg-white shadow-lg z-50 transition-transform duration-300'>
      {/* 📦 MENU CONTENT CONTAINER */}
      <div className='pr-6 pl-6 overflow-y-auto h-full flex flex-col'>
        
        {/* ❌ CLOSE BUTTON (STICKY AT TOP) */}
        <div
          className='bg-white h-auto p-4 flex justify-end sticky top-0'
          onClick={onClose} // 👆 Click to close menu
        >
          <FiX size={24} /> {/* This is the 'X' icon */}
        </div>

        {/* 📂 LIST OF ALL TOOL CATEGORIES */}
        {Object.entries(allTools).map(([section, items]) => (
          <div key={section} className='mb-6'>
            {/* 🏷️ SECTION TITLE */}
            <h4 className='font-bold text-[#707078] mb-5 text-sm uppercase tracking-wide'>
              {section}
            </h4>
            
            {/* 🛠️ LIST OF TOOLS IN THIS SECTION */}
            <ul className='space-y-8'>
              {items.map((item) => {
                // 🎨 Get this tool's color
                const { className, style } = getToolColor(item.to);

                return (
                  <li key={item.to}>
                    {/* 🔗 CLICKABLE TOOL LINK */}
                    <NavLink
                      to={item.to}
                      onClick={onClose} // ❌ Close menu when clicked
                      // 🔵 Blue if current page, gray otherwise
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-600 text-sm flex items-center gap-2"
                          : "text-gray-700 text-sm flex items-center gap-2"
                      }
                    >
                      {/* ⭕ COLORED ICON CIRCLE */}
                      <div
                        className={`w-8 h-8 flex justify-center mr-2 items-center rounded-full ${className}`}
                        style={style}
                      >
                        {item.img} {/* 🖼️ Tool icon */}
                      </div>
                      {item.label} {/* 📛 Tool name */}
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