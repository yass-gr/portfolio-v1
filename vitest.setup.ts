import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

const mockCanvasContext = {
  globalCompositeOperation: "source-over",
  globalAlpha: 1,
  fillStyle: "#000",
  strokeStyle: "#000",
  lineWidth: 1,
  lineCap: "butt" as CanvasLineCap,
  lineJoin: "miter" as CanvasLineJoin,
  font: "10px sans-serif",
  textAlign: "left" as CanvasTextAlign,
  textBaseline: "alphabetic" as CanvasTextBaseline,
  canvas: {} as HTMLCanvasElement,
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  ellipse: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  measureText: vi.fn(() => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0, fontBoundingBoxAscent: 0, fontBoundingBoxDescent: 0 })),
  drawImage: vi.fn(),
  createImageData: vi.fn(() => ({ width: 0, height: 0, data: new Uint8ClampedArray(0) })),
  getImageData: vi.fn(() => ({ width: 0, height: 0, data: new Uint8ClampedArray(0) })),
  putImageData: vi.fn(),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createPattern: vi.fn(() => ({ setTransform: vi.fn() })),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  isPointInPath: vi.fn(() => false),
  isPointInStroke: vi.fn(() => false),
};

CSS.supports = vi.fn(() => true);

HTMLCanvasElement.prototype.getContext = vi.fn((_contextId: string) => mockCanvasContext as unknown as CanvasRenderingContext2D);
