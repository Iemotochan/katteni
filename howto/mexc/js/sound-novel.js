class RyoCoinSoundNovel {
    constructor() {
        this.currentScene = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.audioEnabled = false;
        this.bgmEnabled = true;
        this.bgmIsPlaying = false;
        this.lastTouchTime = 0;
        this.touchCooldown = 400;
        this.typewriterInterval = null;
        
        // 音声要素の参照
        this.voicePlayer = null;
        this.bgmPlayer = null;
        
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
        
        // シナリオデータ（MEXC版）
        this.scenarios = this.getScenarioData();
        
        this.init();
    }
    
    // =============================== 
    // シナリオデータ（MEXC版）
    // =============================== 
    getScenarioData() {
        return [
            {
                character: 'ryoko',
                screenshot: 'image/1.jpg',
                texts: [
                    'こんにちは！リョウコです✨\n今日はMEXCでの新規登録方法を説明します！',
                    'まずは下のリンクをタップして\nMEXCの公式サイトにアクセスしてね📱',
                    'リンク: https://www.mexc.com/ja-JP/',
                    '右上の三本線メニューバーから\n「新規登録」を選ぶか...',
                    '面倒な人はGoogleアカウントで\nサクッと登録しちゃおう！'
                ],
                audio: 'audio/ryoko_mexc1.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/2.jpg',
                texts: [
                    'ゼンタです！今回は\nメニューバーから新規登録で進めます。',
                    'Googleアカウントも便利ですが\n今回は手動登録で詳しく説明しますね。',
                    '三本線メニューをタップして\n「新規登録」を選択してください！'
                ],
                audio: 'audio/zenta_mexc2.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/3.jpg',
                texts: [
                    '登録フォームが表示されました！\n電話番号とパスワードを設定します📝',
                    'パスワードはセキュリティ重要！\n大文字・小文字・数字を混ぜてね🔒',
                    '例：MyPassword123\nこんな感じで強力にしよう💪'
                ],
                audio: 'audio/ryoko_mexc3.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/4.jpg',
                texts: [
                    '登録完了です！お疲れ様でした🎉',
                    '次は右下の「資産」をタップします。',
                    'ここから日本の取引所で購入した\nXRPをMEXCに送金する準備をしますよ！'
                ],
                audio: 'audio/zenta_mexc4.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/5.jpg',
                texts: [
                    '資産画面が開きました！💰',
                    '「入金」をタップしてください。',
                    'ここで日本の取引所（bitFlyerやCoincheckなど）で\n購入したXRPをMEXCに送ります🚀'
                ],
                audio: 'audio/ryoko_mexc5.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/6.jpg',
                texts: [
                    '入金方法が表示されました！',
                    '「オンチェーン入金」をタップしてください。',
                    'これで暗号資産のネットワーク経由で\n他の取引所からXRPを受け取れます⚡'
                ],
                audio: 'audio/zenta_mexc6.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/7.jpg',
                texts: [
                    '通貨選択画面です！🔍',
                    'XRPを探してタップしてね。',
                    'たくさんある場合は上の検索ボックスで\n「XRP」と入力すると簡単に見つかるよ✨'
                ],
                audio: 'audio/ryoko_mexc7.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/8.jpg',
                texts: [
                    'XRPが選択されていることを確認！✅',
                    '「アドレスとメモを表示」をタップしてください。',
                    'ここが重要なポイントです！\nMEXCの入金アドレスを取得します🎯'
                ],
                audio: 'audio/zenta_mexc8.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/9.jpg',
                texts: [
                    'やった！アドレスとメモが表示されました🎉',
                    'この画面で2つの情報が確認できます：\n・アドレス（英数字の長い文字列）\n・メモ（数字）',
                    'これはMEXC内のあなた専用の\nアドレスとメモ番号です📍',
                    '両方とも必要になるから\nしっかりコピーしておいてね！💎'
                ],
                audio: 'audio/ryoko_mexc9.mp3'
            }
        ];
    }
    
    // =============================== 
    // 初期化
    // =============================== 
    init() {
        console.log('🎭 MEXCサウンドノベル初期化開始');
        
        if (!this.checkRequiredElements()) {
            console.error('❌ 必要なHTML要素が見つかりません');
            return;
        }
        
        this.setupAudioElements();
        this.setupEventListeners();
        this.showAudioDialog();
        this.preloadImages();
        
        console.log('✅ MEXCサウンドノベル初期化完了');
    }
    
    // 音声要素の設定（ループ機能強化）
    setupAudioElements() {
        this.voicePlayer = document.getElementById('voicePlayer');
        this.bgmPlayer = document.getElementById('bgmPlayer');
        
        if (this.voicePlayer) {
            console.log('✅ 音声プレイヤー設定完了');
        }
        
        if (this.bgmPlayer) {
            this.bgmPlayer.volume = 0.3;
            this.bgmPlayer.loop = true;
            
            // BGMループのイベントリスナー設定
            this.bgmPlayer.addEventListener('ended', () => {
                console.log('🔄 BGM終了 → 自動再開');
                if (this.bgmEnabled) {
                    this.bgmPlayer.currentTime = 0;
                    this.bgmPlayer.play().catch(e => {
                        console.warn('🔇 BGM再ループ失敗:', e);
                        setTimeout(() => this.retryBGM(), 1000);
                    });
                }
            });
            
            this.bgmPlayer.addEventListener('play', () => {
                this.bgmIsPlaying = true;
                console.log('🎵 BGM再生開始');
            });
            
            this.bgmPlayer.addEventListener('pause', () => {
                this.bgmIsPlaying = false;
                console.log('⏸️ BGM停止');
            });
            
            this.bgmPlayer.addEventListener('error', (e) => {
                console.error('❌ BGMエラー:', e);
                setTimeout(() => this.retryBGM(), 2000);
            });
            
            console.log('✅ BGMプレイヤー設定完了（ループ強化）');
        }
    }
    
    // BGM再試行
    retryBGM() {
        if (this.bgmEnabled && this.bgmPlayer && !this.bgmIsPlaying) {
            console.log('🔄 BGM再試行');
            this.bgmPlayer.play().catch(e => {
                console.warn('🔇 BGM再試行失敗:', e);
            });
        }
    }
    
    // 必要な要素チェック
    checkRequiredElements() {
        const requiredIds = [
            'wideTouchArea', 'bubbleText', 'characterImg',
            'tapIndicator', 'progressBar', 'progressCurrent',
            'progressTotal', 'audioDialog', 'screenshotImg',
            'muteBtn', 'muteIcon'
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
    
    // 画像プリロード（MEXC版）
    preloadImages() {
        console.log('🖼️ MEXC画像プリロード開始');
        
        // MEXCシナリオで使用される画像をプリロード
        this.scenarios.forEach((scenario, index) => {
            const img = new Image();
            img.src = scenario.screenshot;
            img.onload = () => console.log(`✅ MEXCシーン${index + 1} 画像読み込み完了: ${scenario.screenshot}`);
            img.onerror = () => console.warn(`⚠️ MEXCシーン${index + 1} 画像読み込み失敗: ${scenario.screenshot}`);
        });
        
        // キャラクター画像もプリロード
        Object.values(this.characters).forEach(character => {
            const img = new Image();
            img.src = character.image;
            img.onload = () => console.log(`✅ ${character.name} 画像読み込み完了`);
            img.onerror = () => console.warn(`⚠️ ${character.name} 画像読み込み失敗`);
        });
        
        // 初期画像の確認
        const initialImg = new Image();
        initialImg.src = 'image/1.jpg';
        initialImg.onload = () => console.log('✅ MEXC初期画像確認完了: image/1.jpg');
        initialImg.onerror = () => console.warn('⚠️ MEXC初期画像が見つかりません: image/1.jpg');
    }
    
    setupEventListeners() {
        // 広いタッチエリアでイベント受取
        const wideTouchArea = document.getElementById('wideTouchArea');
        
        if (wideTouchArea) {
            wideTouchArea.addEventListener('touchend', (e) => this.handleTouch(e));
            wideTouchArea.addEventListener('click', (e) => this.handleTouch(e));
            console.log('✅ 広いタッチエリア設定完了');
        }
        
        // ナビゲーションボタン
        const skipBtn = document.getElementById('skipBtn');
        const backBtn = document.getElementById('backBtn');
        const audioOnBtn = document.getElementById('audioOnBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const muteBtn = document.getElementById('muteBtn');
        
        if (skipBtn) skipBtn.addEventListener('click', () => this.nextScene());
        if (backBtn) backBtn.addEventListener('click', () => this.previousScene());
        if (audioOnBtn) audioOnBtn.addEventListener('click', () => this.enableAudio());
        if (audioOffBtn) audioOffBtn.addEventListener('click', () => this.disableAudio());
        if (muteBtn) muteBtn.addEventListener('click', () => this.toggleMute());
        
        console.log('✅ イベントリスナー設定完了（MEXC対応）');
    }
    
    // ミュート切り替え
    toggleMute() {
        this.bgmEnabled = !this.bgmEnabled;
        const muteIcon = document.getElementById('muteIcon');
        const muteBtn = document.getElementById('muteBtn');
        
        if (this.bgmEnabled) {
            if (this.bgmPlayer) {
                this.bgmPlayer.muted = false;
                this.bgmPlayer.play().catch(e => {
                    console.warn('🔇 BGM再生失敗:', e);
                });
            }
            muteIcon.textContent = '🔊';
            muteBtn.classList.remove('muted');
            console.log('🔊 BGM有効化（ループ継続）');
        } else {
            if (this.bgmPlayer) {
                this.bgmPlayer.pause();
            }
            muteIcon.textContent = '🔇';
            muteBtn.classList.add('muted');
            console.log('🔇 BGMミュート');
        }
    }
    
    // BGM開始（ループ保証）
    startBGM() {
        if (this.bgmEnabled && this.bgmPlayer) {
            this.bgmPlayer.loop = true;
            this.bgmPlayer.muted = false;
            
            this.bgmPlayer.play().catch(e => {
                console.warn('🔇 BGM自動再生失敗（ユーザー操作が必要）:', e);
                this.bgmPendingPlay = true;
            });
            console.log('🎵 BGMループ開始');
        }
    }
    
    // ユーザー操作でBGM開始を試行
    tryStartBGMOnUserAction() {
        if (this.bgmPendingPlay && this.bgmEnabled && this.bgmPlayer) {
            this.bgmPlayer.play().then(() => {
                this.bgmPendingPlay = false;
                console.log('🎵 ユーザー操作によりBGM開始成功');
            }).catch(e => {
                console.warn('🔇 ユーザー操作でもBGM開始失敗:', e);
            });
        }
    }
    
    // タッチ処理（リンク検出機能付き）
    handleTouch(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ユーザー操作でBGM開始を試行
        this.tryStartBGMOnUserAction();
        
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
            const text = currentScenario.texts[this.currentTextIndex];
            bubbleText.innerHTML = this.processTextWithLinks(text);
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
    
    // リンク処理機能付きテキスト変換
    processTextWithLinks(text) {
        // URLを検出してリンクに変換
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #FFD700; text-decoration: underline; font-weight: bold;">🔗 ${url}</a>`;
        });
    }
    
    // タイプライター効果（リンク対応版）
    displayText(text) {
        const bubbleText = document.getElementById('bubbleText');
        const tapIndicator = document.getElementById('tapIndicator');
        
        if (!bubbleText || !tapIndicator) {
            console.error('❌ 必要な要素が見つかりません（bubbleText or tapIndicator）');
            return;
        }
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        this.isTyping = true;
        tapIndicator.style.opacity = '0';
        
        // リンクを含む場合は即座に表示、そうでなければタイプライター効果
        if (text.includes('http')) {
            bubbleText.innerHTML = this.processTextWithLinks(text);
            this.isTyping = false;
            tapIndicator.style.opacity = '1';
            console.log(`🔗 リンク付きテキスト表示: ${text.substring(0, 20)}...`);
        } else {
            // 通常のタイプライター効果
            bubbleText.textContent = '';
            
            let charIndex = 0;
            const typingSpeed = 60;
            
            console.log(`💬 タイプライター開始: "${text.substring(0, 20)}..."`);
            
            this.typewriterInterval = setInterval(() => {
                if (charIndex < text.length) {
                    bubbleText.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(this.typewriterInterval);
                    this.typewriterInterval = null;
                    this.isTyping = false;
                    tapIndicator.style.opacity = '1';
                    
                    console.log('✅ タイプライター完了');
                }
            }, typingSpeed);
        }
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
        
        console.log(`📖 MEXCシーン ${this.currentScene + 1} 読み込み開始`);
        console.log(`🖼️ 読み込み予定画像: ${scenario.screenshot}`);
        
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
        
        setTimeout(() => {
            this.displayText(scenario.texts[0]);
        }, 300);
        
        console.log(`✅ MEXCシーン ${this.currentScene + 1} 読み込み完了`);
    }
    
    // スクリーンショット変更
    changeScreenshot(imagePath) {
        const screenshotImg = document.getElementById('screenshotImg');
        
        if (!screenshotImg) {
            console.error('❌ screenshotImg要素が見つかりません');
            return;
        }
        
        console.log(`🖼️ MEXCスクリーンショット変更開始: ${imagePath}`);
        
        // フェードアウト
        screenshotImg.classList.remove('show');
        screenshotImg.classList.add('fade-out');
        
        setTimeout(() => {
            this.loadDirectImage(imagePath, screenshotImg);
        }, 250);
    }
    
    // 直接パス画像読み込み
    loadDirectImage(imagePath, screenshotImg) {
        console.log(`🔍 MEXC画像読み込み試行: ${imagePath}`);
        
        const testImg = new Image();
        
        testImg.onload = () => {
            console.log(`✅ MEXC画像読み込み成功: ${imagePath}`);
            screenshotImg.src = imagePath;
            screenshotImg.onload = () => {
                screenshotImg.classList.remove('fade-out');
                screenshotImg.classList.add('show');
                console.log(`✅ MEXCスクリーンショット表示完了: ${imagePath}`);
            };
            screenshotImg.onerror = () => {
                console.error(`❌ MEXCスクリーンショット表示エラー: ${imagePath}`);
            };
        };
        
        testImg.onerror = () => {
            console.error(`❌ MEXC画像読み込み失敗: ${imagePath}`);
            console.log('📁 利用可能なMEXC画像を確認してください：');
            console.log('- image/1.jpg ~ image/9.jpg');
            
            // フォールバック: とりあえず表示を戻す
            screenshotImg.classList.remove('fade-out');
            screenshotImg.classList.add('show');
        };
        
        testImg.src = imagePath;
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
        this.startBGM();
        console.log('🔊 音声モードで開始（BGMループ有効）');
    }
    
    disableAudio() {
        this.audioEnabled = false;
        this.hideAudioDialog();
        this.startStory();
        this.startBGM();
        console.log('🔇 無音モードで開始（BGMはループ再生）');
    }
    
    hideAudioDialog() {
        const dialog = document.getElementById('audioDialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }
    
    playVoice() {
        if (!this.audioEnabled) return;
        
        const scenario = this.scenarios[this.currentScene];
        
        if (this.voicePlayer && scenario.audio) {
            this.voicePlayer.pause();
            this.voicePlayer.currentTime = 0;
            
            this.voicePlayer.src = scenario.audio;
            this.voicePlayer.play().catch(e => {
                console.warn('🔇 音声再生失敗:', e);
            });
        }
    }
    
    startStory() {
        console.log('🚀 MEXCストーリー開始！');
        this.loadScene();
    }
    
    endStory() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        const bubbleText = document.getElementById('bubbleText');
        if (bubbleText) {
            bubbleText.innerHTML = 'MEXCでのXRPアドレス取得完了！<br>お疲れ様でした！✨<br><br>次はビットトレードからの送金ですね🚀';
        }
        
        setTimeout(() => {
            if (confirm('MEXCでのXRPアドレス取得が完了しました。\nメインページに戻りますか？')) {
                if (this.bgmPlayer) {
                    this.bgmPlayer.pause();
                }
                window.location.href = '../index.html';
            }
        }, 3000);
    }
    
    // クリーンアップ
    destroy() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        if (this.voicePlayer) {
            this.voicePlayer.pause();
        }
        
        if (this.bgmPlayer) {
            this.bgmPlayer.pause();
            this.bgmPlayer.currentTime = 0;
        }
        
        console.log('🧹 MEXCサウンドノベル クリーンアップ完了');
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM読み込み完了');
    
    setTimeout(() => {
        console.log('🎬 MEXCサウンドノベル開始準備');
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
    // ミュート切り替え
    toggleMute: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.toggleMute();
        }
    },
    
    // BGM状態確認
    checkBGM: () => {
        if (window.ryoCoinNovel && window.ryoCoinNovel.bgmPlayer) {
            const bgm = window.ryoCoinNovel.bgmPlayer;
            console.log('🎵 BGM状態:', {
                playing: !bgm.paused,
                looping: bgm.loop,
                volume: bgm.volume,
                currentTime: bgm.currentTime,
                duration: bgm.duration
            });
        }
    },
    
    // MEXC画像テスト
    testMEXCImages: () => {
        console.log('📁 MEXC画像をテスト中...');
        for (let i = 1; i <= 9; i++) {
            NovelUtils.testImage(`image/${i}.jpg`);
        }
    },
    
    // 画像テスト
    testImage: (imagePath) => {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => console.log(`✅ ${imagePath} は存在します`);
        img.onerror = () => console.error(`❌ ${imagePath} が見つかりません`);
    }
};

console.log(`
🎭 RYOコインサウンドノベル - MEXC版 v1.0
📱 MEXC新規登録完全ガイド
🔗 リンククリック機能搭載！
🔄 BGM自動ループ機能
✨ 小判エフェクト強化

💡 MEXC専用機能:
- image/1.jpg ~ image/9.jpg 対応
- https://www.mexc.com/ja-JP/ リンククリック可能
- XRPアドレス取得まで完全ガイド
- NovelUtils.testMEXCImages() で画像一括テスト

📁 必要なフォルダ構造:
image/1.jpg - MEXC公式サイト
image/2.jpg - 新規登録メニュー
image/3.jpg - 登録フォーム
image/4.jpg - 資産メニュー
image/5.jpg - 入金画面
image/6.jpg - オンチェーン入金
image/7.jpg - XRP選択
image/8.jpg - アドレス表示ボタン
image/9.jpg - アドレス・メモ確認
`);
