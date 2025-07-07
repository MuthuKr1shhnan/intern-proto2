import ToolsCard from "../components/ToolsCard";
import { tools } from "../utils/cardData";
import { useState } from "react";


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

    if (activeTab === "Favorites") {
      return toolsWithFavFlag.filter((tool) => favorites.includes(tool.id));
    }

    return toolsWithFavFlag;
  };

  return (
    <section className='py-12 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-6'>Popular Tools</h2>

        {/* Tabs */}
        <div className='flex justify-center space-x-6 mb-10'>
          {["All", "Favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-semibold ${
                activeTab === tab
                  ? "text-black border-b-2 border-pink-500"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tools Card */}
        <ToolsCard
          tools={getToolsForTab()}
          onToggleFavorite={handleToggleFavorite} // 👈 this line!
          containerClasses='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          mainContainerClasses=''
          itemClasses='bg-pink-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center relative'
          iconClasses='mx-auto mb-3 w-9 h-9 text-pink-700'
          titleClasses='text-base font-bold mb-1 text-gray-800'
          contentClasses='text-sm text-gray-600'
          badgeClasses='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded'
        />

        {activeTab === "Favorites" && getToolsForTab().length === 0 && (
          <div className='text-center text-sm text-gray-500 mt-4'>
            No favorite tools found.
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
