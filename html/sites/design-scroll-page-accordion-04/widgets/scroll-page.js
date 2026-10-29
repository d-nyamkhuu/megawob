// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-accordion-04',
  name: 'design',
  split: 'train',
  scenarios: ['accordion'],
  template: 'scroll-page/longform',
  design: {
    foreground: '#252b34',
    muted: '#42536b',
    accent: '#0085ff',
    panel: '#ffffff',
    background: '#ffffff',
    line: '#dce1e6',
    parts: {
      frame: (base) => (st) => {
        // Free-text refusals cannot contain a question mark. Prefer an existing
        // punctuation-free alias while retaining the complete accepted-name set.
        const missingNames = st.spec.judge && st.spec.judge.what;
        if (Array.isArray(missingNames)) {
          const preferred = missingNames.findIndex((name) => !name.includes('?'));
          if (preferred > 0) missingNames.unshift(...missingNames.splice(preferred, 1));
        }
        const frame = base(st);
        frame.wrap.style.width = '100%';
        frame.main.style.width = '100%';
        frame.wrap.style.marginTop = '0';
        const bar = st.el('div', 'metro-scrollbar', st.ctx.stage);
        const up = st.el('button', 'metro-scroll-up', bar, '⌃');
        up.type = 'button';
        up.setAttribute('aria-label', 'Scroll up');
        const track = st.el('div', 'metro-scroll-track', bar);
        const thumb = st.el('div', 'metro-scroll-thumb', track);
        const down = st.el('button', 'metro-scroll-down', bar, '⌄');
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll down');
        up.addEventListener('click', () => window.scrollBy({ top: -120, behavior: 'instant' }));
        down.addEventListener('click', () => window.scrollBy({ top: 120, behavior: 'instant' }));
        track.addEventListener('click', (event) => {
          if (event.target !== track) return;
          const rect = track.getBoundingClientRect();
          const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          window.scrollTo({ top: max * Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), behavior: 'instant' });
        });
        let drag = null;
        thumb.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          drag = { y: event.clientY, scroll: window.scrollY };
          thumb.setPointerCapture(event.pointerId);
        });
        thumb.addEventListener('pointermove', (event) => {
          if (!drag) return;
          const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const travel = track.clientHeight - thumb.clientHeight;
          window.scrollTo({ top: drag.scroll + (event.clientY - drag.y) * max / Math.max(1, travel), behavior: 'instant' });
        });
        thumb.addEventListener('pointerup', () => { drag = null; });
        thumb.addEventListener('pointercancel', () => { drag = null; });
        st.metroScroll = { track, thumb };
        return frame;
      },
      header: (base) => (st) => {
        const head = base(st);
        const note = document.querySelector('.ref-task > .ref-instruction');
        if (note) head.insertBefore(note, head.querySelector('.ps-title'));
        const description = st.el('div', 'metro-description', head,
          'Find help, get answers, and troubleshoot common problems with Microsoft products and services.');
        head.insertBefore(description, head.querySelector('.ps-meta'));
        return head;
      },
      spacer: (base) => (st) => {
        const opening = base(st);
        opening.className = 'metro-opening';
        opening.removeAttribute('style');
        opening.replaceChildren();
        const hero = st.el('div', 'metro-hero', opening);
        const scene = st.el('div', 'metro-hero-scene', hero);
        scene.innerHTML = '<svg viewBox="0 0 1160 114" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="sky" x2=".9" y2="1"><stop stop-color="#e6f1fa"/><stop offset="1" stop-color="#bcdcf2"/></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#83b5d2"/><stop offset=".5" stop-color="#3b7296"/><stop offset="1" stop-color="#123e5d"/></linearGradient><pattern id="windows" width="33" height="39" patternUnits="userSpaceOnUse"><rect width="33" height="39" fill="url(#glass)"/><path d="M0 0H33V39H0Z" fill="none" stroke="#a5adb1" stroke-width="2"/><path d="M3 3V36" stroke="#2e566e" stroke-width="2"/></pattern><filter id="cloud"><feGaussianBlur stdDeviation="8"/></filter></defs><rect width="1160" height="114" fill="url(#sky)"/><g fill="#fff" opacity=".55" filter="url(#cloud)"><ellipse cx="155" cy="12" rx="98" ry="15"/><ellipse cx="595" cy="61" rx="130" ry="18"/><ellipse cx="753" cy="8" rx="70" ry="16"/></g><path d="M692 114V86L874 0H1160V114Z" fill="url(#windows)"/><g transform="translate(905 35) skewY(-15)"><rect width="13" height="17" fill="#f25022"/><rect x="15" width="13" height="17" fill="#7fba00"/><rect y="19" width="13" height="17" fill="#00a4ef"/><rect x="15" y="19" width="13" height="17" fill="#ffb900"/><text x="34" y="28" fill="white" font-family="Segoe UI,Arial,sans-serif" font-size="33">Microsoft</text></g><g fill="#38582b" opacity=".85"><path d="M1087 114l10-42 9 15 6-27 10 26 14-11 1 20 20-10-1 29Z"/><path d="M1131 114l-18-44 20 17 7-43 11 40 9-16v46Z"/></g></svg>';
        st.el('div', 'metro-hero-title', hero, 'How can we help you?');
        const search = st.el('div', 'metro-hero-search', hero);
        st.el('span', '', search, 'Search help topics');
        st.el('span', 'metro-search-icon', search);
        const topics = st.el('section', 'metro-popular', opening);
        st.el('h2', '', topics, 'Popular topics');
        const links = st.el('div', 'metro-popular-links', topics);
        for (const label of ['Set up a new device', 'Manage your Microsoft account', 'Install Microsoft 365',
          'Fix a Windows problem', 'Get help with the Microsoft Store', 'Troubleshoot Office apps']) {
          const link = st.el('a', '', links, label);
          link.href = '#';
          link.addEventListener('click', (event) => { event.preventDefault(); env.log('decoy', { label }); });
        }
        return opening;
      },
      faq: (base) => (st) => {
        base(st);
        st.main.insertBefore(st.faqEl, st.main.querySelector('.ps-sec'));
      },
      fitPage: (base) => (st) => {
        // Preserve all seeded toolbar actions and metadata in the document's details area.
        const details = st.el('section', 'metro-page-details', null);
        details.append(st.head.querySelector('.ps-meta'), st.head.querySelector('.ps-tools'));
        const contents = st.main.querySelector('.ps-toc');
        if (contents) details.append(contents);
        if (st.sideNav) {
          st.sideNav.className = 'ps-toc';
          details.append(st.sideNav);
        }
        st.main.insertBefore(details, st.faqEl.nextSibling);
        base(st);
      },
      onScroll: (base) => (st) => {
        base(st);
        if (!st.metroScroll) return;
        const { track, thumb } = st.metroScroll;
        const root = document.documentElement;
        const height = Math.max(30, track.clientHeight * root.clientHeight / root.scrollHeight);
        thumb.style.height = height + 'px';
        thumb.style.top = (track.clientHeight - height) * window.scrollY / Math.max(1, root.scrollHeight - root.clientHeight) + 'px';
      },
    },
  },
});
