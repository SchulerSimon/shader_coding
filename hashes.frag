/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#define PI 3.1415926

/*
better hash than the fract(sin(t*x)*y), especially regarding distribution
from https://www.shadertoy.com/view/4djSRW
*/
float hash11(float p)
{
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

vec2 hash21(float t) {
    float x = fract(sin(t * 587.34) * 93.87);
    float y = fract(sin((t + x) * 877.021) * 276.345);
    return vec2(x, y);
}

vec2 hash21_polar(float t) {
    vec2 rand = hash21(t);
    rand.x *= 2.0 * PI;
    return vec2(sin(rand.x), cos(rand.x)) * rand.y;
}

float hash12(vec2 p) {
    p = fract(p * vec2(983.12, 372.97));
    p += dot(p, p + 498.32);
    return fract(p.x * p.y);
}

// source: https://www.shadertoy.com/view/WttXWX
#define hashi(x)triple32(x)
#define hash(x)(float(hashi(x)) / float(0xffffffffU))
uint triple32(uint x)
{
    x ^ = x >> 17;
    x *= 0xed5ad4bbU;
    x ^ = x >> 11;
    x *= 0xac4c1b51U;
    x ^ = x >> 15;
    x *= 0x31848babU;
    x ^ = x >> 14;
    return x;
}