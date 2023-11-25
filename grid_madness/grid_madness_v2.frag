vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b*cos(6.28318 * (c * t+d));
}

vec3 palette1(in float t)
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.10, 0.20);
    return palette(t, a, b, c, d);
}

vec3 palette2(in float t)
{
    vec3 a = vec3(0.408, 0.0, 0.0);
    vec3 b = vec3(0.648, 0.828, 0.0);
    vec3 c = vec3(0.408, 0.318, 0.0);
    vec3 d = vec3(0.968, 0.0, 0.0);
    return palette(t, a, b, c, d);
}

vec3 palette3(in float t)
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return palette(t, a, b, c, d);
}

void mainImage(out vec4 color, in vec2 pixel)
{
    vec2 uv = (pixel * 2.0 - iResolution.xy) / iResolution.y;
    uv *= 20.0;
    
    float scale = 5.0;
    
    vec3 col = vec3(0.0);
    
    float x_mod = mod(uv.x - (iTime * 2.0), 10.0) + sin(uv.x) * 0.5;
    float y_mod = mod(uv.y - (iTime * 2.2), 10.0) - sin(uv.y) * 0.55;
    if (x_mod <= scale||y_mod <= scale) {
        // color grid 1
        col = palette2((uv.y - (iTime * 2.0)) / 100.0)
        - palette2((uv.x - (iTime * 2.0)) / 100.0);
    }
    
    if (x_mod <= scale&&y_mod <= scale) {
        // color grid 2
        col = palette3((uv.x + uv.y) / 40.0);
    }
    
    if (col == vec3(0.0)) {
        // color rest
        col = (palette1((uv.x + iTime * 2.0) / 60.0)
        + palette1((uv.y + iTime * 2.0) / 60.0)) / 2.0;
    }
    
    color = vec4(col, 1.0);
}