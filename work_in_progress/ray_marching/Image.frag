/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License

My take on https://www.youtube.com/watch?v=PGtv-dBi2wE
*/

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DISTANCE 0.01

float get_dist(vec3 p) {
    // sphere is xyz and r in a vec4
    vec4 sphere = vec4(0, 2, 6, 1);
    sphere.y += sin(iTime * 3.0);
    float dist_sphere = length(p - sphere.xyz) - sphere.w;
    float dist_plane = p.y;
    float d = min(dist_sphere, dist_plane);
    return d;
}

float ray_march(vec3 ray_origin, vec3 ray_direction) {
    float dist_origin = 0.0;
    for(int i = 0; i < MAX_STEPS; i ++ ) {
        vec3 p = ray_origin + dist_origin * ray_direction;
        float dist_scene = get_dist(p);
        dist_origin += dist_scene;
        if (dist_scene < SURFACE_DISTANCE || dist_origin > MAX_DIST) {
            break;
        }
    }
    return dist_origin;
}

vec3 get_normal(vec3 p) {
    float d = get_dist(p);
    vec2 e = vec2(0.1, 0);
    vec3 n = d - vec3(
        get_dist(p - e.xyy),
        get_dist(p - e.yxy),
        get_dist(p - e.yyx)
    );
    return normalize(n);
}

float get_light(vec3 p, vec3 light_pos) {
    light_pos.xz += vec2(sin(iTime), cos(iTime)) * 3.0;
    vec3 l = normalize(light_pos - p);
    vec3 n = get_normal(p);
    
    float dif = clamp(dot(n, l), 0.0, 1.0);
    float d = ray_march(p + n*SURFACE_DISTANCE * 2.0, l);
    if (d < length(light_pos - p))dif *= 0.3;
    return dif;
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
    
    vec3 ray_origin = vec3(0, 1, 0);
    vec3 ray_direction = normalize(vec3(uv.x, uv.y, 1));
    
    float d = ray_march(ray_origin, ray_direction);
    
    vec3 p = ray_origin + ray_direction * d;
    
    vec3 light_pos1 = vec3(2, 5, 6);
    vec3 light_pos2 = vec3(-4, 5, 6);
    
    float dif = get_light(p, light_pos1);
    dif *= get_light(p, light_pos2);
    vec3 col = vec3(dif);
    
    fragColor = vec4(col, 1.0);
}