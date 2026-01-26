// UI Manager - Event-driven UI component orchestrator
// Integrates sub-components with the reactive StateManager
import { Panels } from './panels.js';
import { Tooltip } from './tooltip.js';
import { Celebration } from './Celebration.js';
import { Filters } from './Filters.js';
import { Stats } from './Stats.js';

export class UIManager {
    constructor(stateManager) {
        this.state = stateManager;
        this.maxSalesDisplay = 25;
        
        // Event unsubscribers for cleanup
        this.unsubscribers = [];
        
        // Initialize sub-components with state manager
        this.panels = new Panels(stateManager);
        this.tooltip = new Tooltip(stateManager);
        this.celebration = new Celebration(stateManager);
        this.filters = new Filters(stateManager);
        this.stats = new Stats(stateManager);
        
        // Track first sales for celebration
        this.firstSaleChance = 0.05; // 5% chance for a first sale celebration
        this.salesCount = 0;
        
        // Connection indicator element
        this.connectionIndicator = null;
    }
    
    init() {
        // Initialize all sub-components
        this.panels.init();
        this.tooltip.init();
        this.celebration.init();
        this.filters.init();
        this.stats.init();
        
        // Create connection indicator
        this.createConnectionIndicator();
        
        // Bind to StateManager events for reactive updates
        this.bindStateEvents();
        
        // Set up filter change callback to sync with state
        this.filters.setOnFilterChange((filters) => {
            this.onFilterChange(filters);
        });
        
        // Initialize with existing state data
        this.initializeFromState();
        
        // Expose globally for any legacy onclick handlers
        window.uiManager = this;
    }
    
    // ==================== STATE EVENT BINDING ====================
    
    bindStateEvents() {
        // Listen to new sales - update UI reactively
        this.unsubscribers.push(
            this.state.on('sale:new', (sale) => {
                this.onNewSale(sale);
            })
        );
        
        // Listen to stats updates
        this.unsubscribers.push(
            this.state.on('stats:updated', (stats) => {
                this.stats.updateFromStats(stats);
                this.filters.updateChannelCounts(stats.salesByChannel);
            })
        );
        
        // Listen to channel filter changes from state
        this.unsubscribers.push(
            this.state.on('channel:changed', ({ current }) => {
                this.filters.syncChannel(current);
            })
        );
        
        // Listen to region filter changes
        this.unsubscribers.push(
            this.state.on('region:changed', ({ current }) => {
                this.filters.syncRegion(current);
            })
        );
        
        // Listen to state selection for UI updates
        this.unsubscribers.push(
            this.state.on('state:selected', ({ current, stateInfo }) => {
                this.onStateSelected(current, stateInfo);
            })
        );
        
        // Listen to connection status changes
        this.unsubscribers.push(
            this.state.on('connection:status', ({ current }) => {
                this.updateConnectionIndicator(current);
            })
        );
        
        // Listen to simulation status
        this.unsubscribers.push(
            this.state.on('simulation:status', ({ running }) => {
                this.updateSimulationIndicator(running);
            })
        );
        
        // Listen to state reset
        this.unsubscribers.push(
            this.state.on('state:reset', () => {
                this.onStateReset();
            })
        );
    }
    
    // ==================== INITIALIZATION FROM STATE ====================
    
    initializeFromState() {
        // Populate existing sales from state
        const existingSales = this.state.sales.slice(0, this.maxSalesDisplay);
        existingSales.reverse().forEach(sale => {
            this.panels.addSaleItem(sale, false); // No animation
        });
        
        // Update stats
        const stats = this.state.getStats();
        this.stats.updateFromStats(stats);
        this.panels.updateGMV(stats.totalGMV);
        this.filters.updateChannelCounts(stats.salesByChannel);
        
        // Sync filter state
        this.filters.syncChannel(this.state.activeChannel);
    }
    
    // ==================== EVENT HANDLERS ====================
    
    onNewSale(sale) {
        this.salesCount++;
        
        // Update panels with animation
        this.panels.addSaleItem(sale, true);
        this.panels.updateGMV(this.state.totalGMV);
        
        // Update stats (now handled via event, but keep for immediate update)
        this.stats.updateChannelStats();
        this.stats.updateTotalSales();
        
        // Apply current filters
        this.filters.applyFilters();
        
        // Occasionally trigger first sale celebration
        if (Math.random() < this.firstSaleChance) {
            this.triggerFirstSaleCelebration(sale);
        }
    }
    
    onFilterChange(filters) {
        // Sync filter state with StateManager
        if (filters.channel !== this.state.activeChannel) {
            this.state.setActiveChannel(filters.channel);
        }
        
        // Apply region filter if present
        if (filters.region && filters.region !== this.state.activeRegion) {
            this.state.setActiveRegion(filters.region);
        }
    }
    
