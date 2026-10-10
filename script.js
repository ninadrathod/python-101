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
      block.innerHTML = `<p class="px-3 mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500">${group}</p>`;
      items.forEach((s) => {
        const num = s.querySelector('.sec-num')?.textContent ?? '';
        const a = document.createElement('a');
        a.href = `#${s.id}`;
        a.className = 'toc-link';
        a.dataset.target = s.id;
        a.innerHTML = `<span class="font-mono text-[11px] text-zinc-600 mr-2">${num}</span>${s.dataset.title}`;
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

  const langNames = { python: 'python', bash: 'shell', html: 'html', text: 'stdin' };

  document.querySelectorAll('.code').forEach((block) => {
    const code = block.querySelector('code');
    const lang = (code.className.match(/language-(\w+)/) || [])[1] || 'text';

    // Terminal-style title bar: traffic lights, language, copy button.
    const bar = document.createElement('div');
    bar.className = 'flex items-center gap-1.5 px-3 py-1.5 border-b border-line bg-panel';
    bar.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-err-500/80"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-num-500/80"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-term-500/80"></span>
      <span class="ml-2 font-mono text-[11px] text-zinc-500">${langNames[lang] || lang}</span>`;
    block.prepend(bar);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', 'Copy code');
    btn.className = 'ml-auto rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-zinc-400 hover:text-term-700 hover:border-term-300 transition';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        btn.textContent = 'copied ✓';
      } catch {
        btn.textContent = 'press ctrl+c';
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setTimeout(() => { btn.textContent = 'copy'; }, 1600);
    });
    bar.appendChild(btn);
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
