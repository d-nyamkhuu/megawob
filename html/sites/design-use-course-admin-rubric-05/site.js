// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base) => function (rng, content) {
      const label = base(rng, content);
      return rng.fork('human/end-label').bool(0.55) ? 'Save' : label;
    },
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      // Keep notices below the masthead and clear of the episode's end control.
      const headRect = document.querySelector('.ref-task').getBoundingClientRect();
      const end = document.querySelector('[data-role="submit"]');
      const endRect = end && end.getBoundingClientRect();
      const endAtBottom = endRect && endRect.top > window.innerHeight / 2;
      if (kind === 'banner') {
        document.querySelector('.ref-body').before(el);
        el.style.top = `${headRect.bottom}px`;
      }
      if (kind === 'toast') el.style.top = `${headRect.bottom + 12}px`;
      if (kind === 'cookie' && endAtBottom) el.style.right = `${window.innerWidth - endRect.left + 18}px`;
      if (kind === 'chat' && endAtBottom) el.style.bottom = `${window.innerHeight - endRect.top + 14}px`;
      if (kind === 'promo') {
        const stageRect = document.querySelector('.ref-stage').getBoundingClientRect();
        el.style.left = `${stageRect.left + stageRect.width / 2}px`;
        el.style.top = `${headRect.bottom + Math.max(15, (stageRect.height - 230) / 2)}px`;
      }
      if (kind === 'chat') {
        const title = util.el('div', 'human-chat-title', el, 'Ask a question'); el.prepend(title);
        const input = util.el('div', 'human-chat-input', el, 'Type a message...');
        util.el('span', '', input, '➤');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.nav': (base, S) => function (_c) {
      const { content, header, local, nav, rng, util } = _c;
      const { K } = S;
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      const n = header.querySelector('.ref-nav') || util.el('nav', 'ref-nav', header);
      n.replaceChildren();
      const icon = (body) => `<svg viewBox="0 0 34 38" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g stroke="#57594f" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
      const documentIcon = '<path fill="#f7faf9" d="M7 3h16l6 6v27H7z"/><path fill="#d4dde1" d="M23 3v7h6"/><path stroke="#748a96" d="M11 15h14M11 19h14M11 23h14M11 27h14M11 31h14"/>';
      const icons = [
        '<path fill="#f2ebe0" d="M7 17L17 7l10 10v18h-8V24h-6v11H7z"/><path fill="#df8e43" d="M3 17L17 3l14 14-3 3L17 9 6 20z"/><path fill="#a9c2cb" d="M21 23h4v6h-4z"/>',
        documentIcon,
        '<path fill="#a3c9d5" d="M15 22c0-6 4-10 9-10s8 4 8 10v8H15z"/><ellipse fill="#e4bc81" cx="23" cy="9" rx="6" ry="7"/><path fill="#d2b56d" d="M3 28c0-6 3-10 9-10s9 4 9 10v8H3z"/><ellipse fill="#f0ce91" cx="12" cy="16" rx="6" ry="7"/><path fill="#a6b58b" d="M4 30h15v6H4z"/>',
        '<path fill="#f9f5df" d="M3 4h28v31H3z"/><path fill="#a6bbc2" d="M3 4h28v6H3z"/><path d="M3 17h28M3 25h28M11 4v31M21 4v31"/><path stroke="#b7a06d" d="M5 12h4M13 12h6M23 12h6"/>',
        documentIcon,
        '<path fill="#d8bd87" d="M2 11h12l3 4h15v20H2z"/><path fill="#e9d5aa" d="M2 11V7h11l4 4h14v6H2z"/><path stroke="#b9a06e" d="M4 32h26"/>',
        '<path fill="#d7b264" d="M4 23h6v12H4z"/><path fill="#8fb7cd" d="M13 13h6v22h-6z"/><path fill="#bc6464" d="M22 4h6v31h-6z"/><path stroke="#3f4644" d="M2 36h30"/>',
      ];
      for (const [i, label] of ['Home', 'Course', 'Students', 'Gradebook', 'Assessments', 'Modules', 'Reports'].entries()) {
        const a = util.el('a', 'ref-navlink', n); a.href = '#';
        a.innerHTML = icon(icons[i]); util.el('span', '', a, label);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      }
      // Keep all seeded navigation draws while using the application's compact title.
      const masthead = header.querySelector('.ref-brand') || util.el('div', 'ref-brand', header);
      masthead.replaceChildren();
      const logo = util.el('span', 'ref-college', masthead);
      logo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#e78435" stroke="#f7b77d"/><circle cx="12" cy="12" r="6" fill="none" stroke="#fff9e8" stroke-width="2.4"/><g fill="#fff9e8" stroke="#e78435" stroke-width="1.4"><circle cx="6.2" cy="8.4" r="2.4"/><circle cx="17.8" cy="8.4" r="2.4"/><circle cx="12" cy="18.7" r="2.4"/></g></svg>';
      util.el('span', 'ref-course', masthead, 'Cedar Ridge LMS');
      const controls = util.el('div', 'gnome-window-buttons', header);
      for (const [label, glyph] of [['Minimize', '−'], ['Maximize', '□'], ['Close', '×']]) {
        const button = util.el('button', '', controls, glyph); button.type = 'button';
        button.setAttribute('aria-label', label); button.title = label;
      }
      const course = masthead;
      Object.assign(_c, { course, masthead });
    },
    'frame.end': (base) => function (_c) {
      const result = base(_c);
      const toolbar = _c.header.querySelector('.ref-nav');
      if (toolbar && _c.headerTools) toolbar.append(_c.headerTools);
      const liftFooterTools = () => {
        for (const control of document.querySelectorAll('.ref-foot .ref-xtra')) _c.headerTools.append(control);
      };
      if (!result.submit || _c.ctx.finish) { liftFooterTools(); return result; }
      const placement = _c.ctx.rng.fork('human/end-placement').pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      let parent;
      if (placement === 'header' || placement === 'icon') { parent = _c.headerTools; liftFooterTools(); }
      else {
        let footer = document.querySelector('.ref-foot');
        if (!footer) footer = _c.util.el('footer', 'ref-foot', document.body);
        parent = footer.querySelector('.ref-tools') || _c.util.el('div', 'ref-tools', footer);
      }
      parent.append(result.submit);
      result.submit.className = placement === 'link' ? 'ref-endlink' : placement === 'icon' ? 'ref-submit ref-icon' : 'ref-submit';
      result.submit.textContent = placement === 'link' ? `${_c.label} ›` : placement === 'icon' ? '✓' : _c.label;
      for (const dock of document.querySelectorAll('.ref-float-dock')) if (!dock.children.length) dock.remove();
      return result;
    },
  };

  env.site({
    name: 'design-use-course-admin-rubric-05',
    template: 'site/base',
    design: { parts },
  });
})();
