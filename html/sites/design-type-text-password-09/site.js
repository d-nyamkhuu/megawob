(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-09',
    'brand': 'Account Setup',
    'instruction': 'top',
    'menu': 'Desk|File|Edit|Options',
    'briefTitle': 'Instructions',
  };
  const NS = 'http://www.w3.org/2000/svg';
  function svg(parent, html, vb) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 64 64');
    s.setAttribute('fill', '#e8e8e8');
    s.setAttribute('stroke', '#000');
    s.setAttribute('stroke-width', '3');
    s.innerHTML = html;
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
      svg(
        top,
        '<path d="M26 3 V26 L22 38 L7 54 V60 H15 L29 39 V3 M32 3 V60 M35 3 V39 L49 60 H57 V54 L42 38 L38 26 V3" fill="none"/>',
      ).setAttribute('class', 'ds-logo');
      C.menu.split('|').forEach((t) => u.el('span', '', top, t));
      u.el('span', 'ds-sp', top);
      u.el('span', 'ds-clock', top, 'Mon 27 Jan 1986   10:24');
      u.el('span', 'ds-batt', top);
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const i1 = u.el('div', '', rail);
      svg(
        i1,
        '<path d="M5 8 H54 L59 13 V55 H5 Z" fill="#bbb"/><path d="M15 8 H47 V25 H15 Z" fill="#3dbf3a"/><path d="M35 10 H42 V20 H35 Z" fill="#eee" stroke-width="2"/><path d="M13 32 H49 L52 36 V55 H11 V36 Z" fill="#eee"/><path d="M28 40 H34 V48 H28 Z M29 43 H33" stroke-width="2"/><path d="M54 13 V55" fill="none"/>',
      );
      u.el('div', '', i1, 'A:\\\nFloppy');
      const i2 = u.el('div', '', rail);
      svg(
        i2,
        '<path d="M5 33 L18 12 H59 L47 33 Z" fill="#bdbdbd"/><path d="M5 33 H47 V52 H5 Z" fill="#e8e8e8"/><path d="M47 33 L59 12 V41 L47 52 Z" fill="#999"/><path d="M11 36 H18 V39 H12 V46 H18 M31 38 H41 V46 H31 Z" fill="none" stroke-width="3"/><path d="M19 16 H48 M54 28 V39 L50 44" stroke="#fff" stroke-width="2"/>',
      );
      u.el('div', '', i2, 'B:\\\nHard Disk');
      const i3 = u.el('div', '', rail);
      svg(
        i3,
        '<path d="M23 7 V3 H39 V7 M12 17 H51 V58 L47 62 H17 L12 58 Z" fill="#bdbdbd"/><path d="M8 8 H55 V14 H8 Z" fill="#e8e8e8"/><path d="M16 18 V57 H47 V18" fill="#eee"/><path d="M22 23 V55 M32 23 V55 M42 23 V55" fill="none" stroke-width="4"/><path d="M10 15 H54" fill="none"/>',
      );
      u.el('div', '', i3, 'Trash');
      const win = u.el('div', 'ds-window', body);
      const tb = u.el('div', 'ds-titlebar', win);
      const gadget = u.el('span', 'ds-gadget', tb);
      svg(gadget, '<path d="M14 18 H50 V26 H14 Z M24 29 H40 V36 H24 Z M32 26 V50 M24 50 H40" fill="#000"/>');
      const tt = u.el('div', 'ds-ttl', tb);
      u.el('span', '', tt, C.brand);
      const minimize = u.el('span', 'ds-gadget', tb);
      svg(minimize, '<path d="M10 12 H54 M10 49 H54" fill="none" stroke-width="5"/>');
      const close = u.el('span', 'ds-gadget', tb);
      svg(close, '<path d="M14 14 L50 50 M50 14 L14 50" fill="none" stroke-width="5"/>');
      const up = u.el('section', 'ds-upper', win);
      u.el('h3', '', up, 'Account Setup');
      const info = u.el('div', 'ds-info', up);
      [
        ['User:', 'New User'],
        ['Account type:', 'Standard'],
        ['Location:', 'A:\\USERS'],
        ['Disk space:', '2 MB (estimated)'],
      ].forEach((r) => {
        u.el('span', '', info, r[0]);
        u.el('span', '', info, r[1]);
      });
      const doc = u.el('div', 'ds-doc', up);
      svg(
        doc,
        '<path d="M8 3 H43 L57 17 V61 H8 Z M43 3 V17 H57"/><path d="M15 12 H36 M15 17 H40 M15 23 H50 M15 28 H50 M15 33 H50 M15 38 H50 M15 43 H50 M15 48 H50 M15 53 H35" fill="none" stroke-width="2"/>',
      );
      u.el('div', '', doc, 'A new account will be created\nwith the settings shown.');
      const content = u.el('div', 'ds-lower', win);
      u.el('h3', '', content, 'Set Password');
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
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const cursor = u.el('div', 'ds-cursor', content);
      svg(cursor, '<path d="M4 3 V49 L17 38 L28 59 L36 55 L25 34 H42 Z" fill="#000" stroke="#fff" stroke-width="2"/>');
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      let endLabel = 'Submit';
      const decoyBtn = (parent, label, collide) => {
        const b = u.el('button', parent === foot ? 'ds-btn' : 'ds-btn ds-chrome-btn', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      if (!ctx.finish) {
        const placement = endR.pick(['footer', 'footer', 'titlebar', 'overview']);
        endLabel =
          placement === 'footer'
            ? endLabels.find((x) => x === 'Submit') || 'Submit'
            : endR.pick(endLabels.filter((x) => x !== 'Submit'));
        const parent = placement === 'titlebar' ? tb : placement === 'overview' ? up : foot;
        submit = u.el(
          'button',
          placement === 'footer' ? 'ds-submit' : 'ds-submit ds-chrome-btn ds-end-' + placement,
          parent,
          endLabel,
        );
        if (placement === 'titlebar') tb.insertBefore(submit, minimize);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
        decoyBtn(foot, 'Clear');
        decoyBtn(foot, 'Cancel');
      }
      if (collideR.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const b = decoyBtn(tb, collideR.pick(options), true);
          tb.insertBefore(b, minimize);
        }
      }
      const instruction = content.querySelector('.ds-instruction');
      if (instruction) {
        const L = 90,
          n = instruction.textContent.length;
        if (n > L) instruction.style.setProperty('--fit', Math.sqrt(L / n).toFixed(4));
        const line = parseFloat(getComputedStyle(instruction).lineHeight);
        const scale = parseFloat(getComputedStyle(content.querySelector('h3')).lineHeight) / 33;
        const extra = Math.max(0, instruction.getBoundingClientRect().height - line);
        content.style.setProperty('--field-top-space', Math.max(8 * scale, 45 * scale - extra) + 'px');
      }
      // Finish mode has no footer buttons. Reclaim only enough of that unused space
      // to fit the two unchanged 52-unit fields and their 28-unit gap in the stage.
      if (ctx.finish) {
        const scale = parseFloat(getComputedStyle(content.querySelector('h3')).lineHeight) / 33;
        const deficit = 134 * scale - stage.getBoundingClientRect().height;
        if (deficit > 0) foot.style.height = Math.max(0, foot.getBoundingClientRect().height - deficit) + 'px';
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
