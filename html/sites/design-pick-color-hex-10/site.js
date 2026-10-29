(function () {
  'use strict';
  const PALETTE =
    '<svg viewBox="0 0 104 104" width="100%" height="100%"><defs><radialGradient id="pg" cx=".3" cy=".2" r=".9"><stop offset="0" stop-color="#f4f9ff"/><stop offset="1" stop-color="#9dc4ef"/></radialGradient><linearGradient id="wood" x2="1" y2="1"><stop stop-color="#f4e7cf"/><stop offset="1" stop-color="#ceb585"/></linearGradient><radialGradient id="paint" cx=".3" cy=".2"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient></defs><circle cx="52" cy="52" r="51" fill="url(#pg)" stroke="#6a9eeb" stroke-width="1.5"/><path d="M51 18C69 12 85 24 85 39 85 56 71 72 60 79 53 82 53 72 57 64 60 57 54 52 48 54 41 56 43 47 40 44 36 37 40 23 51 18Z" fill="url(#wood)" stroke="#bca37a" stroke-width="1"/><ellipse cx="63" cy="53" rx="4" ry="6" fill="#b89f75"/><g stroke-width="1.2"><circle cx="38" cy="36" r="6" fill="#a2c849" stroke="#76963b"/><circle cx="26" cy="56" r="6" fill="#19b579" stroke="#298565"/><circle cx="36" cy="77" r="6" fill="#203fec" stroke="#173fa4"/><circle cx="74" cy="36" r="6" fill="#ef4310" stroke="#bd3a12"/><circle cx="38" cy="36" r="6" fill="url(#paint)"/><circle cx="26" cy="56" r="6" fill="url(#paint)"/><circle cx="36" cy="77" r="6" fill="url(#paint)"/><circle cx="74" cy="36" r="6" fill="url(#paint)"/></g><path d="M52 20 56 19 58 55 56 65 53 53Z" fill="#bd8f54" stroke="#a98050" stroke-width=".6"/><ellipse cx="53" cy="28" rx="4" ry="7" fill="#90786b"/><path d="M51 22 52 33" stroke="#eee4cf" stroke-width="2"/></svg>';
  env.site({
    name: 'design-pick-color-hex-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
      document.body.className = 'design aqua';
      const shell = u.el('div', 'shell', document.body);
      const menu = u.el('nav', 'menu-bar', shell);
      const menus = u.el('div', 'menus', menu);
      u.el('span', 'apple', menus, '');
      menus.lastChild.innerHTML =
        '<svg viewBox="0 0 24 28" width="22" height="26"><path d="M17 15c0-3 2-4 3-5-2-2-4-2-5-2-2 0-3 1-4 1s-2-1-4-1c-3 0-6 3-6 7 0 5 4 10 6 10 2 0 3-1 4-1s2 1 4 1c2 0 4-3 5-6-3-1-3-3-3-4zM15 5c1-1 2-3 1-5-2 0-3 1-4 2-1 1-1 3-1 4 2 0 3-1 4-1z" fill="#111"/></svg>';
      for (const [label, cls] of [
        ['Color Studio', 'menu-item app-name'],
        ['File', 'menu-item'],
        ['Edit', 'menu-item'],
        ['View', 'menu-item'],
        ['Window', 'menu-item'],
        ['Help', 'menu-item'],
      ]) {
        const b = u.el('button', cls, menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const sys = u.el('div', 'sys', menu);
      sys.innerHTML =
        '<svg viewBox="0 0 20 20" width="20" height="20"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#111" stroke-width="2"/><path d="M12 12l6 6" stroke="#111" stroke-width="2.4"/></svg><svg viewBox="0 0 26 18" width="26" height="18"><rect x="1" y="2" width="24" height="14" rx="2" fill="none" stroke="#111" stroke-width="1.6"/><rect x="8" y="6" width="10" height="6" fill="#333"/></svg>';
      u.el('span', '', sys, 'Mon Apr 23  10:24 AM');

      const win = u.el('div', 'window', shell);
      const title = u.el('header', 'title-bar', win);
      const lights = u.el('div', 'lights', title);
      for (const [c, name] of [
        ['close', 'Close'],
        ['min', 'Minimize'],
        ['max', 'Maximize'],
      ]) {
        const b = u.el('button', 'light ' + c, lights);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      u.el('div', 'title', title, 'Color Studio');
      const titleTools = u.el('div', 'title-tools', title);

      const content = u.el('div', 'content', win);
      const note = u.el('section', 'task-note panel', content);
      const icon = u.el('div', 'brief-icon', note);
      icon.innerHTML = PALETTE;
      u.el('div', 'brief-head', note, 'Color Match Task');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el(
        'div',
        'brief-sub',
        note,
        ctx.finish || !referenceEnd
          ? 'Adjust the color using the controls below.'
          : 'Adjust the color using the controls below.',
      );
      if (ctx.instruction.length > 65) instruction.classList.add('long-instruction');
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';

      const info = u.el('aside', 'info panel', content);
      u.el('div', 'panel-head', info, 'Color Information');
      u.el('div', 'info-body', info);
      const actions = u.el('div', 'info-actions', info);
      let submit = null;
      if (!ctx.finish) {
        const host = placement === 'toolbar' ? titleTools : placement === 'link' ? note : actions;
        submit = u.el(
          'button',
          'submit' + (placement === 'toolbar' ? ' toolbar-submit' : placement === 'link' ? ' note-end' : ''),
          host,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (alternatives.length) {
          const label = cr.pick(alternatives);
          const decoy = u.el('button', 'chrome-xtra', titleTools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }
      if (ctx.display !== 'hidden') {
        let fontSize = parseFloat(getComputedStyle(instruction).fontSize);
        while (instruction.scrollHeight > instruction.clientHeight && fontSize > 10) {
          fontSize -= 0.5;
          instruction.style.fontSize = fontSize + 'px';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'Color Studio is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the color profile before matching.',
          banner: 'Color Studio is using the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
