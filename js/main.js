window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    const tagConfig = {
        'Desarrollo': { icon: 'fas fa-code', class: 'tag-desarrollo' },
        'Diseño': { icon: 'fas fa-palette', class: 'tag-diseno' },
        'Firebase': { icon: 'fas fa-fire', class: 'tag-firebase' },
        'SwiftUI': { icon: 'fab fa-swift', class: 'tag-swiftui' }
    };

    if (path.includes('index.html') || path === '/' || path.endsWith('/replica-web/')) {
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Solo ejecutamos el código de las librerías si existen.
        
        // 1. Scroll suave (Lenis)
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            lenis.on('scroll', (e) => {});
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } else {
            console.warn('Librería Lenis no encontrada. El scroll suave no funcionará.');
        }

        // 2. Animación de texto (GSAP)
        const typedTextSpan = document.getElementById('typed-text');
        if (typedTextSpan && typeof gsap !== 'undefined') {
            const phrases = [
                "Desarrollo Soluciones Digitales Modernas",
                "Construyo Experiencias de Usuario Intuitivas",
                "Te Ayudo a Crear tu Próxima App iOS",
                "Mi Código Transforma Ideas en Realidad"
            ];
            let phraseIndex = 0;

            function typePhrase() {
                const currentPhrase = phrases[phraseIndex];
                typedTextSpan.textContent = '';
                let charIndex = 0;
                gsap.to({}, {
                    duration: 0.05,
                    repeat: currentPhrase.length - 1,
                    onRepeat: () => {
                        typedTextSpan.textContent += currentPhrase[charIndex++];
                    },
                    onComplete: () => setTimeout(erasePhrase, 1000)
                });
            }

            function erasePhrase() {
                const currentPhrase = typedTextSpan.textContent;
                let charIndex = currentPhrase.length;
                gsap.to({}, {
                    duration: 0.03,
                    repeat: currentPhrase.length,
                    onRepeat: () => {
                        typedTextSpan.textContent = currentPhrase.substring(0, --charIndex);
                    },
                    onComplete: () => {
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        setTimeout(typePhrase, 500);
                    }
                });
            }
            typePhrase();
        } else {
            console.warn('Elemento #typed-text o librería GSAP no encontrados. La animación de texto no funcionará.');
        }
        
        // --- FIN DE LA CORRECCIÓN ---

        async function getArticles() {
            const container = document.getElementById('articles-container');
            try {
                const response = await fetch('data/articles.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error("Error al cargar articles.json:", error);
                if(container) container.innerHTML = `<p style="color:red; text-align:center;">No se pudieron cargar los artículos.</p>`;
                return [];
            }
        }

        function renderArticles(articles) {
            const container = document.getElementById('articles-container');
            if (!container) return;
            container.innerHTML = '';
            articles.forEach(article => {
                const config = tagConfig[article.tag] || { icon: 'fas fa-file-alt', class: 'tag-desarrollo' };
                const articleCard = document.createElement('a');
                articleCard.href = `article.html?id=${article.id}`;
                articleCard.className = 'article-card';
                articleCard.innerHTML = `
                    <div class="article-content">
                        <div class="article-icon-wrapper">
                            <div class="article-icon"><i class="${config.icon}"></i></div>
                            <span class="article-tag ${config.class}">${article.tag}</span>
                        </div>
                        <h3 class="article-title">${article.title}</h3>
                        <p class="article-date"><i class="fas fa-calendar-alt"></i> ${article.date}</p>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <span class="read-more-btn"><i class="fas fa-arrow-right"></i> Leer más</span>
                    </div>`;
                container.appendChild(articleCard);
            });
        }

        const randomButton = document.getElementById('random-article-btn');
        if (randomButton) {
            randomButton.addEventListener('click', async () => {
                const allArticles = await getArticles();
                if (allArticles.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allArticles.length);
                    renderArticles([allArticles[randomIndex]]);
                }
            });
        }

        getArticles().then(articles => {
            if (articles.length > 0) {
                renderArticles(articles);
            }
        });
    }

    else if (path.includes('article.html')) {
        async function renderArticleContent() {
            const params = new URLSearchParams(window.location.search);
            const articleId = params.get('id');
            const contentDiv = document.getElementById('article-content');
            if (!articleId || !contentDiv) {
                if(contentDiv) contentDiv.innerHTML = `<h2>Error: Artículo no encontrado.</h2>`;
                return;
            }
            try {
                const response = await fetch('data/articles.json');
                const articles = await response.json();
                const article = articles.find(a => a.id === articleId);
                if (article) {
                    document.title = `${article.title} | Luciano Nicolini`;
                    contentDiv.innerHTML = `
                        <div class="article-header">
                            <span class="article-tag-single">${article.tag}</span>
                            <h1 class="article-title-single">${article.title}</h1>
                            <p class="article-date-single">${article.date}</p>
                        </div>
                        <div class="article-body">
                            <p>${article.content.replace(/\n/g, '</p><p>')}</p>
                        </div>`;
                } else {
                    contentDiv.innerHTML = `<h2>Error: Artículo no encontrado.</h2>`;
                }
            } catch (error) {
                console.error("Error al cargar el artículo:", error);
                contentDiv.innerHTML = `<p>Lo siento, hubo un error al cargar el contenido.</p>`;
            }
        }
        renderArticleContent();
    }
});