(function () {
  'use strict';
  const FOLDER =
    '<svg viewBox="0 0 44 36"><defs><linearGradient id="folder-fill" x2=".5" y2="1"><stop stop-color="#d8d5bd"/><stop offset="1" stop-color="#aaa98d"/></linearGradient></defs><path d="M2 6 5 3h13l4 5h20v26H2Z" fill="url(#folder-fill)" stroke="#25251b" stroke-width="2"/><path d="M3 9h37v23" fill="none" stroke="#f7f5df" stroke-width="1.3"/><path d="M4 33h38V9" fill="none" stroke="#555443"/></svg>';
  const DOC =
    '<svg viewBox="0 0 36 44"><path d="M3 2h20l10 10v30H3Z" fill="#f6f6f1" stroke="#222" stroke-width="2"/><path d="M23 2v10h10M8 7h11M8 11h11M8 16h20M8 20h20M8 24h20M8 28h20M8 32h20M8 36h20" fill="none" stroke="#444" stroke-width="1.5"/><path d="M5 4v36h26" fill="none" stroke="#aaa"/></svg>';
  const FILES = [
    ['Documents', '--', 'Apr 12 10:24', 1],
    ['Pictures', '--', 'Apr 11 09:03', 1],
    ['Projects', '--', 'Apr 10 16:18', 1],
    ['notes.txt', '2 KB', 'Apr 09 14:55', 0],
    ['todo.txt', '1 KB', 'Apr 08 11:20', 0],
    ['report.txt', '4 KB', 'Apr 07 17:06', 0],
  ];
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-control-button-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref motif';
      const endRng = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_LABELS;
      const keepDefault = !ctx.finish && endRng.bool(0.5);
      const endLabel = keepDefault ? 'Submit' : labelOf(endRng.pick(endBank));
      const placement = ctx.finish ? null : keepDefault ? 'footer' : endRng.pick(['menu', 'title', 'footer-link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const opts = [
          ...new Set(endBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (opts.length) collision = { label: collideRng.pick(opts), where: collideRng.pick(['menu', 'footer']) };
      }
      const shell = u.el('main', 'shell mw', document.body);
      const title = u.el('header', 'mw-title', shell);
      const ic = u.el('span', 'mw-icon', title);
      ic.innerHTML =
        '<svg viewBox="0 0 24 26"><path fill="#eee9dc" stroke="#292920" d="M2 1h20v24H2Z"/><path d="M5 4h3v17H5zM11 4h3v6h-3zM17 4h2v17h-2M10 13h4v8h-4M4 8h16M4 18h16" fill="none" stroke="#4c4b43" stroke-width="1"/><path d="m5 3 14 20M9 3l9 15M4 13l7 10" stroke="#77756c" stroke-width=".6"/></svg>';
      u.el('span', 'mw-title-text', title, 'Task Application');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 13h8"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'mw-menu', shell);
      ['File', 'Edit', 'View', 'Tools'].forEach((l) => {
        const m = u.el('span', 'menu-label', menu);
        u.el('u', '', m, l[0]);
        u.el('span', '', m, l.slice(1));
      });
      const help = u.el('span', 'menu-label help', menu, 'Help');
      const body = u.el('div', 'mw-body', shell);
      body.dataset.display = ctx.display;
      const ip = u.el('div', 'ipanel', body);
      ip.hidden = ctx.display === 'hidden';
      const note = u.el('div', 'instruction', ip);
      note.dataset.display = ctx.display;
      if (ctx.display === 'panel') {
        u.el('span', 'instruction-heading', note, 'Task instructions');
        u.el('span', 'instruction-copy', note, ctx.instruction);
      } else u.el('span', 'instruction-copy', note, ctx.instruction);
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const makeDecoy = (parent, label, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      if (collision && collision.where === 'menu') makeDecoy(menu, collision.label, true);
      let submit = null;
      if (placement === 'menu') submit = makeEnd(menu, 'chrome-end menu-end', endLabel);
      if (placement === 'title') submit = makeEnd(title, 'chrome-end title-end', endLabel);
      const main = u.el('div', 'mw-main', body);
      const files = u.el('div', 'group files', main);
      u.el('span', 'legend', files, 'Files');
      const list = u.el('div', 'flist', files);
      const head = u.el('div', 'frow fhead', list);
      ['Name', 'Size', 'Modified'].forEach((h) => u.el('span', 'c', head, h));
      FILES.forEach((f, i) => {
        const r = u.el('div', 'frow' + (i === 0 ? ' sel' : ''), list);
        const n = u.el('span', 'c n', r);
        const ico = u.el('i', 'fi', n);
        ico.innerHTML = f[3] ? FOLDER : DOC;
        u.el('span', '', n, f[0]);
        u.el('span', 'c', r, f[1]);
        u.el('span', 'c', r, f[2]);
      });
      const sb = u.el('div', 'vscroll', list);
      u.el('span', 'sb-up', sb);
      u.el('span', 'sb-thumb', sb);
      u.el('span', 'sb-down', sb);
      const right = u.el('div', 'rightcol', main);
      if (ctx.display === 'panel') right.prepend(ip);
      const det = u.el('div', 'group details', right);
      u.el('span', 'legend', det, 'Details');
      const dh = u.el('div', 'dhead', det);
      const di = u.el('i', 'fi big', dh);
      di.innerHTML = FOLDER;
      u.el('b', '', dh, 'Documents');
      [
        ['Type:', 'Folder'],
        ['Size:', '--'],
        ['Modified:', 'Apr 12 10:24'],
      ].forEach(([a, b]) => {
        const r = u.el('div', 'drow', det);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      });
      const r4 = u.el('div', 'drow sep', det);
      u.el('span', '', r4, 'Contains:');
      u.el('span', '', r4, '3 items');
      const stage = u.el('div', 'stage', right);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, 'Ready.');
      const btns = u.el('div', 'foot-btns', foot);
      if (collision && collision.where === 'footer') makeDecoy(btns, collision.label, true);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(btns, 'submit', endLabel);
      else if (!ctx.finish && placement === 'footer-link') {
        submit = u.el('a', 'end-link', btns, endLabel + ' ›');
        submit.href = '#';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const close = u.el('button', 'closebtn', btns, 'Close');
      close.type = 'button';
      close.addEventListener('click', () => env.log('decoy', { label: 'Close' }));
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
