// Kategori ismini formatla (büyük harfle başlat)
function formatCategory(category) {
    if (!category) return '';
    
    const categoryMap = {
        'teknoloji': 'Teknoloji',
        'yazılım': 'Yazılım',
        'tasarım': 'Tasarım',
        'kişisel': 'Kişisel',
        'yaşam': 'Yaşam',
        'eğitim': 'Eğitim',
        'seyahat': 'Seyahat',
        'sanat': 'Sanat'
    };
    
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Blog verilerini localStorage'dan al
function getBlogPosts() {
    try {
        const posts = localStorage.getItem('blogPosts');
        return posts ? JSON.parse(posts) : [];
    } catch (error) {
        console.error('Blog verileri yüklenirken hata:', error);
        return [];
    }
}

// İstatistikleri güncelle
function updateStats() {
    const posts = getBlogPosts();
    const totalPosts = posts.length;
    
    // Kategorileri say (formatlanmış)
    const categories = [...new Set(posts.map(post => post.category))];
    const totalCategories = categories.length;
    
    // Son yazı tarihi
    const latestPost = posts.length > 0 ? 
        new Date(posts[0].date).toLocaleDateString('tr-TR') : '-';
    
    // İstatistikleri göster
    document.getElementById('total-posts').textContent = totalPosts;
    document.getElementById('total-categories').textContent = totalCategories;
    document.getElementById('latest-post').textContent = latestPost;
}

// Blog yazılarını listele
function displayBlogPosts(filterCategory = 'all') {
    const posts = getBlogPosts();
    const blogList = document.getElementById('blog-list');
    const noPostsMessage = document.getElementById('no-posts-message');
    const noFilterResults = document.getElementById('no-filter-results');
    
    // Mesajları gizle
    noPostsMessage.style.display = 'none';
    noFilterResults.style.display = 'none';
    
    if (posts.length === 0) {
        blogList.innerHTML = '';
        noPostsMessage.style.display = 'block';
        return;
    }
    
    // Filtreleme
    const filteredPosts = filterCategory === 'all' 
        ? posts 
        : posts.filter(post => post.category === filterCategory);
    
    if (filteredPosts.length === 0) {
        blogList.innerHTML = '';
        noFilterResults.style.display = 'block';
        return;
    }
    
    blogList.innerHTML = filteredPosts.map((post, index) => `
        <div class="post-card" style="animation-delay: ${index * 0.1}s">
            <div class="post-image" style="background: var(--gradient); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">
                📝
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-author">👤 ${post.author}</span>
                    <span class="post-date">📅 ${new Date(post.date).toLocaleDateString('tr-TR')}</span>
                    <span class="post-category">${formatCategory(post.category)}</span>
                </div>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                <a href="blog-detay.html?id=${post.id}" class="btn">
                    Devamını Oku
                    <span>→</span>
                </a>
            </div>
        </div>
    `).join('');
    
    // Kartlara animasyon ekle
    const cards = blogList.querySelectorAll('.post-card');
    cards.forEach(card => {
        card.style.animation = 'fadeInUp 0.6s ease-out both';
    });
}

// Filtre sıfırla
function resetFilter() {
    document.getElementById('category-filter').value = 'all';
    displayBlogPosts();
}

// Sayfa yüklendiğinde blog yazılarını göster
document.addEventListener('DOMContentLoaded', function() {
    // İstatistikleri güncelle
    updateStats();
    
    // Yazıları göster
    displayBlogPosts();
    
    // Kategori filtreleme
    document.getElementById('category-filter').addEventListener('change', function() {
        displayBlogPosts(this.value);
    });
    
    // Scroll animasyonları
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Elementleri gözle
    document.querySelectorAll('.stat-card, .post-card').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});
