/*
 * RYO Coin Adaptive Multi-Touch Magic
 * 小判エフェクト強化版
 */

class AdaptiveMultiTouchMagic {
    constructor() {
        this.canvas = document.getElementById('starfield');
        if (!this.canvas) {
            console.warn('Starfield canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.touchPoints = [];
        this.animationId = null;
        this.activeTouches = new Map();
        this.lastTouchPositions = new Map();
        this.knownTouchIds = new Set();
        
        // ページタイプの自動判定
        this.pageType = this.detectPageType();
        console.log(`🎨 ページタイプ検出: ${this.pageType}`);
        
        // 画像とテーマ設定
        this.setupTheme();
        
        // 画像の管理
        this.effectImages = [];
        this.imageLoaded = false;
        this.imageSizes = [8, 12, 16, 20, 24];
        
        this.loadEffectImages();
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    detectPageType() {
        const path = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        if (path.includes('lifewallet') || path.includes('life') || title.includes('life wallet')) {
            return 'lifewallet';
        } else if (path.includes('cryptoatm') || path.includes('atm') || title.includes('crypto atm')) {
            return 'cryptoatm';
        } else {
            return 'default';
        }
    }
    
    setupTheme() {
        if (this.pageType === 'lifewallet') {
            // LIFE Wallet専用テーマ（緑系）
            this.imagePath = 'image/life.png';
            this.imageType = 'LIFE';
            this.colors = [
                'rgba(34, 197, 94, 1.0)',   // エメラルドグリーン - 完全不透明
                'rgba(22, 163, 74, 1.0)',   // グリーン - 完全不透明
                'rgba(16, 185, 129, 1.0)',  // エメラルド - 完全不透明
                'rgba(52, 211, 153, 1.0)',  // ライトエメラルド - 完全不透明
                'rgba(110, 231, 183, 1.0)', // ペールグリーン - 完全不透明
                'rgba(167, 243, 208, 1.0)', // ライトミント - 完全不透明
                'rgba(134, 239, 172, 1.0)', // ライトグリーン - 完全不透明
                'rgba(187, 247, 208, 1.0)'  // ペールミント - 完全不透明
            ];
            this.trailColor = 'rgba(34, 197, 94, 0.5)';
            this.shadowColor = 'rgba(34, 197, 94, 1.0)';
            console.log('🌿 LIFE Walletテーマを適用');
        } else if (this.pageType === 'cryptoatm') {
            // Crypto ATM専用テーマ（ブルー＆ホワイト系）
            this.imagePath = 'image/ch.png';
            this.imageType = 'CH';
            this.colors = [
                'rgba(59, 130, 246, 1.0)',  // ブルー - 完全不透明
                'rgba(96, 165, 250, 1.0)',  // ライトブルー - 完全不透明
                'rgba(147, 197, 253, 1.0)', // スカイブルー - 完全不透明
                'rgba(191, 219, 254, 1.0)', // ペールブルー - 完全不透明
                'rgba(255, 255, 255, 1.0)', // ピュアホワイト - 完全不透明
                'rgba(248, 250, 252, 1.0)', // ソフトホワイト - 完全不透明
                'rgba(30, 64, 175, 1.0)',   // ディープブルー - 完全不透明
                'rgba(37, 99, 235, 1.0)'    // インディゴブルー - 完全不透明
            ];
            this.trailColor = 'rgba(59, 130, 246, 0.5)';
            this.shadowColor = 'rgba(59, 130, 246, 1.0)';
            console.log('💎 Crypto ATMテーマを適用');
        } else {
            // デフォルトテーマ（ゴールド系） - 大幅強化
            this.imagePath = 'image/koban.png';
            this.imageType = '小判';
            this.colors = [
                'rgba(255, 215, 0, 1.0)',   // ゴールド - 完全不透明
                'rgba(255, 223, 0, 1.0)',   // ブライトゴールド - 完全不透明
                'rgba(255, 140, 0, 1.0)',   // オレンジゴールド - 完全不透明
                'rgba(255, 255, 224, 1.0)', // ライトイエロー - 完全不透明
                'rgba(218, 165, 32, 1.0)',  // ダークゴールド - 完全不透明
                'rgba(255, 248, 220, 1.0)', // コーンシルク - 完全不透明
                'rgba(255, 228, 181, 1.0)', // モカシン - 完全不透明
                'rgba(240, 230, 140, 1.0)', // カーキ - 完全不透明
                'rgba(255, 195, 0, 1.0)',   // 濃いゴールド - 完全不透明
                'rgba(255, 165, 0, 1.0)'    // オレンジ - 完全不透明
            ];
            this.trailColor = 'rgba(255, 215, 0, 0.6)'; // より濃く
            this.shadowColor = 'rgba(255, 215, 0, 1.0)'; // 完全不透明
            console.log('🏅 強化版小判テーマを適用');
        }
    }
    
    loadEffectImages() {
        console.log(`${this.imageType}画像の読み込み開始: ${this.imagePath}`);
        
        const img = new Image();
        img.onload = () => {
            for (let i = 0; i < this.imageSizes.length; i++) {
                this.effectImages[i] = img;
            }
            this.imageLoaded = true;
            console.log(`✅ ${this.imageType}画像の読み込み完了！`);
        };
        img.onerror = () => {
            console.warn(`❌ ${this.imageType}画像の読み込み失敗: ${this.imagePath}`);
            this.imageLoaded = false;
        };
        img.src = this.imagePath;
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        // マルチタッチ完全対応
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        document.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: true });
        
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }
    
    handleTouchStart(e) {
        Array.from(e.touches).forEach(touch => {
            if (!this.knownTouchIds.has(touch.identifier)) {
                this.knownTouchIds.add(touch.identifier);
                const touchData = {
                    x: touch.clientX,
                    y: touch.clientY,
                    startTime: Date.now(),
                    lastTime: Date.now()
                };
                
                this.activeTouches.set(touch.identifier, touchData);
                this.lastTouchPositions.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
                
                this.createOptimizedBurst(touch.clientX, touch.clientY);
                this.addTouchPoint(touch.clientX, touch.clientY);
                
                console.log(`✨ 新規タッチ開始: ${touch.identifier}`);
            }
        });
    }
    
    handleTouchMove(e) {
        Array.from(e.touches).forEach(touch => {
            if (!this.knownTouchIds.has(touch.identifier)) {
                console.log(`touchmoveで新規タッチ検出: ${touch.identifier}`);
                this.knownTouchIds.add(touch.identifier);
                const touchData = {
                    x: touch.clientX,
                    y: touch.clientY,
                    startTime: Date.now(),
                    lastTime: Date.now()
                };
                
                this.activeTouches.set(touch.identifier, touchData);
                this.lastTouchPositions.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
                
                this.createOptimizedBurst(touch.clientX, touch.clientY);
            }
            
            if (this.activeTouches.has(touch.identifier)) {
                const lastPos = this.lastTouchPositions.get(touch.identifier);
                const currentPos = { x: touch.clientX, y: touch.clientY };
                
                const distance = Math.sqrt(
                    Math.pow(currentPos.x - lastPos.x, 2) + 
                    Math.pow(currentPos.y - lastPos.y, 2)
                );
                
                if (distance > 15) {
                    const steps = Math.floor(distance / 10);
                    for (let i = 1; i <= steps; i++) {
                        const ratio = i / steps;
                        const interpX = lastPos.x + (currentPos.x - lastPos.x) * ratio;
                        const interpY = lastPos.y + (currentPos.y - lastPos.y) * ratio;
                        this.createOptimizedTrail(interpX, interpY);
                    }
                } else {
                    this.createOptimizedTrail(currentPos.x, currentPos.y);
                }
                
                this.addTouchPoint(currentPos.x, currentPos.y);
                this.lastTouchPositions.set(touch.identifier, currentPos);
                
                const touchData = this.activeTouches.get(touch.identifier);
                touchData.x = currentPos.x;
                touchData.y = currentPos.y;
                touchData.lastTime = Date.now();
            }
        });
        
        Array.from(e.changedTouches).forEach(touch => {
            if (this.activeTouches.has(touch.identifier)) {
                const currentPos = { x: touch.clientX, y: touch.clientY };
                this.createOptimizedTrail(currentPos.x, currentPos.y);
            }
        });
    }
    
    handleTouchEnd(e) {
        Array.from(e.changedTouches).forEach(touch => {
            if (this.activeTouches.has(touch.identifier)) {
                this.createOptimizedFinale(touch.clientX, touch.clientY);
                this.activeTouches.delete(touch.identifier);
                this.lastTouchPositions.delete(touch.identifier);
                this.knownTouchIds.delete(touch.identifier);
                
                console.log(`🎆 タッチ終了: ${touch.identifier}`);
            }
        });
        
        if (this.activeTouches.size === 0) {
            setTimeout(() => {
                this.touchPoints = [];
                console.log('全タッチ終了 - 軌跡クリア');
            }, 200);
        }
    }
    
    handleMouseDown(e) {
        if (!this.activeTouches.has('mouse')) {
            this.activeTouches.set('mouse', {
                x: e.clientX,
                y: e.clientY,
                startTime: Date.now(),
                lastTime: Date.now()
            });
            this.lastTouchPositions.set('mouse', { x: e.clientX, y: e.clientY });
            this.createOptimizedBurst(e.clientX, e.clientY);
            this.addTouchPoint(e.clientX, e.clientY);
        }
    }
    
    handleMouseMove(e) {
        if (this.activeTouches.has('mouse')) {
            const lastPos = this.lastTouchPositions.get('mouse');
            const currentPos = { x: e.clientX, y: e.clientY };
            
            const distance = Math.sqrt(
                Math.pow(currentPos.x - lastPos.x, 2) + 
                Math.pow(currentPos.y - lastPos.y, 2)
            );
            
            if (distance > 12) {
                const steps = Math.floor(distance / 8);
                for (let i = 1; i <= steps; i++) {
                    const ratio = i / steps;
                    const interpX = lastPos.x + (currentPos.x - lastPos.x) * ratio;
                    const interpY = lastPos.y + (currentPos.y - lastPos.y) * ratio;
                    this.createOptimizedTrail(interpX, interpY);
                }
            } else {
                this.createOptimizedTrail(currentPos.x, currentPos.y);
            }
            
            this.addTouchPoint(currentPos.x, currentPos.y);
            this.lastTouchPositions.set('mouse', currentPos);
        }
    }
    
    handleMouseUp(e) {
        if (this.activeTouches.has('mouse')) {
            this.createOptimizedFinale(e.clientX, e.clientY);
            this.activeTouches.delete('mouse');
            this.lastTouchPositions.delete('mouse');
            
            setTimeout(() => {
                this.touchPoints = [];
            }, 200);
        }
    }
    
    addTouchPoint(x, y) {
        this.touchPoints.push({
            x: x,
            y: y,
            time: Date.now()
        });
        
        this.touchPoints = this.touchPoints.filter(point => 
            Date.now() - point.time < 250
        );
    }
    
    createOptimizedBurst(x, y) {
        const particleCount = 12; // 増加
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const useImage = this.imageLoaded && Math.random() < 0.6;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 2,
                life: 1,
                decay: 0.02,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'star',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0,
                glowIntensity: 1.0 // 最大輝度
            });
        }
    }
    
    createOptimizedTrail(x, y) {
        for (let i = 0; i < 4; i++) {
            const offsetX = (Math.random() - 0.5) * 18;
            const offsetY = (Math.random() - 0.5) * 18;
            const useImage = this.imageLoaded && Math.random() < 0.5;
            
            this.particles.push({
                x: x + offsetX,
                y: y + offsetY,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -(Math.random() * 1.5 + 0.8),
                size: Math.random() * 2.5 + 1.5,
                life: 1,
                decay: 0.025,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'trail',
                twinkle: Math.random() < 0.5,
                twinklePhase: 0,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0,
                glowIntensity: 0.8
            });
        }
    }
    
    createOptimizedFinale(x, y) {
        const particleCount = 16; // 増加
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            const useImage = this.imageLoaded && Math.random() < 0.7;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 3,
                life: 1,
                decay: 0.015,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'finale',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.4,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0,
                glow: true,
                glowIntensity: 1.0
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.rotation += particle.rotationSpeed;
            
            if (particle.twinkle) {
                particle.twinklePhase += 0.3;
            }
            
            particle.vy += 0.025;
            particle.vx *= 0.995;
            particle.vy *= 0.995;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSubtleTrail();
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            let alpha = particle.life * (particle.glowIntensity || 0.8);
            
            if (particle.twinkle) {
                alpha *= (Math.sin(particle.twinklePhase) * 0.3 + 0.7);
            }
            
            this.ctx.globalAlpha = Math.min(alpha, 1.0);
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            if (particle.type === 'image' && this.imageLoaded && this.effectImages[particle.imageIndex]) {
                // 画像（小判 or LIFE）の描画
                const img = this.effectImages[particle.imageIndex];
                const size = this.imageSizes[particle.imageIndex] * (particle.size / 2);
                
                this.ctx.shadowColor = this.shadowColor;
                this.ctx.shadowBlur = particle.glow ? 15 : 10;
                
                this.ctx.drawImage(img, -size/2, -size/2, size, size);
            } else {
                // 通常の星型パーティクル
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = particle.glow ? 12 : 8;
                
                this.drawStar(0, 0, particle.size);
            }
            
            this.ctx.restore();
        });
    }
    
    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const dx = Math.cos(angle) * radius;
            const dy = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x + dx, y + dy);
            } else {
                this.ctx.lineTo(x + dx, y + dy);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawSubtleTrail() {
        if (this.touchPoints.length > 1) {
            this.ctx.save();
            
            this.ctx.globalAlpha = 0.08;
            this.ctx.strokeStyle = this.trailColor;
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = this.trailColor;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.touchPoints[0].x, this.touchPoints[0].y);
            
            for (let i = 1; i < this.touchPoints.length; i++) {
                this.ctx.lineTo(this.touchPoints[i].x, this.touchPoints[i].y);
            }
            
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    optimizePerformance() {
        if (this.particles.length > 300) {
            this.particles = this.particles.slice(-200);
        }
    }
    
    enableLowPowerMode() {
        this.lowPowerMode = true;
    }
    
    disableLowPowerMode() {
        this.lowPowerMode = false;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// グローバル露出（後方互換性のため）
window.MultiTouchKobanMagic = AdaptiveMultiTouchMagic;
window.AdaptiveMultiTouchMagic = AdaptiveMultiTouchMagic;

// モジュールエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdaptiveMultiTouchMagic;
}
