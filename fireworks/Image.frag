#define NUM_PARTICLES 75.0
#define NUM_EXPLOSIONS 5.0
#define PI 3.1415926

float hash11(float t) {
    return fract(sin(t * 6857.92) * 98.3);
}

vec2 hash12(float t) {
    float x = fract(sin(t * 587.34) * 93.87);
    float y = fract(sin((t + x) * 877.021) * 276.345);
    return vec2(x, y);
}

vec2 hash12_polar(float t) {
    vec2 rand = hash12(t);
    rand.x *= 2.0 * PI;
    return vec2(sin(rand.x), cos(rand.x)) * rand.y;
}

float hash21(vec2 p) {
    p = fract(p * vec2(983.12, 372.97));
    p += dot(p, p + 498.32);
    return fract(p.x * p.y);
}

float explosion(vec2 uv, float t) {
    float sparks = 0.0;
    for(float i = 0.0; i < NUM_PARTICLES; i ++ ) {
        vec2 dir = hash12_polar(i + 1.0) * 0.5;
        float d = length(uv - dir * t);
        float brightness = mix(0.0002, 0.0005, smoothstep(0.05, 0.0, t));
        brightness *= sin(t * 20.0 + i) * 0.33 + 0.66;
        brightness *= smoothstep(t, 1.0, 0.85);
        sparks += brightness / d;
    }
    return sparks;
}

vec3 explosions(vec2 uv, float t) {
    vec3 col = vec3(0);
    for(float i = 0.0; i < NUM_EXPLOSIONS; i ++ ) {
        t += i / NUM_EXPLOSIONS;
        t *= 0.3 + hash11(i + 1.0) * 0.7;
        float ft = floor(t);
        vec3 expl_color = sin(vec3(0.23, 0.58, 0.97) * ft * 30.0) * 0.33 + 0.66;
        vec2 offset = hash12(i + 9.0 + ft) - 0.5;
        offset *= vec2(0.9, 0.9);
        col += explosion(uv - offset, fract(t)) * expl_color;
    }
    return col *= 1.5;
}

vec3 stars(vec2 uv, float t) {
    vec3 col = vec3(0);
    t *= 0.04;
    float twinkle = dot(length(sin(uv + t)), length(cos(uv * vec2(8.3, 6.2) - t * 3.0)));
    twinkle = sin(twinkle * 40.0) * 0.5 + 0.5;
    twinkle *= 0.4;
    float stars = pow(hash21(uv), 200.0) * twinkle;
    col += stars;
    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.x;
    vec3 col = vec3(0);
    // stars
    col += stars(uv, iTime);
    
    // explosions
    col += explosions(uv, iTime);
    
    fragColor = vec4(col, 1.0);
}