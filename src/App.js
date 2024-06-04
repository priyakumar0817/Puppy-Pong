import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [counter, setCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const imgRef = useRef(null);
  const mouseRef = useRef(null);
  const intervalRef = useRef(null);
  const mouseX = useRef(0); // Store mouseX value using useRef

  let imgX = 0, imgY = 0, theDeltaX = 1, theDeltaY = 1;
  useEffect(() => {
    //startInterval();
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX; // Update mouseX using useRef
      const mouseElement = mouseRef.current;
      if (mouseElement) {
        mouseElement.style.left = Math.max(0, Math.min(mouseX.current - mouseElement.offsetWidth / 2, window.innerWidth - mouseElement.offsetWidth)) + "px";
        mouseElement.style.visibility = 'visible';
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseX.current = e.touches[0].clientX; // Update mouseX using useRef
        const mouseElement = mouseRef.current;
        if (mouseElement) {
          mouseElement.style.left = Math.max(0, Math.min(mouseX.current - mouseElement.offsetWidth / 2, window.innerWidth - mouseElement.offsetWidth)) + "px";
          mouseElement.style.visibility = 'visible';
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

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
      const imgBottom = imgY + imgElement.offsetHeight;
      const paddleTop = window.innerHeight - mouseElement.offsetHeight;
      const paddleLeft = mouse;
      const paddleRight = mouse + mouseElement.offsetWidth;
  
      if (
        imgBottom >= paddleTop &&
        imgY < paddleTop &&
        imgX + imgElement.offsetWidth > paddleLeft &&
        imgX < paddleRight
      ) {
        theDeltaY *= -1;
        setCounter(prevCounter => prevCounter + 1);
      } else if (imgY > window.innerHeight - imgElement.offsetHeight) {
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
      <img ref={imgRef} src="https://source.unsplash.com/random/300x200?puppy" alt="Puppy Pong" onLoad={startInterval}/>
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
