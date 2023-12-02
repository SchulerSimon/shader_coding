/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#define PI 3.1415926

vec3 palette1(in float t)
{
    
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.333, 0.667);
    return a + b*cos(6.28318 * (c * t+d));
}

// input from and to are vec2 with dist, angle
float line(vec2 uv, vec2 from, vec2 to) {
    vec2 a = vec2(sin(from.y), cos(from.y)) * from.x;
    vec2 b = vec2(sin(to.y), cos(to.y)) * to.x;
    float h = min(1.0, max(0.0, dot(uv - a, b - a) / dot(b - a, b - a)));
    return smoothstep(0.005, 0.004, length(uv - a - (b - a) * h));
}

void mainImage(out vec4 color, in vec2 pixel)
{
    float uv_norm = iResolution.x > iResolution.y ? iResolution.y : iResolution.x;
    vec2 uv = (pixel - 0.5 * iResolution.xy) / uv_norm;
    
    vec4 col = vec4(0.0);
    float t = iTime;
    
    // background
    float d = uv.y + 0.5;
    col += 1.0 - d;
    col *= vec4(vec3(0.1, 0.1, 0.1), 0.1);
    
    // mobius band
    for(float i = 0.0; i < 30.0 ; i ++ ) {
        for(float k = 0.0; k < 5.0; k ++ ) {
            float dist = (sin(t * 3.0) * 0.13) + 0.25;
            float angle = fract(t / 5.0) + i + k / 55.0;
            angle *= 2.0 * PI;
            vec2 from = vec2(dist * 1.1, angle);
            
            t -= 0.01 * k;
            dist = (sin(t * 3.0) * 0.13) + 0.26;
            angle = fract(t / 5.0) + i + k / 55.0;
            angle *= 2.0 * PI;
            vec2 to = vec2(dist, angle);
            
            col += vec4(vec3(line(uv, from, to)), 1.0 - 0.2 * k);
        }
    }
    col.rgb *= palette1(iTime / 10.0);
    color = col;
}