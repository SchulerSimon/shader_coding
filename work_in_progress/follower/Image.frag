/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

float hash11(float p)
{
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}
float hash11_even(float t) {
    return (hash11(t) - 0.5) * 2.0;
}

float sequence_even(float t) {
    return (cos(sin(t * 0.7) + sin(t * 0.2) - sin(t * 0.02) + sin(t * 0.1)) * 0.5) * 1.3;
}

vec2 hash12(float t) {
    float x = fract(sin(t * 587.34) * 93.87);
    float y = fract(sin((t + x) * 877.021) * 276.345);
    return vec2(x, y);
}

float _dot(vec2 uv, vec2 a, float th) {
    return smoothstep(0.03 , 0.003, length(uv - a));
}

float line(vec2 uv, vec2 a, vec2 b) {
    float thickness_line = 0.0015;
    float h = min(1.0, max(0.0, dot(uv - a, b - a) / dot(b - a, b - a)));
    return smoothstep(0.01, 0.001, length(uv - a - (b - a) * h));
}

float segment(vec2 uv, vec2 a, vec2 b, float th) {
    float brightness_line = 0.66;
    float d = 0.0;
    d += _dot(uv, b, th);
    d += line(uv, a, b);
    return d;
}

float wave(vec2 uv, float id) {
    float d = 0.0;
    float num_segments = 20.0;
    float segment_distance = 2.0 / num_segments;
    vec2 last_point = vec2(1.0, 0.0 + sequence_even(id));
    d += _dot(uv, last_point, 0.02);
    for(float i = 1.0; i < num_segments + 1.0; i ++ ) {
        vec2 next_point = vec2(1.0 - i*segment_distance, 0.0 + sequence_even(id - i));
        d += segment(uv, next_point, last_point, 0.01);
        last_point = next_point;
    }
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
    float d = 0.0;
    
    float t = iTime * 10.0;
    float id = floor(t);
    float tf = fract(t);
    
    float num_segments = 5.0;
    float num_lines = 5.0;
    float segment_distance = (2.0 / num_segments);
    
    // vec2 last_point = vec2(1.0, hash11_even(id));
    // for(float i; i < num_segments; i ++ ) {
        //     vec2 current_point = vec2(0.95 - 0.05 * i, (hash11_even(id - (1.0 + i))));
        //     d += segment(uv, current_point, last_point);
        //     last_point = current_point;
    // }
    d += wave(uv, id);
    vec3 col = vec3(d);
    
    // axies and border
    if (abs(uv.x) > 1.0)col.r = 0.3;
    if (abs(uv.y) > 1.0)col.r = 0.3;
    if (length(uv.x) < 1.5 / iResolution.x)col.g = 0.3;
    if (length(uv.y) < 1.5 / iResolution.y)col.g = 0.3;
    if (abs(length(uv.x) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    if (abs(length(uv.y) - 0.5) < 1.5 / iResolution.x)col.g = 0.3;
    
    fragColor = vec4(col, 1.0);
}