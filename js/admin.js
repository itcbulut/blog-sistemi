// Yeni blog yazısı ID'si oluştur
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Blog verilerini al
function getBlogPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

// Blog verilerini kaydet
function saveBlogPosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
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

// Kategoriyi kaydederken küçük harfe çevir
function normalizeCategory(category) {
    return category.toLowerCase();
}

// Seçili kategoriyi al
function getSelectedCategory() {
    const selectedRadio = document.querySelector('input[name="category"]:checked');
    return selectedRadio ? selectedRadio.value : 'teknoloji';
}

// Kategoriyi seç
function setSelectedCategory(category) {
    const radio = document.querySelector(`input[value="${category}"]`);
    if (radio) {
        radio.checked = true;
    }
}

// Modern bildirim göster
function showMessage(message, type = 'success', duration = 4000) {
    // Mevcut bildirimleri temizle
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
    
    // Bildirimi göster
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Otomatik kapatma
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
    document.getElementById('total-posts-count').textContent = totalPosts;
    document.getElementById('total-categories-count').textContent = totalCategories;
    document.getElementById('latest-post-date').textContent = latestPost;
}

// Düzenleme modu değişkeni
let isEditMode = false;
let currentEditId = null;

// Yeni yazı ekleme işleyicisi
function handleNewPostSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const category = normalizeCategory(getSelectedCategory());
    
    // Boş alan kontrolü
    if (!title || !content || !author) {
        showMessage('Lütfen tüm zorunlu alanları doldurun!', 'error', 3000);
        return;
    }
    
    // Başlık uzunluğu kontrolü
    if (title.length < 5) {
        showMessage('Başlık en az 5 karakter olmalıdır!', 'error', 3000);
        return;
    }
    
    // İçerik uzunluğu kontrolü
    if (content.length < 20) {
        showMessage('İçerik en az 20 karakter olmalıdır!', 'error', 3000);
        return;
    }
    
    const newPost = {
        id: generateId(),
        title,
        content,
        author,
        category,
        date: new Date().toISOString()
    };
    
    const posts = getBlogPosts();
    posts.unshift(newPost);
    saveBlogPosts(posts);
    
    this.reset();
    // Kategoriyi varsayılana sıfırla
    setSelectedCategory('teknoloji');
    displayAdminPosts();
    updateStats();
    showMessage('Blog yazınız başarıyla yayınlandı! 🎉', 'success', 3000);
}

// Düzenleme submit işleyicisi
function handleEditSubmit(e) {
    e.preventDefault();
    
    if (!currentEditId) {
        showMessage('Düzenlenecek yazı bulunamadı!', 'error', 3000);
        return;
    }
    
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const category = normalizeCategory(getSelectedCategory());
    
    // Boş alan kontrolü
    if (!title || !content || !author) {
        showMessage('Lütfen tüm zorunlu alanları doldurun!', 'error', 3000);
        return;
    }
    
    // Başlık uzunluğu kontrolü
    if (title.length < 5) {
        showMessage('Başlık en az 5 karakter olmalıdır!', 'error', 3000);
        return;
    }
    
    // İçerik uzunluğu kontrolü
    if (content.length < 20) {
        showMessage('İçerik en az 20 karakter olmalıdır!', 'error', 3000);
        return;
    }
    
    const posts = getBlogPosts();
    const postIndex = posts.findIndex(p => p.id === currentEditId);
    
    if (postIndex === -1) {
        showMessage('Düzenlenecek yazı bulunamadı!', 'error', 3000);
        return;
    }
    
    // Yazıyı güncelle (ID ve tarihi koru)
    posts[postIndex] = {
        ...posts[postIndex],
        title,
        content,
        author,
        category
    };
    
    saveBlogPosts(posts);
    displayAdminPosts();
    updateStats();
    showMessage('Yazı başarıyla güncellendi! ✨', 'success', 3000);
    
    // Düzenleme modundan çık
    cancelEdit();
}

