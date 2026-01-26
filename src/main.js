import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BrazilMap } from './scene/BrazilMap.js';
import { SaleParticles } from './scene/SaleParticles.js';
import { UIManager } from './ui/UIManager.js';
import { StateManager } from './StateManager.js';
import './styles/main.css';

// ==================== APPLICATION CLASS ====================

class NuvemshopLiveGlobe {
    constructor() {
        // State manager (event-driven)
        this.state = new StateManager();
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Custom components
        this.brazilMap = null;
        this.saleParticles = null;
        this.uiManager = null;
        
        // Raycasting
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Simulation
        this.simulationTimer = null;
        this.isInitialized = false;
        
        // WebSocket connection (mock for now)
        this.wsConnection = null;
        
        // Expose globally for debugging
        window.app = this;
    }
    
    // ==================== INITIALIZATION ====================
    
    init() {
        if (this.isInitialized) return;
        
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        
        // Initialize components with state manager
        this.brazilMap = new BrazilMap(this.scene, this.state);
        this.brazilMap.init();
        
        this.saleParticles = new SaleParticles(this.scene, this.state);
        
        this.uiManager = new UIManager(this.state);
        this.uiManager.init();
        
        // Setup event bindings
        this.setupStateBindings();
        this.setupDOMEvents();
        
        // Start animation loop
        this.animate();
        
        // Start simulation
        this.startSalesSimulation();
        
        // Initialize mock WebSocket
        this.initMockWebSocket();
        
        this.isInitialized = true;
        this.state.emit('app:initialized', { timestamp: Date.now() });
        
        console.log('Nuvemshop Live Globe initialized');
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a1628);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        const container = document.getElementById('map-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }
    
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minPolarAngle = Math.PI / 6;
        this.controls.enablePan = false;
    }
    
    setupLighting() {
        // Ambient light - soft overall illumination
        const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light - sun-like, from top-right
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);
        
        // Fill light - softer, from opposite side
        const fillLight = new THREE.DirectionalLight(0x8090ff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Rim light - for edge definition
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(0, -5, 10);
        this.scene.add(rimLight);
    }
    
    // ==================== EVENT BINDINGS ====================
    
    setupStateBindings() {
        // Listen to state changes and react accordingly
        
        // Sale events - trigger visual effects and UI updates
        this.state.on('sale:new', (sale) => {
            // Add particle effect at city position
            const position = this.brazilMap.getCityPosition(sale.city);
            if (position) {
                this.saleParticles.addSale(position, sale.channel);
            }
            
            // Pulse the state where sale occurred
            this.brazilMap.pulseState(sale.state);
            
            // Update UI panels with the new sale
            this.uiManager.addSale(sale);
        });
        
        // State selection - sync map and camera
        this.state.on('state:selected', ({ current, previous }) => {
            this.brazilMap.selectState(current);
            
            if (current) {
                const statePosition = this.brazilMap.getStateCenter(current);
                this.zoomToPosition(statePosition);
            } else {
                this.resetCamera();
            }
        });
        
        // State hover - update map visuals
        this.state.on('state:hovered', ({ current }) => {
            this.brazilMap.setHoveredState(current);
            
            if (current) {
                this.renderer.domElement.style.cursor = 'pointer';
            } else {
                this.renderer.domElement.style.cursor = 'default';
            }
        });
        
        // Channel filter changes
        this.state.on('channel:changed', ({ current }) => {
            // Could update map highlighting by channel
            console.log('Channel filter changed to:', current);
        });
        
        // Region filter changes
        this.state.on('region:changed', ({ current }) => {
            // Could highlight region on map
            console.log('Region filter changed to:', current);
        });
        
        // Connection status
        this.state.on('connection:status', ({ current }) => {
            console.log('Connection status:', current);
        });
    }
    
    setupDOMEvents() {
        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Mouse move for hover effects
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Click for state selection
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        
        // Touch support for mobile
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    }
    
