# shader_coding
have a look at shadertoy.com to see how it works

### default.frag: 
- just how I like to start my new shaders. 
- the `vec2 uv = (fragCoord - 0.5 * iResolution.xy) / (iResolution.x > iResolution.y ? iResolution.y : iResolution.x);` makes sure, that aspect-ratio is capped by x and y (for 16:9 and 9:16 (smartphone etc.))

### hashes.frag: 
- just a collecton of hash-functions that I find useful
- will be extended upon

### grid_madness: 
- just something that came while trying stuff, first ever project. 
- https://www.shadertoy.com/view/mttcD2 

### stardust: 
- tests with inputting last frame of a buffer (BufferA)
- unlisted on shadertoy, because its not really fun to look at. 
- https://www.shadertoy.com/view/mldcDf

### fireworks: 
- my own take very similar to the YouTube-Video https://www.youtube.com/watch?v=xDxAnguEOn8 by The Art of Code
- https://www.shadertoy.com/view/clycDd

### planets: 
- inspired by the menu-screen of GRIS
- I wanted to make somethign that resembles planets and halos
- https://www.shadertoy.com/view/dl3fzr