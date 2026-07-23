"use client";

import { useEffect, useRef } from "react";

export default function LiquidGlassShader({
  width = 600,
  height = 400,
  followPointer = true,
  className = "",
  style = {},
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef([0, 0]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    let destroyed = false;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec4 iMouse;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        const float NUM_ZERO = 0.0;
        const float NUM_ONE = 1.0;
        const float NUM_HALF = 0.5;
        const float NUM_TWO = 2.0;
        const float POWER_EXPONENT = 6.0;
        const float LENS_MULTIPLIER = 5000.0;
        const float MASK_MULTIPLIER_1 = 10000.0;
        const float MASK_MULTIPLIER_2 = 9500.0;
        const float MASK_MULTIPLIER_3 = 11000.0;
        const float MASK_STRENGTH_1 = 8.0;
        const float MASK_STRENGTH_2 = 16.0;
        const float MASK_STRENGTH_3 = 2.0;
        const float MASK_THRESHOLD_1 = 0.95;
        const float MASK_THRESHOLD_2 = 0.9;
        const float MASK_THRESHOLD_3 = 1.5;
        const float GRADIENT_RANGE = 0.2;
        const float GRADIENT_OFFSET = 0.1;
        const float GRADIENT_EXTREME = -1000.0;
        const float LIGHTING_INTENSITY = 0.3;

        vec2 uv = fragCoord / iResolution.xy;
        vec2 mouse = iMouse.xy;
        if (length(mouse) < NUM_ONE) {
          mouse = iResolution.xy / NUM_TWO;
        }

        vec2 m2 = (uv - mouse / iResolution.xy);
        float roundedBox = pow(abs(m2.x * iResolution.x / iResolution.y), POWER_EXPONENT) + pow(abs(m2.y), POWER_EXPONENT);

        float rb1 = clamp((NUM_ONE - roundedBox * MASK_MULTIPLIER_1) * MASK_STRENGTH_1, NUM_ZERO, NUM_ONE);
        float rb2 = clamp((MASK_THRESHOLD_1 - roundedBox * MASK_MULTIPLIER_2) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE) -
          clamp(pow(MASK_THRESHOLD_2 - roundedBox * MASK_MULTIPLIER_2, NUM_ONE) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE);
        float rb3 = clamp((MASK_THRESHOLD_3 - roundedBox * MASK_MULTIPLIER_3) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE) -
          clamp(pow(NUM_ONE - roundedBox * MASK_MULTIPLIER_3, NUM_ONE) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE);

        float transition = smoothstep(NUM_ZERO, NUM_ONE, rb1 + rb2);
        float gradient = clamp((clamp(m2.y, NUM_ZERO, GRADIENT_RANGE) + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE) +
          clamp((clamp(-m2.y, GRADIENT_EXTREME, GRADIENT_RANGE) * rb3 + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE);
        vec3 glow = vec3(rb1) * gradient + vec3(rb2) * LIGHTING_INTENSITY;

        fragColor = vec4(glow * transition, transition * 0.4);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "iResolution"),
      time: gl.getUniformLocation(program, "iTime"),
      mouse: gl.getUniformLocation(program, "iMouse"),
    };

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || width;
      const h = canvas.clientHeight || height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      mouseRef.current = [canvas.width / 2, canvas.height / 2];
    };
    setCanvasSize();

    const resizeObserver = new ResizeObserver(() => setCanvasSize());
    resizeObserver.observe(canvas);

    const handlePointerMove = (e: PointerEvent) => {
      if (!followPointer) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (rect.height - (e.clientY - rect.top)) * scaleY;
      mouseRef.current = [x, y];
    };
    if (followPointer) {
      canvas.addEventListener("pointermove", handlePointerMove);
    }

    const startTime = performance.now();
    const render = () => {
      if (destroyed) return;
      const currentTime = (performance.now() - startTime) / 1000;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uniforms.resolution) gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
      if (uniforms.time) gl.uniform1f(uniforms.time, currentTime);
      if (uniforms.mouse) gl.uniform4f(uniforms.mouse, mouseRef.current[0], mouseRef.current[1], 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      destroyed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
  }, [followPointer, width, height]);

  return (
    <div
      className={className}
      style={{
        width,
        height,
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", cursor: followPointer ? "none" : "default" }}
      />
    </div>
  );
}
