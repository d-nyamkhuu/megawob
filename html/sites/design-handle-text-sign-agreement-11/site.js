(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-sign-agreement-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'cookie' },
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const endPlace = referenceEnd ? 'inspector' : endRng.pick(['toolbar', 'footer']);
      const endText = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      document.body.className = 'ref procarbon console';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Acme Documents');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menus = u.el('div', 'tools', head);
      menus.innerHTML =
        '<span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>T</u>ools</span><span><u>H</u>elp</span>';
      const toolbar = u.el('div', 'toolbar', shell);
      toolbar.innerHTML =
        '<span class="tool-item"><svg viewBox="0 0 32 34" aria-hidden="true"><path d="M5 2h15l8 8v22H5Z" fill="#cdd0d2" stroke="#11171c" stroke-width="2"/><path d="M20 2v9h8M9 15h15M9 19h15M9 23h15M9 27h12" fill="none" stroke="#30363b" stroke-width="2"/></svg>Open</span><span class="tool-item"><svg viewBox="0 0 32 34" aria-hidden="true"><path d="M3 2h24l3 3v27H3Z" fill="#777198" stroke="#11161b" stroke-width="2"/><path d="M8 3h16v12H8Z" fill="#c6cbd3" stroke="#242532"/><path d="M19 4h3v8h-3Z" fill="#3c3c53"/><path d="M8 20h17v11H8Z" fill="#b8becb" stroke="#292b35"/><path d="M12 23h9M12 26h9" stroke="#424854"/></svg>Save</span><span class="tool-item"><svg viewBox="0 0 34 34" aria-hidden="true"><path d="M9 2h17v10H9Z" fill="#e4e6e8" stroke="#10161c" stroke-width="2"/><path d="M3 12h29v15H3Z" fill="#9b9fa4" stroke="#12171c" stroke-width="2"/><path d="M6 14h23v5H6Z" fill="#c7cace"/><path d="M9 22h17v10H9Z" fill="#d4d7d9" stroke="#22282e" stroke-width="2"/><path d="M12 26h11M12 29h11" stroke="#585e63"/><circle cx="28" cy="17" r="1" fill="#4e814c"/></svg>Print</span><i></i><span class="tool-item"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="14" cy="13" r="10" fill="#b8bcc0" stroke="#11171c" stroke-width="2"/><circle cx="14" cy="13" r="7" fill="#31373d" stroke="#d8dbde"/><path d="m22 21 9 9" stroke="#10151a" stroke-width="7"/><path d="m22 21 9 9" stroke="#b7bdc3" stroke-width="4"/></svg>Find</span><label>Agreement.docx</label>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      const ih = u.el('div', 'inspector-head', aside);
      u.el('h2', '', ih, 'Task');
      u.el('span', 'clock', ih, 'Time: Paused  ◉');
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-notification');
      const details = u.el('section', 'inspector-details', aside);
      u.el('strong', '', details, 'Details');
      [
        ['Document:', 'Service Agreement'],
        ['Pages:', '6'],
        ['Current page:', '6'],
        ['Status:', 'Not signed'],
      ].forEach((x) => {
        const r = u.el('div', 'detail-row', details);
        u.el('span', '', r, x[0]);
        u.el('span', '', r, x[1]);
      });
      const help = u.el('section', 'control-help', aside);
      u.el('strong', '', help, 'Controls');
      [
        '◉　 Pointer: click to select',
        '▦　 Keyboard: type your name',
        '◉　 Mouse wheel: scroll through the document',
      ].forEach((t) => u.el('p', '', help, t));
      if (ctx.display === 'panel') aside.insertBefore(note, help);
      const submitInfo = u.el('section', 'submit-info', aside);
      u.el('strong', '', submitInfo, ctx.finish ? 'Task completion' : 'Submit Task');
      u.el(
        'p',
        '',
        submitInfo,
        ctx.finish
          ? 'Complete the steps, then finish the task.'
          : `Click ${endText} when you have completed the steps (or dismissed the panel).`,
      );
      if (ctx.display === 'toast') aside.insertBefore(note, submitInfo);
      const foot = u.el('footer', 'footer', shell);
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlace === 'toolbar' ? toolbar : endPlace === 'footer' ? foot : submitInfo;
        submit = u.el('button', 'submit end-' + endPlace, parent, endText);
        submit.type = 'button';
        submit.title = endText;
        submit.setAttribute('aria-label', endText);
        submit.addEventListener('click', ctx.submit);
      } else submitInfo.classList.add('finish-info');
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const label = collideRng.pick(endLabels.filter((x) => x !== endText));
        const decoy = u.el('button', 'chrome-xtra', toolbar, label);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      u.el('span', 'ready', foot, 'Page 6 of 6');
      u.el('span', 'zoom', foot, '100%　 −　 ▬▬▬　 +');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      if (ctx.kind === 'cookie') {
        ctx.util.el('span', 'warning-icon', el, '!');
        ctx.util.el('strong', '', el, 'Action Required');
        ctx.util.el(
          'p',
          'cookie-lead',
          el,
          'Before you can view or sign this agreement, you must accept our consent to continue.',
        );
        const copy = ctx.util.el('div', 'cookie-copy', el);
        ctx.util.el(
          'p',
          '',
          copy,
          'We use cookies and similar technologies to improve functionality, analyze usage and remember your preferences. You can reject optional cookies and continue without accepting.',
        );
        ctx.util.el('a', '', copy, 'Learn more');
        const actions = ctx.util.el('div', 'cookie-actions', el);
        const dismiss = ctx.util.el('button', 'reject', actions, 'Reject optional');
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const accept = ctx.util.el('button', 'accept', actions, 'Accept and continue');
        accept.type = 'button';
        accept.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      ctx.util.el(
        'strong',
        '',
        el,
        { toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
