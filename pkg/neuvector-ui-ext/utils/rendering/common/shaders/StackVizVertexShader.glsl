uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform sampler2D colors;
uniform float brightness;

attribute float aColorId;
attribute vec3 position;

varying vec4 vColor;
varying float vBrightness;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vec4 color = texture2D(colors, vec2(aColorId / 2.0, 0.0));
    vColor = color;
    vBrightness = brightness;
}
