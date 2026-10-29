(function () {
  'use strict';
  const C = {
    'theme': 'cdrom',
    'title': 'The Learning Library',
    'accent': '#d9a93a',
    'bg': '#0c2d58',
    'font': "Georgia, 'Times New Roman', serif",
  };
  env.site({
    name: 'design-reorder-items-list-09',
    styles: ['site.css', 'cdrom.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      body.className = 'design memphis cdrom' + (display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: '#efe3c8',
        fg: '#2a1a08',
        muted: '#5a4a30',
        line: '#b9a77c',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      // header
      const head = u.el('header', 'head', shell);
      // Reuse only the reference's decorative artwork; all task content stays live DOM.
      const artwork = (parent, cls, viewBox) => {
        const svg = u.svg('svg', { class: cls, viewBox, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, parent);
        u.svg(
          'image',
          { href: 'sites/design-reorder-items-list-09/assets/reference-art.webp', width: 1672, height: 941 },
          svg,
        );
        return svg;
      };
      artwork(head, 'cd-logo', '30 16 140 92');
      const texture = u.svg(
        'svg',
        { class: 'cd-texture', viewBox: '0 0 1672 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
        shell,
      );
      const defs = u.svg('defs', {}, texture),
        pattern = u.svg('pattern', { id: 'cd-paper', width: 300, height: 600, patternUnits: 'userSpaceOnUse' }, defs);
      const tile = u.svg(
        'svg',
        { id: 'cd-grain', width: 150, height: 300, viewBox: '30 550 150 300', preserveAspectRatio: 'none' },
        defs,
      );
      u.svg(
        'image',
        { href: 'sites/design-reorder-items-list-09/assets/reference-art.webp', width: 1672, height: 941 },
        tile,
      );
      for (const transform of [
        '',
        'translate(300 0) scale(-1 1)',
        'translate(0 600) scale(1 -1)',
        'translate(300 600) scale(-1 -1)',
      ])
        u.svg('use', { href: '#cd-grain', transform }, pattern);
      u.svg('rect', { width: 1672, height: 941, fill: 'url(#cd-paper)' }, texture);
      u.el('div', 'cd-stage-frame', shell);
      const ttl = u.el('div', 'cd-title', head);
      u.el('span', 'cd-the', ttl, 'The');
      u.el('span', 'cd-name', ttl, 'Learning Library');
      const tag = u.el('div', 'cd-tag', head);
      for (const [i, w] of ['Explore', 'Learn', 'Grow'].entries()) {
        if (i) u.el('i', 'dia', tag, '✦');
        u.el('em', '', tag, w);
      }
      // left nav
      const nav = u.el('nav', 'cd-nav', shell);
      const ico = { Home: '#3f7fd0', Topics: '#b0382c', Activities: '#2f5fb0', Settings: '#2a4f9a' };
      for (const [i, name] of ['Home', 'Topics', 'Activities', 'Settings'].entries()) {
        const b = u.el('button', 'cd-navbtn' + (name === 'Activities' ? ' on' : ''), nav);
        b.type = 'button';
        artwork(b, 'cd-ico', `34 ${[181, 268, 357, 449][i]} 46 46`);
        u.el('span', '', b, name);
        b.onclick = () => {
          nav.querySelectorAll('.cd-navbtn').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        };
      }
      // tabs + sheet
      const tabs = u.el('div', 'cd-tabs', shell);
      for (const [i, t] of ['Practice', 'Reference', 'Quiz'].entries()) {
        const b = u.el('button', 'cd-tab' + (i === 0 ? ' on' : ''), tabs, t);
        b.type = 'button';
        b.onclick = () => {
          tabs.querySelectorAll('.cd-tab').forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        };
      }
      const sheet = u.el('section', 'cd-sheet', shell);
      const note = u.el('section', 'task-note', sheet);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el('p', 'cd-sub', note, 'Drag the items into the correct order.');
      // Fit seeded instruction scenarios into the same reserved headline line.
      if (ctx.display !== 'hidden' && ctx.display !== 'toast' && instruction.scrollWidth > instruction.clientWidth) {
        const font = parseFloat(getComputedStyle(instruction).fontSize);
        instruction.style.fontSize = ((font * instruction.clientWidth) / instruction.scrollWidth) * 0.98 + 'px';
      }
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      // right column
      const art = u.el('div', 'cd-art', shell);
      artwork(art, 'cd-pic', '1450 140 204 350');
      const cap = u.el('div', 'cd-cap', art);
      u.el('span', '', cap, 'Knowledge Opens New Worlds');
      const tools = u.el('div', 'cd-tools', shell);
      u.el('h3', '', tools, 'Tools');
      const reset = u.el('button', 'cd-tool', tools);
      reset.type = 'button';
      artwork(reset, 'cd-tic', '1471 591 40 43');
      u.el('span', '', reset, 'Reset List');
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      const hint = u.el('button', 'cd-tool', tools);
      hint.type = 'button';
      artwork(hint, 'cd-tic q', '1471 676 36 36');
      u.el('span', '', hint, 'Show Hint');
      hint.onclick = () => env.log('hint', {});
      let submit = null;
      if (!ctx.finish) {
        const content = ctx.content || {},
          raw =
            Array.isArray(content.END_LABELS) && content.END_LABELS.length
              ? content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const labels = raw.map(labelOf),
          fallback = labels.includes('Submit') ? 'Submit' : labels[0];
        const endR = ctx.rng.fork('chrome/end');
        const placement = endR.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'icon']);
        const alternatives = labels.filter((x) => x !== fallback);
        const label = endR.bool(0.5) || !alternatives.length ? fallback : endR.pick(alternatives);
        const endBtn = (parent, cls, text, visibleLabel) => {
          const b = u.el(cls === 'cd-end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          if (visibleLabel) b.textContent = visibleLabel;
          return b;
        };
        const collideR = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (collideR.bool(0.3)) {
          const options = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
          if (options.length) collide = { label: collideR.pick(options), where: collideR.pick(['tools', 'footer']) };
        }
        const decoy = (parent, text) => {
          const b = u.el('button', 'cd-pq', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        };
        const toolEnd = placement === 'toolbar' || placement === 'link' || placement === 'icon';
        if (toolEnd) {
          if (placement === 'toolbar') submit = endBtn(tools, 'cd-tool cd-end-toolbar', label, label);
          else if (placement === 'link') submit = endBtn(tools, 'cd-end-link', label + ' ›', label + ' ›');
          else submit = endBtn(tools, 'cd-end-icon', '✓', label);
        }
        if (collide) decoy(head, collide.label);
        if (placement === 'footer') submit = endBtn(shell, 'submit cd-submit-footer', label, label);
      }
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
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
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
