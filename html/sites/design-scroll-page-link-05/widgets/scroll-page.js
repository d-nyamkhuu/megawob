// Link design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-link-05',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  template: 'scroll-page/longform',
  design: {
    minimumWidth: 0,
    widthInset: 32,
    columnWidth: [1640, 1860],
    fontFamily: 'Georgia, "Times New Roman", serif',
    bodySize: 21,
    sectionTitleSize: 31,
    parts: {
      frame: (base) => function (st) {
        const frame = base(st);
        frame.wrap.style.marginTop = '0';
        return frame;
      },
      header: (base) => function (st) {
        const head = base(st);
        const { el } = st;
        const banner = el('div', 'en-banner', head);
        const logo = el('div', 'en-wordmark', banner);
        el('span', 'en-leaf', logo).setAttribute('aria-hidden', 'true');
        const name = el('div', 'en-name', logo);
        el('div', '', name, 'EverNote');
        el('span', 'en-tagline', name, 'Remember Everything');
        el('p', 'en-description', banner, "EverNote helps you capture ideas, keep your notes organized, and access them anywhere. Whether you're at home, at work, or on the go, your notes are always within reach.");
        head.prepend(banner);
        const context = el('div', 'en-context', head);
        for (const node of [...head.children]) {
          if (node !== banner && node !== context) context.append(node);
        }
        return head;
      },
      toc: (base) => function (st) {
        base(st);
        let toc = st.sideNav || st.main.querySelector('.ps-toc');
        if (!toc) {
          st.main.classList.add('en-without-contents');
          return;
        }
        toc.classList.add('en-contents');
        if (st.spec.kind === 'terms') toc.classList.add('en-numbered');
        const label = toc.querySelector('b,h4');
        if (label) label.textContent = 'Contents';
        else toc.prepend(st.el('b', '', null, 'Contents'));
        st.main.append(toc);
      },
      spacer: (base) => function (st) {
        const spacer = base(st);
        spacer.classList.add('en-spacer');
        st.main.append(spacer);
        return spacer;
      },
      section: (base) => function (st, s, i) {
        const sec = base(st, s, i);
        sec.classList.add('en-section');
        const heading = sec.querySelector('h2');
        if (st.spec.kind !== 'terms') heading.prepend((i + 1) + '. ');
        if (i === 0) {
          sec.classList.add('en-first-section');
          const copy = st.el('div', 'en-getting-copy', null);
          const media = st.el('div', 'en-getting-media', sec);
          st.el('div', 'en-notebook', media).setAttribute('aria-hidden', 'true');
          media.append(copy);
          const paragraphs = [...sec.children].filter(n => n.tagName === 'P');
          paragraphs.slice(1).forEach(p => copy.append(p));
          const actions = sec.querySelector(':scope > .ps-acts');
          if (actions) copy.append(actions);
          if (paragraphs.length < 2) {
            const list = st.el('ul', 'en-benefits', copy);
            for (const [a, b] of [['Create notes', 'Jot down thoughts, save web articles, or keep track of tasks.'], ['Organize with tags', 'Group related notes for easy access.'], ['Access anywhere', 'Your notes are synced securely across all your devices.']]) {
              const li = st.el('li', '', list);
              st.el('strong', '', li, a);
              li.append(' — ' + b);
            }
          }
        }
        if (i === 1) {
          const intro = st.el('p', 'en-feature-intro', null, 'EverNote is designed to help you remember what matters. Here are some of the things you can do:');
          const grid = st.el('div', 'en-features', sec);
          const paths = {
            note: '<rect x="9" y="7" width="25" height="32" rx="2" fill="url(#paper)"/><path d="M15 3v9m6-9v9m6-9v9M14 17h15m-15 6h12m-12 6h9"/><path d="m25 31 13-17 5 4-14 17-6 2z" fill="#d9ac5b" stroke="#81663c"/>',
            cloud: '<path d="M12 34C1 34 2 18 13 18 14 4 33 3 35 18c15-1 18 16 6 16z" fill="url(#paper)"/>',
            tag: '<path d="m5 24 21-20h15v17L20 42z" fill="url(#blue)"/><path d="m10 25 19-19h10v13L20 37z" fill="#f4f0df" stroke="none"/><circle cx="34" cy="12" r="2.5" fill="#5a8091" stroke="none"/>',
            people: '<g fill="url(#blue)" stroke-width="1"><ellipse cx="24" cy="12" rx="6" ry="8"/><ellipse cx="9" cy="16" rx="4" ry="6"/><ellipse cx="40" cy="16" rx="4" ry="6"/><path d="M14 40v-6c0-15 22-15 22 0v6zM1 36v-6c0-9 10-11 13-5l-3 11zm37 0-2-11c5-6 12-3 12 5v6z"/></g>',
            search: '<circle cx="20" cy="18" r="14" fill="url(#paper)"/><path d="m31 30 12 13" stroke-width="7"/><path d="M11 20a10 10 0 0 1 11-12" stroke="#fff" stroke-width="2"/>',
            lock: '<path d="M14 22V12C14-2 35-2 35 12v10" fill="none" stroke-width="4"/><rect x="10" y="20" width="30" height="25" rx="3" fill="url(#blue)"/><path d="M24 29v9" stroke="#fff8df" stroke-width="4"/><circle cx="24" cy="29" r="3" fill="#fff8df" stroke="none"/>'
          };
          for (const [icon, title, text] of [['note','Rich Notes','Add text, images, checklists, and more.'],['cloud','Sync Across Devices','Your notes are always up to date.'],['tag','Tags','Keep your notes organized with flexible tags.'],['people','Share Notes','Work together with friends and colleagues.'],['search','Powerful Search','Find what you need, fast.'],['lock','Keep It Secure','Your data is encrypted and private.']]) {
            const item = st.el('div', 'en-feature', grid);
            const art = st.el('span', 'en-feature-icon', item);
            art.innerHTML = '<svg viewBox="0 0 50 50" fill="none" stroke="#496e80" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffdf2"/><stop offset="1" stop-color="#e5deca"/></linearGradient><linearGradient id="blue" x2="0" y2="1"><stop stop-color="#789aaa"/><stop offset="1" stop-color="#3e6275"/></linearGradient></defs>' + paths[icon] + '</svg>';
            const caption = st.el('div', '', item);
            st.el('strong', '', caption, title);
            st.el('span', '', caption, text);
          }
          heading.after(intro, grid);
        }
        return sec;
      },
      // Install the account-page layout before construction, leaving every seeded
      // control and the template's scrolling, recovery and targeting intact.
      styles: (base) => function (ctx) {
        base(ctx);
        if (document.getElementById('maple-page-layout')) return;
        const style = document.createElement('style');
        style.id = 'maple-page-layout';
        style.textContent = `
          .ps-wrap { margin:0; }
          .ps-wrap.docs, .ps-wrap.rail { display:block; }
          .ps-title { display:block; margin:0; padding:0; box-sizing:border-box; overflow-wrap:anywhere; }
          .ps-sec { position:relative; display:grid; grid-template-columns:58px minmax(0,1fr);
            column-gap:12px; padding:10px 0 8px; }
          .ps-sec::before { grid-column:1; grid-row:1 / span 5; justify-self:start; padding-top:3px; }
          .ps-sec > h2, .ps-sec > p, .ps-sec > .ps-acts, .ps-sec > .ps-card,
          .ps-sec > .ps-pane, .ps-sec > .ps-sib, .ps-sec > .ps-faq { grid-column:2; }
          .ps-sec h2 { margin:0 0 1px; }
          .ps-sec p { margin:0 0 3px; }
          .ps-sec .ps-acts { margin:2px 0 3px; }
          .ps-sec .ps-btn { padding:0; }
          .ps-sec .ps-sec { display:block; }
          @media(max-width:1100px) {
            .ps-title { min-height:170px; padding:26px; }
            .ps-sec { grid-template-columns:42px minmax(0,1fr); column-gap:7px; }
          }
        `;
        document.head.append(style);
      },
    },
  },
});
