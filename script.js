// ボトムバーの切り替え機能
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-button');
    const sidebarNavLinks = document.querySelectorAll('.nav-link');
    const worksGrid = document.getElementById('worksGrid');
    
    // サイドバーナビゲーションのクリックイベント
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // aタグのデフォルト動作を防ぐ
            
            // すべてのサイドバーリンクからactiveクラスを削除
            sidebarNavLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // クリックされたリンクにactiveクラスを追加
            this.classList.add('active');
            
            // ページに応じてコンテンツを切り替え
            const page = this.getAttribute('data-page');
            switchPage(page);
        });
    });
    
    // 各ボトムナビボタンにクリックイベントを追加
    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            updateActiveButton(this);
            const category = this.getAttribute('data-category');
            filterWorks(category);
        });
        
        // キーボードナビゲーション対応
        button.addEventListener('keydown', function(e) {
            handleTabNavigation(e, index);
        });
    });
    
    // ARIA属性とアクティブ状態を更新する関数
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
    
    // タブナビゲーションのハンドリング
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
        
        // フォーカスを移動し、自動的にアクティブ状態に切り替え
        const targetButton = navButtons[targetIndex];
        targetButton.focus();
        updateActiveButton(targetButton);
        const category = targetButton.getAttribute('data-category');
        filterWorks(category);
        
        // フォーカス移動をクリックとして扱う
        targetButton.click();
    }
    
    // ページ切り替え機能
    function switchPage(page) {
        // アニメーション付きでコンテンツを切り替え
        worksGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            // ページに応じて異なるコンテンツを表示
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
            
            // フェードインアニメーション
            worksGrid.style.opacity = '1';
        }, 200);
    }
    
    // Worksページ表示
    function showWorksPage() {
        worksGrid.innerHTML = `
            <div class="work-item">
                <div class="work-image"></div>
            </div>
            <div class="work-item">
                <div class="work-image"></div>
            </div>
            <div class="work-item">
                <div class="work-image"></div>
            </div>
            <div class="work-item">
                <div class="work-image"></div>
            </div>
            <div class="work-item">
                <div class="work-image"></div>
            </div>
            <div class="work-item">
                <div class="work-image"></div>
            </div>
        `;
    }
    
    // Aboutページ表示
    function showAboutPage() {
        worksGrid.innerHTML = `
            <div class="about-content">
                <h2>About Me</h2>
                <p>私について紹介するページです。</p>
            </div>
        `;
    }
    
    // Hobbyページ表示
    function showHobbyPage() {
        worksGrid.innerHTML = `
            <div class="hobby-content">
                <h2>My Hobbies</h2>
                <ul class="hobby-list">
                    <li><a href="#photography">Photography</a></li>
                    <li><a href="#music">Music</a></li>
                    <li><a href="#travel">Travel</a></li>
                    <li><a href="#reading">Reading</a></li>
                </ul>
            </div>
        `;
    }
    
    // コンテンツフィルター機能
    function filterWorks(category) {
        const workItems = document.querySelectorAll('.work-item');
        
        // アニメーション付きでコンテンツを切り替え
        worksGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            // カテゴリに応じて異なるレイアウトやコンテンツを表示
            switch(category) {
                case 'ux':
                    showUXWorks();
                    break;
                case 'ui':
                    showUIWorks();
                    break;
                case 'graphic':
                    showGraphicWorks();
                    break;
                case 'exhibition':
                    showExhibitionWorks();
                    break;
            }
            
            // フェードインアニメーション
            worksGrid.style.opacity = '1';
        }, 200);
    }
    
    // すべての作品を表示
    function showAllWorks() {
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
            item.style.display = 'block';
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // モバイル作品を表示
    function showMobileWorks() {
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
            if (index % 3 === 0) {
                item.style.display = 'block';
                item.style.animationDelay = `${index * 0.1}s`;
            } else {
                item.style.display = 'none';
            }
        });
        // 追加のモバイル用コンテンツがあれば表示
        addMobileContent();
    }
    
    // ウェブ作品を表示
    function showWebWorks() {
        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
            if (index % 2 === 0) {
                item.style.display = 'block';
                item.style.animationDelay = `${index * 0.1}s`;
            } else {
                item.style.display = 'none';
            }
        });
        // 追加のウェブ用コンテンツがあれば表示
        addWebContent();
    }
    
    // モバイル用の追加コンテンツ
    function addMobileContent() {
        // 必要に応じてモバイル専用のコンテンツを動的に追加
    }
    
    // UX作品を表示
    function showUXWorks() {
        worksGrid.innerHTML = `
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
            </div>
        `;
    }
    
    // UI作品を表示
    function showUIWorks() {
        worksGrid.innerHTML = `
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #ff8a80 0%, #ffab91 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #81c784 0%, #aed581 100%);"></div>
            </div>
        `;
    }
    
    // グラフィック作品を表示
    function showGraphicWorks() {
        worksGrid.innerHTML = `
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #ffebbf 0%, #f0f2f0 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);"></div>
            </div>
        `;
    }
    
    // エキシビション作品を表示
    function showExhibitionWorks() {
        worksGrid.innerHTML = `
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);"></div>
            </div>
            <div class="work-item">
                <div class="work-image" style="background-image: linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%);"></div>
            </div>
        `;
    }
    
    // ウェブ用の追加コンテンツ
    function addWebContent() {
        // 必要に応じてウェブ専用のコンテンツを動的に追加
    }
    
    // サイドバーのクリック機能
    const sidebarIcon = document.querySelector('.sidebar-icon');
    if (sidebarIcon) {
        sidebarIcon.addEventListener('click', function() {
            // サイドバーの機能（戻る、メニューなど）
            // 例: 前のページに戻る、メニューを開くなど
            console.log('サイドバーがクリックされました');
        });
    }
    
    // スクロールトップ機能
    function scrollToTop() {
        worksGrid.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 初期表示
    filterWorks('ux');
});

// 追加のユーティリティ関数
function addWorkItem(imageUrl, title, category) {
    const worksGrid = document.getElementById('worksGrid');
    const workItem = document.createElement('div');
    workItem.className = 'work-item';
    workItem.setAttribute('data-category', category);
    
    workItem.innerHTML = `
        <div class="work-image" style="background-image: url('${imageUrl}');">
            <div class="work-title">${title}</div>
        </div>
    `;
    
    worksGrid.appendChild(workItem);
}

// ローディング効果
function showLoading() {
    const worksGrid = document.getElementById('worksGrid');
    worksGrid.innerHTML = '<div class="loading">読み込み中...</div>';
}

function hideLoading() {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}