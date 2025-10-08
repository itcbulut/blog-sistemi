// Blog verilerini JSON dosyasından al
async function getBlogPosts() {
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error('JSON dosyası yüklenemedi');
        }
        const posts = await response.json();
        console.log('JSON dosyasından yazılar yüklendi:', posts.length, 'yazı');
        return posts;
    } catch (error) {
        console.error('Blog verileri yüklenirken hata:', error);
        return [];
    }
}

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

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Blog sistemi başlatıldı');
});
