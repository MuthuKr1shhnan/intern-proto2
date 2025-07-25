// 📦 Importing necessary components and assets
import { Link } from "react-router-dom";
import startrue from "../assets/startrue.svg";    // ⭐ Filled star icon
import starfalse from "../assets/starfalse.svg"; // ☆ Outline star icon

// 🎯 Component to display a grid of tool cards
const ToolsCard = ({ tools = [], onToggleFavorite }) => {
  return (
    // 📱 Responsive grid layout (1-4 columns based on screen size)
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-12 px-4 sm:px-6 md:px-10'>
      {/* 🔄 Loop through each tool to create a card */}
      {tools.map((tool) => {
        // 🏷️ Check if tool has valid icon and corner image
        const hasValidIcon = tool.icon && tool.icon.trim() !== "";
        const hasValidCornerImage =
          tool.cornerImage && tool.cornerImage.trim() !== "";
        
        // 🎨 Set background color (default to gray if not specified)
        const bgColor =
          tool.color && tool.color.startsWith("bg-")
            ? tool.color
            : "bg-gray-100";

        return (
          // 🃏 Individual tool card container
          <div
            key={tool.title} // 🔑 Unique key for React rendering
            className={`relative w-full h-[140px] px-3 pt-4 pb-4 gap-2 rounded-[2px] ${bgColor} 
              shadow hover:shadow-md transition-transform hover:scale-[1.02] overflow-hidden`}
          >
            {/* ⭐ Favorite button (only shown if onToggleFavorite prop exists) */}
            {onToggleFavorite && hasValidIcon && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 🛑 Prevent link navigation
                  e.preventDefault();
                  onToggleFavorite(tool.id); // 📞 Call parent handler
                }}
                title={
                  tool.isFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
                className='absolute top-2 right-2 z-20' // 🎯 Position absolutely
              >
                {/* 🎨 Star button with nice styling */}
                <div className="w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <img
                    src={tool.isFavorite ? startrue : starfalse}
                    alt='Favorite Star'
                    className='w-5 h-5 block'
                  />
                </div>
              </button>
            )}

            {/* 🖤 Subtle overlay (currently unused - could be for hover effects) */}
            <div className="absolute bg-black opacity-0.5 blur-[100%] w-full h-full top-0 left-0 z-1"/>

            {/* 🔗 Main clickable area linking to tool */}
            <Link
              to={tool.link}
              title={tool.title}
              className='block h-full relative z-5'
            >
              {/* 🖼️ Tool icon (if available) */}
              {hasValidIcon && (
                <img
                  src={tool.icon}
                  alt={tool.title}
                  className='w-10 h-10 mb-2' // 📏 Fixed size with margin
                />
              )}

              {/* 📝 Text content area */}
              <div
                className={`flex items-center w-full justify-${
                  hasValidIcon ? "start" : "center h-full"
                } gap-2`}
              >
                {/* 🏷️ Tool title */}
                <h3
                  className={`text-[16px] font-bold text-black ${
                    tool.icon ? "text-start" : "text-center"
                  } leading-tight`}
                >
                  {tool.title}
                </h3>
              </div>
              
              {/* 📄 Tool description */}
              <p className='text-[12px] text-gray-700 mt-1 leading-snug'>
                {tool.description}
              </p>
            </Link>

            {/* 🎨 Decorative corner image (if available) */}
            {hasValidCornerImage && (
              <img
                src={tool.cornerImage}
                alt={`${tool.title} decoration`}
                className='absolute -bottom-6 -right-7 w-[120px] h-[120px] object-contain z-0 
                  opacity-50 brightness-[120] contrast-[80] saturate-50'
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// 🚀 Export the component
export default ToolsCard;