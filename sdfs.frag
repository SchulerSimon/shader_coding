/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License

This file is a collection of useful SDF-functions.
Credits are given where due.
*/

/*
Simple line sdf with thickness
from https://iquilezles.org/articles/distfunctions2d/
*/
float line_sdf(vec2 uv, vec2 a, vec2 b, float thickness) {
    float h = min(1.0, max(0.0, dot(uv - a, b - a) / dot(b - a, b - a)));
    return length(uv - a-(b - a) * h) - thickness;
}
float line_sdf(vec2 uv, vec2 a, vec2 b) {
    return line_sdf(uv, a, b, 0.0);
}

/*
Simple circle sdf
from https://iquilezles.org/articles/distfunctions2d/
*/
float circle_sdf(vec2 uv, float radius) {
    return length(uv) - radius;
}

/*
Simple triangle sdf
partly from https://iquilezles.org/articles/distfunctions2d/
*/
float triangle_sdf(vec2 uv, vec2 tip_offset, vec2 wh)
{
    uv -= tip_offset;
    uv.x = abs(uv.x);
    vec2 a = uv - wh*clamp( dot(uv,wh)/dot(wh,wh), 0.0, 1.0 );
    vec2 b = uv - wh*vec2( clamp( uv.x/wh.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( wh.y );
    vec2 d = min( vec2( dot(a,a), s*(uv.x*wh.y-uv.y*wh.x) ),
    vec2( dot(b,b), s*(uv.y-wh.y)  ));
    return -sqrt(d.x)*sign(d.y);
}
float triangle_sdf(vec2 uv, vec2 wh){
    return triangle_sdf(uv, vec2(0., 0.), wh);
}

/*
Rounds a given SDF, does not work properly for
unions or intersections of multiple sdfs
for smooth-union etc. use the functions below
from https://iquilezles.org/articles/distfunctions2d/
*/
float round_sdf(float shape, float radius)
{
    return shape - radius;
}

/*
hollows a given SDF
from https://iquilezles.org/articles/distfunctions2d/
*/
float hollow_sdf(float shape, float radius) {
    return abs(shape) - radius;
}

/*
Calculates the smooth min (polynomial) of two sdfs
there are multiple other smooth min functions
this one is probably the fastest, but it has its drawbacks
from https://iquilezles.org/articles/smin/
*/
float smin_sdf(float shape1, float shape2, float k)
{
    float h = max(k - abs(shape1 - shape2), 0.0) / k;
    return min(shape1, shape2) - h * h * k * (1.0 / 4.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float uv_norm = iResolution.x > iResolution.y ? iResolution.y : iResolution.x;
    // uv normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / uv_norm;
    // mouse normalization from -.5 to .5 no matter the aspect ratio
    vec2 uv_m = (iMouse.xy - 0.5 * iResolution.xy) / uv_norm;
    
    // scaling to see axis and border
    uv *= 2.1;
    uv_m *= 2.1;
    
    // distance
    float d = line_sdf(uv, vec2(-0.5, - 0.5), vec2(0.5, 0.5), 0.05);
    d = smin_sdf(d, circle_sdf(uv, 0.25), 0.2);
    // d = round_sdf(d, 0.02);
    
    // color
    // partly from https://www.shadertoy.com/view/3ltSW2
    vec3 col = (d > 0.0) ? vec3(0.1, 0.2, 0.9) : vec3(1.0, 0.2, 0.1);
    col *= 1.0 - exp2(-10.0 * abs(d));
    col *= 0.8 + 0.2 * cos(100.0 * d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));
    
    // mouse
    // from https://www.shadertoy.com/view/3ltSW2
    if (iMouse.z > 0.001)
    {
        d = line_sdf(uv_m, vec2(-0.5, - 0.5), vec2(0.5, 0.5), 0.05);
        d = smin_sdf(d, circle_sdf(uv_m, 0.25), 0.2);
        // d = round_sdf(d, 0.02);
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, abs(length(uv - uv_m) - abs(d)) - 0.0025));
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, length(uv - uv_m) - 0.015));
    }
    
    // axes and border
    if (abs(uv.x) > 1.0)col.r = 0.3;
    if (abs(uv.y) > 1.0)col.r = 0.3;
    if (length(uv.x) < 1.5 / iResolution.x)col.g = 0.3;
    if (length(uv.y) < 1.5 / iResolution.y)col.g = 0.3;
    if (abs(length(uv.x) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    if (abs(length(uv.y) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    
    fragColor = vec4(col, 1.0);
}