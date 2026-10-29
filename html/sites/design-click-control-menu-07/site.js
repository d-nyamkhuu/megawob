(function () {
  'use strict';
  const apple =
    '<svg viewBox="0 0 16 16" width="16" height="16"><path fill="#111" d="M11 8.5c0-1.4 1.1-2 1.2-2.1-.7-1-1.7-1.1-2-1.1-.9-.1-1.700.5-2.100.5s-1.100-.5-1.800-.5C5.400 5.300 4.500 5.900 4 6.700c-1 1.700-.3 4.200.7 5.500.5.700 1 1.400 1.800 1.400.7 0 1-.5 1.800-.5s1.100.5 1.800.5c.8 0 1.200-.7 1.700-1.300.5-.8.7-1.500.8-1.500-.1 0-1.600-.6-1.600-2.200zM9.600 4.200c.4-.5.7-1.200.6-1.800-.6 0-1.300.4-1.700.9-.4.4-.7 1.100-.6 1.700.6.1 1.300-.3 1.700-.8z"/></svg>';
  env.site({
    name: 'design-click-control-menu-07',
    styles: ['site.css', 'aqua.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref aqua';
      const bar = u.el('header', 'mbar', document.body);
      u.el('span', 'mb-apple', bar).innerHTML = apple;
      ['TextEdit', 'File', 'Edit', 'Format', 'View', 'Window', 'Help'].forEach((t, i) =>
        u.el('span', 'mb-item' + (i === 0 ? ' mb-app' : ''), bar, t),
      );
      const status = u.el('span', 'mb-status', bar);
      status.innerHTML =
        '<svg viewBox="0 0 90 24"><g fill="#07182b"><path d="M2 5h19v12H2zM8 18h7v2H8z"/><path d="M32 9q9-9 18 0l-3 3q-6-6-12 0zm5 5q4-4 8 0l-4 5z"/><path d="M66 8q0-6 5-6t5 6v10H66zM63 9h3v10h-3zM76 9h3v10h-3zM69 19h5v3h-5z"/></g></svg>';
      u.el('span', 'mb-clock', bar, 'Mon 10:24 AM');
      u.el('span', 'mb-search', bar).innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
      const left = u.el('section', 'leftpane', document.body);
      const note = u.el('div', 'instruction', left, ctx.instruction);
      const pathStart = ctx.instruction.search(/\S+\s*[>›]/);
      if (pathStart >= 0) {
        note.textContent = '';
        if (pathStart) u.el('span', 'instruction-verb', note, ctx.instruction.slice(0, pathStart));
        u.el('span', 'instruction-path', note, ctx.instruction.slice(pathStart));
      }
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.instruction.length > 85) note.classList.add('instruction-long');
      const er = ctx.rng.fork('chrome/end');
      const endWords = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const original = er.bool(0.5);
      const placement = original ? 'original' : er.pick(['header', 'status']);
      const endLabel = original ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, left, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = cr.pick(choices);
          const decoy = u.el('button', 'end-xtra', left, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const win = u.el('main', 'window', document.body);
      const tb = u.el('div', 'w-title', win);
      const lights = u.el('span', 'lights', tb);
      ['r', 'y', 'g'].forEach((c) => u.el('i', c, lights));
      u.el('span', 'w-name', tb, 'Project Notes.rtf');
      const tool = u.el('div', 'w-tools', win);
      [
        ['sel', 'Lucida Grande ⌄', 162],
        ['sel', 'Regular ⌄', 122],
        ['sel', '12 ⌄', 70],
      ].forEach((a) => {
        const s = u.el('span', 'tsel', tool, a[1]);
        s.style.width = a[2] + 'px';
      });
      u.el('span', 'tcolor', tool);
      const fmt = u.el('span', 'tgroup format-group', tool);
      ['B', 'I', 'U'].forEach((t) => u.el('b', 'tb', fmt, t));
      const al = u.el('span', 'tgroup align-group', tool);
      for (let i = 0; i < 4; i++) {
        const b = u.el('b', 'tb', al);
        let lines = '';
        for (let j = 0; j < 5; j++) {
          const width = i === 3 || j % 2 === 0 ? 19 : 13;
          const x = i === 1 ? (24 - width) / 2 : i === 2 ? 22 - width : 3;
          lines += '<path d="M' + x + ' ' + (4 + j * 4) + 'h' + width + '"/>';
        }
        b.innerHTML = '<svg viewBox="0 0 26 25">' + lines + '</svg>';
      }
      const gear = u.el('span', 'tgear', tool);
      gear.innerHTML =
        '<svg viewBox="0 0 24 24"><path fill="currentColor" d="m10 1 4 0 1 3 3-1 3 3-1 3 3 1v4l-3 1 1 3-3 3-3-1-1 3h-4l-1-3-3 1-3-3 1-3-3-1v-4l3-1-1-3 3-3 3 1z"/><circle cx="12" cy="12" r="4" fill="#b6d1f1"/></svg><span>⌄</span>';
      const ruler = u.el('div', 'ruler', win);
      for (let i = 0; i < 9; i++) {
        const mark = u.el('span', 'ruler-number', ruler, String(i));
        mark.style.left = 'calc(' + (1 + i * 9.85) + '% + ' + (i ? 7 : 0) + 'px)';
        if (i) {
          const tab = u.el('i', 'ruler-tab', ruler);
          tab.style.left = 0.8 + i * 9.85 + '%';
        }
      }
      const people = u.el('span', 'tpeople', tool);
      people.innerHTML =
        '<svg viewBox="0 0 24 24"><g fill="#41668f" stroke="#eef5ff" stroke-width=".7"><circle cx="8" cy="7" r="3"/><path d="M3 12q5-5 10 0v10H3z"/><circle cx="17" cy="6" r="3"/><path d="M13 11q4-4 8 0v11h-8z"/></g></svg><span>⌄</span>';
      const stage = u.el('div', 'stage', win);
      const rail = u.el('nav', 'toolrail', win);
      const ic = [
        '<rect x="4" y="3" width="16" height="19" rx="1" fill="#c5d5e8"/><path d="M7 7h10M7 11h10M7 15h10M7 19h6"/>',
        '<path d="M5 2h10l5 5v16H5z" fill="#f4faff"/><path d="M15 2v5h5"/>',
        '<text x="2" y="21" font-size="24" font-weight="bold" font-family="Georgia,serif" fill="#5278a8" stroke="none">A</text>',
        '<rect x="2" y="3" width="20" height="18" rx="1" fill="#d4e4f5"/><path d="M5 18v-3l5-6 4 6 3-3 3 6Z" fill="#527aaf" stroke="none"/><circle cx="16.5" cy="7.5" r="2" fill="#527aaf" stroke="none"/>',
        '<rect x="2" y="3" width="20" height="19" rx="1" fill="#edf5ff"/><path d="M2 8h20M2 13h20M2 17h20M7 8v14M12 8v14M17 8v14"/>',
      ];
      ic.forEach((p, i) => {
        const d = u.el('div', i === 1 ? 'active' : '', rail);
        d.innerHTML = '<svg viewBox="0 0 24 24">' + p + '</svg>';
      });
      const st = u.el('footer', 'w-status', win);
      u.el('span', '', st, 'Words:  48');
      u.el('span', '', st, 'Page 1 of 1');
      if (submit && placement === 'status') st.append(submit);
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
