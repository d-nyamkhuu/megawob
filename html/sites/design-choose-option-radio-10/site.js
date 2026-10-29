(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-radio-10',
    'brand': 'Riverton University',
    'title': 'Email Preferences',
    'instruction': 'left',
    'rail': '',
    'menu': 'Office of Communications',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = (parent, cls, html, vb) => {
        const s = document.createElementNS(NS, 'svg');
        s.setAttribute('viewBox', vb || '0 0 24 24');
        s.setAttribute('class', cls);
        s.innerHTML = html;
        parent.appendChild(s);
        return s;
      };
      const env_ =
        '<defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffff5"/><stop offset="1" stop-color="#d9d9cf"/></linearGradient></defs><rect x="1.5" y="3.5" width="21" height="17" fill="url(#paper)" stroke="#111" stroke-width=".8"/><path d="M2 20l8-8M22 20l-8-8" stroke="#111" stroke-width=".7"/><path d="M2 4l10 11L22 4" fill="#fffff3" stroke="#111" stroke-width=".8"/><path d="M3 5l9 9 9-9" fill="none" stroke="#888" stroke-width=".4"/>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-titlebar', win);
      svg(
        tb,
        'ds-tico',
        '<rect x="2" y="3" width="20" height="18" fill="#3a5ba8" stroke="#111" stroke-width="1.5"/><rect x="5" y="6" width="14" height="5" fill="#fff"/><rect x="5" y="14" width="14" height="4" fill="#cfd8ef"/>',
      );
      u.el('span', 'ds-ttext', tb, 'Mail Settings');
      const cg = u.el('span', 'ds-close', tb, '');
      svg(cg, 'ds-x', '<path d="M5 5l14 14M19 5L5 19" stroke="#fff" stroke-width="3"/>');
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      const ic = u.el('div', 'ds-envico', head);
      svg(ic, 'ds-env', env_);
      const ht = u.el('div', 'ds-headtxt', head);
      u.el('div', 'ds-h1', ht, 'Mail Settings');
      u.el('div', 'ds-h2', ht, 'Configure how often you receive email updates.');
      const main = u.el('div', 'ds-main' + (ctx.display === 'panel' ? ' ds-main-panel' : ''), content);
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
        u.el('div', 'ds-instruction', main, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', main);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        main.insertBefore(n, stage);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const reset = u.el('button', 'ds-reset', foot, 'Restore defaults');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        const controls = stage.querySelectorAll('input[type=radio]');
        controls.forEach((el) => (el.checked = false));
      });
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const endPlacement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      let submit = null;
      const tools = u.el('div', 'ds-header-tools', head);
      if (!ctx.finish) {
        submit = u.el(
          endPlacement === 'link' ? 'a' : 'button',
          'ds-submit ds-end-' + endPlacement,
          endPlacement === 'header' ? tools : foot,
          endLabel,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (endPlacement === 'link') foot.insertBefore(submit, reset);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideRng.pick(pool);
          const decoy = u.el('button', 'ds-end-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const dock = u.el('div', 'ds-dock', win);
      const ri = u.el('div', 'ds-ri ds-risc', dock);
      svg(
        ri,
        'ds-ico',
        '<circle cx="12" cy="14" r="5" fill="#d02020"/><circle cx="8" cy="9" r="3.5" fill="#c01818"/><circle cx="16" cy="9" r="3.5" fill="#c01818"/><path d="M12 2l3 4h-6z" fill="#2a8a2a"/>',
      );
      u.el('span', '', ri, 'RISC OS');
      u.el('i', 'ds-sep', dock);
      const icons = {
        Discs:
          '<rect x="4" y="3" width="16" height="18" fill="#4a64b0" stroke="#111" stroke-width="1.3"/><rect x="7" y="12" width="10" height="3" fill="#fff"/>',
        Apps: '<path d="M5 2h10l5 5v15H5z" fill="#fff" stroke="#222" stroke-width="1.3"/>',
        Draw: '<ellipse cx="11" cy="14" rx="8" ry="6" fill="#e8d6b0" stroke="#222"/><circle cx="8" cy="13" r="1.6" fill="#d33"/><circle cx="12" cy="11" r="1.6" fill="#38c"/><path d="M14 12L21 3" stroke="#a64" stroke-width="2.5"/>',
        Edit: '<path d="M5 2h10l5 5v15H5z" fill="#fff" stroke="#222" stroke-width="1.3"/><path d="M8 11h8M8 15h8" stroke="#555"/>',
        Net: '<circle cx="12" cy="12" r="9.5" fill="#2d6fc4" stroke="#123"/><path d="M6 8q4-3 6 1t-2 6-4-1z M14 14q4-2 4 2t-3 3z" fill="#3a9a3a"/>',
        Mail: env_,
        Files:
          '<rect x="5" y="2" width="14" height="20" fill="#9aa4c4" stroke="#222" stroke-width="1.3"/><rect x="8" y="6" width="8" height="4" fill="#fff" stroke="#222"/><rect x="8" y="14" width="8" height="4" fill="#fff" stroke="#222"/>',
        Prefs:
          '<circle cx="12" cy="12" r="7" fill="#aaa" stroke="#222" stroke-width="2.5" stroke-dasharray="3 2"/><circle cx="12" cy="12" r="3" fill="#ddd" stroke="#222"/>',
        Trash:
          '<path d="M6 6h12l-1.5 16h-9z" fill="#bbb" stroke="#222" stroke-width="1.3"/><ellipse cx="12" cy="5" rx="6" ry="2" fill="#eee" stroke="#222"/>',
      };
      const disc =
        '<defs><linearGradient id="drive" x2="0" y2="1"><stop stop-color="#799aea"/><stop offset=".3" stop-color="#0750ba"/><stop offset="1" stop-color="#062173"/></linearGradient></defs><rect x="3" y="1" width="18" height="12" fill="url(#drive)" stroke="#111" stroke-width="1"/><path d="M4 2h16" stroke="white"/><rect x="9" y="5" width="6" height="2" fill="#ddd" stroke="#111" stroke-width=".6"/><rect x="1" y="11" width="22" height="11" fill="#b9bdd1" stroke="#111" stroke-width="1"/><path d="M2 12h20M2 12v9" stroke="white"/><rect x="2" y="12" width="4" height="9" fill="#0645ba"/><path d="M4 14v2m0 2v2" stroke="#fff"/><rect x="9" y="15" width="6" height="2" fill="#eee" stroke="#111" stroke-width=".6"/>';
      const documentIcon =
        '<path d="M4 1h13l5 5v17H4z" fill="#fffff5" stroke="#111" stroke-width=".9"/><path d="M17 1v5h5" fill="#c9c9c9" stroke="#111" stroke-width=".8"/><path d="M7 5h7M7 8h12M7 10.5h12M7 13h12M7 15.5h12M7 18h12" stroke="#737373" stroke-width=".65"/>';
      icons.Discs = disc;
      icons.Apps = documentIcon;
      icons.Edit = documentIcon;
      icons.Draw =
        '<path d="M18 9C13 3 3 8 2 15s7 9 12 6c3-2 1-4-2-3-2 0-2-3 1-3h3c4 0 5-3 2-6z" fill="#ffffe9" stroke="#111" stroke-width=".8"/><ellipse cx="8" cy="17" rx="2" ry="1.5" fill="#ddd" stroke="#111" stroke-width=".6"/><circle cx="5" cy="13" r="1.3" fill="#f22"/><circle cx="8" cy="10" r="1.3" fill="#24b32a"/><circle cx="12" cy="9" r="1.3" fill="#164bef"/><circle cx="14" cy="12" r="1.3" fill="#f6db00"/><path d="M9 17L20 2l2-1-1 3L12 16z" fill="#e8ae28" stroke="#111" stroke-width=".7"/><path d="M9 17l2-4 2 2z" fill="#633525"/>';
      icons.Net =
        '<defs><radialGradient id="ocean" cx=".3" cy=".25"><stop stop-color="#419cf7"/><stop offset="1" stop-color="#074295"/></radialGradient></defs><circle cx="12" cy="12" r="10.5" fill="url(#ocean)" stroke="#111" stroke-width=".8"/><path d="M8 2l4 1 2 3-2 3-3-1-2 3-3-1-1-3zM15 5l5 3 2 6-3 2-3-2-3 2-2-3 3-2zM7 14l4 2 1 4-3 2-3-4z" fill="#3baa24" stroke="#297727" stroke-width=".35"/>';
      icons.Files =
        '<defs><linearGradient id="cabinet" x2="1" y2="1"><stop stop-color="#e7e4f7"/><stop offset="1" stop-color="#69677b"/></linearGradient></defs><rect x="2" y="1" width="20" height="22" fill="url(#cabinet)" stroke="#111"/><rect x="4" y="3" width="16" height="8" fill="#bab7d1" stroke="#222" stroke-width=".7"/><rect x="4" y="13" width="16" height="8" fill="#bab7d1" stroke="#222" stroke-width=".7"/><path d="M5 4h14M5 14h14" stroke="#fff"/><rect x="9" y="6" width="6" height="2" fill="#eee" stroke="#111" stroke-width=".7"/><rect x="9" y="16" width="6" height="2" fill="#eee" stroke="#111" stroke-width=".7"/>';
      icons.Prefs =
        '<defs><linearGradient id="gear" x2="1" y2="1"><stop stop-color="#f7f6ff"/><stop offset="1" stop-color="#858397"/></linearGradient></defs><path d="M10 1h4l1 3 2 1 3-1 2 3-2 3v3l2 2-2 4-3-1-2 2-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 7l2-3 3 1 2-1z" fill="url(#gear)" stroke="#111" stroke-width=".9"/><circle cx="12" cy="12" r="4" fill="#a9a9b7" stroke="#111" stroke-width=".9"/><path d="M9 13a3 3 0 0 1 5-3" fill="none" stroke="white"/>';
      icons.Trash =
        '<defs><linearGradient id="bin"><stop stop-color="#66667b"/><stop offset=".25" stop-color="#e7e7f3"/><stop offset=".5" stop-color="#aaaabc"/><stop offset="1" stop-color="#555565"/></linearGradient></defs><path d="M5 5l1.5 16q5.5 4 11 0L19 5" fill="url(#bin)" stroke="#111" stroke-width=".8"/><path d="M8 8l1 13M15 8l-1 13" stroke="#eeeeff" stroke-width=".6"/><ellipse cx="12" cy="5" rx="8" ry="3" fill="#a7a7b8" stroke="#111" stroke-width=".8"/><ellipse cx="12" cy="4.5" rx="6.5" ry="1.8" fill="#656575" stroke="#111" stroke-width=".6"/>';
      tb.querySelector('.ds-tico').innerHTML = disc;
      ic.querySelector('svg').setAttribute('preserveAspectRatio', 'none');
      ri.querySelector('svg').setAttribute('viewBox', '0 0 24 27');
      cg.querySelector('path').setAttribute('stroke', '#111');
      ri.querySelector('svg').innerHTML =
        '<path d="M12 10C6 9 2 5 4 3c5-1 7 2 8 7zM13 10c0-5 5-8 8-7 0 5-3 7-8 7zM12 9c-3-4-2-7 0-9 3 3 3 5 0 9z" fill="#1da51b" stroke="#111" stroke-width=".8"/><path d="M9 10L4 8M15 10l5-2" stroke="#111"/><g fill="#ed1515" stroke="#111" stroke-width=".8"><ellipse cx="8" cy="13" rx="3" ry="4"/><ellipse cx="16" cy="13" rx="3" ry="4"/><ellipse cx="12" cy="17" rx="3.5" ry="4"/><ellipse cx="12" cy="22" rx="2.4" ry="3"/></g><path d="M5 16l-3 3 4 1 2-3M18 16l3 3-4 1-2-3" fill="#147ed1" stroke="#111" stroke-width=".7"/><ellipse cx="12" cy="13" rx="2" ry="3" fill="#0752bc" stroke="#111" stroke-width=".7"/>';
      Object.keys(icons).forEach((k) => {
        const b = u.el('div', 'ds-ri' + (k === 'Mail' ? ' on' : ''), dock);
        svg(b, 'ds-ico', icons[k]);
        u.el('span', '', b, k);
      });
      u.el('i', 'ds-sep ds-sep2', dock);
      const clk = u.el('div', 'ds-clock', dock);
      u.el('div', '', clk, 'Mon 14 Apr 1997');
      u.el('div', '', clk, '10:24');
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
