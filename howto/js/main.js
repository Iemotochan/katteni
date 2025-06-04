/* RYO Coin Main Application - 完全レスポンシブ対応版 */

class RYOCoinApp {
    constructor() {
        this.starfieldEffect = null;
        this.deviceInfo = {};
        this.resizeObserver = null;
        this.orientationHandler = null;
        this.init();
    }

    init() {
        this.detectDevice();
        this.initializeStarfield();
        this.setupResponsiveSystem();
        this.setupOptimization();
        this.setupImageCheck();
        this.startPerformanceMonitoring();
    }

    // デバイス検出システム
    detectDevice() {
        const ua = navigator.userAgent;
        const screen = window.screen;
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.deviceInfo = {
            // デバイス種別
            isIPhone: /iPhone/.test(ua),
            isAndroid: /Android/.test(ua),
            isIPad: /iPad/.test(ua),
            isMobile: /Mobi|Android/i.test(ua),
            
            // 画面情報
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: viewport.width,
            viewportHeight: viewport.height,
            devicePixelRatio: window.devicePixelRatio || 1,
            
            // 特殊デバイス検出
            hasNotch: this.detectNotch(),
            isDynamicIsland: this.detectDynamicIsland(),
            isFoldable: this.detectFoldable(),
            
            // ブラウザ情報
            isWebView: this.detectWebView(),
            supportsSafeArea: CSS.supports('padding', 'env(safe-area-inset-top)'),
            
            // パフォーマンス指標
            memoryLimit: this.getMemoryInfo(),
            connectionType: this.getConnectionType()
        };

        console.log('📱 デバイス詳細情報:', this.deviceInfo);
        this.applyDeviceSpecificOptimizations();
    }

    // ノッチ検出
    detectNotch() {
        if (CSS.supports('padding', 'env(safe-area-inset-top)')) {
            const testElement = document.createElement('div');
            testElement.style.paddingTop = 'env(safe-area-inset-top)';
            document.body.appendChild(testElement);
            const computedPadding = window.getComputedStyle(testElement).paddingTop;
            document.body.removeChild(testElement);
            return parseFloat(computedPadding) > 0;
        }
        return false;
    }

    // Dynamic Island検出
    detectDynamicIsland() {
        const ua = navigator.userAgent;
        return /iPhone15|iPhone14 Pro/.test(ua) || 
               (this.deviceInfo?.screenWidth === 393 && this.deviceInfo?.screenHeight === 852);
    }

    // 折りたたみデバイス検出
    detectFoldable() {
        return 'screen' in window && 'orientation' in window.screen && 
               typeof window.screen.orientation.angle !== 'undefined' &&
               window.innerWidth > 600 && window.innerHeight < 500;
    }

    // WebView検出
    detectWebView() {
        const ua = navigator.userAgent;
        return /wv|WebView/.test(ua) || 
               (window.navigator.standalone !== undefined) ||
               (window.matchMedia('(display-mode: standalone)').matches);
    }

