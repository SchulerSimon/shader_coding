/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

void mainImage(out vec4 color, in vec2 pixel)
{
    float uv_norm = iResolution.x > iResolution.y ? iResolution.y : iResolution.x;
    // uv normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv = (pixel - 0.5 * iResolution.xy) / uv_norm;
    // mouse normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv_m = (iMouse.xy - 0.5 * iResolution.xy) / uv_norm;
    
    // scaling to see axis and border
    uv *= 2.1;
    uv_m *= 2.1;
    
    // draw a light at the mouse-position
    vec3 col = vec3(0.01 / length(uv - uv_m));
    
    // stuff goes here
    
    // axies and border
    if (abs(uv.x) > 1.0)col.r = 0.3;
    if (abs(uv.y) > 1.0)col.r = 0.3;
    if (length(uv.x) < 1.5 / iResolution.x)col.g = 0.3;
    if (length(uv.y) < 1.5 / iResolution.y)col.g = 0.3;
    if (abs(length(uv.x) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    if (abs(length(uv.y) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    
    color = vec4(col, 1.0);
}