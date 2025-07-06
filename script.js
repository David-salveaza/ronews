// RoNews site interactivity

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to show a specific section
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    };

    // Function to set active nav link
    const setActiveLink = (activeLink) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionToShow = e.target.dataset.section + '-section';
            showSection(sectionToShow);
            setActiveLink(e.target);
        });
    });

    // Show home by default
    showSection('home-section');
    setActiveLink(document.querySelector('.nav-link[data-section="home"]'));
});
const hash = location.hash.replace('#', '');
if (hash) {
  const section = document.querySelector(`[data-section="${hash}"]`);
  if (section) {
    section.click();
  }
}
window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});