    // メモリ情報取得
    getMemoryInfo() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }

    // 接続タイプ取得
    getConnectionType() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }

    // デバイス固有最適化
    applyDeviceSpecificOptimizations() {
        const { deviceInfo } = this;
        
        // iPhone対応
        if (deviceInfo.isIPhone) {
            this.applyiPhoneOptimizations();
        }
        
        // Android対応
        if (deviceInfo.isAndroid) {
            this.applyAndroidOptimizations();
        }
        
        // 低性能デバイス対応
        if (deviceInfo.memoryLimit?.limit < 1000) {
            this.enableLowEndDeviceMode();
        }
        
        // 低速回線対応
        if (deviceInfo.connectionType?.effectiveType === '2g' || 
            deviceInfo.connectionType?.saveData) {
            this.enableDataSaverMode();
        }
    }

    // iPhone固有最適化
    applyiPhoneOptimizations() {
        // iOS Safari特有の問題対応
        document.documentElement.style.setProperty(
            '--ios-keyboard-height', 
            '0px'
        );
        
        // Virtual Keyboard API対応
        if ('virtualKeyboard' in navigator) {
            navigator.virtualKeyboard.overlaysContent = true;
        }
        
        // iOS Safariのバウンス無効化
        document.addEventListener('touchmove', (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        }, { passive: false });
        
        console.log('🍎 iPhone最適化適用完了');
    }

    // Android固有最適化
    applyAndroidOptimizations() {
        // Androidの戻るボタン対応
        if ('history' in window && 'pushState' in history) {
            window.addEventListener('popstate', (e) => {
                // カスタム戻る処理
                if (window.ryoCoinNovel) {
                    window.ryoCoinNovel.previousScene();
                }
                history.pushState(null, '', location.href);
            });
            history.pushState(null, '', location.href);
        }
        
        // Android Chrome特有のビューポート問題対応
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.setAttribute('content', 
                viewportMeta.getAttribute('content') + ', interactive-widget=resizes-content'
            );
        }
        
        console.log('🤖 Android最適化適用完了');
    }

    // 低性能デバイスモード
    enableLowEndDeviceMode() {
        // アニメーション簡素化
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        // エフェクト軽量化
        if (this.starfieldEffect && typeof this.starfieldEffect.setLowEndMode === 'function') {
            this.starfieldEffect.setLowEndMode(true);
        }
        
        console.log('⚡ 低性能デバイスモード有効化');
    }

    // データセーバーモード
    enableDataSaverMode() {
        // 画像品質調整
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && !img.src.includes('?quality=')) {
                img.src += '?quality=80&format=webp';
            }
        });
        
        // 音声無効化
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.preload = 'none';
        });
        
        console.log('📶 データセーバーモード有効化');
    }

    // レスポンシブシステム設定
    setupResponsiveSystem() {
        // 動的ビューポート高さ計算
        this.updateViewportHeight();
        
        // リサイズ観察
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(() => {
                this.handleViewportChange();
            });
            this.resizeObserver.observe(document.documentElement);
        }
        
        // オリエンテーション変更
        this.orientationHandler = () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        };
        
        window.addEventListener('orientationchange', this.orientationHandler);
        window.addEventListener('resize', this.orientationHandler);
        
        // フルスクリーン変更
        document.addEventListener('fullscreenchange', () => {
            this.handleFullscreenChange();
        });
        
        // キーボード表示/非表示検出
        this.setupKeyboardDetection();
        
        console.log('📏 レスポンシブシステム初期化完了');
    }

    // ビューポート高さ更新
    updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // セーフエリア値の更新
        this.updateSafeAreaValues();
        
        // デバッグ情報更新
        this.updateDebugInfo();
    }

    // セーフエリア値更新
    updateSafeAreaValues() {
        const testElement = document.createElement('div');
        testElement.style.position = 'fixed';
        testElement.style.top = '0';
        testElement.style.paddingTop = 'env(safe-area-inset-top)';
        document.body.appendChild(testElement);
        
        const safeAreaTop = window.getComputedStyle(testElement).paddingTop;
        document.documentElement.style.setProperty('--safe-area-inset-top', safeAreaTop);
        
        document.body.removeChild(testElement);
    }

    // デバッグ情報更新
    updateDebugInfo() {
        const debugInfo = {
            viewport: `${window.innerWidth}×${window.innerHeight}`,
            screen: `${screen.width}×${screen.height}`,
            ratio: window.devicePixelRatio,
            orientation: screen.orientation?.angle || 'unknown'
        };
        
        // デバッグ用属性設定（開発時のみ）
        if (localStorage.getItem('ryocoin-debug') === 'true') {
            document.body.setAttribute('data-debug', 
                `${debugInfo.viewport} | ${debugInfo.orientation}°`
            );
        }
    }

    // ビューポート変更処理
    handleViewportChange() {
        this.updateViewportHeight();
        this.adjustLayoutForViewport();
        
        // パフォーマンス監視
        this.checkLayoutPerformance();
    }

    // オリエンテーション変更処理
    handleOrientationChange() {
        this.updateViewportHeight();
        
        // オリエンテーション固有調整
        const isLandscape = window.innerWidth > window.innerHeight;
        document.documentElement.classList.toggle('landscape', isLandscape);
        document.documentElement.classList.toggle('portrait', !isLandscape);
        
        // レイアウト再計算
        setTimeout(() => {
            this.recalculateLayout();
        }, 100);
        
        console.log(`📱 オリエンテーション変更: ${isLandscape ? '横画面' : '縦画面'}`);
    }

    // レイアウト調整
    adjustLayoutForViewport() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // 極小画面対応
        if (viewport.height < 500) {
            document.documentElement.classList.add('compact-height');
            this.enableCompactMode();
        } else {
            document.documentElement.classList.remove('compact-height');
            this.disableCompactMode();
        }
        
        // 横長画面対応
        if (viewport.width / viewport.height > 2) {
            document.documentElement.classList.add('ultra-wide');
        } else {
            document.documentElement.classList.remove('ultra-wide');
        }
    }

    // コンパクトモード
    enableCompactMode() {
        // フォントサイズ調整
        document.documentElement.style.setProperty('--base-font-size', '13px');
        
        // 余白調整
        document.documentElement.style.setProperty('--compact-padding', '8px');
        
        console.log('📦 コンパクトモード有効化');
    }

    disableCompactMode() {
        document.documentElement.style.setProperty('--base-font-size', '15px');
        document.documentElement.style.setProperty('--compact-padding', '16px');
        
        console.log('📦 コンパクトモード無効化');
    }

    // キーボード検出
    setupKeyboardDetection() {
        let initialViewportHeight = window.innerHeight;
        
        const handleViewportHeightChange = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // キーボード表示判定（100px以上の差）
            const isKeyboardVisible = heightDifference > 100;
            
            if (isKeyboardVisible) {
                document.documentElement.classList.add('keyboard-visible');
                document.documentElement.style.setProperty(
                    '--keyboard-height', 
                    `${heightDifference}px`
                );
                console.log('⌨️ キーボード表示検出');
            } else {
                document.documentElement.classList.remove('keyboard-visible');
                document.documentElement.style.setProperty('--keyboard-height', '0px');
                console.log('⌨️ キーボード非表示検出');
            }
        };
        
        // Visual Viewport API対応
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', handleViewportHeightChange);
        } else {
            // フォールバック
            window.addEventListener('resize', handleViewportHeightChange);
        }
    }

    // レイアウト再計算
    recalculateLayout() {
        // すべてのレイアウト関連要素を再計算
        const elements = document.querySelectorAll('.message-area, .content-area, .progress-area');
        elements.forEach(element => {
            // 強制再描画
            element.style.transform = 'translateZ(0)';
            setTimeout(() => {
                element.style.transform = '';
            }, 1);
        });
        
        // エフェクト再調整
        if (this.starfieldEffect && typeof this.starfieldEffect.resize === 'function') {
            this.starfieldEffect.resize();
        }
    }

    // フルスクリーン変更処理
    handleFullscreenChange() {
        const isFullscreen = !!document.fullscreenElement;
        document.documentElement.classList.toggle('fullscreen', isFullscreen);
        
        setTimeout(() => {
            this.updateViewportHeight();
            this.recalculateLayout();
        }, 200);
        
        console.log(`🖥️ フルスクリーン: ${isFullscreen ? 'ON' : 'OFF'}`);
    }

    // レイアウトパフォーマンス監視
    checkLayoutPerformance() {
        if ('performance' in window && performance.mark) {
            performance.mark('layout-start');
            
            requestAnimationFrame(() => {
                performance.mark('layout-end');
                performance.measure('layout-duration', 'layout-start', 'layout-end');
                
                const measures = performance.getEntriesByName('layout-duration');
                if (measures.length > 0) {
                    const duration = measures[measures.length - 1].duration;
                    if (duration > 16) { // 1フレーム以上
                        console.warn(`⚠️ レイアウト処理時間: ${duration.toFixed(2)}ms`);
                    }
                }
                
                performance.clearMarks();
                performance.clearMeasures();
            });
        }
    }

    // Starfield初期化
    initializeStarfield() {
        if (typeof AdaptiveMultiTouchMagic !== 'undefined') {
            this.starfieldEffect = new AdaptiveMultiTouchMagic();
            console.log('🎌 適応型エフェクト初期化完了');
        } else if (typeof MultiTouchKobanMagic !== 'undefined') {
            this.starfieldEffect = new MultiTouchKobanMagic();
            console.log('🎌 従来型エフェクト初期化完了');
        } else {
            console.error('❌ エフェクトクラスが見つかりません');
        }
    }

    // パフォーマンス監視開始
    startPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let performanceIssues = 0;

        const monitor = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 3000) {
                const fps = Math.round(frameCount / 3);
                frameCount = 0;
                lastTime = currentTime;

                if (fps < 20) {
                    performanceIssues++;
                    console.warn(`⚠️ パフォーマンス低下: ${fps}FPS (${performanceIssues}回目)`);
                    
                    if (performanceIssues >= 3) {
                        this.enablePerformanceMode();
                    }
                } else {
                    performanceIssues = Math.max(0, performanceIssues - 1);
                    console.log(`✅ パフォーマンス良好: ${fps}FPS`);
                }
            }

            requestAnimationFrame(monitor);
        };

        setTimeout(monitor, 1000);
    }

    // パフォーマンスモード有効化
    enablePerformanceMode() {
        // アニメーション軽量化
        document.documentElement.classList.add('performance-mode');
        
        // エフェクト軽量化
        if (this.starfieldEffect) {
            this.optimizePerformance();
        }
        
        console.log('🚀 パフォーマンスモード有効化');
    }

    setupOptimization() {
        // ページ遷移時のクリーンアップ
        window.addEventListener('beforeunload', () => {
            this.destroy();
        });

        // バッテリー最適化
        this.setupBatteryOptimization();
        
        // メモリ監視
        this.setupMemoryMonitoring();
    }

    setupBatteryOptimization() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const handleBatteryChange = () => {
                    if (battery.level < 0.2) {
                        this.enableLowPowerMode();
                    } else if (battery.level > 0.5) {
                        this.disableLowPowerMode();
                    }
                };

                battery.addEventListener('levelchange', handleBatteryChange);
                handleBatteryChange();
            }).catch(() => {
                console.log('⚠️ バッテリー情報取得不可');
            });
        }

        // ページ可視性変更
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.enableLowPowerMode();
            } else {
                this.disableLowPowerMode();
            }
        });
    }

    // メモリ監視
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
                const usage = (usedMB / limitMB) * 100;

                if (usage > 80) {
                    console.warn(`⚠️ メモリ使用量高: ${usage.toFixed(1)}% (${usedMB}MB/${limitMB}MB)`);
                    this.optimizeMemory();
                }
            }, 10000);
        }
    }

    // メモリ最適化
    optimizeMemory() {
        // 不要な参照をクリア
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        // キャッシュクリア
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.onscreen) {
                img.src = '';
            }
        });
        
        console.log('🧹 メモリ最適化実行');
    }

    setupImageCheck() {
        const imagesToCheck = [
            'image/koban.png',
            'image/life.png', 
            'image/ch.png',
            'image/ryokosensei.png',
            'image/zentasensei.png'
        ];

        imagesToCheck.forEach(src => {
            const img = new Image();
            img.onload = () => console.log(`✅ 画像確認完了: ${src}`);
            img.onerror = () => console.warn(`⚠️ 画像未発見: ${src}`);
            img.src = src;
        });

        this.checkAudioFiles();
        this.displayPageInfo();
    }

    checkAudioFiles() {
        const audioFiles = [
            'audio/oshiete.mp3',
            'audio/bgm.mp3',
            'audio/koban.mp3'
        ];

        audioFiles.forEach(src => {
            const audio = new Audio();
            audio.oncanplaythrough = () => console.log(`✅ 音声確認完了: ${src}`);
            audio.onerror = () => console.warn(`⚠️ 音声未発見: ${src}`);
            audio.src = src;
        });
    }

    displayPageInfo() {
        console.log(`📄 ページ情報:
- URL: ${window.location.href}
- タイトル: ${document.title}
- ビューポート: ${window.innerWidth}×${window.innerHeight}
- デバイス: ${this.deviceInfo.isIPhone ? 'iPhone' : this.deviceInfo.isAndroid ? 'Android' : 'その他'}
- 接続: ${this.deviceInfo.connectionType?.effectiveType || '不明'}`);
    }

    optimizePerformance() {
        if (this.starfieldEffect && typeof this.starfieldEffect.optimizePerformance === 'function') {
            this.starfieldEffect.optimizePerformance();
        }
    }

    enableLowPowerMode() {
        if (this.starfieldEffect && typeof this.starfieldEffect.enableLowPowerMode === 'function') {
            this.starfieldEffect.enableLowPowerMode();
        }
        document.documentElement.classList.add('low-power-mode');
        console.log('🔋 低電力モード有効化');
    }

    disableLowPowerMode() {
        if (this.starfieldEffect && typeof this.starfieldEffect.disableLowPowerMode === 'function') {
            this.starfieldEffect.disableLowPowerMode();
        }
        document.documentElement.classList.remove('low-power-mode');
        console.log('⚡ 通常モード復帰');
    }

    // クリーンアップ
    destroy() {
        if (this.starfieldEffect) {
            this.starfieldEffect.destroy();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        if (this.orientationHandler) {
            window.removeEventListener('orientationchange', this.orientationHandler);
            window.removeEventListener('resize', this.orientationHandler);
        }
        
        console.log('🧹 アプリケーションクリーンアップ完了');
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 RYOコインサイト初期化開始...');
    
    setTimeout(() => {
        window.ryoCoinApp = new RYOCoinApp();
        console.log('✨ 完全レスポンシブ対応版起動完了！');
    }, 100);
});

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('❌ JavaScript エラー:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ 未処理のPromise拒否:', event.reason);
});

