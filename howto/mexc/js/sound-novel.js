class RyoCoinSoundNovel {
    constructor() {
        this.currentScene = 0;
        this.currentTextIndex = 0;
        this.isTyping = false;
        this.audioEnabled = false;
        this.bgmEnabled = true;
        this.bgmIsPlaying = false;
        this.voiceIsPlaying = false;
        this.lastTouchTime = 0;
        this.touchCooldown = 400;
        this.typewriterInterval = null;
        
        // 音声要素の参照
        this.voicePlayer = null;
        this.bgmPlayer = null;
        this.kobanSoundPlayer = null;
        this.voiceInitialized = false;
        this.bgmInitialized = false;
        this.userHasInteracted = false;
        this.bgmRetryCount = 0;
        
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
                screenshot: 'image/guide.jpg',
                texts: [
                    'こんにちは！リョウコです✨\n今日はMEXCでの新規登録方法を説明します！',
                    '作業はちょっぴり多いけど、順番に行けば簡単だから説明していくね！',
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/1.jpg',
                texts: [
                    'まずは下のリンクをタップして\nMEXCの公式サイトにアクセスしてね📱',
                    'リンク: https://www.mexc.com/ja-JP/',
                    '右上の三本線メニューバーから\n「新規登録」を選ぶか...',
                    '面倒な人はGoogleアカウントで\nサクッと登録しちゃおう！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/2.jpg',
                texts: [
                    'ゼンタです！今回は\nメニューバーから新規登録で進めます。',
                    'Googleアカウントも便利ですが\n今回は手動登録で詳しく説明しますね。',
                    '三本線メニューをタップして\n「新規登録」を選択してください！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/3.jpg',
                texts: [
                    '登録フォームが表示されました！\n電話番号とパスワードを設定します📝',
                    'パスワードはセキュリティ重要！\n大文字・小文字・数字を混ぜてね🔒',
                    '例：MyPassword123\nこんな感じで強力にしよう💪'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/4.jpg',
                texts: [
                    '登録完了です！お疲れ様でした🎉',
                    '次は右下の「資産」をタップします。',
                    'ここから日本の取引所で購入した\nXRPをMEXCに送金する準備をしますよ！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/5.jpg',
                texts: [
                    '資産画面が開きました！💰',
                    '「入金」をタップしてください。',
                    'ここで日本の取引所（bittradeやCoincheckなど）で\n購入したXRPをMEXCに送ります🚀'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/6.jpg',
                texts: [
                    '入金方法が表示されました！',
                    '「オンチェーン入金」をタップしてください。',
                    'これで暗号資産のネットワーク経由で\n他の取引所からXRPを受け取れます⚡'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/7.jpg',
                texts: [
                    '通貨選択画面です！🔍',
                    'XRPを探してタップしてね。',
                    'たくさんある場合は上の検索ボックスで\n「XRP」と入力すると簡単に見つかるよ✨'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'image/8.jpg',
                texts: [
                    'XRPが選択されていることを確認！✅',
                    '「アドレスとメモを表示」をタップしてください。',
                    'ここが重要なポイントです！\nあなた専用のMEXCの入金アドレスを取得します🎯'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'image/9.jpg',
                texts: [
                    'やった！アドレスとメモが表示されました🎉',
                    'この画面で2つの情報が確認できます：\n・アドレス（英数字の長い文字列）\n・メモ（数字）',
                    'これはMEXC内のあなた専用の\nアドレスとメモ番号です📍',
                    '両方とも必要になるから\nしっかりコピーしてお苦か、このページに戻ってこれるようにね！💎'
                ],
                audio: 'audio/oshiete.mp3'
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
    
    // 音声要素の設定
    setupAudioElements() {
        this.voicePlayer = document.getElementById('voicePlayer');
        this.bgmPlayer = document.getElementById('bgmPlayer');
        
        // 小判効果音プレイヤーを動的に作成
        this.kobanSoundPlayer = new Audio();
        this.kobanSoundPlayer.src = 'audio/koban.mp3';
        this.kobanSoundPlayer.volume = 0.3;
        this.kobanSoundPlayer.preload = 'auto';
        
        this.kobanSoundPlayer.addEventListener('loadeddata', () => {
            console.log('✅ 小判効果音読み込み完了: audio/koban.mp3（音量: 0.3）');
        });
        
        this.kobanSoundPlayer.addEventListener('error', () => {
            console.warn('⚠️ 小判効果音が見つかりません: audio/koban.mp3（後で追加予定）');
        });
        
        // 音声プレイヤーの設定
        if (this.voicePlayer) {
            this.voicePlayer.innerHTML = `
                <source src="audio/oshiete.mp3" type="audio/mpeg">
                <source src="audio/oshiete.wav" type="audio/wav">
                <source src="audio/oshiete.ogg" type="audio/ogg">
            `;
            
            this.voicePlayer.loop = true;
            this.voicePlayer.volume = 0.8;
            this.voicePlayer.preload = 'auto';
            
            this.voicePlayer.addEventListener('canplaythrough', () => {
                console.log('✅ 音声ファイル準備完了');
                this.voiceInitialized = true;
            });
            
            this.voicePlayer.addEventListener('loadeddata', () => {
                console.log('✅ 音声データ読み込み完了');
                this.voiceInitialized = true;
            });
            
            this.voicePlayer.addEventListener('play', () => {
                this.voiceIsPlaying = true;
                console.log('🎵 音声再生開始！');
            });
            
            this.voicePlayer.addEventListener('pause', () => {
                this.voiceIsPlaying = false;
                console.log('⏸️ 音声停止');
            });
            
            this.voicePlayer.addEventListener('ended', () => {
                console.log('🔄 音声終了 → 再開始');
                if (this.audioEnabled) {
                    setTimeout(() => {
                        this.voicePlayer.currentTime = 0;
                        this.playVoice();
                    }, 100);
                }
            });
            
            this.voicePlayer.addEventListener('error', (e) => {
                console.error('❌ 音声エラー:', e);
                console.log('🔍 音声ファイルパスを確認してください: audio/oshiete.mp3');
            });
            
            console.log('✅ 音声プレイヤー設定完了');
        }
        
        // BGMプレイヤーの設定（ミュート対応強化）
        if (this.bgmPlayer) {
            this.checkBGMFile().then(exists => {
                if (!exists) {
                    console.warn('⚠️ BGMファイルが見つかりません: audio/bgm.mp3');
                    this.createFallbackBGM();
                    return;
                }
                
                this.bgmPlayer.volume = 0.3;
                this.bgmPlayer.loop = true;
                this.bgmPlayer.preload = 'auto';
                
                this.bgmPlayer.addEventListener('loadeddata', () => {
                    console.log('✅ BGM読み込み完了: audio/bgm.mp3');
                    this.bgmInitialized = true;
                });
                
                this.bgmPlayer.addEventListener('canplaythrough', () => {
                    console.log('✅ BGM再生準備完了');
                    this.bgmInitialized = true;
                });
                
                this.bgmPlayer.addEventListener('play', () => {
                    this.bgmIsPlaying = true;
                    this.bgmRetryCount = 0;
                    console.log('🎵 BGM再生開始！');
                    
                    // ミュートボタンの表示更新
                    this.updateMuteButton();
                });
                
                this.bgmPlayer.addEventListener('pause', () => {
                    this.bgmIsPlaying = false;
                    console.log('⏸️ BGM停止');
                    
                    // ミュートボタンの表示更新
                    this.updateMuteButton();
                });
                
                this.bgmPlayer.addEventListener('ended', () => {
                    console.log('🔄 BGM終了 → 自動再開');
                    if (this.bgmEnabled) {
                        this.bgmPlayer.currentTime = 0;
                        this.playBGM();
                    }
                });
                
                this.bgmPlayer.addEventListener('error', (e) => {
                    console.error('❌ BGMエラー:', e);
                    this.retryBGM();
                });
                
                console.log('✅ BGMプレイヤー設定完了（ミュート対応）');
            });
        }
        
        console.log('✅ 全音声要素設定完了');
    }
    
    // ミュートボタン表示更新（新機能）
    updateMuteButton() {
        const muteIcon = document.getElementById('muteIcon');
        const muteBtn = document.getElementById('muteBtn');
        
        if (muteIcon && muteBtn) {
            if (this.bgmEnabled && this.bgmIsPlaying) {
                muteIcon.textContent = '🔊';
                muteBtn.classList.remove('muted');
                console.log('🔊 ミュートボタン: 音声ON表示');
            } else {
                muteIcon.textContent = '🔇';
                muteBtn.classList.add('muted');
                console.log('🔇 ミュートボタン: 音声OFF表示');
            }
        }
    }
    
    // BGMファイル存在確認
    async checkBGMFile() {
        return new Promise((resolve) => {
            const audio = new Audio();
            
            const timeout = setTimeout(() => {
                console.warn('⚠️ BGM確認タイムアウト');
                resolve(false);
            }, 5000);
            
            audio.oncanplaythrough = () => {
                clearTimeout(timeout);
                console.log('✅ audio/bgm.mp3 確認済み');
                resolve(true);
            };
            
            audio.onerror = () => {
                clearTimeout(timeout);
                console.error('❌ audio/bgm.mp3 が見つかりません');
                resolve(false);
            };
            
            audio.src = 'audio/bgm.mp3?t=' + Date.now();
        });
    }
    
    // フォールバックBGM作成
    createFallbackBGM() {
        console.log('🔄 フォールバックBGM作成中...');
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const createTone = (frequency, duration, delay = 0) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + delay);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);
                
                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + duration);
            };
            
            const playFallbackBGM = () => {
                if (this.bgmEnabled && !this.bgmIsPlaying) {
                    createTone(440, 0.5, 0);
                    createTone(523, 0.5, 0.5);
                    createTone(659, 0.5, 1.0);
                    
                    setTimeout(playFallbackBGM, 5000);
                }
            };
            
            this.fallbackBGMFunction = playFallbackBGM;
            console.log('✅ フォールバックBGM準備完了');
            
        } catch (error) {
            console.warn('⚠️ フォールバックBGM作成失敗:', error);
        }
    }
    
    // BGM再生
    playBGM() {
        if (!this.bgmEnabled) {
            console.log('🔇 BGM無効モード');
            return;
        }
        
        if (!this.userHasInteracted) {
            console.log('⏳ BGM: ユーザー操作待ち');
            return;
        }
        
        if (this.bgmPlayer && this.bgmInitialized) {
            console.log('🎵 BGM再生試行...');
            
            this.bgmPlayer.currentTime = 0;
            const playPromise = this.bgmPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ BGM再生成功！');
                    this.bgmIsPlaying = true;
                    this.updateMuteButton(); // ボタン更新
                }).catch(error => {
                    console.error('❌ BGM再生失敗:', error);
                    this.retryBGM();
                });
            }
        } else {
            console.log('🔄 フォールバックBGMを使用');
            if (this.fallbackBGMFunction) {
                this.fallbackBGMFunction();
                this.bgmIsPlaying = true;
                this.updateMuteButton(); // ボタン更新
            }
        }
    }
    
    // BGM再生リトライ
    retryBGM() {
        this.bgmRetryCount++;
        
        if (this.bgmRetryCount > 3) {
            console.warn('⚠️ BGM再試行上限に達しました - フォールバック使用');
            if (this.fallbackBGMFunction) {
                this.fallbackBGMFunction();
            }
            return;
        }
        
        console.log(`🔄 BGM再試行 ${this.bgmRetryCount}/3 （3秒後）`);
        setTimeout(() => {
            if (this.bgmEnabled && this.userHasInteracted && !this.bgmIsPlaying) {
                this.playBGM();
            }
        }, 3000);
    }
    
    // 小判効果音再生
    playKobanSound() {
        if (!this.kobanSoundPlayer) return;
        
        try {
            this.kobanSoundPlayer.currentTime = 0;
            this.kobanSoundPlayer.play().then(() => {
                console.log('🪙 小判効果音再生！（音量: 0.3）');
            }).catch(e => {
                console.warn('🔇 小判効果音再生失敗:', e);
            });
        } catch (error) {
            console.warn('🔇 小判効果音エラー:', error);
        }
    }
    
    // 音声再生
    playVoice() {
        if (!this.audioEnabled) {
            console.log('🔇 音声無効モード');
            return;
        }
        
        if (!this.voicePlayer) {
            console.error('❌ 音声プレイヤーが見つかりません');
            return;
        }
        
        if (!this.userHasInteracted) {
            console.log('⏳ ユーザー操作待ち');
            return;
        }
        
        console.log('🎵 音声再生試行...');
        
        this.checkAudioFile().then(exists => {
            if (!exists) {
                console.error('❌ audio/oshiete.mp3 が見つかりません');
                return;
            }
            
            this.voicePlayer.currentTime = 0;
            const playPromise = this.voicePlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ 音声再生成功！');
                    this.voiceIsPlaying = true;
                }).catch(error => {
                    console.error('❌ 音声再生失敗:', error);
                    this.retryVoicePlay();
                });
            }
        });
    }
    
    // 音声ファイル存在確認
    async checkAudioFile() {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                console.log('✅ audio/oshiete.mp3 確認済み');
                resolve(true);
            };
            audio.onerror = () => {
                console.error('❌ audio/oshiete.mp3 が見つかりません');
                resolve(false);
            };
            audio.src = 'audio/oshiete.mp3';
        });
    }
    
    // 音声再生リトライ
    retryVoicePlay() {
        console.log('🔄 音声再生リトライ（3秒後）');
        setTimeout(() => {
            if (this.audioEnabled && this.userHasInteracted) {
                this.playVoice();
            }
        }, 3000);
    }
    
    // 音声停止
    stopVoice() {
        if (this.voicePlayer && this.voiceIsPlaying) {
            this.voicePlayer.pause();
            this.voiceIsPlaying = false;
            console.log('⏸️ 音声停止完了');
        }
    }
    
    // BGM停止（強化版）
    stopBGM() {
        if (this.bgmPlayer && this.bgmIsPlaying) {
            this.bgmPlayer.pause();
            this.bgmIsPlaying = false;
            console.log('⏸️ BGM停止完了');
            
            // ミュートボタンの表示更新
            this.updateMuteButton();
        }
    }
    
    // 必要な要素チェック
    checkRequiredElements() {
        const requiredIds = [
            'bubbleText', 'characterImg',
            'tapIndicator', 'progressBar', 'progressCurrent',
            'progressTotal', 'audioDialog', 'screenshotImg',
            'muteBtn', 'muteIcon'
        ];
        
        for (let id of requiredIds) {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`❌ 要素が見つかりません: ${id}`);
                return false;
            }
        }
        return true;
    }
    
    // 画像プリロード
    preloadImages() {
        console.log('🖼️ MEXC画像プリロード開始');
        
        this.scenarios.forEach((scenario, index) => {
            const img = new Image();
            img.src = scenario.screenshot;
            img.onload = () => console.log(`✅ シーン${index + 1} 画像OK: ${scenario.screenshot}`);
            img.onerror = () => console.warn(`⚠️ シーン${index + 1} 画像NG: ${scenario.screenshot}`);
        });
        
        Object.values(this.characters).forEach(character => {
            const img = new Image();
            img.src = character.image;
            img.onload = () => console.log(`✅ ${character.name} 画像OK`);
            img.onerror = () => console.warn(`⚠️ ${character.name} 画像NG`);
        });
    }
    
    // イベントリスナー設定（ミュートボタン修正版）
    setupEventListeners() {
        // 全画面タッチ対応
        document.addEventListener('touchend', (e) => this.handleGlobalTouch(e));
        document.addEventListener('click', (e) => this.handleGlobalTouch(e));
        
        // ボタンイベント設定（ミュートボタン修正）
        const skipBtn = document.getElementById('skipBtn');
        const backBtn = document.getElementById('backBtn');
        const audioOnBtn = document.getElementById('audioOnBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');
        const muteBtn = document.getElementById('muteBtn');
        
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                this.nextScene(); 
                console.log('⏭️ 次のシーンボタンクリック');
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                this.previousScene(); 
                console.log('⏮️ 前のシーンボタンクリック');
            });
        }
        
        if (audioOnBtn) {
            audioOnBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                this.enableAudio(); 
                console.log('🔊 音声ONボタンクリック');
            });
        }
        
        if (audioOffBtn) {
            audioOffBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                this.disableAudio(); 
                console.log('🔇 音声OFFボタンクリック');
            });
        }
        
        // ミュートボタンのイベント設定（強化版）
        if (muteBtn) {
            // クリックイベント
            muteBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                console.log('🔘 ミュートボタンクリック検出');
                this.toggleMute(); 
            });
            
            // タッチイベント（iOS対応）
            muteBtn.addEventListener('touchend', (e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                console.log('👆 ミュートボタンタッチ検出');
                this.toggleMute(); 
            });
            
            console.log('✅ ミュートボタンイベント設定完了');
        } else {
            console.error('❌ ミュートボタンが見つかりません');
        }
        
        console.log('✅ イベントリスナー設定完了（ミュートボタン対応）');
    }
    
    // グローバルタッチ処理
    handleGlobalTouch(e) {
        // ダイアログが表示中は無視
        const audioDialog = document.getElementById('audioDialog');
        if (audioDialog && audioDialog.classList.contains('show')) {
            return;
        }
        
        // ボタンクリック（ミュートボタン含む）は無視
        if (e.target.closest('.nav-btn, .mute-btn, .dialog-btn')) {
            console.log('🔘 ボタンクリック検出 - スキップ');
            return;
        }
        
        // リンククリック検出
        const linkElement = e.target.closest('a');
        if (linkElement) {
            e.preventDefault();
            e.stopPropagation();
            
            const url = linkElement.href;
            if (url && url.startsWith('http')) {
                console.log('🔗 リンククリック検出:', url);
                window.open(url, '_blank', 'noopener,noreferrer');
                this.playKobanSound();
                console.log('✅ リンク別窓で開きました');
            }
            return;
        }
        
        // 通常のタッチ処理
        this.handleTouch(e);
    }
    
    // ユーザー操作処理
    handleTouch(e) {
        // 初回ユーザー操作を記録
        if (!this.userHasInteracted) {
            this.userHasInteracted = true;
            console.log('✅ ユーザー操作検出 - 全音声再生可能状態');
            
            // BGM開始
            setTimeout(() => {
                if (this.bgmEnabled) {
                    this.playBGM();
                }
            }, 100);
            
            // 音声開始（有効な場合）
            if (this.audioEnabled) {
                setTimeout(() => this.playVoice(), 500);
            }
        }
        
        const now = Date.now();
        if (now - this.lastTouchTime < this.touchCooldown) {
            return;
        }
        
        this.lastTouchTime = now;
        
        // 効果音再生
        this.playKobanSound();
        
        // BGMが停止していたら再開を試行
        if (this.bgmEnabled && !this.bgmIsPlaying && this.userHasInteracted) {
            console.log('🔄 BGM再開試行');
            this.playBGM();
        }
        
        if (this.isTyping) {
            this.completeTyping();
            return;
        }
        
        this.nextText();
    }
    
    // ミュート切り替え（完全修正版）
    toggleMute() {
        console.log('🔄 ミュート切り替え開始');
        console.log('現在の状態:', { 
            bgmEnabled: this.bgmEnabled, 
            bgmIsPlaying: this.bgmIsPlaying,
            userHasInteracted: this.userHasInteracted
        });
        
        // BGM有効/無効の切り替え
        this.bgmEnabled = !this.bgmEnabled;
        
        if (this.bgmEnabled) {
            // BGMを有効化
            console.log('🔊 BGM有効化');
            
            if (this.userHasInteracted) {
                setTimeout(() => {
                    this.playBGM();
                }, 100);
            }
        } else {
            // BGMを無効化
            console.log('🔇 BGM無効化');
            this.stopBGM();
        }
        
        // ミュートボタンの表示を即座に更新
        this.updateMuteButton();
        
        console.log('✅ ミュート切り替え完了');
    }
    
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
            
            // リンクイベントを再設定
            this.setupLinkEvents(bubbleText);
        }
        
        this.isTyping = false;
        if (tapIndicator) {
            tapIndicator.style.opacity = '1';
        }
    }
    
    nextText() {
        const currentScenario = this.scenarios[this.currentScene];
        
        if (this.currentTextIndex >= currentScenario.texts.length - 1) {
            this.nextScene();
        } else {
            this.currentTextIndex++;
            this.displayText(currentScenario.texts[this.currentTextIndex]);
        }
    }
    
    // リンク処理
    processTextWithLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="story-link" style="color: #FFD700 !important; text-decoration: underline !important; font-weight: bold !important; cursor: pointer !important; padding: 6px 12px !important; margin: 2px 4px !important; border-radius: 8px !important; background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15)) !important; border: 2px solid rgba(255, 215, 0, 0.5) !important; box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3) !important; transition: all 0.3s ease !important; transform: scale(1) !important; pointer-events: auto !important; position: relative !important; z-index: 1000 !important; min-width: 44px !important; min-height: 44px !important; text-align: center !important; display: inline-block !important;">🔗 ${url}</a>`;
        });
    }
    
    // リンクイベント設定
    setupLinkEvents(container) {
        const links = container.querySelectorAll('a.story-link');
        
        links.forEach(link => {
            // 既存のイベントリスナーを削除
            link.replaceWith(link.cloneNode(true));
        });
        
        // 新しいリンクにイベントを設定
        const newLinks = container.querySelectorAll('a.story-link');
        newLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const url = link.href;
                console.log('🔗 リンククリック（直接）:', url);
                
                if (url && url.startsWith('http')) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    this.playKobanSound();
                    console.log('✅ リンク別窓で開きました（直接）');
                }
            });
            
            link.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const url = link.href;
                console.log('🔗 リンクタッチ（直接）:', url);
                
                if (url && url.startsWith('http')) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    this.playKobanSound();
                    console.log('✅ リンク別窓で開きました（タッチ）');
                }
            });
            
            console.log('✅ リンクイベント設定完了:', link.href);
        });
    }
    
    displayText(text) {
        const bubbleText = document.getElementById('bubbleText');
        const tapIndicator = document.getElementById('tapIndicator');
        
        if (!bubbleText || !tapIndicator) return;
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        this.isTyping = true;
        tapIndicator.style.opacity = '0';
        
        if (text.includes('http')) {
            bubbleText.innerHTML = this.processTextWithLinks(text);
            
            // リンクイベントを設定
            setTimeout(() => {
                this.setupLinkEvents(bubbleText);
            }, 100);
            
            this.isTyping = false;
            tapIndicator.style.opacity = '1';
            console.log('🔗 リンク付きテキスト表示完了');
        } else {
            bubbleText.textContent = '';
            
            let charIndex = 0;
            const typingSpeed = 60;
            
            this.typewriterInterval = setInterval(() => {
                if (charIndex < text.length) {
                    bubbleText.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(this.typewriterInterval);
                    this.typewriterInterval = null;
                    this.isTyping = false;
                    tapIndicator.style.opacity = '1';
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
        
        console.log(`📖 シーン ${this.currentScene + 1} 読み込み`);
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
            this.isTyping = false;
        }
        
        this.changeScreenshot(scenario.screenshot);
        this.changeCharacter(scenario.character);
        this.updateProgress();
        this.updateButtonStates();
        
        setTimeout(() => {
            this.displayText(scenario.texts[0]);
        }, 300);
    }
    
    changeScreenshot(imagePath) {
        const screenshotImg = document.getElementById('screenshotImg');
        if (!screenshotImg) return;
        
        screenshotImg.classList.remove('show');
        screenshotImg.classList.add('fade-out');
        
        setTimeout(() => {
            screenshotImg.src = imagePath;
            screenshotImg.onload = () => {
                screenshotImg.classList.remove('fade-out');
                screenshotImg.classList.add('show');
            };
        }, 250);
    }
    
    changeCharacter(characterKey) {
        const character = this.characters[characterKey];
        const characterImg = document.getElementById('characterImg');
        
        if (!characterImg || !character) return;
        
        characterImg.style.opacity = '0';
        
        setTimeout(() => {
            characterImg.src = character.image;
            characterImg.alt = character.name;
            characterImg.style.opacity = '1';
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
    
    // 音声有効化
    enableAudio() {
        this.audioEnabled = true;
        this.userHasInteracted = true;
        this.hideAudioDialog();
        this.startStory();
        
        setTimeout(() => {
            if (this.bgmEnabled) {
                this.playBGM();
            }
        }, 100);
        
        setTimeout(() => {
            this.playVoice();
        }, 1000);
        
        console.log('🔊 音声モード有効化 - BGM＋音声開始');
    }
    
    // 音声無効化
    disableAudio() {
        this.audioEnabled = false;
        this.userHasInteracted = true;
        this.hideAudioDialog();
        this.startStory();
        
        setTimeout(() => {
            if (this.bgmEnabled) {
                this.playBGM();
            }
        }, 100);
        
        console.log('🔇 無音モード（BGM＋効果音のみ）');
    }
    
    hideAudioDialog() {
        const dialog = document.getElementById('audioDialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }
    
    startStory() {
        console.log('🚀 ストーリー開始');
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
                this.destroy();
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
            this.voicePlayer.currentTime = 0;
        }
        
        if (this.bgmPlayer) {
            this.bgmPlayer.pause();
            this.bgmPlayer.currentTime = 0;
        }
        
        if (this.kobanSoundPlayer) {
            this.kobanSoundPlayer.pause();
            this.kobanSoundPlayer.currentTime = 0;
        }
        
        console.log('🧹 クリーンアップ完了（全音声停止）');
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

// 開発者向け便利機能（ミュートテスト追加）
window.NovelUtils = {
    // ミュートボタンテスト（新機能）
    testMuteButton: () => {
        if (window.ryoCoinNovel) {
            console.log('🔘 ミュートボタンテスト開始');
            console.log('現在の状態:', {
                bgmEnabled: window.ryoCoinNovel.bgmEnabled,
                bgmIsPlaying: window.ryoCoinNovel.bgmIsPlaying
            });
            window.ryoCoinNovel.toggleMute();
            console.log('✅ ミュートテスト完了');
        }
    },
    
    // ミュートボタン状態確認（新機能）
    checkMuteStatus: () => {
        if (window.ryoCoinNovel) {
            const muteBtn = document.getElementById('muteBtn');
            const muteIcon = document.getElementById('muteIcon');
            
            console.log('🔘 ミュートボタン状態:', {
                bgmEnabled: window.ryoCoinNovel.bgmEnabled,
                bgmIsPlaying: window.ryoCoinNovel.bgmIsPlaying,
                buttonExists: !!muteBtn,
                iconExists: !!muteIcon,
                iconText: muteIcon ? muteIcon.textContent : 'なし',
                buttonClasses: muteBtn ? muteBtn.className : 'なし'
            });
        }
    },
    
    // リンクテスト
    testLinkClick: () => {
        console.log('🔗 リンククリックテスト開始');
        const testUrl = 'https://www.mexc.com/ja-JP/';
        window.open(testUrl, '_blank', 'noopener,noreferrer');
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.playKobanSound();
        }
        console.log('✅ リンクテスト完了');
    },
    
    // BGM強制再生テスト
    forceBGM: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.bgmEnabled = true;
            window.ryoCoinNovel.userHasInteracted = true;
            window.ryoCoinNovel.playBGM();
            console.log('🎵 BGM強制再生実行');
        }
    },
    
    // BGM状態詳細確認
    checkBGMStatus: () => {
        if (window.ryoCoinNovel && window.ryoCoinNovel.bgmPlayer) {
            const bgm = window.ryoCoinNovel.bgmPlayer;
            console.log('🎵 BGM状態:', {
                src: bgm.src,
                canPlay: bgm.readyState >= 2,
                playing: !bgm.paused,
                volume: bgm.volume,
                loop: bgm.loop,
                duration: bgm.duration,
                currentTime: bgm.currentTime,
                bgmEnabled: window.ryoCoinNovel.bgmEnabled,
                bgmInitialized: window.ryoCoinNovel.bgmInitialized,
                userInteracted: window.ryoCoinNovel.userHasInteracted,
                retryCount: window.ryoCoinNovel.bgmRetryCount
            });
        }
    },
    
    // 効果音テスト
    playKobanTest: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.playKobanSound();
            console.log('🪙 小判効果音テスト実行（音量: 0.3）');
        }
    },
    
    // 音声強制再生テスト
    forcePlayVoice: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.audioEnabled = true;
            window.ryoCoinNovel.userHasInteracted = true;
            window.ryoCoinNovel.playVoice();
            console.log('🎵 強制音声再生実行');
        }
    },
    
    // 音声状態確認
    checkVoiceStatus: () => {
        if (window.ryoCoinNovel && window.ryoCoinNovel.voicePlayer) {
            const voice = window.ryoCoinNovel.voicePlayer;
            console.log('🎵 音声状態:', {
                src: voice.src,
                canPlay: voice.readyState >= 2,
                playing: !voice.paused,
                volume: voice.volume,
                loop: voice.loop,
                duration: voice.duration,
                audioEnabled: window.ryoCoinNovel.audioEnabled,
                userInteracted: window.ryoCoinNovel.userHasInteracted
            });
        }
    },
    
    // 音声ファイル確認
    testAudioFiles: () => {
        const audio = new Audio('audio/oshiete.mp3');
        audio.oncanplaythrough = () => console.log('✅ audio/oshiete.mp3 存在確認');
        audio.onerror = () => console.error('❌ audio/oshiete.mp3 見つからない');
        
        const bgm = new Audio('audio/bgm.mp3');
        bgm.oncanplaythrough = () => console.log('✅ audio/bgm.mp3 存在確認');
        bgm.onerror = () => console.error('❌ audio/bgm.mp3 見つからない');
        
        const koban = new Audio('audio/koban.mp3');
        koban.oncanplaythrough = () => console.log('✅ audio/koban.mp3 存在確認');
        koban.onerror = () => console.warn('⚠️ audio/koban.mp3 見つからない（後で追加予定）');
    },
    
    // 全状態確認
    fullStatus: () => {
        NovelUtils.checkMuteStatus();
        NovelUtils.checkBGMStatus();
        NovelUtils.checkVoiceStatus();
        NovelUtils.testAudioFiles();
        console.log('🔍 フル診断完了（ミュートボタン含む）');
    },
    
    // 全音声停止
    stopAllAudio: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.stopVoice();
            window.ryoCoinNovel.stopBGM();
            console.log('⏸️ 全音声停止');
        }
    }
};

console.log(`
🎭 RYOコインサウンドノベル - 完璧版（ミュートボタン対応）
🎵 audio/oshiete.mp3 専用ループシステム
🎶 audio/bgm.mp3 バックグラウンド音楽システム
🪙 audio/koban.mp3 効果音システム（音量: 0.3）
🔗 リンク別窓対応システム
🔇 ミュートボタン完全対応

🎮 デバッグコマンド:
NovelUtils.testMuteButton() - ミュートボタンテスト
NovelUtils.checkMuteStatus() - ミュートボタン状態確認
NovelUtils.testLinkClick() - リンククリックテスト
NovelUtils.forceBGM() - BGM強制再生
NovelUtils.checkBGMStatus() - BGM状態詳細確認
NovelUtils.playKobanTest() - 小判効果音テスト
NovelUtils.forcePlayVoice() - 強制音声再生
NovelUtils.testAudioFiles() - 全音声ファイル確認
NovelUtils.fullStatus() - 全状態診断
NovelUtils.stopAllAudio() - 全音声停止

📁 必要ファイル:
audio/oshiete.mp3 - メイン音声ファイル
audio/bgm.mp3 - バックグラウンド音楽
audio/koban.mp3 - 小判効果音

🎯 ミュートボタン問題解決機能:
- ✅ ミュートボタンイベント強化
- ✅ タッチとクリック両対応
- ✅ リアルタイム表示更新
- ✅ BGM状態連動
- ✅ ミュート専用テスト機能
`);
