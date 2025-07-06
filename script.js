// script.js - RoNews - Interactivitate și funcționalități avansate

document.addEventListener('DOMContentLoaded', () => {
    // Selectăm elementele cheie din DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const searchInput = document.getElementById('searchInput');
    const darkToggleBtn = document.getElementById('darkToggle'); // Butonul pentru Dark Mode
    const breakingNewsBar = document.getElementById('breaking-bar'); // Bara de breaking news

    // --- Funcționalitatea de afișare a secțiunilor ---
    const showSection = (sectionId) => {
        // Ascunde toate secțiunile de conținut
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Afișează secțiunea țintă
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Scroll la începutul secțiunii (opțional, pentru UX mai bun)
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // --- Funcționalitatea de activare a link-ului din navigație ---
    const setActiveLink = (activeLinkElement) => {
        // Elimină clasa 'active' de la toate link-urile
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Adaugă clasa 'active' la link-ul curent
        if (activeLinkElement) {
            activeLinkElement.classList.add('active');
        }
    };

    // --- Adaugă eveniment de click pentru link-urile de navigație ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Previne comportamentul implicit al link-ului
            const sectionToShow = e.currentTarget.dataset.section + '-section'; // Folosim currentTarget pentru a ne asigura că este link-ul
            showSection(sectionToShow);
            setActiveLink(e.currentTarget);
            // Actualizează URL-ul fără a reîncărca pagina
            history.replaceState(null, '', `#${e.currentTarget.dataset.section}`);
        });
    });

    // --- Gestionează secțiunea inițială la încărcarea paginii ---
    const initializePage = () => {
        const hash = window.location.hash.replace('#', '');
        // Caută link-ul corespunzător hash-ului sau folosește "home" ca implicit
        const initialLink = document.querySelector(`.nav-link[data-section="${hash}"]`) ||
                             document.querySelector('.nav-link[data-section="home"]');
        
        // Dacă există un link inițial, simulează un click pe el
        if (initialLink) {
            initialLink.click();
        } else {
            // Fallback: Afișează secțiunea home și activează link-ul home dacă nu se găsește nimic
            showSection('home-section');
            setActiveLink(document.querySelector('.nav-link[data-section="home"]'));
            history.replaceState(null, '', '#home');
        }
    };

    // Apelez funcția de inițializare
    initializePage();

    // --- Funcționalitatea de căutare (doar pentru secțiunea Home) ---
    // Moved search logic inside the news loading section for clarity
    // as it operates on loaded news cards.

    // --- Funcționalitatea Dark Mode ---
    const applyTheme = (theme) => {
        const root = document.documentElement; // Elementul <html>
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark'); // Salvează preferința
            if (darkToggleBtn) {
                darkToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Iconiță pentru modul deschis
            }
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light'); // Salvează preferința
            if (darkToggleBtn) {
                darkToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // Iconiță pentru modul întunecat
            }
        }
    };

    // Verifică tema salvată sau preferința sistemului
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Event listener pentru butonul de Dark Mode
    if (darkToggleBtn) {
        darkToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // --- Breaking News Ticker (Exemplu) ---
    const breakingNewsMessages = [
        "Breaking News: Guvernul a anunțat noi măsuri economice!",
        "Stiri de ultimă oră: Echipa națională de fotbal a câștigat meciul!",
        "Avertizare meteo: Cod portocaliu de furtună în mai multe județe.",
        "Tehnologie: Noul smartphone lansat a depășit toate așteptările."
    ];

    let currentBreakingNewsIndex = 0;

    const updateBreakingNews = () => {
        if (breakingNewsBar) {
            breakingNewsBar.textContent = breakingNewsMessages[currentBreakingNewsIndex];
            currentBreakingNewsIndex = (currentBreakingNewsIndex + 1) % breakingNewsMessages.length;
        }
    };

    // Rulează breaking news-ul la fiecare 5 secunde
    if (breakingNewsBar) {
        updateBreakingNews(); // Afișează prima știre imediat
        setInterval(updateBreakingNews, 5000);
    }

    // --- Loader de pagină (opțional, dacă ai un loader vizibil inițial) ---
    // Această parte presupune că ai un element cu id="loader" în HTML care este vizibil inițial
    // și pe care vrei să-l ascunzi după ce pagina este complet încărcată.
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0'; // Efect de fade out
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300); // Așteaptă finalizarea tranziției
        }
    });

    // --- News Loading from stiri.json and Search functionality ---
    // Combining the two separate news loading logics into one robust solution.
    const newsCardsContainer = document.getElementById("news-cards-container"); // Assuming a container for all news cards
    const newsSection = document.getElementById("news-section"); // The parent of newsCardsContainer, likely for appending the button
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "Încarcă mai multe știri";
    // Using tailwind classes, adjusted for centering the button
    loadMoreBtn.className = "mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mx-auto block";

    let currentIndex = 0;
    const initialNewsLoadCount = 6; // Load more news initially
    const newsLoadIncrement = 3; // News to load on each "Load More" click
    let allNews = [];
    let filteredNews = []; // Used for search functionality

    const renderNewsCards = (newsToRender) => {
        const fragment = document.createDocumentFragment();
        const startIndex = currentIndex;
        const endIndex = Math.min(startIndex + (currentIndex === 0 ? initialNewsLoadCount : newsLoadIncrement), newsToRender.length);

        for (let i = startIndex; i < endIndex; i++) {
            const stire = newsToRender[i];
            const card = document.createElement("div");
            // Ensure news-card class is added for CSS styling
            card.className = "news-card mb-6"; // Added mb-6 for spacing

            card.innerHTML = `
                <img src="${stire.imagine}" alt="${stire.titlu}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <span class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">${stire.eticheta}</span>
                    <h4 class="text-lg font-semibold mt-2">${stire.titlu}</h4>
                    <p class="text-sm text-gray-600 mt-1">${stire.descriere}</p>
                    <span class="text-xs text-gray-400">Publicat la: ${stire.data}</span>
                </div>
            `;
            fragment.appendChild(card);
        }
        newsCardsContainer.appendChild(fragment);
        currentIndex = endIndex; // Update currentIndex for the next load

        if (currentIndex >= newsToRender.length) {
            loadMoreBtn.style.display = "none"; // Hide button if all news are loaded
        } else {
            loadMoreBtn.style.display = "block"; // Ensure button is visible if there's more news
        }
    };

    const loadAllNews = () => {
        fetch("stiri.json")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                allNews = data;
                filteredNews = [...allNews]; // Initialize filteredNews with all news
                newsCardsContainer.innerHTML = ''; // Clear existing cards before rendering
                currentIndex = 0; // Reset index when data is loaded
                renderNewsCards(filteredNews);

                // Append load more button only if it's the home section and not already added
                // Or if there are more news to load than initially displayed
                if (newsSection && !newsSection.contains(loadMoreBtn) && allNews.length > initialNewsLoadCount) {
                    newsSection.appendChild(loadMoreBtn);
                }
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                newsCardsContainer.innerHTML = '<p class="text-red-500">A apărut o eroare la încărcarea știrilor. Vă rugăm să încercați din nou mai târziu.</p>';
                loadMoreBtn.style.display = "none"; // Hide button on error
            });
    };

    // Load news when the Home section is active or when the page loads
    // This will prevent loading news repeatedly if you navigate away and back
    document.querySelector('.nav-link[data-section="home"]').addEventListener('click', loadAllNews);
    // If the page loads directly on #home, ensure news are loaded
    if (window.location.hash === '#home' || window.location.hash === '') {
        loadAllNews();
    }


    // Event listener for the Load More button
    loadMoreBtn.addEventListener("click", () => renderNewsCards(filteredNews));


    // Search functionality - now properly integrated and acting on filteredNews
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            newsCardsContainer.innerHTML = ''; // Clear current display
            currentIndex = 0; // Reset index for filtered view

            if (query === '') {
                filteredNews = [...allNews]; // If query is empty, show all news
            } else {
                filteredNews = allNews.filter(stire => {
                    const title = stire.titlu.toLowerCase();
                    const description = stire.descriere.toLowerCase();
                    return title.includes(query) || description.includes(query);
                });
            }
            renderNewsCards(filteredNews);
        });
    }

});
