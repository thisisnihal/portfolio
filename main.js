document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelector('#projects');
    const likedProjects = document.querySelector('#liked__projects .container');
    let activeCard = null;
    let startX, startY;
    let isDragging = false;

    if (likedProjects && likedProjects.parentElement) {
        likedProjects.parentElement.style.display = 'none';
    }

    const getClientCoords = (e) => e.type.startsWith('touch') ?
        { x: e.touches[0].clientX, y: e.touches[0].clientY } :
        { x: e.clientX, y: e.clientY };

    const handleStart = (e) => {
        activeCard = e.currentTarget;
        if (activeCard.className === 'card') return;
        isDragging = true;
        const { x, y } = getClientCoords(e);
        startX = x;
        startY = y;
        activeCard.style.transition = 'none';
    };

    const handleMove = (e) => {
        if (!isDragging || !activeCard) return;

        const { x, y } = getClientCoords(e);
        const dx = x - startX;
        const dy = y - startY;

        requestAnimationFrame(() => {
            if (activeCard) {
                activeCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 10}deg)`;
            }
        });
    };

    const handleEnd = () => {
        if (!isDragging || !activeCard) return;

        isDragging = false;
        const swipeThreshold = window.innerWidth / 6;

        const { left: startLeft } = activeCard.getBoundingClientRect();
        const horizontalDistance = startLeft - startX;
        const swipeDirection = horizontalDistance < 0 ? -1 : 1;

        if (Math.abs(horizontalDistance) > swipeThreshold) {
            activeCard.style.transform = `translate(${swipeDirection * 150}vw, ${window.innerHeight / 2}px) rotate(${swipeDirection * 30}deg)`;

            if (swipeDirection < 0 && likedProjects) {
                const cardToPush = activeCard.cloneNode(true);
                cardToPush.removeAttribute("style");
                cardToPush.className = 'card';
                likedProjects.appendChild(cardToPush);
                if (likedProjects.parentElement) {
                    likedProjects.parentElement.style.cssText = 'height: 600px; padding: 85px 1rem;';
                    likedProjects.style.cssText = 'height: 100%; padding:1rem 10px;';
                }
            }

            setTimeout(() => {
                if (activeCard && activeCard.parentElement === projects) {
                    projects.removeChild(activeCard);
                }
            }, 500);

        } else if (activeCard) {
            activeCard.style.transition = 'transform 0.5s ease';
            activeCard.style.transform = 'translate(0, 0) rotate(0)';
        }

        activeCard = null;
    };

    const addEventListeners = (card) => {
        card.addEventListener('mousedown', handleStart);
        card.addEventListener('touchstart', handleStart);
    };

    if (projects) {
        projects.addEventListener('mousemove', handleMove);
        projects.addEventListener('touchmove', handleMove);
        projects.querySelectorAll('.project-card').forEach(addEventListeners);
    }

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
});