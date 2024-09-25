const elements = {
    projectCards: document.querySelectorAll('.project-card'),
    likedProjects: document.querySelector('#liked__projects .container'),
    menuCheckBox: document.getElementById('checkbox-menu'),
    projectContainer: document.querySelector('.project__container')
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

const swipeCB = (ele, action, x, y) => {
    const overlay = ele.querySelector('.swipe-overlay') || createOverlay(ele);

    if (action === 'moving') {
        if (Math.abs(y) >= Math.abs(x)) {
            return;
        }
        ele.style.transform = `translate(${x}px, 0) rotate(${x / 10}deg)`;
        updateOverlay(overlay, x);
    } else if (action === 'left') {
        const card = ele.cloneNode(true);
        card.removeAttribute("style");
        card.removeChild(card.querySelector('.swipe-overlay'));
        setTimeout(() => {
            elements.projectContainer.prepend(card);
            swipeHandler(card, swipeCB);
        }, 1200);
        ele.parentElement.removeChild(ele);
    } else if (action === 'right') {
        const card = ele.cloneNode(true);
        card.removeAttribute("style");
        card.className = 'card';
        card.removeChild(card.querySelector('.swipe-overlay'));
        ele.parentElement.removeChild(ele);
        resetLikedProjectsStyle();
        elements.likedProjects.appendChild(card);
    } else if (action === 'cancelled') {
        ele.style.transform = '';
        resetOverlay(overlay);
    }
    if (elements.likedProjects.childElementCount == 0) {
        elements.likedProjects.parentElement.style.display = 'none';
    } else {
        elements.likedProjects.parentElement.style.display = 'block';
    }
};

const createOverlay = (ele) => {
    const overlay = document.createElement('div');
    overlay.className = 'swipe-overlay';
    ele.appendChild(overlay);
    return overlay;
};

const updateOverlay = (overlay, deltaX) => {
    const opacity = Math.min(Math.abs(deltaX) / 100, 0.9);
    overlay.style.opacity = opacity;
    if (deltaX > 0) {
        overlay.innerHTML = '❤️';
        overlay.style.backgroundColor = `rgba(255, 45, 85, ${opacity})`;
        overlay.style.color = '#fff';
    } else {
        overlay.innerHTML = '✖️';
        overlay.style.backgroundColor = `rgba(88, 86, 214, ${opacity})`;
        overlay.style.color = '#fff';
    }
};

const resetOverlay = (overlay) => {
    overlay.style.opacity = 0;
    overlay.innerHTML = '';
    overlay.style.backgroundColor = 'transparent';
};


const resetLikedProjectsStyle = () => {
    elements.likedProjects.parentElement.style.cssText = 'height: auto; padding: 10px 1rem;';
    elements.likedProjects.style.cssText = 'height: auto; padding: 1rem 10px;';
};

const addSwipeHandler = () => {
    elements.projectCards.forEach((ele) => {
        swipeHandler(ele, swipeCB);
    });
}

addSwipeHandler();
const toggleMenu = () => {
    elements.menuCheckBox.checked = !elements.menuCheckBox.checked;
};
