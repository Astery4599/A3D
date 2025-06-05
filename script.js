const allPosts = [
    {
        id: 'post1',
        title: 'Copa FACS: Primeiro dia cheio de emoções',
        category: 'Esportes',
        excerpt: 'O primeiro dia da Copa FACS foi marcado por goleadas e viradas emocionantes em várias modalidades esportivas.',
        image: 'copafacs.png',
        date: '20 Jun, 2025',
        tags: ['esporte', 'competição', 'facs']
    },
    {
        id: 'post2',
        title: 'EXPOUNIFACS 2025',
        category: 'Eventos',
        excerpt: 'Confira como foi a edição deste ano da EXPOUNIFACS e os projetos mais inovadores apresentados.',
        image: 'expounifacs.jpeg',
        date: '15 Jun, 2025',
        tags: ['feira', 'projetos', 'inovação']
    },
    {
        id: 'post3',
        title: 'Resultados da 2ª rodada',
        category: 'Esportes',
        excerpt: 'Todos os resultados e destaques da segunda rodada da Copa FACS em todas as modalidades.',
        image: 'copa-facs-rodada2.jpg',
        date: '10 Jun, 2025',
        tags: ['resultados', 'copa', 'facs']
    },
    {
        id: 'post4',
        title: 'Novos cursos disponíveis',
        category: 'Acadêmico',
        excerpt: 'Conheça os novos cursos que estarão disponíveis no próximo semestre e suas oportunidades.',
        image: 'novos-cursos.jpg',
        date: '5 Jun, 2025',
        tags: ['cursos', 'graduação', 'novidades']
    }
];


function getLatestPost() {
    const sortedPosts = [...allPosts].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    return sortedPosts[0]; 
}

function displayLatestPost() {
    const latestPost = getLatestPost();
    const lastPostContainer = document.getElementById('last-post-container');
    
    if (latestPost && lastPostContainer) {
        lastPostContainer.style.display = 'block';
        lastPostContainer.innerHTML = `
            <h3>Último Post Publicado:</h3>
            <article class="post-card">
                <div class="post-image">
                    <img src="${latestPost.image || 'default-image.jpg'}" alt="${latestPost.title}">
                    <span class="post-category">${latestPost.category}</span>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${latestPost.title}</h3>
                    <p class="post-excerpt">${latestPost.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar"></i> ${latestPost.date || 'Data não disponível'}</span>
                        <a href="post.html?id=${latestPost.id}" class="read-more-link">Ler mais</a>
                    </div>
                </div>
            </article>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayResults(allPosts);
    displayLatestPost();
    
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.trim().length > 0) {
                performSearch();
            } else {
                displayResults(allPosts);
            }
            updateSuggestions(searchInput.value.trim());
        }, 300);
    });
    
 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                
                this.classList.add('active');
             
                if (this.getAttribute('href') === '#ultimo-post') {
                    const lastPostContainer = document.getElementById('last-post-container');
                    if (lastPostContainer.style.display === 'none') {
                        lastPostContainer.style.display = 'block';
                    }
                }
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    const loadingElement = document.getElementById('search-loading');
    
    if (!searchTerm) {
        displayResults(allPosts);
        return;
    }
    
    loadingElement.classList.add('active');
    
    setTimeout(() => {
        const results = allPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            (post.tags && post.tags.some(tag => tag.includes(searchTerm)))
        );
        
        displayResults(results);
        loadingElement.classList.remove('active');
    }, 500);
}

function displayResults(results) {
    const postsContainer = document.getElementById('posts-container');
    
    const loadingElement = document.getElementById('search-loading');
    if (loadingElement) {
        loadingElement.classList.remove('active');
    }
    
    const elementsToRemove = [];
    postsContainer.childNodes.forEach(node => {
        if (node.id !== 'search-loading') {
            elementsToRemove.push(node);
        }
    });
    elementsToRemove.forEach(element => element.remove());
    
    if (results.length === 0) {
        const noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = 'Nenhum post encontrado. Tente outro termo de pesquisa.';
        postsContainer.appendChild(noResults);
        return;
    }
    
    results.forEach(post => {
        const postHTML = `
            <article class="post-card">
                <div class="post-image">
                    <img src="${post.image || 'default-image.jpg'}" alt="${post.title}">
                    <span class="post-category">${post.category}</span>
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar"></i> ${post.date || 'Data não disponível'}</span>
                        <a href="post.html?id=${post.id}" class="read-more-link">Ler mais</a>
                    </div>
                </div>
            </article>
        `;
        postsContainer.insertAdjacentHTML('beforeend', postHTML);
    });
}

function updateSuggestions(term) {
    if (!term) {
        document.getElementById('search-suggestions').innerHTML = '';
        return;
    }
    
    const allKeywords = new Set();
    allPosts.forEach(post => {
        allKeywords.add(post.title);
        allKeywords.add(post.category);
        if (post.tags) {
            post.tags.forEach(tag => allKeywords.add(tag));
        }
    });
    
    const suggestions = Array.from(allKeywords).filter(keyword => 
        keyword.toLowerCase().includes(term.toLowerCase())
    );
    
    const datalist = document.getElementById('search-suggestions');
    datalist.innerHTML = '';
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}