import { useState } from "react";
import ToolsCard from "../components/ToolsCard";
import { tools } from "../utils/cardData";

function Home() {
  const [activeTab, setActiveTab] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const getToolsForTab = () => {
    const toolsWithFavFlag = tools.map((tool) => ({
      ...tool,
      isFavorite: favorites.includes(tool.id),
    }));

    return activeTab === "Favorites"
      ? toolsWithFavFlag.filter((tool) => tool.isFavorite)
      : toolsWithFavFlag;
  };

  return (
    <section className='py-14 bg-[#f8f8f8]'>
      <div className='max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-10'>
        {/* ✅ Banner */}
        <div className='w-full max-w-5xl mx-auto mb-10 bg-blue-100 rounded-[4px] opacity-90 overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:items-stretch justify-between'>
          {/* Left Side Text */}
          <div className='p-4 w-full md:w-2/3'>
            <h3 className='text-base sm:text-lg font-extrabold text-[#2869DA] mb-1'>
              Your All-in-one PDF Utility
            </h3>
            <p className='text-xs sm:text-sm text-blue-800'>
              Merge, split, convert & more for free with PDF Tools.
            </p>
          </div>

          {/* Right Side Image + Label */}
          <div className='flex items-center gap-2 bg-black text-white text-[10px] font-bold uppercase py-2 px-4 md:py-1 md:px-3 md:rounded-l-[4px] w-full md:w-auto justify-center'>
            <img
              src='mergeicon.png'
              alt='Merge Icon'
              className='w-10 h-10 sm:w-5 sm:h-5 object-contain'
            />
            <span className='text-xs sm:text-sm'>Merge</span>
          </div>
        </div>

        {/* ✅ Section Title */}
        <h2 className='text-[40px] leading-[100%] tracking-[-0.02em] font-black text-center mb-8'>
          Popular Tools
        </h2>

        {/* ✅ Tabs */}
        <div className='flex justify-center space-x-8 mb-10'>
          {["All", "Favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-semibold transition-colors ${
                activeTab === tab
                  ? "text-black border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ✅ Tools Grid */}
        <div className='px-2 sm:px-0'>
          <ToolsCard
            tools={getToolsForTab()}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* ✅ Empty State for Favorites */}
        {activeTab === "Favorites" && getToolsForTab().length === 0 && (
          <div className='text-center text-sm text-gray-500 mt-8'>
            No favorite tools found.
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;

// import ToolsCard from "../components/ToolsCard";
// import { tools } from "../utils/cardData";
// import { useState } from "react";

// function Home() {
//   const [activeTab, setActiveTab] = useState("All");
//   const [favorites, setFavorites] = useState([]);

//   const handleToggleFavorite = (id) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
//     );
//   };

//   const getToolsForTab = () => {
//     const toolsWithFavFlag = tools.map((tool) => ({
//       ...tool,
//       isFavorite: favorites.includes(tool.id),
//     }));

//     if (activeTab === "Favorites") {
//       return toolsWithFavFlag.filter((tool) => favorites.includes(tool.id));
//     }

//     return toolsWithFavFlag;
//   };

//   return (
//     <section className='py-12 bg-white'>
//       <div className='max-w-7xl mx-auto px-4'>
//         <h2 className='text-4xl font-bold text-center mb-6'>Popular Tools</h2>

//         {/* Tabs */}
//         <div className='flex justify-center space-x-6 mb-10'>
//           {["All", "Favorites"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`text-lg font-semibold ${
//                 activeTab === tab
//                   ? "text-black border-b-2 border-pink-500"
//                   : "text-gray-500 hover:text-black"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tools Card */}
//         <ToolsCard
//           tools={getToolsForTab()}
//           onToggleFavorite={handleToggleFavorite} // 👈 this line!
//           containerClasses='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
//           mainContainerClasses=''
//           itemClasses='bg-pink-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center relative'
//           iconClasses='mx-auto mb-3 w-9 h-9 text-pink-700'
//           titleClasses='text-base font-bold mb-1 text-gray-800'
//           contentClasses='text-sm text-gray-600'
//           badgeClasses='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded'
//         />

//         {activeTab === "Favorites" && getToolsForTab().length === 0 && (
//           <div className='text-center text-sm text-gray-500 mt-4'>
//             No favorite tools found.
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Home;
