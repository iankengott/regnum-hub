const slides = [...document.querySelectorAll('.slide')];
const track = document.querySelector('#carousel-track');
const dots = [...document.querySelectorAll('[data-slide-to]')];
const currentSlide = document.querySelector('#current-slide');
const slideCount = document.querySelector('#slide-count');
const carousel = document.querySelector('.carousel');
const previous = document.querySelector('[data-carousel="prev"]');
const next = document.querySelector('[data-carousel="next"]');

let activeIndex = 0;
let pointerStart = null;

if (slideCount) slideCount.textContent = String(slides.length).padStart(2, '0');

function setSlide(nextIndex, shouldFocus = false) {
  if (!track || !slides.length) return;
  activeIndex = (nextIndex + slides.length) % slides.length;
  track.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;

  slides.forEach((slide, index) => {
    const isActive = index === activeIndex;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.classList.toggle('is-active', isActive);
    slide.inert = !isActive;
  });

  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;
    dot.setAttribute('aria-selected', String(isActive));
    dot.tabIndex = isActive ? 0 : -1;
  });

  if (currentSlide) currentSlide.textContent = String(activeIndex + 1).padStart(2, '0');
  if (shouldFocus) dots[activeIndex]?.focus();
}

previous?.addEventListener('click', () => setSlide(activeIndex - 1));
next?.addEventListener('click', () => setSlide(activeIndex + 1));
dots.forEach((dot) => dot.addEventListener('click', () => setSlide(Number(dot.dataset.slideTo))));

carousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    setSlide(activeIndex - 1, true);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    setSlide(activeIndex + 1, true);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    setSlide(0, true);
  }
  if (event.key === 'End') {
    event.preventDefault();
    setSlide(slides.length - 1, true);
  }
});

carousel?.addEventListener('pointerdown', (event) => {
  pointerStart = event.clientX;
});

carousel?.addEventListener('pointerup', (event) => {
  if (pointerStart === null) return;
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 45) setSlide(activeIndex + (distance < 0 ? 1 : -1));
  pointerStart = null;
});

carousel?.addEventListener('pointercancel', () => {
  pointerStart = null;
});

setSlide(0);
