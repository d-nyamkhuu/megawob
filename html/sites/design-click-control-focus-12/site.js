(function () {
  'use strict';
  const C = {
    menus: ['Workspace', 'Programs', 'Tools', 'Windows', 'Help'],
    clock: 'Mon Apr 21  10:14 AM',
    chest: [
      ['Toolchest', 'M12 3 3 8v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8'],
      ['Desktop', 'M3 6h7l2 2h9v11H3z'],
      ['System', 'M7 3h10v18H7z M7 9h10 M7 15h10'],
      ['Network', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c4 4 4 14 0 18'],
      ['Utilities', 'M3 4h18v12H3z M9 20h6 M12 16v4'],
      ['Help', 'M5 18 15 4l5 4-8 14z'],
    ],
    nav: ['Appearance', 'Fonts', 'Desktop', 'Window Behavior', 'Keyboard', 'Mouse', 'Network', 'Sessions'],
    checks: [
      ['Show tooltips', 1],
      ['Animate windows', 1],
      ['Show workspace names', 0],
      ['High contrast mode', 0],
    ],
  };
  // Sculpted workstation icons, drawn locally so the desktop needs no external assets.
  function sculpture(kind) {
    const defs =
      '<defs><linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#dedeea"/><stop offset=".45" stop-color="#a0a1ba"/><stop offset="1" stop-color="#646981"/></linearGradient><linearGradient id="lav" x2=".8" y2="1"><stop stop-color="#b8b3db"/><stop offset=".5" stop-color="#8f8bb8"/><stop offset="1" stop-color="#64638e"/></linearGradient><linearGradient id="dark" x2="1" y2=".7"><stop stop-color="#737398"/><stop offset="1" stop-color="#373c58"/></linearGradient><radialGradient id="globe" cx=".3" cy=".25" r=".8"><stop stop-color="#b2adcf"/><stop offset=".6" stop-color="#75739e"/><stop offset="1" stop-color="#393e5b"/></radialGradient><linearGradient id="screen" x2="1" y2="1"><stop stop-color="#5b5686"/><stop offset="1" stop-color="#252d4d"/></linearGradient></defs>';
    const cube = (x, y, s) =>
      '<g transform="translate(' +
      x +
      ' ' +
      y +
      ') scale(' +
      s +
      ')"><path d="M0 11 19 0 38 11 19 22Z" fill="url(#lav)" stroke="#d6d0ee"/><path d="M0 11 19 22v24L0 35Z" fill="url(#lav)" stroke="#aea8d0"/><path d="m19 22 19-11v24L19 46Z" fill="url(#dark)" stroke="#41435d"/><path d="M19 22 38 11" stroke="#cbc3e8"/></g>';
    let drawing = '';
    if (kind === 'Toolchest')
      drawing =
        '<ellipse cx="35" cy="64" rx="22" ry="4" fill="#41445c" opacity=".55"/>' +
        cube(12, 24, 0.68) +
        cube(35, 22, 0.68) +
        cube(24, 1, 0.68);
    if (kind === 'Desktop')
      drawing =
        '<path d="M7 16h19l6 6h29v41H7Z" fill="#3a3e57" transform="translate(1 2)"/><path d="M6 14h20l6 6h29v41H6Z" fill="url(#lav)" stroke="#c7c5de"/><path d="M8 24h51v35H8Z" fill="url(#lav)"/><path d="M8 22h52" stroke="#dbd5ef"/><path d="M60 22v39H8" fill="none" stroke="#42445f" stroke-width="2"/>';
    if (kind === 'System')
      drawing =
        '<path d="M17 10 22 4h32l5 6v57H17Z" fill="url(#metal)" stroke="#353a54"/><path d="M18 10h40M22 5h31" stroke="#eceaf4"/><path d="M20 13h35v23H20ZM20 39h35v23H20Z" fill="url(#metal)" stroke="#51566e"/><path d="M24 20h27l-3 6H27Z M24 46h27l-3 6H27Z" fill="#41445f"/><path d="M29 28h15M29 54h15M21 14h33M21 40h33" stroke="#d8d9e7"/><path d="M57 12v53H20" fill="none" stroke="#3b405a"/>';
    if (kind === 'Network')
      drawing =
        '<circle cx="35" cy="35" r="32" fill="url(#globe)" stroke="#c1bdd5"/><path d="m18 8 10 2-3 8-8 5 3 8-8 7 5 11 9 4-3 9-9-6-8-14 2-15 4-11Z M38 5l7 7-3 8 9 3 7 10-5 7-8-3-5 7 3 9-7 12-6-7 1-14-7-6 6-12 11-2-4-9Z M57 13l5 9-8-2Z" fill="#9d97bd" stroke="#68698f" stroke-width=".7"/><ellipse cx="35" cy="35" rx="17" ry="31" fill="none" stroke="#b7b1d0" opacity=".25"/><path d="M9 18q23-12 49 4M5 39q27 12 60-2" fill="none" stroke="#c6c0db" opacity=".2"/><path d="M57 13q20 34-10 51" fill="none" stroke="#323a55" stroke-width="2"/>';
    if (kind === 'Utilities')
      drawing =
        '<path d="M8 5h54v49H8Z" fill="url(#metal)" stroke="#2e344f"/><path d="M11 8h48v42H11Z" fill="#d1d1df"/><path d="M14 11h42v35H14Z" fill="url(#screen)" stroke="#51536e" stroke-width="2"/><path d="M28 55h14l2 5 10 4H17l10-4Z" fill="url(#metal)" stroke="#454a64"/><path d="M13 49h44M22 63h29" stroke="#e0deeb"/><path d="M34 49h4" stroke="#252b47"/>';
    if (kind === 'Help')
      drawing =
        '<path d="M17 53 47 17l16 16v29H27Z" fill="url(#dark)" stroke="#42465f"/><path d="m27 56 28-21 5 5v22H27Z" fill="url(#metal)" stroke="#777d94"/><path d="M7 51 32 5 56 18 30 65Z" fill="#3c405a" transform="translate(2 1)"/><path d="M5 49 31 3l25 14-26 46Z" fill="url(#lav)" stroke="#dfdaee"/><path d="m30 63 26-46 3 5-26 44Z" fill="#555a7a" stroke="#343a52"/>';
    if (kind === 'disk')
      drawing =
        '<path d="m15 12 37-1 12 43H5Z" fill="url(#metal)" stroke="#d5d5e4"/><path d="M5 54h59v9H5Z" fill="url(#dark)" stroke="#353b55"/><path d="M8 54h53v5H8Z" fill="#a4a8be"/><path d="M13 57h32" stroke="#2b3049" stroke-width="3"/><circle cx="56" cy="57" r="1.8" fill="#292e47"/><ellipse cx="34" cy="31" rx="15" ry="12" fill="none" stroke="#d0d0de"/><path d="M22 20q18-9 26 9" fill="none" stroke="#6b718b"/>';
    if (kind === 'trash')
      drawing =
        '<path d="m13 18 6 45q15 9 30 0l6-45Z" fill="url(#metal)" stroke="#c5c5d9" stroke-width="2"/><path d="m20 25 4 34m6-33 2 37m9-38-2 37m10-38-4 35" fill="none" stroke="#5d6480" stroke-width="3"/><path d="m22 25 4 32m6-31 2 35m9-36-2 35" stroke="#e4e2ed" fill="none"/><ellipse cx="34" cy="17" rx="26" ry="8" fill="url(#metal)" stroke="#d7d5e4" stroke-width="2"/><ellipse cx="34" cy="16" rx="20" ry="4" fill="#5c617b" stroke="#aeb0c5"/><path d="M25 12V7h18v5" fill="none" stroke="#bbbdd1" stroke-width="3"/>';
    return '<svg viewBox="0 0 70 72" aria-hidden="true">' + defs + drawing + '</svg>';
  }
  env.site({
    name: 'design-click-control-focus-12',
    styles: ['site.css', 'irix.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref irix';
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      C.menus.forEach((m) => u.el('span', 'mi', bar, m));
      u.el('span', 'clock', bar, C.clock);
      u.el('span', 'speaker', bar).innerHTML =
        '<svg viewBox="0 0 22 24"><path d="M2 9h4l6-5v16l-6-5H2Z M16 7q5 5 0 10 M18 4q8 8 0 16" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
      const chest = u.el('nav', 'chest', shell);
      C.chest.forEach((c, i) => {
        const it = u.el('div', 'chest-item', chest);
        const s = u.el('span', 'ico', it);
        s.innerHTML = sculpture(c[0]);
        u.el('em', '', it, c[0]);
      });
      const logo = u.el('div', 'sgi', shell);
      logo.innerHTML =
        '<svg viewBox="0 0 100 110"><defs><linearGradient id="sgi-shade" x2="1" y2="1"><stop stop-color="#bdb4df"/><stop offset=".5" stop-color="#9390bb"/><stop offset="1" stop-color="#6e719c"/></linearGradient></defs><g fill="url(#sgi-shade)" stroke="#b9b3db" stroke-width="1.3" stroke-linejoin="round"><path d="M46 4 12 25v10l34 20V41L25 29l21-13Z M55 4v12l21 13-21 12v14l34-20V25Z"/><path d="M5 39v40l38 24V61Z M16 57l16 10-16 9Z M32 79v14l-15-9Z" fill-rule="evenodd"/><path d="M95 39v40l-38 24V61Z M84 57 68 67l16 9Z M68 79v14l15-9Z" fill-rule="evenodd"/></g><g fill="none" stroke="#565d83" stroke-width="1.3"><path d="M44 17 26 28l20 12M76 29 56 41M7 79l34 21V63M59 100l34-22V42M17 59l13 8-13 7M83 59l-13 8 13 7"/></g><g fill="none" stroke="#d3c8ed" stroke-width="1"><path d="M46 5v11M55 5v11M6 40l36 22v39M94 40 58 62v39"/></g></svg><b>silicon<br>graphics</b><i>I R I X</i>';
      [
        ['disk0', 'disk'],
        ['Trash', 'trash'],
      ].forEach((d) => {
        const e = u.el('div', 'deskico ' + d[1], shell);
        u.el('span', 'dglyph', e).innerHTML = sculpture(d[1]);
        u.el('em', '', e, d[0]);
      });
      const ws = u.el('div', 'wsw', shell);
      [1, 2, 3, 4].forEach((n) => u.el('span', n === 1 ? 'on' : '', ws, String(n)));
      const cur = u.el('div', 'cursor', shell);
      cur.innerHTML =
        '<svg viewBox="0 0 20 28"><path d="M1 1v21l5-5 4 9 3-1-4-9h7z" fill="#101019" stroke="#ededf3" stroke-width="1.3"/></svg>';

      const dlg = u.el('section', 'dlg', shell);
      const tb = u.el('div', 'dlg-title', dlg);
      u.el('i', 'dlg-box', tb);
      u.el('span', '', tb, 'User Manager');
      u.el('i', 'dlg-x', tb);
      const tabs = u.el('div', 'tabs', dlg);
      const tPref = u.el('div', 'tab on', tabs, 'Preferences');
      const tTask = u.el('div', 'tab', tabs, 'Task');
      const links = u.el('div', 'toplinks', dlg);
      ['Users', 'Groups', 'Settings'].forEach((t) => u.el('span', '', links, t));
      u.el('div', 'panel', dlg);
      const nav = u.el('div', 'pnav', dlg);
      C.nav.forEach((n, i) => u.el('div', i === 0 ? 'on' : '', nav, n));
      const mid = u.el('div', 'pmid', dlg);
      u.el('h3', '', mid, 'Appearance');
      [
        ['Color Scheme:', 'Iris Lavender'],
        ['Icon Style:', 'Sculpted'],
      ].forEach((r, i) => {
        const row = u.el('div', 'prow r' + i, mid);
        u.el('span', '', row, r[0]);
        const s = u.el('div', 'fake-sel', row);
        u.el('b', '', s, r[1]);
        u.el('i', '', s);
      });
      const cks = u.el('div', 'checks', mid);
      C.checks.forEach((c) => {
        const r = u.el('div', 'ck', cks);
        u.el('i', c[1] ? 'on' : '', r);
        u.el('span', '', r, c[0]);
      });
      u.el('div', 'cube', mid).innerHTML =
        '<svg viewBox="0 0 164 145"><defs><linearGradient id="cube-top" x2="1" y2="1"><stop stop-color="#c3beda"/><stop offset="1" stop-color="#9a95bc"/></linearGradient><linearGradient id="cube-left" x2=".8" y2="1"><stop stop-color="#a49bcb"/><stop offset="1" stop-color="#73709d"/></linearGradient><linearGradient id="cube-right" x2="1" y2="1"><stop stop-color="#6f6c96"/><stop offset="1" stop-color="#42465f"/></linearGradient></defs><path d="m40 104 49-27 57 31-49 27Z" fill="#555767"/><path d="m64 104 30-16 32 17-30 18Z" fill="#444653" opacity=".7"/><path d="m84 23 36 20-35 20-36-20Z" fill="url(#cube-top)" stroke="#d1c8ea"/><path d="m49 43 36 20v48L49 92Z" fill="url(#cube-left)" stroke="#b5abd1"/><path d="m85 63 35-20v49l-35 19Z" fill="url(#cube-right)" stroke="#242a40"/><path d="m85 63 35-20" stroke="#ccc4e5"/></svg>';
      const pb = u.el('div', 'pbtns', mid);
      ['Apply', 'Defaults', 'Revert'].forEach((t) => (u.el('button', 'sbtn', pb, t).type = 'button'));

      const pane = u.el('aside', 'tpane', dlg);
      const ph = u.el('div', 'tpane-h', pane);
      u.el('b', '', ph, 'Task');
      const st = u.el('span', '', ph, '(not active)');
      const center = u.el('section', 'center', pane);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const setTab = (t) => {
        tPref.classList.toggle('on', !t);
        tTask.classList.toggle('on', t);
        st.textContent = t ? '(active)' : '(not active)';
      };
      tPref.addEventListener('click', () => setTab(false));
      tTask.addEventListener('click', () => setTab(true));

      const foot = u.el('footer', 'footer', dlg);
      const clear = u.el('button', 'clear-form sbtn', foot, 'Cancel');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((i) => {
          i.value = '';
        }),
      );
      let submit = null;
      if (!ctx.finish) {
        const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const endRng = ctx.rng.fork('chrome/end');
        const placement = endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'link']);
        const endLabel = endRng.bool(0.5) ? 'Submit' : labelText(endRng.pick(labels));
        const makeEnd = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = makeEnd(foot, 'submit sbtn', endLabel);
        else if (placement === 'toolbar') submit = makeEnd(links, 'irix-end-toolbar', endLabel);
        else submit = makeEnd(foot, 'irix-end-link', endLabel + ' ›', 'a');

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const wanted = endLabel.trim().toLowerCase();
          const candidates = [...new Set(labels.map(labelText))].filter((x) => x.trim().toLowerCase() !== wanted);
          if (candidates.length) {
            const text = labelText(collideRng.pick(candidates));
            const parent = placement === 'footer' ? links : foot;
            const decoy = u.el('button', parent === links ? 'irix-xtra-toolbar' : 'irix-xtra-footer', parent, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
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
