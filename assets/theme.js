document.addEventListener('DOMContentLoaded', function () {

  // Auto copyright year
  const yrSpan = document.querySelector('.copy-year');
  if (yrSpan) yrSpan.textContent = new Date().getFullYear() + ' ';

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const verticalLine = question.querySelector('.faq-icon-line.is-vertical');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
        openItem.querySelector('.faq-icon-line.is-vertical').style.display = '';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        verticalLine.style.display = 'none';
      }
    });
  });

  // Swiper — Hero
  new Swiper('[swiper-home]', {
    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    autoplay: { delay: 2500, disableOnInteraction: false },
    navigation: {
      prevEl: '[swiper-prev-home]',
      nextEl: '[swiper-next-home]',
      disabledClass: 'swiper-button-disabled',
    },
  });

  // Swiper — Cases
  new Swiper('[swiper-case]', {
    slidesPerView: 1.2,
    spaceBetween: 16,
    grabCursor: true,
    navigation: {
      prevEl: '[swiper-prev-case]',
      nextEl: '[swiper-next-case]',
      disabledClass: 'swiper-button-disabled',
    },
    breakpoints: {
      768: { slidesPerView: 2.2, spaceBetween: 16 },
      1024: { slidesPerView: 3.2, spaceBetween: 24 },
    },
  });

});