    // ==================== EVENT HANDLERS ====================
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycast to find hovered state
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.brazilMap.getStatesMeshes(), true);
        
        if (intersects.length > 0) {
            const hoveredState = intersects[0].object.userData.state;
            this.state.setHoveredState(hoveredState);
        } else {
            this.state.setHoveredState(null);
        }
    }
    
    onClick(event) {
        // Calculate mouse position
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycast
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.brazilMap.getStatesMeshes(), true);
        
        if (intersects.length > 0) {
            const clickedState = intersects[0].object.userData.state;
            this.state.setSelectedState(clickedState);
            this.uiManager.showStateTooltip(clickedState, event.clientX, event.clientY);
        } else {
            this.state.setSelectedState(null);
            this.uiManager.hideStateTooltip();
        }
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch - simulate click
            const touch = event.touches[0];
            const mockEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            // Delay to allow for scroll detection
            setTimeout(() => {
                this.onClick(mockEvent);
            }, 100);
        }
    }
    
    // ==================== CAMERA ANIMATION ====================
    
    zoomToPosition(position) {
        const targetPosition = new THREE.Vector3(
            position.x,
            this.camera.position.y * 0.7,
            position.z + 5
        );
        
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 1000;
        const startTime = Date.now();
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, targetPosition, eased);
            this.controls.target.lerpVectors(startTarget, position, eased * 0.5);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }
    
    resetCamera() {
        const targetPosition = new THREE.Vector3(0, 8, 12);
        const targetLookAt = new THREE.Vector3(0, 0, 0);
        
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 800;
        const startTime = Date.now();
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, targetPosition, eased);
            this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // ==================== SALES SIMULATION ====================
    
    startSalesSimulation() {
        if (this.state.isSimulationRunning) return;
        
        this.state.setSimulationRunning(true);
        this.state.setConnectionStatus('connected');
        
        const simulateSale = () => {
            if (!this.state.isSimulationRunning) return;
            
            // Generate sale through state manager (will emit events)
            this.state.generateRandomSale();
            
            // Schedule next sale (1-4 seconds)
            const nextDelay = 1000 + Math.random() * 3000;
            this.simulationTimer = setTimeout(simulateSale, nextDelay);
        };
        
        // Start after initial delay
        this.simulationTimer = setTimeout(simulateSale, 2000);
    }
    
    stopSalesSimulation() {
        if (this.simulationTimer) {
            clearTimeout(this.simulationTimer);
            this.simulationTimer = null;
        }
        this.state.setSimulationRunning(false);
        this.state.setConnectionStatus('disconnected');
    }
    
    // ==================== WEBSOCKET MOCK ====================
    
    initMockWebSocket() {
        // This simulates a WebSocket connection for real-time data
        // In production, this would connect to an actual WebSocket server
        
        this.wsConnection = {
            status: 'connected',
            
            // Mock method to receive external sales
            receiveSale: (saleData) => {
                this.state.processExternalSale(saleData);
            },
            
            // Mock method to simulate connection issues
            disconnect: () => {
                this.wsConnection.status = 'disconnected';
                this.state.setConnectionStatus('disconnected');
            },
            
            reconnect: () => {
                this.wsConnection.status = 'connecting';
                this.state.setConnectionStatus('connecting');
                
                setTimeout(() => {
                    this.wsConnection.status = 'connected';
                    this.state.setConnectionStatus('connected');
                }, 1000);
            }
        };
        
        // Expose for testing
        window.wsConnection = this.wsConnection;
    }
    
    /**
     * Connect to real WebSocket server (for production use)
     * @param {string} url - WebSocket server URL
     */
    connectWebSocket(url) {
        // Close simulation if running
        this.stopSalesSimulation();
        
        this.state.setConnectionStatus('connecting');
        
        try {
            const ws = new WebSocket(url);
            
            ws.onopen = () => {
                this.state.setConnectionStatus('connected');
                console.log('WebSocket connected');
            };
            
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.type === 'sale') {
                        this.state.processExternalSale(data.payload);
                    } else if (data.type === 'bulk_sales') {
                        data.payload.forEach(sale => {
                            this.state.processExternalSale(sale);
                        });
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };
            
            ws.onclose = () => {
                this.state.setConnectionStatus('disconnected');
                console.log('WebSocket disconnected');
            };
            
            ws.onerror = (error) => {
                this.state.setConnectionStatus('error');
                console.error('WebSocket error:', error);
            };
            
            this.wsConnection = ws;
        } catch (err) {
            this.state.setConnectionStatus('error');
            console.error('Failed to connect WebSocket:', err);
        }
    }
    
    // ==================== ANIMATION LOOP ====================
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        
        // Update components
        this.brazilMap.update();
        this.saleParticles.update();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // ==================== PUBLIC API ====================
    
    /**
     * Get current application stats
     */
    getStats() {
        return this.state.getStats();
    }
    
    /**
     * Reset all data
     */
    reset() {
        this.state.reset();
    }
    
    /**
     * Toggle simulation
     */
    toggleSimulation() {
        if (this.state.isSimulationRunning) {
            this.stopSalesSimulation();
        } else {
            this.startSalesSimulation();
        }
    }
}

// ==================== INITIALIZATION ====================

const app = new NuvemshopLiveGlobe();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
