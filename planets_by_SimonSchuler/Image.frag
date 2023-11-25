/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#define PI 3.1415926

float hash11(float t) {
    return fract(sin(t * 6857.92) * 98.3);
}

vec3 circle(vec2 uv, float size, float thickness, float brightness, float time, bool fill) {
    // calculate the circle as float d
    float d = length(uv) - size;
    if (!fill) {
        d = abs(d);
    }
    d = (1.0 - smoothstep(0.0, thickness, d)) * brightness;
    
    // calculate the position on the circle that corresponds to time
    float angle = fract(time) * 2.0 * PI;
    vec2 pos = vec2(sin(angle), cos(angle)) * size;
    
    // return pos, d
    return vec3(pos, d);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / (iResolution.x > iResolution.y ? iResolution.y : iResolution.x);
    
    uv *= 1.9;
    
    vec3 col = vec3(0.0);
    
    float t = iTime + hash11(1.283) * 100.0;
    
    // some constants
    float planet_thickness = 0.007;
    float planet_halo_thickness = 0.007;
    float moon_thickness = 0.0065;
    float moon_halo_thickness = 0.006;
    
    // the sun
    vec3 sun = vec3(0.025 / (2.0 * length(uv))) * vec3(1.0, 1.0, 0.7);
    col = max(col, sun);
    
    vec3 planet0_halo1 = circle(uv, 0.06, planet_halo_thickness, 0.2, 0.0, false);
    vec3 planet0_halo2 = circle(uv, 0.066, planet_halo_thickness, 0.4, 0.0, false);
    vec3 planet0_halo3 = circle(uv, 0.075, planet_halo_thickness, 0.2, 0.0, false);
    col = max(col, vec3(planet0_halo1.z) * vec3(1.0, 0.8, 0.78));
    col = max(col, vec3(planet0_halo2.z) * vec3(1.0, 0.8, 0.78));
    col = max(col, vec3(planet0_halo3.z) * vec3(1.0, 0.8, 0.78));
    
    vec3 planet1_halo = circle(uv, 0.1, planet_halo_thickness, 0.4, t / 4.0, false);
    vec3 planet1 = circle(uv - planet1_halo.xy, 0.004, planet_thickness, 1.0, t, true);
    col = max(col, vec3(planet1_halo.z) * vec3(1.0, 0.8, 0.75));
    col = max(col, vec3(planet1.z) * vec3(0.9, 0.71, 0.66));
    
    vec3 planet2_halo = circle(uv, 0.23, planet_halo_thickness, 0.35, t / 7.5, false);
    vec3 planet2 = circle(uv - planet2_halo.xy, 0.004, planet_thickness, 1.0, t, true);
    col = max(col, vec3(planet2_halo.z) * vec3(1.0, 0.9, 0.9));
    col = max(col, vec3(planet2.z) * vec3(1.0, 0.9, 0.9));
    
    vec3 moon2_halo = circle(uv - planet2_halo.xy, 0.035, moon_halo_thickness, 0.7, - t / 2.3, false);
    vec3 moon2 = circle(uv - (planet2_halo.xy + moon2_halo.xy), 0.002, moon_thickness, 1.0, t, true);
    col = max(col, vec3(moon2_halo.z));
    col = max(col, vec3(moon2.z));
    
    vec3 planet3_halo = circle(uv, 0.43, planet_halo_thickness, 0.3, t / 10.1, false);
    vec3 planet3 = circle(uv - planet3_halo.xy, 0.025, planet_thickness, 0.8, t / 3.7, true);
    vec3 planet3_p_halo1 = circle(uv - planet3_halo.xy, 0.035, moon_halo_thickness, 0.5, t / 2.3, false);
    vec3 planet3_p_halo2 = circle(uv - planet3_halo.xy, 0.045, moon_halo_thickness, 0.8, t / 2.3, false);
    col = max(col, vec3(planet3_halo.z));
    col = max(col, vec3(planet3.z) * vec3(0.9, 1.0, 1.0));
    col = max(col, vec3(planet3_p_halo1.z));
    col = max(col, vec3(planet3_p_halo2.z));
    
    vec3 planet3b_halo1 = circle(uv, 0.561, planet_halo_thickness, 0.2, 0.0, false);
    vec3 planet3b_halo2 = circle(uv, 0.565, planet_halo_thickness, 0.5, 0.0, false);
    vec3 planet3b_halo3 = circle(uv, 0.57, planet_halo_thickness, 0.1, 0.0, false);
    vec3 planet3b_halo4 = circle(uv, 0.58, planet_halo_thickness, 0.3, 0.0, false);
    vec3 planet3b_halo5 = circle(uv, 0.595, planet_halo_thickness, 0.8, 0.0, false);
    col = max(col, vec3(planet3b_halo1.z) * vec3(0.9, 0.95, 0.98) * 0.7);
    col = max(col, vec3(planet3b_halo2.z) * vec3(0.95, 0.95, 1.0) * 0.7);
    col = max(col, vec3(planet3b_halo3.z) * vec3(0.95, 0.95, 1.1) * 0.7);
    col = max(col, vec3(planet3b_halo4.z) * vec3(0.9, 0.9, 1.0) * 0.7);
    col = max(col, vec3(planet3b_halo5.z) * vec3(0.9, 0.9, 0.87) * 0.7);
    
    vec3 planet4_halo = circle(uv, 0.8, planet_halo_thickness, 0.55, t / 17.3, false);
    vec3 planet4 = circle(uv - planet4_halo.xy, 0.025, planet_thickness, 0.75, t / 3.7, true);
    vec3 planet4_p_halo1 = vec3(0.0);
    for(float i = 0.0; i < 3.0; i ++ ) {
        vec3 p4_p_h1 = circle(uv - planet4_halo.xy, (0.035 + i*0.005), moon_halo_thickness, 0.5 - 0.1 * i, t / (2.7 * ((hash11(i + 1.0) * 2.0) - 1.0)), false);
        vec3 p4_moon = circle(uv - (planet4_halo.xy + p4_p_h1.xy), 0.002, moon_thickness, 0.7, 0.0, true);
        planet4_p_halo1 = max(planet4_p_halo1, p4_p_h1);
        planet4_p_halo1 = max(planet4_p_halo1, p4_moon);
    }
    col = max(col, vec3(planet4_halo.z));
    col = max(col, vec3(planet4.z) * vec3(1.0, 0.8, 0.8));
    col = max(col, vec3(planet4_p_halo1.z));
    
    fragColor = vec4(col, 1.0);
    
    // ideas:
    
    // dotted halo lines
    // and or halo lines with gap at planet place
    
    // mass parameter that gives speed of object,
    // so that smaller objects move slower
    
    // tilt xy-plane into third dimension.
    // have every halo be slightly differently tilted
    // for a real 3d effect
}