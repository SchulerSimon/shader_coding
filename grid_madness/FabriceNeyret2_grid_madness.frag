void mainImage(out vec4 O, vec2 u)
{
    vec2 R = iResolution.xy,
    U = 20.0 * (u * 2.0 - R) / R.y - iTime,
    S = sin(U);
    
    float s = S.x * S.y;
    s /= fwidth(s);
    
    O = vec4(0.5 + 0.5 * s);
}

