(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-03',
    'brand': 'Vacation Rental Finder',
    'instruction': 'top',
    'rail': 'Search|Dates|Guests|Amenities|Location|Review',
    'menu': '',
    'briefTitle': 'Your Task',
  };
  const TABCOL = ['#bff0d6', '#d9d0fa', '#cfe6fb', '#fdeec6', '#fbd3d6', '#e6e6ec'];
  const SP = 'http://www.w3.org/2000/svg';
  function svg(parent, html, cls, vb) {
    const s = document.createElementNS(SP, 'svg');
    s.setAttribute('viewBox', vb || '0 0 24 24');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const otherLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && otherLabels.length ? cr.pick(otherLabels) : null;
      function decoyBtn(parent, label, collides) {
        const b = u.el('button', 'ds-ghost', parent, label);
        b.type = 'button';
        b.tabIndex = -1;
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      }
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('span', 'ds-title', top);
      svg(tl, '<path d="M3 11.5 12 3l9 8.5h-2.5V21h-5v-6h-3v6h-5v-9.5z" fill="#5b2fd0"/>', 'ds-home');
      u.el('span', 'ds-brand', tl, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      svg(wc, '<path d="M5 12h14" stroke="#222" stroke-width="1.8"/>', 'ds-wi');
      svg(
        wc,
        '<rect x="5.5" y="5.5" width="13" height="13" rx="1.5" fill="none" stroke="#222" stroke-width="1.8"/>',
        'ds-wi',
      );
      svg(wc, '<path d="M5 5l14 14M19 5 5 19" stroke="#222" stroke-width="1.8"/>', 'ds-wi');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => {
        const b = u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), rail, t);
        b.style.background = TABCOL[i];
      });
      const spiral = u.el('div', 'ds-spiral', body);
      for (let i = 0; i < 16; i++) {
        const r = u.el('i', '', spiral);
        r.style.top = i * 5.96 + 3.8 + '%';
      }
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      const ht = u.el('div', '', head);
      u.el('h1', '', ht, 'Find Your Stay');
      u.el('p', '', ht, 'Set your preferences to find the perfect place.');
      svg(
        head,
        '<defs><linearGradient id="mint-hill" x2="0" y2="1"><stop stop-color="#d3eee7"/><stop offset="1" stop-color="#b6ddd1"/></linearGradient><linearGradient id="mint-roof" x2="0" y2="1"><stop stop-color="#bce1d8"/><stop offset="1" stop-color="#6db6a5"/></linearGradient></defs><path d="M63 71 91 24Q103 6 116 23L157 71Z" fill="url(#mint-hill)"/><path d="m99 28 8-9 10 10-9-2-2 7-2-7z" fill="#f0faf6"/><g stroke="#67b3a0" stroke-width="2.5" stroke-linejoin="round"><path d="M39 78V44L66 20l26 25v33z" fill="#f5faf6"/><path d="M79 29V20h9v16" fill="#d1e8e0"/><path d="m33 44 33-30 32 31-4 4-28-27-29 27z" fill="url(#mint-roof)"/><rect x="58" y="54" width="16" height="24" rx="2" fill="#8bd1bb"/><path d="M106 78q2-21 16-12 11-15 21 0 12-13 17 12" fill="#a4dbca"/><path d="M14 78V53M163 78V53"/><path d="M5 58 11 37q5-9 9 0l6 21q1 14-11 10Q3 70 5 58Z" fill="#98d9c3"/><path d="m154 58 5-21q4-9 8 0l6 21q2 13-9 10-12 2-10-10Z" fill="#a3ddca"/><path d="m15 43 1 15 6-5m142-10v15l-6-4" fill="none"/><path d="M4 79h170" fill="none"/></g><g fill="#79bda9"><rect x="61" y="34" width="4" height="4"/><rect x="67" y="34" width="4" height="4"/><rect x="61" y="40" width="4" height="4"/><rect x="67" y="40" width="4" height="4"/></g>',
        'ds-house',
        '0 0 180 90',
      );
      const fields = u.el('section', 'ds-fields', content);
      const headTools = u.el('div', 'ds-head-tools', head);
      headTools.appendChild(head.querySelector('.ds-house'));
      [
        ['Destination', 'Lisbon, Portugal', 'v'],
        ['Check-in', 'Apr 12, 2025', 'c'],
        ['Check-out', 'Apr 19, 2025', 'c'],
        ['Guests', '2 adults', 'v'],
      ].forEach(([l, v, k]) => {
        const f = u.el('div', 'ds-f', fields);
        u.el('label', '', f, l);
        const b = u.el('div', 'ds-in', f);
        u.el('span', '', b, v);
        if (k === 'v') svg(b, '<path d="m6 9 6 6 6-6" fill="none" stroke="#333" stroke-width="2"/>');
        else
          svg(
            b,
            '<rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="#333" stroke-width="1.7"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="#333" stroke-width="1.7"/>',
          );
      });
      const amen = u.el('section', 'ds-amen', content);
      u.el('div', 'ds-amen-heading', amen);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        if (cls === 'ds-header-note' || cls === 'ds-brief')
          svg(
            b,
            '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#5016cb" stroke-width="1.8"/><path d="M12 11v6M12 7.5v1.5" stroke="#5016cb" stroke-width="2"/>',
            'ds-info',
          );
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', amen);
      if (mode === 'top') {
        const hn = briefing(amen, 'ds-header-note');
        amen.insertBefore(hn, main);
      }
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, amen);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const clr = u.el('button', 'ds-ghost', foot, 'Clear all');
      clr.type = 'button';
      clr.tabIndex = -1;
      u.el('span', 'ds-sp', foot);
      const sv = u.el('button', 'ds-ghost ds-save', foot, 'Save search');
      sv.type = 'button';
      sv.tabIndex = -1;
      sv.dataset.role = 'xtra';
      sv.addEventListener('click', () => env.log('decoy', { label: 'Save search' }));
      if (collide) decoyBtn(foot, collide, true);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          placement === 'link' ? 'ds-end-link' : 'ds-submit',
          placement === 'header' ? headTools : foot,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.placement = placement;
        if (placement === 'header') headTools.insertBefore(submit, headTools.firstChild);
        if (placement === 'link') foot.insertBefore(submit, clr.nextSibling);
        submit.addEventListener('click', () => ctx.submit());
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
