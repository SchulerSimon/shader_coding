/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

float dot2(in vec2 v) { return dot(v, v); }

float sdBezier(in vec2 pos, in vec2 A, in vec2 B, in vec2 C)
{
    vec2 a = B - A;
    vec2 b = A - 2.0 * B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    float kk = 1.0 / dot(b, b);
    float kx = kk * dot(a, b);
    float ky = kk * (2.0 * dot(a, a) + dot(d, b)) / 3.0;
    float kz = kk * dot(d, a);
    float res = 0.0;
    float p = ky - kx * kx;
    float p3 = p*p * p;
    float q = kx * (2.0 * kx * kx - 3.0 * ky) + kz;
    float h = q*q + 4.0 * p3;
    if (h >= 0.0)
    {
        h = sqrt(h);
        vec2 x = (vec2(h, - h) - q) / 2.0;
        vec2 uv = sign(x) * pow(abs(x), vec2(1.0 / 3.0));
        float t = clamp(uv.x + uv.y - kx, 0.0, 1.0);
        res = dot2(d + (c + b*t) * t);
    }
    else
    {
        float z = sqrt(-p);
        float v = acos(q / (p * z*2.0)) / 3.0;
        float m = cos(v);
        float n = sin(v) * 1.732050808;
        vec3 t = clamp(vec3(m + m, - n-m, n - m) * z-kx, 0.0, 1.0);
        res = min(dot2(d + (c + b*t.x) * t.x),
        dot2(d + (c + b*t.y) * t.y));
        // the third root cannot be the closest
        // res = min(res,dot2(d+(c+b*t.z)*t.z));
    }
    return sqrt(res);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / (iResolution.x > iResolution.y ? iResolution.y : iResolution.x);
    vec3 col = vec3(0);
    uv *= 3.0;
    
    vec2 uv_m = (iMouse.xy - 0.5 * iResolution.xy) / (iResolution.x > iResolution.y ? iResolution.y : iResolution.x);
    uv_m *= 3.0;
    
    // define 3 points for bezier
    vec2 v0 = vec2(1.3, 0.9) * cos(1.0 * 0.5 + vec2(0.0, 5.0));
    vec2 v1 = vec2(1.3, 0.9) * cos(1.0 * 0.6 + vec2(3.0, 4.0));
    vec2 v2 = vec2(1.3, 0.9) * cos(1.0 * 0.7 + vec2(2.0, 0.0));
    
    float d = sdBezier(uv, v0, v1, v2);
    float f = smoothstep(-0.2, 0.2, cos(2.0 * 1.0));
    col = vec3(1.0) - vec3(0.1, 0.4, 0.7) * mix(sign(d), 1.0, f);
    col *= 1.0 - exp(-4.0 * abs(d));
    col *= 0.8 + 0.2 * cos(140.0 * d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));
    
    if (iMouse.z > 0.001)
    {
        d = sdBezier(uv_m, v0, v1, v2);
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, abs(length(uv - uv_m) - abs(d)) - 0.0025));
        col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, length(uv - uv_m) - 0.015));
    }
    
    if (abs(uv.x) < 3.0 / iResolution.x)col.g = 1.0;
    if (abs(uv.y) < 3.0 / iResolution.y)col.r = 1.0;
    
    fragColor = vec4(col, 1.0);
}

// void mainImage(out vec4 fragColor, in vec2 fragCoord)
// {
    
    //     float f = smoothstep(-0.2, 0.2, cos(2.0 * iTime));
    //     vec3 col = vec3(1.0) - vec3(0.1, 0.4, 0.7) * mix(sign(d), 1.0, f);
    //     col *= 1.0 - exp(-4.0 * abs(d));
    //     col *= 0.8 + 0.2 * cos(140.0 * d);
    //     col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.015, abs(d)));
    
    //     if (iMouse.z > 0.001)
    //     {
        //         d = sdBezier(m, v0, v1, v2);
        //         col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, abs(length(p - m) - abs(d)) - 0.0025));
        //         col = mix(col, vec3(1.0, 1.0, 0.0), 1.0 - smoothstep(0.0, 0.005, length(p - m) - 0.015));
    //     }
    
    //     if (cos(0.5 * iTime) <- 0.5)
    //     {
        //         d = min(udSegment(p, v0, v1),
        //         udSegment(p, v1, v2));
        //         d = min(d, length(p - v0) - 0.02);
        //         d = min(d, length(p - v1) - 0.02);
        //         d = min(d, length(p - v2) - 0.02);
        //         col = mix(col, vec3(1, 0, 0), 1.0 - smoothstep(0.0, 0.007, d));
    //     }
    
    //     fragColor = vec4(col, 1.0);
// }