// 開発者向けデバッグ機能
window.RYODebug = {
    enableDebugMode: () => {
        localStorage.setItem('ryocoin-debug', 'true');
        location.reload();
    },
    
    disableDebugMode: () => {
        localStorage.removeItem('ryocoin-debug');
        location.reload();
    },
    
    getDeviceInfo: () => {
        return window.ryoCoinApp?.deviceInfo || 'アプリ未初期化';
    },
    
    simulateOrientation: () => {
        if (window.ryoCoinApp) {
            window.ryoCoinApp.handleOrientationChange();
        }
    },
    
    simulateResize: (width, height) => {
        Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
        window.dispatchEvent(new Event('resize'));
    }
};

console.log(`
🎌 RYO Coin Complete Responsive System
Version: 3.0 (完全対応版)

📱 対応デバイス:
- ✅ iPhone (全モデル、Dynamic Island対応)
- ✅ Android (全画面サイズ)
- ✅ 折りたたみスマホ
- ✅ タブレット

🔧 主要機能:
- ✅ 動的ビューポート高さ計算
- ✅ セーフエリア完全対応
- ✅ キーボード表示検出
- ✅ オリエンテーション変更対応
- ✅ パフォーマンス監視
- ✅ メモリ管理
- ✅ バッテリー最適化
- ✅ デバイス固有最適化

🎮 デバッグコマンド:
- RYODebug.enableDebugMode()
- RYODebug.getDeviceInfo()
- RYODebug.simulateOrientation()
- RYODebug.simulateResize(width, height)
`);
