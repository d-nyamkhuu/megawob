(function () {
  'use strict';
  const C = { 'site': 'design-fill-form-invoice-08', 'brand': 'Invoice Entry', 'menu': 'File|Edit|View|Window|Help' };
  const DOCK = [
    ['New', 'M8 2h18l10 10v26H8z'],
    ['Open', 'M3 10h12l3 4h19v20H3z'],
    ['Save', 'M5 4h28l4 4v28H5zM11 4v12h18V4M11 36V24h20v12'],
    ['Print', 'M10 4h20v10H10zM4 14h32v14H4zM10 24h20v12H10z'],
    ['Find', 'M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24M25 25l12 12'],
    ['Help', 'M20 3a17 17 0 1 0 0 34 17 17 0 0 0 0-34'],
  ];
  const COL = { New: '#fafafa', Open: '#6fb0ea', Save: '#2f6fd0', Print: '#c8ccd2', Find: '#cfe6fa', Help: '#2f6fd0' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-apple', top);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28"><path d="M16 5c2-1 3-3 3-5-3 0-5 2-5 5M20 8c-4-3-6 0-8 0-2 0-4-3-7 0-6 5-1 17 3 18 2 1 3-1 5-1s3 2 5 1c2-1 4-4 5-7-6-2-6-8-3-11" fill="#17263e"/></svg>';
      u.el('b', '', top, C.brand);
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      const status = u.el('span', 'ds-system', top);
      status.innerHTML =
        '<svg viewBox="0 0 60 24"><path d="M2 7q12-12 24 0M6 11q8-8 16 0M10 15q4-4 8 0" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="19" r="2"/><path d="M37 9h5l6-5v17l-6-5h-5zM51 8q6 5 0 10M55 4q10 9 0 18" fill="currentColor"/></svg>';
      u.el('span', 'ds-clock', top, 'Fri Sep 12  10:24 AM');
      const search = u.el('span', 'ds-search', top);
      search.innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14 14l7 7" stroke="currentColor" stroke-width="3"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-title', win);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => {
        const d = u.el('i', 'ds-light', tb);
        d.style.background = c;
      });
      u.el('span', 'ds-ttext', tb, C.brand);
      const content = u.el('div', 'ds-content', win);
      const mode = ctx.display || 'header';
      const main = u.el('div', 'ds-main', content);
      main.dataset.display = mode;
      if (mode !== 'hidden') {
        const b = u.el('aside', 'ds-note ds-note-' + mode, main);
        b.setAttribute('aria-label', 'Invoice instructions');
        u.el('div', 'ds-notehead', b, mode === 'panel' ? 'Invoice Assistant' : 'Enter Invoice Information');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      const er = ctx.rng.fork('chrome/end');
      const lr = er.fork('label');
      const pr = er.fork('placement');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      // Preserve the existing streams; a separate stream chooses the reference treatment as a pair.
      const sampledLabel = lr.bool(0.5) ? 'Submit' : labelOf(lr.pick(labels));
      const sampledPlacement = ctx.finish ? 'none' : sampledLabel === 'Submit' ? 'footer' : pr.pick(['title', 'dock']);
      const vr = er.fork('variation');
      const reference = vr.bool(0.5);
      const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = reference ? 'Submit' : sampledLabel === 'Submit' ? vr.pick(alternatives) : sampledLabel;
      const placement = ctx.finish
        ? 'none'
        : reference
          ? 'footer'
          : sampledPlacement === 'footer'
            ? vr.pick(['title', 'dock'])
            : sampledPlacement;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
      const dock = u.el('div', 'ds-dock', document.body);
      const tray = u.el('div', 'ds-tray', dock);
      DOCK.forEach(([l, p], i) => {
        if (i === 3 || i === 5) u.el('span', 'ds-sep', tray);
        const b = u.el('button', 'ds-tool ds-tool-' + l.toLowerCase(), tray);
        b.type = 'button';
        const silver = l === 'New' || l === 'Print';
        const detail = {
          New: '<path d="M26 2v10h10" fill="#eef3f9" stroke="#7b8694"/>',
          Open: '<path d="M4 14h33l-3 22H1z" fill="url(#dock-1)" stroke="#3068ad"/><path d="M5 17h30" stroke="#d2eaff"/>',
          Save: '<path d="M12 5h16v10H12zM12 25h18v10H12z" fill="#f1f5f9"/><path d="M14 28h14M14 31h14" stroke="#9aa9c1"/>',
          Print:
            '<rect x="10" y="2" width="21" height="14" rx="2" fill="#fff" stroke="#7b8ba5"/><rect x="2" y="15" width="36" height="17" rx="4" fill="url(#dock-3)" stroke="#6b7584"/><path d="M7 23h26v7H7z" fill="#5a616b"/><path d="M10 25h21v14H10z" fill="#fff" stroke="#8494a9"/><path d="M13 29h15M13 32h15M13 35h15" stroke="#a4b1c4"/><circle cx="33" cy="19" r="1" fill="#60a8ff"/>',
          Find: '<circle cx="16" cy="16" r="11" fill="#9ddcff" stroke="#3075bb" stroke-width="2"/><path d="M26 27l12 12" stroke="#536171" stroke-width="5"/><path d="M9 10q7-7 14-1" fill="none" stroke="#fff" stroke-width="2"/>',
          Help: '<circle cx="20" cy="20" r="16" fill="none" stroke="#f4fbff" stroke-width="1"/><path d="M14 15c1-8 14-7 11 1l-5 4v4M20 30v2" fill="none" stroke="white" stroke-width="2.8"/>',
        };
        b.innerHTML =
          '<svg viewBox="0 0 44 44"><defs><linearGradient id="dock-' +
          i +
          '" x2="0" y2="1"><stop stop-color="' +
          (silver ? '#fff' : '#d2ecff') +
          '"/><stop offset=".45" stop-color="' +
          COL[l] +
          '"/><stop offset="1" stop-color="' +
          (silver ? '#9da6b3' : '#1452bc') +
          '"/></linearGradient></defs><path d="' +
          p +
          '" fill="url(#dock-' +
          i +
          ')" stroke="' +
          (silver ? '#667181' : '#26568d') +
          '" stroke-width="1.2" stroke-linejoin="round"/>' +
          detail[l] +
          '</svg>';
        u.el('span', '', b, l);
      });
      for (const tool of tray.querySelectorAll('.ds-tool')) {
        const svg = tool.querySelector('svg');
        if (tool.classList.contains('ds-tool-new'))
          svg.querySelector('stop:last-child').setAttribute('stop-color', '#e2e5ea');
        if (tool.classList.contains('ds-tool-save'))
          svg.innerHTML +=
            '<path d="M23 5h5v10h-5z" fill="#bac8d9"/><path d="M7 5v29" stroke="#b6d8ff" stroke-width="1.5"/>';
        if (tool.classList.contains('ds-tool-help'))
          svg.innerHTML += '<path d="M9 10q12-10 23 4" fill="none" stroke="#b5d4ff" stroke-width="1.5" opacity=".8"/>';
        if (tool.classList.contains('ds-tool-find'))
          svg.querySelector('path[stroke-width="5"]').setAttribute('stroke-width', '3.5');
        tool.addEventListener('click', () => env.log('decoy', { label: tool.querySelector('span').textContent }));
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
        const choices = [
          ...new Set(
            labels.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
          ),
        ].filter((x) => !same(x));
        if (choices.length) {
          const text = String(cr.pick(choices));
          const b = u.el('button', 'ds-xtra-pq', foot, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (!ctx.finish && placement === 'title') submit = makeEnd(tb, 'ds-submit ds-end-title', label);
      if (!ctx.finish && placement === 'dock') submit = makeEnd(dock, 'ds-submit ds-end-dock', label);
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