// Düzenleme iptal
function cancelEdit() {
    isEditMode = false;
    currentEditId = null;
    const form = document.getElementById('blog-form');
    form.reset();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Yayınla';
    form.classList.remove('edit-mode');
    
    const cancelBtn = document.getElementById('edit-cancel-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
    
    // Kategoriyi varsayılana sıfırla
    setSelectedCategory('teknoloji');
    
    // Orijinal submit olayını geri yükle
    form.onsubmit = handleNewPostSubmit;
}

// Form gönderimini başlat
function initializeForm() {
    const form = document.getElementById('blog-form');
    form.onsubmit = handleNewPostSubmit;
    
    // Form alanlarına otomatik büyütme ekle
    const textarea = document.getElementById('post-content');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
}

// Admin panelindeki yazıları listele
function displayAdminPosts() {
    const posts = getBlogPosts();
    const adminPostsList = document.getElementById('admin-posts-list');
    
    if (posts.length === 0) {
        adminPostsList.innerHTML = `
            <div class="empty-state">
                <h3>📝 Henüz Hiç Yazı Yok</h3>
                <p>İlk blog yazınızı ekleyerek başlayın! Aşağıdaki formu kullanarak kolayca yeni yazı oluşturabilirsiniz.</p>
                <div style="margin-top: 1.5rem;">
                    <button onclick="document.getElementById('post-title').focus()" class="btn btn-primary">
                        🚀 İlk Yazıyı Oluştur
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    adminPostsList.innerHTML = posts.map((post, index) => `
        <div class="admin-post-item" style="animation-delay: ${index * 0.1}s">
            <div class="admin-post-header">
                <h4 class="admin-post-title">${post.title}</h4>
                <div class="admin-post-actions">
                    <button class="btn btn-sm" onclick="editPost('${post.id}')" title="Yazıyı Düzenle">
                        ✏️ Düzenle
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePost('${post.id}')" title="Yazıyı Sil">
                        🗑️ Sil
                    </button>
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
    
    // Kartlara animasyon ekle
    const cards = adminPostsList.querySelectorAll('.admin-post-item');
    cards.forEach(card => {
        card.style.animation = 'fadeInUp 0.6s ease-out both';
    });
}

// Yazı silme işlemi
function deletePost(id) {
    const posts = getBlogPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) return;
    
    // Modern onay dialog'u
    const confirmation = confirm(`"${post.title}" başlıklı yazıyı silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`);
    
    if (confirmation) {
        const filteredPosts = posts.filter(post => post.id !== id);
        saveBlogPosts(filteredPosts);
        displayAdminPosts();
        updateStats();
        showMessage('Yazı başarıyla silindi! 🗑️', 'success', 3000);
        
        // Eğer silinen yazı düzenleniyorsa, formu sıfırla
        if (currentEditId === id) {
            cancelEdit();
        }
    }
}

// Yazı düzenleme işlemi
function editPost(id) {
    const posts = getBlogPosts();
    const post = posts.find(p => p.id === id);
    
    if (post) {
        isEditMode = true;
        currentEditId = id;
        
        // Form alanlarını doldur
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-author').value = post.author;
        setSelectedCategory(post.category);
        
        const form = document.getElementById('blog-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Eski iptal butonunu temizle
        const existingCancelBtn = document.getElementById('edit-cancel-btn');
        if (existingCancelBtn) {
            existingCancelBtn.remove();
        }
        
        // İptal butonu ekle
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'edit-cancel-btn';
        cancelBtn.className = 'btn btn-danger';
        cancelBtn.textContent = '❌ Düzenlemeyi İptal Et';
        cancelBtn.style.marginTop = '10px';
        cancelBtn.onclick = cancelEdit;
        
        form.appendChild(cancelBtn);
        submitBtn.textContent = '💾 Yazıyı Güncelle';
        form.classList.add('edit-mode');
        
        // Form submit olayını değiştir
        form.onsubmit = handleEditSubmit;
        
        // Başlığa focusla ve sayfayı forma kaydır
        document.getElementById('post-title').focus();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        showMessage(`"${post.title}" yazısını düzenliyorsunuz ✏️`, 'info', 2000);
    }
}

// Sayfa yüklendiğinde yazıları ve istatistikleri göster
document.addEventListener('DOMContentLoaded', function() {
    // Bildirim stillerini ekle
    if (!document.getElementById('admin-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-notification-styles';
        style.textContent = `
            /* Bildirim Stilleri */
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
            
            .notification.success {
                border-left-color: var(--success-color);
                background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            }
            
            .notification.error {
                border-left-color: var(--danger-color);
                background: linear-gradient(135deg, #fef2f2, #fee2e2);
            }
            
            .notification.warning {
                border-left-color: var(--warning-color);
                background: linear-gradient(135deg, #fffbeb, #fef3c7);
            }
            
            .notification.info {
                border-left-color: var(--primary-color);
                background: linear-gradient(135deg, #eff6ff, #dbeafe);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .notification-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .notification-message {
                font-weight: 600;
                color: var(--secondary-color);
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
                transition: color 0.2s ease;
                padding: 0.2rem;
                border-radius: 4px;
                flex-shrink: 0;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: var(--danger-color);
                background: rgba(239, 68, 68, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    initializeForm();
    displayAdminPosts();
    updateStats();
    
    // Sayfa yüklendiğinde hoş geldin mesajı göster
    setTimeout(() => {
        const posts = getBlogPosts();
        if (posts.length === 0) {
            showMessage('👋 Hoş geldiniz! İlk blog yazınızı oluşturmaya başlayın.', 'info', 4000);
        } else {
            showMessage(`🎉 Toplam ${posts.length} yazı yönetiliyor!`, 'success', 3000);
        }
    }, 1000);
});

// Global fonksiyonlar
window.deletePost = deletePost;
window.editPost = editPost;
window.cancelEdit = cancelEdit;
window.showMessage = showMessage;
