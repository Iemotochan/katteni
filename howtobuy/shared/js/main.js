/*
 * RYO Coin ハブページ + サウンドノベル統合システム
 * メインページ機能 + ハブページ専用機能
 */

class RYOCoinApp {
    constructor() {
        this.starfieldEffect = null;
        this.isHubPage = document.body.classList.contains('hub-page');
        this.init();
    }
    
    init() {
        this.initializeStarfield();
        this.setupOptimization();
        this.setupImageCheck();
        
        if (this.isHubPage) {
            this.setupHubPageFeatures();
        }
    }
    
    initializeStarfield() {
        // 新しい適応型クラスを使用
        if (typeof AdaptiveMultiTouchMagic !== 'undefined') {
            this.starfieldEffect = new AdaptiveMultiTouchMagic();
            console.log('🎌 RYOコイン適応型エフェクト開始！');
        } else if (typeof MultiTouchKobanMagic !== 'undefined') {
            // 後方互換性
            this.starfieldEffect = new MultiTouchKobanMagic();
            console.log('🎌 RYOコイン従来型エフェクト開始！');
        } else {
            console.error('❌ エフェクトクラスが読み込まれていません');
        }
    }
    
    setupOptimization() {
        // ページ遷移時のクリーンアップ
        window.addEventListener('beforeunload', () => {
            if (this.starfieldEffect) {
                this.starfieldEffect.destroy();
                console.log('🧹 エフェクトをクリーンアップしました');
            }
        });
        
        // パフォーマンス監視
        this.setupPerformanceMonitoring();
        
        // バッテリー最適化
        this.setupBatteryOptimization();
    }
    
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 3000) { // 3秒ごと
                const fps = Math.round(frameCount / 3);
                frameCount = 0;
                lastTime = currentTime;
                
                if (fps < 20) {
                    console.warn('⚠️ パフォーマンス低下検出 - FPS:', fps);
                    this.optimizePerformance();
                } else {
                    console.log('✅ パフォーマンス良好 - FPS:', fps);
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        // 1秒後に監視開始
        setTimeout(() => checkPerformance(), 1000);
    }
    
    setupBatteryOptimization() {
        // バッテリー最適化
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    console.log('🔋 低バッテリーモード有効');
                    this.enableLowPowerMode();
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2) {
                        this.enableLowPowerMode();
                    }
                });
            }).catch(() => {
                console.log('⚠️ バッテリー情報の取得に失敗');
            });
        }
        
        // ページ非表示時の省電力モード
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📱 ページ非表示 → 省電力モード');
                this.enableLowPowerMode();
            } else {
                console.log('📱 ページ表示 → 通常モード');
                this.disableLowPowerMode();
            }
        });
    }
    
    setupImageCheck() {
        // 共通画像の存在確認
        const images = [
            { path: 'shared/images/ryokosensei.png', name: '両子先生' },
            { path: 'shared/images/zentasensei.png', name: 'ゼン太先生' }
        ];
        
        images.forEach(({ path, name }) => {
            const img = new Image();
            img.onload = () => console.log(`✅ ${name}画像確認完了: ${path}`);
            img.onerror = () => console.warn(`⚠️ ${name}画像が見つかりません: ${path}`);
            img.src = path;
        });
        
        // 音声ファイルの存在確認
        this.checkAudioFiles();
        
        // ページタイプの表示
        this.displayPageInfo();
    }
    
    checkAudioFiles() {
        // 小判効果音
        const kobanAudio = new Audio();
        kobanAudio.oncanplaythrough = () => console.log('✅ 小判効果音確認完了: shared/audio/koban.mp3');
        kobanAudio.onerror = () => console.warn('⚠️ 小判効果音が見つかりません: shared/audio/koban.mp3');
        kobanAudio.src = 'shared/audio/koban.mp3';
        
        // oshiete音声
        const oshieteAudio = new Audio();
        oshieteAudio.oncanplaythrough = () => console.log('✅ oshiete音声確認完了: shared/audio/oshiete.mp3');
        oshieteAudio.onerror = () => console.warn('⚠️ oshiete音声が見つかりません: shared/audio/oshiete.mp3');
        oshieteAudio.src = 'shared/audio/oshiete.mp3';
    }
    
    displayPageInfo() {
        const path = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        if (this.isHubPage) {
            console.log('🎓 ハブページ - 4話選択メニュー');
        } else if (path.includes('/1/')) {
            console.log('📖 第1話: BitTrade編');
        } else if (path.includes('/2/')) {
            console.log('📖 第2話: MEXC編');
        } else if (path.includes('/3/')) {
            console.log('📖 第3話: 送金編');
        } else if (path.includes('/4/')) {
            console.log('📖 第4話: RYO購入編');
        } else {
            console.log('🏅 標準ページ');
        }
    }
    
    // ハブページ専用機能
    setupHubPageFeatures() {
        console.log('🎓 ハブページ専用機能を初期化');
        
        // 小判効果音プレイヤー
        const kobanPlayer = document.getElementById('kobanPlayer');
        if (kobanPlayer) {
            kobanPlayer.volume = 0.3;
            
            // ストーリーカードのクリック効果
            document.querySelectorAll('.story-card').forEach(card => {
                card.addEventListener('click', () => {
                    kobanPlayer.currentTime = 0;
                    kobanPlayer.play().catch(() => {});
                });
            });
        }
        
        // スムーズスクロール
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // ローカルストレージで進行状況管理
        this.setupProgressTracking();
        
        console.log('✅ ハブページ専用機能初期化完了');
    }
    
    setupProgressTracking() {
        // 完了した話の記録
        const completedStories = JSON.parse(localStorage.getItem('ryoCoinProgress') || '[]');
        
        // 進行状況の視覚的表示
        completedStories.forEach(storyId => {
            const progressStep = document.querySelector(`[data-step="${storyId}"]`);
            if (progressStep) {
                progressStep.classList.add('completed');
            }
        });
        
        console.log('📊 進行状況:', completedStories);
    }
    
    optimizePerformance() {
        if (this.starfieldEffect && typeof this.starfieldEffect.optimizePerformance === 'function') {
            this.starfieldEffect.optimizePerformance();
            console.log('⚡ パフォーマンス最適化を実行');
        }
    }
    
    enableLowPowerMode() {
        if (this.starfieldEffect && typeof this.starfieldEffect.enableLowPowerMode === 'function') {
            this.starfieldEffect.enableLowPowerMode();
            console.log('🔋 低電力モードを有効化');
        }
    }
    
    disableLowPowerMode() {
        if (this.starfieldEffect && typeof this.starfieldEffect.disableLowPowerMode === 'function') {
            this.starfieldEffect.disableLowPowerMode();
            console.log('⚡ 通常モードに復帰');
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 RYOコインサイト初期化開始...');
    
    // 短い遅延を設けてstarfield-effect.jsの読み込み完了を待つ
    setTimeout(() => {
        window.ryoCoinApp = new RYOCoinApp();
        console.log('✨ RYOコインアプリケーション起動完了！');
    }, 100);
});

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('❌ JavaScript エラー:', event.error);
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ 未処理のPromise拒否:', event.reason);
});

// 開発者向け情報
console.log(`
🎌 RYO Coin Effects System Version: 3.0
Adaptive Features:
- ✅ 適応型テーマ切り替え
- ✅ マルチタッチ対応  
- ✅ パフォーマンス監視
- ✅ バッテリー最適化
- ✅ エラーハンドリング
- ✅ ハブページ対応
- ✅ 進行状況追跡
`);
