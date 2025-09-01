window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });


  document.addEventListener('DOMContentLoaded', function () {
    // Inicializar Typed.js
    new Typed('#typed-text', {
      strings: [
        "Desarrolla Apps iOS Profesionales con SwiftUI",
      ],
      typeSpeed: 90, // Velocidad de escritura (ms)
      backSpeed: 30, // Velocidad de borrado (ms)
      backDelay: 1000, // Retardo antes de borrar (ms)
      loop: false, // No repetir el ciclo
      showCursor: true, // Mostrar cursor parpadeante
      cursorChar: '|', // Carácter del cursor
      onComplete: function () {
        // Ocultar el cursor al finalizar
        document.querySelector('.typed-cursor').style.display = 'none';
      }
    });
  });