document.addEventListener('DOMContentLoaded', function() {

    // =================================================================
    // LÓGICA GLOBAL (Para todas las páginas)
    // =================================================================

    // 1. Menú de navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 2. Smooth scrolling para enlaces de ancla (si existen)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Resaltar enlace de navegación activo al hacer scroll (solo para index.html)
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        if (sections.length === 0) return; // No ejecutar si no hay secciones (p. ej. en articles.html)
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // 4. Envío de formulario (si existe)
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría tu lógica de envío real
            alert('¡Mensaje enviado! Te contactaré pronto.');
        });
    }

    // =================================================================
    // LÓGICA ESPECÍFICA PARA LA PÁGINA DE INICIO (index.html)
    // =================================================================
    const articlesContainer = document.getElementById('articles-container');

    // Esta función solo se ejecutará si encuentra el contenedor de artículos
    if (articlesContainer) {
       fetch('data/articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo JSON');
                }
                return response.json();
            })
          .then(articles => {
    articlesContainer.innerHTML = ''; // Limpiar contenido estático
    articles.forEach(article => {
        // 1. Convertir el tag a un formato de clase CSS (ej: "SwiftUI" -> "tag-swiftui")
        const tagClass = `tag-${article.tag.toLowerCase()}`;

        // 2. Crear el elemento 'a' y APLICARLE la clase 'article-card' directamente
        const articleCard = document.createElement('a');
        articleCard.href = `articles.html?id=${article.id}`;
        articleCard.className = 'article-card'; // Usamos className para reemplazar todo

        // 3. Generar el HTML interno SIN el div wrapper
        const cardHTML = `
            <div class="article-icon-wrapper">
                <i class="${article.icon} article-icon"></i>
                <span class="article-tag ${tagClass}">${article.tag}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <div class="article-date">
                <i class="far fa-calendar"></i>
                ${article.date}
            </div>
            <p class="article-excerpt">${article.excerpt}</p>
            <span class="read-more-btn">
                Leer artículo <i class="fas fa-arrow-right"></i>
            </span>
        `;

        articleCard.innerHTML = cardHTML;
        articlesContainer.appendChild(articleCard);
    });
})
            .catch(error => {
                console.error('Error al cargar los artículos:', error);
                articlesContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error al cargar los artículos. Por favor, intenta más tarde.</p>
                    </div>
                `;
            });
    }

    // =================================================================
    // LÓGICA ESPECÍFICA PARA LA PÁGINA DE ARTÍCULO (articles.html)
    // =================================================================
    const articleContentContainer = document.getElementById('article-content');

    // Esta función solo se ejecutará si encuentra el contenedor de contenido del artículo
    if (articleContentContainer) {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');

        if (articleId) {
            fetch('data/articles.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar el archivo JSON');
                    }
                    return response.json();
                })
                .then(articles => {
                    const article = articles.find(a => a.id === articleId);
                    if (article) {
                        // Actualizar título de la página
                        document.title = `${article.title} | Portfolio - Desarrollador iOS & Web`;
                        
                        // Actualizar contenido del header
                        const articleTitle = document.querySelector('.article-title');
                        const articleTag = document.querySelector('.article-tag');
                        const articleDate = document.getElementById('article-date');
                        const articleIcon = document.querySelector('.article-tag i');
                        
                        if (articleTitle) articleTitle.textContent = article.title;
                        if (articleTag) {
                            articleTag.innerHTML = `<i class="${article.icon}"></i> ${article.tag}`;
                        }
                        if (articleDate) articleDate.textContent = article.date;
                        
                        // Actualizar contenido del artículo
                        const articleHTML = `
                            <div class="article-body">
                                ${article.content.split('\n').map(paragraph => 
                                    paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
                                ).filter(p => p).join('')}
                            </div>
                        `;
                        articleContentContainer.innerHTML = articleHTML;
                        
                        // Calcular tiempo de lectura estimado
                        const wordCount = article.content.split(' ').length;
                        const readingTime = Math.ceil(wordCount / 200); // 200 palabras por minuto promedio
                        const readingTimeElement = document.getElementById('reading-time');
                        if (readingTimeElement) {
                            readingTimeElement.textContent = `${readingTime} min lectura`;
                        }
                        
                    } else {
                        articleContentContainer.innerHTML = `
                            <div class="article-not-found">
                                <h1>Artículo no encontrado</h1>
                                <p>El artículo que buscas no existe o ha sido eliminado.</p>
                                <a href="index.html#articles" class="btn btn-primary">
                                    Volver a artículos
                                </a>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error('Error al cargar el artículo:', error);
                    articleContentContainer.innerHTML = `
                        <div class="error-message">
                            <h1>Error al cargar el artículo</h1>
                            <p>Hubo un problema al cargar el contenido. Por favor, intenta más tarde.</p>
                            <a href="index.html#articles" class="btn btn-primary">
                                Volver a artículos
                            </a>
                        </div>
                    `;
                });
        } else {
            // Si no hay ID de artículo en la URL
            articleContentContainer.innerHTML = `
                <div class="no-article-id">
                    <h1>Artículo no especificado</h1>
                    <p>No se ha especificado qué artículo mostrar.</p>
                    <a href="index.html#articles" class="btn btn-primary">
                        Ver todos los artículos
                    </a>
                </div>
            `;
        }
    }

    // =================================================================
    // FUNCIONES ADICIONALES PARA ARTICLES.HTML
    // =================================================================
    
    // Indicador de progreso de lectura
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }
});








      // Animación de formulario
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = document.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.style.background = 'var(--success-gradient)';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = 'var(--primary-gradient)';
                }, 3000);
            }, 2000);
        });

        // Efecto de enfoque mejorado
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });

        // Animación de entrada
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.contact-info-card, .contact-form-wrapper').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });



        