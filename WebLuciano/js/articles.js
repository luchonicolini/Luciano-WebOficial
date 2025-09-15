// ===== ARTICLES.JS - JavaScript optimizado para la página de artículos =====

// Configuración
const CONFIG = {
    WORDS_PER_MINUTE: 200,
    LOADER_DELAY: 800,
    NOTIFICATION_DURATION: 4000,
    NAVBAR_BREAKPOINT: 768
};

// State management
const State = {
    isLoading: false,
    currentArticle: null
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initArticlePage();
});

// ===== FUNCIÓN PRINCIPAL DE INICIALIZACIÓN =====
function initArticlePage() {
    loadArticleContent();
    setupReadingProgress();
    setupMobileNavigation();
    setupSmoothScroll();
    setupHoverEffects();
}

// ===== CARGA DE CONTENIDO DEL ARTÍCULO =====
async function loadArticleContent() {
    const articleId = getArticleIdFromUrl();
    
    if (!articleId) {
        showArticleNotFound();
        return;
    }
    
    showLoader();
    
    try {
        const article = await fetchArticleById(articleId);
        
        if (!article) {
            showArticleNotFound();
            return;
        }
        
        State.currentArticle = article;
        
        // Renderizar artículo con delay para mostrar animación
        setTimeout(() => {
            renderArticle(article);
            calculateReadingTime();
            // USAR HIGHLIGHT.JS EN LUGAR DE FUNCIÓN PERSONALIZADA
            applyHighlightJS();
            hideLoader();
        }, CONFIG.LOADER_DELAY);
        
    } catch (error) {
        console.error('Error cargando artículo:', error);
        showError('No se pudo cargar el artículo. Verifica tu conexión a internet.');
    }
}

// ===== UTILIDADES =====
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchArticleById(articleId) {
    // LÍNEA CORRECTA
    const response = await fetch('data/articles.json');
    const articles = await response.json();
    return articles.find(a => a.id === articleId);
}

// ===== RENDERIZADO DEL ARTÍCULO =====
function renderArticle(articleData) {
    const elementsToUpdate = [
        { selector: '.article-tag', content: `<i class="${articleData.icon}"></i> ${articleData.tag}` },
        { selector: '.article-title', content: articleData.title, textOnly: true },
        { selector: '#article-date', content: articleData.date, textOnly: true },
        { selector: '#article-content', content: `<div class="article-body">${articleData.content}</div>` }
    ];
    
    elementsToUpdate.forEach(({ selector, content, textOnly }) => {
        const element = document.querySelector(selector);
        if (element) {
            if (textOnly) {
                element.textContent = content;
            } else {
                element.innerHTML = content;
            }
        }
    });
    
    // Actualizar título de la página
    document.title = `${articleData.title} | Portfolio - Desarrollador iOS & Web`;
    
    // Aplicar animación de entrada
    animateContentEntry();
}

function animateContentEntry() {
    const contentElement = document.getElementById('article-content');
    if (!contentElement) return;
    
    contentElement.style.cssText = 'opacity: 0; transform: translateY(20px);';
    
    setTimeout(() => {
        contentElement.style.cssText = 'transition: all 0.6s ease; opacity: 1; transform: translateY(0);';
    }, 100);
}

// ===== APLICAR HIGHLIGHT.JS =====
function applyHighlightJS() {
    // Verificar que Highlight.js esté disponible
    if (typeof hljs === 'undefined') {
        console.warn('Highlight.js no está cargado');
        return;
    }
    
    // Aplicar highlighting a todos los bloques de código
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Asegurar que el bloque no haya sido procesado ya
        if (!block.classList.contains('hljs')) {
            hljs.highlightElement(block);
        }
        
        // Agregar botón de copiar (opcional)
        addCopyButton(block);
    });
}

// ===== BOTÓN DE COPIAR CÓDIGO =====
function addCopyButton(codeBlock) {
    const pre = codeBlock.parentElement;
    if (!pre || pre.querySelector('.copy-code-btn')) return;
    
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            button.innerHTML = '<i class="fas fa-check"></i> Copiado';
            button.style.background = 'rgba(34, 197, 94, 0.8)';
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                button.style.background = 'rgba(0, 0, 0, 0.7)';
            }, 2000);
        } catch (err) {
            button.innerHTML = '<i class="fas fa-times"></i> Error';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
            }, 2000);
        }
    });
    
    pre.style.position = 'relative';
    pre.appendChild(button);
}

// ===== CÁLCULO DE TIEMPO DE LECTURA =====
function calculateReadingTime() {
    const content = document.getElementById('article-content');
    if (!content) return;
    
    const text = content.textContent || content.innerText;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / CONFIG.WORDS_PER_MINUTE));
    
    const readingTimeElement = document.getElementById('reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min lectura`;
    }
}

// ===== INDICADOR DE PROGRESO DE LECTURA =====
function setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    let ticking = false;
    
    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        const scrollPercent = scrollHeight <= 0 ? 0 : (scrollTop / scrollHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
    
    // Throttle para mejorar rendimiento
    const throttledUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', throttledUpdate);
    updateProgress(); // Inicializar
}

