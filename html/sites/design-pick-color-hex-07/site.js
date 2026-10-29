(function () {
  'use strict';
  const PRESETS = ['#d46a6a', '#e5b93c', '#55aaaa', '#4d82bd', '#a47fcb', '#8d8d8d'];
  const NAV = ['Adjust', 'Explore', 'Create'];
  const STEPS = [
    'Drag in the color area to choose a color.',
    'Use the hue slider if needed.',
    'Match the target color as closely as possible.',
  ];
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  env.site({
    name: 'design-pick-color-hex-07',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design riso';
      const display = ctx.display || 'header';
      const roomy = window.innerWidth >= 1260;
      const tall = window.innerHeight >= 700;
      const shownDisplay = (display === 'panel' && !roomy) || (display === 'toast' && !tall) ? 'header' : display;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const contentLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          : END_LABELS;
      const defaultLabel = contentLabels.find((x) => String(x).trim().toLowerCase() === 'submit') || 'Submit';
      const label = endRng.pick(
        Array(9)
          .fill(defaultLabel)
          .concat(
            contentLabels.filter((x) => String(x).trim().toLowerCase() !== String(defaultLabel).trim().toLowerCase()),
          ),
      );
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'header', 'margin']);
      const collide =
        !ctx.finish && collideRng.bool(0.3)
          ? collideRng.pick(
              contentLabels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase()),
            )
          : null;
      document.body.dataset.display = shownDisplay;
      document.body.dataset.endPlacement = placement || 'none';
      const shell = u.el('div', 'shell', document.body);
      const doc = u.el('section', 'doc', shell);
      const margin = u.el('aside', 'margin', shell);

      // document: masthead
      const head = u.el('header', 'masthead', doc);
      const logo = u.el('div', 'logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M9 31C13 24 18 19 27 10M17 22C16 11 24 8 33 6C34 17 27 24 17 22Z" fill="none" stroke="#f8f1e6" stroke-width="1.8" stroke-linecap="round"/><path d="M14 27C6 24 4 17 6 9C12 12 16 18 14 27ZM14 29C20 24 26 26 31 28C25 33 19 34 14 29Z" fill="#f8f1e6"/><path d="M20 21L24 12L29 10" fill="none" stroke="#f8f1e6" stroke-width="1.2"/></svg>';
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'Palette Studio');
      u.el('div', 'brand-tag', brand, 'Colors for a brighter tomorrow');
      const nav = u.el('nav', 'nav', head);
      NAV.forEach((label, i) => {
        if (i) u.el('span', 'nav-dot', nav, '·');
        const b = u.el('button', 'nav-item', nav, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      });
      const headerTools = u.el('div', 'header-tools', head);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'end-xtra collide' : 'end-xtra', parent, text);
        b.type = 'button';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        return b;
      };
      const endBtn = (parent, cls, text, link = false) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', String(label));
        b.title = String(label);
        b.onclick = (e) => {
          if (e) e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (collide && placement === 'header') decoyBtn(headerTools, collide, true);
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endBtn(headerTools, 'submit header-submit', label);
      u.el('h1', 'doc-title', doc, 'Color Picker');
      const stage = u.el('main', 'stage', doc);
      stage.dataset.role = 'stage';

      // document: foot (pointer presets and Reset are bound by the widget)
      const foot = u.el('footer', 'doc-foot', doc);
      const pres = u.el('div', 'presets', foot);
      u.el('div', 'sec-label', pres, 'Quick Presets');
      const row = u.el('div', 'preset-row', pres);
      for (const c of PRESETS) {
        const preset = u.el('button', 'preset', row);
        preset.type = 'button';
        preset.dataset.color = c;
        preset.setAttribute('aria-label', 'Choose ' + c);
        preset.style.background = c;
      }
      const actions = u.el('div', 'actions', foot);
      const reset = u.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.role = 'reset';
      if (collide && placement === 'footer') decoyBtn(actions, collide, true);
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = endBtn(actions, 'submit', label);
        }
      }

      // margin notes
      const note = u.el('section', 'task-note', margin);
      const instruction = u.el('div', 'instruction', note);
      const text = String(ctx.instruction || '');
      const m = text.match(/#[0-9a-fA-F]{6}|rgba?\([^)]*\)/i);
      if (m) {
        const at = text.indexOf(m[0]);
        instruction.append(document.createTextNode(text.slice(0, at)));
        u.el('span', m[0][0] === '#' ? 'hex-mark' : 'hex-mark rgb-mark', instruction, m[0]).style.background =
          'color-mix(in srgb, ' + m[0] + ' 55%, #f8f1e6)';
        instruction.append(document.createTextNode(text.slice(at + m[0].length)));
      } else instruction.textContent = text;
      if (shownDisplay === 'hidden') instruction.hidden = true;
      if (shownDisplay === 'panel') note.classList.add('instruction-panel');
      if (shownDisplay === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const how = u.el('section', 'how', margin);
      u.el('h2', 'margin-h', how, 'How to complete');
      const ol = u.el('ol', 'steps', how);
      for (const s of STEPS)
        u.el(
          'li',
          '',
          ol,
          s,
        );
      if (placement === 'margin') {
        const row = u.el('div', 'margin-actions', how);
        if (collide) decoyBtn(row, collide, true);
        submit = endBtn(row, 'end-link', String(label) + ' ›', true);
      }
      u.el('hr', 'margin-rule', margin);
      const target = u.el('section', 'margin-target', margin);
      target.dataset.role = 'target-slot';
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
        {
          cookie: 'Studio preferences',
          toast: 'Studio notice',
          chat: 'Studio help',
          promo: 'Palette reminder',
          banner: 'Studio notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored in this browser.',
          toast: 'The color picker is ready.',
          chat: 'Drag in the color area and the hue slider to match the target.',
          promo: 'Try the quick presets for inspiration.',
          banner: 'Palette Studio is running in standard mode.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
