/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#define PI 3.1415926

float line_sdf(vec2 uv, vec2 a, vec2 b, float thickness) {
    float h = min(1.0, max(0.0, dot(uv - a, b - a) / dot(b - a, b - a)));
    return length(uv - a-(b - a) * h) - thickness;
}

float line_sdf(vec2 uv, vec2 a, vec2 b) {
    return line_sdf(uv, a, b, 0.0);
}

float circle_sdf(vec2 uv, float radius) {
    return length(uv) - radius;
}

// TODO, sdf that splits the plane in 2
float signed_line_sdf(vec2 uv, vec2 a, vec2 b) {
    return 0.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float uv_norm = iResolution.x > iResolution.y ? iResolution.y : iResolution.x;
    // uv normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / uv_norm;
    // mouse normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv_m = (iMouse.xy - 0.5 * iResolution.xy) / uv_norm;
    uv *= 2.1;
    uv_m *= 2.1;
    
    // distance
    float d = line_sdf(uv, vec2(-1.0, - 1.0) * 0.5, vec2(1.0, 1.0) * 0.5, 0.1);
    
    // color
    vec3 col = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    col *= 1.0 - exp2(-10.0 * abs(d));
    col *= 0.8 + 0.2 * cos(100.0 * d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));
    
    // mouse
    if (iMouse.z > 0.001)
    {
        d = line_sdf(uv_m, vec2(-1.0, - 1.0) * 0.5, vec2(1.0, 1.0) * 0.5, 0.1);
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, abs(length(uv - uv_m) - abs(d)) - 0.0025));
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, length(uv - uv_m) - 0.015));
    }
    
    // stuff goes here
    if (abs(uv.x) > 1.0)col.r = 0.3;
    if (abs(uv.y) > 1.0)col.r = 0.3;
    if (length(uv.x) < 1.5 / iResolution.x)col.g = 0.3;
    if (length(uv.y) < 1.5 / iResolution.y)col.g = 0.3;
    if (abs(length(uv.x) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    if (abs(length(uv.y) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    
    fragColor = vec4(col, 1.0);
}