// ===== NAVEGACIÓN MÓVIL =====
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    };
    
    const closeMenu = () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    };
    
    // Event listeners
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });
    
    navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            closeMenu();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > CONFIG.NAVBAR_BREAKPOINT) {
            closeMenu();
        }
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== EFECTOS HOVER =====
function setupHoverEffects() {
    const actionButtons = document.querySelectorAll('.action-btn, .back-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}

// ===== SISTEMA DE NOTIFICACIONES =====
class NotificationSystem {
    static show(message, type = 'info') {
        this.remove(); // Remover notificación existente
        
        const notification = this.create(message, type);
        this.addStyles();
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => this.hide(notification), CONFIG.NOTIFICATION_DURATION);
    }
    
    static create(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        return notification;
    }
    
    static addStyles() {
        if (document.querySelector('#notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed; top: 20px; right: 20px;
                background: var(--bg-card); border: 1px solid var(--border-primary);
                border-radius: 0.5rem; padding: 1rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000; transform: translateX(400px);
                transition: transform 0.3s ease; max-width: 300px;
            }
            .notification.show { transform: translateX(0); }
            .notification.success { border-left: 4px solid #10b981; }
            .notification.error { border-left: 4px solid #ef4444; }
            .notification-content { display: flex; justify-content: space-between; align-items: center; }
            .notification-close {
                background: none; border: none; color: var(--text-muted);
                cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: 1rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    static hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
    
    static remove() {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
    }
}

// ===== LOADER SYSTEM =====
class LoaderSystem {
    static show() {
        if (State.isLoading || document.getElementById('article-loader')) return;
        
        State.isLoading = true;
        const loader = this.create();
        this.addStyles();
        document.body.appendChild(loader);
    }
    
    static hide() {
        const loader = document.getElementById('article-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                State.isLoading = false;
            }, 500);
        }
    }
    
    static create() {
        const loader = document.createElement('div');
        loader.id = 'article-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>Cargando artículo...</p>
            </div>
        `;
        return loader;
    }
    
    static addStyles() {
        if (document.querySelector('#loader-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'loader-styles';
        styles.textContent = `
            #article-loader {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.8); display: flex;
                align-items: center; justify-content: center;
                z-index: 9999; opacity: 1; transition: opacity 0.5s ease;
            }
            #article-loader.fade-out { opacity: 0; }
            .loader-content { text-align: center; color: white; }
            .spinner {
                width: 40px; height: 40px;
                border: 4px solid rgba(59, 130, 246, 0.3);
                border-top: 4px solid #3b82f6;
                border-radius: 50%; animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(styles);
    }
}

// ===== PÁGINAS DE ERROR =====
function createErrorPage(title, message, buttonText, buttonAction) {
    const container = document.querySelector('.article-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-content" style="text-align: center; padding: 4rem 2rem;">
            <h1 style="color: var(--text-primary); margin-bottom: 1rem;">${title}</h1>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
            <button onclick="${buttonAction}" class="btn btn-primary" 
                style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; 
                background: var(--primary-gradient); color: white; border: none; border-radius: 50px; 
                font-weight: 500; cursor: pointer;">
                <i class="fas fa-${buttonText === 'Volver a artículos' ? 'arrow-left' : 'refresh'}"></i>
                ${buttonText}
            </button>
        </div>
    `;
}

function showArticleNotFound() {
    createErrorPage(
        'Artículo no encontrado',
        'Lo sentimos, el artículo que buscas no existe o ha sido movido.',
        'Volver a artículos',
        'window.location.href="index.html#articles"'
    );
    hideLoader();
}

function showError(message) {
    createErrorPage(
        'Error',
        `${message}\nPor favor, intenta recargar la página.`,
        'Recargar página',
        'location.reload()'
    );
    hideLoader();
}

// ===== FUNCIÓN DE COMPARTIR =====
function shareArticle() {
    const title = document.title;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title,
            url,
            text: 'Interesante artículo sobre desarrollo:'
        }).catch(err => console.log('Error sharing:', err));
    } else {
        copyToClipboard(url);
    }
}

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            NotificationSystem.show('¡Enlace copiado al portapapeles!', 'success');
        } else {
            // Fallback para navegadores más antiguos
            fallbackCopyTextToClipboard(text);
        }
    } catch (err) {
        NotificationSystem.show('Error al copiar enlace', 'error');
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        NotificationSystem.show('¡Enlace copiado al portapapeles!', 'success');
    } catch (err) {
        NotificationSystem.show('Error al copiar enlace', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== ALIASES PARA MANTENER COMPATIBILIDAD =====
const showLoader = () => LoaderSystem.show();
const hideLoader = () => LoaderSystem.hide();
const showNotification = (message, type) => NotificationSystem.show(message, type);

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL =====
window.shareArticle = shareArticle;