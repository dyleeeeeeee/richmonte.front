/**
 * Mathematical helper functions for procedural animations
 * Used for particle positioning, wave motions, and transformations
 */

/**
 * Convert spherical coordinates (r, θ, φ) to Cartesian (x, y, z)
 * @param radius - Distance from origin
 * @param theta - Azimuthal angle (horizontal rotation)
 * @param phi - Polar angle (vertical angle from z-axis)
 */
export function sphericalToCartesian(
  radius: number,
  theta: number,
  phi: number
): { x: number; y: number; z: number } {
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi),
  };
}

/**
 * 3D rotation matrix around X-axis
 */
export function rotateX(
  y: number,
  z: number,
  angle: number
): { y: number; z: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    y: y * cos - z * sin,
    z: y * sin + z * cos,
  };
}

/**
 * 3D rotation matrix around Y-axis
 */
export function rotateY(
  x: number,
  z: number,
  angle: number
): { x: number; z: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    z: x * sin + z * cos,
  };
}

/**
 * 3D rotation matrix around Z-axis
 */
export function rotateZ(
  x: number,
  y: number,
  angle: number
): { x: number; y: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

/**
 * Project 3D point to 2D screen space with perspective
 * @param x - X coordinate in 3D space
 * @param y - Y coordinate in 3D space
 * @param z - Z coordinate in 3D space (depth)
 * @param distance - Camera distance from origin
 * @param perspective - Perspective strength
 */
export function project3Dto2D(
  x: number,
  y: number,
  z: number,
  distance: number,
  perspective: number = 1000
): {
  x: number;
  y: number;
  scale: number;
  alpha: number;
} {
  const fov = perspective / (perspective + z + distance);
  return {
    x: x * fov,
    y: y * fov,
    scale: fov,
    alpha: Math.max(0, Math.min(1, fov * 1.2)),
  };
}

/**
 * Parametric wave function for organic motion
 * @param t - Time or position parameter
 * @param amplitude - Wave height
 * @param frequency - Wave frequency
 * @param phase - Phase offset
 */
export function wave(
  t: number,
  amplitude: number,
  frequency: number,
  phase: number = 0
): number {
  return amplitude * Math.sin(frequency * t + phase);
}

/**
 * Smooth interpolation (easing function)
 * @param t - Progress value between 0 and 1
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Cubic easing
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Calculate distance between two 2D points
 */
export function distance2D(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Calculate distance between two 3D points
 */
export function distance3D(
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
}
