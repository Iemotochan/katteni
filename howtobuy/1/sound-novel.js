// 第1話: BitTrade編 - シナリオデータのみ
class RyoCoinSoundNovel extends SoundNovelBase {
    constructor() {
        super();
        this.currentScene = 0;
        this.currentTextIndex = 0;
        
        // BitTrade編シナリオデータ
        this.scenarios = [
            {
                character: 'ryoko',
                screenshot: 'images/guide.jpg',
                texts: [
                    'こんにちは！両子です✨\n今日はRYOコインの購入方法を完全ガイドします！',
                    '仮想通貨初心者でも大丈夫💎\n一緒に順番に進めていきましょう！',
                    '準備はいいですか？\nそれでは始めましょう！'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/bittouroku/1.jpg',
                texts: [
                    'まずは取引所のアカウントを作成します。\n今回はBittradeを利用します。',
                    '次のリンクをタップして\nBittradeの公式サイトにアクセスして新規登録📱',
                    '紹介コードを入力するとBitcoinがもらえるよ👉「8SRkt」\n終わったら戻ってきてね📱\n次で細かく説明していくよ📱',
                    'リンク: https://m.bittrade.co.jp/ja-jp/register/?invite_code=8SRkt'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/bittouroku/2.jpg',
                texts: [
                    'メールアドレスとパスワードを入力します。\nパスワードは8〜20文字で大小英数字を含む必要があります！',
                    '「クリックして確認しよう」をタップ✨'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/bittouroku/3.jpg',
                texts: [
                    'スライドしてパズルを完成させましょう☝️人間だという証明だね⭐️'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/bittouroku/4.jpg',
                texts: [
                    '登録したメールアドレスに\n認証コードが送信されました📧',
                    'メールをチェックして\n6桁の数字を入力してください。',
                    '届かない場合は迷惑メールフォルダも\n確認してくださいね！'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/bittouroku/6.jpg',
                texts: [
                    'ログイン出来ると本人確認へ進めます✨',
                    '時間がない人は後でやってもいいよ✨'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/bittouroku/5.jpg',
                texts: [
                    '上部にオススメマークが表示されていますね。',
                    'かんたん本人確認ができます！タップしてみましょう！'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/touroku/7.jpg',
                texts: [
                    '国籍や氏名などの基本情報を入力します。\n本人確認書類と同じ情報を正確に入力してください。',
                    '入力が完了したら「次へ」をタップして\n審査を待ちましょう。通常1〜3営業日で完了です。'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/bittouroku/8.jpg',
                texts: [
                    'トップ画面の右上のメニューを押して見て',
                    'そうすると…。'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/bittouroku/9.jpg',
                texts: [
                    'アプリがダウンロードできるよ📱'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/bittouroku/10.jpg',
                texts: [
                    'iPhoneアプリか、Androidアプリか、お使いのスマートフォンに合わせて入れてみてね📱',
                    '次はアプリの画面で説明していくよ📱'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/nyuukin/1.jpg',
                texts: [
                    'アプリを開いてログインしたよ！💖',
                    '本人確認が完了したら入金しましょう💰\n「入金」ボタンをタップします。',
                    '表示された専用口座に\n銀行振込で入金してください。'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/nyuukin/2.jpg',
                texts: [
                    '振込先の口座情報が表示されます。\n必ずこの口座に入金してください！',
                    '⚠️重要⚠️\nクイック入金やコンビニ入金は\n1週間の出金制限がかかるのでNGです。',
                    '銀行振込なら制限なしで\n着金確認後、すぐに取引できます🏦'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/buy/1.jpg',
                texts: [
                    '入金が完了したら仮想通貨を購入しましょう！\n手数料が安いXRPがオススメです💎',
                    '画面下部の「取引所」をタップして\n取引画面に移動します。'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/buy/2.jpg',
                texts: [
                    '上部の「BTC/JPY」をタップすると\n通貨選択画面が開きます。'
                ]
            },
            {
                character: 'zenta',
                screenshot: 'images/buy/3.jpg',
                texts: [
                    '検索窓に「XRP」と入力して\nXRPを選択しましょう🔍'
                ]
            },
            {
                character: 'ryoko',
                screenshot: 'images/buy/5.jpg',
                texts: [
                    'XRP購入画面です！\n「成行」注文で簡単に購入できます。',
                    'ゲージを動かして購入枚数を決めて\n「XRPを買う」ボタンをタップ！',
                    '🎉おめでとうございます！\n仮想通貨の購入に成功しました✨',
                    '次は送金に挑戦！💫'
                ]
            }
        ];
        
        this.preloadImages();
    }
    
    // 画像プリロード
    preloadImages() {
        console.log('🖼️ 第1話画像プリロード開始');
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
    
    // 各話固有の実装
    nextText() {
        const currentScenario = this.scenarios[this.currentScene];
        if (this.currentTextIndex >= currentScenario.texts.length - 1) {
            this.nextScene();
        } else {
            this.currentTextIndex++;
            this.displayText(currentScenario.texts[this.currentTextIndex]);
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
        }
        
        this.isTyping = false;
        if (tapIndicator) {
            tapIndicator.style.opacity = '1';
        }
    }
    
    // リンク処理（BitTrade対応版）
    processTextWithLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
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
                        this.returnDetectionActive = true;
                        window.location.href = url;
                    } else {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                    
                    this.playKobanSound();
                }
            });
        });
    }
    
    startStory() {
        console.log('🚀 第1話 BitTradeストーリー開始');
        this.loadScene();
    }
    
    endStory() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        const bubbleText = document.getElementById('bubbleText');
        if (bubbleText) {
            bubbleText.innerHTML = 'BitTradeでのXRP購入ガイドは以上です。<br>ありがとうございました！✨<br><br>次はMEXCへの登録ですね🚀';
        }
        
        setTimeout(() => {
            if (confirm('第1話が完了しました。\n第2話（MEXC登録編）に移動しますか？')) {
                this.destroy();
                window.location.href = '../2/index.html';
            } else {
                if (confirm('購入ガイド一覧に戻りますか？')) {
                    window.location.href = '../index.html';
                }
            }
        }, 3000);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 第1話 DOM読み込み完了');
    setTimeout(() => {
        console.log('🎬 第1話 サウンドノベル開始準備');
        window.soundNovelBase = new RyoCoinSoundNovel();
    }, 500);
});

console.log(`
🎭 第1話: BitTrade編
📖 シナリオ: BitTrade口座開設からXRP購入まで
🎵 音声: oshiete.mp3 専用ループシステム
🪙 効果音: koban.mp3 システム
🔗 BitTradeリンク同一タブ対応
💖 ページ復帰BGM自動再開機能

✨ 特徴:
- シナリオデータのみに特化
- 共通機能は基盤システムに委譲
- BitTrade専用リンク処理
- 第2話への自動誘導
`);
