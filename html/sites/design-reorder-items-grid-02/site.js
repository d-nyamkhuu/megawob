(function () {
  'use strict';
  const C = {
    tabs: ['Tasks', 'Notes', 'Sketches', 'Files', 'Reference', 'Settings'],
    icons: [
      ['Files', 'M3 9H13L16 12H29V27H3Z', '#d9cf8a'],
      ['Edit', 'M7 4H23V28H7Z M11 10H19M11 15H19', '#fff'],
      ['View', 'M2 16Q16 4 30 16Q16 28 2 16Z M16 11A5 5 0 1 0 16 21A5 5 0 1 0 16 11', '#3a5fd0'],
      ['Tools', 'M6 28L20 14M18 4A7 7 0 0 1 26 12L22 11L20 14L12 6Z', '#707070'],
      ['Help', 'M6 4H26V28H6Z M12 11Q12 8 16 8Q20 8 20 12Q20 15 16 16V19M16 22V24', '#2a3ad8'],
    ],
  };
  env.site({
    name: 'design-reorder-items-grid-02',
    styles: ['site.css', 'risc.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'risc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endR = ctx.rng.fork('chrome/end'),
        collR = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const originalEnd = endR.bool(0.5);
      const alternates = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = originalEnd ? 'Submit' : labelOf(endR.pick(alternates.length ? alternates : labels));
      const placement = originalEnd ? 'page' : endR.pick(['toolbar', 'link', 'title']);
      const collide = collR.bool(0.3)
        ? labelOf(collR.pick(labels.filter((x) => labelOf(x).toLowerCase() !== endLabel.toLowerCase())))
        : null;
      // icon bar
      const bar = u.el('header', 'rs-bar', body);
      const logo = u.el('div', 'rs-logo', bar);
      const berry = u.el('span', 'rs-berry', logo);
      berry.innerHTML =
        '<svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg"><g stroke="#101010" stroke-width="1.7" stroke-linejoin="miter"><path fill="#50b82c" d="M14 17L6 9L5 2L14 6L16 13L17 1L22 2L22 12L29 4L34 4L29 12L24 16Z"/><path fill="#d50a37" d="M10 17L24 17L31 24L30 34L24 42L12 41L5 33L5 23Z"/><g fill="#e62046"><circle cx="12" cy="23" r="4"/><circle cx="21" cy="22" r="4"/><circle cx="8" cy="30" r="4"/><circle cx="17" cy="30" r="4"/><circle cx="26" cy="29" r="4"/><circle cx="13" cy="37" r="4"/><circle cx="22" cy="37" r="4"/></g></g></svg>';
      u.el('span', '', logo, 'RISC OS');
      const icons = u.el('nav', 'rs-icons', bar);
      const artwork = {
        Files:
          '<path fill="#d6d098" d="M3 8H13L16 3H27L29 5V29H2V10Z"/><path fill="none" stroke="#ffffdc" d="M4 27V10H14L17 5H26"/>',
        Edit: '<path fill="#fff" d="M5 2H24V28H5Z"/><path stroke="#1934c5" d="M8 6H21M8 10H21M8 14H21M8 18H21M8 22H17"/><path fill="#e6b557" d="M13 25L14 19L27 6L30 9L17 23Z"/><path fill="#111" d="M13 25L14 20L17 23Z"/>',
        View: '<path fill="#fff" d="M1 15L9 8L17 5L25 9L31 15L25 21L17 24L9 21Z"/><ellipse fill="#163ad6" cx="17" cy="15" rx="7" ry="8"/><ellipse fill="#050505" cx="17" cy="15" rx="3" ry="5"/><path stroke="#fff" stroke-width="2" d="M14 10L17 9"/>',
        Tools:
          '<path fill="#737875" d="M3 27L19 11L19 6L25 1L29 2L25 6L27 10L31 7L30 13L24 16L20 15L7 30Z"/><path stroke="#bbb" d="M6 26L20 12"/>',
        Help: '<path fill="#1839cc" d="M5 2H27V29H5Z"/><path fill="none" stroke="#fff" d="M7 4H25V27H7"/><path fill="none" stroke="#fff" stroke-width="2.5" d="M12 10Q12 6 17 6Q23 7 21 12L17 16V20M17 23V25"/>',
      };
      for (const [name] of C.icons) {
        const it = u.el('button', 'rs-icon', icons);
        it.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 34,
            height: 32,
            viewBox: '0 0 32 32',
            stroke: '#151515',
            'stroke-width': 1.4,
            'stroke-linejoin': 'miter',
          },
          it,
        );
        s.innerHTML = artwork[name];
        u.el('span', '', it, name);
      }
      u.el('div', 'rs-clock', bar, 'Tue 14 Nov 1989   10:24');
      // notebook window
      const win = u.el('div', 'rs-win', body);
      const tabs = u.el('div', 'rs-tabs', win);
      C.tabs.forEach((t, i) => {
        const b = u.el('button', 'rs-tab' + (i === 0 ? ' on' : ''), tabs, t);
        b.type = 'button';
        b.onclick = () => {
          tabs.querySelectorAll('.rs-tab').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        };
      });
      const frame = u.el('div', 'rs-frame', win);
      const tb = u.el('div', 'rs-title', frame);
      u.el('span', '', tb, 'Notebook');
      const close = u.el('button', 'rs-close', tb);
      close.type = 'button';
      close.innerHTML =
        '<svg viewBox="0 0 16 16" width="100%" height="100%"><path d="M3 3L13 13M13 3L3 13" stroke="#111" stroke-width="2.4"/></svg>';
      close.onclick = () => env.log('window-control', { label: 'close' });
      const page = u.el('div', 'rs-page', frame);
      const note = u.el('section', 'rs-note task-note', page);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display !== 'header') note.hidden = true;
      if (ctx.display === 'toast') {
        note.hidden = false;
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const stage = u.el('main', 'rs-stage stage', page);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'rs-side', page);
      if (ctx.display === 'hidden') side.hidden = true;
      u.el('span', 'rs-fold', side);
      u.el('h3', '', side, 'Task');
      const sideText = u.el('p', '', side, ctx.instruction);
      if (ctx.display === 'hidden') sideText.hidden = true;
      u.el('div', 'rs-rule', page);
      let submit = null;
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'rs-xtra rs-pq' : 'rs-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        return b;
      };
      if (collide && !ctx.finish) decoyBtn(bar, collide, true);
      if (!ctx.finish) {
        if (placement === 'page') {
          submit = u.el('button', 'rs-submit submit', page);
          u.el('span', 'submit-label', submit, endLabel);
        } else if (placement === 'toolbar') {
          submit = u.el('button', 'rs-toolbar-end', bar, endLabel);
        } else if (placement === 'title') {
          submit = u.el('button', 'rs-title-end', tb, endLabel);
        } else {
          submit = u.el('a', 'rs-link-end', page, endLabel + ' ›');
          submit.href = '#';
        }
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      const waste = u.el('div', 'rs-waste', body);
      const bs = u.svg(
        'svg',
        { width: 30, height: 40, viewBox: '0 0 30 40', fill: '#ccc', stroke: '#333', 'stroke-width': 1.5 },
        waste,
      );
      bs.innerHTML =
        '<path d="M3 7V35Q15 42 27 35V7Z"/><path fill="none" stroke="#888" d="M7 10V35M11 11V37M16 11V37M21 10V36M25 9V35"/><ellipse cx="15" cy="7" rx="13" ry="5" fill="#ddd"/><path fill="none" d="M11 4V2H18V4"/>';
      u.el('span', '', waste, 'Waste');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
