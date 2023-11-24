/*
Author: Simon Schuler (https://github.com/SchulerSimon)

MIT License
*/

#define U0(pixel)texelFetch(iChannel0,ivec2(pixel),0)
#define U1(pixel)texelFetch(iChannel1,ivec2(pixel),0)
#define U2(pixel)texelFetch(iChannel2,ivec2(pixel),0)

#iChannel0'BufferA.frag'

const int max_boids=10;

const float turn_factor=.2;
const float visual_range=20.;
const float protected_range=2.;
const float centering_factor=.0005;
const float avoid_factor=.05;
const float matching_factor=.05;
const float max_speed=3.;
const float mins_peed=2.;

// source: https://forum.unity.com/threads/generate-random-float-between-0-and-1-in-shader.610810/
float random(vec2 uv){
    return fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453123);
}