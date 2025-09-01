window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Detectar en qué página estamos para ejecutar el código correcto
    const path = window.location.pathname;

    // Mapeo de tags a iconos y colores
    const tagConfig = {
        'Desarrollo': {
            icon: 'fas fa-code',
            color: 'text-accent-secondary',
            class: 'tag-desarrollo'
        },
        'Diseño': {
            icon: 'fas fa-palette',
            color: 'text-accent-blue',
            class: 'tag-diseno'
        },
        'Firebase': {
            icon: 'fas fa-fire',
            color: 'text-accent-green',
            class: 'tag-firebase'
        },
        'SwiftUI': {
            icon: 'fab fa-swift',
            color: 'text-accent-purple',
            class: 'tag-swiftui'
        },
        'iOS': {
            icon: 'fab fa-apple',
            color: 'text-accent-purple',
            class: 'tag-swiftui'
        },
        'Web': {
            icon: 'fas fa-globe',
            color: 'text-accent-secondary',
            class: 'tag-diseno'
        }
    };

    // Función principal para la página de inicio (index.html)
    if (path.includes('index.html') || path === '/') {
        // Inicializar Lenis para el scroll suave
        const lenis = new Lenis()
        lenis.on('scroll', (e) => {
            // Puedes usar esta función para sincronizar animaciones con el scroll
        })
        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Animación de GSAP para el texto que va a ser escrito
        const typedTextSpan = document.getElementById('typed-text');
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

            const typing = gsap.timeline({
                onComplete: () => {
                    setTimeout(() => {
                        erasePhrase();
                    }, 1000); // Espera 1 segundo antes de borrar
                }
            });

            typing.to({}, {
                duration: 0.05,
                repeat: currentPhrase.length - 1,
                onRepeat: () => {
                    typedTextSpan.textContent += currentPhrase[charIndex];
                    charIndex++;
                }
            });
        }

        function erasePhrase() {
            const currentPhrase = typedTextSpan.textContent;
            let charIndex = currentPhrase.length - 1;

            const erasing = gsap.timeline({
                onComplete: () => {
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(() => {
                        typePhrase();
                    }, 500); // Espera 0.5 segundos antes de escribir la siguiente
                }
            });

            erasing.to({}, {
                duration: 0.03,
                repeat: currentPhrase.length,
                onRepeat: () => {
                    typedTextSpan.textContent = currentPhrase.substring(0, charIndex);
                    charIndex--;
                }
            });
        }
        
        // Iniciar el efecto de escritura
        typePhrase();

        // Función para renderizar los artículos en el HTML de la página de inicio
 // REEMPLAZA tu función renderArticles existente con esta:
function renderArticles(articles) {
    const container = document.getElementById('articles-container');
    if (!container) return; // Asegurarse de que el contenedor existe
    
    container.innerHTML = '';
    articles.forEach((article, index) => {
        const config = tagConfig[article.tag] || {
            icon: 'fas fa-file-alt',
            class: 'tag-desarrollo'
        };

        const articleHTML = `
            <div class="article-card">
                <div class="article-content">
                    <div class="article-icon-wrapper">
                        <div class="article-icon">
                            <i class="${config.icon}"></i>
                        </div>
                        <span class="article-tag ${config.class}">${article.tag}</span>
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-date">
                        <i class="fas fa-calendar-alt"></i> ${article.date}
                    </p>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <span class="read-more-btn">
                        <i class="fas fa-arrow-right"></i> Leer más
                    </span>
                </div>
            </div>
        `;
        container.innerHTML += articleHTML;
    });
}

        // Función para obtener los artículos del JSON
        async function getArticles() {
            try {
                const response = await fetch('data/articles.json');
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de artículos.');
                }
                return await response.json();
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
                const container = document.getElementById('articles-container');
                if (container) {
                    container.innerHTML = '<p>Lo siento, no se pudieron cargar los artículos en este momento.</p>';
                }
                return [];
            }
        }

        // Lógica para el botón de "Artículo Aleatorio"
        const randomButton = document.getElementById('random-article-btn');
        if (randomButton) {
            randomButton.addEventListener('click', async () => {
                const allArticles = await getArticles();
                if (allArticles.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allArticles.length);
                    const randomArticle = allArticles[randomIndex];
                    renderArticles([randomArticle]);
                }
            });
        }

        // Cargar todos los artículos al iniciar la página
        getArticles().then(articles => {
            renderArticles(articles);
        });

    }

    // Lógica para la página del artículo (article.html)
    else if (path.includes('article.html')) {
        // Función para renderizar el contenido de un solo artículo
        async function renderArticleContent() {
            const params = new URLSearchParams(window.location.search);
            const articleId = params.get('id');

            if (!articleId) {
                document.getElementById('article-content').innerHTML = `
                    <h2>Error: Artículo no encontrado.</h2>
                    <p>Regresa a la <a href="index.html#articulos">página de artículos</a>.</p>
                `;
                return;
            }

            try {
                const response = await fetch('data/articles.json');
                const articles = await response.json();
                const article = articles.find(a => a.id === articleId);

                if (article) {
                    document.getElementById('article-content').innerHTML = `
                        <div class="article-header">
                            <span class="article-tag-single">${article.tag}</span>
                            <h1 class="article-title-single">${article.title}</h1>
                            <p class="article-date-single">${article.date}</p>
                        </div>
                        <div class="article-body">
                            <p>${article.content.replace(/\n/g, '</p><p>')}</p>
                        </div>
                    `;
                    document.title = article.title + ' | Luciano Nicolini';
                } else {
                    document.getElementById('article-content').innerHTML = `
                        <h2>Error: Artículo no encontrado.</h2>
                        <p>Regresa a la <a href="index.html#articulos">página de artículos</a>.</p>
                    `;
                }
            } catch (error) {
                console.error('Error al cargar el artículo:', error);
                document.getElementById('article-content').innerHTML = `
                    <p>Lo siento, hubo un error al cargar el contenido.</p>
                `;
            }
        }

        renderArticleContent();
    }
});