import { useState } from "react";
import ToolsCard from "../components/ToolsCard";
import { tools } from "../utils/cardData";
import bannerpattern from "../assets/bannerpattern.svg";
import mergebannerimg from "../assets/mergebannerimg.svg";
import pdftobannerimg from "../assets/pdftobannerimg.svg";
import compressbannerimg from "../assets/compressbannerimg.svg";
import splitbannerimg from "../assets/splitbannerimg.svg";
import merge from "../assets/merge.svg";
import split from "../assets/split.svg"; // Replace with your actual icon path
import compress from "../assets/compress.svg"; // Replace with your actual icon path
import pdftoword from "../assets/pdftoword.svg"; // Replace with your actual icon path
import CardSwap, { Card } from "../components/CardSwap";

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
    <section
      className='py-14 bg-[#f8f8f8]'
      style={{ height: "calc(100vh - 60px)" }}
    >
      <div className='max-w-7xl mt-6 mx-auto px-4 sm:px-6 lg:px-10'>
        {/* ✅ Banner */}
        <div
          className={`w-full lg:max-w-[798px] relative lg:h-[130px] mx-auto mb-10 bg-[#E9F1FE] rounded-[4px] opacity-90 overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:items-stretch justify-between`}
        >
          <img
            src={bannerpattern}
            className='absolute -z-1 opacity-8 bottom-0'
            alt='bannerpattern'
          />

          {/* Left Side Text */}
          <div className='w-full flex flex-col justify-center lg:pl-[24px] md:w-2/3'>
            <h3 className='text-base sm:text-lg lg:text-[32px] font-extrabold text-[#2869DA]'>
              Your All-in-one PDF Utility
            </h3>
            <p className='text-xs sm:text-sm lg:text-[16px] text-[#6B7582]'>
              Merge, split, convert & more for free with PDF Tools.
            </p>
          </div>

          {/* ✅ Right Side Animated Image + Label */}
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
                  className='w-full h-full rounded-[8px] relative  shadow-md flex items-center justify-center'
                  style={{
                    backgroundImage: `url(${mergebannerimg})`,
                  }}
                >
                  {/* Vertical Label */}
                  <div className='h-full flex items-center'>
                    <span className=' mb-3 rotate-[-90deg] text-[24px] font-extrabold text-black'>
                      Merge
                    </span>
                  </div>

                  {/* Icon */}
                  <img
                    src={merge} // Replace with your actual icon path
                    alt='Split Icon'
                    className='w-[150px] mr-2 mt-1 h-[150px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative  shadow-md flex items-center justify-center'
                  style={{
                    backgroundImage: `url(${splitbannerimg})`,
                  }}
                >
                  {/* Vertical Label */}
                  <div className='h-full flex items-center'>
                    <span className=' mb-3 rotate-[-90deg] text-[24px]  font-extrabold text-black'>
                      Split
                    </span>
                  </div>

                  {/* Icon */}
                  <img
                    src={split} // Replace with your actual icon path
                    alt='Split Icon'
                    className='w-[150px] mr-3 mt-1 h-[150px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative  shadow-md flex items-center justify-center'
                  style={{
                    backgroundImage: `url(${compressbannerimg})`,
                  }}
                >
                  {/* Vertical Label */}
                  <div className='h-full flex justify-center items-center'>
                    <span className=' mb-3 rotate-[-90deg] text-[16px]  font-extrabold text-black'>
                      Compress{" "}
                      <span className=' mb-3 rotate-[-90deg] text-[16px]  font-extrabold text-black'>
                        PDF
                      </span>
                    </span>
                  </div>

                  {/* Icon */}
                  <img
                    src={compress} // Replace with your actual icon path
                    alt='Split Icon'
                    className='w-[120px] mr-2 mt-1 h-[120px] mb-4'
                  />
                </div>
              </Card>
              <Card customClass='w-[150px] h-[150px] rounded-md'>
                <div
                  className='w-full h-full rounded-[8px] relative  shadow-md flex items-center justify-center'
                  style={{
                    backgroundImage: `url(${pdftobannerimg})`,
                  }}
                >
                  {/* Vertical Label */}
                  <div className='h-full flex items-center'>
                    <span className=' mb-3 rotate-[-90deg] text-[16px]  font-extrabold text-black'>
                      PDF to
                      <span className=' mb-3 rotate-[-90deg] text-[16px]  font-extrabold text-black'>
                        {" "}
                      </span>
                      Anything
                    </span>
                  </div>

                  {/* Icon */}
                  <img
                    src={pdftoword} // Replace with your actual icon path
                    alt='Split Icon'
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
