const themeSwitcherIcon = document.querySelector('.theme-switcher i');
const mainContent = document.querySelector('main#content');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main#content section');

function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitcherIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.body.removeAttribute('data-theme');
        themeSwitcherIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

function toggleTheme() {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeSwitcherIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeSwitcherIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

function setupSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            const popover = document.getElementById('greeting-popover');
            if (popover && popover.classList.contains('show')) {
                popover.classList.remove('show');
            }
        });
    });
}

function toggleCustomPopover(event) {
    event.stopPropagation();
    const popover = document.getElementById('greeting-popover');
    popover.classList.toggle('show');
}

document.addEventListener('click', (event) => {
    const popover = document.getElementById('greeting-popover');
    const popoverButton = document.querySelector('.popover-button');

    if (popover && popover.classList.contains('show') &&
        !popover.contains(event.target) &&
        !popoverButton.contains(event.target)) {
        popover.classList.remove('show');
    }
});

function showPlaceholderMessage(button) {
     alert('Certificate viewing is currently unavailable. This feature will be implemented soon!');
}

let intersectionObserver = null;

function setupIntersectionObserver() {
    if (intersectionObserver) {
        intersectionObserver.disconnect();
    }

    const isMobile = window.innerWidth <= 768;

    const observerOptions = {
        root: isMobile ? null : mainContent,
        rootMargin: '0px',
        threshold: 0.4
    };

    const observerCallback = (entries) => {
        let highestEntry = null;
        
        entries.forEach(entry => {
            if(entry.isIntersecting && entry.intersectionRatio >= observerOptions.threshold) {
                if(!highestEntry || entry.intersectionRatio > highestEntry.intersectionRatio) {
                    highestEntry = entry;
                }
            }
        });
    
        if(highestEntry) {
            const id = highestEntry.target.id;
            const correspondingLink = document.querySelector(`.nav-links a[href='#${id}']`);
            
            if(correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    };

    intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        intersectionObserver.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    setupSmoothScroll();
    setupIntersectionObserver();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupIntersectionObserver();
        }, 250);
    });
});