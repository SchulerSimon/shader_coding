/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License

I always wondered why most shaders expect an aspect-ratio where x > y.

This script fixes that.
*/

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float uv_norm = iResolution.x > iResolution.y ? iResolution.y : iResolution.x;
    // uv normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / uv_norm;
    // mouse normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv_m = (iMouse.xy - 0.5 * iResolution.xy) / uv_norm;
    
    // draw a light at the mouse-position
    vec3 col = vec3(0.01 / length(uv - uv_m));
    
    // stuff goes here
    
    fragColor = vec4(col, 1.0);
}