(function () {
  'use strict';
  const S = 'fill="none" stroke="#111" stroke-width="2"';
  const ICON = {
    New:
      '<svg viewBox="0 0 40 48"><path d="M7 3h19l8 8v34H7Z" fill="#fff" stroke="#111" stroke-width="2"/><path d="M26 3v8h8" ' +
      S +
      '/></svg>',
    Open: '<svg viewBox="0 0 48 48"><path d="M3 14h6V7h17v7h19v31H3Z" fill="#f0ed75" stroke="#111" stroke-width="2.5"/><path d="M6 17h36v25H6Z" fill="#ffffa8" opacity=".5"/></svg>',
    Save: '<svg viewBox="0 0 48 48"><path d="M4 4h36l4 4v36H4Z" fill="#1d3fa0" stroke="#111" stroke-width="2"/><rect x="12" y="4" width="22" height="14" fill="#fff"/><rect x="12" y="28" width="24" height="16" fill="#e6e6e6" stroke="#111" stroke-width="2"/><rect x="26" y="7" width="5" height="9" fill="#1d3fa0"/></svg>',
    Print:
      '<svg viewBox="0 0 48 48"><rect x="12" y="3" width="24" height="16" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M6 18h36v5h4v18H2V23h4Z" fill="#e7ebea" stroke="#111" stroke-width="2.5"/><path d="M7 26h34M9 33h30" stroke="#111" stroke-width="3"/><rect x="11" y="34" width="26" height="12" fill="#c6edfc" stroke="#111" stroke-width="2"/><path d="M15 39h18M15 43h18" stroke="#2389aa" stroke-width="2"/></svg>',
    Cut: '<svg viewBox="0 0 48 48"><path d="M11 2v10l20 21M36 2v10L16 33" fill="none" stroke="#111" stroke-width="3"/><path d="M8 32h8v12H8ZM30 32h8v12h-8Z" fill="#83c2f5" stroke="#124291" stroke-width="3"/><path d="M15 30l5-7M30 30l-5-7" stroke="#124291" stroke-width="3"/></svg>',
    Copy: '<svg viewBox="0 0 48 48"><path d="M4 3h23l7 7v28H4Z" fill="#f7fbff" stroke="#111" stroke-width="2.5"/><path d="M9 9h14M9 14h14M9 19h14M9 24h14M9 29h14" stroke="#8ec9eb" stroke-width="3"/><path d="M17 12h19l9 8v27H17Z" fill="#edf7ff" stroke="#111" stroke-width="2.5"/><path d="M36 12v8h9" fill="white" stroke="#111" stroke-width="2"/><path d="M21 23h19M21 28h19M21 33h19M21 38h19M21 43h19" stroke="#8ec9eb" stroke-width="3"/></svg>',
    Paste:
      '<svg viewBox="0 0 48 48"><rect x="7" y="7" width="34" height="39" fill="#c4a250" stroke="#111" stroke-width="2.5"/><rect x="12" y="11" width="24" height="31" fill="#fff" stroke="#111"/><path d="M17 8V3h4V1h6v2h4v8H17Z" fill="#ebd568" stroke="#111" stroke-width="2"/><path d="M16 17h17M16 21h17M16 25h17M16 29h17M16 33h17M16 37h17" stroke="#83adb0" stroke-width="2"/></svg>',
    Spell:
      '<svg viewBox="0 0 64 54"><text x="32" y="24" text-anchor="middle" font-family="monospace" font-weight="700" font-size="30" fill="#073574">ABC</text><path d="M20 41l8 8 18-20" fill="none" stroke="#073574" stroke-width="4"/></svg>',
    Insert:
      '<svg viewBox="0 0 64 48"><rect x="3" y="3" width="58" height="44" fill="#fff" stroke="#111" stroke-width="2.5"/><rect x="7" y="7" width="50" height="35" fill="#6eb0ed"/><path d="M7 42l15-23 13 17 9-12 13 18Z" fill="#1aa728" stroke="#133a16" stroke-width="1.5"/><path d="m17 26 5-7 5 7-5-2ZM39 31l5-7 6 8-6-3Z" fill="white"/><path d="M13 11h4v-3h5v3h4v6h-4v3h-5v-3h-4ZM41 12h8v5h-8Z" fill="#fff"/></svg>',
    Format:
      '<svg viewBox="0 0 48 48"><rect x="6" y="3" width="36" height="44" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M12 11h24M12 18h24M12 25h24M12 32h24M12 39h24" stroke="#283cde" stroke-width="2.5"/></svg>',
  };
  const GROUPS = [['New', 'Open', 'Save', 'Print'], ['Cut', 'Copy', 'Paste'], ['Spell'], ['Insert', 'Format']];
  env.site({
    name: 'design-click-control-menu-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'cookie' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref riscos';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      const badge = u.el('span', 'app-badge', title);
      badge.innerHTML =
        '<svg viewBox="0 0 38 38"><rect x="1" y="1" width="36" height="36" fill="#124567" stroke="#e9db8b" stroke-width="2"/><path d="M9 31 6 7l18-3 7 20-8 9-10-5 1-18 10-1 3 13-6 5-5-4 1-10 5 1 1 8-3 1M9 5l-5 24 7 5 6-6 7 7 8-7M27 5l6 6-5 6" fill="none" stroke="#fff2b7" stroke-width="1.5"/></svg>';
      u.el('span', 'title-text', title, 'Write – Document 1');
      const close = u.el('span', 'close-gadget', title, 'X');
      const tools = u.el('div', 'tools', head);
      GROUPS.forEach((g) => {
        const grp = u.el('div', 'tgroup', tools);
        g.forEach((n) => {
          const b = u.el('span', 'tool', grp);
          const ic = u.el('span', 'tool-icon', b);
          ic.innerHTML = ICON[n];
          u.el('span', 'tool-label', b, n);
        });
      });
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      center.dataset.display = ctx.display;
      const note = u.el('div', 'instruction', center);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const nic = u.el('span', 'info-icon', note, 'i');
      note.insertBefore(nic, null);
      const txt = u.el('span', 'note-text', note, ctx.instruction);
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const doc = u.el('div', 'doc-tab', center, 'Document 1');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const ready = u.el('span', 'ready', foot);
      ready.innerHTML =
        '<svg viewBox="0 0 36 44"><path d="M3 2h22l8 8v32H3Z" fill="#fff" stroke="#222" stroke-width="2"/><circle cx="18" cy="30" r="8" fill="#2fa84a"/><path d="M18 25v10M13 31l5 5 5-5" stroke="#fff" stroke-width="2.5" fill="none"/></svg>';
      u.el('span', 'ready-text', foot, 'Ready');
      u.el('span', 'pos', foot, 'Page 1 of 1');
      u.el('span', 'pos pos2', foot, 'Ln 1, Col 1');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.bool(0.5) ? 'footer' : er.pick(['title', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'title' ? title : foot,
          endLabel,
        );
        if (placement === 'link') {
          submit.href = '#';
          foot.insertBefore(submit, foot.querySelector('.pos'));
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endWords.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          foot.insertBefore(decoy, foot.querySelector('.pos'));
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      const bar = u.el('div', 'pt-bar', el);
      u.el(
        'span',
        '',
        bar,
        {
          cookie: 'Consent',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      const x = u.el('span', 'pt-x', bar, 'X');
      const body = u.el('div', 'pt-body', el);
      if (ctx.kind === 'cookie') {
        const g = u.el('span', 'pt-globe', body);
        g.innerHTML =
          '<svg viewBox="0 0 60 60" shape-rendering="crispEdges"><path d="M22 1h16v2h7v4h5v5h4v6h3v8h2v12h-3v8h-4v5h-6v5h-8v3H23v-2h-8v-4H9v-6H5v-8H2V23h3v-9h5V8h6V4h6Z" fill="#4999f9" stroke="#101010" stroke-width="1.5"/><path d="M34 3h7v3h6v5h5v8h3v12h-4V19h-5V12h-6V7h-6ZM6 27v13h4v8h7v5h8v4h12v-3H24v-5h-8v-7h-5V27Z" fill="#1b52c9"/><path d="M20 5h7v3h-3v3h-5v4h-5v4h-4v5h5v3h7v4h7v4h6v5h-4v5h-4v8h-4v-9h-3v-9h-5v-5H9V19h5v-5h4v-4h4V8h-3ZM31 2h5v8h-3v4h-4V9h2ZM44 9h5v6h-5v5h-5v8h7v5h7v-5h3v15h-5v-5h-5v-4h-9V23h3v-5h-5v-4h6v-4Z" fill="#13c32a" stroke="#0b2111" stroke-width="1.2"/><path d="M17 8h4v3h-4v4h-4v-3h4ZM24 6h3v3h-3M39 5v5h-3v4" fill="none" stroke="#052b17" stroke-width="1.2"/></svg>';
        const t = u.el('div', 'pt-text', body);
        u.el('p', '', t).innerHTML = "We'd like to use optional analytics<br>to help improve this application.";
        u.el('p', '', t).innerHTML = 'You can change this at any time<br>in Settings.';
      } else {
        const t = u.el('div', 'pt-text', body);
        u.el(
          'p',
          '',
          t,
          {
            toast: 'Your workspace is ready.',
            chat: 'How can we help?',
            promo: 'Explore the latest tools.',
            banner: 'A new update is available.',
          }[ctx.kind] || '',
        );
      }
      const btns = u.el('div', 'pt-btns', el);
      const dismiss = u.el('button', 'dismiss', btns, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      if (ctx.kind === 'cookie') {
        const a = u.el('button', 'accept', btns, 'Accept');
        a.type = 'button';
        a.addEventListener('click', ctx.dismiss);
      }
      x.setAttribute('role', 'button');
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
