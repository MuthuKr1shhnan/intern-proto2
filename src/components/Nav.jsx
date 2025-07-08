import React, { useState } from "react";
import Logo from "../assets/logo.svg"; // Assuming you have a logo image
import { FaBars } from "react-icons/fa"; // Assuming you have a logo image
import { NavLink, Link } from "react-router-dom";
import * as HoverCard from "@radix-ui/react-hover-card";
import BurgerMenu from "./BugerMenu"; // updated version you’ll edit next
import allTools from "../utils/NavData"; // extracted object for reusability

const DropdownSection = ({ title, tools }) => (
  <div className='h-auto '>
    <h4 className='text-xs font-semibold mb-4 text-gray-500 uppercase'>
      {title}
    </h4>
    <ul className='columns-2 gap-10 '>
      {tools.map((tool) => (
        <li key={tool.to} className='mb-4'>
          <NavLink
            to={tool.to}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm text-black hover:text-blue-600${
                isActive ? " text-blue-600" : ""
              }`
            }
          >
            {tool.img}
            {tool.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white'>
      <div className='w-full max-w-[1280px] mx-auto px-5 py-4 flex items-center relative'>
        <Link to='/'>
          <img src={Logo} alt='' />
        </Link>

        <div className='hidden md:flex absolute left-1/2 -translate-x-1/2 gap-[32px] text-[14px] font-medium text-black items-center'>
          {/* All Tools Dropdown */}
          <HoverCard.Root openDelay={0} closeDelay={20}>
            <HoverCard.Trigger className='hover:text-blue-600 cursor-pointer'>
              All Tools
            </HoverCard.Trigger>
            <HoverCard.Content
              sideOffset={32}
              className='z-50 bg-white shadow-xl rounded-xl p-6 '
            >
              <HoverCard.Arrow className='fill-gray-200 ' />{" "}
              {Object.entries(allTools).map(([section, items]) => (
                <DropdownSection
                  key={section}
                  title={section}
                  tools={items.filter((tool) => ![1, 2, 3].includes(tool.id))}
                />
              ))}
            </HoverCard.Content>
          </HoverCard.Root>

          {/* Convert Dropdown */}
          <HoverCard.Root>
            <HoverCard.Trigger className='hover:text-blue-600 cursor-pointer'>
              Convert
            </HoverCard.Trigger>
            <HoverCard.Content
              sideOffset={32}
              className='z-50 bg-white shadow-xl rounded-xl p-6 '
            >
              <HoverCard.Arrow className='fill-gray-200 ' />{" "}
              {Object.entries(allTools).map(([section, items]) => (
                <DropdownSection
                  key={section}
                  title={"Convert"}
                  tools={items.filter((tool) => ![1, 2, 3].includes(tool.id))}
                />
              ))}
            </HoverCard.Content>
          </HoverCard.Root>

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
        <div className='ml-auto md:hidden z-10'>
          <button
            className='text-2xl text-gray-700'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <FaBars />
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
