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

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function displayBlogPost() {
    const postId = getUrlParameter('id');
    const blogDetail = document.getElementById('blog-detail');
    
    if (!postId) {
        blogDetail.innerHTML = '<div class="empty-state"><div class="empty-content"><h3>Geçersiz blog yazısı</h3><p>Lütfen ana sayfadan bir yazı seçin.</p><a href="index.html" class="btn btn-primary">Ana Sayfaya Dön</a></div></div>';
        return;
    }
    
    try {
        const post = blogPosts.find(p => p.id == postId);
        
        if (!post) {
            blogDetail.innerHTML = '<div class="empty-state"><div class="empty-content"><h3>Blog yazısı bulunamadı</h3><p>İstediğiniz yazı mevcut değil.</p><a href="index.html" class="btn btn-primary">Ana Sayfaya Dön</a></div></div>';
            return;
        }
        
        blogDetail.innerHTML = `
            <div class="blog-content">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span class="post-author">
                        <i data-lucide="user"></i>
                        Yazar: ${post.author}
                    </span>
                    <span class="post-date">
                        <i data-lucide="calendar"></i>
                        ${new Date(post.date).toLocaleDateString('tr-TR')}
                    </span>
                    <span class="post-category">
                        Kategori: ${formatCategory(post.category)}
                    </span>
                </div>
                <div class="blog-text">
                    ${post.content.split('\n').map(paragraph => paragraph.trim() ? `<p>${paragraph}</p>` : '').join('')}
                </div>
                <div style="margin-top: 3rem; text-align: center;">
                    <a href="index.html" class="btn btn-primary">
                        <i data-lucide="arrow-left"></i>
                        Tüm Yazılara Dön
                    </a>
                </div>
            </div>
        `;
        
        document.title = `${post.title} - BlogSitem`;
    } catch (error) {
        blogDetail.innerHTML = '<div class="empty-state"><div class="empty-content"><h3>Yazı yüklenirken hata oluştu</h3><p>Lütfen daha sonra tekrar deneyin.</p><a href="index.html" class="btn btn-primary">Ana Sayfaya Dön</a></div></div>';
    }
    
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    displayBlogPost();
});
