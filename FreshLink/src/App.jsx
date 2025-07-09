import React, { useEffect, useState } from 'react'
import Splash from './Components/Splash/splash'

const App = () => {
  const [loading, setLoading] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideSplash(true);
      setTimeout(() => setLoading(false), 500); // Allow animation to finish
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {loading && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-500 ease-in-out ${
            hideSplash ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <Splash></Splash>
        </div>
      )}
      
    </>
  )
}


export default App
