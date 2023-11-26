/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
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

/*
I hate this!

its so interesting looking, yet so wrong.

SDFs are hard.....
*/
float leaf_sdf(vec2 uv) {
    uv *= 1.1;
    float d = 0.0;
    uv.x = abs(uv.x);
    d = line_sdf(uv, vec2(0.0, - 1.1), vec2(0.0, 1.0));
    d = min(d, line_sdf(uv, vec2(0.0, - 1.0), vec2(0.25, - 1.0)));
    d = min(d, line_sdf(uv, vec2(0.25, - 1.0), vec2(0.5, - 0.75)));
    d = min(d, line_sdf(uv, vec2(0.5, - 0.75), vec2(0.5, - 0.25)));
    d = min(d, line_sdf(uv, vec2(0.5, - 0.25), vec2(0.25, 0.25)));
    d = min(d, line_sdf(uv, vec2(0.25, 0.25), vec2(0.0, 1.0)));
    d = min(d, line_sdf(uv, vec2(0.0, - 1.0), vec2(0.25, - 0.75)));
    d = min(d, line_sdf(uv, vec2(0.0, - 0.75), vec2(0.25, - 0.5)));
    d = min(d, line_sdf(uv, vec2(0.0, - 0.5), vec2(0.25, - 0.25)));
    d = min(d, line_sdf(uv, vec2(0.0, - 0.25), vec2(0.13, 0.0)));
    d = min(d, line_sdf(uv, vec2(0.0, 0.0), vec2(0.07, 0.38)));
    d = round_sdf(d, 0.02);
    return d;
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
    float d = leaf_sdf(uv);
    
    vec3 col = vec3(0.1, 1.0 - smoothstep(0.01, 0.07, d), 0.0);
    
    // // axes and border
    // if (abs(uv.x) > 1.0)col.r = 0.3;
    // if (abs(uv.y) > 1.0)col.r = 0.3;
    // if (length(uv.x) < 1.5 / iResolution.x)col.g = 0.3;
    // if (length(uv.y) < 1.5 / iResolution.y)col.g = 0.3;
    // if (abs(length(uv.x) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    // if (abs(length(uv.y) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    
    fragColor = vec4(col, 1.0);
}