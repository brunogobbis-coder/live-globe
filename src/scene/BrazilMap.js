import * as THREE from 'three';
import { BRAZIL_STATES } from '../data/brazil-geo.js';

export class BrazilMap {
    constructor(scene, stateManager) {
        this.scene = scene;
        this.stateManager = stateManager;
        this.statesGroup = new THREE.Group();
        this.statesMeshes = [];
        this.stateMeshMap = {};
        this.hoveredState = null;
        this.selectedState = null;
        
        // Animation state
        this.animationTime = 0;
    }
    
    init() {
        this.createBasePlane();
        this.createStates();
        this.createOcean();
        this.scene.add(this.statesGroup);
    }
    
    createBasePlane() {
        // Create a subtle ground plane
        const groundGeometry = new THREE.PlaneGeometry(15, 15);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a1628,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.statesGroup.add(ground);
    }
    
    createOcean() {
        // Create ocean effect around Brazil
        const oceanGeometry = new THREE.PlaneGeometry(20, 20);
        const oceanMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a2040,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -0.05;
        ocean.receiveShadow = true;
        this.statesGroup.add(ocean);
    }
    
    createStates() {
        const states = BRAZIL_STATES.states;
        const regionColors = BRAZIL_STATES.regionColors;
        
        for (const [stateCode, stateData] of Object.entries(states)) {
            const mesh = this.createStateMesh(stateCode, stateData, regionColors);
            this.statesMeshes.push(mesh);
            this.stateMeshMap[stateCode] = mesh;
            this.statesGroup.add(mesh);
        }
    }
    
    createStateMesh(stateCode, stateData, regionColors) {
        // Create shape from polygon points
        const shape = new THREE.Shape();
        const points = stateData.polygon;
        
        shape.moveTo(points[0][0], -points[0][1]); // Flip Z for Three.js
        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i][0], -points[i][1]);
        }
        shape.closePath();
        
        // Extrude settings - height based on elevation
        const extrudeSettings = {
            depth: stateData.elevation,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 2
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Rotate to lay flat on XZ plane
        geometry.rotateX(-Math.PI / 2);
        
        // Get region color
        const baseColor = regionColors[stateData.region];
        
        // Create material with watercolor-like appearance
        const material = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.7,
            metalness: 0.05,
            flatShading: false,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Store state data for raycasting
        mesh.userData = {
            state: stateCode,
            region: stateData.region,
            baseColor: baseColor,
            baseElevation: stateData.elevation,
            center: stateData.center
        };
        
        // Initial position
        mesh.position.y = 0;
        
        return mesh;
    }
    
    getStatesMeshes() {
        return this.statesMeshes;
    }
    
    setHoveredState(stateCode) {
        // Reset previous hovered state
        if (this.hoveredState && this.hoveredState !== this.selectedState) {
            const prevMesh = this.stateMeshMap[this.hoveredState];
            if (prevMesh) {
                this.animateStateReset(prevMesh);
            }
        }
        
        this.hoveredState = stateCode;
        
        // Highlight new hovered state
        if (stateCode && stateCode !== this.selectedState) {
            const mesh = this.stateMeshMap[stateCode];
            if (mesh) {
                this.animateStateHover(mesh);
            }
        }
    }
    
    selectState(stateCode) {
        // Reset previous selected state
        if (this.selectedState) {
            const prevMesh = this.stateMeshMap[this.selectedState];
            if (prevMesh) {
                this.animateStateReset(prevMesh);
            }
        }
        
        this.selectedState = stateCode;
        
        // Highlight selected state
        if (stateCode) {
            const mesh = this.stateMeshMap[stateCode];
            if (mesh) {
                this.animateStateSelect(mesh);
            }
        }
    }
    
    animateStateHover(mesh) {
        const targetY = 0.15;
        const targetColor = new THREE.Color(mesh.userData.baseColor).multiplyScalar(1.3);
        
        // Animate lift
        this.animateMeshProperty(mesh, 'position.y', targetY, 200);
        
        // Animate color
        mesh.material.color.copy(targetColor);
        mesh.material.emissive = new THREE.Color(mesh.userData.baseColor);
        mesh.material.emissiveIntensity = 0.1;
    }
    
    animateStateSelect(mesh) {
        const targetY = 0.25;
        const targetColor = new THREE.Color(mesh.userData.baseColor).multiplyScalar(1.5);
        
        this.animateMeshProperty(mesh, 'position.y', targetY, 300);
        
        mesh.material.color.copy(targetColor);
        mesh.material.emissive = new THREE.Color(0xffffff);
        mesh.material.emissiveIntensity = 0.15;
    }
    
    animateStateReset(mesh) {
        this.animateMeshProperty(mesh, 'position.y', 0, 200);
        
        mesh.material.color.setHex(mesh.userData.baseColor);
        mesh.material.emissive = new THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0;
    }
    
    animateMeshProperty(mesh, property, targetValue, duration) {
        const props = property.split('.');
        let obj = mesh;
        for (let i = 0; i < props.length - 1; i++) {
            obj = obj[props[i]];
        }
        const prop = props[props.length - 1];
        
        const startValue = obj[prop];
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutCubic(progress);
            
            obj[prop] = startValue + (targetValue - startValue) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    getStateCenter(stateCode) {
        const stateData = BRAZIL_STATES.states[stateCode];
        if (stateData) {
            return new THREE.Vector3(
                stateData.center.x,
                0,
                -stateData.center.z
            );
        }
        return new THREE.Vector3(0, 0, 0);
    }
    
    getCityPosition(cityName) {
        const cityData = BRAZIL_STATES.cities[cityName];
        if (cityData) {
            return new THREE.Vector3(
                cityData.x,
                0.1,
                -cityData.z
            );
        }
        return null;
    }
    
    pulseState(stateCode) {
        const mesh = this.stateMeshMap[stateCode];
        if (!mesh) return;
        
        // Create pulse effect
        const originalY = mesh.position.y;
        const pulseHeight = originalY + 0.1;
        
        // Quick pulse up then back
        this.animateMeshProperty(mesh, 'position.y', pulseHeight, 150);
        setTimeout(() => {
            this.animateMeshProperty(mesh, 'position.y', originalY, 200);
        }, 150);
        
        // Flash effect
        const originalEmissive = mesh.material.emissiveIntensity;
        mesh.material.emissive = new THREE.Color(0xffffff);
        mesh.material.emissiveIntensity = 0.3;
        
        setTimeout(() => {
            mesh.material.emissive = new THREE.Color(0x000000);
            mesh.material.emissiveIntensity = originalEmissive;
        }, 300);
    }
    
    update() {
        this.animationTime += 0.016; // Approximate 60fps
        
        // Subtle ambient animation - gentle floating effect
        this.statesMeshes.forEach((mesh, index) => {
            const offset = index * 0.2;
            const wave = Math.sin(this.animationTime + offset) * 0.005;
            
            // Only apply if not hovered or selected
            if (mesh.userData.state !== this.hoveredState && 
                mesh.userData.state !== this.selectedState) {
                mesh.position.y = wave;
            }
        });
    }
}
