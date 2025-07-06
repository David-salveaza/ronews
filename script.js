<script>
// RoNews site interactivity

window.addEventListener('load', () => {
    document.getElementById('loader')?.style?.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const searchInput = document.getElementById('searchInput');
    const darkToggleBtn = document.getElementById('darkToggle');

    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    };

    const setActiveLink = (activeLink) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionToShow = e.target.dataset.section + '-section';
            showSection(sectionToShow);
            setActiveLink(e.target);
            history.replaceState(null, null, `#${e.target.dataset.section}`);
        });
    });

    const hash = location.hash.replace('#', '');
    const initialLink = document.querySelector(`.nav-link[data-section="${hash}"]`) || document.querySelector('.nav-link[data-section="home"]');
    initialLink?.click();

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#home-section .grid > div');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'block' : 'none';
            });
        });
    }

    if (darkToggleBtn) {
        darkToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('ron_dark_mode', document.documentElement.classList.contains('dark'));
        });
        if (localStorage.getItem('ron_dark_mode') === 'true') {
            document.documentElement.classList.add('dark');
        }
    }
});
</script>
