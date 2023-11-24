/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / (iResolution.x > iResolution.y ? iResolution.y : iResolution.x);
    vec3 col = vec3(0);
    
    // here
    
    fragColor = vec4(col, 1.0);
}