// Watercolor Fragment Shader
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vElevation;

uniform vec3 uBaseColor;
uniform vec3 uLightColor;
uniform float uTime;
uniform float uPaperTexture;
uniform float uPigmentDensity;
uniform float uEdgeDarkening;

// Noise functions for organic texture
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

// Paper texture simulation
float paperTexture(vec2 uv) {
    float paper = 0.0;
    
    // Fine grain
    paper += noise(uv * 200.0) * 0.1;
    
    // Medium texture
    paper += fbm(uv * 50.0) * 0.15;
    
    // Large fiber patterns
    paper += fbm(uv * 10.0) * 0.1;
    
    return paper;
}

// Pigment spreading effect
float pigmentSpread(vec2 uv, float time) {
    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.1 * time);
    q.y = fbm(uv + vec2(1.0));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.05 * time);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.06 * time);
    
    return fbm(uv + r);
}

// Edge detection for darker borders
float edgeEffect(vec3 normal, vec3 viewDir) {
    float fresnel = 1.0 - abs(dot(normal, viewDir));
    return pow(fresnel, 2.0);
}

void main() {
    // Base color with slight variation
    vec3 color = uBaseColor;
    
    // Add paper texture
    float paper = paperTexture(vUv);
    color = mix(color, color * 0.9, paper * uPaperTexture);
    
    // Pigment concentration effect
    float pigment = pigmentSpread(vUv * 3.0, uTime * 0.5);
    color = mix(color, color * (0.8 + pigment * 0.4), uPigmentDensity);
    
    // Color bleeding at edges (watercolor characteristic)
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float edge = edgeEffect(vNormal, viewDir);
    color = mix(color, color * 0.7, edge * uEdgeDarkening);
    
    // Subtle granulation (pigment particles)
    float granulation = noise(vUv * 300.0);
    color += (granulation - 0.5) * 0.03;
    
    // Elevation-based shading (higher = lighter)
    float elevationShade = 0.9 + vElevation * 0.3;
    color *= elevationShade;
    
    // Light interaction
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    color += uLightColor * diffuse * 0.15;
    
    // Subtle warm/cool variation (watercolor often has this)
    float warmCool = sin(vUv.x * 10.0 + vUv.y * 10.0) * 0.02;
    color.r += warmCool;
    color.b -= warmCool;
    
    // Final color adjustment
    color = clamp(color, 0.0, 1.0);
    
    // Slight desaturation for watercolor look
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray), color, 0.85);
    
    gl_FragColor = vec4(color, 1.0);
}
