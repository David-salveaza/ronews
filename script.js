// RoNews - Interactivitate și funcționalități avansate

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
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim(); // Trim spațiile albe
            const cards = document.querySelectorAll('#home-section .news-card'); // Selectează doar cardurile de știri

            cards.forEach(card => {
                const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                // Verifică dacă titlul sau descrierea conțin interogarea
                if (title.includes(query) || description.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

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
});

<script>
document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-section");
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.textContent = "Încarcă mai multe știri";
  loadMoreBtn.className = "mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition";
  
  let currentIndex = 0;
  const newsPerPage = 3;
  let allNews = [];

  fetch("stiri.json")
    .then(res => res.json())
    .then(data => {
      allNews = data;
      showNews();
      newsContainer.appendChild(loadMoreBtn);
    });

  function showNews() {
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + newsPerPage && i < allNews.length; i++) {
      const stire = allNews[i];
      const card = document.createElement("div");
      card.className = "bg-white hover:shadow-lg transition rounded-lg overflow-hidden mb-6";

      card.innerHTML = `
        <img src="${stire.imagine}" alt="stire" class="w-full h-48 object-cover">
        <div class="p-4">
          <span class="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">${stire.eticheta}</span>
          <h3 class="text-lg font-semibold mt-2">${stire.titlu}</h3>
          <p class="text-sm text-gray-600 mt-1">${stire.descriere}</p>
          <span class="text-xs text-gray-400">Publicat la: ${stire.data}</span>
        </div>
      `;
      fragment.appendChild(card);
    }
    currentIndex += newsPerPage;
    newsContainer.appendChild(fragment);

    if (currentIndex >= allNews.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  loadMoreBtn.addEventListener("click", showNews);
});
</script>
