import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Using assets from public/ via root path. Files in public/ are served at '/'.
const images = [
  "/images/homwslider02.jpg",
  "/images/homesliders04.png",
  "/images/komeslider03.jpg",
  "/images/sliderhome01.jpg",
  "/images/homwslider02.jpg",
];

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto-scroll every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box
      sx={{
        position: "relative",
        margin: "auto",
        padding: "20px",
        width: "1400px",
        height: "300px",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: 3,
        margin: "auto",
      }}
    >
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt="slider"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>

      {/* Previous Button */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          "&:hover": { background: "rgba(0,0,0,0.7)" },
        }}
      >
        <ArrowBackIos />
      </IconButton>

      {/* Next Button */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          "&:hover": { background: "rgba(0,0,0,0.7)" },
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 15,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {images.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              cursor: "pointer",
              background: i === index ? "#1976d2" : "#ccc",
              transition: "0.3s",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageSlider;
