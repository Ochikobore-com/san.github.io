// カルーセル機能とページナビゲーション
document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const carousel = document.getElementById('carouselContainer');
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const sidebarNavLinks = document.querySelectorAll('.nav-link');
    const navButtons = document.querySelectorAll('.nav-button');
    
    // カルーセル設定
    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 4000; // 4秒間隔で自動切り替え
    let isAutoPlaying = true;
    
    // 初期化
    initCarousel();
    initSidebarNavigation();
    initBottomNavigation();
    
    // カルーセル初期化
    function initCarousel() {
        // インディケーターを生成
        createIndicators();
        
        // 最初のスライドをアクティブに
        updateSlide(0);
        
        // イベントリスナーを設定
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // タッチ/スワイプ対応
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        if (carousel) {
            carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
            carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
            carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
            
            // マウスイベント（デスクトップ用）
            carousel.addEventListener('mousedown', handleMouseDown);
            carousel.addEventListener('mousemove', handleMouseMove);
            carousel.addEventListener('mouseup', handleMouseUp);
            carousel.addEventListener('mouseleave', handleMouseUp);
        }
        
        // 自動再生開始
        startAutoPlay();
        
        // ホバー時の自動再生停止
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
    }
    
    // インディケーター生成
    function createIndicators() {
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // スライド更新
    function updateSlide(index, direction = 'next') {
        if (!carouselTrack || slides.length === 0) return;
        
        // 範囲チェック
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentSlide = index;
        
        // スライドの表示/非表示
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        // インディケーター更新
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
        
        // トラック位置更新
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // ARIA属性更新
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== currentSlide);
        });
    }
    
    // 次のスライドに移動
    function nextSlide() {
        updateSlide(currentSlide + 1, 'next');
    }
    
    // 前のスライドに移動
    function prevSlide() {
        updateSlide(currentSlide - 1, 'prev');
    }
    
    // 指定スライドに移動
    function goToSlide(index) {
        updateSlide(index);
    }
    
    // 自動再生開始
    function startAutoPlay() {
        if (!isAutoPlaying) return;
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    // 自動再生停止
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // タッチイベント処理
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        stopAutoPlay();
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // 水平スワイプかどうかチェック
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault(); // 縦スクロールを防ぐ
        }
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const threshold = 50; // スワイプ判定の閾値
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide(); // 左スワイプで次へ
            } else {
                prevSlide(); // 右スワイプで前へ
            }
        }
        
        startAutoPlay();
    }
    
    // マウスイベント処理（デスクトップ用）
    function handleMouseDown(e) {
        startX = e.clientX;
        isDragging = true;
        stopAutoPlay();
        e.preventDefault();
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - e.clientX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoPlay();
    }
    
    // サイドバーナビゲーション初期化
    function initSidebarNavigation() {
        sidebarNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // アクティブ状態更新
                sidebarNavLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                // ページ切り替え
                const page = this.getAttribute('data-page');
                switchPage(page);
            });
        });
    }
    
    // ボトムナビゲーション初期化
    function initBottomNavigation() {
        navButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                updateActiveButton(this);
                const category = this.getAttribute('data-category');
                filterSlidesByCategory(category);
            });
            
            // キーボードナビゲーション
            button.addEventListener('keydown', function(e) {
                handleTabNavigation(e, index);
            });
        });
    }
    
    // ページ切り替え
    function switchPage(page) {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        // フェードアウト
        mainContent.style.opacity = '0.5';
        
        setTimeout(() => {
            switch(page) {
                case 'works':
                    showWorksPage();
                    break;
                case 'about':
                    showAboutPage();
                    break;
                case 'hobby':
                    showHobbyPage();
                    break;
                default:
                    showWorksPage();
            }
            
            // フェードイン
            mainContent.style.opacity = '1';
        }, 200);
    }
    
    // Worksページ表示
    function showWorksPage() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <div class="carousel-container" id="carouselContainer">
                <div class="carousel-track" id="carouselTrack">
                    ${generateSlidesHTML()}
                </div>
                <div class="carousel-nav">
                    <button class="carousel-prev" id="prevBtn" aria-label="前のスライド">←</button>
                    <div class="carousel-indicators" id="indicators"></div>
                    <button class="carousel-next" id="nextBtn" aria-label="次のスライド">→</button>
                </div>
            </div>
        `;
        
        // カルーセルを再初期化
        setTimeout(() => {
            location.reload(); // 簡易的にページリロードで再初期化
        }, 100);
    }
    
    // スライドHTML生成
    function generateSlidesHTML() {
        const slidesData = [
            { category: 'ux', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { category: 'ui', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { category: 'graphic', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { category: 'exhibition', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { category: 'ux', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { category: 'ui', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
        ];
        
        return slidesData.map((slide, index) => `
            <article class="carousel-slide ${index === 0 ? 'active' : ''}" data-category="${slide.category}">
                <div class="slide-content">
                    <div class="slide-image" style="background: ${slide.gradient};"></div>
                </div>
            </article>
        `).join('');
    }
    
    // Aboutページ表示
    function showAboutPage() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <div class="about-content">
                <h2>About Me</h2>
                <p>私はクリエイティブなデザイナーとして、UX/UI、グラフィックデザイン、展示デザインなど幅広い分野で活動しています。ユーザー中心のデザイン思考を大切にし、革新的で実用的なソリューションを提供することを目指しています。</p>
                <br>
                <p>デザインを通じて人々の生活をより良くし、意味のあるコミュニケーションを創造することが私の使命です。</p>
            </div>
        `;
    }
    
    // Hobbyページ表示
    function showHobbyPage() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <div class="hobby-content">
                <h2>My Hobbies</h2>
                <ul class="hobby-list">
                    <li><a href="#photography">Photography</a></li>
                    <li><a href="#music">Music Production</a></li>
                    <li><a href="#travel">Travel & Culture</a></li>
                    <li><a href="#reading">Reading & Learning</a></li>
                    <li><a href="#cooking">Cooking</a></li>
                </ul>
            </div>
        `;
    }
    
    // カテゴリーフィルタリング
    function filterSlidesByCategory(category) {
        const slides = document.querySelectorAll('.carousel-slide');
        let visibleSlides = [];
        
        slides.forEach(slide => {
            const slideCategory = slide.getAttribute('data-category');
            if (slideCategory === category || category === 'all') {
                visibleSlides.push(slide);
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
        
        // フィルタ後のスライドで最初のものをアクティブに
        if (visibleSlides.length > 0) {
            updateSlide(0);
        }
    }
    
    // ボタンのアクティブ状態更新
    function updateActiveButton(activeButton) {
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });
        
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
        activeButton.setAttribute('tabindex', '0');
    }
    
    // キーボードナビゲーション
    function handleTabNavigation(e, currentIndex) {
        let targetIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                targetIndex = currentIndex > 0 ? currentIndex - 1 : navButtons.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                targetIndex = currentIndex < navButtons.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                targetIndex = navButtons.length - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                navButtons[currentIndex].click();
                return;
            default:
                return;
        }
        
        const targetButton = navButtons[targetIndex];
        targetButton.focus();
        updateActiveButton(targetButton);
        const category = targetButton.getAttribute('data-category');
        filterSlidesByCategory(category);
    }
    
    // キーボードショートカット
    document.addEventListener('keydown', function(e) {
        // カルーセルのキーボード操作
        switch(e.key) {
            case 'ArrowLeft':
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    prevSlide();
                }
                break;
            case 'ArrowRight':
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    nextSlide();
                }
                break;
            case ' ':
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    // スペースキーで自動再生のトグル
                    if (isAutoPlaying) {
                        stopAutoPlay();
                        isAutoPlaying = false;
                    } else {
                        startAutoPlay();
                        isAutoPlaying = true;
                    }
                }
                break;
        }
    });
    
    // ページ離脱時の自動再生停止
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
        } else if (isAutoPlaying) {
            startAutoPlay();
        }
    });
});

// ユーティリティ関数
function preloadImages() {
    // 必要に応じて画像をプリロード
    const imageUrls = [
        // 画像URLのリスト
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// パフォーマンス最適化
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// リサイズイベントの最適化
const handleResize = debounce(() => {
    // リサイズ時の処理
    const carousel = document.getElementById('carouselContainer');
    if (carousel) {
        // 必要に応じてカルーセルの位置を調整
    }
}, 250);

window.addEventListener('resize', handleResize);