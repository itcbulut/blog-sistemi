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

// Modern bildirim göster
function showMessage(message, type = 'info', duration = 4000) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <span>×</span>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    return notification;
}

// İstatistikleri güncelle
async function updateStats() {
    const posts = await getBlogPosts();
    const totalPosts = posts.length;
    
    const categories = [...new Set(posts.map(post => post.category))];
    const totalCategories = categories.length;
    
    const latestPost = posts.length > 0 ? 
        new Date(posts[0].date).toLocaleDateString('tr-TR') : '-';
    
    document.getElementById('total-posts-count').textContent = totalPosts;
    document.getElementById('total-categories-count').textContent = totalCategories;
    document.getElementById('latest-post-date').textContent = latestPost;
}

// Admin panelindeki yazıları listele
async function displayAdminPosts() {
    const posts = await getBlogPosts();
    const adminPostsList = document.getElementById('admin-posts-list');
    
    if (posts.length === 0) {
        adminPostsList.innerHTML = `
            <div class="empty-state">
                <h3>📝 Henüz Hiç Yazı Yok</h3>
                <p>Blog yazıları data/blog-posts.json dosyasından yükleniyor.</p>
                <p>Yeni yazı eklemek için JSON dosyasını manuel olarak düzenleyin.</p>
            </div>
        `;
        return;
    }
    
    adminPostsList.innerHTML = posts.map((post, index) => `
        <div class="admin-post-item" style="animation-delay: ${index * 0.1}s">
            <div class="admin-post-header">
                <h4 class="admin-post-title">${post.title}</h4>
                <div class="admin-post-actions">
                    <span class="btn btn-sm" style="background: #6b7280; cursor: not-allowed;" title="JSON dosyası manuel düzenlenmeli">
                        📁 JSON'da Düzenle
                    </span>
                </div>
            </div>
            <div class="admin-post-meta">
                <span>👤 ${post.author}</span>
                <span>🏷️ ${formatCategory(post.category)}</span>
                <span>📅 ${new Date(post.date).toLocaleDateString('tr-TR')}</span>
            </div>
            <p class="admin-post-excerpt">${post.content.substring(0, 120)}${post.content.length > 120 ? '...' : ''}</p>
        </div>
    `).join('');
    
    const cards = adminPostsList.querySelectorAll('.admin-post-item');
    cards.forEach(card => {
        card.style.animation = 'fadeInUp 0.6s ease-out both';
    });
}

// Formu devre dışı bırak
function disableForm() {
    const form = document.getElementById('blog-form');
    const inputs = form.querySelectorAll('input, textarea, button, select');
    
    inputs.forEach(input => {
        input.disabled = true;
        if (input.tagName === 'BUTTON') {
            input.textContent = '⛔ JSON Dosyası Manuel Düzenlenmeli';
            input.style.background = '#6b7280';
            input.style.cursor = 'not-allowed';
        }
    });
    
    form.querySelector('h3').innerHTML += ' <small style="color: #ef4444;">(JSON Manuel Düzenleme)</small>';
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async function() {
    // Formu devre dışı bırak
    disableForm();
    
    // Bildirim stillerini ekle
    if (!document.getElementById('admin-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                padding: 1rem 1.5rem;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 10000;
                border-left: 4px solid;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification.success { border-left-color: var(--success-color); background: linear-gradient(135deg, #f0fdf4, #dcfce7); }
            .notification.error { border-left-color: var(--danger-color); background: linear-gradient(135deg, #fef2f2, #fee2e2); }
            .notification.warning { border-left-color: var(--warning-color); background: linear-gradient(135deg, #fffbeb, #fef3c7); }
            .notification.info { border-left-color: var(--primary-color); background: linear-gradient(135deg, #eff6ff, #dbeafe); }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .notification-icon { font-size: 1.2rem; flex-shrink: 0; }
            .notification-message { font-weight: 600; color: var(--secondary-color); line-height: 1.4; }
            .notification-close {
                background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;
                transition: color 0.2s ease; padding: 0.2rem; border-radius: 4px; flex-shrink: 0;
                width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
            }
            .notification-close:hover { color: var(--danger-color); background: rgba(239, 68, 68, 0.1); }
        `;
        document.head.appendChild(style);
    }
    
    // Verileri yükle
    await displayAdminPosts();
    await updateStats();
    
    // Bilgi mesajı göster
    setTimeout(() => {
        showMessage('📁 Blog verileri data/blog-posts.json dosyasından yükleniyor', 'info', 5000);
    }, 1000);
});
