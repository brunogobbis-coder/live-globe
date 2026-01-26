// State Manager - Event-driven application state management
// Implements EventEmitter pattern for reactive updates across components

const STORAGE_KEY = 'nuvemshop-live-globe-state';

export class StateManager {
    constructor() {
        // Event listeners map
        this._listeners = new Map();
        
        // Sales data
        this.sales = [];
        this.totalGMV = 0;
        this.salesByChannel = {
            online: 0,
            pos: 0,
            chat: 0,
            social: 0
        };
        this.gmvByChannel = {
            online: 0,
            pos: 0,
            chat: 0,
            social: 0
        };
        this.salesByState = {};
        this.gmvByState = {};
        this.salesByRegion = {
            norte: 0,
            nordeste: 0,
            'centro-oeste': 0,
            sudeste: 0,
            sul: 0
        };
        this.gmvByRegion = {
            norte: 0,
            nordeste: 0,
            'centro-oeste': 0,
            sudeste: 0,
            sul: 0
        };
        
        // UI state
        this.selectedState = null;
        this.hoveredState = null;
        this.activeChannel = 'all';
        this.activeRegion = 'all';
        this.isSimulationRunning = false;
        this.connectionStatus = 'disconnected';
        
        // Time tracking
        this.sessionStartTime = Date.now();
        this.lastSaleTime = null;
        
        // Brazilian states data
        this.states = {
            'AC': { name: 'Acre', region: 'norte', capital: 'Rio Branco' },
            'AL': { name: 'Alagoas', region: 'nordeste', capital: 'Maceió' },
            'AP': { name: 'Amapá', region: 'norte', capital: 'Macapá' },
            'AM': { name: 'Amazonas', region: 'norte', capital: 'Manaus' },
            'BA': { name: 'Bahia', region: 'nordeste', capital: 'Salvador' },
            'CE': { name: 'Ceará', region: 'nordeste', capital: 'Fortaleza' },
            'DF': { name: 'Distrito Federal', region: 'centro-oeste', capital: 'Brasília' },
            'ES': { name: 'Espírito Santo', region: 'sudeste', capital: 'Vitória' },
            'GO': { name: 'Goiás', region: 'centro-oeste', capital: 'Goiânia' },
            'MA': { name: 'Maranhão', region: 'nordeste', capital: 'São Luís' },
            'MT': { name: 'Mato Grosso', region: 'centro-oeste', capital: 'Cuiabá' },
            'MS': { name: 'Mato Grosso do Sul', region: 'centro-oeste', capital: 'Campo Grande' },
            'MG': { name: 'Minas Gerais', region: 'sudeste', capital: 'Belo Horizonte' },
            'PA': { name: 'Pará', region: 'norte', capital: 'Belém' },
            'PB': { name: 'Paraíba', region: 'nordeste', capital: 'João Pessoa' },
            'PR': { name: 'Paraná', region: 'sul', capital: 'Curitiba' },
            'PE': { name: 'Pernambuco', region: 'nordeste', capital: 'Recife' },
            'PI': { name: 'Piauí', region: 'nordeste', capital: 'Teresina' },
            'RJ': { name: 'Rio de Janeiro', region: 'sudeste', capital: 'Rio de Janeiro' },
            'RN': { name: 'Rio Grande do Norte', region: 'nordeste', capital: 'Natal' },
            'RS': { name: 'Rio Grande do Sul', region: 'sul', capital: 'Porto Alegre' },
            'RO': { name: 'Rondônia', region: 'norte', capital: 'Porto Velho' },
            'RR': { name: 'Roraima', region: 'norte', capital: 'Boa Vista' },
            'SC': { name: 'Santa Catarina', region: 'sul', capital: 'Florianópolis' },
            'SP': { name: 'São Paulo', region: 'sudeste', capital: 'São Paulo' },
            'SE': { name: 'Sergipe', region: 'nordeste', capital: 'Aracaju' },
            'TO': { name: 'Tocantins', region: 'norte', capital: 'Palmas' }
        };
        
        // Major cities for sales simulation
        this.cities = [
            { name: 'São Paulo', state: 'SP', weight: 25 },
            { name: 'Rio de Janeiro', state: 'RJ', weight: 15 },
            { name: 'Belo Horizonte', state: 'MG', weight: 8 },
            { name: 'Salvador', state: 'BA', weight: 6 },
            { name: 'Brasília', state: 'DF', weight: 5 },
            { name: 'Fortaleza', state: 'CE', weight: 5 },
            { name: 'Curitiba', state: 'PR', weight: 5 },
            { name: 'Recife', state: 'PE', weight: 4 },
            { name: 'Porto Alegre', state: 'RS', weight: 4 },
            { name: 'Manaus', state: 'AM', weight: 3 },
            { name: 'Goiânia', state: 'GO', weight: 3 },
            { name: 'Belém', state: 'PA', weight: 2 },
            { name: 'Florianópolis', state: 'SC', weight: 2 },
            { name: 'Vitória', state: 'ES', weight: 2 },
            { name: 'Natal', state: 'RN', weight: 2 },
            { name: 'Campinas', state: 'SP', weight: 3 },
            { name: 'Ribeirão Preto', state: 'SP', weight: 2 },
            { name: 'Santos', state: 'SP', weight: 2 },
            { name: 'Niterói', state: 'RJ', weight: 2 },
            { name: 'Joinville', state: 'SC', weight: 1 }
        ];
        
        // Channels
        this.channels = ['online', 'pos', 'chat', 'social'];
        this.channelWeights = { online: 50, pos: 25, chat: 15, social: 10 };
        this.channelColors = {
            online: 0x0059d5,
            pos: 0x36b37e,
            chat: 0x00b8d9,
            social: 0xff5630
        };
        
        // Products for simulation
        this.products = [
            'Camiseta Básica', 'Vestido Floral', 'Tênis Esportivo', 'Bolsa Couro',
            'Relógio Digital', 'Óculos de Sol', 'Perfume Importado', 'Mochila Urbana',
            'Jaqueta Jeans', 'Calça Skinny', 'Sandália Rasteira', 'Boné Trucker',
            'Brinco Prata', 'Colar Dourado', 'Chinelo Slide', 'Shorts Praia'
        ];
        
        // Load persisted state
        this._loadPersistedState();
    }
    
