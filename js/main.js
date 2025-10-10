lucide.createIcons();

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.documentElement.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
});

function updateThemeIcon() {
    // SADECE AY SİMGESİ
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    themeIcon.innerHTML = moonIcon;
    lucide.createIcons();
}

function scrollToBlogs() {
    document.getElementById('blog-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

const blogList = document.getElementById('blog-list');
const categoryFilter = document.getElementById('category-filter');
const noPostsMessage = document.getElementById('no-posts-message');
const noFilterResults = document.getElementById('no-filter-results');

const totalPostsEl = document.getElementById('total-posts');
const totalCategoriesEl = document.getElementById('total-categories');
const totalAuthorsEl = document.getElementById('total-authors');

// Sabit blog yazıları - JSON dosyası yerine
const blogPosts = [
    {
        "id": "1",
        "title": "San'at Şiiri Hakkındaki Düşüncelerim",
        "content": "Bu yazıda Sanat şiiri ile ilgili düşüncelerimi anlatacağım. Şiir üzerinde çok düşünülmüş ve uğraşılmış. Şair Anadolu'yu ve Batı'yı yoğun olarak karşılaştırıyor ve üzerinde durarak çeşitli örnekler veriyor. Beni en çok etkileyen bölüm son dörtlük oldu. Bu dörtlükde şair Batı sanatını bilmediğini ve sadece Anadolu sanatının gerçek olduğuna değiniyor. Kendi vatanın sanatını çok önemli buluyor ve onu savunuyor. Ayrıca şiirde doğadan, yazı sanatından, ses sanatlarından bahsedilip birbirleri ile kıyaslanıyor. Şair Batı sanatının kültürünü değersiz ve sıkıcı buluyor. Ek olarak şair şiirde birçok söz sanatı kullanmış. Şiirde geçen söz sanatlarından bazıları benzetme, karşılaştırma.\n\nŞair Batı sanatının orkestrasını da karmaşık ve gürültülü buluyor. Bizim vatanımızın acı çekenlerinin seslerini dinlemeyi onun yerine koyuyor. Bu arada şair Batı sanatını hiç sevmiyor ve ben buna katılmıyorum. Bence herkes her türden sanatla ilgilenmelidir. Kimse sanatdan ve sanat dallarından koparılmamalıdır. İnsanlar orkestraya gitmeli, heykelleri incelemeli, bale izlemelidir. Şair vatanına sadık ve kültürlü biri.\n\nŞair başkalarının bahçesinde sadece onlar için çiçekler açtığını, onların yollarının yalın ve sade olduğundan bahsediyor. Bizim ülkemizin daha renkli ve canlı olduğu kasdediliyor. Diğer dörtlük ve bölümlerde Anadolu kültür ve sanatının daha çekici ve iç açıcı olduğundan bahsediliyor.",
        "author": "Bulut",
        "category": "sanat",
        "date": "2025-10-07T19:14:00.000Z"
    }
];

function showErrorState() {
    blogList.innerHTML = `
        <div class="empty-state">
            <div class="empty-content">
                <i data-lucide="alert-triangle" class="empty-icon"></i>
                <h3>Blog yazıları yüklenemedi</h3>
                <p>Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    <i data-lucide="refresh-cw"></i>
                    Sayfayı Yenile
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', async function() {
    await initializeBlog();
    setupEventListeners();
});

async function initializeBlog() {
    // JSON dosyası yerine sabit blog yazılarını kullan
    if (blogPosts && blogPosts.length > 0) {
        initializeStats(blogPosts);
        displayBlogPosts(blogPosts);
        updateEmptyStates(blogPosts);
    } else {
        showErrorState();
    }
}

function initializeStats(posts) {
    const totalPosts = posts.length;
    const categories = [...new Set(posts.map(post => post.category))];
    const totalCategories = categories.length;
    const authors = [...new Set(posts.map(post => post.author))];
    const totalAuthors = authors.length;
    
    animateCounter(totalPostsEl, totalPosts);
    animateCounter(totalCategoriesEl, totalCategories);
    animateCounter(totalAuthorsEl, totalAuthors);
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, 16);
}

function displayBlogPosts(posts) {
    if (!posts || posts.length === 0) {
        blogList.innerHTML = '';
        noPostsMessage.style.display = 'block';
        return;
    }

    const postsHTML = posts.map((post, index) => `
        <article class="post-card" data-category="${post.category}" style="animation-delay: ${index * 0.1}s">
            <div class="post-image-container">
                <img src="${getPostImage(post.category)}" alt="${post.title}" class="post-image" loading="lazy">
                <div class="post-badge">${getCategoryIcon(post.category)} ${formatCategory(post.category)}</div>
            </div>
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-author">
                        <i data-lucide="user"></i>
                        ${post.author}
                    </span>
                    <span class="post-date">
                        <i data-lucide="calendar"></i>
                        ${formatDate(post.date)}
                    </span>
                </div>
                <p class="post-excerpt">${getExcerpt(post.content)}</p>
                <div class="post-actions">
                    <div class="post-stats">
                        <span class="post-stat">
                            <i data-lucide="clock"></i>
                            ${calculateReadTime(post.content)} dk
                        </span>
                    </div>
                    <a href="blog-detay.html?id=${post.id}" class="btn btn-primary btn-sm">
                        <i data-lucide="arrow-right"></i>
                        Devamını Oku
                    </a>
                </div>
            </div>
        </article>
    `).join('');

    blogList.innerHTML = postsHTML;
    lucide.createIcons();
    
    const cards = blogList.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
}

function getPostImage(category) {
    const categoryImages = {
        'teknoloji': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop',
        'yazılım': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
        'tasarım': 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=300&fit=crop',
        'kişisel': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=300&fit=crop',
        'yaşam': 'https://images.unsplash.com/photo-1569163139394-de44cb54d0c1?w=500&h=300&fit=crop',
        'eğitim': 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=500&h=300&fit=crop',
        'seyahat': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop',
        'sanat': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=300&fit=crop'
    };
    return categoryImages[category] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop';
}

function getCategoryIcon(category) {
    const icons = {
        'teknoloji': '💻',
        'yazılım': '🔧',
        'tasarım': '🎨',
        'kişisel': '👤',
        'yaşam': '🌱',
        'eğitim': '📚',
        'seyahat': '✈️',
        'sanat': '🎭'
    };
    return icons[category] || '📄';
}

function formatCategory(category) {
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

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return 'Tarih belirtilmemiş';
    }
}

function getExcerpt(content) {
    const plainText = content.replace(/\n/g, ' ');
    return plainText.substring(0, 150) + '...';
}

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime < 1 ? 1 : readTime;
}

function setupEventListeners() {
    categoryFilter.addEventListener('change', filterBlogPosts);
}

function filterBlogPosts() {
    const selectedCategory = categoryFilter.value;
    const filteredPosts = selectedCategory === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === selectedCategory);
    
    displayBlogPosts(filteredPosts);
    updateEmptyStates(filteredPosts);
}

function updateEmptyStates(posts) {
    const hasPosts = posts && posts.length > 0;
    const isFiltered = categoryFilter.value !== 'all';
    
    noPostsMessage.style.display = (!hasPosts && !isFiltered) ? 'block' : 'none';
    noFilterResults.style.display = (!hasPosts && isFiltered) ? 'block' : 'none';
    
    if (hasPosts) {
        noPostsMessage.style.display = 'none';
        noFilterResults.style.display = 'none';
    }
}

function resetFilter() {
    categoryFilter.value = 'all';
    displayBlogPosts(blogPosts);
    updateEmptyStates(blogPosts);
}
