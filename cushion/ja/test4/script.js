// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // スクロールアニメーション
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // スクロール時のアニメーション処理
    function checkFade() {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    // 初期チェック
    checkFade();
    
    // スクロール時のイベントリスナー
    window.addEventListener('scroll', checkFade);
    
    // FAQアコーディオン機能
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // 他の開いているFAQを閉じる
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // フォーム送信イベント
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // 通常はここでAPIなどを使ってデータを送信
            console.log('送信データ:', { name, email, message });
            
            // 送信成功メッセージ
            alert('お問い合わせありがとうございます！後ほどご連絡いたします。');
            
            // フォームをリセット
            contactForm.reset();
        });
    }
});

// ロボット検索対応のためのスキーママークアップ追加
function addStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'RYOコイン',
        'description': '使いやすさを重視した次世代Web3デジタル決済エコシステム',
        'url': 'https://example.com/',
        'logo': 'https://example.com/logo.png',
        'sameAs': [
            'https://twitter.com/ryocoin',
            'https://t.me/ryocoin',
            'https://discord.gg/ryocoin'
        ]
    });
    
    document.head.appendChild(script);
}

// サイトマップ生成用関数（実際の実装は別ファイルで行うことが多い）
function generateSitemap() {
    const pages = [
        'https://example.com/',
        'https://example.com/about',
        'https://example.com/ecosystem',
        'https://example.com/safety',
        'https://example.com/faq',
        'https://example.com/contact'
    ];
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    pages.forEach(page => {
        sitemap += `
        <url>
            <loc>${page}</loc>
            <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        `;
    });
    
    sitemap += '</urlset>';
    
    return sitemap;
}

// ページ読み込み完了時に構造化データを追加
window.onload = function() {
    addStructuredData();
};
