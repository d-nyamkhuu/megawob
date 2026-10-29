(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-11',
    'brand': '●',
    'mode': 'top',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ffffff',
      'fg': '#000000',
      'accent': '#000000',
      'font': 'Arial, Helvetica, sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'File    Edit    View    Special    Help',
    'obstruction': [
      'Tip of the Day',
      'You can expand and collapse folders by clicking the triangles next to the folder icons.',
      'Close',
    ],
    'footer': '',
  };
  env.site({
    name: D.site,
    initialOverlay: { kind: 'toast' },
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const referenceEnd = er.bool(0.5);
      const endLabel = referenceEnd ? 'Submit' : labelOf(er.pick(endLabels));
      const placement = ctx.finish ? null : referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const collisionPool = [
        ...new Set(endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
      ];
      const collision = cr.bool(0.3) && collisionPool.length ? labelOf(cr.pick(collisionPool)) : null;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header, D.brand);
      brand.innerHTML =
        '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 7C9 4 4 4 2 9C-1 15 4 23 8 24L12 22L15 24C19 24 22 18 23 15C18 14 17 9 22 7C18 3 15 4 12 7ZM12 5C12 2 15 0 18 0C18 3 15 5 12 5Z" fill="#000"/></svg>';
      u.el('nav', 'design-nav', header, D.nav);
      const clock = u.el('span', 'mac-clock', header);
      clock.innerHTML =
        '10:24 AM <svg viewBox="0 0 20 20" width="34" height="34" style="margin:0 30px 0 38px;vertical-align:middle"><rect x="1.5" y="1.5" width="17" height="17" rx="3" fill="#fff" stroke="#000" stroke-width="2"/><text x="10" y="15" font-size="14" font-weight="700" text-anchor="middle" font-family="monospace">?</text></svg><svg viewBox="0 0 20 20" width="34" height="34" style="vertical-align:middle"><path d="M4 1h12l2 3v7h1v7H1v-7h1V4z" fill="white" stroke="black" stroke-width="2"/><path d="M5 4h10v6H5zM3 13h14v3H3z" fill="black"/><path d="M7 5h2v2h3v2H7zM5 14h10" fill="white" stroke="white"/></svg>';
      const bitmap = u.el('svg', 'bitmap-defs', header);
      bitmap.outerHTML =
        '<svg class="bitmap-defs" xmlns="http://www.w3.org/2000/svg"><defs><filter id="bitmap-ink" x="-5%" y="-5%" width="110%" height="110%"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></defs></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin' || ctx.display === 'panel') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const fl = u.el('span', 'footer-label', footer, 'Current Location:');
      fl.insertAdjacentHTML(
        'afterbegin',
        '<svg viewBox="0 0 28 36" aria-hidden="true"><path d="M2 2h16l8 8v24H2zM18 2v9h8M7 16h14M7 21h14M7 26h14" fill="white" stroke="black" stroke-width="2"/></svg>',
      );
      u.el('div', 'current-location', footer, 'Macintosh HD ▸ Projects');
      let submit = null;
      const decoy = (parent) => {
        const b = u.el('button', 'mac-xtra', parent, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = u.el('button', 'end-control mac-end-header', header, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'link') {
          submit = u.el('a', 'mac-end-link', footer, endLabel + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'end-control', footer, endLabel);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      if (collision) {
        if (placement === 'header') decoy(footer);
        else {
          const b = decoy(header);
          header.insertBefore(b, clock);
        }
      }
      if (submit && placement === 'header') header.insertBefore(submit, clock);
      if (submit) {
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
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
      if (/Tip/.test(title)) el.classList.add('tip-window');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      const heading = u.el('h2', '', el);
      u.el('span', 'window-caption', heading, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.className = 'tip-checkbox';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      if (/Tip/.test(title)) {
        el.append(actions);
        const bulb = u.el('span', 'tip-bulb', el);
        bulb.innerHTML =
          '<svg viewBox="0 0 70 80"><path d="M24 58c0-12-13-15-13-31a22 22 0 0 1 44 0c0 16-13 19-13 31zM24 58h18v9H24zM26 67h14l-3 6h-8zM33 0v-10M8 6 1-1M58 6l7-7M3 28H-7M63 28h10" transform="translate(1 8)" fill="none" stroke="black" stroke-width="3"/></svg>';
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
