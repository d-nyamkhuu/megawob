(function () {
  'use strict';
  const cfg = {
    title: 'Project Ledger',
    menus: ['File', 'Edit', 'View', 'Project', 'Window', 'Help'],
    tools: ['New', 'Open', 'Save', '|', 'Print', '|', 'Find', 'Notes'],
    cols: ['Section', 'Title', 'Items', 'Last Updated'],
  };
  const S = 'fill="#fff" stroke="#334" stroke-width="1.6"';
  const ICO = {
    New:
      '<svg viewBox="0 0 32 36"><path d="M3 2h19l7 8v24H3Z" ' +
      S +
      '/><path d="M22 2v8h7" fill="#dddfe5" stroke="#334" stroke-width="1.6"/><path d="M5 4v28h22" fill="none" stroke="#e4e5e9"/></svg>',
    Open: '<svg viewBox="0 0 36 36"><defs><linearGradient id="openFolder" x2="0" y2="1"><stop stop-color="#fff8ce"/><stop offset="1" stop-color="#efcf6b"/></linearGradient></defs><path d="M2 7q0-3 3-3h10l5 5h13v24H2Z" fill="#f7e8ac" stroke="#383947" stroke-width="1.5"/><path d="M2 12h32v21H2Z" fill="url(#openFolder)" stroke="#383947" stroke-width="1.5"/><path d="M4 14h28" stroke="#fffce0"/></svg>',
    Save: '<svg viewBox="0 0 34 36"><path d="M2 2h29l1 2v30H2Z" fill="#626cc5" stroke="#272d3d" stroke-width="1.6"/><path d="M5 3v29M29 3v29" stroke="#a5ace5"/><path d="M9 3h18v15H9Z" fill="#d7dbe3" stroke="#34394d"/><path d="M25 4v12" stroke="#f6f6f6" stroke-width="3"/><path d="M9 24h18v10H9Z" fill="#e3e6eb" stroke="#34394d"/><path d="M13 25h10v8H13Z" fill="#929aaf"/><path d="M15 26h6v6h-6Z" fill="#292e45"/></svg>',
    Print:
      '<svg viewBox="0 0 36 36"><defs><linearGradient id="printer" x2="0" y2="1"><stop stop-color="#f2f3f6"/><stop offset="1" stop-color="#989da8"/></linearGradient></defs><path d="M9 2h19v14H9Z" fill="#f9f9fb" stroke="#30343e" stroke-width="1.5"/><path d="m5 15 4-5h19l5 5v16H3V15Z" fill="url(#printer)" stroke="#30343e" stroke-width="1.5"/><path d="M4 17h28M6 21h24" stroke="#555d6a"/><path d="M10 24h17v11H10Z" fill="#f6f6f9" stroke="#30343e" stroke-width="1.5"/><path d="M13 27h11m-11 3h11m-11 3h11" stroke="#9296a0"/><path d="M27 18h3" stroke="#333" stroke-width="2"/></svg>',
    Find: '<svg viewBox="0 0 36 36"><defs><radialGradient id="lens"><stop stop-color="#e7f5ff"/><stop offset="1" stop-color="#a9c9df"/></radialGradient></defs><path d="m23 24 10 10" stroke="#30343d" stroke-width="6"/><path d="m24 25 8 8" stroke="#c1aa77" stroke-width="3"/><circle cx="14" cy="14" r="12" fill="url(#lens)" stroke="#343b48" stroke-width="2"/><path d="M6 13q0-7 7-7" fill="none" stroke="#fff" stroke-width="2"/><circle cx="14" cy="14" r="10" fill="none" stroke="#a1afbd"/></svg>',
    Notes:
      '<svg viewBox="0 0 32 36"><path d="M3 2h27v32H3Z" ' +
      S +
      '/><path d="M5 4h23v3H5Z" fill="#7598d0"/><path d="M8 11h16M8 15h16M8 19h16M8 23h16M8 27h13" stroke="#747b8a" stroke-width="1.4"/></svg>',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const endLabel = (rng, content) => {
    const labels = content && content.END_LABELS;
    return labelOf(
      rng.pick(
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'],
      ),
    );
  };
  env.site({
    name: 'design-click-control-collapsible-06',
    styles: ['mac.css'],
    frame(ctx) {
      const u = ctx.util;
      const endR = ctx.rng.fork('chrome/end');
      const legacy = endR.bool(0.5);
      const placement = ctx.finish ? null : legacy ? 'footer' : endR.pick(['toolbar', 'link', 'icon']);
      const label = legacy ? 'Submit' : endLabel(endR, ctx.content);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      const endLabels = ctx.content && ctx.content.END_LABELS;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = (
          Array.isArray(endLabels) && endLabels.length
            ? endLabels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓']
        ).map(labelOf);
        const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      document.body.className = 'ref mac';
      const mb = u.el('div', 'menubar', document.body);
      u.el('span', 'apple', mb).innerHTML =
        '<svg viewBox="0 0 30 34"><defs><linearGradient id="rainbow" x2="0" y2="1"><stop stop-color="#69af47"/><stop offset=".25" stop-color="#69af47"/><stop offset=".26" stop-color="#f5de45"/><stop offset=".43" stop-color="#f5de45"/><stop offset=".44" stop-color="#ed923b"/><stop offset=".58" stop-color="#ed923b"/><stop offset=".59" stop-color="#d84848"/><stop offset=".72" stop-color="#d84848"/><stop offset=".73" stop-color="#9b57ae"/><stop offset=".85" stop-color="#9b57ae"/><stop offset=".86" stop-color="#3b8bcb"/></linearGradient></defs><path d="M16 9c-3-3-7-2-10 0-6 5-3 15 1 20 3 4 5 2 8 1 4-1 5 4 9-1l4-7c-6-2-7-8-2-11-3-4-6-4-10-2Z" fill="url(#rainbow)" stroke="#222" stroke-width="1.6"/><path d="M16 7c-1-4 2-6 6-6 0 4-3 7-6 6Z" fill="#6ca447" stroke="#222" stroke-width="1.3"/></svg>';
      cfg.menus.forEach((m) => u.el('span', 'm', mb, m));
      u.el('span', 'sp', mb);
      u.el('span', 'volume', mb).innerHTML =
        '<svg viewBox="0 0 32 28"><path d="M2 10h6l8-6v20l-8-6H2Z" fill="#929ba5" stroke="#222" stroke-width="1.7"/><path d="M20 9q5 5 0 10m4-14q9 9 0 18m4-22q12 13 0 26" fill="none" stroke="#333" stroke-width="1.5"/></svg>';
      u.el('span', 'clock', mb, 'Mon 10:24 AM');
      u.el('span', 'ic', mb).innerHTML =
        '<svg viewBox="0 0 24 26"><path d="M3 5h18v18H3Z" fill="#e8e9fa" stroke="#535572"/><path d="m5 13 5-6 7 3-3 10-6-2Z" fill="#bab5dc" stroke="#626083"/><path d="m6 12 11 2M10 8l2 12m-8-3 15-5" stroke="#60519c"/><path d="m15 3 3 4 4-2" fill="none" stroke="#648b46"/></svg>';
      const icons = u.el('div', 'icons', document.body);
      [
        ['hd', 'Macintosh HD', 8],
        ['', 'Projects', 132],
        ['', 'Documents', 256],
        ['tr', 'Trash', 380],
      ].forEach((a) => {
        const d = u.el('div', 'dicon', icons);
        d.style.top = 'calc(' + a[2] + ' * var(--u))';
        const di = u.el('i', a[0], d);
        di.innerHTML =
          a[0] === 'hd'
            ? '<svg viewBox="0 0 60 60"><defs><linearGradient id="disk" x2=".7" y2="1"><stop stop-color="#f7f7f7"/><stop offset=".5" stop-color="#b8bdc5"/><stop offset="1" stop-color="#7d828c"/></linearGradient></defs><path d="M9 3h42l6 49-3 5H5l-2-5Z" fill="url(#disk)" stroke="#30343d" stroke-width="2"/><path d="M13 6h32v5H13Z" fill="#666d77" stroke="#eee"/><path d="M12 19h31l6 22-6 7H13l-5-5Z" fill="none" stroke="#9ca2ad"/><path d="m17 36 7 2 9-3" fill="none" stroke="#e9edf4"/><path d="m11 20-3 20 5 7h30l6-6-5-21" fill="none" stroke="#e3e6ec" opacity=".7"/><path d="M15 18h24" stroke="#a1a8b3"/><circle cx="11" cy="10" r="1" fill="#222"/><circle cx="48" cy="10" r="1" fill="#222"/><circle cx="9" cy="46" r="1" fill="#222"/><circle cx="49" cy="46" r="1" fill="#222"/><path d="M8 51h43" stroke="#454b55"/><rect x="12" y="53" width="8" height="2" fill="#eee"/></svg>'
            : a[0] === 'tr'
              ? '<svg viewBox="0 0 60 66"><defs><linearGradient id="can"><stop stop-color="#555d68"/><stop offset=".24" stop-color="#e4e8ee"/><stop offset=".5" stop-color="#89909a"/><stop offset=".75" stop-color="#e8ebf1"/><stop offset="1" stop-color="#454b53"/></linearGradient></defs><path d="m9 13 3 45q18 9 36 0l3-45Z" fill="url(#can)" stroke="#30333a" stroke-width="2"/><path d="M17 21v34m8-33v37m10-37v37m9-38v34" stroke="#50555e" stroke-width="2"/><path d="M19 22v34m8-33v35m10-35v35m9-36v32" stroke="#f1f3f7" stroke-width="1.5"/><path d="M12 57q18 7 36 0v3q-18 8-36 0Z" fill="#666e7a" stroke="#30333a"/><path d="M15 58q15 5 30 0" fill="none" stroke="#e1e4ea"/><ellipse cx="30" cy="13" rx="25" ry="7" fill="url(#can)" stroke="#242a30" stroke-width="2"/><ellipse cx="30" cy="11" rx="21" ry="5" fill="#bac0c7" stroke="#555"/><path d="M23 9V5q6-5 13 0v4" fill="#cdd2d8" stroke="#333" stroke-width="2"/></svg>'
              : '<svg viewBox="0 0 60 56"><defs><linearGradient id="folder" x2=".3" y2="1"><stop stop-color="#e4eeff"/><stop offset="1" stop-color="#9ebbea"/></linearGradient></defs><path d="M3 7q0-3 4-3h17l6 7h23v39H3Z" fill="#9bb6ee" stroke="#344b7b" stroke-width="2"/><path d="M5 16h52v36H5Z" fill="url(#folder)" stroke="#344b7b" stroke-width="2"/><path d="M7 18h47M7 20v28" fill="none" stroke="#f3f7ff" stroke-width="2"/></svg>';
        u.el('b', '', d, a[1]);
      });
      const win = u.el('main', 'win main', document.body);
      const tb = u.el('div', 'tbar', win);
      u.el('span', 'cb', tb);
      u.el('span', 'cb', tb);
      u.el('span', 'rid', tb);
      u.el('b', '', tb, cfg.title);
      u.el('span', 'rid', tb);
      u.el('span', 'cb', tb);
      u.el('span', 'cb', tb);
      const tool = u.el('div', 'tool', win);
      cfg.tools.forEach((t) => {
        if (t === '|') {
          u.el('span', 'gap', tool);
          return;
        }
        const d = u.el('div', '', tool);
        const ic = u.el('i', '', d);
        ic.innerHTML = ICO[t] || '';
        u.el('span', '', d, t);
      });
      const center = u.el('section', 'center', win);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      if (ctx.instruction.length > 85) note.classList.add('long-note');
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const lw = u.el('div', 'listwrap', win);
      const ch = u.el('div', 'colhead', lw);
      cfg.cols.forEach((c) => u.el('span', '', ch, c));
      const stage = u.el('div', 'stage', lw);
      u.el('span', 'sb up', lw, '▲');
      u.el('span', 'sb dn', lw, '▲');
      u.el('span', 'sb dn2', lw, '▼');
      const foot = u.el('footer', 'foot', win);
      u.el('span', 'ready', foot, '4 sections');
      u.el('button', 'btn', foot, 'Details...').type = 'button';
      u.el('button', 'btn', foot, 'Expand All').type = 'button';
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) decoyBtn(tool, collide, true);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'submit', label);
        if (placement === 'link') submit = endBtn(foot, 'endlink', label + ' ›');
        if (placement === 'toolbar') submit = endBtn(tool, 'submit toolbar-submit', label);
        if (placement === 'icon') submit = endBtn(tool, 'submit icon-submit', '✓');
      }
      const pv = u.el('aside', 'win prev', document.body);
      const pt = u.el('div', 'tbar', pv);
      u.el('span', 'cb', pt);
      u.el('b', '', pt, 'Preview');
      u.el('span', 'rid', pt);
      u.el('span', 'cb', pt);
      u.el('span', 'cb', pt);
      const pb = u.el('div', 'body', pv);
      if (ctx.display === 'panel') {
        note.hidden = false;
        note.classList.remove('instruction-toast');
        note.classList.add('instruction-panel');
        u.el('strong', 'panel-title', pb, 'Task');
        pb.appendChild(note);
      } else {
        u.el('div', 'doc', pb).innerHTML =
          '<svg viewBox="0 0 90 104"><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e4e5e8"/></linearGradient></defs><path d="M4 3h65l18 18v78H4Z" fill="#888" opacity=".35" transform="translate(2 2)"/><path d="M3 2h65l18 18v78H3Z" fill="url(#paper)" stroke="#353742" stroke-width="2"/><path d="M68 2v18h18" fill="#dddfe4" stroke="#353742" stroke-width="2"/><path d="M13 18h47M13 27h62M13 37h62M13 47h62M13 57h62M13 67h62M13 77h62M13 87h32" stroke="#a1a5ae" stroke-width="3"/></svg>';
        u.el('span', '', pb, 'No section selected');
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