    // ==================== EVENT SYSTEM ====================
    
    /**
     * Subscribe to state events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    /**
     * Unsubscribe from state events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this._listeners.has(event)) {
            this._listeners.get(event).delete(callback);
        }
    }
    
    /**
     * Emit an event to all listeners
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this._listeners.has(event)) {
            this._listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`Error in event listener for "${event}":`, err);
                }
            });
        }
        
        // Also emit wildcard event for global listeners
        if (this._listeners.has('*')) {
            this._listeners.get('*').forEach(callback => {
                try {
                    callback({ event, data });
                } catch (err) {
                    console.error(`Error in wildcard listener:`, err);
                }
            });
        }
    }
    
    // ==================== STATE PERSISTENCE ====================
    
    /**
     * Load persisted state from localStorage
     */
    _loadPersistedState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // Only restore if session is recent (within 1 hour)
                const oneHour = 60 * 60 * 1000;
                if (Date.now() - parsed.savedAt < oneHour) {
                    this.totalGMV = parsed.totalGMV || 0;
                    this.salesByChannel = { ...this.salesByChannel, ...parsed.salesByChannel };
                    this.gmvByChannel = { ...this.gmvByChannel, ...parsed.gmvByChannel };
                    this.salesByState = { ...parsed.salesByState };
                    this.gmvByState = { ...parsed.gmvByState };
                    this.salesByRegion = { ...this.salesByRegion, ...parsed.salesByRegion };
                    this.gmvByRegion = { ...this.gmvByRegion, ...parsed.gmvByRegion };
                    this.sessionStartTime = parsed.sessionStartTime || Date.now();
                    
                    console.log('State restored from localStorage');
                }
            }
        } catch (err) {
            console.warn('Could not load persisted state:', err);
        }
    }
    
    /**
     * Persist current state to localStorage
     */
    _persistState() {
        try {
            const toSave = {
                savedAt: Date.now(),
                sessionStartTime: this.sessionStartTime,
                totalGMV: this.totalGMV,
                salesByChannel: this.salesByChannel,
                gmvByChannel: this.gmvByChannel,
                salesByState: this.salesByState,
                gmvByState: this.gmvByState,
                salesByRegion: this.salesByRegion,
                gmvByRegion: this.gmvByRegion
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (err) {
            console.warn('Could not persist state:', err);
        }
    }
    
    /**
     * Clear persisted state
     */
    clearPersistedState() {
        localStorage.removeItem(STORAGE_KEY);
        this.emit('state:cleared', {});
    }
    
    // ==================== SALES LOGIC ====================
    
    /**
     * Generate a random sale (simulation)
     * @returns {Object} Sale object
     */
    generateRandomSale() {
        // Select city based on weight
        const city = this.weightedRandomCity();
        
        // Select channel based on weight
        const channel = this.weightedRandomChannel();
        
        // Generate value (realistic distribution)
        const baseValue = 50 + Math.random() * 200;
        const multiplier = Math.random() < 0.1 ? 3 : Math.random() < 0.3 ? 2 : 1;
        const value = Math.floor(baseValue * multiplier);
        
        // Select product
        const product = this.products[Math.floor(Math.random() * this.products.length)];
        
        // Get region for the state
        const region = this.states[city.state]?.region || 'sudeste';
        
        const sale = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            city: city.name,
            state: city.state,
            region,
            channel,
            value,
            product,
            timestamp: new Date(),
            simulated: true
        };
        
        return this.addSale(sale);
    }
    
    /**
     * Add a sale to state (from simulation or real data)
     * @param {Object} sale - Sale data
     * @returns {Object} Processed sale object
     */
    addSale(sale) {
        // Ensure required fields
        if (!sale.region && sale.state) {
            sale.region = this.states[sale.state]?.region || 'sudeste';
        }
        
        // Add to sales list
        this.sales.unshift(sale);
        if (this.sales.length > 100) this.sales.pop();
        
        // Update totals
        this.totalGMV += sale.value;
        this.lastSaleTime = Date.now();
        
        // Update by channel
        this.salesByChannel[sale.channel] = (this.salesByChannel[sale.channel] || 0) + 1;
        this.gmvByChannel[sale.channel] = (this.gmvByChannel[sale.channel] || 0) + sale.value;
        
        // Update by state
        this.salesByState[sale.state] = (this.salesByState[sale.state] || 0) + 1;
        this.gmvByState[sale.state] = (this.gmvByState[sale.state] || 0) + sale.value;
        
        // Update by region
        this.salesByRegion[sale.region] = (this.salesByRegion[sale.region] || 0) + 1;
        this.gmvByRegion[sale.region] = (this.gmvByRegion[sale.region] || 0) + sale.value;
        
        // Persist state periodically (every 10 sales)
        if (this.sales.length % 10 === 0) {
            this._persistState();
        }
        
        // Emit events
        this.emit('sale:new', sale);
        this.emit('gmv:updated', { total: this.totalGMV, sale });
        this.emit('stats:updated', this.getStats());
        
        return sale;
    }
    
    /**
     * Process incoming sale from external source (WebSocket/API)
     * @param {Object} rawSale - Raw sale data from external source
     * @returns {Object} Processed sale object
     */
    processExternalSale(rawSale) {
        const sale = {
            id: rawSale.id || `ext-${Date.now()}`,
            city: rawSale.city || rawSale.location?.city || 'São Paulo',
            state: rawSale.state || rawSale.location?.state || 'SP',
            channel: rawSale.channel || 'online',
            value: rawSale.value || rawSale.amount || 0,
            product: rawSale.product || rawSale.item?.name || 'Produto',
            timestamp: rawSale.timestamp ? new Date(rawSale.timestamp) : new Date(),
            simulated: false,
            external: true
        };
        
        return this.addSale(sale);
    }
    
    // ==================== SELECTION & FILTERING ====================
    
    /**
     * Set selected state
     * @param {string|null} stateCode - State code or null to deselect
     */
    setSelectedState(stateCode) {
        const previousState = this.selectedState;
        this.selectedState = stateCode;
        
        this.emit('state:selected', { 
            current: stateCode, 
            previous: previousState,
            stateInfo: stateCode ? this.getStateInfo(stateCode) : null
        });
    }
    
    /**
     * Set hovered state
     * @param {string|null} stateCode - State code or null
     */
    setHoveredState(stateCode) {
        const previousState = this.hoveredState;
        this.hoveredState = stateCode;
        
        if (stateCode !== previousState) {
            this.emit('state:hovered', { 
                current: stateCode, 
                previous: previousState 
            });
        }
    }
    
    /**
     * Set active channel filter
     * @param {string} channel - Channel name or 'all'
     */
    setActiveChannel(channel) {
        const previousChannel = this.activeChannel;
        this.activeChannel = channel;
        
        this.emit('channel:changed', { 
            current: channel, 
            previous: previousChannel 
        });
    }
    
    /**
     * Set active region filter
     * @param {string} region - Region name or 'all'
     */
    setActiveRegion(region) {
        const previousRegion = this.activeRegion;
        this.activeRegion = region;
        
        this.emit('region:changed', { 
            current: region, 
            previous: previousRegion 
        });
    }
    
    /**
     * Get filtered sales based on current filters
     * @returns {Array} Filtered sales array
     */
    getFilteredSales() {
        return this.sales.filter(sale => {
            // Channel filter
            if (this.activeChannel !== 'all' && sale.channel !== this.activeChannel) {
                return false;
            }
            
            // Region filter
            if (this.activeRegion !== 'all' && sale.region !== this.activeRegion) {
                return false;
            }
            
            // State filter (when a state is selected)
            if (this.selectedState && sale.state !== this.selectedState) {
                return false;
            }
            
            return true;
        });
    }
    
    // ==================== CONNECTION STATUS ====================
    
    /**
     * Set connection status
     * @param {string} status - 'connected', 'disconnected', 'connecting', 'error'
     */
    setConnectionStatus(status) {
        const previousStatus = this.connectionStatus;
        this.connectionStatus = status;
        
        this.emit('connection:status', { 
            current: status, 
            previous: previousStatus 
        });
    }
    
    /**
     * Set simulation running state
     * @param {boolean} running - Whether simulation is running
     */
    setSimulationRunning(running) {
        this.isSimulationRunning = running;
        this.emit('simulation:status', { running });
    }
    
    // ==================== HELPER METHODS ====================
    
    weightedRandomCity() {
        const totalWeight = this.cities.reduce((sum, city) => sum + city.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const city of this.cities) {
            random -= city.weight;
            if (random <= 0) return city;
        }
        
        return this.cities[0];
    }
    
    weightedRandomChannel() {
        const total = Object.values(this.channelWeights).reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        
        for (const [channel, weight] of Object.entries(this.channelWeights)) {
            random -= weight;
            if (random <= 0) return channel;
        }
        
        return 'online';
    }
    
    getChannelColor(channel) {
        return this.channelColors[channel] || 0xffffff;
    }
    
    getStateInfo(stateCode) {
        const baseInfo = this.states[stateCode];
        if (!baseInfo) return null;
        
        return {
            ...baseInfo,
            code: stateCode,
            salesCount: this.salesByState[stateCode] || 0,
            gmv: this.gmvByState[stateCode] || 0
        };
    }
    
    getStateSales(stateCode) {
        return this.salesByState[stateCode] || 0;
    }
    
    getStateGMV(stateCode) {
        return this.gmvByState[stateCode] || 0;
    }
    
    getRegionStats(region) {
        return {
            salesCount: this.salesByRegion[region] || 0,
            gmv: this.gmvByRegion[region] || 0
        };
    }
    
    /**
     * Get comprehensive stats
     * @returns {Object} Stats object
     */
    getStats() {
        const totalSales = Object.values(this.salesByChannel).reduce((a, b) => a + b, 0);
        const sessionDuration = Date.now() - this.sessionStartTime;
        const salesPerMinute = totalSales / (sessionDuration / 60000) || 0;
        
        return {
            totalGMV: this.totalGMV,
            totalSales,
            salesByChannel: { ...this.salesByChannel },
            gmvByChannel: { ...this.gmvByChannel },
            salesByRegion: { ...this.salesByRegion },
            gmvByRegion: { ...this.gmvByRegion },
            averageOrderValue: totalSales > 0 ? this.totalGMV / totalSales : 0,
            salesPerMinute: Math.round(salesPerMinute * 10) / 10,
            sessionDuration,
            lastSaleTime: this.lastSaleTime
        };
    }
    
    /**
     * Get top performing states
     * @param {number} limit - Number of states to return
     * @returns {Array} Array of state objects sorted by GMV
     */
    getTopStates(limit = 5) {
        return Object.entries(this.gmvByState)
            .map(([code, gmv]) => ({
                code,
                ...this.states[code],
                gmv,
                salesCount: this.salesByState[code] || 0
            }))
            .sort((a, b) => b.gmv - a.gmv)
            .slice(0, limit);
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    formatNumber(value) {
        return new Intl.NumberFormat('pt-BR').format(value);
    }
    
    /**
     * Reset all state data
     */
    reset() {
        this.sales = [];
        this.totalGMV = 0;
        this.salesByChannel = { online: 0, pos: 0, chat: 0, social: 0 };
        this.gmvByChannel = { online: 0, pos: 0, chat: 0, social: 0 };
        this.salesByState = {};
        this.gmvByState = {};
        this.salesByRegion = { norte: 0, nordeste: 0, 'centro-oeste': 0, sudeste: 0, sul: 0 };
        this.gmvByRegion = { norte: 0, nordeste: 0, 'centro-oeste': 0, sudeste: 0, sul: 0 };
        this.selectedState = null;
        this.hoveredState = null;
        this.sessionStartTime = Date.now();
        this.lastSaleTime = null;
        
        this.clearPersistedState();
        this.emit('state:reset', {});
    }
}
