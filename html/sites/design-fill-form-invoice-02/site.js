(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-02',
    'title': 'Invoice Data Entry - OS/2 Workplace Shell',
    'instruction': 'left',
    'menu': 'File|Edit|View|Options|Help',
    'tabs': '1. Enter Invoice|2. Review|3. Confirm',
    'briefTitle': 'Enter Invoice Information',
  };
  const ICONS = {
    note: '<svg viewBox="0 0 40 40"><path d="M8 5h25v32H8z" fill="#ddd" stroke="#000" stroke-width="1.5"/><path d="M6 4h25v31H6z" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M11 1v7M17 1v7M23 1v7M9 11h18M9 15h18M9 19h18M9 23h13M9 27h11" stroke="#000" stroke-width="1.5"/><path d="M20 32l12-13 3 3-12 13-4 1z" fill="#ddd" stroke="#000" stroke-width="1.5"/></svg>',
    calc: '<svg viewBox="0 0 40 40"><path d="M7 3h27v34H7z" fill="#999" stroke="#000" stroke-width="1.5"/><path d="M5 2h27v33H5z" fill="#eee" stroke="#000" stroke-width="1.5"/><path d="M9 6h19v7H9z" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M9 17h4v4H9zM16 17h4v4h-4zM23 17h4v4h-4zM9 24h4v4H9zM16 24h4v4h-4zM23 24h4v7h-4zM9 30h4v2H9zM16 30h4v2h-4z" fill="#ddd" stroke="#000" stroke-width="1.4"/></svg>',
    folder:
      '<svg viewBox="0 0 40 40"><path d="M3 9h12l3 4h18v25H3z" fill="#ddd" stroke="#000" stroke-width="1.5"/><path d="M5 7h10l3 4h17v4H5z" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M2 15h33v22H2z" fill="#ccc" stroke="#000" stroke-width="1.5"/><path d="M4 17h29M4 17v18" fill="none" stroke="#fff"/></svg>',
    help: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#fff" stroke="#000" stroke-width="2"/><path d="M14 15c0-9 12-8 12 0 0 5-6 5-6 11" fill="none" stroke="#000" stroke-width="3"/><circle cx="20" cy="31" r="2" fill="#000"/></svg>',
    trash:
      '<svg viewBox="0 0 40 40"><path d="M8 11l3 25q9 5 18 0l3-25z" fill="#eee" stroke="#000" stroke-width="1.5"/><ellipse cx="20" cy="10" rx="14" ry="5" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M16 7V3h8v4M12 16l2 17M17 16l1 19M22 16l-1 19M27 16l-2 17" fill="none" stroke="#000" stroke-width="1.5"/></svg>',
    app: '<svg viewBox="0 0 28 28"><path fill="#fff" stroke="#000" stroke-width="2" d="M2 2h24v24H2z"/><path fill="#006b68" d="M4 4h20v5H4z"/><path d="M5 12h18M5 17h18M5 22h18M10 10v14M17 10v14" stroke="#000" stroke-width="1.6"/><path d="M6 11h2v3H6zM12 17h3v3h-3zM19 21h3v2h-3z" fill="#007c75"/></svg>',
    launch:
      '<svg viewBox="0 0 28 28"><path fill="#00009d" stroke="#000" d="M1 1h26v26H1z"/><path fill="#fff" stroke="#000" d="M5 4h9v17H5zM13 10h10v14H13z"/><path d="M7 7h5M7 10h4M7 13h4M16 13v8M19 13v8" stroke="#00009d" stroke-width="2"/><path d="M3 23h9v2H3zM18 3h6v3h-6z" fill="#eee500"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'os-win', document.body);
      const top = u.el('header', 'os-title', win);
      u.el('span', 'os-ico', top).innerHTML = ICONS.app;
      u.el('span', 't', top, C.title);
      const wb = u.el('span', 'os-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'os-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      // New episode choices have their own streams; the widget's seeded draws stay unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'icon']);
      const endLabel = referenceEnd ? labels.find((x) => x === 'Submit') || 'Submit' : er.pick(labels);
      const tools = u.el('div', 'os-menu-tools', nav);
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      function endButton(parent, cls, text) {
        const button = u.el('button', cls, parent, text);
        button.type = 'button';
        button.dataset.role = 'submit';
        button.title = endLabel;
        button.setAttribute('aria-label', endLabel);
        button.addEventListener('click', () => ctx.submit());
        return button;
      }
      const tabs = u.el('div', 'os-tabs', win);
      C.tabs.split('|').forEach((t, i) => u.el('span', 'os-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const body = u.el('div', 'ds-body', win);
      const pal = u.el('aside', 'os-pal', document.body);
      const ph = u.el('div', 'ph', pal);
      u.el('span', '', ph, 'Tools');
      u.el('i', '', ph, '×');
      const pg = u.el('div', 'pg', pal);
      [
        ['Note Pad', 'note'],
        ['Calculator', 'calc'],
        ['Templates', 'folder'],
        ['Help', 'help'],
      ].forEach(([l, k]) => {
        const d = u.el('div', 'os-ic', pg);
        d.innerHTML = ICONS[k];
        u.el('span', '', d, l);
      });
      const brand = u.el('div', 'os-brand', document.body);
      u.el('b', '', brand, 'OS/2');
      u.el('span', '', brand, 'Workplace Shell');
      const sh = u.el('div', 'os-ic os-shred', document.body);
      sh.innerHTML = ICONS.trash;
      u.el('span', '', sh, 'Shredder');
      const tb = u.el('div', 'os-task', document.body);
      const b1 = u.el('span', 'b', tb);
      u.el('span', 'ii', b1).innerHTML = ICONS.launch;
      u.el('span', '', b1, 'LaunchPad');
      const b2 = u.el('span', 'b w', tb);
      u.el('span', 'ii', b2).innerHTML = ICONS.app;
      u.el('span', '', b2, 'Invoice Data Entry');
      u.el('span', 'sp', tb);
      const b3 = u.el('span', 'b c', tb);
      u.el('span', 'speaker', b3).innerHTML =
        '<svg viewBox="0 0 28 28"><path d="M3 10h5l7-6v20l-7-6H3zM20 8q6 6 0 12M18 12q3 2 0 4" fill="none" stroke="black" stroke-width="2"/></svg>';
      u.el('span', '', b3, '10:24 AM');
      const content = u.el('div', 'ds-content', body);
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
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        submit =
          placement === 'header'
            ? endButton(tools, 'ds-submit ds-end-header', endLabel)
            : placement === 'icon'
              ? endButton(tb, 'ds-submit ds-end-icon', '✓')
              : endButton(foot, 'ds-submit', endLabel);
        if (placement === 'icon') tb.insertBefore(submit, b3);
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
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
