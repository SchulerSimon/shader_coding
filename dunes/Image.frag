vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d)
{
    return a + b*cos(6.28318 * (c * t+d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // vec3 a=vec3(.5,.5,.5);
    // vec3 b=vec3(.5,.5,.5);
    // vec3 c=vec3(1.,1.,1.);
    // vec3 d=vec3(0.,.10,.20);
    
    // vec3 a=vec3(.5,.5,.5);
    // vec3 b=vec3(.5,.5,.5);
    // vec3 c=vec3(1.,1.,1.);
    // vec3 d=vec3(0.,.33,.67);
    
    // vec3 a=vec3(.408,0.,0.);
    // vec3 b=vec3(.648,.828,0.);
    // vec3 c=vec3(.408,.318,0.);
    // vec3 d=vec3(.968,0.,0.);
    
    vec3 a = vec3(0.408, 0.048, 0.0);
    vec3 b = vec3(0.648, 0.378, 0.0);
    vec3 c = vec3(0.600, 0.538, 0.0);
    vec3 d = vec3(-0.292, - 0.252, 0.0);
    
    float PI = 3.141592653589793;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = ((fragCoord / iResolution.xy) * 2.0) - 1.0;
    
    vec3 col;
    
    for(float x = 0.0; x <= 1.0; x += 0.009003) {
        if ((sin(uv.x - x*10000.0) / 5.0) > uv.y + x-0.6) {
            col = palette(x + cos(iTime / 10.0), a, b, c, d);
        }
    }
    
    // Output to screen
    fragColor = vec4(col, 1.0);
}