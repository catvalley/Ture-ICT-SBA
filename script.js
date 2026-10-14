
const supabaseUrl = 'https://ffjkxtxpwbpqczfkvwxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_v-hb4yj3gpyq1ySW4eetSQ_-4Tw_JYu'; 
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener('DOMContentLoaded', async () => {
  const carousels = document.querySelectorAll('.project-carousel-container');

  if (carousels.length === 0) {
    console.error('.project-carousel-container ');
  } else {
    for (let i = 0; i < carousels.length; i++) {
      const container = carousels[i];
      const tableName = i === 0 ? 'projects' : 'characters'; 
      
      await updateCarouselImages(container, tableName);
      
     
      initCarousel(container, i + 1);
    }
  }

  initSoundCard();
});

async function updateCarouselImages(container, tableName) {
  const items = container.querySelectorAll('.project-item');
  if (items.length === 0) return;

  try {
    const { data, error } = await supabaseClient.from(tableName).select('*');

    if (error) {
      console.error(`❌ 获取 ${tableName} 数据失败:`, error);
      return;
    }

    if (data && data.length > 0) {
      items.forEach((item, index) => {
        if (data[index]) {
          const img = item.querySelector('img');
          const label = item.querySelector('.project-label');

          if (img && data[index].image_url) img.src = data[index].image_url;
          if (label && data[index].title) label.textContent = data[index].title;
        }
      });
    }
  } catch (err) {
    console.error(`❌ 请求 ${tableName} 表发生异常:`, err);
  }
}

function initCarousel(container, carouselNumber) {
  const track = container.querySelector('.project-track');
  const prevBtn = container.querySelector('.prev-arrow');
  const nextBtn = container.querySelector('.next-arrow');

  if (!track || track.children.length === 0) return;

  const originalItems = Array.from(track.children);
  const totalOriginal = originalItems.length;

  if (totalOriginal === 0) return;

  const cloneFirst = originalItems.map(item => item.cloneNode(true));
  const cloneLast = originalItems.map(item => item.cloneNode(true));

  cloneLast.forEach(item => track.insertBefore(item, track.firstChild));
  cloneFirst.forEach(item => track.appendChild(item));

  function getMoveDistance() {
    const card = track.querySelector('.project-item');
    if (!card) return 0;
    
    const itemWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    
    return itemWidth + gap;
  }

  let moveDistance = getMoveDistance();
  let currentIndex = totalOriginal;

  track.style.transition = "none";
  track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;

  let isTransitioning = false;

  function move(direction) {
    if (isTransitioning) return;

    moveDistance = getMoveDistance();
    if (moveDistance === 0) return;

    isTransitioning = true;
    track.style.transition = "transform 0.4s ease-in-out";
    currentIndex += direction;
    track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      move(-1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      move(1);
    };
  }

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

  window.addEventListener('resize', () => {
    moveDistance = getMoveDistance();
    track.style.transition = "none";
    track.style.transform = `translateX(${-currentIndex * moveDistance}px)`;
  });
}

function initSoundCard() {
  const boom = document.getElementById('boom');
  const soundEffect = new Audio('https://ffjkxtxpwbpqczfkvwxf.supabase.co/storage/v1/object/public/photo/35f4997a-677c-4e79-a2b8-f33b688d5233%20(1).mp3');

  const pushPhoto = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    soundEffect.currentTime = 0;
    soundEffect.play().catch(error => {
      console.log('Audio playback waiting for interaction:', error);
    });
  };

  if (boom) {
    boom.addEventListener('mousedown', pushPhoto);
    boom.addEventListener('touchstart', pushPhoto, { passive: false });
  }
}

