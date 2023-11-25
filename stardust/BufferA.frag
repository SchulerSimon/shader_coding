/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

// source: https://forum.unity.com/threads/generate-random-float-between-0-and-1-in-shader.610810/
float random(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123);
}

#iChannel0'BufferA.frag'

void mainImage(out vec4 color, in vec2 pixel)
{
    
    vec2 uv = pixel.xy / iResolution.xy;
    if (random(uv + fract(iTime)) > 0.9995) {
        // choose "random" pixels to be white with a small chance
        color = vec4(1.0);
        return;
    }else {
        // use the data from the frame before and fade to black (-.01)
        color = vec4(texture(iChannel0, uv).rgb, 1.0) - 0.01;
    }
}