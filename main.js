console.log("hello world");


// document.addEventListener('DOMContentLoaded', function () {
//     const container = document.querySelector('.container'); // .MAIN is a class since I think It could be more useful

//     container.addEventListener('wheel', function (event) {
//         if (event.deltaY !== 0) {
//             event.preventDefault();
//             container.scrollLeft += event.deltaY * 10;
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container'); // Assuming .MAIN is the container for #projects
    const projects = document.querySelector('#projects');
    const projectCards = document.querySelectorAll('.project-card');

    let currentScrollPosition = 0;
    const cardWidth = projectCards[0].offsetWidth + 20; // Card width + margin

    container.addEventListener('wheel', function (event) {
        event.preventDefault();

        // Scroll down (next card)
        if (event.deltaY > 0) {
            currentScrollPosition += cardWidth;
            if (currentScrollPosition > (projects.scrollWidth - container.offsetWidth)) {
                currentScrollPosition = projects.scrollWidth - container.offsetWidth; // Don't scroll past the last card
            }
        }

        // Scroll up (previous card)
        if (event.deltaY < 0) {
            currentScrollPosition -= cardWidth;
            if (currentScrollPosition < 0) {
                currentScrollPosition = 0; // Don't scroll past the first card
            }
        }

        projects.scrollTo({
            left: currentScrollPosition,
            behavior: 'smooth'
        });
    });
});
