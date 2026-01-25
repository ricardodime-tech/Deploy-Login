document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;

    // Configura a largura dos slides dinamicamente
    const updateSlidePosition = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    // Função para ir para um slide específico
    const moveToSlide = (index) => {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSlidePosition();
    };
	
	// No seu carousel.js, adicione esta linha ao final para garantir o cálculo inicial correto
     window.addEventListener('load', updateSlidePosition);

    // Eventos dos botões
    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    // Auto-play (opcional: muda de slide a cada 5 segundos)
    let autoPlay = setInterval(() => {
        moveToSlide(currentIndex + 1);
    }, 5000);

    // Pausar auto-play quando o usuário interagir
    const resetTimer = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, 5000);
    };

    nextButton.addEventListener('click', resetTimer);
    prevButton.addEventListener('click', resetTimer);

    // Ajustar se a janela mudar de tamanho
    window.addEventListener('resize', updateSlidePosition);
	
	
	

});

