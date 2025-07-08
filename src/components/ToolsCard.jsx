import { Link } from "react-router-dom";
import startrue from "../assets/startrue.svg";
import starfalse from "../assets/starfalse.svg";

const ToolsCard = ({ tools = [], onToggleFavorite }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-6 px-4 sm:px-6 md:px-10'>
      {tools.map((tool) => {
        const hasValidIcon = tool.icon && tool.icon.trim() !== "";
        const hasValidCornerImage =
          tool.cornerImage && tool.cornerImage.trim() !== "";
        const bgColor =
          tool.color && tool.color.startsWith("bg-")
            ? tool.color
            : "bg-gray-100";

        return (
          <div
            key={tool.title}
            className={`relative w-full h-[140px] px-3 pt-4 pb-4 gap-2 rounded-[2px] ${bgColor} shadow hover:shadow-md transition-transform hover:scale-[1.02] overflow-hidden`}
          >
            {/* Favorite Star */}
            {onToggleFavorite && hasValidIcon && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleFavorite(tool.id);
                }}
                title={
                  tool.isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
                className='absolute top-2 right-2 z-20'
              >
                <img
                  src={tool.isFavorite ? startrue : starfalse}
                  alt='Favorite Star'
                  className='w-5 h-5'
                />
              </button>
            )}

            {/* Main Content */}
            <Link
              to={tool.link}
              title={tool.title}
              className='block h-full relative z-10'
            >
              {hasValidIcon && (
                <img
                  src={tool.icon}
                  alt={tool.title}
                  className='w-10 h-10 mb-2 '
                />
              )}

              <div
                className={`flex items-center w-full  justify-${
                  hasValidIcon ? "start" : "center h-full"
                } gap-2`}
              >
                <h3
                  className={`text-[16px] font-bold text-black ${
                    tool.icon ? "text-start" : "text-center "
                  } leading-tight`}
                >
                  {tool.title}
                </h3>
              </div>
              <p className='text-[12px] text-gray-700 mt-1 leading-snug'>
                {tool.description}
              </p>
            </Link>

            {/* Corner Decoration Image */}
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

export default ToolsCard;
