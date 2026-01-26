// Filters - Channel and region filter management
export class Filters {
    constructor(stateManager) {
        this.state = stateManager;
        this.elements = {};
        this.activeChannel = 'all';
        this.activeRegion = 'all';
        this.onFilterChangeCallback = null;
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements() {
        this.elements = {
            channelTabs: document.querySelectorAll('.channel-tab'),
            salesList: document.getElementById('sales-list')
        };
    }
    
    bindEvents() {
        this.elements.channelTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const channel = e.currentTarget.dataset.channel;
                this.setChannel(channel);
            });
        });
    }
    
    setOnFilterChange(callback) {
        this.onFilterChangeCallback = callback;
    }
    
    setChannel(channel) {
        this.activeChannel = channel;
        
        // Update UI
        this.elements.channelTabs.forEach(tab => {
            if (tab.dataset.channel === channel) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Apply filter
        this.applyFilters();
        
        // Notify callback
        if (this.onFilterChangeCallback) {
            this.onFilterChangeCallback({
                channel: this.activeChannel,
                region: this.activeRegion
            });
        }
    }
    
    setRegion(region) {
        this.activeRegion = region;
        this.applyFilters();
        
        if (this.onFilterChangeCallback) {
            this.onFilterChangeCallback({
                channel: this.activeChannel,
                region: this.activeRegion
            });
        }
    }
    
    applyFilters() {
        const items = this.elements.salesList?.querySelectorAll('.sale-item') || [];
        
        items.forEach(item => {
            let show = true;
            
            // Channel filter
            if (this.activeChannel !== 'all' && item.dataset.channel !== this.activeChannel) {
                show = false;
            }
            
            // Region filter (if state has region data)
            if (this.activeRegion !== 'all') {
                const stateCode = item.dataset.state;
                const stateInfo = this.state.getStateInfo(stateCode);
                if (stateInfo && stateInfo.region !== this.activeRegion) {
                    show = false;
                }
            }
            
            item.style.display = show ? 'flex' : 'none';
        });
    }
    
    syncChannel(channel) {
        if (channel !== this.activeChannel) {
            this.activeChannel = channel;
            
            this.elements.channelTabs.forEach(tab => {
                if (tab.dataset.channel === channel) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            
            this.applyFilters();
        }
    }
    
    syncRegion(region) {
        if (region !== this.activeRegion) {
            this.activeRegion = region;
            this.applyFilters();
        }
    }
    
    updateChannelCounts(salesByChannel) {
        this.elements.channelTabs.forEach(tab => {
            const channel = tab.dataset.channel;
            let countEl = tab.querySelector('.channel-count');
            
            if (channel === 'all') {
                const total = Object.values(salesByChannel).reduce((a, b) => a + b, 0);
                if (!countEl) {
                    countEl = document.createElement('span');
                    countEl.className = 'channel-count';
                    tab.appendChild(countEl);
                }
                countEl.textContent = total;
            } else if (salesByChannel[channel] !== undefined) {
                if (!countEl) {
                    countEl = document.createElement('span');
                    countEl.className = 'channel-count';
                    tab.appendChild(countEl);
                }
                countEl.textContent = salesByChannel[channel] || 0;
            }
        });
    }
    
    reset() {
        this.activeChannel = 'all';
        this.activeRegion = 'all';
        
        this.elements.channelTabs.forEach(tab => {
            if (tab.dataset.channel === 'all') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        this.applyFilters();
    }
}
