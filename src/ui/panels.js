// Panels - Sales list and GMV display management
export class Panels {
    constructor(stateManager) {
        this.state = stateManager;
        this.elements = {};
        this.maxSalesDisplay = 25;
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements() {
        this.elements = {
            gmvValue: document.getElementById('gmv-value'),
            salesList: document.getElementById('sales-list'),
            salesPanel: document.querySelector('.sales-panel'),
            salesHeader: document.querySelector('.sales-header'),
            salesCount: document.getElementById('total-sales')
        };
    }
    
    bindEvents() {
        // Toggle panel collapse
        if (this.elements.salesHeader) {
            this.elements.salesHeader.addEventListener('click', () => {
                this.togglePanelCollapse();
            });
        }
    }
    
    togglePanelCollapse() {
        if (this.elements.salesPanel) {
            this.elements.salesPanel.classList.toggle('collapsed');
        }
    }
    
    addSaleItem(sale, animate = true) {
        const listEl = this.elements.salesList;
        if (!listEl) return;
        
        const item = document.createElement('div');
        item.className = `sale-item channel-${sale.channel}`;
        item.dataset.channel = sale.channel;
        item.dataset.state = sale.state;
        item.dataset.id = sale.id;
        
        const timeStr = this.formatTime(sale.timestamp);
        
        item.innerHTML = `
            <div class="sale-icon">${this.getChannelIcon(sale.channel)}</div>
            <div class="sale-info">
                <div class="sale-location">${sale.city}, ${sale.state}</div>
                <div class="sale-time">${timeStr}</div>
            </div>
            <div class="sale-value">${this.state.formatCurrency(sale.value)}</div>
        `;
        
        if (animate) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        }
        
        listEl.insertBefore(item, listEl.firstChild);
        
        if (animate) {
            requestAnimationFrame(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }
        
        // Limit items
        while (listEl.children.length > this.maxSalesDisplay) {
            listEl.removeChild(listEl.lastChild);
        }
        
        // Update count
        this.updateSalesCount();
    }
    
    getChannelIcon(channel) {
        const icons = {
            online: '🌐',
            pos: '🏪',
            chat: '💬',
            social: '📱'
        };
        return icons[channel] || '🛒';
    }
    
    formatTime(timestamp) {
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    updateGMV(value) {
        if (this.elements.gmvValue) {
            this.elements.gmvValue.textContent = this.state.formatCurrency(value);
            this.elements.gmvValue.classList.add('pulse');
            setTimeout(() => this.elements.gmvValue.classList.remove('pulse'), 300);
        }
    }
    
    updateSalesCount() {
        if (this.elements.salesCount) {
            const count = this.elements.salesList?.children.length || 0;
            this.elements.salesCount.textContent = `${count} vendas`;
        }
    }
    
    highlightStateSales(stateCode) {
        const items = this.elements.salesList?.querySelectorAll('.sale-item') || [];
        items.forEach(item => {
            if (item.dataset.state === stateCode) {
                item.classList.add('highlighted');
                item.classList.remove('dimmed');
            } else {
                item.classList.add('dimmed');
                item.classList.remove('highlighted');
            }
        });
    }
    
    clearStateSalesHighlight() {
        const items = this.elements.salesList?.querySelectorAll('.sale-item') || [];
        items.forEach(item => {
            item.classList.remove('highlighted', 'dimmed');
        });
    }
    
    clearSalesList() {
        if (this.elements.salesList) {
            this.elements.salesList.innerHTML = '';
        }
        this.updateSalesCount();
    }
    
    showPanels() {
        if (this.elements.salesPanel) {
            this.elements.salesPanel.style.display = 'block';
        }
    }
    
    hidePanels() {
        if (this.elements.salesPanel) {
            this.elements.salesPanel.style.display = 'none';
        }
    }
}
