/*
Author: Simon Schuler (https://github.com/SchulerSimon)

Inspired by
- Ben Eater's Boids implementation (https://eater.net/boids)
- Sebastian Lague's Ant and Slime Simulations (https://www.youtube.com/watch?v=X-iSQQgOd1A)
I really wanted to try making my own implementation. So Here it is.

MIT License
*/

// source: https://www.shadertoy.com/view/WttXWX
#define hashi(x)triple32(x)
#define hash(x)(float(hashi(x))/float(0xffffffffU))
uint triple32(uint x)
{
    x^=x>>17;
    x*=0xed5ad4bbU;
    x^=x>>11;
    x*=0xac4c1b51U;
    x^=x>>15;
    x*=0x31848babU;
    x^=x>>14;
    return x;
}

struct Agent{
    vec2 position;
    float angle;
};

void mainImage(out vec4 color,in vec2 pixel)
{
    ;
}