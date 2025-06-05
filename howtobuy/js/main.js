/**
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
        console.log('📱 ページ非表示 - 省電力モード');
        this.enableLowPowerMode();
      } else {
        console.log('📱 ページ表示 - 通常モード');
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
  
  // CH画像の存在確認 - この部分だけ追加
  const chImg = new Image();
  chImg.onload = () => console.log('✅ CH画像確認完了: image/ch.png');
  chImg.onerror = () => console.warn('⚠️ CH画像が見つかりません: image/ch.png');
  chImg.src = 'image/ch.png';
  
  // ページタイプの表示
  this.displayPageInfo();
}

displayPageInfo() {
  const path = window.location.pathname.toLowerCase();
  const title = document.title.toLowerCase();
  
  if (path.includes('lifewallet') || path.includes('life') || title.includes('life wallet')) {
    console.log('🌿 LIFE Walletページ - 緑テーマ適用');
  } else if (path.includes('cryptoatm') || path.includes('atm') || title.includes('crypto atm')) {
    console.log('💎 Crypto ATMページ - ブルー＆ホワイトテーマ適用'); // この行だけ追加
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
Version: 2.0 Adaptive
Features: 
- ✅ 適応型テーマ切り替え
- ✅ マルチタッチ対応
- ✅ パフォーマンス監視
- ✅ バッテリー最適化
- ✅ エラーハンドリング
`);



// 言語切り替えボタンのスクロール追従機能
document.addEventListener('DOMContentLoaded', function() {
    const languageSwitcher = document.querySelector('.language-switcher');
    
    if (languageSwitcher) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // スクロール量に応じてスタイルを調整
            if (currentScrollY > 100) {
                languageSwitcher.classList.add('scrolled');
            } else {
                languageSwitcher.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
        
        // ページ読み込み時のフェードイン効果
        setTimeout(() => {
            languageSwitcher.style.opacity = '0';
            languageSwitcher.style.opacity = '1';
        }, 500);
    }
});