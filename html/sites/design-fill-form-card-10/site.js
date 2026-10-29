(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-10',
    'title': 'Contact Entry',
    'instruction': 'top',
    'menu': 'File|Edit|View|Tools|Window|Help',
  };
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
      top.innerHTML =
        '<svg class="ds-apple" viewBox="0 0 24 26" width="30" height="34"><defs><linearGradient id="apple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54bb3f"/><stop offset=".23" stop-color="#54bb3f"/><stop offset=".24" stop-color="#ffe339"/><stop offset=".43" stop-color="#ffe339"/><stop offset=".44" stop-color="#f69125"/><stop offset=".59" stop-color="#f69125"/><stop offset=".60" stop-color="#ed393b"/><stop offset=".75" stop-color="#ed393b"/><stop offset=".76" stop-color="#a747a1"/><stop offset=".87" stop-color="#a747a1"/><stop offset=".88" stop-color="#4293de"/></linearGradient></defs><path d="M12 8c-3-3-9-1-9 5 0 5 3 10 6 10 1 0 2-1 3-1s2 1 3 1c3 0 5-4 6-7-4-1-5-5-1-7-3-3-6-2-8-1z" fill="url(#apple)" stroke="#202431" stroke-width="1.4"/><path d="M12 7c0-4 3-5 5-5-1 3-2 5-5 5z" fill="#50b544" stroke="#202431"/></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, '10:24 AM');
      u.el('span', 'ds-mon', top, '▰');
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-title', win);
      const lights = u.el('span', 'ds-lights', tb);
      for (let i = 0; i < 3; i++) u.el('i', '', lights);
      u.el('span', 'ds-stripes', tb);
      u.el('span', 'ds-tname', tb, C.title);
      u.el('span', 'ds-stripes', tb);
      u.el('span', 'ds-zoom', tb, '×');
      const ribbon = u.el('div', 'ds-ribbon', win);
      const ic = {
        New: '<path d="M5 2h17l7 7v22H5z" fill="#f8faff" stroke="#202336" stroke-width="1.4"/><path d="M22 2v7h7" fill="#d8dbea" stroke="#202336"/><path d="M7 4v25" stroke="white" stroke-width="2"/>',
        Open: '<path d="M9 9l3-4h10l-2 5 5-2 3 9H6z" fill="#f7f8ff" stroke="#252835"/><path d="M2 10h9l3 3h14v15H2z" fill="#e8c451" stroke="#292730" stroke-width="1.3"/><path d="M7 16h24l-6 13H2z" fill="#f8e47e" stroke="#292730" stroke-width="1.3"/><path d="M8 17h21" stroke="#ffffd7" stroke-width="1.5"/>',
        Save: '<rect x="3" y="3" width="27" height="27" rx="1" fill="#6578dc" stroke="#202336" stroke-width="1.5"/><path d="M5 4v25M28 4v25" stroke="#b3c4ff" stroke-width="2"/><rect x="9" y="3" width="15" height="12" fill="#f1f5ff" stroke="#202336"/><rect x="12" y="5" width="9" height="7" fill="#bdcef4"/><path d="M13 7h7M13 9h7" stroke="white"/><rect x="8" y="20" width="17" height="10" fill="#f4f6ff" stroke="#202336"/><path d="M12 23h9M12 26h9" stroke="#697087"/>',
        Print:
          '<path d="M9 2h18l-3 12H6z" fill="#fbfbff" stroke="#26293b" stroke-width="1.3"/><path d="M12 5h11M11 8h11M10 11h11" stroke="#687fc6"/><path d="M4 14h23l4 5v11H2V19z" fill="#c2c6da" stroke="#202336" stroke-width="1.3"/><path d="M4 16h22l3 3H3z" fill="#eff1f9"/><rect x="6" y="19" width="20" height="5" fill="#424861"/><path d="M9 22h15v7H7z" fill="#f4f5fa" stroke="#32384e"/><path d="M10 25h11" stroke="#8e98b5"/><rect x="26" y="25" width="2" height="2" fill="#5682bb"/>',
        Cut: '<path d="M10 3c-2 5 2 10 6 16L22 3c1 7-3 13-8 19L9 4z" fill="#dce1ee" stroke="#242635" stroke-width="1.2"/><path d="M12 21l-1 3M18 21l2 3" stroke="#343c63" stroke-width="2"/><ellipse cx="10" cy="27" rx="3.3" ry="4" fill="#6789f6" stroke="#22294d" stroke-width="1.5"/><ellipse cx="21" cy="27" rx="3.3" ry="4" fill="#6789f6" stroke="#22294d" stroke-width="1.5"/><ellipse cx="10" cy="27" rx="1.4" ry="2" fill="#e7eaff"/><ellipse cx="21" cy="27" rx="1.4" ry="2" fill="#e7eaff"/><circle cx="15" cy="19" r="1" fill="#343b55"/>',
        Copy: '<path d="M3 2h14l5 5v18H3z" fill="#fff" stroke="#242738" stroke-width="1.2"/><path d="M6 6h9M6 9h12M6 12h12M6 15h8M6 18h8M6 21h8" stroke="#6d7bb7"/><path d="M13 9h12l6 6v17H13z" fill="#fff" stroke="#242738" stroke-width="1.2"/><path d="M25 9v6h6" fill="#c8ccde" stroke="#242738"/>',
        Paste:
          '<rect x="3" y="4" width="22" height="25" rx="1" fill="#edbd4f" stroke="#292734" stroke-width="1.3"/><path d="M5 6v21" stroke="#fff2a4" stroke-width="2"/><path d="M10 4V2h4V1h4v1h4v5H10z" fill="#c6b782" stroke="#292734"/><path d="M13 11h13l5 5v16H13z" fill="#fff" stroke="#292734"/><path d="M26 11v5h5" fill="#c8ccdf" stroke="#292734"/>',
        Larger:
          '<path d="M19 19l10 10" stroke="#252735" stroke-width="5"/><path d="M20 20l9 9" stroke="#d9b750" stroke-width="2.5"/><circle cx="12" cy="12" r="9" fill="#b1c8ee" stroke="#242738" stroke-width="1.5"/><path d="M6 9c2-5 9-6 13 0" fill="none" stroke="#f7faff" stroke-width="2"/><path d="M6 12h12M12 6v12" stroke="#233d83" stroke-width="1.5"/>',
        Smaller:
          '<path d="M19 19l10 10" stroke="#252735" stroke-width="5"/><path d="M20 20l9 9" stroke="#8c92a7" stroke-width="2.5"/><circle cx="12" cy="12" r="9" fill="#b1c8ee" stroke="#242738" stroke-width="1.5"/><path d="M6 9c2-5 9-6 13 0" fill="none" stroke="#f7faff" stroke-width="2"/><path d="M6 12h12" stroke="#233d83" stroke-width="1.5"/>',
        Actual:
          '<path d="M5 2h17l6 6v22H5z" fill="#f8faff" stroke="#252839" stroke-width="1.3"/><path d="M22 2v6h6" fill="#cdd1e2" stroke="#252839"/><text x="16" y="21" font-size="12" text-anchor="middle" fill="#172344" font-family="Arial">1:1</text>',
        Spelling:
          '<text x="1" y="26" font-size="26" font-style="italic" font-weight="bold" fill="#223" font-family="Georgia,serif">A</text><path d="M14 18l5 8L30 3" stroke="#223" stroke-width="2.5" fill="none"/>',
        Find: '<path d="M7 4h5v7h-7zM21 4h5v7h-7z" fill="#797f94" stroke="#141726"/><path d="M4 11l8-1 3 10v9H2v-9zM20 10l8 1 2 9v9H17v-9z" fill="#3c4359" stroke="#141726" stroke-width="1.5"/><path d="M5 12h3v8H4M22 12h3v8h-4" fill="#8992ad"/><rect x="13" y="14" width="6" height="4" fill="#626b80" stroke="#141726"/>',
        Preferences:
          '<rect x="2" y="3" width="28" height="25" fill="#eceeff" stroke="#252839" stroke-width="1.3"/><path d="M4 5h24" stroke="#fff"/><rect x="6" y="8" width="4" height="4" rx="1" fill="#b7c3ee" stroke="#536cae"/><rect x="6" y="16" width="4" height="8" fill="#ebe2a7" stroke="#6d7398"/><path d="M6 20h4M15 9h11M15 12h11M15 17h11M15 20h11M15 24h11" stroke="#6c75bf" stroke-width="1.3"/>',
      };
      [
        ['File', ['New', 'Open', 'Save', 'Print']],
        ['Edit', ['Cut', 'Copy', 'Paste']],
        ['View', ['Larger', 'Smaller', 'Actual']],
        ['Tools', ['Spelling', 'Find', 'Preferences']],
      ].forEach(([cap, list]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        u.el('span', 'ds-ribbon-caption', g, cap);
        list.forEach((l) => {
          const b = u.el('button', 'ds-ribbon-item', g);
          b.type = 'button';
          let detail = '';
          if (['Copy', 'Paste', 'Print', 'Save'].includes(l))
            detail = '<path d="M15 15h10M15 18h10M15 21h10M15 24h10" stroke="#6478c4" stroke-width=".8"/>';
          if (l === 'Find')
            detail =
              '<rect x="5" y="21" width="6" height="4" fill="#a1bdea" stroke="#131722"/><rect x="21" y="21" width="6" height="4" fill="#a1bdea" stroke="#131722"/><path d="M4 11h7M20 11h7" stroke="#b8bdc8"/>';
          b.innerHTML = '<svg viewBox="0 0 32 32" width="48" height="48">' + ic[l] + detail + '</svg>';
          u.el('span', '', b, l);
        });
      });
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && window.innerHeight < 700) display = 'header';
      const mode =
        display === 'hidden' ? 'hidden' : display === 'toast' ? 'toast' : display === 'panel' ? 'panel' : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (display === 'panel') {
        const b = u.el('aside', 'ds-panel-note', content);
        u.el('strong', 'ds-panel-title', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        content.insertBefore(b, main);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (display === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', win);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'title', 'link']);
      const label = ctx.finish ? null : textOf(er.pick(ends));
      const endButton = (parent, cls, txt, tag = 'button') => {
        const b = u.el(tag, cls, parent, txt);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [...new Set(ends.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, txt) => {
        const b = u.el('button', 'ds-xtra', parent, txt);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: txt, collide: true }));
        return b;
      };
      if (placement === 'title') {
        const titleEnd = u.el('div', 'ds-title-action', tb);
        submit = endButton(titleEnd, 'ds-submit ds-title-submit', label);
      }
      if (collide) decoy(foot, collide);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label);
      if (placement === 'link') submit = endButton(foot, 'ds-endlink', label + ' ›', 'a');
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
