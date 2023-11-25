/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#iChannel0'BufferA'

void mainImage(out vec4 color, in vec2 pixel)
{
    vec2 uv = pixel.xy / iResolution.xy;
    color = vec4(texture(iChannel0, uv).rgb, 1.0);
}
