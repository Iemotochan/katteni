class RyoCoinSoundNovel {
    constructor() {
        this.currentScene = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.audioEnabled = false;
        this.bgmEnabled = true;
        this.bgmIsPlaying = false; // BGM再生状態追跡
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
        
        // シナリオデータ（フォルダ管理対応）
        this.scenarios = this.getScenarioData();
        
        this.init();
    }
    
    // =============================== 
    // シナリオデータ（フォルダ管理版）
    // =============================== 
getScenarioData() {
    return [
        {
            character: 'ryoko',
            screenshot: 'touroku/1.jpg', // 取引所トップページ
            texts: [
                'こんにちは！リョウコです✨\n今日はRYOコインの購入方法を完全ガイドします！',
                '仮想通貨初心者でも大丈夫💎\n一緒に順番に進めていきましょう！',
                '準備はいいですか？\nそれでは始めましょう！'
            ],
            audio: 'audio/oshiete.mp3'
        },
        {
            character: 'zenta',
            screenshot: 'touroku/1.jpg', // 新規登録画面
            texts: [
                'まずは取引所のアカウントを作成します。\n右上の「新規登録」をタップしてください。',
                'BitTradeなどの信頼できる取引所を選びましょう。\n登録は無料で簡単です！'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'touroku/3.jpg', // メール・パスワード入力画面
            texts: [
                'メールアドレスとパスワードを入力します。\nパスワードは8〜20文字で英数字を含む必要があります！',
                '紹介コードがある場合は入力して\n「次へ」をタップしましょう✨'
            ]
        },
        {
            character: 'zenta',
            screenshot: 'bg4', // メール認証画面
            texts: [
                '登録したメールアドレスに\n認証コードが送信されました📧',
                'メールをチェックして\n6桁の数字を入力してください。',
                '届かない場合は迷惑メールフォルダも\n確認してくださいね！'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'bg5', // ホーム画面（赤い！マーク）
            texts: [
                'ホーム画面に戻りました🏠\n上部に赤い「！」マークが表示されていますね。',
                'これは本人確認が必要という\nお知らせです。タップしてみましょう！'
            ]
        },
        {
            character: 'zenta',
            screenshot: 'bg6', // 本人確認ステータス画面
            texts: [
                '本人確認のステータス画面です。\n取引を始めるには本人確認が必須です。',
                '「簡単本人確認」を選択すると\nスマホで撮影するだけで完了します📱'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'bg7', // 簡単本人確認画面
            texts: [
                '簡単本人確認では運転免許証や\nマイナンバーカードが使えます。',
                'スマホのカメラで撮影して\nアップロードするだけ！簡単ですね✨'
            ]
        },
        {
            character: 'zenta',
            screenshot: 'bg8', // 個人情報入力画面
            texts: [
                '国籍や氏名などの基本情報を入力します。\n本人確認書類と同じ情報を正確に入力してください。',
                '入力が完了したら「次へ」をタップして\n審査を待ちましょう。通常1-3営業日で完了です。'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'bg9', // 入金画面
            texts: [
                '本人確認が完了したら入金しましょう💰\n「入金」ボタンをタップします。',
                '表示された専用口座に\n銀行振込で入金してください。'
            ]
        },
        {
            character: 'zenta',
            screenshot: 'bg10', // 入金詳細画面
            texts: [
                '振込先の口座情報が表示されます。\n必ずこの口座に入金してください！',
                '⚠️重要⚠️\nクイック入金やコンビニ入金は\n1週間の出金制限がかかるのでNGです。',
                '銀行振込なら制限なしで\nすぐに取引できます🏦'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'bg11', // 取引所画面
            texts: [
                '入金が完了したら仮想通貨を購入しましょう！\n手数料が安いXRPがオススメです💎',
                '画面下部の「取引所」をタップして\n取引画面に移動します。'
            ]
        },
        {
            character: 'zenta',
            screenshot: 'bg12', // 通貨検索画面
            texts: [
                '上部の「BTC/JPY」をタップすると\n通貨選択画面が開きます。',
                '検索窓に「XRP」と入力して\nXRP/JPYを選択しましょう🔍'
            ]
        },
        {
            character: 'ryoko',
            screenshot: 'bg13', // XRP購入画面
            texts: [
                'XRP購入画面です！\n「成行」注文で簡単に購入できます。',
                'ゲージを動かして購入枚数を決めて\n「XRPを買う」ボタンをタップ！',
                '🎉おめでとうございます！\nこれでRYOコインの準備が完了です✨',
                'RYOコインで未来の金融革命に\n参加しましょう！💫'
            ]
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
        
        this.setupAudioElements();
        this.setupEventListeners();
        this.showAudioDialog();
        this.preloadImages();
        
        console.log('✅ サウンドノベル初期化完了');
    }
    
    // 音声要素の設定（ループ機能強化）
    setupAudioElements() {
        this.voicePlayer = document.getElementById('voicePlayer');
        this.bgmPlayer = document.getElementById('bgmPlayer');
        
        if (this.voicePlayer) {
            console.log('✅ 音声プレイヤー設定完了');
        }
        
        if (this.bgmPlayer) {
            // BGMの基本設定
            this.bgmPlayer.volume = 0.3;
            this.bgmPlayer.loop = true; // HTML属性と併用
            
            // BGMループのイベントリスナー設定（確実にループさせる）
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
            
            // BGM再生開始イベント
            this.bgmPlayer.addEventListener('play', () => {
                this.bgmIsPlaying = true;
                console.log('🎵 BGM再生開始');
            });
            
            // BGM停止イベント
            this.bgmPlayer.addEventListener('pause', () => {
                this.bgmIsPlaying = false;
                console.log('⏸️ BGM停止');
            });
            
            // BGMエラーハンドリング
            this.bgmPlayer.addEventListener('error', (e) => {
                console.error('❌ BGMエラー:', e);
                setTimeout(() => this.retryBGM(), 2000);
            });
            
            // BGM読み込み完了
            this.bgmPlayer.addEventListener('canplaythrough', () => {
                console.log('✅ BGM読み込み完了');
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
    
    // 画像プリロード（フォルダ管理対応）
    preloadImages() {
        console.log('🖼️ 画像プリロード開始（フォルダ管理対応）');
        
        // シナリオで使用される画像をプリロード
        this.scenarios.forEach((scenario, index) => {
            const img = new Image();
            img.src = scenario.screenshot;
            img.onload = () => console.log(`✅ シーン${index + 1} 画像読み込み完了: ${scenario.screenshot}`);
            img.onerror = () => console.warn(`⚠️ シーン${index + 1} 画像読み込み失敗: ${scenario.screenshot}`);
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
        initialImg.src = 'touroku/1.jpg';
        initialImg.onload = () => console.log('✅ 初期画像確認完了: touroku/1.jpg');
        initialImg.onerror = () => console.warn('⚠️ 初期画像が見つかりません: touroku/1.jpg');
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
        
        console.log('✅ イベントリスナー設定完了（フォルダ管理対応）');
    }
    
    // ミュート切り替え（ループ対応強化）
    toggleMute() {
        this.bgmEnabled = !this.bgmEnabled;
        const muteIcon = document.getElementById('muteIcon');
        const muteBtn = document.getElementById('muteBtn');
        
        if (this.bgmEnabled) {
            // ミュート解除
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
            // ミュート
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
            // 確実にループ設定
            this.bgmPlayer.loop = true;
            this.bgmPlayer.muted = false;
            
            this.bgmPlayer.play().catch(e => {
                console.warn('🔇 BGM自動再生失敗（ユーザー操作が必要）:', e);
                // ユーザー操作待ちの場合、最初のタッチで再生を試行
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
    
    // タッチ処理（BGM開始試行追加）
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
    
    // タイプライター効果
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
        console.log(`🖼️ 読み込み予定画像: ${scenario.screenshot}`);
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
            this.isTyping = false;
        }
        
        // スクリーンショット変更（フォルダパス対応）
        this.changeScreenshot(scenario.screenshot);
        
        // キャラクター変更
        this.changeCharacter(scenario.character);
        
        // 音声再生（BGMは継続）
        this.playVoice();
        
        // UI更新
        this.updateProgress();
        this.updateButtonStates();
        
        setTimeout(() => {
            this.displayText(scenario.texts[0]);
        }, 300);
        
        console.log(`✅ シーン ${this.currentScene + 1} 読み込み完了`);
    }
    
    // スクリーンショット変更（フォルダパス対応版）
    changeScreenshot(imagePath) {
        const screenshotImg = document.getElementById('screenshotImg');
        
        if (!screenshotImg) {
            console.error('❌ screenshotImg要素が見つかりません');
            return;
        }
        
        console.log(`🖼️ スクリーンショット変更開始: ${imagePath}`);
        
        // フェードアウト
        screenshotImg.classList.remove('show');
        screenshotImg.classList.add('fade-out');
        
        setTimeout(() => {
            // 直接パス指定で画像読み込み
            this.loadDirectImage(imagePath, screenshotImg);
        }, 250);
    }
    
    // 直接パス画像読み込み（エラーハンドリング強化）
    loadDirectImage(imagePath, screenshotImg) {
        console.log(`🔍 画像読み込み試行: ${imagePath}`);
        
        const testImg = new Image();
        
        testImg.onload = () => {
            console.log(`✅ 画像読み込み成功: ${imagePath}`);
            screenshotImg.src = imagePath;
            screenshotImg.onload = () => {
                screenshotImg.classList.remove('fade-out');
                screenshotImg.classList.add('show');
                console.log(`✅ スクリーンショット表示完了: ${imagePath}`);
            };
            screenshotImg.onerror = () => {
                console.error(`❌ スクリーンショット表示エラー: ${imagePath}`);
            };
        };
        
        testImg.onerror = () => {
            console.error(`❌ 画像読み込み失敗: ${imagePath}`);
            console.log('📁 利用可能な画像を確認してください：');
            console.log('- touroku/1.jpg');
            console.log('- touroku/2.jpg');
            console.log('- nyuukin/1.jpg');
            
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
        this.startBGM(); // BGMループ開始
        console.log('🔊 音声モードで開始（BGMループ有効）');
    }
    
    disableAudio() {
        this.audioEnabled = false;
        this.hideAudioDialog();
        this.startStory();
        this.startBGM(); // BGMは音声OFFでもループ再生
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
        console.log('🚀 ストーリー開始！');
        this.loadScene();
    }
    
    endStory() {
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
                // BGM停止
                if (this.bgmPlayer) {
                    this.bgmPlayer.pause();
                }
                window.location.href = '../index.html';
            }
        }, 3000);
    }
    
    // 新しいシナリオを簡単に追加する方法（フォルダ管理対応）
    addNewScenario(character, screenshot, texts, audio = null) {
        this.scenarios.push({
            character: character,   // 'ryoko' または 'zenta'
            screenshot: screenshot, // 'touroku/5.jpg' や 'nyuukin/2.jpg' など
            texts: texts,          // テキストの配列
            audio: audio           // 音声ファイルパス（オプション）
        });
        console.log(`📝 新しいシナリオを追加: ${screenshot}`);
    }
    
    // クリーンアップ（BGMループ停止）
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
        
        console.log('🧹 サウンドノベル クリーンアップ完了（BGMループ停止）');
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

// 開発者向け便利機能（フォルダ管理対応）
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
    
    // BGM手動再開
    restartBGM: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.startBGM();
        }
    },
    
    // 新しいシナリオ追加（フォルダ管理対応）
    addScenario: (character, imagePath, texts, audio = null) => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.addNewScenario(character, imagePath, texts, audio);
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
    
    // 画像テスト（フォルダ管理対応）
    testImage: (imagePath) => {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => console.log(`✅ ${imagePath} は存在します`);
        img.onerror = () => console.error(`❌ ${imagePath} が見つかりません`);
    },
    
    // フォルダ内画像一覧テスト
    testFolder: (folderName) => {
        console.log(`📁 ${folderName}フォルダの画像をテスト中...`);
        for (let i = 1; i <= 10; i++) {
            NovelUtils.testImage(`${folderName}/${i}.jpg`);
        }
    }
};

console.log(`
🎭 RYOコインサウンドノベル v7.0
📁 フォルダ管理完全対応！
🔄 BGM自動ループ機能強化！
✨ 小判エフェクト強化
🔊 BGM機能追加
🔇 ミュートボタン追加

💡 BGMループ機能:
- HTML loop属性 + JavaScript両方でループ保証
- 自動再開機能付き
- ユーザー操作でBGM開始
- NovelUtils.checkBGM() でBGM状態確認
- NovelUtils.restartBGM() で手動再開

📁 音声ファイル:
audio/bgm.mp3 - メインBGM（ループ再生）
audio/bgm.ogg - 対応ブラウザ用
audio/bgm.wav - 対応ブラウザ用
`);
