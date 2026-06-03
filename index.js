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

document.addEventListener("DOMContentLoaded", () => {
    const previewContainer = document.getElementById("hoverPreview");
    if (!previewContainer) return;

    const previewImg = previewContainer.querySelector("img");
    const desktopLinks = document.querySelectorAll(".desktop-nav a");

    const updatePreviewPosition = (e) => {
        // FIXED: Uses Page coordinates instead of Client coordinates 
        // This ensures if your header scrolls, the preview box stays perfectly locked to the true mouse tip
        previewContainer.style.left = `${e.pageX}px`;
        previewContainer.style.top = `${e.pageY}px`;
    };

    // MODERN FIX: Tracks your CSS breakpoint natively instead of relying on unreliable innerWidth values
    const isDesktop = window.matchMedia("(min-width: 834px)");

    if (isDesktop.matches) {
        desktopLinks.forEach(link => {
            const imageSource = link.getAttribute("data-preview");

            if (!imageSource) return;

            link.addEventListener("mouseenter", (e) => {
                previewImg.src = imageSource;
                
                // FORCE RENDER: Explicitly forces the element to show up
                previewContainer.style.display = "block";
                previewContainer.classList.add("is-visible");
                
                updatePreviewPosition(e);
            });

            link.addEventListener("mousemove", (e) => {
                updatePreviewPosition(e);
            });

            link.addEventListener("mouseleave", () => {
                previewContainer.classList.remove("is-visible");
            });
        });
    }
});