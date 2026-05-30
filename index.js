document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Update states
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-open');
        body.classList.toggle('menu-open');
    }

    // Toggle button handler
    menuToggle.addEventListener('click', toggleMenu);

    // Close screen menu when clicking individual anchor points
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });
});