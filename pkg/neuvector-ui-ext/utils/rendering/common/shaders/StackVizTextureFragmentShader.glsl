uniform sampler2D uTexture;

varying vec2 vUv;
varying float vBrightness;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  color.rgb *= vBrightness;
  gl_FragColor = color;
}
