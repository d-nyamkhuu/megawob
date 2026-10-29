(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-03',
    'app': 'Personal Organizer',
    'menus': ['File', 'Edit', 'View', 'Window', 'Help'],
    'instruction': 'top',
    'heading': 'Add a New Task',
    'rail': ['Tasks', 'Calendar', 'Contacts', 'Notes', 'Preferences'],
    'tools': ['New Task', 'New Event', 'New Note', 'Search'],
  };
  const NS = 'http://www.w3.org/2000/svg';
  const END_FALLBACK = [
    'Submit',
    'Done',
    'Finish',
    'Continue',
    'Save',
    'OK',
    'Confirm',
    'Apply',
    'Complete',
    "I'm done",
  ];
  const ICONS = {
    Tasks:
      '<rect x="3" y="1" width="25" height="30" rx="2" fill="url(#paper)" stroke="#6b83a3"/><rect x="3" y="1" width="25" height="5" rx="1" fill="url(#blue)" stroke="#5275aa"/><path d="M5 3h21" stroke="#c6e0ff"/><path d="M7 1v4M23 1v4" stroke="#fff"/><path d="M12 10h12M12 15h12M12 20h12M12 25h10" stroke="#7b8797"/><g fill="#63a1e3" stroke="#476797" stroke-width=".5"><rect x="6" y="8" width="3" height="3" rx=".5"/><rect x="6" y="13" width="3" height="3" rx=".5"/><rect x="6" y="18" width="3" height="3" rx=".5"/><rect x="6" y="23" width="3" height="3" rx=".5"/></g>',
    Calendar:
      '<rect x="3" y="5" width="26" height="25" rx="1" fill="url(#paper)" stroke="#526782"/><rect x="3" y="5" width="26" height="7" fill="url(#blue)" stroke="#5275aa"/><path d="M5 28h22" stroke="#b5bdc6"/><rect x="8" y="1" width="2.5" height="8" rx="1" fill="url(#metal)" stroke="#536985" stroke-width=".7"/><rect x="22" y="1" width="2.5" height="8" rx="1" fill="url(#metal)" stroke="#536985" stroke-width=".7"/><text x="16" y="26" font-size="17" text-anchor="middle" font-family="Arial" fill="#141a27">17</text>',
    Contacts:
      '<path d="M4 29v-4c0-3 5-5 9-7v-3c-3-2-4-5-3-8 1-5 10-6 12-1 1 4 0 7-3 9v3c4 2 9 4 9 7v4z" fill="url(#blue)" stroke="#4b78b5"/><path d="M6 26c0-3 4-4 8-6M12 8c0-3 5-4 7-2" fill="none" stroke="#bad9ff" stroke-width="1.5"/>',
    Notes:
      '<rect x="3" y="3" width="26" height="27" rx="1" fill="url(#yellow)" stroke="#a38948"/><rect x="3" y="3" width="26" height="5" fill="url(#gold)" stroke="#8d7543"/><path d="M7 2v6M25 2v6" stroke="#d0d1af" stroke-width="2"/><path d="M6 11h20M6 14h20M6 17h20M6 20h20M6 23h20M6 26h17" stroke="#d2bd6b" stroke-width=".7"/><path d="M5 9v18" stroke="#fff4c6"/>',
    Preferences:
      '<path d="M13 1h6l1 4 3 1 3-2 4 4-2 3 1 3 4 1v5l-4 1-1 3 2 3-4 4-3-2-3 1-1 4h-6l-1-4-3-1-3 2-4-4 2-3-1-3-4-1v-5l4-1 1-3-2-3 4-4 3 2 3-1z" transform="translate(1 0) scale(.9)" fill="url(#metal)" stroke="#62738a" stroke-width="1.5"/><circle cx="16" cy="16" r="8" fill="url(#metal)" stroke="#62738a"/><circle cx="16" cy="16" r="4.5" fill="#e4effa" stroke="#596f8c"/><path d="M11 14a6 6 0 0 1 8-3" fill="none" stroke="#fff"/>',
    'New Task':
      '<path d="M4 29l3-8L23 3l6 6-17 17z" fill="url(#gold)" stroke="#8f6c31"/><path d="M7 21l5 5-8 3z" fill="#efdbaf" stroke="#8c7762"/><path d="M4 29l1-4 3 3z" fill="#344350"/><path d="M23 3l3-2 5 5-2 3z" fill="#ce808b" stroke="#75586a"/><path d="M21 5l6 6" stroke="#b5ccde" stroke-width="3"/><path d="M9 21L22 7" stroke="#fff0a0" stroke-width="2"/>',
    'New Note':
      '<path d="M3 4h25v22l-6 4H3z" fill="url(#yellow)" stroke="#bbaa5b"/><path d="M22 30v-6h6z" fill="#fff3bb" stroke="#cfb75b"/><text x="5" y="10" font-size="3.3" fill="#a18c43" font-family="Arial">MEMO NOTE</text><path d="M6 14h18M6 17h18M6 20h14" stroke="#ddc66d" stroke-width=".6"/>',
    Search:
      '<path d="M20 20l9 9" stroke="#354c68" stroke-width="5" stroke-linecap="round"/><path d="M21 21l7 7" stroke="#87a1bb" stroke-width="2" stroke-linecap="round"/><circle cx="13" cy="13" r="10" fill="url(#blue)" stroke="#5576a0"/><circle cx="13" cy="13" r="7.5" fill="url(#glass)" stroke="#d3e9fc"/><path d="M7 12a6 6 0 0 1 9-5" fill="none" stroke="#fff" stroke-width="1.2"/>',
  };
  ICONS['New Event'] = ICONS.Calendar;
  function icon(parent, name, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 32 32');
    s.setAttribute('class', cls || 'ds-ico');
    const key = 'aqua-' + name.replace(/ /g, '-');
    const defs =
      '<defs><linearGradient id="paper" x2=".3" y2="1"><stop stop-color="#fff"/><stop offset=".8" stop-color="#f5f6f8"/><stop offset="1" stop-color="#b3becc"/></linearGradient><linearGradient id="blue" x2=".3" y2="1"><stop stop-color="#dceeff"/><stop offset=".28" stop-color="#93c4ff"/><stop offset=".58" stop-color="#548de1"/><stop offset="1" stop-color="#79aaf5"/></linearGradient><linearGradient id="yellow" x2=".2" y2="1"><stop stop-color="#fff6ba"/><stop offset="1" stop-color="#eed473"/></linearGradient><linearGradient id="gold" x2=".5" y2="1"><stop stop-color="#ffe998"/><stop offset=".5" stop-color="#d4a640"/><stop offset="1" stop-color="#b88c34"/></linearGradient><linearGradient id="metal" x2=".6" y2="1"><stop stop-color="#f0f6fc"/><stop offset=".5" stop-color="#a2b4cc"/><stop offset="1" stop-color="#7391b5"/></linearGradient><linearGradient id="glass" x2=".2" y2="1"><stop stop-color="#f2fbff"/><stop offset=".5" stop-color="#b6dbff"/><stop offset="1" stop-color="#67b3f0"/></linearGradient></defs>';
    s.innerHTML = (defs + (ICONS[name] || ''))
      .replace(/id="(paper|blue|yellow|gold|metal|glass)"/g, 'id="' + key + '-$1"')
      .replace(/url\(#(paper|blue|yellow|gold|metal|glass)\)/g, 'url(#' + key + '-$1)');
    parent.appendChild(s);
    return s;
  }
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
      const wallpaper = document.createElementNS(NS, 'svg');
      wallpaper.setAttribute('viewBox', '0 0 1672 910');
      wallpaper.setAttribute('preserveAspectRatio', 'none');
      wallpaper.setAttribute('class', 'ds-wallpaper');
      wallpaper.innerHTML =
        '<defs><linearGradient id="wave" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#2867b5" stop-opacity=".05"/><stop offset=".7" stop-color="#80bdf5" stop-opacity=".22"/><stop offset="1" stop-color="#86c2fb" stop-opacity=".12"/></linearGradient><linearGradient id="deep" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#234e98"/><stop offset="1" stop-color="#337bc9"/></linearGradient></defs><path d="M0 305C190 192 412 71 632 0H1306C956 283 526 446 0 507Z" fill="url(#wave)"/><path d="M0 707C481 674 1116 598 1672 224V470C1244 666 722 731 218 910H0Z" fill="url(#wave)"/><path d="M213 910C718 604 1232 434 1672 271V470C1197 734 758 742 304 910Z" fill="url(#wave)"/><path d="M653 910C993 830 1322 885 1672 717V910Z" fill="url(#deep)"/><path d="M0 507C430 415 750 352 1027 231" fill="none" stroke="#86b9e9" stroke-opacity=".13"/>';
      document.body.insertBefore(wallpaper, top);
      const ap = u.el('span', 'ds-apple', top, '');
      ap.innerHTML =
        '<svg viewBox="0 0 24 28"><path d="M17 1c0 3-2 5-5 5 0-3 2-5 5-5zM12 8c-2 0-3-1-5-1-4 0-6 4-6 8 0 6 4 12 7 12 2 0 2-1 4-1s2 1 4 1c3 0 6-5 6-8-4-1-5-7 0-9-2-3-6-3-8-2-1 0-1 0-2 0z" fill="#222"/></svg>';
      u.el('span', 'ds-brand', top, C.app);
      C.menus.forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-sp', top, '');
      const wf = u.el('span', 'ds-stat', top, '');
      wf.innerHTML =
        '<svg viewBox="0 0 32 24"><path d="M2 9c8-8 20-8 28 0M7 14c5-5 13-5 18 0M12 19c2.5-2.500 5.500-2.500 8 0" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="21" r="2" fill="#222"/></svg>';
      const vo = u.el('span', 'ds-stat', top, '');
      vo.innerHTML =
        '<svg viewBox="0 0 32 24"><path d="M2 8h6l7-6v20l-7-6H2z" fill="#222"/><path d="M19 7c3 3 3 7 0 10M23 4c5 5 5 11 0 16M27 1c7 7 7 15 0 22" fill="none" stroke="#222" stroke-width="2.200" stroke-linecap="round"/></svg>';
      u.el('span', 'ds-sys', top, 'Mon 10:24 AM');
      const win = u.el('div', 'ds-body', document.body);
      const bar = u.el('div', 'ds-title', win);
      const lights = u.el('span', 'ds-lights', bar);
      ['r', 'y', 'g'].forEach((c) => u.el('i', 'ds-l ds-l-' + c, lights));
      u.el('span', 'ds-ttext', bar, C.app);
      const row = u.el('div', 'ds-row', win);
      const rail = u.el('aside', 'ds-rail', row);
      C.rail.forEach((t, i) => {
        const it = u.el('div', 'ds-ri' + (i === 0 ? ' on' : ''), rail);
        icon(it, t);
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', row);
      u.el('h1', 'ds-h1', content, C.heading);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction' + (ctx.instruction.length > 50 ? ' ds-instruction-long' : ''), b, ctx.instruction);
        return b;
      }
      const panel = u.el('div', 'ds-panel', content);
      if (mode === 'top') briefing(panel, 'ds-header-note');
      const main = u.el('div', 'ds-main', panel);
      if (mode === 'left' || mode === 'right') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, panel);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const pal = u.el('div', 'ds-pal', document.body);
      const pt = u.el('div', 'ds-ptitle', pal);
      const pl = u.el('span', 'ds-lights', pt);
      ['r', 'y'].forEach((c) => u.el('i', 'ds-l ds-l-' + c, pl));
      u.el('span', 'ds-ttext', pt, 'Quick Tools');
      C.tools.forEach((t) => {
        const it = u.el('div', 'ds-pi', pal);
        icon(it, t);
        u.el('span', '', it, t);
      });
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const baseLabel = endPool.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit';
      const alternateLabels = [...new Set(endPool)]
        .filter((x) => String(x).trim().toLowerCase() !== String(baseLabel).trim().toLowerCase())
        .slice(0, 4);
      const placementPick = endRng.pick(['footer', 'footer', 'titlebar', 'palette']);
      const label = endRng.pick([baseLabel, baseLabel, baseLabel, baseLabel, ...alternateLabels]);
      const isBase = String(label).trim().toLowerCase() === String(baseLabel).trim().toLowerCase();
      const placement = isBase
        ? 'footer'
        : placementPick === 'footer'
          ? endRng.pick(['titlebar', 'palette'])
          : placementPick;
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endPool)].filter(
          (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
        );
        if (options.length)
          collision = { label: collideRng.pick(options), where: collideRng.pick(['titlebar', 'palette']) };
      }
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
        else if (placement === 'titlebar') submit = endBtn(bar, 'ds-alt-end', label);
        else submit = endBtn(pal, 'ds-alt-end ds-palette-end', label);
      }
      if (collision) {
        const host = collision.where === 'titlebar' ? bar : pal;
        decoyBtn(host, collision.label, true);
      }
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
