(function () {
  'use strict';
  const ICONS = {
    shell:
      '<svg viewBox="0 0 64 58"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path fill="#999" d="M13 10 24 3h22v26H13z"/><path fill="#eee" d="M13 10h27v25H13z"/><path fill="#fff" d="m19 10 7-4h15l-5 4z"/><path fill="#bbb" d="M18 14h17v13H18z"/><path fill="#fff" d="M5 21h24v27H5z"/><path fill="#eee" d="m5 21 8-5h21l-5 5z"/><path fill="#999" d="m29 21 5-5v27l-5 5z"/><path fill="#ddd" d="M40 23h18v22H40z"/><path fill="#fff" d="m40 23 6-4h17l-5 4v22l-7 5H36V28z"/><path fill="#999" d="m58 23 5-4v22l-5 4z"/><path fill="#eee" d="M19 32h22v23H19z"/><path fill="#96c4c4" d="M23 36h13v14H23z"/><path fill="none" d="m20 33 5-4h20v22l-4 4M26 38h7M26 42h7M26 46h5M10 44h9M15 38v12"/></g></svg>',
    prog: '<svg viewBox="0 0 60 66"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path fill="#999" d="m10 14 11-11h33v51l-11 10H10z"/><path fill="#f5f5f5" d="m10 14 11-11h33L43 14z"/><path fill="#ddd" d="M10 14h33v50H10z"/><path fill="#888" d="m43 14 11-11v51L43 64z"/><path fill="#ccc" d="M13 17h27v12H13zM13 32h27v12H13zM13 47h27v13H13z"/><path fill="#fff" d="M22 21h10v4H22zM22 36h10v4H22zM22 51h10v4H22z"/><path fill="none" stroke="#777" stroke-width="1" d="M15 28h23M15 43h23M15 59h23"/></g></svg>',
    tmpl: '<svg viewBox="0 0 60 72"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path fill="#eee" d="m13 3 37 7-3 53-34-7z"/><path fill="#999" d="m50 10 5-2-3 51-5 4z"/><path fill="#fff" d="m13 3 4-2 38 7-5 2z"/><path fill="#ccc" d="m7 16 36 8v45L7 60z"/><path fill="#eee" d="m7 16 5-2 36 8-5 2z"/><path fill="#888" d="m43 24 5-2v43l-5 4z"/><path fill="none" d="m36 25 3 5 2-6"/></g></svg>',
    trash:
      '<svg viewBox="0 0 60 76"><g stroke="#111" stroke-width="2.2" stroke-linejoin="round"><path fill="#ddd" d="m8 18 5 51q17 9 34 0l5-51z"/><ellipse fill="#eee" cx="30" cy="17" rx="26" ry="9"/><ellipse fill="#aaa" cx="30" cy="17" rx="20" ry="5"/><path fill="#eee" d="M23 17v-7q0-7 8-7t8 7v5h-5v-5q0-3-4-3t-3 3v7z"/><path fill="none" d="m14 28 4 39m3-37 2 39m7-38v39m8-40-2 39m10-41-5 39"/><path fill="none" stroke="#fff" d="m17 30 4 35m6-33v35m15-36-4 36"/></g></svg>',
    folder:
      '<svg viewBox="0 0 36 30"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path fill="#eee" d="M3 7V3h11l4 4h14v21H3z"/><path fill="#00c8d0" d="M1 8h28v17H1z"/><path fill="none" d="m29 8 4-3v20l-4 3M5 25h20"/></g></svg>',
    document:
      '<svg viewBox="0 0 28 36"><path fill="#fff" stroke="#111" stroke-width="2" d="M3 2h15l7 7v25H3z"/><path fill="none" stroke="#111" stroke-width="1.8" d="M18 2v8h7M7 6h7M7 10h7M7 15h14M7 19h14M7 23h14M7 27h14M7 30h14"/></svg>',
    printer:
      '<svg viewBox="0 0 36 34"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path fill="#eee" d="M9 2h19v12H9z"/><path fill="#ccc" d="M3 12h30v16H3z"/><path fill="#fff" d="M8 21h20v11H8z"/><path fill="none" d="M8 17h5M11 25h14M11 29h14M12 6h13"/></g></svg>',
    system:
      '<svg viewBox="0 0 30 32"><g stroke="#111" stroke-width="1.8" stroke-linejoin="round"><path fill="#eee" d="m5 6 4-3h17v25H5z"/><path fill="#bbb" d="M3 7h20v23H3z"/><path fill="#fff" d="M7 10h12v15H7z"/><path fill="none" d="M11 12v11m4-12v14M9 9l10-3M9 16h9"/></g></svg>',
    switcher:
      '<svg viewBox="0 0 32 30"><g stroke="#111" stroke-width="1.7"><path fill="#eee" d="M2 9h23v17H2z"/><path fill="#999" d="M12 3h17v17H12z"/><path fill="#fff" d="M6 14h13v13H6z"/><path fill="none" d="m5 20 17-9m-9-2 10 1-1 8M4 24h17"/></g></svg>',
  };
  env.site({
    name: 'design-click-control-dialog-09',
    styles: ['os2.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'os2';
      const root = u.el('main', 'desk', document.body);
      const top = u.el('header', 'topbar', root);
      const tl = u.el('span', 'tb-icon', top);
      tl.innerHTML = ICONS.system;
      u.el('span', 'tb-title', top, 'OS/2   Workplace Shell');
      const tr = u.el('span', 'tb-clock', top);
      u.el('i', 'tb-mini', tr).innerHTML = ICONS.switcher;
      u.el('span', '', tr, 'Mon  Apr 25, 1994   10:14 AM');
      [
        ['shell', 'Workplace Shell', '8.3%'],
        ['prog', 'Programs', '24.8%'],
        ['tmpl', 'Templates', '42.7%'],
        ['trash', 'Shredder', '61.2%'],
      ].forEach(([k, l, t]) => {
        const d = u.el('div', 'dicon dicon-' + k, root);
        d.style.top = t;
        const i = u.el('span', 'dglyph', d);
        i.innerHTML = ICONS[k];
        u.el('span', 'dlabel', d, l);
      });
      const fm = u.el('section', 'fm', root);
      const ft = u.el('div', 'fm-title', fm);
      u.el('i', 'fm-ico', ft).innerHTML = ICONS.folder;
      u.el('span', 'fm-name', ft, 'File Manager - Documents');
      const fc = u.el('span', 'fm-ctl', ft);
      fc.innerHTML = '<b>_</b><b>□</b><b>×</b>';
      const fmenu = u.el('div', 'fm-menu', fm);
      ['Folder', 'Edit', 'View', 'Selected', 'Help'].forEach((t) => u.el('span', '', fmenu, t));
      const tabs = u.el('div', 'fm-tabs', fm);
      ['Documents', 'Pictures', 'Utilities'].forEach((t, i) => {
        const tab = u.el('span', i ? '' : 'on', tabs);
        u.el('label', 'tab-label', tab, t);
      });
      const fbody = u.el('div', 'fm-body', fm);
      const tree = u.el('div', 'fm-tree', fbody);
      const tr0 = u.el('div', 't0', tree);
      u.el('i', 'minus', tr0);
      u.el('i', 'fold', tr0);
      u.el('span', 'sel', tr0, 'Documents');
      ['Letters', 'Reports', 'Spreadsheets'].forEach((t) => {
        const r = u.el('div', 't1', tree);
        u.el('i', 'fold', r);
        u.el('span', '', r, t);
      });
      const list = u.el('div', 'fm-list', fbody);
      const lh = u.el('div', 'lh', list);
      ['Name ▲', 'Size', 'Modified'].forEach((t) => u.el('span', '', lh, t));
      [
        ['Budget.doc', '24 KB', '04/12/94'],
        ['Meeting.txt', '3 KB', '04/20/94'],
        ['Plan.doc', '18 KB', '04/22/94'],
      ].forEach((r) => {
        const d = u.el('div', 'lr', list);
        u.el('i', 'doc', d).innerHTML = ICONS.document;
        r.forEach((t) => u.el('span', '', d, t));
      });
      const stage = u.el('div', 'stage', fbody);
      const fst = u.el('div', 'fm-status', fm, '3 object(s)');
      const note = u.el('div', 'instruction', root);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      u.el('div', 'note-h', note, 'Task');
      u.el('div', 'note-b', note, ctx.instruction);
      if (ctx.instruction.length > 110) note.classList.add('instruction-long');
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'workspace' : er.pick(['toolbar', 'taskbar']);
      const endLabel = original ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', root, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const bar = u.el('footer', 'taskbar', root);
      const b1 = u.el('span', 'tk tk-os', bar);
      u.el('i', 'tk-ico', b1).innerHTML = ICONS.shell;
      u.el('span', '', b1, 'OS/2');
      u.el('span', 'tk tk-win', bar, 'File Manager - Documents');
      const br = u.el('span', 'tk-right', bar);
      u.el('i', 'tk-p', br).innerHTML = ICONS.printer;
      u.el('i', 'tk-p', br).innerHTML = ICONS.document;
      u.el('span', 'tk-time', br, '10:14 AM');
      if (submit && placement === 'toolbar') {
        submit.classList.add('submit-toolbar');
        fmenu.append(submit);
      }
      if (submit && placement === 'taskbar') {
        submit.classList.add('submit-taskbar');
        bar.insertBefore(submit, br);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [...new Set(endWords)].filter((l) => l.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = cr.pick(choices);
          const decoy = u.el('button', 'chrome-xtra', placement === 'toolbar' ? bar : fmenu, label);
          if (placement === 'toolbar') bar.insertBefore(decoy, br);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
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
