/**
 * Filters Component
 * ==================
 * Handles segment and channel filtering
 */

const FiltersComponent = {
    // Filter by segment
    filterSegment(segment) {
        state.currentSegment = segment;
        
        // Update button states
        document.querySelectorAll('.segment-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.segment === segment);
        });
        
        // Filter sales list items
        this.applySalesFilter();
    },
    
    // Filter by channel
    filterChannel(channel) {
        state.currentChannel = channel;
        
        // Update tab states
        document.querySelectorAll('.channel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.channel === channel);
        });
        
        // Filter sales list items
        this.applySalesFilter();
    },
    
    // Apply current filters to sales list
    applySalesFilter() {
        const items = document.querySelectorAll('.sale-item');
        
        items.forEach(item => {
            let showByChannel = true;
            let showBySegment = true;
            
            // Channel filter
            if (state.currentChannel !== 'all') {
                showByChannel = item.classList.contains('channel-' + state.currentChannel);
            }
            
            // Segment filter (if implemented on items)
            if (state.currentSegment !== 'all') {
                showBySegment = item.dataset.segment === state.currentSegment;
            }
            
            item.style.display = (showByChannel && showBySegment) ? '' : 'none';
        });
    },
    
    // Update channel tabs with counts
    updateChannelTabs() {
        Object.entries(state.channelCounts).forEach(([channel, count]) => {
            const tab = document.querySelector(`.channel-tab[data-channel="${channel}"]`);
            if (tab) {
                const countEl = tab.querySelector('.channel-count');
                if (countEl) {
                    countEl.textContent = count;
                }
            }
        });
    }
};

// Global functions for onclick handlers
function filterSegment(segment) {
    FiltersComponent.filterSegment(segment);
}

function filterChannel(channel) {
    FiltersComponent.filterChannel(channel);
}

function updateChannelTabs() {
    FiltersComponent.updateChannelTabs();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FiltersComponent;
}
