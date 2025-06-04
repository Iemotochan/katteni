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
        
        // レスポンシブ対応強化
        this.responsiveMode = this.detectResponsiveMode();
        this.layoutObserver = null;
        this.messageAreaHeight = 120; // デフォルト高さ
        
        // PC対応強化：復帰検出用
        this.wasPageHidden = false;
        this.focusRetryCount = 0;
        this.returnDetectionActive = false;
        this.lastInteractionTime = 0;
        this.pcReturnHandlers = [];
        
        // キャラクター設定
        this.characters = {
            ryoko: {
                name: '両子先生',
                image: 'image/ryokosensei.png',
                voice: 'female'
            },
            zenta: {
                name: '禅太先生',
                image: 'image/zentasensei.png',
                voice: 'male'
            }
        };
        
        // シナリオデータ
        this.scenarios = this.getScenarioData();
        this.init();
    }

    // レスポンシブモード検出
    detectResponsiveMode() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const modes = {
            isCompact: viewport.height < 600,
            isUltraCompact: viewport.height < 500,
            isWide: viewport.width > viewport.height * 1.5,
            isUltraWide: viewport.width > viewport.height * 2,
            isSmallScreen: viewport.width < 375,
            isTallScreen: viewport.height > viewport.width * 2
        };
        
        console.log('📏 レスポンシブモード検出:', modes);
        return modes;
    }

    // 初期化
    init() {
        console.log('🎭 BitTradeサウンドノベル初期化開始（完全レスポンシブ版）');
        
        if (!this.checkRequiredElements()) {
            console.error('❌ 必要なHTML要素が見つかりません');
            return;
        }

        this.setupResponsiveLayout();
        this.setupAudioElements();
        this.setupEventListeners();
        this.setupAdvancedPageReturnHandling();
        this.showAudioDialog();
        this.preloadImages();
        
        console.log('✅ BitTradeサウンドノベル初期化完了（完全レスポンシブ版）');
    }

    // レスポンシブレイアウト設定
    setupResponsiveLayout() {
        // レイアウト観察
        if ('ResizeObserver' in window) {
            this.layoutObserver = new ResizeObserver(() => {
                this.handleLayoutChange();
            });
            
            const messageArea = document.getElementById('messageArea') || 
                               document.querySelector('.message-area');
            if (messageArea) {
                this.layoutObserver.observe(messageArea);
            }
        }
        
        // 初期レイアウト調整
        this.adjustLayoutForDevice();
        
        // ビューポート変更リスナー
        window.addEventListener('resize', () => {
            this.handleViewportChange();
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 300);
        });
    }

    // レイアウト変更処理
    handleLayoutChange() {
        this.responsiveMode = this.detectResponsiveMode();
        this.adjustLayoutForDevice();
        this.adjustTextSizing();
        this.adjustMessageAreaHeight();
    }

    // ビューポート変更処理
    handleViewportChange() {
        this.responsiveMode = this.detectResponsiveMode();
        this.adjustLayoutForDevice();
        
        // テキスト再描画
        if (!this.isTyping) {
            this.refreshCurrentText();
        }
    }

    // オリエンテーション変更処理
    handleOrientationChange() {
        this.responsiveMode = this.detectResponsiveMode();
        this.adjustLayoutForDevice();
        this.recalculateLayout();
        
        // 小判効果音でフィードバック
        setTimeout(() => {
            this.playKobanSound();
        }, 500);
    }

    // デバイス向けレイアウト調整
    adjustLayoutForDevice() {
        const { responsiveMode } = this;
        const messageArea = document.querySelector('.message-area');
        const speechBubble = document.querySelector('.speech-bubble');
        const characterContainer = document.querySelector('.character-container');
        
        if (!messageArea || !speechBubble || !characterContainer) return;
        
        // 超コンパクトモード
        if (responsiveMode.isUltraCompact) {
            messageArea.style.maxHeight = '70px';
            speechBubble.style.padding = '8px';
            speechBubble.style.minHeight = '45px';
            characterContainer.style.width = '50px';
            characterContainer.style.height = '50px';
            console.log('📦 超コンパクトレイアウト適用');
        }
        // コンパクトモード
        else if (responsiveMode.isCompact) {
            messageArea.style.maxHeight = '90px';
            speechBubble.style.padding = '12px';
            speechBubble.style.minHeight = '60px';
            characterContainer.style.width = '60px';
            characterContainer.style.height = '60px';
            console.log('📦 コンパクトレイアウト適用');
        }
        // 通常モード
        else {
            messageArea.style.maxHeight = '120px';
            speechBubble.style.padding = '16px';
            speechBubble.style.minHeight = '70px';
            characterContainer.style.width = '70px';
            characterContainer.style.height = '70px';
            console.log('📦 標準レイアウト適用');
        }
        
        // 横画面調整
        if (responsiveMode.isWide) {
            messageArea.style.flexDirection = 'row';
            speechBubble.style.maxHeight = responsiveMode.isUltraCompact ? '60px' : '80px';
            console.log('📱 横画面レイアウト適用');
        } else {
            messageArea.style.flexDirection = '';
        }
    }

    // テキストサイズ調整
    adjustTextSizing() {
        const bubbleText = document.querySelector('.bubble-text');
        if (!bubbleText) return;
        
        const { responsiveMode } = this;
        let fontSize, lineHeight;
        
        if (responsiveMode.isUltraCompact) {
            fontSize = '11px';
            lineHeight = '1.2';
        } else if (responsiveMode.isCompact) {
            fontSize = '13px';
            lineHeight = '1.3';
        } else if (responsiveMode.isSmallScreen) {
            fontSize = '14px';
            lineHeight = '1.4';
        } else {
            fontSize = '15px';
            lineHeight = '1.5';
        }
        
        bubbleText.style.fontSize = fontSize;
        bubbleText.style.lineHeight = lineHeight;
        
        // リンクサイズも調整
        const links = bubbleText.querySelectorAll('a, .story-link');
        links.forEach(link => {
            const linkFontSize = parseInt(fontSize) - 1;
            const minSize = responsiveMode.isUltraCompact ? '36px' : '40px';
            
            link.style.fontSize = `${linkFontSize}px !important`;
            link.style.minWidth = `${minSize} !important`;
            link.style.minHeight = `${minSize} !important`;
        });
    }

    // メッセージエリア高さ調整
    adjustMessageAreaHeight() {
        const messageArea = document.querySelector('.message-area');
        if (!messageArea) return;
        
        const rect = messageArea.getBoundingClientRect();
        this.messageAreaHeight = rect.height;
        
        // コンテンツエリアの調整
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            const bottomSpace = this.messageAreaHeight + 60; // プログレスエリア分
            contentArea.style.bottom = `${bottomSpace}px`;
        }
    }

    // レイアウト再計算
    recalculateLayout() {
        // 強制再描画
        const elements = document.querySelectorAll('.message-area, .speech-bubble, .character-container');
        elements.forEach(element => {
            element.style.transform = 'translateZ(0)';
            setTimeout(() => {
                element.style.transform = '';
            }, 1);
        });
        
        // 高さ再計算
        this.adjustMessageAreaHeight();
    }

    // 現在のテキスト再描画
    refreshCurrentText() {
        const currentScenario = this.scenarios[this.currentScene];
        if (currentScenario && currentScenario.texts[this.currentTextIndex]) {
            const text = currentScenario.texts[this.currentTextIndex];
            this.displayTextImmediate(text);
        }
    }

    // テキスト即座表示（再描画用）
    displayTextImmediate(text) {
        const bubbleText = document.getElementById('bubbleText');
        if (!bubbleText) return;
        
        if (text.includes('http')) {
            bubbleText.innerHTML = this.processTextWithLinks(text);
            this.setupLinkEvents(bubbleText);
        } else {
            bubbleText.textContent = text;
        }
        
        this.adjustTextSizing();
        
        const tapIndicator = document.getElementById('tapIndicator');
        if (tapIndicator) {
            tapIndicator.style.opacity = '1';
        }
    }

    // シナリオデータ取得
    getScenarioData() {
        return [
            {
                character: 'ryoko',
                screenshot: 'image/guide.jpg',
                texts: [
                    'こんにちは！両子です✨\n今日はRYOコインの購入方法を完全ガイドします！',
                    '仮想通貨初心者でも大丈夫💎\n一緒に順番に進めていきましょう！',
                    '準備はいいですか？\nそれでは始めましょう！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bittouroku/1.jpg',
                texts: [
                    'まずは取引所のアカウントを作成します。\n今回はBittradeを利用します。',
                    '次のリンクをタップして\nBittradeの公式サイトにアクセスして新規登録📱',
                    '紹介コードが必要な人は使ってね👉「8SRkt」\n終わったら戻ってきてね📱\n次で細かく説明していくよ📱',
                    'リンク: https://m.bittrade.co.jp/ja-jp/register/?invite_code=8SRkt'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'bittouroku/2.jpg',
                texts: [
                    'メールアドレスとパスワードを入力します。\nパスワードは8〜20文字で大小英数字を含む必要があります！',
                    '「クリックして確認しよう」をタップ✨'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bittouroku/3.jpg',
                texts: [
                    'スライドしてパズルを完成させましょう☝️人間だという証明だね⭐️'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'bittouroku/4.jpg',
                texts: [
                    '登録したメールアドレスに\n認証コードが送信されました📧',
                    'メールをチェックして\n6桁の数字を入力してください。',
                    '届かない場合は迷惑メールフォルダも\n確認してくださいね！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bittouroku/6.jpg',
                texts: [
                    'ログイン出来ると本人確認へ進めます✨',
                    '時間がない人は後でやってもいいよ✨'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'bittouroku/5.jpg',
                texts: [
                    '上部にオススメマークが表示されていますね。',
                    'かんたん本人確認ができます！タップしてみましょう！'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'touroku/7.jpg',
                texts: [
                    '国籍や氏名などの基本情報を入力します。\n本人確認書類と同じ情報を正確に入力してください。',
                    '入力が完了したら「次へ」をタップして\n審査を待ちましょう。通常1〜3営業日で完了です。'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'bittouroku/8.jpg',
                texts: [
                    'トップ画面の右上のメニューを押して見て',
                    'そうすると…。'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bittouroku/9.jpg',
                texts: [
                    'アプリがダウンロードできるよ📱'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'bittouroku/10.jpg',
                texts: [
                    'iPhoneアプリか、Androidアプリか、お使いのスマートフォンに合わせて入れてみてね📱',
                    '次はアプリの画面で説明していくよ📱'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'nyuukin/1.jpg',
                texts: [
                    'アプリを開いてログインしたよ！💖',
                    '本人確認が完了したら入金しましょう💰\n「入金」ボタンをタップします。',
                    '表示された専用口座に\n銀行振込で入金してください。'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'nyuukin/2.jpg',
                texts: [
                    '振込先の口座情報が表示されます。\n必ずこの口座に入金してください！',
                    '⚠️重要⚠️\nクイック入金やコンビニ入金は\n1週間の出金制限がかかるのでNGです。',
                    '銀行振込なら制限なしで\n着金確認後、すぐに取引できます🏦'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'buy/1.jpg',
                texts: [
                    '入金が完了したら仮想通貨を購入しましょう！\n手数料が安いXRPがオススメです💎',
                    '画面下部の「取引所」をタップして\n取引画面に移動します。'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'buy/2.jpg',
                texts: [
                    '上部の「BTC/JPY」をタップすると\n通貨選択画面が開きます。'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'zenta',
                screenshot: 'buy/3.jpg',
                texts: [
                    '検索窓に「XRP」と入力して\nXRPを選択しましょう🔍'
                ],
                audio: 'audio/oshiete.mp3'
            },
            {
                character: 'ryoko',
                screenshot: 'buy/5.jpg',
                texts: [
                    'XRP購入画面です！\n「成行」注文で簡単に購入できます。',
                    'ゲージを動かして購入枚数を決めて\n「XRPを買う」ボタンをタップ！',
                    '🎉おめでとうございます！\n仮想通貨の購入に成功しました✨',
                    '次は送金に挑戦！💫'
                ],
                audio: 'audio/oshiete.mp3'
            }
        ];
    }

    // 必要な要素チェック
    checkRequiredElements() {
        const requiredIds = [
            'bubbleText', 'characterImg', 'tapIndicator',
            'progressBar', 'progressCurrent', 'progressTotal',
            'audioDialog', 'screenshotImg'
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
            });
            
            console.log('✅ 音声プレイヤー設定完了');
        }

        // BGMプレイヤーの設定
        if (this.bgmPlayer) {
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
            });
            
            this.bgmPlayer.addEventListener('pause', () => {
                this.bgmIsPlaying = false;
                console.log('⏸️ BGM停止');
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
            
            console.log('✅ BGMプレイヤー設定完了');
        }
        
        console.log('✅ 全音声要素設定完了（完全レスポンシブ版）');
    }

    // PC対応強化：高度なページ復帰検出
    setupAdvancedPageReturnHandling() {
        console.log('🖥️ PC対応強化：高度なページ復帰検出システム開始');
        
        // 基本的なページ可視性変更
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.wasPageHidden = true;
                this.returnDetectionActive = true;
                console.log('📱 ページ非表示 → 復帰検出モード開始');
            } else {
                if (this.wasPageHidden) {
                    console.log('🎉 visibilitychange復帰検出！');
                    this.handleAdvancedPageReturn('visibilitychange');
                }
            }
        });

        // ウィンドウフォーカス復帰（PC重要）
        const focusHandler = () => {
            if (this.returnDetectionActive) {
                console.log('🎉 focus復帰検出！');
                this.handleAdvancedPageReturn('focus');
            }
        };
        window.addEventListener('focus', focusHandler);
        this.pcReturnHandlers.push(() => window.removeEventListener('focus', focusHandler));

        // ページ表示イベント（PC重要）
        const pageshowHandler = (e) => {
            if (e.persisted || this.returnDetectionActive) {
                console.log('🎉 pageshow復帰検出！');
                this.handleAdvancedPageReturn('pageshow');
            }
        };
        window.addEventListener('pageshow', pageshowHandler);
        this.pcReturnHandlers.push(() => window.removeEventListener('pageshow', pageshowHandler));

        // マウス移動検出（PC専用）
        let mouseMoveTimeout;
        const mouseMoveHandler = () => {
            if (this.returnDetectionActive) {
                clearTimeout(mouseMoveTimeout);
                mouseMoveTimeout = setTimeout(() => {
                    console.log('🎉 mousemove復帰検出！');
                    this.handleAdvancedPageReturn('mousemove');
                }, 100);
            }
        };
        document.addEventListener('mousemove', mouseMoveHandler, { passive: true });
        this.pcReturnHandlers.push(() => document.removeEventListener('mousemove', mouseMoveHandler));

        // キーボード検出（PC専用）
        const keyHandler = () => {
            if (this.returnDetectionActive) {
                console.log('🎉 keyboard復帰検出！');
                this.handleAdvancedPageReturn('keyboard');
            }
        };
        document.addEventListener('keydown', keyHandler);
        this.pcReturnHandlers.push(() => document.removeEventListener('keydown', keyHandler));

        // クリック検出（PC・スマホ共通）
        const clickHandler = () => {
            if (this.returnDetectionActive) {
                console.log('🎉 click復帰検出！');
                this.handleAdvancedPageReturn('click');
            }
        };
        document.addEventListener('click', clickHandler);
        this.pcReturnHandlers.push(() => document.removeEventListener('click', clickHandler));

        // タッチ検出（スマホ重要）
        const touchHandler = () => {
            if (this.returnDetectionActive) {
                console.log('🎉 touch復帰検出！');
                this.handleAdvancedPageReturn('touch');
            }
        };
        document.addEventListener('touchstart', touchHandler, { passive: true });
        this.pcReturnHandlers.push(() => document.removeEventListener('touchstart', touchHandler));

        // スクロール検出（PC・スマホ共通）
        let scrollTimeout;
        const scrollHandler = () => {
            if (this.returnDetectionActive) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    console.log('🎉 scroll復帰検出！');
                    this.handleAdvancedPageReturn('scroll');
                }, 200);
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.pcReturnHandlers.push(() => window.removeEventListener('scroll', scrollHandler));

        console.log('✅ PC対応強化：復帰検出システム設定完了');
    }

    // 高度なページ復帰処理
    handleAdvancedPageReturn(triggerEvent) {
        console.log(`💖 おかえりなさい！（${triggerEvent}で検出）`);
        this.wasPageHidden = false;
        this.returnDetectionActive = false;
        this.focusRetryCount = 0;
        this.lastInteractionTime = Date.now();
        
        // ユーザーインタラクション状態を確実に設定
        this.userHasInteracted = true;
        
        // レスポンシブレイアウト再調整
        this.handleLayoutChange();
        
        // BGMとボイスの復帰処理
        if (this.bgmEnabled) {
            console.log('🎵 BGM復帰処理開始...');
            this.aggressiveBGMRetry();
        }
        
        if (this.audioEnabled && this.voicePlayer) {
            console.log('🎤 音声復帰処理開始...');
            this.aggressiveVoiceRetry();
        }
        
        // 小判効果音でお出迎え
        setTimeout(() => {
            this.playKobanSound();
        }, 300);
    }

    // 積極的BGM再試行（PC対応強化）
    aggressiveBGMRetry() {
        let retryCount = 0;
        const maxRetries = 5;
        
        const tryBGM = () => {
            retryCount++;
            console.log(`🎵 積極的BGM再試行 ${retryCount}/${maxRetries}`);
            
            if (this.bgmPlayer && this.bgmInitialized) {
                // BGMプレイヤーをリセット
                this.bgmPlayer.currentTime = 0;
                this.bgmIsPlaying = false;
                
                const playPromise = this.bgmPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('✅ 積極的BGM再開成功！');
                        this.bgmIsPlaying = true;
                    }).catch(error => {
                        console.warn(`❌ BGM再試行${retryCount}失敗:`, error);
                        if (retryCount < maxRetries) {
                            setTimeout(tryBGM, 1000 * retryCount);
                        }
                    });
                }
            }
        };
        
        // 即座に1回目を試行
        tryBGM();
    }

    // 積極的音声再試行
    aggressiveVoiceRetry() {
        if (!this.audioEnabled || !this.voicePlayer || !this.voiceInitialized) {
            return;
        }
        
        let retryCount = 0;
        const maxRetries = 3;
        
        const tryVoice = () => {
            retryCount++;
            console.log(`🎤 積極的音声再試行 ${retryCount}/${maxRetries}`);
            
            this.voicePlayer.currentTime = 0;
            this.voiceIsPlaying = false;
            
            const playPromise = this.voicePlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('✅ 積極的音声再開成功！');
                    this.voiceIsPlaying = true;
                }).catch(error => {
                    console.warn(`❌ 音声再試行${retryCount}失敗:`, error);
                    if (retryCount < maxRetries) {
                        setTimeout(tryVoice, 800 * retryCount);
                    }
                });
            }
        };
        
        // 少し遅延させて音声再開
        setTimeout(tryVoice, 500);
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

    // BGM再生
    playBGM() {
        if (!this.bgmEnabled || !this.userHasInteracted) {
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
                }).catch(error => {
                    console.error('❌ BGM再生失敗:', error);
                    this.retryBGM();
                });
            }
        }
    }

    // BGM再生リトライ
    retryBGM() {
        this.bgmRetryCount++;
        if (this.bgmRetryCount <= 3) {
            console.log(`🔄 BGM再試行 ${this.bgmRetryCount}/3 （3秒後）`);
            setTimeout(() => {
                if (this.bgmEnabled && this.userHasInteracted && !this.bgmIsPlaying) {
                    this.playBGM();
                }
            }, 3000);
        }
    }

    // 音声再生
    playVoice() {
        if (!this.audioEnabled || !this.voicePlayer || !this.userHasInteracted) {
            return;
        }
        
        console.log('🎵 音声再生試行...');
        this.voicePlayer.currentTime = 0;
        const playPromise = this.voicePlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('✅ 音声再生成功！');
                this.voiceIsPlaying = true;
            }).catch(error => {
                console.error('❌ 音声再生失敗:', error);
            });
        }
    }

    // 画像プリロード
    preloadImages() {
        console.log('🖼️ BitTrade画像プリロード開始');
        
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

    // イベントリスナー設定
    setupEventListeners() {
        // 全画面タッチ対応
        document.addEventListener('touchend', (e) => this.handleGlobalTouch(e));
        document.addEventListener('click', (e) => this.handleGlobalTouch(e));

        // ボタンイベント設定
        const skipBtn = document.getElementById('skipBtn');
        const backBtn = document.getElementById('backBtn');
        const audioOnBtn = document.getElementById('audioOnBtn');
        const audioOffBtn = document.getElementById('audioOffBtn');

        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextScene();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.previousScene();
            });
        }

        if (audioOnBtn) {
            audioOnBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.enableAudio();
            });
        }

        if (audioOffBtn) {
            audioOffBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.disableAudio();
            });
        }

        console.log('✅ イベントリスナー設定完了（完全レスポンシブ版）');
    }

    // グローバルタッチ処理
    handleGlobalTouch(e) {
        // ユーザーインタラクション時刻更新
        this.lastInteractionTime = Date.now();
        
        // 復帰検出中の場合はBGM再開を試行
        if (this.returnDetectionActive) {
            this.handleAdvancedPageReturn('user-interaction');
        }

        // ダイアログが表示中は無視
        const audioDialog = document.getElementById('audioDialog');
        if (audioDialog && audioDialog.classList.contains('show')) {
            return;
        }

        // ボタンクリックは無視
        if (e.target.closest('.nav-btn, .dialog-btn')) {
            return;
        }

        // リンククリック検出
        const linkElement = e.target.closest('a');
        if (linkElement) {
            e.preventDefault();
            e.stopPropagation();
            const url = linkElement.href;
            const linkType = linkElement.getAttribute('data-link-type');
            
            if (url && url.startsWith('http')) {
                console.log('🔗 グローバルリンククリック検出:', url);
                
                if (linkType === 'bittrade') {
                    // BitTradeリンクは同一タブで開く
                    console.log('🏆 Bittradeリンク → 同一タブで移動');
                    // 復帰検出モードを有効化
                    this.returnDetectionActive = true;
                    window.location.href = url;
                } else {
                    // その他のリンクは新しいタブで開く
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                
                this.playKobanSound();
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
            console.log('✅ ユーザー操作検出 → 全音声再生可能状態');
            
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
            this.playBGM();
        }

        if (this.isTyping) {
            this.completeTyping();
            return;
        }

        this.nextText();
    }

    // タイピング完了
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
            this.setupLinkEvents(bubbleText);
            this.adjustTextSizing(); // レスポンシブ調整
        }

        this.isTyping = false;
        if (tapIndicator) {
            tapIndicator.style.opacity = '1';
        }
    }

    // 次のテキスト
    nextText() {
        const currentScenario = this.scenarios[this.currentScene];
        if (this.currentTextIndex >= currentScenario.texts.length - 1) {
            this.nextScene();
        } else {
            this.currentTextIndex++;
            this.displayText(currentScenario.texts[this.currentTextIndex]);
        }
    }

    // リンク処理（BitTrade対応版）
    processTextWithLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
            // BitTradeの紹介リンクは同一タブで開く
            const isBittradeLink = url.includes('bittrade.co.jp') || url.includes('m.bittrade.co.jp');
            const target = isBittradeLink ? '_self' : '_blank';
            const targetText = isBittradeLink ? '同一タブで開く' : '別窓で開く';

            return `<a href="${url}" target="${target}" rel="noopener noreferrer" class="story-link" data-link-type="${isBittradeLink ? 'bittrade' : 'external'}" style="color: #FFD700 !important; text-decoration: underline !important; font-weight: bold !important; cursor: pointer !important; padding: 6px 12px !important; margin: 2px 4px !important; border-radius: 8px !important; background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.15)) !important; border: 2px solid rgba(255, 215, 0, 0.5) !important; box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3) !important; transition: all 0.3s ease !important; transform: scale(1) !important; pointer-events: auto !important; position: relative !important; z-index: 1000 !important; min-width: 44px !important; min-height: 44px !important; text-align: center !important; display: inline-block !important;">🔗 ${isBittradeLink ? 'Bittrade登録' : 'リンク'} (${targetText})</a>`;
        });
    }

    // リンクイベント設定
    setupLinkEvents(container) {
        const links = container.querySelectorAll('a.story-link');
        links.forEach(link => {
            link.replaceWith(link.cloneNode(true));
        });

        const newLinks = container.querySelectorAll('a.story-link');
        newLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = link.href;
                const linkType = link.getAttribute('data-link-type');

                if (url && url.startsWith('http')) {
                    console.log(`🔗 リンククリック検出: ${url} (${linkType})`);

                    if (linkType === 'bittrade') {
                        // BitTradeリンクは同一タブで開く（紹介コード保持のため）
                        console.log('🏆 Bittradeリンク → 同一タブで移動');
                        // 復帰検出モードを有効化
                        this.returnDetectionActive = true;
                        window.location.href = url;
                    } else {
                        // その他のリンクは新しいタブで開く
                        console.log('🔗 外部リンク → 新しいタブで開く');
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }

                    this.playKobanSound();
                }
            });

            link.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = link.href;
                const linkType = link.getAttribute('data-link-type');

                if (url && url.startsWith('http')) {
                    console.log(`📱 タッチリンク: ${url} (${linkType})`);

                    if (linkType === 'bittrade') {
                        // BitTradeリンクは同一タブで開く
                        this.returnDetectionActive = true;
                        window.location.href = url;
                    } else {
                        // その他のリンクは新しいタブで開く
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }

                    this.playKobanSound();
                }
            });
        });
        
        // レスポンシブ調整
        this.adjustTextSizing();
    }

    // テキスト表示
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
            setTimeout(() => this.setupLinkEvents(bubbleText), 100);
            this.isTyping = false;
            tapIndicator.style.opacity = '1';
        } else {
            bubbleText.textContent = '';
            let charIndex = 0;
            const typingSpeed = this.responsiveMode.isCompact ? 40 : 60; // コンパクトモードでは高速

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
        
        // レスポンシブ調整
        this.adjustTextSizing();
    }

    // 次のシーン
    nextScene() {
        if (this.currentScene < this.scenarios.length - 1) {
            this.currentScene++;
            this.currentTextIndex = 0;
            this.loadScene();
        } else {
            this.endStory();
        }
    }

    // 前のシーン
    previousScene() {
        if (this.currentScene > 0) {
            this.currentScene--;
            this.currentTextIndex = 0;
            this.loadScene();
        }
    }

    // シーンロード
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

    // スクリーンショット変更
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

    // キャラクター変更
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

    // プログレス更新
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

    // ボタン状態更新
    updateButtonStates() {
        const backBtn = document.getElementById('backBtn');
        const skipBtn = document.getElementById('skipBtn');

        if (backBtn) backBtn.disabled = this.currentScene === 0;
        if (skipBtn) skipBtn.disabled = this.currentScene === this.scenarios.length - 1;
    }

    // 音声ダイアログ表示
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

        console.log('🔊 音声モード有効化 → BGM＋音声開始');
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

    // 音声ダイアログ非表示
    hideAudioDialog() {
        const dialog = document.getElementById('audioDialog');
        if (dialog) {
            dialog.classList.remove('show');
        }
    }

    // ストーリー開始
    startStory() {
        console.log('🚀 BitTradeストーリー開始');
        this.loadScene();
    }

    // ストーリー終了
    endStory() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }

        const bubbleText = document.getElementById('bubbleText');
        if (bubbleText) {
            bubbleText.innerHTML = 'BitTradeでのXRP購入ガイドは以上です。<br>ありがとうございました！✨<br><br>次はMEXCへの送金ですね🚀';
        }

        setTimeout(() => {
            if (confirm('BitTradeでの購入ガイドが完了しました。\n送金編に移動しますか？')) {
                this.destroy();
                window.location.href = '../2/index.html';
            }
        }, 3000);
    }

    // クリーンアップ（完全レスポンシブ対応版）
    destroy() {
        // レイアウト観察の停止
        if (this.layoutObserver) {
            this.layoutObserver.disconnect();
            this.layoutObserver = null;
        }

        // イベントリスナーのクリーンアップ
        this.pcReturnHandlers.forEach(cleanup => cleanup());
        this.pcReturnHandlers = [];

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

        console.log('🧹 クリーンアップ完了（完全レスポンシブ版）');
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

// 開発者向け便利機能（完全レスポンシブ対応版）
window.NovelUtils = {
    // BitTradeリンクテスト
    testBittradeLink: () => {
        const testUrl = 'https://m.bittrade.co.jp/ja-jp/register/?invite_code=8SRkt';
        console.log('🏆 Bittradeリンクテスト:', testUrl);
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.returnDetectionActive = true;
        }
        window.location.href = testUrl; // 同一タブで開く
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.playKobanSound();
        }
        console.log('✅ Bittradeリンクテスト完了（同一タブ移動＋復帰検出）');
    },

    // PC復帰シミュレーションテスト
    simulatePCReturn: () => {
        if (window.ryoCoinNovel) {
            console.log('🖥️ PC復帰シミュレーション開始');
            window.ryoCoinNovel.returnDetectionActive = true;
            window.ryoCoinNovel.handleAdvancedPageReturn('simulation');
            console.log('✅ PC復帰シミュレーション実行');
        }
    },

    // 積極的BGMテスト
    testAggressiveBGM: () => {
        if (window.ryoCoinNovel) {
            console.log('🎵 積極的BGM再生テスト開始');
            window.ryoCoinNovel.userHasInteracted = true;
            window.ryoCoinNovel.bgmEnabled = true;
            window.ryoCoinNovel.aggressiveBGMRetry();
            console.log('✅ 積極的BGM再生テスト実行');
        }
    },

    // 通常リンクテスト
    testExternalLink: () => {
        const testUrl = 'https://google.com/';
        console.log('🔗 外部リンクテスト:', testUrl);
        window.open(testUrl, '_blank', 'noopener,noreferrer'); // 新しいタブで開く
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.playKobanSound();
        }
        console.log('✅ 外部リンクテスト完了（新しいタブ）');
    },

    // リンク検出テスト
    testLinkDetection: () => {
        const testText = 'リンク: https://m.bittrade.co.jp/ja-jp/register/?invite_code=8SRkt';
        if (window.ryoCoinNovel) {
            const processed = window.ryoCoinNovel.processTextWithLinks(testText);
            console.log('🔍 リンク検出テスト結果:', processed);
        }
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

    // 効果音テスト
    playKobanTest: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.playKobanSound();
            console.log('🪙 小判効果音テスト実行');
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

    // レスポンシブテスト機能（新機能）
    testResponsiveMode: () => {
        if (window.ryoCoinNovel) {
            console.log('📱 レスポンシブモードテスト:', window.ryoCoinNovel.responsiveMode);
            window.ryoCoinNovel.handleLayoutChange();
            console.log('✅ レスポンシブ調整実行');
        }
    },

    // ビューポートシミュレーション（新機能）
    simulateViewport: (width, height) => {
        if (window.ryoCoinApp && typeof window.ryoCoinApp.simulateResize === 'function') {
            window.ryoCoinApp.simulateResize(width, height);
        }
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.handleViewportChange();
        }
        console.log(`📏 ビューポートシミュレーション: ${width}×${height}`);
    },

    // オリエンテーション変更シミュレーション（新機能）
    simulateOrientationChange: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.handleOrientationChange();
            console.log('🔄 オリエンテーション変更シミュレーション実行');
        }
    },

    // レイアウト強制再計算（新機能）
    forceRecalculateLayout: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.recalculateLayout();
            console.log('🔧 レイアウト強制再計算実行');
        }
    },

    // テキストサイズ調整テスト（新機能）
    testTextSizing: () => {
        if (window.ryoCoinNovel) {
            window.ryoCoinNovel.adjustTextSizing();
            console.log('📝 テキストサイズ調整テスト実行');
        }
    },

    // 全状態確認（拡張版）
    fullStatus: () => {
        if (window.ryoCoinNovel) {
            console.log('🔍 システム状態:', {
                audioEnabled: window.ryoCoinNovel.audioEnabled,
                bgmEnabled: window.ryoCoinNovel.bgmEnabled,
                bgmIsPlaying: window.ryoCoinNovel.bgmIsPlaying,
                voiceIsPlaying: window.ryoCoinNovel.voiceIsPlaying,
                userHasInteracted: window.ryoCoinNovel.userHasInteracted,
                returnDetectionActive: window.ryoCoinNovel.returnDetectionActive,
                wasPageHidden: window.ryoCoinNovel.wasPageHidden,
                currentScene: window.ryoCoinNovel.currentScene + 1,
                totalScenes: window.ryoCoinNovel.scenarios.length,
                responsiveMode: window.ryoCoinNovel.responsiveMode,
                messageAreaHeight: window.ryoCoinNovel.messageAreaHeight,
                viewport: `${window.innerWidth}×${window.innerHeight}`
            });
        }
    },

    // 全音声停止
    stopAllAudio: () => {
        if (window.ryoCoinNovel) {
            if (window.ryoCoinNovel.voicePlayer) {
                window.ryoCoinNovel.voicePlayer.pause();
            }
            if (window.ryoCoinNovel.bgmPlayer) {
                window.ryoCoinNovel.bgmPlayer.pause();
            }
            console.log('⏸️ 全音声停止');
        }
    },

    // デバイス情報表示（新機能）
    showDeviceInfo: () => {
        if (window.ryoCoinApp && window.ryoCoinApp.deviceInfo) {
            console.log('📱 デバイス情報:', window.ryoCoinApp.deviceInfo);
        } else {
            console.log('⚠️ デバイス情報が利用できません');
        }
    },

    // パフォーマンスモード切り替え（新機能）
    togglePerformanceMode: () => {
        if (window.ryoCoinApp) {
            const isPerformanceMode = document.documentElement.classList.contains('performance-mode');
            if (isPerformanceMode) {
                document.documentElement.classList.remove('performance-mode');
                console.log('⚡ パフォーマンスモード無効化');
            } else {
                window.ryoCoinApp.enablePerformanceMode();
                console.log('🚀 パフォーマンスモード有効化');
            }
        }
    }
};

console.log(`
🎭 RYOコインサウンドノベル完全レスポンシブ版
Version: 4.0 (Ultimate Responsive)

📱 完全対応デバイス:
- ✅ iPhone (全モデル、ノッチ/Dynamic Island対応)
- ✅ Android (全画面サイズ)
- ✅ 折りたたみスマホ
- ✅ タブレット
- ✅ 極小画面 (320px以下)
- ✅ 極高画面 (2000px以上)

🔧 レスポンシブ機能:
- ✅ 動的レイアウト調整
- ✅ 適応型テキストサイズ
- ✅ フレキシブルメッセージエリア
- ✅ オリエンテーション対応
- ✅ キーボード表示検出
- ✅ セーフエリア完全対応
- ✅ ビューポート高さ動的計算

🎵 音声システム:
- ✅ audio/oshiete.mp3 専用ループシステム
- ✅ audio/bgm.mp3 バックグラウンド音楽システム（PC強化）
- ✅ audio/koban.mp3 効果音システム（音量: 0.3）
- ✅ 復<span class="cursor">█</span>
