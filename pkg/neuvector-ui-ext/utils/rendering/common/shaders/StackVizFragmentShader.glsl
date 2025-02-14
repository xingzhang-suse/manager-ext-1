precision mediump float;
varying vec4 vColor;
varying float vBrightness;

void main() {
    vec3 finalColor = vColor.rgb + (1.0 - vColor.rgb) * (1.0 - vBrightness);
    gl_FragColor = vec4(finalColor, 1.0);
}
