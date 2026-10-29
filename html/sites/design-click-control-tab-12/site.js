(function () {
  'use strict';
  const RAIL = ['Workplace Shell', 'Programs', 'Folders', 'Assistance', 'Templates', 'Shredder'];
  const ART = [
    '<path d="M8 14V7h12l6 7h11l4-4 7 4v7h5v29H12Z" fill="#bbb" stroke="#111" stroke-width="2"/><path d="M10 11h10l5 7h20v30H10Z" fill="#eee" stroke="#111" stroke-width="2"/><path d="M4 18h36v35H4Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="m40 18 5 3v30l-5 2Z" fill="#777" stroke="#111" stroke-width="2"/><path d="M7 21h30M7 22v28M13 8h6l5 6M29 13h7l3 4" fill="none" stroke="#fff" stroke-width="2"/>',
    '<path d="m12 7 29-3 5 5v9l7 4v26l-8 3H11Z" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M4 5h35v47H4Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="m39 5 5 4v42l-5 1Z" fill="#777" stroke="#111" stroke-width="2"/><path d="M8 9h27v39H8Z" fill="#ddd" stroke="#fff"/><path d="M13 18h19M13 24h19M13 30h19M13 36h19M13 42h19" stroke="#888" stroke-width="2"/><path d="M13 20h19M13 26h19M13 32h19M13 38h19M13 44h19" stroke="#fff" stroke-width="2"/><circle cx="12" cy="11" r="3" fill="#fff" stroke="#111" stroke-width="2"/><path d="m11 10 4-4" stroke="#111" stroke-width="2"/>',
    '<path d="M5 14V7h13l7 8h16l6 6v30H5Z" fill="#ccc" stroke="#111" stroke-width="2"/><path d="M3 18h37v34H3Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="m40 18 5 3v29l-5 2Z" fill="#888" stroke="#111" stroke-width="2"/><path d="M6 21h31M6 22v27M9 10h8l5 7" fill="none" stroke="#fff" stroke-width="2"/>',
    '<path d="M8 3h39v35H8Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="M12 7h29v26H12Z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M15 10h23v20H15Z" fill="#222"/><path d="m16 11 21 1-20 17Z" fill="#555"/><path d="M5 39h42v13H5Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="M9 43h22M9 47h16" stroke="#777" stroke-width="2"/><path d="M35 43h8v6h-8Z" fill="#222"/><path d="m47 39 5 2v12H5v-1h42Z" fill="#888" stroke="#111"/><path d="M7 41h37M10 5h34" stroke="#fff"/>',
    '<path d="m9 5 32-2 6 4v13l-3 4 3 6-3 4 2 12-5 6H7Z" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M4 4h33v47H4Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><path d="M8 8h26v39H8Z" fill="#eee"/><path d="M10 12h6M20 12h11M10 20h6M20 20h11M10 28h6M20 28h11M10 36h6M20 36h11M10 43h20" stroke="#333" stroke-width="2"/><path d="M39 7v39m3-33v7m0 14v8" fill="none" stroke="#fff"/>',
    '<path d="M15 11Q11 7 17 5L28 2l12 4v7l4 2v34Q28 58 12 49V15Z" fill="url(#stone)" stroke="#111" stroke-width="2"/><ellipse cx="28" cy="15" rx="16" ry="6" fill="#ccc" stroke="#111" stroke-width="2"/><path d="m17 11 3-5h14l3 4-4 4H22Z" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M18 23v25M24 24v27M30 24v27M36 22v27" stroke="#111" stroke-width="2"/><path d="M20 23v25M26 24v27M32 24v27M38 22v26" stroke="#fff" stroke-width="2"/>',
  ];
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: 'design-click-control-tab-12',
    styles: ['site.css', 'os2.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref os2';
      const rail = u.el('nav', 'os2-rail', document.body);
      const logo = u.el('div', 'os2-logo', rail);
      logo.innerHTML =
        '<svg viewBox="0 0 30 30"><path d="M2 2h26v26H2Z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M5 5h20v19H5Z" fill="#002e8c"/><path d="M6 6h18v3H6Z" fill="#eee"/><path d="M8 12h13l-4 9h-3l3-7h-9Z" fill="#fff"/><path d="M7 15h4v7H7Zm13 6h3v2h-3Z" fill="#9bf"/><path d="M10 7h9" stroke="#333"/></svg>';
      RAIL.forEach((t, i) => {
        const b = u.el('div', 'os2-icon', rail);
        b.innerHTML =
          '<svg viewBox="0 0 56 56"><defs><linearGradient id="stone" x2=".8" y2="1"><stop stop-color="#eee"/><stop offset=".35" stop-color="#c9c9c9"/><stop offset="1" stop-color="#aaa"/></linearGradient></defs>' +
          ART[i] +
          '</svg>';
        u.el('span', '', b, t);
      });
      const shell = u.el('main', 'shell os2-shell', document.body);
      const title = u.el('div', 'os2-title', shell);
      u.el('span', '', title, 'Project Planner  -  OS/2 Workplace Shell');
      const wc = u.el('span', 'os2-wc', title);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'os2-menu', shell);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((m) => {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      });
      const work = u.el('div', 'os2-work' + (ctx.finish ? ' os2-finish' : ''), shell);
      let display = ctx.display || 'header';
      const dims = ctx.size || {};
      const stageBox =
        ctx.stage && ctx.stage.getBoundingClientRect ? ctx.stage.getBoundingClientRect() : { width: 0, height: 0 };
      const width = dims.width || dims.w || stageBox.width || document.documentElement.clientWidth;
      const height = dims.height || dims.h || stageBox.height || document.documentElement.clientHeight;
      if ((display === 'panel' && width < 1180) || (display === 'toast' && height < 700)) display = 'header';
      const note = u.el('div', 'instruction os2-note os2-note-' + display, work, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      const stage = u.el('div', 'stage os2-stage', work);
      const foot = u.el('footer', 'footer os2-foot', shell);
      u.el('span', 'ready', foot, 'Ready');
      u.el('span', 'os2-clock', foot, 'Apr 10, 1994     10:24 AM');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.float() < 0.5 ? 'original' : er.pick(['menu', 'footer']);
        const bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : END_LABELS;
        const label = placement === 'original' ? 'Submit' : labelOf(er.pick(bank));
        const parent = placement === 'menu' ? menu : placement === 'footer' ? foot : work;
        const cls = placement === 'original' ? 'submit os2-submit' : 'submit os2-submit os2-submit-' + placement;
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        if (label === 'Submit') submit.innerHTML = '<u>S</u>ubmit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
          const choices = bank.map(labelOf).filter((x) => !same(x));
          if (choices.length) {
            const text = cr.pick(choices),
              b = u.el('button', 'os2-xtra', menu, text);
            b.type = 'button';
            b.dataset.role = 'xtra';
            b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb os2-dlg ' + ctx.kind, document.body);
      const t = ctx.util.el('div', 'os2-dlg-title', el, 'Workplace Shell');
      const x = ctx.util.el('button', 'os2-dlg-x', t, '✕');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close warning');
      x.addEventListener('click', ctx.dismiss);
      const body = ctx.util.el('div', 'os2-dlg-body', el);
      const ic = ctx.util.el('div', 'os2-warn', body);
      ic.innerHTML =
        '<svg viewBox="0 0 84 80"><path d="M37 6Q42 -1 47 6L81 68Q85 77 75 77H9Q-1 77 4 68Z" fill="#ffff00" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M42 30v20" stroke="#111" stroke-width="11" stroke-linecap="round"/><circle cx="42" cy="63" r="5.5" fill="#111"/></svg>';
      const tx = ctx.util.el('div', 'os2-dlg-text', body);
      ctx.util.el('strong', '', tx, 'Unsaved layout changes');
      ctx.util.el('p', '', tx, 'You have unsaved layout changes.');
      ctx.util.el('p', '', tx, 'Do you want to continue without saving?');
      const btns = ctx.util.el('div', 'os2-dlg-btns', el);
      const dismiss = ctx.util.el('button', 'dismiss os2-def', btns, 'Continue without saving');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const cancel = ctx.util.el('button', 'os2-cancel', btns, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
