/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#include'Common.frag'

vec4 initialize_boid(vec4 boid, int x, int y) {
    // if boid is uninitialized, we give it random values
    float boid_x = random(vec2(y, x));
    float boid_y = random(vec2(y, x));
    float boid_vx = random(vec2(x, int(random(vec2(x, y)))));
    float boid_vy = random(vec2(y, int(random(vec2(y, x)))));
    boid = vec4(boid_x, boid_y, boid_vx, boid_vy);
    return boid;
}

vec4 process_boid(vec4 boid, int x, int y) {
    // counting boids:
    int count1 = 0;
    // boid behaviour consts:
    float close_dx = 0.0;
    float close_dy = 0.0;
    float xpos_avg = 0.0;
    float ypos_avg = 0.0;
    float xvel_avg = 0.0;
    float yvel_avg = 0.0;
    int neighboring_boids = 0;
    // loop over all other boids
    for(int x1 = 0; x1 < int(iResolution.x); x1 ++ ) {
        if (count1 >= max_boids) {
            break;
        }
        for(int y1 = 0; y1 < int(iResolution.y); y1 ++ ) {
            count1 += 1;
            if (count1 >= max_boids) {
                break;
            }
            // discard this boid
            if (x == x1&&y == y1) {
                continue;
            }
            
            // get the other_boid from the texture
            vec4 other = texture(iChannel0, vec2(x1, y1));
            // calculate the distance of this boid to the other boid
            float dx = boid.x - other.x;
            float dy = boid.y - other.y;
            
            // are both differences less than the visual range?
            if (abs(dx) < visual_range&&abs(dy) < visual_range) {
                // if so, we calculate the squared distance
                float squared_distance = dx * dx + dy * dy;
                
                // is squared distance less than protected range?
                if (squared_distance < protected_range * protected_range) {
                    // if so, we calculate difference in x/y coordinates to near boid
                    close_dx += boid.x - other.x;
                    close_dy += boid.y - other.y;
                    
                    // if not in protected range, is the boid in visual range?
                }else if (squared_distance < visual_range * visual_range) {
                    // add other boid's x/y-coord and x/y vel to accumulator variables
                    xpos_avg += other.x;
                    ypos_avg += other.y;
                    xvel_avg += other.z;
                    yvel_avg += other.w;
                    
                    // increment number of boids within visual range
                    neighboring_boids += 1;
                }
            }
        }
    }
    
    // if there are boids in the visual range
    if (neighboring_boids > 0) {
        // divide accumulator variables by number of boids in visual range
        xpos_avg = xpos_avg / float(neighboring_boids);
        ypos_avg = ypos_avg / float(neighboring_boids);
        xvel_avg = xvel_avg / float(neighboring_boids);
        yvel_avg = yvel_avg / float(neighboring_boids);
        
        // add the centering/matching contributions to velocity
        boid.z = (boid.z + (xpos_avg - boid.x) * centering_factor + (xvel_avg - boid.z) * matching_factor);
        
        boid.w = (boid.w + (ypos_avg - boid.y) * centering_factor + (yvel_avg - boid.w) * matching_factor);
    }
    // add the avoidance contribution to velocity
    boid.z = boid.z + (close_dx * avoid_factor);
    boid.w = boid.w + (close_dy * avoid_factor);
    return boid;
    
    // if the boid is near an edge, make it turn by turnfactor
    // if(boid.y>iResolution-20.){
        //     boid.w=boid.w+turnfactor
    // }
    // if outside right margin:
    // boid.vx=boid.vx-turnfactor
    // if outside left margin:
    // boid.vx=boid.vx+turnfactor
    // if outside bottom margin:
    // boid.vy=boid.vy-turnfactor
}

void mainImage(out vec4 color, in vec2 pixel)
{
    vec2 uv = pixel.xy / iResolution.xy;
    int count = 0;
    int count1 = 0;
    // a boid is represented by a vec4.
    // Convieiently the color of each pixel is also a vec4.
    // So we can store one boid per pixel.
    // loop over all pixels in the image
    for(int x = 0; x < int(iResolution.x); x ++ ) {
        // break the loops when we have reached our max_boids number
        if (count >= max_boids) {
            break;
        }
        
        for(int y = 0; y < int(iResolution.y); y ++ ) {
            // count when to break the loops
            count += 1;
            if (count >= max_boids) {
                break;
            }
            
            // load the boid
            vec4 boid = texture(iChannel0, vec2(x, y));
            if (boid == vec4(0.0)) {
                color = initialize_boid(boid, x, y);
            }else {
                color = process_boid(boid, x, y);
            }
        }
    }
    
    // if(random(uv+fract(iTime))>.9995){
        //     // choose "random" pixels to be white with a small chance
        //     color=vec4(1.);
    // }else{
        //     // use the data from the frame before and fade to black (-.01)
        //     color=vec4(texture(iChannel0,uv).rgb,1.)-.01;
    // }
}