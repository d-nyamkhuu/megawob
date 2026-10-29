(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-terminal-02',
    'brand': 'Terminal',
    'mode': 'web2m',
    'tokens': {
      'bg': '#285184',
      'panel': '#ccccd2',
      'fg': '#0a1038',
      'accent': '#f5da48',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      document.body.classList.add('web2');
      const header = u.el('header', 'design-header', shell);
      const hr = u.el('div', 'w2-top', header);
      const logo = u.el('span', 'w2-logo', hr);
      logo.innerHTML =
        '<svg viewBox="0 0 44 40" width="44" height="40"><defs><linearGradient id="folder-gloss" x2="0" y2="1"><stop stop-color="#e4f5ff"/><stop offset="1" stop-color="#56a9f4"/></linearGradient></defs><path d="M3 10 5 4h13l4 4h14l3 5v22H3Z" fill="#c4e4ff" stroke="#78afe5" stroke-width="1.5"/><path d="M6 13 10 7h27l3 6" fill="#e8f5ff" stroke="#78afe5" stroke-width="1.5"/><path d="M3 13h39l-3 23H2Z" fill="url(#folder-gloss)" stroke="#5596d9" stroke-width="1.5"/></svg>';
      u.el('span', 'w2-brand', hr, 'Codercise');
      u.el('span', 'w2-crumb', hr, 'Practice  >  Terminal Skills  >  File Management');
      const lk = u.el('span', 'w2-links', hr);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => u.el('a', '', lk, t));
      const tabs = u.el('div', 'w2-tabs', header);
      ['Tasks', 'Terminal', 'Notes', 'Resources'].forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const ar = u.el('span', 'w2-arrow', note);
        ar.innerHTML =
          '<svg viewBox="0 0 40 40" width="100%" height="100%"><defs><linearGradient id="arrow-gloss" x2="0" y2="1"><stop stop-color="#8bb9e5"/><stop offset="1" stop-color="#3979b9"/></linearGradient></defs><circle cx="20" cy="20" r="19" fill="url(#arrow-gloss)" stroke="#5c94ca"/><path d="M9 20h19M20 11l9 9-9 9" stroke="#fff" stroke-width="4" fill="none"/></svg>';
        const copy = u.el('div', 'w2-note-copy', note);
        u.el('p', '', copy, ctx.instruction);
        const detail = u.el('div', 'w2-note-detail', copy);
        u.el(
          'div',
          '',
          detail,
          'The terminal is already open in your workspace. The available files are listed below.',
        );
        u.el('div', '', detail, 'Type the appropriate command to delete the file. Press Enter when you are ready.');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const dock = u.el('div', 'w2-dock', footer);
      [
        ['Common Commands', ['ls', 'cd', 'pwd', 'rm', 'mkdir', 'cat', 'mv', 'cp']],
        ['Insertion Snippets', ['~/games', '*.html', 'rm <file>', 'ls -l', 'cd ..']],
      ].forEach(([h, bs]) => {
        const g = u.el('div', 'w2-grp', dock);
        u.el('h4', '', g, h);
        const r = u.el('div', 'w2-btns', g);
        bs.forEach((b) => u.el('span', 'w2-chip', r, b));
      });
      const kb = u.el('div', 'w2-grp w2-kb', dock);
      u.el('h4', '', kb, 'Keyboard Help');
      [
        ['↑↓', 'Scroll command history'],
        ['Tab', 'Auto-complete'],
        ['Ctrl + C', 'Cancel current command'],
      ].forEach(([a, b]) => {
        const r = u.el('div', '', kb);
        u.el('b', '', r, a);
        u.el('span', '', r, b);
      });
      const content = ctx.content || {},
        endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelBank =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabels = labelBank.map(asLabel),
        submitWord = submitLabels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit',
        otherLabels = submitLabels.filter((x) => x.trim().toLowerCase() !== submitWord.trim().toLowerCase());
      const endLabel = endRng.bool(0.5) || !otherLabels.length ? submitWord : asLabel(endRng.pick(otherLabels));
      const placement = endRng.pick(['dock', 'dock', 'dock', 'tabs', 'tabs', 'link']);
      let collide = null;
      if (collideRng.bool(0.3)) {
        const pool = [
          ...new Set(labelBank.map(asLabel).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (pool.length) collide = collideRng.pick(pool);
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', isCollide ? 'w2-end-xtra' : 'w2-end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      let submit = null;
      if (collide) decoyBtn(placement === 'dock' ? kb : tabs, collide, true);
      if (!ctx.finish) {
        if (placement === 'dock') {
          submit = u.el('button', 'end-control', footer, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'tabs') {
          submit = u.el('button', 'end-control w2-end-tab', tabs, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else {
          submit = u.el('a', 'end-control w2-end-link', footer, endLabel + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
