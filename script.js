class DiamondPlanner {
    constructor() {
        this.diamondCount = 6;
        this.colors = [
            '#ffffff', '#8b5cf6', '#059669', 
            '#06b6d4', '#d97706', '#ffffff'
        ];
        this.defaultColors = [
            '#ffffff', '#8b5cf6', '#059669', 
            '#06b6d4', '#d97706', '#ef4444',
            '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'
        ];
        this.storageKey = 'diamond-planner-history';
        this.currentColorIndex = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateDiamonds();
        this.generateColorSquares();
        this.renderHistory();
    }
    
    setupEventListeners() {
        const countSlider = document.getElementById('diamondCount');
        const countDisplay = document.getElementById('countDisplay');
        const saveBtn = document.getElementById('savePaletteBtn');
        
        countSlider.addEventListener('input', (e) => {
            this.diamondCount = parseInt(e.target.value);
            countDisplay.textContent = this.diamondCount;
            this.updateColors();
            this.generateDiamonds();
            this.generateColorSquares();
        });
        
        saveBtn.addEventListener('click', () => {
            const name = prompt('Enter a name for this palette (or leave blank for auto-generated name):');
            if (name !== null) {
                const success = this.savePalette(name.trim());
                if (success) {
                    alert('Palette saved successfully!');
                } else {
                    alert('Error saving palette. Please try again.');
                }
            }
        });
        
        this.setupModalEventListeners();
    }
    
    updateColors() {
        while (this.colors.length < this.diamondCount) {
            const index = this.colors.length % this.defaultColors.length;
            this.colors.push(this.defaultColors[index]);
        }
        this.colors = this.colors.slice(0, this.diamondCount);
    }
    
    generateDiamonds() {
        const container = document.getElementById('diamondDisplay');
        container.innerHTML = '';
        
        const baseSize = 350;
        const minSize = 40;
        const sizeStep = (baseSize - minSize) / Math.max(1, this.diamondCount - 1);
        
        for (let i = 0; i < this.diamondCount; i++) {
            const diamond = document.createElement('div');
            diamond.className = 'diamond';
            diamond.dataset.index = i;
            
            const size = baseSize - (i * sizeStep);
            diamond.style.width = `${size}px`;
            diamond.style.height = `${size}px`;
            diamond.style.backgroundColor = this.colors[i];
            diamond.style.zIndex = i + 1;
            diamond.style.top = '50%';
            diamond.style.left = '50%';
            diamond.style.transform = 'translate(-50%, -50%) rotate(45deg)';
            
            console.log(`Diamond ${i}: size=${size}px, color=${this.colors[i]}, zIndex=${this.diamondCount - i}`);
            
            container.appendChild(diamond);
        }
    }
    
    generateColorSquares() {
        const container = document.getElementById('colorSquares');
        container.innerHTML = '';
        
        for (let i = 0; i < this.diamondCount; i++) {
            const colorSquare = document.createElement('div');
            colorSquare.className = 'color-square';
            colorSquare.style.backgroundColor = this.colors[i];
            colorSquare.dataset.index = i + 1;
            
            colorSquare.addEventListener('click', () => {
                this.openColorModal(i);
            });
            
            container.appendChild(colorSquare);
        }
    }
    
    setupModalEventListeners() {
        const modal = document.getElementById('colorModal');
        const closeBtn = document.getElementById('closeModal');
        const modalColorInput = document.getElementById('modalColorInput');
        const modalColorPreview = document.getElementById('modalColorPreview');
        const modalRInput = document.getElementById('modalRInput');
        const modalGInput = document.getElementById('modalGInput');
        const modalBInput = document.getElementById('modalBInput');
        
        // Close modal when clicking close button
        closeBtn.addEventListener('click', () => {
            this.closeColorModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeColorModal();
            }
        });
        
        // Color input change
        modalColorInput.addEventListener('input', (e) => {
            this.updateModalColor(e.target.value);
        });
        
        // Preview click opens color input
        modalColorPreview.addEventListener('click', () => {
            modalColorInput.click();
        });
        
        // RGB input changes
        const updateFromModalRgb = () => {
            const r = Math.max(0, Math.min(255, parseInt(modalRInput.value) || 0));
            const g = Math.max(0, Math.min(255, parseInt(modalGInput.value) || 0));
            const b = Math.max(0, Math.min(255, parseInt(modalBInput.value) || 0));
            
            modalRInput.value = r;
            modalGInput.value = g;
            modalBInput.value = b;
            
            const hexColor = this.rgbToHex(r, g, b);
            this.updateModalColor(hexColor);
        };
        
        modalRInput.addEventListener('input', updateFromModalRgb);
        modalGInput.addEventListener('input', updateFromModalRgb);
        modalBInput.addEventListener('input', updateFromModalRgb);
    }
    
    openColorModal(colorIndex) {
        this.currentColorIndex = colorIndex;
        const modal = document.getElementById('colorModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalColorInput = document.getElementById('modalColorInput');
        const modalColorPreview = document.getElementById('modalColorPreview');
        const modalRInput = document.getElementById('modalRInput');
        const modalGInput = document.getElementById('modalGInput');
        const modalBInput = document.getElementById('modalBInput');
        
        const currentColor = this.colors[colorIndex];
        const diamondLabel = colorIndex === 0 ? 'Outermost' : 
                           colorIndex === this.diamondCount - 1 ? 'Innermost' : 'Middle';
        
        modalTitle.textContent = `Diamond ${colorIndex + 1} (${diamondLabel})`;
        modalColorInput.value = currentColor;
        modalColorPreview.style.backgroundColor = currentColor;
        
        const rgb = this.hexToRgb(currentColor);
        modalRInput.value = rgb.r;
        modalGInput.value = rgb.g;
        modalBInput.value = rgb.b;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    closeColorModal() {
        const modal = document.getElementById('colorModal');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scroll
        this.currentColorIndex = null;
    }
    
    updateModalColor(newColor) {
        if (this.currentColorIndex === null) return;
        
        const modalColorInput = document.getElementById('modalColorInput');
        const modalColorPreview = document.getElementById('modalColorPreview');
        const modalRInput = document.getElementById('modalRInput');
        const modalGInput = document.getElementById('modalGInput');
        const modalBInput = document.getElementById('modalBInput');
        
        // Update the color in the main array
        this.colors[this.currentColorIndex] = newColor;
        
        // Update modal UI
        modalColorInput.value = newColor;
        modalColorPreview.style.backgroundColor = newColor;
        
        const rgb = this.hexToRgb(newColor);
        modalRInput.value = rgb.r;
        modalGInput.value = rgb.g;
        modalBInput.value = rgb.b;
        
        // Update diamond and color square
        this.updateDiamondColor(this.currentColorIndex, newColor);
        this.updateColorSquare(this.currentColorIndex, newColor);
    }
    
    updateColorSquare(index, color) {
        const colorSquares = document.querySelectorAll('.color-square');
        if (colorSquares[index]) {
            colorSquares[index].style.backgroundColor = color;
        }
    }
    
    updateDiamondColor(index, color) {
        const diamond = document.querySelector(`[data-index="${index}"]`);
        if (diamond) {
            diamond.style.backgroundColor = color;
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }
    
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    getHistory() {
        try {
            const history = localStorage.getItem(this.storageKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.warn('Error loading history:', error);
            return [];
        }
    }
    
    savePalette(name = '') {
        const palette = {
            id: Date.now(),
            name: name || `Palette ${new Date().toLocaleString()}`,
            diamondCount: this.diamondCount,
            colors: [...this.colors],
            timestamp: new Date().toISOString()
        };
        
        const history = this.getHistory();
        history.unshift(palette);
        
        if (history.length > 20) {
            history.splice(20);
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            this.renderHistory();
            return true;
        } catch (error) {
            console.warn('Error saving palette:', error);
            return false;
        }
    }
    
    loadPalette(paletteId) {
        const history = this.getHistory();
        const palette = history.find(p => p.id === paletteId);
        
        if (palette) {
            this.diamondCount = palette.diamondCount;
            this.colors = [...palette.colors];
            
            document.getElementById('diamondCount').value = this.diamondCount;
            document.getElementById('countDisplay').textContent = this.diamondCount;
            
            this.generateDiamonds();
            this.generateColorSquares();
        }
    }
    
    deletePalette(paletteId) {
        const history = this.getHistory();
        const filteredHistory = history.filter(p => p.id !== paletteId);
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
            this.renderHistory();
            return true;
        } catch (error) {
            console.warn('Error deleting palette:', error);
            return false;
        }
    }
    
    renderHistory() {
        const container = document.getElementById('paletteHistory');
        if (!container) return;
        
        const history = this.getHistory();
        
        if (history.length === 0) {
            container.innerHTML = '<p class="no-history">No saved palettes yet</p>';
            return;
        }
        
        container.innerHTML = history.map(palette => `
            <div class="palette-item" data-id="${palette.id}">
                <div class="palette-preview">
                    ${palette.colors.map(color => `
                        <div class="preview-diamond" style="background-color: ${color}"></div>
                    `).join('')}
                </div>
                <div class="palette-info">
                    <div class="palette-name">${palette.name}</div>
                    <div class="palette-details">${palette.diamondCount} diamonds • ${new Date(palette.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="palette-actions">
                    <button class="load-btn" onclick="diamondPlanner.loadPalette(${palette.id})">Load</button>
                    <button class="delete-btn" onclick="diamondPlanner.deletePalette(${palette.id})">×</button>
                </div>
            </div>
        `).join('');
    }
}

let diamondPlanner;

document.addEventListener('DOMContentLoaded', () => {
    diamondPlanner = new DiamondPlanner();
});