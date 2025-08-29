export const particlesOptions = {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { quantity: 4 },
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.3,
      width: 1,
    },
    collisions: { enable: false },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: { default: "bounce" },
    },
    number: { density: { enable: true, area: 800 }, value: 100 },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 4 } },
  },
  detectRetina: true,
};
