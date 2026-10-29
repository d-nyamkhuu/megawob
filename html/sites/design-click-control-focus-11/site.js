(function () {
  'use strict';
  const cfg = {
    title: 'Contact Entry - Address Book',
    menus: ['File', 'Edit', 'View', 'Tools', 'Help'],
    group: 'Contact Information',
  };
  const COMPUTER =
    '<svg viewBox="0 0 48 48" shape-rendering="crispEdges"><path d="M8 5 12 2h27v28l-3 4H9Z" fill="#808080" stroke="#111"/><path d="M8 5h28v27H8Z" fill="#c0c0c0" stroke="#fff"/><path d="M12 9h20v18H12Z" fill="#000"/><path d="M14 11h17v14H14Z" fill="#0000ff"/><path d="M8 30h28v3H8Z" fill="#fff"/><path d="m7 34 29-1 6 5v7H3v-8Z" fill="#c0c0c0" stroke="#111"/><path d="M4 38h36M5 39v4h34" fill="none" stroke="#fff"/><path d="M8 39h3v3H8Zm6 0h3v3h-3Z" fill="#000"/><path d="M9 39h2v2H9Z" fill="#ffff00"/><path d="M26 39h10v2H26Z" fill="#808080"/></svg>';
  const ICON =
    '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M5 2h23v19H5Z" fill="#c0c0c0" stroke="#111"/><path d="M7 4h19v12H7Z" fill="#000"/><path d="M8 5h17v8H8Z" fill="#000080"/><path d="M9 6h14v1H9Z" fill="#00ffff"/><path d="M2 20h28v10H2Z" fill="#c0c0c0" stroke="#000"/><path d="M3 21h25M3 22v6h25" fill="none" stroke="#fff"/><path d="M6 23h4v2H6Zm7 0h4v2h-4Zm7 0h5v2h-5ZM6 27h4v1H6Zm7 0h4v1h-4Z" fill="#000"/></svg>';
  env.site({
    name: 'design-click-control-focus-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endWords =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endRng.bool(0.5)
        ? 'Submit'
        : endText(endRng.pick(endWords.filter((x) => endText(x) !== 'Submit')) || 'Done');
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'menubar', 'taskbar', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide =
        !ctx.finish && collideRng.bool(0.3)
          ? endText(
              collideRng.pick(endWords.map(endText).filter((x) => x.toLowerCase() !== label.toLowerCase())) || 'Done',
            )
          : null;
      document.body.className = 'ref w31';
      const shell = u.el('main', 'shell', document.body);
      const win = u.el('div', 'win', shell);
      const title = u.el('div', 'title', win);
      const ti = u.el('span', 'title-icon', title);
      ti.innerHTML =
        '<svg viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M3 2h26v28H3Z" fill="#000080" stroke="#fff"/><path d="m9 8 15-3 3 18-14 4-6-3Z" fill="#808080" stroke="#111"/><path d="M9 7h15v18H9Z" fill="#c0c0c0" stroke="#fff"/><path d="M6 10h5v17H6Z" fill="#808080" stroke="#111"/><path d="M7 12h3M7 16h3M7 20h3M7 24h3" stroke="#fff"/><path d="m14 9 7-2 3 14-8 2" fill="#b0b0b0"/><path d="M14 26h10v2H14Z" fill="#fff"/></svg>';
      u.el('span', 'title-text', title, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h9"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'menubar', win);
      cfg.menus.forEach((m) => {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      });
      const work = u.el('div', 'work', win);
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden' || display === 'panel';
      if (display === 'toast') note.classList.add('instruction-toast');
      const group = u.el('fieldset', 'group', center);
      u.el('legend', '', group, cfg.group);
      const stage = u.el('div', 'stage', group);
      const foot = u.el('div', 'footer', group);
      let submit = null;
      const endBtn = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'submit');
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((i) => {
          i.value = '';
        }),
      );
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Contact Details');
      if (display === 'panel') u.el('div', 'instruction instruction-panel', aside, ctx.instruction);
      const g1 = u.el('fieldset', 'igroup g1', aside);
      u.el('legend', '', g1, 'Contact Type');
      [
        ['Personal', 1],
        ['Business', 0],
        ['Other', 0],
      ].forEach((r) => {
        const l = u.el('div', 'radio', g1);
        u.el('i', r[1] ? 'on' : '', l);
        u.el('span', '', l, r[0]);
      });
      const g2 = u.el('fieldset', 'igroup g2', aside);
      u.el('legend', '', g2, 'Notes');
      const ta = u.el('div', 'notes', g2);
      u.el('span', '', ta, 'Met at trade show.');
      const sb = u.el('div', 'sbar', ta);
      u.el('b', 'up', sb);
      u.el('b', 'dn', sb);
      const g3 = u.el('fieldset', 'igroup g3', aside);
      u.el('legend', '', g3, 'Add to Group');
      const dd = u.el('div', 'combo', g3);
      u.el('span', '', dd, 'None');
      u.el('b', '', dd);
      const cb = u.el('div', 'check', g3);
      u.el('i', '', cb);
      u.el('span', '', cb, 'Add to favorites');
      const bar = u.el('footer', 'taskbar', shell);
      const a = u.el('span', 'tb-item', bar);
      a.innerHTML = ICON + '<em>Program Manager</em>';
      u.el('span', 'tb-sep', bar);
      const b = u.el('span', 'tb-item active', bar);
      b.innerHTML = ICON + '<em>' + cfg.title + '</em>';
      const tray = u.el('span', 'tray', bar);
      tray.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#ffff00" stroke="#000"/><path d="m8 9 2-2v10l-2-2Z" fill="#fff"/><path d="M15 8q3 4 0 8M18 6q5 6 0 12M20 3q6 9 0 18" fill="none" stroke="#000"/></svg><em>10:14 AM</em>';
      if (!ctx.finish && placement === 'menubar') submit = endBtn(menu, 'submit chrome-end menu-end');
      if (!ctx.finish && placement === 'taskbar') submit = endBtn(bar, 'submit chrome-end taskbar-end');
      if (collide) {
        const d = u.el('button', 'chrome-xtra', placement === 'taskbar' ? bar : menu, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'perturb upd ' + ctx.kind, document.body);
      const t = u.el('div', 'upd-title', el);
      u.el('span', '', t, 'Software Update Reminder');
      const x = u.el('button', 'upd-x', t, '');
      x.type = 'button';
      x.innerHTML = '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg>';
      const body = u.el('div', 'upd-body', el);
      const pc = u.el('div', 'upd-pc', body);
      pc.innerHTML = COMPUTER;
      const tx = u.el('div', 'upd-text', body);
      const version = u.el('p', '', tx);
      version.innerHTML = 'A newer version of Address Book<br>is available (v3.2).';
      u.el('p', '', tx, 'We recommend updating for the latest improvements and security fixes.');
      const btns = u.el('div', 'upd-btns', el);
      const dismiss = u.el('button', 'dismiss', btns, 'Remind me later');
      dismiss.type = 'button';
      const inst = u.el('button', 'install', btns, 'Install now');
      inst.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      x.addEventListener('click', ctx.dismiss);
      inst.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
