const elements = {
    projectCards: document.querySelectorAll('.project-card'),
    likedProjects: document.querySelector('#liked__projects .container'),
    menuCheckBox: document.getElementById('checkbox-menu'),
    projectContainer: document.querySelector('.project__container'),
    cardImages: document.querySelectorAll('.project-image')
};


function swipeHandler(ele, onSwipeCallback) {
    let coordX = 0;
    let coordY = 0;
    let startX = 0, startY = 0;
    const threshold = 80;
    let dragging = false;

    function onStart(event) {
        if (event.type === 'touchstart') {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        } else {
            startX = event.clientX;
            startY = event.clientY;
        }
        coordX = 0;
        coordY = 0;
        dragging = true;
    }

    function onMove(event) {
        if (!dragging) return;
        if (event.type === 'touchmove') {
            coordX = event.touches[0].clientX - startX;
            coordY = event.touches[0].clientY - startY;
        } else {
            coordX = event.clientX - startX;
            coordY = event.clientY - startY;
        }
        if (typeof onSwipeCallback === 'function') {
            onSwipeCallback(ele, 'moving', coordX, coordY);
        }
    }

    function onEnd() {
        dragging = false;
        let direction = 'cancelled';
        if (Math.abs(coordX) > Math.abs(coordY)) {
            if (Math.abs(coordX) > threshold) {
                direction = coordX > 0 ? 'right' : 'left';
            }
        } else {
            if (Math.abs(coordY) > threshold) {
                direction = coordY > 0 ? 'down' : 'up';
            }
        }

        if (typeof onSwipeCallback === 'function') {
            onSwipeCallback(ele, direction, coordX, coordY);
        }
    }

    ele.addEventListener('touchstart', onStart, false);
    ele.addEventListener('mousedown', onStart, false);
    ele.addEventListener('touchmove', onMove, false);
    ele.addEventListener('mousemove', onMove, false);
    ele.addEventListener('touchend', onEnd, false);
    ele.addEventListener('mouseup', onEnd, false);
}

const toggleMenu = () => {
    elements.menuCheckBox.checked = !elements.menuCheckBox.checked;
};

elements.projectContainer.addEventListener('wheel', (event) => {
    const container = elements.projectContainer;
    
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
    
    if ((event.deltaY > 0 && !canScrollRight) || (event.deltaY < 0 && !canScrollLeft)) {
      return; 
    }
    event.preventDefault();
    container.scrollLeft += event.deltaY;
  });


const overlay = document.createElement('div');

overlay.classList.add('overlay');
document.body.appendChild(overlay);

elements.cardImages.forEach(image => {
    image.addEventListener('click', () => {
      if (image.classList.contains('enlarged')) {
        image.classList.remove('enlarged');   
        overlay.classList.remove('active');   
      } else {
        document.querySelectorAll('.enlarged').forEach(enlargedImage => {
          enlargedImage.classList.remove('enlarged');
        });
  
        image.classList.add('enlarged');      
        overlay.classList.add('active');     
      }
    });
  });