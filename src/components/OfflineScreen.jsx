import { useEffect, useState } from "react";

const OfflineScreen = () => {
  const [isOnline, setIsOnline] = useState(true); // Start with true to avoid flash

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state properly
    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-yellow-50 text-yellow-800 p-4">
      <div className="w-40 h-40 mb-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold">Oops! You're offline 🛸</h2>
      <p className="mt-2 max-w-md">
        The internet ghosts have stolen your connection. Try reloading when they're gone!
      </p>
    </div>
  );
};

export default OfflineScreen;