(function () {
  'use strict';
  const cfg = {
    'title': 'Documents - File Browser',
    'menus': ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'],
    'status': '“Report.txt” selected (482 bytes)',
  };
  const FOLDER =
    '<svg viewBox="0 0 42 38"><defs><linearGradient id="chrome-folder" x2=".7" y2="1"><stop stop-color="#fff5ce"/><stop offset=".45" stop-color="#f2cd79"/><stop offset="1" stop-color="#cb923f"/></linearGradient></defs><path d="M3 9V5q0-3 3-3h11l4 5h16v25H3z" fill="#f9e7bc" stroke="#85602c"/><path d="M3 12h36l-3 22H3z" fill="url(#chrome-folder)" stroke="#866330" stroke-width="1.3"/><path d="M5 14h31" stroke="#fff7dc" stroke-width="2"/><ellipse cx="31" cy="25" rx="4" ry="7" transform="rotate(-24 31 25)" fill="#a2afad" stroke="#5c6969"/><path d="m30 20 3 10" stroke="#edf1e9" stroke-width="1.7"/></svg>';
  env.site({
    name: 'design-click-control-dialog-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref gnome';
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('header', 'topbar', shell);
      const logo = u.el('span', 'logo', top);
      logo.innerHTML = FOLDER;
      const display = ctx.display || 'header';
      document.body.classList.add('mode-' + display);
      if (display !== 'header') {
        top.classList.add('compact');
        u.el('span', 'app-caption', top, 'File Browser');
      }
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endR.pick(['header', 'header', 'toolbar', 'footer']);
      const bank = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitWord = endLabels.find((x) => labelOf(x).trim().toLowerCase() === 'submit');
      const baseline = placement === 'header';
      const label = baseline ? labelOf(submitWord || 'Submit') : labelOf(endR.pick(endLabels));
      const note = display === 'header' ? u.el('div', 'instruction', top, ctx.instruction) : null;
      if (note) note.dataset.display = display;
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = endButton(top, 'submit', label);
      let toast = null;
      if (display === 'toast') {
        toast = u.el('div', 'instruction-toast-row', shell);
        u.el('div', 'instruction-toast', toast, ctx.instruction);
      }
      const win = u.el('section', 'win', shell);
      const tb = u.el('div', 'wtitle', win);
      const wi = u.el('span', 'wicon', tb);
      wi.innerHTML = FOLDER;
      u.el('span', 'wcap', tb, cfg.title);
      const wc = u.el('span', 'wctl', tb);
      wc.innerHTML =
        '<i><b class="mn"></b></i><i><b class="mx"></b></i><i class="cl"><svg viewBox="0 0 16 16"><path d="m4 4 8 8M12 4 4 12"/></svg></i>';
      const menu = u.el('div', 'menubar', win);
      cfg.menus.forEach((l) => {
        const m = u.el('span', '', menu);
        u.el('u', '', m, l[0]);
        u.el('span', '', m, l.slice(1));
      });
      let collide = null;
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const own = String(label).trim().toLowerCase();
        const choices = [...new Set(endLabels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== own);
        if (choices.length) collide = { label: collideR.pick(choices), where: collideR.pick(['toolbar', 'footer']) };
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collide && collide.where === 'toolbar') decoy(menu, collide.label);
      if (!ctx.finish && placement === 'toolbar') submit = endButton(menu, 'submit chrome-end', label);
      const work = u.el('div', 'workspace', win);
      const stage = u.el('div', 'stage', work);
      if (display === 'panel') {
        const p = u.el('aside', 'instruction-panel', work);
        u.el('strong', '', p, 'Task');
        u.el('p', '', p, ctx.instruction);
        p.dataset.display = display;
      }
      const st = u.el('div', 'statusbar', win, cfg.status);
      if (collide && collide.where === 'footer') decoy(st, collide.label);
      if (!ctx.finish && placement === 'footer') submit = endButton(st, 'submit chrome-end', label);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      const hd = u.el('div', 'nl-h', el);
      const ic = u.el('span', 'nl-ic', hd);
      ic.innerHTML =
        '<svg viewBox="0 0 48 52"><defs><linearGradient id="newsletter-mail" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d2d4d4"/></linearGradient></defs><path d="m3 18 21-16 21 16v31H3z" fill="#e7edf0" stroke="#62686d" stroke-width="1.6"/><path d="M8 16V9h32v29H8z" fill="#fdfdfe" stroke="#727d87" stroke-width="1.3"/><path d="M12 15h24M12 20h24M12 25h24" stroke="#8da5b8" stroke-width="2.5"/><path d="m3 18 21 17 21-17v31H3z" fill="url(#newsletter-mail)" stroke="#62686d" stroke-width="1.6"/><path d="m4 47 15-16m25 16L29 31" stroke="#aeb3b4" fill="none"/><path d="m6 46 13-13m24 13L29 33" stroke="#fff" fill="none"/></svg>';
      const tx = u.el('div', 'nl-t', hd);
      u.el(
        'strong',
        '',
        tx,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'Get Our Newsletter',
          banner: 'Service notice',
        }[ctx.kind],
      );
      u.el(
        'p',
        '',
        tx,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Tips, news and updates, once a week.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', 'dismiss', hd, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const ft = u.el('div', 'nl-f', el);
      const en = u.el('span', 'nl-env', ft);
      en.innerHTML =
        '<svg viewBox="0 0 64 52"><rect x="3" y="7" width="58" height="38" rx="1" fill="#fffcf3" stroke="#ecb13c" stroke-width="2.5"/><path d="m4 9 24 22q4 3 8 0L60 9" fill="none" stroke="#ecb13c" stroke-width="2.4"/><path d="m5 43 16-15m38 15L44 28" fill="none" stroke="#f9e8bd" stroke-width="1.5"/></svg>';
      const ft2 = u.el('div', 'nl-ft', ft);
      u.el('strong', '', ft2, 'Stay in the loop!');
      u.el('i', '', ft2);
      u.el('i', 's', ft2);
      const lf = u.el('span', 'nl-leaf', ft);
      lf.innerHTML =
        '<svg viewBox="0 0 76 82"><path d="M30 78C4 72-4 50 3 40c17-4 29 13 27 38z" fill="#c9bf9b"/><path d="M38 79C25 51 36 10 61 6c17-2 17 45-23 73z" fill="#cfc5a1"/><path d="M38 79C33 61 35 48 40 40l25 7C60 62 51 74 38 79z" fill="#efd681"/><path d="m38 79 17-45" stroke="#fff1ba" stroke-width="2" fill="none"/></svg>';
      return { el, dismiss };
    },
  });
})();
