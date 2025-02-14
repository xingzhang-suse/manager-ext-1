uniform float brightness;

varying vec2 vUv;
varying float vBrightness;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
  vBrightness = brightness;

}
