import * as THREE from 'three';

export class SaleParticles {
    constructor(scene, stateManager = null) {
        this.scene = scene;
        this.state = stateManager;
        this.particles = [];
        this.particlePool = [];
        this.maxParticles = 100;
        
        // Channel colors (synced with StateManager if available)
        this.channelColors = {
            online: new THREE.Color(0x0059d5),
            pos: new THREE.Color(0x36b37e),
            chat: new THREE.Color(0x00b8d9),
            social: new THREE.Color(0xff5630)
        };
        
        // Sync colors from state manager if available
        if (stateManager && stateManager.channelColors) {
            Object.keys(stateManager.channelColors).forEach(channel => {
                this.channelColors[channel] = new THREE.Color(stateManager.channelColors[channel]);
            });
        }
        
        this.initParticlePool();
    }
    
    initParticlePool() {
        // Pre-create particle geometries and materials
        for (let i = 0; i < this.maxParticles; i++) {
            const particleGroup = this.createParticleGroup();
            particleGroup.visible = false;
            this.particlePool.push(particleGroup);
            this.scene.add(particleGroup);
        }
    }
    
    createParticleGroup() {
        const group = new THREE.Group();
        
        // Main glow sphere
        const glowGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
        
        // Outer ring
        const ringGeometry = new THREE.RingGeometry(0.1, 0.15, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        group.add(ring);
        
        // Point light for glow effect
        const light = new THREE.PointLight(0xffffff, 0.5, 2);
        light.position.y = 0.1;
        group.add(light);
        
        // Store references for animation
        group.userData = {
            glow,
            ring,
            light,
            startTime: 0,
            duration: 2000,
            channel: 'online'
        };
        
        return group;
    }
    
    addSale(position, channel) {
        // Get particle from pool
        const particle = this.getAvailableParticle();
        if (!particle) return;
        
        // Set position
        particle.position.copy(position);
        particle.position.y = 0.15;
        
        // Set color based on channel
        const color = this.channelColors[channel] || this.channelColors.online;
        const { glow, ring, light } = particle.userData;
        
        glow.material.color.copy(color);
        ring.material.color.copy(color);
        light.color.copy(color);
        
        // Reset animation state
        particle.userData.startTime = Date.now();
        particle.userData.channel = channel;
        particle.visible = true;
        
        // Reset scale
        particle.scale.set(0.1, 0.1, 0.1);
        glow.material.opacity = 0.9;
        ring.material.opacity = 0.6;
        light.intensity = 0.5;
        
        this.particles.push(particle);
        
        // Create trail particles
        this.createTrailParticles(position, color);
    }
    
    createTrailParticles(position, color) {
        // Create small rising particles
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const trailParticle = this.createTrailParticle(color);
                trailParticle.position.copy(position);
                trailParticle.position.x += (Math.random() - 0.5) * 0.2;
                trailParticle.position.z += (Math.random() - 0.5) * 0.2;
                trailParticle.position.y = 0.1;
                
                this.scene.add(trailParticle);
                
                // Animate trail particle
                this.animateTrailParticle(trailParticle);
            }, i * 50);
        }
    }
    
    createTrailParticle(color) {
        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        return new THREE.Mesh(geometry, material);
    }
    
    animateTrailParticle(particle) {
        const startY = particle.position.y;
        const targetY = startY + 0.5 + Math.random() * 0.3;
        const duration = 800 + Math.random() * 400;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutQuad(progress);
            
            particle.position.y = startY + (targetY - startY) * eased;
            particle.material.opacity = 0.8 * (1 - progress);
            particle.scale.setScalar(1 - progress * 0.5);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        };
        
        animate();
    }
    
    getAvailableParticle() {
        for (const particle of this.particlePool) {
            if (!particle.visible) {
                return particle;
            }
        }
        return null;
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    update() {
        const now = Date.now();
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const { startTime, duration, glow, ring, light } = particle.userData;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress >= 1) {
                // Hide and return to pool
                particle.visible = false;
                this.particles.splice(i, 1);
                continue;
            }
            
            // Animate particle
            const scale = this.easeOutCubic(Math.min(progress * 4, 1)); // Quick scale up
            const fadeOut = 1 - this.easeOutQuad(Math.max(0, (progress - 0.5) * 2)); // Fade out in second half
            
            // Ring expansion
            const ringScale = 1 + progress * 3;
            ring.scale.set(ringScale, ringScale, 1);
            ring.material.opacity = 0.6 * fadeOut;
            
            // Glow pulse
            const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
            glow.scale.setScalar(scale * pulse);
            glow.material.opacity = 0.9 * fadeOut;
            
            // Light intensity
            light.intensity = 0.5 * fadeOut;
            
            // Rise effect
            particle.position.y = 0.15 + progress * 0.3;
        }
    }
}
