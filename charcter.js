document.addEventListener('DOMContentLoaded', () => {
  // Find all carousel containers on the page
  const carousels = document.querySelectorAll('.project-carousel-container');

  carousels.forEach((container) => {
    initCarousel(container);
  });
});

function initCarousel(container) {
  const track = container.querySelector('.project-track');
  const prevBtn = container.querySelector('.prev-arrow');
  const nextBtn = container.querySelector('.next-arrow');

  if (!track) return;

  const originalItems = Array.from(track.children);
  const totalOriginal = originalItems.length;

  // 1. Clone items for infinite looping
  const cloneFirst = originalItems.map(item => item.cloneNode(true));
  const cloneLast = originalItems.map(item => item.cloneNode(true));

  cloneLast.forEach(item => track.insertBefore(item, track.firstChild));
  cloneFirst.forEach(item => track.appendChild(item));

  // 2. Calculate item shift distance
  const itemWidth = originalItems[0].getBoundingClientRect().width;
  const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
  const moveDistance = itemWidth + gap;

  // 3. Set starting position to the real first item
  let currentIndex = totalOriginal;
  track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;

  let isTransitioning = false;

  // 4. Move function scoped to this specific carousel
  function move(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    track.style.transition = "transform 0.4s ease-in-out";
    currentIndex += direction;
    track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;
  }

  // 5. Attach button click handlers
  if (prevBtn) prevBtn.addEventListener('click', () => move(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => move(1));

  // 6. Seamless reset portal on transition completion
  track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (currentIndex >= totalOriginal * 2) {
      track.style.transition = "none";
      currentIndex = totalOriginal;
      track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;
    }

    if (currentIndex < totalOriginal) {
      track.style.transition = "none";
      currentIndex = totalOriginal * 2 - 1;
      track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;
    }
  });
}