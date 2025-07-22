import { useState } from "react";
import ToolsCard from "../components/ToolsCard";
import { tools } from "../utils/cardData";
import bannerpattern from "../assets/bannerpattern.svg";
import mergebannerimg from "../assets/mergebannerimg.svg";
import pdftobannerimg from "../assets/pdftobannerimg.svg";
import compressbannerimg from "../assets/compressbannerimg.svg";
import splitbannerimg from "../assets/splitbannerimg.svg";
import merge from "../assets/merge.svg";
import split from "../assets/split.svg";
import compress from "../assets/compress.svg";
import pdftoword from "../assets/pdftoword.svg";
import CardSwap, { Card } from "../components/CardSwap";
import bgpattern from "../assets/bgpattern.svg";

function Home() {
  const COMING_SOON_IDS = [10]; // put all "Coming Soon" tool IDs here

  // ✅ Load favorites from localStorage, but remove "coming soon"
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favoriteTools");
    const parsed = stored ? JSON.parse(stored) : [];

    const filtered = parsed.filter((id) => !COMING_SOON_IDS.includes(id));
    localStorage.setItem("favoriteTools", JSON.stringify(filtered));
    return filtered;
  });

  const [activeTab, setActiveTab] = useState("All");

  // ✅ Prevent adding "Coming Soon" tools to favorites
  const handleToggleFavorite = (id) => {
    if (COMING_SOON_IDS.includes(id)) return;

    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("favoriteTools", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Attach isFavorite flag to each tool
  const getToolsForTab = () => {
    const toolsWithFavorites = tools.map((tool) => ({
      ...tool,
      isFavorite: favorites.includes(tool.id),
    }));

    return activeTab === "Favorites"
      ? toolsWithFavorites.filter((tool) => tool.isFavorite)
      : toolsWithFavorites;
  };

  return (
    <section className='py-14  min-h-screen'>
      <div className='relative max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-10'>
        {/* ✅ Banner */}
        <div className="fixed w-full h-full top-1 cover bg-center opacity-[30%] left-0 -z-1"  style={{ backgroundImage: `url(${bgpattern})` }}/>
        <div className='w-full hidden md:flex lg:max-w-[798px] relative lg:h-[130px] mx-auto mb-10 bg-[#E9F1FE] rounded-[4px] opacity-90 overflow-hidden shadow-sm flex-col md:flex-row items-center md:items-stretch justify-between'>
          <img
            src={bannerpattern}
            className='absolute -z-1 opacity-8 bottom-0'
            alt='bannerpattern'
          />
          {/* Left Text */}
          <div className='w-full flex flex-col justify-center lg:pl-[24px] md:w-2/3'>
            <h3 className='text-base sm:text-lg lg:text-[32px] font-extrabold text-[#2869DA]'>
              Your All-in-one PDF Utility
            </h3>
            <p className='text-xs sm:text-sm lg:text-[16px] text-[#6B7582]'>
              Merge, split, convert & more for free with PDF Tools.
            </p>
          </div>
          {/* Right Image Rotation */}
          <div className='relative w-full md:w-auto'>
            <CardSwap
              cardDistance={10}
              verticalDistance={8}
              delay={3000}
              pauseOnHover={true}
              width={200}
              height={130}
            >
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative shadow-md flex items-center justify-center'
                  style={{ backgroundImage: `url(${mergebannerimg})` }}
                >
                  <div className='h-full flex items-center'>
                    <span className='mb-3 rotate-[-90deg] text-[24px] font-extrabold text-black'>
                      Merge
                    </span>
                  </div>
                  <img
                    src={merge}
                    alt='Merge Icon'
                    className='w-[150px] mr-2 mt-1 h-[150px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative shadow-md flex items-center justify-center'
                  style={{ backgroundImage: `url(${splitbannerimg})` }}
                >
                  <div className='h-full flex items-center'>
                    <span className='mb-3 ml-3 rotate-[-90deg] text-[24px] font-extrabold text-black'>
                      Split
                    </span>
                  </div>
                  <img
                    src={split}
                    alt='Split Icon'
                    className='w-[150px] mr-3 mt-1 h-[150px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative shadow-md flex items-center justify-center'
                  style={{ backgroundImage: `url(${compressbannerimg})` }}
                >
                  <div className='h-full flex justify-center items-center'>
                    <span className='mb-3 rotate-[-90deg] text-[16px] font-extrabold text-black'>
                      Compress <br /> PDF
                    </span>
                  </div>
                  <img
                    src={compress}
                    alt='Compress Icon'
                    className='w-[120px] mr-2 mt-1 h-[120px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative shadow-md flex items-center justify-center'
                  style={{ backgroundImage: `url(${pdftobannerimg})` }}
                >
                  <div className='h-full flex items-center'>
                    <span className='mb-3 rotate-[-90deg] text-[16px] font-extrabold text-black'>
                      PDF to Anything
                    </span>
                  </div>
                  <img
                    src={pdftoword}
                    alt='Convert Icon'
                    className='w-[100px] mr-3 mt-1 h-[100px] mb-4'
                  />
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>

        {/* ✅ Section Title */}
        <h2 className='text-[40px] leading-[100%] tracking-[-0.02em] font-black text-center mb-8'>
          Popular Tools
        </h2>

        {/* ✅ Tabs */}
        <div className='flex justify-center space-x-12 mb-10'>
          {["All", "Favorites"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-semibold transition-colors ${
                activeTab === tab
                  ? "text-black border-b-2 border-blue-500"
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

        {/* ✅ Empty Favorites Message */}
        {activeTab === "Favorites" && getToolsForTab().length === 0 && (
          <div className='text-center text-sm h-full text-gray-500 mt-8'>
            <p>No favorite tools found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
