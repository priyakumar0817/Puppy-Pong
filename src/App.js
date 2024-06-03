import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [counter, setCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const imgRef = useRef(null);
  const mouseRef = useRef(null);
  const intervalRef = useRef(null);

  let imgX = 0, imgY = 0, mouseX = 0, theDeltaX = 1, theDeltaY = 1;

  useEffect(() => {
    startInterval();
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    const mouseElement = mouseRef.current;
    if (mouseElement) {
      mouseElement.style.left = Math.max(0, Math.min(mouseX - mouseElement.offsetWidth / 2, window.innerWidth - mouseElement.offsetWidth)) + "px";
      mouseElement.style.visibility = 'visible';
    }
  };

  const updateX = () => {
    imgX += theDeltaX;
    if (imgRef.current) {
      imgRef.current.style.left = `${imgX}px`;
      if (imgX < 0 || imgX > document.body.offsetWidth - imgRef.current.offsetWidth) {
        theDeltaX *= -1;
      }
    }
  };

  const updateY = () => {
    imgY += theDeltaY;
    if (imgRef.current) {
      imgRef.current.style.top = `${imgY}px`;
      if (imgY < 0 || imgY > document.body.offsetHeight - imgRef.current.offsetHeight) {
        theDeltaY *= -1;
      }
    }
  };

  const updateBrowserSize = () => {
    const mouse = parseFloat(mouseRef.current.style.left.slice(0, -2));
    const mouseElement = mouseRef.current;
    const imgElement = imgRef.current;
    if (imgElement && mouseElement) {
      if (imgY === (document.body.offsetHeight - imgElement.offsetHeight - mouseElement.offsetHeight)
        && imgX < (mouse + mouseElement.offsetWidth) && imgX > (mouse - mouseElement.offsetWidth)) {
        theDeltaY *= -1;
        setCounter((prevCounter) => prevCounter + 1);
      } else if (imgY > (document.body.offsetHeight - imgElement.offsetHeight)) {
        setGameOver(true);
        stopInterval();
      }
    }
  };

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      updateX();
      updateY();
      updateBrowserSize();
    }, 2);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  const resetGame = () => {
    stopInterval();
    imgY = 0;
    imgX = 0;
    setCounter(0);
    setGameOver(false);
    startInterval();
  };

  return (
    <div className="App">
      <img ref={imgRef} src="https://source.unsplash.com/random/300x200?puppy" alt="Puppy Pong" />
      <div ref={mouseRef} className="mouseMove"></div>
      <div className="press-start-2p-regular">
      <div className="containerStyle">
        
          {gameOver ? `GAME OVER! TOTAL SCORE: ${counter}` : `SCORE: ${counter}`}
        </div>
      </div>
        <button
          onClick={resetGame}
          className="resetButton"
        >
          RESET
        </button>
    </div>
  );
}

export default App;