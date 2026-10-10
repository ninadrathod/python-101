// Python 101 — page behaviour: table of contents, mobile drawer, scroll spy,
// copy buttons, syntax highlighting, reading progress, back-to-top.
(() => {
  const sections = [...document.querySelectorAll('main section[id]')];
  const tocNavs = document.querySelectorAll('[data-toc]');

  /* ---------- Build the table of contents from the sections ---------- */
  const groups = new Map();
  sections.forEach((s) => {
    const group = s.dataset.group || 'Topics';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(s);
  });

  tocNavs.forEach((nav) => {
    groups.forEach((items, group) => {
      const block = document.createElement('div');
      block.className = 'mb-5';
      block.dataset.tocGroup = '';
      block.innerHTML = `<p class="px-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">${group}</p>`;
      items.forEach((s) => {
        const num = s.querySelector('.sec-num')?.textContent ?? '';
        const a = document.createElement('a');
        a.href = `#${s.id}`;
        a.className = 'toc-link';
        a.dataset.target = s.id;
        a.innerHTML = `<span class="font-mono text-[11px] text-slate-400 mr-2">${num}</span>${s.dataset.title}`;
        block.appendChild(a);
      });
      nav.appendChild(block);
    });
  });

  /* ---------- Filter the TOC ---------- */
  document.querySelectorAll('[data-toc-filter]').forEach((input) => {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll('[data-toc-filter]').forEach((other) => { other.value = input.value; });
      tocNavs.forEach((nav) => {
        nav.querySelectorAll('[data-toc-group]').forEach((block) => {
          let visible = 0;
          block.querySelectorAll('.toc-link').forEach((link) => {
            const section = document.getElementById(link.dataset.target);
            const match = !q || link.textContent.toLowerCase().includes(q) ||
              section.textContent.toLowerCase().includes(q);
            link.classList.toggle('hidden', !match);
            if (match) visible++;
          });
          block.classList.toggle('hidden', visible === 0);
        });
      });
    });
  });

  /* ---------- Mobile drawer ---------- */
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');

  const setDrawer = (open) => {
    drawer.classList.toggle('-translate-x-full', !open);
    overlay.classList.toggle('opacity-0', !open);
    overlay.classList.toggle('pointer-events-none', !open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('overflow-hidden', open);
  };

  openBtn.addEventListener('click', () => setDrawer(true));
  closeBtn.addEventListener('click', () => setDrawer(false));
  overlay.addEventListener('click', () => setDrawer(false));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setDrawer(false); });

  /* ---------- Scroll spy ---------- */
  const links = document.querySelectorAll('.toc-link');
  const setActive = (id) => {
    links.forEach((l) => {
      const on = l.dataset.target === id;
      l.classList.toggle('active', on);
      if (on && l.offsetParent) l.scrollIntoView({ block: 'nearest' });
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach((s) => observer.observe(s));

  /* ---------- Syntax highlighting + copy buttons ---------- */
  if (window.hljs) hljs.highlightAll();

  document.querySelectorAll('.code').forEach((block) => {
    const code = block.querySelector('code');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.className = 'absolute top-2.5 right-2.5 rounded-lg bg-white/90 border border-lavender-200 px-2.5 py-1 text-xs font-semibold text-lavender-700 hover:bg-lavender-100 transition';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.textContent = 'Copied!';
      } catch {
        btn.textContent = 'Press Ctrl+C';
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
    });
    block.appendChild(btn);
  });

  /* ---------- Reading progress + back to top ---------- */
  const progress = document.getElementById('progress');
  const toTop = document.getElementById('to-top');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    const show = window.scrollY > 600;
    toTop.classList.toggle('opacity-0', !show);
    toTop.classList.toggle('pointer-events-none', !show);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
