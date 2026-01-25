export const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Clean - No distortion
  // Optional: Add very subtle parallax or scale on hover if desired later, 
  // but for now keeping it perfectly flat as requested.

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // clean texture - no grain, no aberration
  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
}
`;

// --- HERO SHADERS ---

// --- HERO SHADERS ---

export const heroVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vUv = uv;
  vec3 pos = position;

  // 1. Idle Floating (Subtle Life)
  // Kept very small so it looks "still" but not "broken"
  float noiseVal = snoise(vec2(pos.x + uTime * 0.1, pos.y + uTime * 0.1));
  pos.z += noiseVal * 0.05; 

  // 2. Mouse Repulsion/Attraction
  float dist = distance(uv, uMouse);
  // FIX: Standard smoothstep order (min, max) then invert
  // Widen radius slightly to 0.35
  float influence = 1.0 - smoothstep(0.0, 0.35, dist); 
  
  // Push vertices away from mouse
  vec2 dir = normalize(uv - uMouse);
  pos.x += dir.x * influence * 0.15; // Tasteful X-push
  pos.y += dir.y * influence * 0.15; // Tasteful Y-push
  pos.z += influence * 0.6; // Tasteful Z bump (visible but not broken)

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const heroFragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  float dist = distance(uv, uMouse);
  float maxDist = 0.35; // Match vertex radius
  float strength = (1.0 - smoothstep(0.0, maxDist, dist)) * 0.03; // Subtle distortion
  
  // Perturb UV
  uv += strength * vec2(sin(uTime + uv.y * 10.0), cos(uTime + uv.x * 10.0));

  vec4 color = texture2D(uTexture, uv);

  // Interaction Feedback: Subtle brightness only (Removed debug flash)
  // color.rgb += strength * 10.0; 

  gl_FragColor = color;
}
`;
