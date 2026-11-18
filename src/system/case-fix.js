/* ──────────────────────────────────────────────────────────────
   Case studies: reveal-on-scroll that cannot strand the content,
   and images that are never left unfetched.

   The pages hid every .reveal section with opacity:0 and relied on
   an IntersectionObserver to restore it. When that observer stayed
   silent the section never came back, and because its images are
   loading="lazy" they were never requested either.

   The logic is inverted here. The stylesheet hides nothing on its
   own; an element is only hidden once this script adds .armed to it,
   which happens one element at a time immediately before observing.
   Any failure — script blocked, exception, no observer — simply
   leaves the page visible.
   ────────────────────────────────────────────────────────────── */
(function () {
  /* Case-study pages are a portfolio: someone reviewing this will not
     wait for images to trickle in on scroll, and one page had images
     that could never load at all (styled height:100%/width:auto, they
     measure zero wide until loaded, so lazy loading never fired).
     Everything is fetched straight away instead of being deferred. */
  function eagerImages() {
    var imgs = [].slice.call(document.querySelectorAll('img'));
    imgs.forEach(function (img, n) {
      if (img.getAttribute('loading') === 'lazy') img.setAttribute('loading', 'eager');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (n < 4 && !img.getAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'high');
      var src = img.getAttribute('src');
      if (src && !img.complete) img.src = src;   /* kick any stalled fetch */
    });
  }
  /* run before DOMContentLoaded too, so fetches start as early as possible */
  eagerImages();
  document.addEventListener('readystatechange', eagerImages);


  /* ── Back control ───────────────────────────────────────────
     The nav bar is gone; this replaces it. Each page centres its
     content differently, so rather than guess a width the control
     measures the first real content block and lines up with its
     left edge. ────────────────────────────────────────────── */
  function backControl() {
    if (document.querySelector('.case-back')) return;

    var a = document.createElement('a');
    a.className = 'case-back';
    a.href = 'home-v2.html';
    a.setAttribute('aria-label', 'Back to work');
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M15 5l-7 7 7 7"/></svg><span>Back</span>';

    /* prefer real history, so the reader returns where they came from */
    a.addEventListener('click', function (e) {
      if (document.referrer && history.length > 1) {
        try {
          var from = new URL(document.referrer);
          if (from.origin === location.origin) { e.preventDefault(); history.back(); }
        } catch (err) { /* fall through to the href */ }
      }
    });

    document.body.appendChild(a);

    function align() {
      if (window.innerWidth <= 680) return;          /* phone: pinned by CSS */
      var iw = window.innerWidth;

      /* The left edge we want is where the reader's eye starts, which is
         the text column. Some pages are full bleed at the top, so a
         container's own left edge can be 0 and tells us nothing. Take
         the first candidate whose inset looks like a real margin. */
      function edgeOf(sel) {
        var els = document.querySelectorAll(sel);
        for (var i = 0; i < els.length; i++) {
          var r = els[i].getBoundingClientRect();
          if (r.width < 80 || r.height < 8) continue;
          if (r.left > 8 && r.left < iw * 0.42) return r.left;
        }
        return null;
      }

      /* the page title is the truest marker of where reading begins */
      var left = edgeOf('.wrap') ||
                 edgeOf('h1') ||
                 edgeOf('.sec, main > section, article') ||
                 edgeOf('h2') ||
                 edgeOf('p');

      if (left != null) a.style.left = Math.round(left) + 'px';
    }
    align();
    addEventListener('resize', align);
    addEventListener('load', align);
    setTimeout(align, 600);
  }

  function start() {
    backControl();
    var items, io;

    try {
      items = [].slice.call(document.querySelectorAll('.reveal'));
    } catch (e) { return; }
    if (!items.length) return;

    function show(el) {
      if (!el) return;
      el.classList.add('visible');
      el.classList.remove('armed');
    }
    function showAll() { items.forEach(show); }

    /* Give up on animating and just show everything. Used whenever
       anything looks wrong, so content is never the thing that loses. */
    function bailOut() { showAll(); }

    if (!('IntersectionObserver' in window)) { bailOut(); return; }

    var vh = window.innerHeight || 800;

    try {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { rootMargin: '300px 0px 300px 0px', threshold: 0 });
    } catch (e) { bailOut(); return; }

    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      /* already on screen: show it now, never animate it in late */
      if (r.top < vh * 1.2 && r.bottom > -vh * 0.2) { show(el); return; }
      el.classList.add('armed');          /* only now is it allowed to hide */
      try { io.observe(el); } catch (e) { show(el); }
    });

    /* belt and braces: a plain scroll handler, and a hard deadline */
    function sweep() {
      var h = window.innerHeight || 0;
      items.forEach(function (el) {
        if (el.classList.contains('visible')) return;
        var r = el.getBoundingClientRect();
        if (r.top < h * 1.2 && r.bottom > -h * 0.2) show(el);
      });
    }
    addEventListener('scroll', sweep, { passive: true });
    addEventListener('resize', sweep);
    addEventListener('load', sweep);
    setTimeout(sweep, 1200);
    setTimeout(bailOut, 6000);

    eagerImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