    onStateSelected(stateCode, stateInfo) {
        if (stateCode && stateInfo) {
            // Highlight sales from this state in the list
            this.panels.highlightStateSales(stateCode);
            
            // Update stats to show state-specific data
            this.stats.showStateStats(stateCode, stateInfo);
        } else {
            // Clear highlights
            this.panels.clearStateSalesHighlight();
            this.stats.showGlobalStats();
        }
    }
    
    onStateReset() {
        // Clear all UI elements
        this.panels.clearSalesList();
        this.panels.updateGMV(0);
        this.stats.reset();
        this.filters.reset();
        this.salesCount = 0;
    }
    
    // ==================== CONNECTION INDICATOR ====================
    
    createConnectionIndicator() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;
        
        this.connectionIndicator = document.createElement('div');
        this.connectionIndicator.className = 'connection-indicator';
        this.connectionIndicator.innerHTML = `
            <span class="connection-dot"></span>
            <span class="connection-text">Conectado</span>
        `;
        
        headerActions.insertBefore(this.connectionIndicator, headerActions.firstChild);
    }
    
    updateConnectionIndicator(status) {
        if (!this.connectionIndicator) return;
        
        const dot = this.connectionIndicator.querySelector('.connection-dot');
        const text = this.connectionIndicator.querySelector('.connection-text');
        
        this.connectionIndicator.className = `connection-indicator ${status}`;
        
        const statusTexts = {
            connected: 'Conectado',
            connecting: 'Conectando...',
            disconnected: 'Desconectado',
            error: 'Erro'
        };
        
        if (text) {
            text.textContent = statusTexts[status] || status;
        }
    }
    
    updateSimulationIndicator(running) {
        // Could add a visual indicator for simulation mode
        if (this.connectionIndicator) {
            const text = this.connectionIndicator.querySelector('.connection-text');
            if (text && running) {
                text.textContent = 'Simulando...';
            }
        }
    }
    
    // ==================== CELEBRATION ====================
    
    triggerFirstSaleCelebration(sale) {
        const stores = [
            'Moda Express', 'Tech Store', 'Casa & Lar', 'Beleza Total',
            'Sport Life', 'Pet Friends', 'Gourmet Shop', 'Kids Fashion',
            'Eco Store', 'Fitness Pro', 'Art & Design', 'Book Haven'
        ];
        const storeName = stores[Math.floor(Math.random() * stores.length)];
        this.celebration.show(storeName, sale.city, sale.state, sale.value);
    }
    
    // ==================== TOOLTIP ====================
    
    showStateTooltip(stateCode, x, y) {
        // Enrich tooltip with full state info from StateManager
        const stateInfo = this.state.getStateInfo(stateCode);
        const gmv = this.state.getStateGMV(stateCode);
        const regionStats = stateInfo ? this.state.getRegionStats(stateInfo.region) : null;
        
        this.tooltip.showEnriched(stateCode, x, y, {
            stateInfo,
            gmv,
            regionStats
        });
    }
    
    hideStateTooltip() {
        this.tooltip.hide();
    }
    
    // ==================== PUBLIC API ====================
    
    // Legacy method - still works but events are preferred
    addSale(sale) {
        // This is now handled via state events, but keep for backward compatibility
        // The StateManager.addSale emits 'sale:new' which triggers onNewSale
        console.warn('UIManager.addSale() is deprecated. Use StateManager.addSale() instead.');
        this.onNewSale(sale);
    }
    
    showCelebration(storeName, cityName, stateName, value) {
        this.celebration.show(storeName, cityName, stateName, value);
    }
    
    getCurrentFilters() {
        return {
            channel: this.state.activeChannel,
            region: this.state.activeRegion,
            selectedState: this.state.selectedState
        };
    }
    
    resetFilters() {
        this.state.setActiveChannel('all');
        this.state.setActiveRegion('all');
        this.filters.reset();
    }
    
    getStatsSummary() {
        return this.state.getStats();
    }
    
    updateExtendedStats(data) {
        this.stats.updateExtendedStats(data);
    }
    
    showPanels() {
        this.panels.showPanels();
    }
    
    hidePanels() {
        this.panels.hidePanels();
    }
    
    // ==================== CLEANUP ====================
    
    destroy() {
        // Unsubscribe from all state events
        this.unsubscribers.forEach(unsub => {
            if (typeof unsub === 'function') {
                unsub();
            }
        });
        this.unsubscribers = [];
        
        // Destroy sub-components
        this.stats.destroy();
        
        // Remove connection indicator
        if (this.connectionIndicator) {
            this.connectionIndicator.remove();
        }
    }
}
