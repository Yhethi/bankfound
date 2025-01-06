import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  const darkMode = useSelector((state) => state.darkMode.isActivated);
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("isDarkMode")) || false
  );

  const [particleColor, setParticleColor] = useState("#fff");

  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isDarkMode) {
      setParticleColor("#0866ff");
    } else {
      setParticleColor("#fff");
    }
  }, [isDarkMode]);

  const particlesOptions = {
    fpsLimit: 60,
    particles: {
      color: {
        value: particleColor,
      },
      links: {
        color: "#ffffff",
        distance: 20,
        enable: true,
        opacity: 1,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 2,
        straight: true,
      },
      number: {
        density: {
          enable: true,
          area: 1600,
        },
        value: 100,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
    />
  );
};

export default ParticlesBackground;
