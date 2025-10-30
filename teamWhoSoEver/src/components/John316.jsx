import React, { useEffect, useRef } from "react";

const letters = ["J", "O", "H", "N", "3", "1", "6"];

function John316() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create exactly 7 bobbles, one per letter
    const bobbles = letters.map((letter, i) => ({
      x: width / 8 + (i * width / 8), // spread evenly horizontally
      y: height / 2 + (Math.random() - 0.5) * 100,
      radius: 25 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      letter,
      opacity: Math.random() * 0.5 + 0.3,
      opacityDir: Math.random() > 0.5 ? 0.0015 : -0.0015,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      bobbles.forEach((b) => {
        b.x += b.dx;
        b.y += b.dy;

        if (b.x - b.radius < 0 || b.x + b.radius > width) b.dx *= -1;
        if (b.y - b.radius < 0 || b.y + b.radius > height) b.dy *= -1;

        b.opacity += b.opacityDir;
        if (b.opacity > 0.8 || b.opacity < 0.2) b.opacityDir *= -1;

        // Shadow
        ctx.beginPath();
        ctx.arc(b.x, b.y + 5, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${b.opacity * 0.15})`;
        ctx.fill();

        // Bubble with realistic transparency
        const gradient = ctx.createRadialGradient(
          b.x - b.radius / 3,
          b.y - b.radius / 3,
          b.radius / 5,
          b.x,
          b.y,
          b.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 102, ${b.opacity})`); // lemon
        gradient.addColorStop(0.7, `rgba(255, 255, 102, ${b.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 255, 102, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 215, 0, ${b.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Letter
        ctx.fillStyle = `rgba(50,50,50,${b.opacity})`;
        ctx.font = `${b.radius * 0.6}px Arial Black`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.letter, b.x, b.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-orange-500 px-6 py-16 overflow-hidden">
      {/* Canvas for bobbles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-400 opacity-20 z-1"></div>

      {/* Main Content */}
      <div className="max-w-4xl w-full text-center flex flex-col items-center z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-6">
          John 3:16
        </h1>

        <p className="text-2xl md:text-3xl text-white mb-4 px-4 md:px-0">
          "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
        </p>

        <p className="italic text-lg md:text-xl text-white/90">
          A reminder of God’s unwavering love and the foundation of our faith.
        </p>

        <button className="mt-10 bg-gradient-to-r from-green-500 to-lime-400 text-black px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-transform transform hover:scale-105 shadow-xl">
          Explore Our Collection
        </button>
      </div>

      {/* Decorative cross */}
      <div className="absolute bottom-10 right-10 text-white/20 text-[150px] select-none pointer-events-none">
        ✝️
      </div>
    </section>
  );
}

export default John316;
