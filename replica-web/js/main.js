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

    // Función principal para la página de inicio (index.html)
    if (path.includes('index.html') || path === '/') {
        // Inicializar Typed.js con textos dinámicos
        new Typed('#typed-text', {
            strings: [
                "Desarrollo Soluciones Digitales Modernas",
                "Construyo Experiencias de Usuario Intuitivas",
                "Te Ayudo a Crear tu Próxima App iOS",
                "Mi Código Transforma Ideas en Realidad"
            ],
            typeSpeed: 90,
            backSpeed: 30,
            backDelay: 1000,
            startDelay: 500,
            loop: true, // Ahora el ciclo se repite
            showCursor: true,
            cursorChar: '|',
        });

        // Función para renderizar los artículos en el HTML de la página de inicio
        function renderArticles(articles) {
            const container = document.getElementById('articles-container');
            container.innerHTML = '';
            articles.forEach(article => {
                const articleHTML = `
                    <article class="article-card">
                        <div class="article-content">
                            <span class="article-tag">${article.tag}</span>
                            <h3 class="article-title">${article.title}</h3>
                            <p class="article-date">${article.date}</p>
                            <p class="article-excerpt">${article.excerpt}</p>
                            <a href="article.html?id=${article.id}" class="read-more">Leer más...</a>
                        </div>
                    </article>
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
                container.innerHTML = '<p>Lo siento, no se pudieron cargar los artículos en este momento.</p>';
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