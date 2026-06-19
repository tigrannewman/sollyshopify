document.addEventListener('DOMContentLoaded', function () {

  // ── Copyright year ───────────────────────────────────────────────
  const yrSpan = document.querySelector('.copy-year');
  if (yrSpan) yrSpan.textContent = new Date().getFullYear() + ' ';

  // ── FAQ accordion ────────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item     = question.closest('.faq-item');
      const answer   = item.querySelector('.faq-answer');
      const vLine    = question.querySelector('.faq-icon-line.is-vertical');
      const isOpen   = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        open.querySelector('.faq-answer').style.maxHeight = null;
        open.querySelector('.faq-icon-line.is-vertical').style.display = '';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        vLine.style.display = 'none';
      }
    });
  });

  // ── Swiper — Hero ────────────────────────────────────────────────
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

  // ── Swiper — Cases ───────────────────────────────────────────────
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

  // ── Cart count badge ─────────────────────────────────────────────
  function updateCartCount(count) {
    const badge = document.getElementById('nav-cart-count');
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Fetch current count on load
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) { updateCartCount(cart.item_count); });

  // ── Toast notification ───────────────────────────────────────────
  function showToast(message, isError) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
        'background:#1a1a1a', 'border:1px solid rgba(255,255,255,0.12)',
        'color:#fff', 'padding:14px 20px', 'border-radius:12px',
        'font-family:inherit', 'font-size:14px', 'font-weight:500',
        'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
        'transition:opacity 0.3s ease, transform 0.3s ease',
        'display:flex', 'align-items:center', 'gap:10px',
        'opacity:0', 'transform:translateY(8px)',
      ].join(';');
      document.body.appendChild(toast);
    }
    toast.style.borderColor = isError ? 'rgba(255,80,80,0.4)' : 'rgba(248,121,31,0.4)';
    toast.innerHTML = isError
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' + message
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F8791F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' + message;

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
    }, 3000);
  }

  // ── AJAX Add to Cart ─────────────────────────────────────────────
  document.querySelectorAll('form[action="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Adding…'; btn.disabled = true; }

      const data = new FormData(form);

      fetch('/cart/add.js', { method: 'POST', body: data })
        .then(function (r) {
          if (!r.ok) throw new Error('Failed');
          return r.json();
        })
        .then(function () {
          return fetch('/cart.js').then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          showToast('Added to cart!', false);
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.', true);
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
        });
    });
  });

  // ── Homepage grid: Add to Cart (static fallback cards) ──────────
  document.querySelectorAll('.perk-atc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var handle = btn.getAttribute('data-handle');
      if (!handle) return;
      var originalText = btn.textContent;
      btn.textContent = 'Adding…';
      btn.disabled = true;

      fetch('/products/' + handle + '.js')
        .then(function (r) { return r.json(); })
        .then(function (product) {
          var variantId = product.variants[0].id;
          var body = new FormData();
          body.append('id', variantId);
          body.append('quantity', 1);
          return fetch('/cart/add.js', { method: 'POST', body: body });
        })
        .then(function (r) {
          if (!r.ok) throw new Error('Failed');
          return fetch('/cart.js').then(function (r) { return r.json(); });
        })
        .then(function (cart) {
          updateCartCount(cart.item_count);
          showToast('Added to cart!', false);
          btn.textContent = originalText;
          btn.disabled = false;
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.', true);
          btn.textContent = originalText;
          btn.disabled = false;
        });
    });
  });

  // ── Product page: Buy Now ────────────────────────────────────────
  const buyNowBtn = document.querySelector('.btn-buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', function (e) {
      const form = document.getElementById('product-form');
      if (!form) return;
      e.preventDefault();
      fetch('/cart/add.js', { method: 'POST', body: new FormData(form) })
        .then(function () { window.location.href = '/checkout'; });
    });
  }

});
