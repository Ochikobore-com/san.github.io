// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // ハンバーガーメニューの機能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // ハンバーガーメニューのクリックイベント
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // ナビゲーションリンクのクリックでメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // スムーススクロール機能
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ナビゲーションバーのスクロール効果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;

        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // アクティブなナビゲーションリンクの設定
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    });

    // 要素が画面に入ったときのアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を設定
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // スキルアイテムのホバー効果
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // プロジェクトカードのホバー効果
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // お問い合わせフォームの処理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const subject = contactForm.querySelectorAll('input[type="text"]')[1].value;
            const message = contactForm.querySelector('textarea').value;
            
            // 簡単なバリデーション
            if (!name || !email || !subject || !message) {
                showNotification('すべてのフィールドを入力してください。', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('有効なメールアドレスを入力してください。', 'error');
                return;
            }
            
            // 送信成功のシミュレーション
            showNotification('メッセージが送信されました。ありがとうございます！', 'success');
            contactForm.reset();
        });
    }

    // メール形式の検証
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 通知メッセージの表示
    function showNotification(message, type) {
        // 既存の通知があれば削除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(notification);
        
        // アニメーションで表示
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒後に自動で削除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // タイピングアニメーション効果
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ページ読み込み時のウェルカムアニメーション
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }

    // ページトップへ戻るボタン
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // スクロールボタンの表示/非表示
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'scale(1)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'scale(0)';
        }
    });

    // パフォーマンス最適化：スクロールイベントのスロットリング
    let ticking = false;
    
    function updateOnScroll() {
        // ここにスクロール時の処理を追加
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    // ダークモード切り替え機能（オプション）
    function initDarkModeToggle() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.style.cssText = `
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #374151;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(darkModeToggle);
        
        // ダークモードの状態を確認
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // ダークモード切り替えを初期化（コメントアウト解除で使用可能）
    // initDarkModeToggle();

    // カウンターアニメーション
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = counter.textContent.replace(/\d+/, target);
                    clearInterval(timer);
                } else {
                    counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
                }
            }, 20);
        });
    }

    // 統計セクションが表示されたときにカウンターアニメーションを実行
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Bento UI Works フィルター機能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    // フィルターボタンのクリックイベント
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // アクティブなボタンのクラスを更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // カードのフィルタリング
            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });

    // Works セクションのアニメーション
    const worksObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.work-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
                    }, index * 50);
                });
            }
        });
    }, { threshold: 0.2 });

    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
        worksObserver.observe(bentoGrid);
    }

    // ワークカードのパララックス効果
    workCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 10;
            const rotateY = deltaX * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
    });

    // 動的カードシャッフル（オプション機能）
    function shuffleBentoCards() {
        const bentoGrid = document.querySelector('.bento-grid');
        const cards = Array.from(bentoGrid.children);
        
        // Fisher-Yates シャッフルアルゴリズム
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        // カードを再配置
        cards.forEach(card => {
            bentoGrid.appendChild(card);
        });
    }

    // シャッフルボタンの作成（オプション）
    function createShuffleButton() {
        const shuffleBtn = document.createElement('button');
        shuffleBtn.innerHTML = '<i class="fas fa-random"></i> シャッフル';
        shuffleBtn.className = 'shuffle-btn';
        shuffleBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 0.5rem 1rem;
            background: rgba(37, 99, 235, 0.9);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        const worksSection = document.querySelector('.works-section');
        worksSection.style.position = 'relative';
        worksSection.appendChild(shuffleBtn);
        
        shuffleBtn.addEventListener('click', () => {
            shuffleBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                shuffleBentoCards();
                shuffleBtn.style.transform = 'scale(1)';
            }, 150);
        });
        
        shuffleBtn.addEventListener('mouseenter', () => {
            shuffleBtn.style.background = 'rgba(37, 99, 235, 1)';
            shuffleBtn.style.transform = 'translateY(-2px)';
        });
        
        shuffleBtn.addEventListener('mouseleave', () => {
            shuffleBtn.style.background = 'rgba(37, 99, 235, 0.9)';
            shuffleBtn.style.transform = 'translateY(0)';
        });
    }

    // シャッフルボタンを有効にする（コメントアウト解除で使用可能）
    // createShuffleButton();

    // ワークカードのクリックでモーダル表示（今後の拡張用）
    workCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // リンククリックでない場合のみモーダルを開く
            if (!e.target.closest('.work-link')) {
                const title = this.querySelector('h3').textContent;
                const description = this.querySelector('p').textContent;
                
                // 簡単な詳細表示（今後モーダルに拡張可能）
                console.log(`Project: ${title}`, `Description: ${description}`);
                
                // カード選択時の視覚的フィードバック
                this.style.boxShadow = '0 30px 60px rgba(37, 99, 235, 0.3)';
                setTimeout(() => {
                    this.style.boxShadow = '';
                }, 300);
            }
        });
    });

    // スクロール時のワークカード視差効果
    function handleWorksParallax() {
        if (window.innerWidth > 768) { // デスクトップのみ
            const scrolled = window.pageYOffset;
            const worksSection = document.querySelector('.works-section');
            
            if (worksSection) {
                const rect = worksSection.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isInView) {
                    workCards.forEach((card, index) => {
                        const speed = 0.1 + (index % 3) * 0.05; // カードごとに微妙に異なる速度
                        const yPos = scrolled * speed;
                        card.style.transform = `translateY(${yPos}px)`;
                    });
                }
            }
        }
    }

    // スクロールイベントにパララックス効果を追加
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                handleWorksParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });

    // レスポンシブ対応でパララックスをリセット
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            workCards.forEach(card => {
                card.style.transform = '';
            });
        }
    });
});

// CSSアニメーション用のスタイルを追加
const additionalStyles = `
    <style>
        .animate {
            animation: slideInUp 0.8s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .dark-mode {
            background: #1a1a1a;
            color: white;
        }
        
        .dark-mode .navbar {
            background: rgba(26, 26, 26, 0.95);
        }
        
        .dark-mode .nav-link {
            color: white;
        }
        
        .scroll-top-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
        
        .dark-mode-toggle:hover {
            transform: translateY(-50%) scale(1.1);
            background: #4b5563;
        }
        
        .skill-item {
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        
        .project-card {
            transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);