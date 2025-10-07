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

// URL'den ID parametresini al
function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Blog verilerini JSON dosyasından al
async function getBlogPosts() {
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error('JSON dosyası yüklenemedi');
        }
        return await response.json();
    } catch (error) {
        console.error('Blog verileri yüklenirken hata:', error);
        return [];
    }
}

// Blog yazısını göster
async function displayBlogPost() {
    const postId = getUrlParameter('id');
    const blogDetail = document.getElementById('blog-detail');
    
    if (!postId) {
        blogDetail.innerHTML = '<p>Geçersiz blog yazısı.</p>';
        return;
    }
    
    const posts = await getBlogPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        blogDetail.innerHTML = '<p>Blog yazısı bulunamadı.</p>';
        return;
    }
    
    blogDetail.innerHTML = `
        <div class="blog-content">
            <h1>${post.title}</h1>
            <div class="post-meta">
                <span class="post-author">👤 Yazar: ${post.author}</span>
                <span class="post-date">📅 ${new Date(post.date).toLocaleDateString('tr-TR')}</span>
                <span class="post-category">🏷️ Kategori: ${formatCategory(post.category)}</span>
            </div>
            <div class="blog-text">
                ${post.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
            <div style="margin-top: 3rem;">
                <a href="index.html" class="btn">← Tüm Yazılara Dön</a>
            </div>
        </div>
    `;
    
    // Sayfa başlığını güncelle
    document.title = `${post.title} - BlogSitem`;
}

// Sayfa yüklendiğinde blog yazısını göster
document.addEventListener('DOMContentLoaded', function() {
    displayBlogPost();
});
