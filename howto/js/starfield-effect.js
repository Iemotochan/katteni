/*
 * RYO Coin Adaptive Multi-Touch Magic
 * 軽量化・デバイス最適化版
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
        
        // デバイス判定
        this.isMobile = this.detectMobile();
        this.isLowPowerDevice = this.detectLowPowerDevice();
        
        console.log(`📱 デバイス: ${this.isMobile ? 'モバイル' : 'PC'}`);
        console.log(`⚡ パフォーマンス: ${this.isLowPowerDevice ? '低' : '高'}`);
        
        // ページタイプの自動判定
        this.pageType = this.detectPageType();
        console.log(`🎨 ページタイプ検出: ${this.pageType}`);
        
        // 画像とテーマ設定
        this.setupTheme();
        
        // 画像の管理
        this.effectImages = [];
        this.imageLoaded = false;
        this.imageSizes = [6, 10, 14, 18]; // サイズを小さく
        
        this.loadEffectImages();
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    // デバイス判定
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (window.innerWidth <= 768);
    }
    
    // 低パフォーマンスデバイス判定
    detectLowPowerDevice() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true;
        
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        
        // 古いデバイスや統合GPUを検出
        return /Intel|Software|Mesa|llvmpipe/i.test(renderer) ||
               navigator.hardwareConcurrency < 4 ||
               this.isMobile;
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
                'rgba(34, 197, 94, 0.9)',   // エメラルドグリーン
                'rgba(22, 163, 74, 0.8)',   // グリーン
                'rgba(16, 185, 129, 0.85)',  // エメラルド
                'rgba(52, 211, 153, 0.8)',  // ライトエメラルド
            ];
            this.trailColor = 'rgba(34, 197, 94, 0.3)';
            this.shadowColor = 'rgba(34, 197, 94, 0.8)';
            console.log('🌿 LIFE Walletテーマを適用');
        } else if (this.pageType === 'cryptoatm') {
            // Crypto ATM専用テーマ（ブルー＆ホワイト系）
            this.imagePath = 'image/ch.png';
            this.imageType = 'CH';
            this.colors = [
                'rgba(59, 130, 246, 0.9)',  // ブルー
                'rgba(96, 165, 250, 0.8)',  // ライトブルー
                'rgba(147, 197, 253, 0.85)', // スカイブルー
                'rgba(255, 255, 255, 0.9)', // ピュアホワイト
            ];
            this.trailColor = 'rgba(59, 130, 246, 0.3)';
            this.shadowColor = 'rgba(59, 130, 246, 0.8)';
            console.log('💎 Crypto ATMテーマを適用');
        } else {
            // デフォルトテーマ（ゴールド系） - 色を自然に調整
            this.imagePath = 'image/koban.png';
            this.imageType = '小判';
            this.colors = [
                'rgba(255, 215, 0, 0.9)',   // ゴールド - 自然な透明度
                'rgba(255, 193, 7, 0.85)',  // アンバー
                'rgba(255, 152, 0, 0.8)',   // オレンジ
                'rgba(255, 235, 59, 0.8)',  // イエロー
                'rgba(255, 193, 7, 0.9)',   // ゴールド2
                'rgba(255, 171, 0, 0.85)'   // ダークオレンジ
            ];
            this.trailColor = 'rgba(255, 215, 0, 0.25)';
            this.shadowColor = 'rgba(255, 215, 0, 0.8)';
            console.log('🏅 自然な小判テーマを適用');
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
        // マルチタッチ対応
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
                
                this.createSimpleBurst(touch.clientX, touch.clientY);
                this.addTouchPoint(touch.clientX, touch.clientY);
                
                console.log(`✨ タッチ開始: ${touch.identifier}`);
            }
        });
    }
    
    handleTouchMove(e) {
        Array.from(e.touches).forEach(touch => {
            if (this.activeTouches.has(touch.identifier)) {
                const lastPos = this.lastTouchPositions.get(touch.identifier);
                const currentPos = { x: touch.clientX, y: touch.clientY };
                
                const distance = Math.sqrt(
                    Math.pow(currentPos.x - lastPos.x, 2) + 
                    Math.pow(currentPos.y - lastPos.y, 2)
                );
                
                if (distance > 20) { // 距離を大きく
                    this.createSimpleTrail(currentPos.x, currentPos.y);
                    this.lastTouchPositions.set(touch.identifier, currentPos);
                }
            }
        });
    }
    
    handleTouchEnd(e) {
        Array.from(e.changedTouches).forEach(touch => {
            if (this.activeTouches.has(touch.identifier)) {
                this.createSimpleFinale(touch.clientX, touch.clientY);
                this.activeTouches.delete(touch.identifier);
                this.lastTouchPositions.delete(touch.identifier);
                this.knownTouchIds.delete(touch.identifier);
                
                console.log(`🎆 タッチ終了: ${touch.identifier}`);
            }
        });
        
        if (this.activeTouches.size === 0) {
            setTimeout(() => {
                this.touchPoints = [];
            }, 150);
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
            this.createSimpleBurst(e.clientX, e.clientY);
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
            
            if (distance > 15) { // PC用距離調整
                this.createSimpleTrail(currentPos.x, currentPos.y);
                this.lastTouchPositions.set('mouse', currentPos);
            }
        }
    }
    
    handleMouseUp(e) {
        if (this.activeTouches.has('mouse')) {
            this.createSimpleFinale(e.clientX, e.clientY);
            this.activeTouches.delete('mouse');
            this.lastTouchPositions.delete('mouse');
            
            setTimeout(() => {
                this.touchPoints = [];
            }, 150);
        }
    }
    
    addTouchPoint(x, y) {
        this.touchPoints.push({
            x: x,
            y: y,
            time: Date.now()
        });
        
        this.touchPoints = this.touchPoints.filter(point => 
            Date.now() - point.time < 200
        );
    }
    
    // シンプルなバーストエフェクト（デバイス別）
    createSimpleBurst(x, y) {
        const particleCount = this.isLowPowerDevice ? 
            (this.isMobile ? 4 : 6) : // 低スペック: モバイル4個、PC6個
            (this.isMobile ? 6 : 8);  // 高スペック: モバイル6個、PC8個
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const useImage = this.imageLoaded && Math.random() < 0.7; // 70%で小判
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 1.5 + 1,
                life: 1,
                decay: 0.03,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'star',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0
            });
        }
    }
    
    // シンプルなトレイルエフェクト
    createSimpleTrail(x, y) {
        const particleCount = this.isLowPowerDevice ? 1 : 2;
        
        for (let i = 0; i < particleCount; i++) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            const useImage = this.imageLoaded && Math.random() < 0.5;
            
            this.particles.push({
                x: x + offsetX,
                y: y + offsetY,
                vx: (Math.random() - 0.5) * 1,
                vy: -(Math.random() * 1 + 0.5),
                size: Math.random() * 1 + 0.8,
                life: 1,
                decay: 0.04,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'trail',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.15,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0
            });
        }
    }
    
    // シンプルなフィナーレエフェクト
    createSimpleFinale(x, y) {
        const particleCount = this.isLowPowerDevice ? 
            (this.isMobile ? 6 : 8) : // 低スペック
            (this.isMobile ? 8 : 10); // 高スペック
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = Math.random() * 3 + 1.5;
            const useImage = this.imageLoaded && Math.random() < 0.8; // 80%で小判
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2 + 1.2,
                life: 1,
                decay: 0.025,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                type: useImage ? 'image' : 'finale',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.25,
                imageIndex: useImage ? Math.floor(Math.random() * this.effectImages.length) : 0,
                glow: true
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
            
            particle.vy += 0.02; // 重力を軽く
            particle.vx *= 0.996;
            particle.vy *= 0.996;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // パーティクル数制限
        const maxParticles = this.isLowPowerDevice ? 50 : 100;
        if (this.particles.length > maxParticles) {
            this.particles = this.particles.slice(-maxParticles);
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSubtleTrail();
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            this.ctx.globalAlpha = particle.life * 0.8;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            if (particle.type === 'image' && this.imageLoaded && this.effectImages[particle.imageIndex]) {
                // 小判画像の描画（色調整なし）
                const img = this.effectImages[particle.imageIndex];
                const size = this.imageSizes[particle.imageIndex] * particle.size;
                
                // 軽いシャドウ
                this.ctx.shadowColor = this.shadowColor;
                this.ctx.shadowBlur = particle.glow ? 6 : 3;
                
                // 画像をそのまま描画（色変更なし）
                this.ctx.drawImage(img, -size/2, -size/2, size, size);
            } else {
                // 通常の星型パーティクル
                this.ctx.fillStyle = particle.color;
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = particle.glow ? 4 : 2;
                
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
            
            this.ctx.globalAlpha = 0.05;
            this.ctx.strokeStyle = this.trailColor;
            this.ctx.lineWidth = 1.5;
            this.ctx.lineCap = 'round';
            
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
        const maxParticles = this.isLowPowerDevice ? 30 : 60;
        if (this.particles.length > maxParticles) {
            this.particles = this.particles.slice(-maxParticles);
        }
    }
    
    enableLowPowerMode() {
        this.isLowPowerDevice = true;
        console.log('🔋 低電力モード有効');
    }
    
    disableLowPowerMode() {
        this.isLowPowerDevice = false;
        console.log('⚡ 通常モード復帰');
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
