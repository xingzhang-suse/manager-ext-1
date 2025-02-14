attribute vec3 aColor;
attribute float aBrightness;

varying vec4 vColor;
varying float vBrightness;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);

    vColor = vec4(aColor, 1.0);
    vBrightness = aBrightness;
}
