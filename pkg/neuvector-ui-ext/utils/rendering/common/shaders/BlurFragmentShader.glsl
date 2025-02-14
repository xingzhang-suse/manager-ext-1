/**
 * One-directional gaussian(ish) blur.  A standard blur (the inner loop) has been
 * extended a bit (the outer loop) to prevent artefacts when zooming in.
 */
uniform sampler2D tDiffuse;
uniform sampler2D tBlur;
uniform vec2 dir;

varying vec2 vUv;

const float offsets[5] = float[](0.0, -0.25, 0.25, -0.6, 0.6);

void main() {
    float z = texture2D(tBlur, vUv).g;
    if(z == 0.0) {
        vec4 sum = vec4(0.0);
        for(int i = 0; i < 5; i++) {
            vec2 c = vUv + offsets[i] * dir;

          // sigma =~ 2.65
            sum += texture2D(tDiffuse, c) * 0.1633;
            sum += texture2D(tDiffuse, c - 1.0 * dir) * 0.1531;
            sum += texture2D(tDiffuse, c + 1.0 * dir) * 0.1531;
            sum += texture2D(tDiffuse, c - 2.0 * dir) * 0.12245;
            sum += texture2D(tDiffuse, c + 2.0 * dir) * 0.12245;
            sum += texture2D(tDiffuse, c - 3.0 * dir) * 0.0918;
            sum += texture2D(tDiffuse, c + 3.0 * dir) * 0.0918;
            sum += texture2D(tDiffuse, c - 4.0 * dir) * 0.051;
            sum += texture2D(tDiffuse, c + 4.0 * dir) * 0.051;
        }

        gl_FragColor = sum / 5.0;
    } else {
        gl_FragColor = texture2D(tDiffuse, vec2(vUv.x, vUv.y));
    }
}