<script>
// RoNews site interactivity

window.addEventListener('load', () => {
    document.getElementById('loader')?.style?.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

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

    // Initial section based on hash
    const hash = location.hash.replace('#', '');
    const initialLink = document.querySelector(`.nav-link[data-section="${hash}"]`) || document.querySelector('.nav-link[data-section="home"]');
    initialLink?.click();
});
</script>

