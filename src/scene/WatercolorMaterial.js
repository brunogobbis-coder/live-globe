import * as THREE from 'three';
import watercolorVert from '../shaders/watercolor.vert';
import watercolorFrag from '../shaders/watercolor.frag';

export class WatercolorMaterial extends THREE.ShaderMaterial {
    constructor(baseColor = 0x4a90d9) {
        const color = new THREE.Color(baseColor);
        
        super({
            uniforms: {
                uBaseColor: { value: color },
                uLightColor: { value: new THREE.Color(0xffffff) },
                uTime: { value: 0 },
                uPaperTexture: { value: 0.5 },
                uPigmentDensity: { value: 0.6 },
                uEdgeDarkening: { value: 0.4 },
                uNoiseScale: { value: 2.0 }
            },
            vertexShader: watercolorVert,
            fragmentShader: watercolorFrag,
            side: THREE.DoubleSide
        });
        
        this.baseColorHex = baseColor;
    }
    
    update(time) {
        this.uniforms.uTime.value = time;
    }
    
    setColor(color) {
        this.uniforms.uBaseColor.value = new THREE.Color(color);
        this.baseColorHex = color;
    }
    
    setHighlight(intensity) {
        // Brighten the color for hover/select
        const color = new THREE.Color(this.baseColorHex);
        color.multiplyScalar(1 + intensity * 0.5);
        this.uniforms.uBaseColor.value = color;
    }
    
    resetColor() {
        this.uniforms.uBaseColor.value = new THREE.Color(this.baseColorHex);
    }
}
