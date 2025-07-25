// 🌈 IMPORTING ALL THE TOOLS WE NEED
import { useState } from "react"; // 🧰 React's toolbox
import logoSvg from "../assets/logo.svg"; // 🏠 Our website's logo
import droparrow from "../assets/droparrow.svg"; // 🔽 Down arrow icon
import { NavLink, Link } from "react-router-dom"; // 🚪 Doorways to other pages
import * as Popover from "@radix-ui/react-popover"; // 🎪 Pop-up menu magic
import BurgerMenu from "./BurgerMenu"; // 🍔 The phone menu
import allTools from "../utils/NavData"; // 🛠️ All our tools list
import { tools as cardTools } from "../utils/cardData"; // 🎨 Tool colors and icons
import burgermenu from "../assets/burgermenu.svg"; // 📱 Phone menu button

// 🎨 COLOR PICKER FOR TOOL ICONS
const getToolColor = (toPath) => {
  // 🔍 Let's find the tool that matches this link
  const matched = cardTools.find((item) => item.link === toPath);
  
  // ⭐ If we can't find it, use a nice yellow color
  if (!matched || !matched.color) {
    return { className: "bg-amber-200", style: {} };
  }
  
  // 🎨 Check if it's a simple color name (like "blue-500")
  const hasSimpleColorName =
    matched.color.startsWith("bg-") && !matched.color.includes("#");
  
  // 💎 Check if it's a special color code (like "#FF0000")
  const hasSpecialColorCode =
    matched.color.startsWith("bg-[") && matched.color.includes("#");

  // 1️⃣ Simple color? Use it directly!
  if (hasSimpleColorName) {
    return { className: matched.color, style: {} };
  } 
  // 2️⃣ Special color code? Let's extract the color!
  else if (hasSpecialColorCode) {
    // ✂️ Cut out just the color part from "bg-[#FF0000]"
    const colorCodeMatch = matched.color.match(/bg-\[#(.*?)\]/);
    return {
      className: "",
      style: { backgroundColor: `#${colorCodeMatch?.[1] || "FFD700"}` }, // 🌟 Gold color if we can't read it
    };
  } 
  // 🟡 Default to yellow if we're not sure
  else {
    return { className: "bg-amber-200", style: {} };
  }
};

// 📦 TOOL BOX SECTION
const DropdownSection = ({ title, tools, onItemClick }) => {
  return (
    <div className='h-auto'>
      {/* 🏷️ Little title for this tool group */}
      <h4 className='text-xs font-semibold mb-4 text-gray-500 uppercase'>
        {title}
      </h4>
      
      {/* 🧩 Grid layout for tools (2 columns) */}
      <ul className='grid grid-cols-2 gap-x-4 gap-y-5'>
        {/* 🛠️ Show each tool in this group */}
        {tools.map((tool) => {
          // 🎨 Get this tool's color
          const { className, style } = getToolColor(tool.to);

          return (
            <li key={tool.to}>
              {/* 🔗 Clickable tool link */}
              <NavLink
                to={tool.to}
                onClick={onItemClick} // ❌ Close menu when clicked
                // 🔵 Turn blue if this is the current page
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm text-black hover:text-blue-600${
                    isActive ? " text-blue-600" : ""
                  }`
                }
              >
                {/* ⭕ Colored circle with tool icon */}
                <div
                  className={`w-10 h-10 mr-2 flex justify-center items-center rounded-full ${className}`}
                  style={style}
                >
                  {tool.img} {/* 🖼️ Tool's picture */}
                </div>
                {tool.label} {/* 📛 Tool's name */}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// 🚀 MAIN NAVIGATION BAR
const Nav = () => {
  // 📱 Phone menu: open or closed?
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🖱️ Which computer menu is open?
  const [openPopover, setOpenPopover] = useState(null); 

  return (
    // 🔝 Sticky bar at top of page
    <div className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white'>
      {/* 📦 Container for everything */}
      <div className='w-full max-w-[1280px] justify-between mx-auto px-5 py-4 flex items-center relative'>
        {/* 🏡 Clickable logo to go home */}
        <Link to='/'>
          <img src={logoSvg} alt='Logo' />
        </Link>

        {/* 💻 COMPUTER MENU (hidden on phones) */}
        <div className='hidden md:flex gap-[56px] text-[14px] font-medium text-black items-center'>
          
          {/* 🛠️ ALL TOOLS DROPDOWN */}
          <Popover.Root 
            open={openPopover === "allTools"} // 👀 Is it open?
            onOpenChange={(open) => setOpenPopover(open ? "allTools" : null)} // 👐 Open/close
          >
            {/* 🖱️ Clickable menu button */}
            <Popover.Trigger className='hover:text-blue-600 cursor-pointer'>
              <div className='flex gap-2 items-end'>
                All Tools <img className='w-5 h-5' src={droparrow} alt='▼' />
              </div>
            </Popover.Trigger>
            
            {/* 🎁 The pop-up menu contents */}
            <Popover.Content
              sideOffset={32} // 📏 How far below button
              align='center' // 🎯 Center it
              className='z-50 bg-white shadow-xl rounded-xl p-6 w-[500px] max-h-[400px] overflow-auto'
            >
              <Popover.Arrow className='fill-white' />  
              
              {/* 📂 Show all tool categories */}
              {Object.entries(allTools).map(([section, items]) => (
                <DropdownSection
                  key={section}
                  title={section}
                  tools={items}
                  onItemClick={() => setOpenPopover(null)} // ❌ Close when picked
                />
              ))}
            </Popover.Content>
          </Popover.Root>

          {/* 🔄 CONVERT TOOLS DROPDOWN */}
          <Popover.Root 
            open={openPopover === "convert"} 
            onOpenChange={(open) => setOpenPopover(open ? "convert" : null)}
          >
            <Popover.Trigger className='hover:text-blue-600 cursor-pointer'>
              <div className='flex gap-2 items-end'>
                Convert <img className='w-5 h-5' src={droparrow} alt='▼' />
              </div>
            </Popover.Trigger>
            <Popover.Content
              sideOffset={32}
              align='center'
              className='z-50 bg-white shadow-xl rounded-xl p-6 w-[500px] max-h-[400px] overflow-auto'
            >
              <Popover.Arrow className='fill-white' />
              
              {/* 🛠️ Show convert tools (but skip first three) */}
              <DropdownSection
                title='Convert'
                tools={Object.values(allTools)
                  .flat() // 📜 Make one big list
                  .filter((tool) => ![1, 2, 3].includes(tool.id))} // 🙈 Hide some
                onItemClick={() => setOpenPopover(null)}
              />
            </Popover.Content>
          </Popover.Root>

          {/* 📄 SIMPLE LINKS (no dropdown) */}
          <NavLink
            to='/merge-pdf'
            // 🔵 Blue if on this page
            className={({ isActive }) =>
              `hover:text-blue-600${isActive ? " text-blue-600" : ""}`
            }
          >
            Merge PDF
          </NavLink>
          <NavLink
            to='/split-pdf'
            className={({ isActive }) =>
              `hover:text-blue-600${isActive ? " text-blue-600" : ""}`
            }
          >
            Split PDF
          </NavLink>
        </div>

        {/* 📱 PHONE MENU BUTTON (hidden on computers) */}
        <div className='ml-auto flex justify-center items-center md:hidden z-10'>
          <button
            className='text-2xl text-gray-700'
            onClick={() => setIsMobileMenuOpen(true)} // 👆 Open phone menu
          >
            <img src={burgermenu} alt='☰' />
          </button>
        </div>
      </div>

      {/* 🍔 PHONE MENU (slides in when open) */}
      {isMobileMenuOpen && (
        <BurgerMenu onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default Nav;