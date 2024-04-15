function handleScroll() {
    let scrollingElement = document.querySelector('.header');
    let scrollPosition = window.scrollY;

    if (scrollPosition > 20) {
        scrollingElement.classList.add('scrolled');
    } else {
        scrollingElement.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);