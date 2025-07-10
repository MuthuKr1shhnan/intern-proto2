import { useState } from "react";
import logoSvg from "../assets/logo.svg";
import droparrow from "../assets/droparrow.svg";
import { NavLink, Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import BurgerMenu from "./BurgerMenu";
import allTools from "../utils/NavData";
import { tools as cardTools } from "../utils/cardData";
import burgermenu from "../assets/burgermenu.svg";

// 🔧 Helper to get matching tool from cardData
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

const DropdownSection = ({ title, tools }) => {
  return (
    <div className='h-auto'>
      <h4 className='text-xs font-semibold mb-4 text-gray-500 uppercase'>
        {title}
      </h4>
      <ul className='grid grid-cols-2 gap-x-4 gap-y-5'>
        {tools.map((tool) => {
          const { className, style } = getToolColor(tool.to);

          return (
            <li key={tool.to}>
              <NavLink
                to={tool.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm text-black hover:text-blue-600${
                    isActive ? " text-blue-600" : ""
                  }`
                }
              >
                <div
                  className={`w-10 h-10 mr-2 flex justify-center items-center rounded-full ${className}`}
                  style={style}
                >
                  {tool.img}
                </div>
                {tool.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white'>
      <div className='w-full max-w-[1280px] justify-between mx-auto px-5 py-4 flex items-center relative'>
        <Link to='/'>
          <img src={logoSvg} alt='Logo' />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex gap-[56px]  text-[14px] font-medium text-black items-center'>
          {/* All Tools Dropdown */}
          <Popover.Root>
            <Popover.Trigger className='hover:text-blue-600 cursor-pointer'>
              <div className="flex gap-2 items-end">All Tools <img className="w-5 h-5" src={droparrow} alt='droparrow' /></div>
            </Popover.Trigger>
            <Popover.Content
              sideOffset={32}
              align='center'
              className='z-50 bg-white shadow-xl rounded-xl p-6 w-[500px] max-h-[400px] overflow-auto'
            >
              <Popover.Arrow className='fill-white' />
              {Object.entries(allTools).map(([section, items]) => (
                <DropdownSection key={section} title={section} tools={items} />
              ))}
            </Popover.Content>
          </Popover.Root>

          {/* Convert Dropdown */}
          <Popover.Root>
            <Popover.Trigger className='hover:text-blue-600 cursor-pointer'>
              <div className="flex gap-2 items-end"> Convert <img className="w-5 h-5" src={droparrow} alt='droparrow' /></div>
            </Popover.Trigger>
            <Popover.Content
              sideOffset={32}
              align='center'
              className='z-50 bg-white shadow-xl rounded-xl p-6 w-[500px] max-h-[400px] overflow-auto'
            >
              <Popover.Arrow className='fill-white' />
              <DropdownSection
                title='Convert'
                tools={Object.values(allTools)
                  .flat()
                  .filter((tool) => ![1, 2, 3].includes(tool.id))}
              />
            </Popover.Content>
          </Popover.Root>

          {/* Direct NavLinks */}
          <NavLink
            to='/merge-pdf'
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

        {/* Mobile Menu */}
        <div className='ml-auto flex justify-center items-center md:hidden z-10'>
          <button
            className='text-2xl text-gray-700'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <img src={burgermenu} alt='burgermenu' />
          </button>
        </div>
      </div>

      {/* Slide-in Mobile Menu */}
      {isMobileMenuOpen && (
        <BurgerMenu onClose={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default Nav;
