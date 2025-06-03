class RyoCoinSoundNovel {
    constructor() {
        this.currentScene = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.audioEnabled = false;
        this.lastTouchTime = 0;
        this.touchCooldown = 400;
        this.typewriterInterval = null; // タイマー管理用
        
        // キャラクター設定
        this.characters = {
            ryoko: {
                name: 'リョウコ先生',
                image: 'image/ryokosensei.png',
                voice: 'female'
            },
            zenta: {
                name: 'ゼンタ先生',
                image: 'image/zentasensei.png',
                voice: 'male'
            }
        };
        
        // シナリオデータ（bg画像指定対応）
        this.scenarios = this.getScenarioData();
        
        this.init();
    }
    
    // =============================== 
    // シナリオデータ（画像指定が簡単）
    // =============================== 
    getScenarioData() {
        return [
            {
                character: 'ryoko',
                screenshot: 'bg1', // bg1.jpg を表示
                texts: [
                    'こんにちは！リョウコです✨\n今日はRYOコインの購入方法を説明します！',
                    '仮想通貨を買うのは初めてでも大丈夫。\n一緒に順番に見ていきましょう。',
                    '準備はいいですか？\nそれでは始めましょう！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bg2', // bg2.png を表示
                texts: [
                    'こんにちは、ゼンタです。\nまず取引所のアカウントを作ります。',
                    'bitFlyer、Coincheck、bitbankなどが有名ですね。',
                    '今回はCoincheckを例に説明します。'
                ],
             
            },
            {
                character: 'ryoko',
                screenshot: 'bg3', // bg3.png を表示
                texts: [
                    'Coincheckのアプリをダウンロードして\n会員登録をします。',
                    'メールアドレスとパスワードを入力して\nアカウントを作成してください。',
                    '登録後、本人確認書類の提出が必要です。'
                ],
       
            },
            {
                character: 'zenta',
                screenshot: 'bg4', // bg4.png を表示
                texts: [
                    '本人確認では運転免許証や\nマイナンバーカードが必要です。',
                    'スマホで書類を撮影して\nアップロードします。',
                    '審査は1-3営業日で完了します。'
                ],
  
            },
            {
                character: 'ryoko',
                screenshot: 'bg5', // bg5.png を表示
                texts: [
                    '本人確認完了後、\n仮想通貨を購入できます！',
                    '日本円を入金して\n好きな通貨を購入しましょう。',
                    'RYOコインは将来性のある通貨です。\n余裕資金で投資してくださいね💎'
                ],
    
            }
        ];
    }
    
    // =============================== 
    // 初期化
    // =============================== 
    init() {
        console.log('🎭 サウンドノベル初期化開始');
        
        if (!this.checkRequiredElements()) {
            console.error('❌ 必要なHTML要素が見つかりません');
            return;
        }
        
        this.setupEventListeners();
        this.showAudioDialog();
        this.preloadImages();
        
        console.log('✅ サウンドノベル初期化完了');
    }
    
    // 必要な要素チェック
    checkRequiredElements() {
        const requiredIds = [
            'wideTouchArea', 'bubbleText', 'characterImg',
            'tapIndicator', 'progressBar', 'progressCurrent',
            'progressTotal', 'audioDialog', 'screenshotImg'
        ];
        
        for (let id of requiredIds) {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`❌ 要素が見つかりません: ${id}`);
                return false;
            } else {
                console.log(`✅ ${id} 要素確認完了`);
            }
        }
        return true;
    }
    
    // 画像プリロード
    preloadImages() {
        console.log('🖼️ 画像プリロード開始');
        
        // bg1-bg10の画像をプリロード
        for (let i = 1; i <= 10; i++) {
            const img = new Image();
            img.src = `image/bg${i}.jpg`;
            img.onload = () => console.log(`✅ bg${i}.jpg 読み込み完了`);
            img.onerror = () => {
                // .jpgで失敗した場合、.pngを試す
                const imgPng = new Image();
                imgPng.src = `image/bg${i}.png`;
                imgPng.onload = () => console.log(`✅ bg${i}.png 読み込み完了`);
                imgPng.onerror = () => console.warn(`⚠️ bg${i} 画像読み込み失敗（jpg/png両方）`);
            };
        }
        
        // キャラクター画像もプリロード
        Object.values(this.characters).forEach(character => {
            const img = new Image();
            img.src = character.image;
            img.onload = () => console.log(`✅ ${character.name} 画像読み込み完了`);
            img.onerror = () => console.warn(`⚠️ ${character.name} 画像読み込み失敗`);
        });
    }
    
    setupEventListeners() {
        // 広いタッチエリアでイベント受取
        const wideTouchArea = document.getElementById('wideTouchArea');
        
        if (wideTouchArea) {
            wideTouchArea.addEventListener('touchend', (e) => this.handleTouch(e));
            wideTouchArea.addEventListener('click', (e) => this.handleTouch(e));
            console.log('✅ 広いタッチエリア設定完了');
        }
        
        // ボタン
        const skipBtn = document.getElementById('skipBtn');
        const backBtn = document.getElementById('backBtn');
        const audioOnBtn = document.getElementById('audioOnBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        
        if (skipBtn) skipBtn.addEventListener('click', () => this.nextScene());
        if (backBtn) backBtn.addEventListener('click', () => this.previousScene());
        if (audioOnBtn) audioOnBtn.addEventListener('click', () => this.enableAudio());
        if (audioOffBtn) audioOffBtn.addEventListener('click', () => this.disableAudio());
        
        console.log('✅ イベントリスナー設定完了（広いタッチエリア対応）');
    }
    
    // タッチ処理（エリア拡大対応）
    handleTouch(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const now = Date.now();
        if (now - this.lastTouchTime < this.touchCooldown) {
            console.log('⏱️ クールダウン中');
            return;
        }
        
        this.lastTouchTime = now;
        
        if (this.isTyping) {
            console.log('⚡ タイピング中 → スキップして完了表示');
            this.completeTyping();
            return;
        }
        
        console.log('👆 タッチ検出 → 次のテキストへ');
        this.nextText();
    }
    
    // タイピング完了処理
    completeTyping() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        const bubbleText = document.getElementById('bubbleText');
        const tapIndicator = document.getElementById('tapIndicator');
        const currentScenario = this.scenarios[this.currentScene];
        
        if (bubbleText && currentScenario.texts[this.currentTextIndex]) {
            bubbleText.textContent = currentScenario.texts[this.currentTextIndex];
        }
        
        this.isTyping = false;
        if (tapIndicator) {
            tapIndicator.style.opacity = '1';
        }
        
        console.log('⚡ タイピングスキップ完了');
    }
    
    nextText() {
        const currentScenario = this.scenarios[this.currentScene];
        
        if (this.currentTextIndex >= currentScenario.texts.length - 1) {
            console.log('📄 シーン終了 → 次のシーンへ');
            this.nextScene();
        } else {
            this.currentTextIndex++;
            this.displayText(currentScenario.texts[this.currentTextIndex]);
        }
    }
    
    // タイプライター効果（修正版）
    displayText(text) {
        const bubbleText = document.getElementById('bubbleText');
        const tapIndicator = document.getElementById('tapIndicator');
        
        if (!bubbleText || !tapIndicator) {
            console.error('❌ 必要な要素が見つかりません（bubbleText or tapIndicator）');
            return;
        }
        
        // 既存のタイプライター処理をクリア
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        this.isTyping = true;
        tapIndicator.style.opacity = '0';
        
        // テキストエリアを初期化
        bubbleText.textContent = '';
        
        let charIndex = 0;
        const typingSpeed = 60;
        
        console.log(`💬 タイプライター開始: "${text.substring(0, 20)}..."`);
        
        this.typewriterInterval = setInterval(() => {
            if (charIndex < text.length) {
                bubbleText.textContent += text[charIndex];
                charIndex++;
            } else {
                // タイピング完了
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.isTyping = false;
                tapIndicator.style.opacity = '1';
                
                console.log('✅ タイプライター完了');
            }
        }, typingSpeed);
    }
    
    nextScene() {
        if (this.currentScene < this.scenarios.length - 1) {
            this.currentScene++;
            this.currentTextIndex = 0;
            this.loadScene();
        } else {
            this.endStory();
        }
    }
    
    previousScene() {
        if (this.currentScene > 0) {
            this.currentScene--;
            this.currentTextIndex = 0;
            this.loadScene();
        }
    }
    
    loadScene() {
        const scenario = this.scenarios[this.currentScene];
        
        console.log(`📖 シーン ${this.currentScene + 1} 読み込み開始`);
        
        // 既存のタイピングを停止
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
            this.isTyping = false;
        }
        
        // スクリーンショット変更
        this.changeScreenshot(scenario.screenshot);
        
        // キャラクター変更
        this.changeCharacter(scenario.character);
        
        // 音声再生
        this.playVoice();
        
        // UI更新
        this.updateProgress();
        this.updateButtonStates();
        
        // 少し遅延してテキスト表示（画像切り替え完了後）
        setTimeout(() => {
            this.displayText(scenario.texts[0]);
        }, 300);
        
        console.log(`✅ シーン ${this.currentScene + 1} 読み込み完了`);
    }
    
    // スクリーンショット変更（拡張子対応版）
    changeScreenshot(bgName) {
        const screenshotImg = document.getElementById('screenshotImg');
        
        if (!screenshotImg) {
            console.error('❌ screenshotImg要素が見つかりません');
            return;
        }
        
        console.log(`🖼️ スクリーンショット変更: ${bgName}`);
        
        // フェードアウト
        screenshotImg.classList.remove('show');
        screenshotImg.classList.add('fade-out');
        
        setTimeout(() => {
            // 複数の拡張子に対応
            const possibleExtensions = ['jpg', 'png', 'jpeg', 'webp'];
            this.tryLoadImage(bgName, possibleExtensions, 0, screenshotImg);
        }, 250);
    }
    
    // 画像読み込み試行メソッド
    tryLoadImage(bgName, extensions, index, screenshotImg) {
        if (index >= extensions.length) {
            console.error(`❌ ${bgName} の画像が見つかりません（全拡張子試行済み）`);
            // デフォルト画像を表示
            screenshotImg.src = 'image/bg1.jpg';
            screenshotImg.classList.remove('fade-out');
            screenshotImg.classList.add('show');
            return;
        }
        
        const testPath = `image/${bgName}.${extensions[index]}`;
        const testImg = new Image();
        
        testImg.onload = () => {
            console.log(`✅ 画像発見: ${testPath}`);
            screenshotImg.src = testPath;
            screenshotImg.onload = () => {
                screenshotImg.classList.remove('fade-out');
                screenshotImg.classList.add('show');
                console.log(`✅ スクリーンショット表示完了: ${testPath}`);
            };
            screenshotImg.onerror = () => {
                console.error(`❌ スクリーンショット表示エラー: ${testPath}`);
            };
        };
        
        testImg.onerror = () => {
            console.log(`⚠️ ${testPath} 読み込み失敗 → 次の拡張子を試行`);
            // 次の拡張子を試す
            this.tryLoadImage(bgName, extensions, index + 1, screenshotImg);
        };
        
        testImg.src = testPath;
    }
    
    changeCharacter(characterKey) {
        const character = this.characters[characterKey];
        const characterImg = document.getElementById('characterImg');
        
        if (!characterImg || !character) {
            console.error('❌ キャラクター要素または設定が見つかりません');
            return;
        }
        
        console.log(`👤 キャラクター変更: ${character.name}`);
        
        characterImg.style.opacity = '0';
        
        setTimeout(() => {
            characterImg.src = character.image;
            characterImg.alt = character.name;
            characterImg.style.opacity = '1';
            
            characterImg.onerror = () => {
                console.error(`❌ キャラクター画像読み込み失敗: ${character.image}`);
            };
            characterImg.onload = () => {
                console.log(`✅ キャラクター画像表示完了: ${character.image}`);
            };
        }, 200);
    }
    
    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressCurrent = document.getElementById('progressCurrent');
        const progressTotal = document.getElementById('progressTotal');
        
        if (progressBar && progressCurrent && progressTotal) {
            const progress = ((this.currentScene + 1) / this.scenarios.length) * 100;
            progressBar.style.width = `${progress}%`;
            
            progressCurrent.textContent = this.currentScene + 1;
            progressTotal.textContent = this.scenarios.length;
        }
    }
    
    updateButtonStates() {
        const backBtn = document.getElementById('backBtn');
        const skipBtn = document.getElementById('skipBtn');
        
        if (backBtn) backBtn.disabled = this.currentScene === 0;
        if (skipBtn) skipBtn.disabled = this.currentScene === this.scenarios.length - 1;
    }
    
    showAudioDialog() {
        const dialog = document.getElementById('audioDialog');
        if (dialog) {
            dialog.classList.add('show');
        }
    }
    
    enableAudio() {
        this.audioEnabled = true;
        this.hideAudioDialog();
        this.startStory();
        console.log('🔊 音声モードで開始');
    }
    
    disableAudio() {
        this.audioEnabled = false;
        this.hideAudioDialog();
        this.startStory();
        console.log('🔇 無音モードで開始');
    }
    
    hideAudioDialog() {
        const dialog = document.getElementById('audioDialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }
    
    playVoice() {
        if (!this.audioEnabled) return;
        
        const audio = document.getElementById('audioPlayer');
        const scenario = this.scenarios[this.currentScene];
        
        if (audio && scenario.audio) {
            audio.src = scenario.audio;
            audio.play().catch(e => {
                console.warn('🔇 音声再生失敗:', e);
            });
        }
    }
    
    startStory() {
        console.log('🚀 ストーリー開始！');
        this.loadScene();
    }
    
    endStory() {
        // タイピングを停止
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        const bubbleText = document.getElementById('bubbleText');
        if (bubbleText) {
            bubbleText.textContent = 'ガイドは以上です。\nありがとうございました！✨';
        }
        
        setTimeout(() => {
            if (confirm('購入ガイドが完了しました。\nメインページに戻りますか？')) {
                window.location.href = '../index.html';
            }
        }, 3000);
    }
    
    // 新しいシナリオを簡単に追加する方法
    addNewScenario(character, screenshot, texts, audio = null) {
        this.scenarios.push({
            character: character,   // 'ryoko' または 'zenta'
            screenshot: screenshot, // 'bg6', 'bg7' など
            texts: texts,          // テキストの配列
            audio: audio           // 音声ファイルパス（オプション）
        });
        console.log(`📝 新しいシナリオを追加: ${screenshot}`);
    }
    
    // クリーンアップ
    destroy() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        console.log('🧹 サウンドノベル クリーンアップ完了');
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM読み込み完了');
    
    setTimeout(() => {
        console.log('🎬 サウンドノベル開始準備');
        window.ryoCoinNovel = new RyoCoinSoundNovel();
    }, 500);
});

// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
    if (window.ryoCoinNovel) {
        window.ryoCoinNovel.destroy();
    }
});

// 開発者向け便利機能
window.NovelUtils = {
    // 新しいシナリオ追加
    addScenario: (character, bgNumber, texts, audio = null) => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.addNewScenario(character, `bg${bgNumber}`, texts, audio);
        }
    },
    
    // 特定シーンにジャンプ
    jumpTo: (sceneIndex) => {
        if (window.ryoCoinNovel && sceneIndex >= 0 && sceneIndex < window.ryoCoinNovel.scenarios.length) {
            window.ryoCoinNovel.currentScene = sceneIndex;
            window.ryoCoinNovel.currentTextIndex = 0;
            window.ryoCoinNovel.loadScene();
        }
    },
    
    // 画像テスト
    testImage: (bgNumber) => {
        const img = new Image();
        img.src = `image/bg${bgNumber}.jpg`;
        img.onload = () => console.log(`✅ bg${bgNumber}.jpg は存在します`);
        img.onerror = () => {
            const imgPng = new Image();
            imgPng.src = `image/bg${bgNumber}.png`;
            imgPng.onload = () => console.log(`✅ bg${bgNumber}.png は存在します`);
            imgPng.onerror = () => console.error(`❌ bg${bgNumber} が見つかりません（jpg/png両方）`);
        };
    },
    
    // レイヤー確認
    checkLayers: () => {
        const layers = [
            { name: 'starfield', element: document.getElementById('starfield') },
            { name: 'background-layer', element: document.querySelector('.background-layer') },
            { name: 'content-area', element: document.querySelector('.content-area') },
            { name: 'screenshot-img', element: document.getElementById('screenshotImg') },
            { name: 'message-area', element: document.querySelector('.message-area') }
        ];
        
        layers.forEach(layer => {
            if (layer.element) {
                const zIndex = window.getComputedStyle(layer.element).zIndex;
                console.log(`${layer.name}: z-index = ${zIndex}`);
            } else {
                console.warn(`❌ ${layer.name} 要素が見つかりません`);
            }
        });
    }
};

console.log(`
🎭 RYOコインサウンドノベル v3.0
📱 タッチエリア拡大対応
🖼️ 画像切り替えシステム搭載
✨ 小判エフェクト強化
🔧 レイヤー構造修正済み

💡 使用方法:
- imageフォルダにbg1.jpg ~ bg10.jpgを配置
- シナリオのscreenshot: 'bg1'で画像指定
- NovelUtils.testImage(1)で画像存在確認
- NovelUtils.checkLayers()でレイヤー確認
`);
