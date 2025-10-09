"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
}

export default function CanvasScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rotation = useRef({ x: 0, y: 0 });
  const mouseOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();

    // Detect mobile
    const isMobile = window.innerWidth < 768;

    // Particle system configuration - increased for denser coverage like reference
    const particleCount = isMobile ? 1500 : 5000;
    const radius = isMobile ? 150 : 250;
    const perspective = 800;

    // Initialize particles in perfect sphere formation
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlesRef.current.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        speedZ: (Math.random() - 0.5) * 0.5,
      });
    }

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = width / 2;
      const centerY = height / 2;
      mouseOffset.current.x = ((e.clientX - centerX) / centerX) * 0.0005;
      mouseOffset.current.y = ((e.clientY - centerY) / centerY) * 0.0005;
    };

    // Projection function
    const project = (x: number, y: number, z: number, distance: number) => {
      const fov = perspective / (perspective + z + distance);
      return {
        x: x * fov + width / 2,
        y: y * fov + height / 2,
        scale: fov,
        alpha: Math.max(0, Math.min(1, fov * 1.2)),
      };
    };

    // Rotation functions
    const rotateY = (x: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: x * cos - z * sin,
        z: x * sin + z * cos,
      };
    };

    const rotateX = (y: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        y: y * cos - z * sin,
        z: y * sin + z * cos,
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Calculate scroll progress (section 1 is one viewport)
      const scrollProgress = Math.min(window.scrollY / height, 1.5);
      
      // Sphere EXPANSION - starts at 1, grows as user scrolls
      // At scroll = 0: scale = 1 (compact sphere, clearly visible)
      // At scroll = 0.8: scale starts increasing
      // At scroll = 1.2+: scale = 3-4x (expanded/scattered)
      const scaleStart = 0.8;
      const sphereScale = scrollProgress < scaleStart 
        ? 1 
        : 1 + (scrollProgress - scaleStart) * 5;
      
      // Camera position - starts closer for visibility, zooms in as you scroll
      // At scrollProgress = 0: camera is at -600 (sphere clearly visible)
      // At scrollProgress = 1+: camera moves through sphere center
      const cameraZ = -600 + scrollProgress * 1200;
      
      // Rotation slows as sphere expands (increased by 1.1x)
      const rotSpeed = Math.max(0, 1 - scrollProgress * 0.8);
      rotation.current.x += 0.00088 * rotSpeed + mouseOffset.current.y * 0.3;
      rotation.current.y += 0.00132 * rotSpeed + mouseOffset.current.x * 0.3;

      // Fade out when camera gets very close
      const fadeStart = 1.2;
      const fadeAmount = scrollProgress > fadeStart 
        ? Math.max(0, 1 - (scrollProgress - fadeStart) / 0.3)
        : 1;

      // Draw particles
      particlesRef.current.forEach((particle) => {
        // Start with base sphere positions
        let x = particle.baseX;
        let y = particle.baseY;
        let z = particle.baseZ;

        // Apply sphere expansion/scaling
        // Particles move outward from center as sphere scales up
        x *= sphereScale;
        y *= sphereScale;
        z *= sphereScale;

        // Add particle drift when expanded
        if (sphereScale > 1.5) {
          const driftAmount = (sphereScale - 1.5) * 0.3;
          x += particle.speedX * 200 * driftAmount;
          y += particle.speedY * 200 * driftAmount;
          z += particle.speedZ * 200 * driftAmount;
        }

        // Apply rotation
        const rotatedY = rotateY(x, z, rotation.current.y);
        x = rotatedY.x;
        z = rotatedY.z;

        const rotatedX = rotateX(y, z, rotation.current.x);
        y = rotatedX.y;
        z = rotatedX.z;

        // Project to 2D
        const projected = project(x, y, z, cameraZ);

        // Draw particle if visible
        if (projected.scale > 0 && projected.x >= -50 && projected.x <= width + 50 && 
            projected.y >= -50 && projected.y <= height + 50) {
          // Small, uniform particle size like reference (1-2px dots)
          const size = Math.max(0.8, 1.2 * projected.scale);
          const alpha = projected.alpha * fadeAmount;
          
          // White/light particles like reference image
          const r = 255;
          const g = 255;
          const b = 255;
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Event listeners
    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
