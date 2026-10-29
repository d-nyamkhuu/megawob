(function () {
  'use strict';
  env.site({
    name: 'design-click-control-button-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref mac';
      const shell = u.el('main', 'shell', document.body);
      // menu bar
      const mb = u.el('header', 'menubar', shell);
      const apple = u.el('span', 'apple', mb);
      apple.innerHTML =
        '<svg viewBox="0 0 22 26"><defs><clipPath id="apple-shape"><path d="M11 7C4 3 0 10 3 17c2 6 4 8 8 6 4 2 6-1 8-5-5-2-5-7-1-9-2-3-5-3-7-2z"/></clipPath></defs><g clip-path="url(#apple-shape)"><path fill="#65b43c" d="M0 0h22v10H0z"/><path fill="#f7da32" d="M0 10h22v3H0z"/><path fill="#f49a30" d="M0 13h22v3H0z"/><path fill="#df4649" d="M0 16h22v3H0z"/><path fill="#9a439d" d="M0 19h22v3H0z"/><path fill="#4b84c3" d="M0 22h22v4H0z"/></g><path d="M11 7C4 3 0 10 3 17c2 6 4 8 8 6 4 2 6-1 8-5-5-2-5-7-1-9-2-3-5-3-7-2z" fill="none" stroke="#333" stroke-width=".8"/><path d="M11 6c-1-3 2-5 5-5 0 3-2 5-5 5" fill="#62a63d" stroke="#333" stroke-width=".6"/></svg>';
      ['Survey', 'File', 'Edit', 'View', 'Window', 'Help'].forEach((s, i) =>
        u.el('span', 'mi' + (i === 0 ? ' app' : ''), mb, s),
      );
      u.el('span', 'clock', mb, '10:24 AM');
      const vol = u.el('span', 'vol', mb);
      vol.innerHTML =
        '<svg viewBox="0 0 24 18"><path d="M2 6h4l5-4v14l-5-4H2z" fill="#222"/><path d="M14 5c2 2 2 6 0 8M17 3c3 3 3 9 0 12" stroke="#222" stroke-width="1.6" fill="none"/></svg>';

      // desktop: main window
      const win = u.el('section', 'win', shell);
      const tb = u.el('div', 'titlebar', win);
      u.el('i', 'zoom', tb);
      u.el('i', 'zoom', tb);
      u.el('i', 'zoom', tb);
      u.el('span', 'ttl', tb, 'Customer Feedback');
      const cl = u.el('i', 'closebox', tb);
      cl.innerHTML = '<svg viewBox="0 0 12 12"><path d="m2 2 8 8M10 2 2 10" stroke="#222" stroke-width="1.5"/></svg>';
      const tool = u.el('div', 'toolbar', win);
      [
        [
          'New',
          '<path d="M5 2h12l6 6v22H5z" fill="#fff" stroke="#444" stroke-width="1.5"/><path d="M17 2v6h6" fill="none" stroke="#444" stroke-width="1.5"/>',
        ],
        [
          'Open',
          '<path d="M2 8h9l3 3h14v17H2z" fill="#d8d8d8" stroke="#444" stroke-width="1.5"/><path d="M2 28l4-13h24l-4 13z" fill="#bdbdbd" stroke="#444" stroke-width="1.5"/>',
        ],
        [
          'Save',
          '<path d="M3 3h22l4 4v22H3z" fill="#aaa" stroke="#444" stroke-width="1.5"/><rect x="8" y="3" width="13" height="9" fill="#fff" stroke="#444"/><rect x="8" y="17" width="16" height="12" fill="#eee" stroke="#444"/>',
        ],
        [
          'Print',
          '<rect x="8" y="2" width="16" height="10" fill="#fff" stroke="#444" stroke-width="1.5"/><path d="M3 12h26v12H3z" fill="#bbb" stroke="#444" stroke-width="1.5"/><rect x="8" y="20" width="16" height="10" fill="#fff" stroke="#444" stroke-width="1.5"/>',
        ],
      ].forEach(([n, p]) => {
        const b = u.el('div', 'tbtn', tool);
        const s = u.el('span', 'ic', b);
        s.innerHTML = '<svg viewBox="0 0 32 32">' + p + '</svg>';
        u.el('span', '', b, n);
      });
      const body = u.el('div', 'winbody', win);
      const note = u.el('div', 'instruction', body, ctx.instruction);
      const display =
        (ctx.display === 'panel' && window.innerWidth < 1260) || (ctx.display === 'toast' && window.innerHeight < 700)
          ? 'header'
          : ctx.display;
      body.dataset.instruction = display;
      if (ctx.instruction.length < 32) note.classList.add('short-instruction');
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'panel') note.classList.add('instruction-panel');
      u.el('p', 'lead', body, 'We’d love your feedback. Please answer the short survey below.');
      const stage = u.el('div', 'stage', body);
      const survey = u.el('div', 'survey', body);
      survey.setAttribute('aria-hidden', 'true');
      u.el('div', 'question', survey, '1. How satisfied are you with our product?');
      const choices = u.el('div', 'survey-choices', survey);
      ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((text, i) => {
        const row = u.el('div', 'survey-choice', choices);
        u.el('i', i === 1 ? 'radio selected' : 'radio', row);
        u.el('span', '', row, text);
      });
      u.el('div', 'question second', survey, '2. What did you like most?');
      const choice = u.el('div', 'survey-select', survey, 'Ease of use');
      u.el('span', '', choice, '▼');
      u.el('div', 'question third', survey, '3. Additional comments (optional):');
      const comment = u.el('div', 'survey-comment', survey, 'Great product!');
      const scroll = u.el('div', 'survey-scroll', comment);
      u.el('span', '', scroll, '▲');
      u.el('span', '', scroll, '▼');
      const foot = u.el('footer', 'footer', win);
      u.el('span', 'ready', foot, 'Ready');
      let submit = null;
      const btns = u.el('div', 'btns', body);
      const cancel = u.el('button', 'cancel', btns, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const words = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const er = ctx.rng.fork('chrome/end');
      const placements = ['footer', 'footer', 'footer', 'toolbar', 'link', 'icon'];
      const placement = ctx.finish ? null : er.pick(placements);
      const picked = er.pick(words);
      const label =
        placement === 'footer'
          ? 'Submit'
          : typeof picked === 'string'
            ? picked
            : picked.label || picked.text || picked.name || String(picked);
      const decoy = (parent, text, collide) => {
        const b = u.el('button', collide ? 'chrome-xtra collide' : 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (cr.bool(0.3)) {
        const same = (x) => String(x).toLowerCase() === String(label).toLowerCase();
        const pool = words
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
          .filter((x) => !same(x));
        if (pool.length) collision = cr.pick(pool);
      }
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = end(btns, 'submit', label);
        else if (placement === 'toolbar') submit = end(tool, 'chrome-end', label);
        else if (placement === 'link') submit = end(btns, 'end-link', label + ' ›');
        else submit = end(tool, 'chrome-end end-icon', '✓');
      }
      if (collision) decoy(placement === 'footer' ? tool : btns, collision, true);
      if (
        !ctx.finish &&
        placement !== 'footer' &&
        placement !== 'link' &&
        placement !== 'icon' &&
        placement !== 'toolbar'
      )
        submit = null;
      if (!ctx.finish && placement === 'toolbar' && submit) tool.appendChild(submit);
      if (!ctx.finish && placement === 'icon' && submit) tool.appendChild(submit);
      if (!ctx.finish && placement === 'footer' && submit) btns.appendChild(submit);

      // floating colors palette
      const pal = u.el('aside', 'palette', shell);
      const pt = u.el('div', 'ptitle', pal);
      u.el('i', 'pbox', pt);
      u.el('span', 'ttl', pt, 'Colors');
      const pc = u.el('i', 'closebox', pt);
      pc.innerHTML = cl.innerHTML;
      const pb = u.el('div', 'pbody', pal);
      ['Foreground:', 'Background:'].forEach((l, i) => {
        const r = u.el('div', 'prow', pb);
        u.el('span', '', r, l);
        const sw = u.el('span', 'sw', r);
        u.el('i', '', sw).style.background = i ? '#fff' : '#111';
        u.el('b', '', sw, '▾');
      });
      u.el('hr', '', pb);
      const cs = u.el('div', 'chips', pb);
      ['#e0262a', '#f2a516', '#27a336', '#2a62e8', '#7b2fc2'].forEach((c) => {
        u.el('i', '', cs).style.background = c;
      });

      // trash
      const tr = u.el('div', 'trash', shell);
      tr.innerHTML =
        '<svg viewBox="0 0 44 60"><defs><linearGradient id="bin-metal"><stop stop-color="#777"/><stop offset=".25" stop-color="#fff"/><stop offset=".6" stop-color="#bbb"/><stop offset=".8" stop-color="#eee"/><stop offset="1" stop-color="#555"/></linearGradient></defs><path d="M5 15h34l-2 37q-15 9-30 0z" fill="url(#bin-metal)" stroke="#222" stroke-width="1.5"/><path d="M10 21v30m4-29v31m4-31v33m4-32v32m4-33v32m4-33v31m4-33v30" stroke="#777" stroke-width=".8"/><ellipse cx="22" cy="15" rx="19" ry="7" fill="url(#bin-metal)" stroke="#222" stroke-width="1.5"/><ellipse cx="22" cy="12" rx="16" ry="6" fill="#ddd" stroke="#555"/><path d="M17 7V4q5-4 10 0v3" fill="#bbb" stroke="#222"/><ellipse cx="22" cy="4" rx="5" ry="2" fill="#eee" stroke="#333"/></svg>';
      u.el('span', '', tr, 'Trash');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb tour ' + ctx.kind, document.body);
      const close = ctx.util.el('button', 'tour-close', el, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close tour');
      close.addEventListener('click', ctx.dismiss);
      const bulb = ctx.util.el('span', 'bulb', el);
      bulb.innerHTML =
        '<svg viewBox="0 0 30 48"><defs><radialGradient id="bulb-glass" cx="35%" cy="28%" r="65%"><stop stop-color="white"/><stop offset=".45" stop-color="#fff9b3"/><stop offset=".8" stop-color="#ffe829"/><stop offset="1" stop-color="#d6ac12"/></radialGradient></defs><path d="M15 2C3 2-2 14 6 24c3 4 3 7 3 10h12c0-3 0-6 3-10C32 14 27 2 15 2z" fill="url(#bulb-glass)" stroke="#333" stroke-width="1.5"/><path d="M12 33c0-7-1-11-4-17M18 33c0-7 1-11 4-17M11 20l4 3 4-3" fill="none" stroke="#b89d24" stroke-width="1"/><path d="M8 7q-6 8 0 15" fill="none" stroke="white" stroke-width="3"/><path d="M9 34h12v9l-3 3h-6l-3-3z" fill="#999" stroke="#222" stroke-width="1.5"/><path d="M9 36h12m-12 3h12m-11 3h10" stroke="#eee" stroke-width="1.5"/></svg>';
      ctx.util.el('strong', '', el, 'Take a quick tour');
      ctx.util.el('p', '', el, 'Learn how to get the most out of Survey in just a few steps.');
      const row = ctx.util.el('div', 'tourbtns', el);
      const dismiss = ctx.util.el('button', 'dismiss', row, 'Skip tour');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const nx = ctx.util.el('button', 'next', row, 'Next ›');
      nx.type = 'button';
      nx.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
