/*
 * RYO Coin Main Application
 * 適応型エフェクト制御システム
 */

class RYOCoinApp {
    constructor() {
        this.starfieldEffect = null;
        this.init();
    }
    
    init() {
        this.initializeStarfield();
        this.setupOptimization();
        this.setupImageCheck();
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
        // 小判画像の存在確認
        const kobanImg = new Image();
        kobanImg.onload = () => console.log('✅ 小判画像確認完了: image/koban.png');
        kobanImg.onerror = () => console.warn('⚠️ 小判画像が見つかりません: image/koban.png');
        kobanImg.src = 'image/koban.png';
        
        // LIFE画像の存在確認
        const lifeImg = new Image();
        lifeImg.onload = () => console.log('✅ LIFE画像確認完了: image/life.png');
        lifeImg.onerror = () => console.warn('⚠️ LIFE画像が見つかりません: image/life.png');
        lifeImg.src = 'image/life.png';
        
        // CH画像の存在確認
        const chImg = new Image();
        chImg.onload = () => console.log('✅ CH画像確認完了: image/ch.png');
        chImg.onerror = () => console.warn('⚠️ CH画像が見つかりません: image/ch.png');
        chImg.src = 'image/ch.png';
        
        // 音声ファイルの存在確認（追加）
        this.checkAudioFiles();
        
        // ページタイプの表示
        this.displayPageInfo();
    }
    
    // 音声ファイル確認（新機能）
    checkAudioFiles() {
        // メイン音声ファイル
        const mainAudio = new Audio();
        mainAudio.oncanplaythrough = () => console.log('✅ メイン音声確認完了: audio/oshiete.mp3');
        mainAudio.onerror = () => console.warn('⚠️ メイン音声が見つかりません: audio/oshiete.mp3');
        mainAudio.src = 'audio/oshiete.mp3';
        
        // BGM
        const bgmAudio = new Audio();
        bgmAudio.oncanplaythrough = () => console.log('✅ BGM音声確認完了: audio/bgm.mp3');
        bgmAudio.onerror = () => console.warn('⚠️ BGM音声が見つかりません: audio/bgm.mp3');
        bgmAudio.src = 'audio/bgm.mp3';
    }
    
    displayPageInfo() {
        const path = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        if (path.includes('lifewallet') || path.includes('life') || title.includes('life wallet')) {
            console.log('🌿 LIFE Walletページ - 緑テーマ適用');
        } else if (path.includes('cryptoatm') || path.includes('atm') || title.includes('crypto atm')) {
            console.log('💎 Crypto ATMページ - ブルー＆ホワイトテーマ適用');
        } else if (path.includes('mexc') || title.includes('mexc')) {
            console.log('🏆 MEXCページ - 音声ループ対応ゴールドテーマ適用');
        } else {
            console.log('🏅 標準ページ - 小判テーマ適用');
        }
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
🎌 RYO Coin Effects System
Version: 2.1
Adaptive Features:
- ✅ 適応型テーマ切り替え
- ✅ マルチタッチ対応
- ✅ パフォーマンス監視
- ✅ バッテリー最適化
- ✅ エラーハンドリング
- ✅ 音声ファイル確認機能
`);
修正版 HTML（変更なし、参考として掲載）

Copy<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>MEXC新規登録ガイド | RYOコイン</title>
    <link rel="stylesheet" href="css/main.css">
    <meta name="theme-color" content="#FFD700">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>
    <!-- スターフィールドエフェクト -->
    <canvas id="starfield"></canvas>
    
    <!-- 広いタッチエリア -->
    <div id="wideTouchArea" class="wide-touch-area"></div>
    
    <!-- アプリコンテナ -->
    <div class="app-container">
        <!-- 背景レイヤー（最下層） -->
        <div class="background-layer">
            <img src="image/back.jpg" alt="背景" class="background-img">
        </div>
        
        <!-- 上部ナビゲーション -->
        <nav class="top-nav">
            <button id="backBtn" class="nav-btn">
                <span class="nav-icon">←</span>
                <span class="nav-text">戻る</span>
            </button>
            <button id="skipBtn" class="nav-btn">
                <span class="nav-text">次へ</span>
                <span class="nav-icon">→</span>
            </button>
        </nav>
        
        <!-- 音声ミュートボタン -->
        <div class="audio-controls">
            <button id="muteBtn" class="mute-btn">
                <span id="muteIcon" class="mute-icon">🔊</span>
            </button>
        </div>
        
        <!-- メインコンテンツエリア（中層） -->
        <div class="content-area">
            <div class="screenshot-container">
                <img id="screenshotImg" 
                     src="image/guide.jpg" 
                     alt="MEXC説明画像" 
                     class="screenshot-img show">
                <div class="screenshot-overlay"></div>
            </div>
        </div>
        
        <!-- メッセージエリア（上層） -->
        <div class="message-area">
            <div class="character-container">
                <img id="characterImg" 
                     src="image/ryokosensei.png" 
                     alt="キャラクター" 
                     class="character-img">
            </div>
            <div class="speech-bubble">
                <div class="bubble-arrow"></div>
                <div class="bubble-content">
                    <p id="bubbleText" class="bubble-text">
                        こんにちは！リョウコです✨
                    </p>
                </div>
                <div id="tapIndicator" class="tap-indicator">
                    <span class="tap-text">画面をタップして続行</span>
                    <div class="tap-pulse"></div>
                </div>
            </div>
        </div>
        
        <!-- プログレスエリア（最上層） -->
        <div class="progress-area">
            <div class="progress-info">
                <span id="progressCurrent">1</span> / <span id="progressTotal">10</span>
            </div>
            <div class="progress-bar-bg">
                <div id="progressBar" class="progress-bar"></div>
            </div>
        </div>
    </div>
    
    <!-- 音声ダイアログ -->
    <div id="audioDialog" class="audio-dialog">
        <div class="dialog-overlay"></div>
        <div class="dialog-content">
            <div class="audio-icon">🔊</div>
            <h3>音声を再生しますか？</h3>
            <p>より良い体験のために音声をオンにすることをお勧めします</p>
            <div class="dialog-buttons">
                <button id="audioOnBtn" class="dialog-btn primary">音声ON</button>
                <button id="audioOffBtn" class="dialog-btn secondary">音声OFF</button>
            </div>
        </div>
    </div>
    
    <!-- 音声要素（ループ強化版） -->
    <audio id="voicePlayer" preload="auto">
        <source src="audio/oshiete.mp3" type="audio/mpeg">
    </audio>
    <audio id="bgmPlayer" preload="auto" loop>
        <source src="audio/bgm.mp3" type="audio/mpeg">
        <source src="audio/bgm.ogg" type="audio/ogg">
        <source src="audio/bgm.wav" type="audio/wav">
    </audio>
    
    <!-- スクリプト読み込み -->
    <script src="js/starfield-effect.js"></script>
    <script src="js/sound-novel.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
