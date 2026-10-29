(function () {
  'use strict';
  const C = {
    title: 'Geometry Practice',
    brand: 'GeoLab',
    nav: ['Tasks', 'History', 'Settings', 'Help'],
    accent: '#a8141c',
    bg: '#faf9f6',
    font: 'Georgia, "Times New Roman", serif',
  };
  env.site({
    name: 'design-click-point-center-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design mag' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: '#fdfcfa',
        fg: '#1c1c1c',
        muted: '#6a665f',
        line: '#1c1c1c',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const rail = u.el('nav', 'rail', shell);
      u.el('div', 'brand', rail, C.brand);
      u.el('hr', 'rail-rule', rail);
      C.nav.forEach((t, i) => {
        const a = u.el('div', 'rail-item' + (i === 0 ? ' on' : ''), rail, t);
        a.onclick = () => env.log('nav', { label: t });
      });
      u.el('hr', 'rail-rule low', rail);
      const ver = u.el('div', 'ver', rail);
      ver.innerHTML = 'v1.0<br>© 2008';
      const content = u.el('div', 'content', shell);
      const endR = ctx.rng.fork('chrome/end');
      const placements = ctx.finish ? [] : ['footer', 'footer', 'header', 'link'];
      const placement = ctx.finish ? null : endR.pick(placements);
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = placement === 'footer' ? 'Submit' : labelOf(endR.pick(endLabels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = { label: collideR.pick(options), where: collideR.pick(['header', 'footer']) };
      }
      const head = u.el('header', 'head', content);
      u.el('h1', 'title', head, C.title);
      const pager = u.el('div', 'pager', head);
      u.el('span', '', pager, 'Problem 3 of 12');
      for (const d of ['prev', 'next']) {
        const b = u.el('button', 'pg ' + d, pager);
        b.type = 'button';
        b.setAttribute('aria-label', d);
        const s = u.svg('svg', { width: 20, height: 32, viewBox: '0 0 20 32' }, b);
        u.svg('path', { d: d === 'prev' ? 'M18 2L2 16L18 30Z' : 'M2 2L18 16L2 30Z', fill: C.accent }, s);
      }
      const decoyBtn = (parent, label) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label, collide: true });
        return b;
      };
      const endBtn = (parent, cls, label, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, label);
        if (link) {
          b.href = '#';
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
        } else {
          b.type = 'button';
          b.onclick = () => ctx.submit();
        }
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        return b;
      };
      let submit = null;
      if (placement === 'header') submit = endBtn(pager, 'header-end', endLabel, false);
      if (collide && collide.where === 'header') decoyBtn(pager, collide.label);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', content);
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(footer, 'submit', endLabel, false);
        else if (placement === 'link') submit = endBtn(footer, 'end-link', endLabel + ' ›', true);
        if (collide && collide.where === 'footer') decoyBtn(footer, collide.label);
      }
      const clear = u.el('button', 'clear', footer, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
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
