(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endRng.bool(0.5) ? 'footer' : endRng.pick(['header', 'link']);
      const alternateEnds = endWords.map(endText).filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = endRng.bool(0.5) || !alternateEnds.length ? 'Submit' : endText(endRng.pick(alternateEnds));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(endWords.map(endText))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collision = collideRng.pick(choices);
      }
      document.body.className = 'design cdrom';
      const shell = u.el('div', 'shell', document.body);
      const scene = u.el('div', 'scene', shell);

      // left navigation rail
      const rail = u.el('nav', 'rail', scene);
      const disc = u.el('div', 'rail-brand', rail);
      u.el('div', 'cd', disc);
      u.el('div', 'rail-title', disc, 'World of Artworks CD-ROM');
      const svg = (inner) => '<svg viewBox="0 0 48 48" width="100%" height="100%">' + inner + '</svg>';
      const icons = [
        [
          'Home',
          svg(
            '<path d="M6 25 24 8l18 17" fill="#8a3b2a" stroke="#4a1c10" stroke-width="2"/><rect x="11" y="24" width="26" height="18" fill="#d9b779" stroke="#4a3210" stroke-width="2"/><rect x="21" y="30" width="7" height="12" fill="#6b3d1a"/><rect x="32" y="9" width="4" height="9" fill="#6b3d1a"/>',
          ),
        ],
        [
          'Gallery',
          svg(
            '<path d="M24 6c11 0 19 7 19 16 0 6-5 6-8 6-4 0-4 4-2 7 2 4-2 7-9 7C13 42 5 34 5 24 5 14 13 6 24 6z" fill="#d6a64e" stroke="#4a3210" stroke-width="2"/><circle cx="15" cy="20" r="3.5" fill="#c0392b"/><circle cx="24" cy="14" r="3.5" fill="#2e6fd0"/><circle cx="34" cy="18" r="3.5" fill="#2f9e44"/><circle cx="14" cy="31" r="3.5" fill="#f1d23a"/>',
          ),
        ],
        [
          'Reference',
          svg(
            '<path d="M4 12c7-3 13-3 20 1v28c-7-4-13-4-20-1z" fill="#efe3c0" stroke="#4a3210" stroke-width="2"/><path d="M44 12c-7-3-13-3-20 1v28c7-4 13-4 20-1z" fill="#e3d3a6" stroke="#4a3210" stroke-width="2"/><path d="M8 18c5-1 9-1 13 1M8 25c5-1 9-1 13 1M27 19c4-2 8-2 13-1M27 26c4-2 8-2 13-1" stroke="#7a6a48" fill="none"/>',
          ),
        ],
        [
          'Settings',
          svg(
            '<circle cx="24" cy="24" r="14" fill="none" stroke="#8a7f6c" stroke-width="9" stroke-dasharray="5.5 5.5"/><circle cx="24" cy="24" r="13" fill="#9d9380" stroke="#3a3426" stroke-width="2"/><circle cx="24" cy="24" r="6" fill="#222a78" stroke="#3a3426" stroke-width="2"/>',
          ),
        ],
        [
          'Help',
          svg(
            '<circle cx="24" cy="24" r="19" fill="#d6b987" stroke="#4a3210" stroke-width="2.5"/><text x="24" y="33" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-weight="700" fill="#2b2112">?</text>',
          ),
        ],
      ];
      for (const [label, glyph] of icons) {
        const b = u.el('button', 'rail-item', rail);
        b.type = 'button';
        u.el('span', 'rail-glyph', b).innerHTML = glyph;
        u.el('span', 'rail-label', b, label);
        b.onclick = () => env.log('menu', { label });
      }

      // the dialog frame
      const win = u.el('div', 'win', scene);
      const bar = u.el('header', 'win-title', win);
      u.el('div', 'win-name', bar, 'The Artist’s Companion');
      u.el('div', 'win-sub', bar, 'Colours for a brighter world');
      const wc = u.el('div', 'win-controls', bar);
      for (const [label, name] of [
        ['−', 'Minimize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'win-btn', wc, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const tabs = u.el('div', 'tabs', win);
      ['Pick Colour', 'Palettes', 'Harmony', 'Inspiration'].forEach((t, i) => {
        const b = u.el('button', 'tab' + (i === 0 ? ' on' : ''), tabs);
        u.el('span', '', b, t);
        b.type = 'button';
        b.onclick = () => env.log('tab', { label: t });
      });
      u.el('div', 'sheet', win);
      u.el('div', 'sheet-rule', win);

      // task note
      const note = u.el('section', 'task-note', scene);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        u.el('div', 'instruction-heading', note, 'Companion Note');
      }
      if (ctx.display === 'header') note.classList.add('instruction-header');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }

      const stage = u.el('main', 'stage', scene);
      stage.dataset.role = 'stage';

      // decorative backdrop
      const deco = u.el('div', 'deco', scene);
      u.el('div', 'globe', deco);
      u.el('div', 'pillars', deco, '████');
      u.el('div', 'motto', deco, 'EXPLORE\nLEARN\nCREATE');

      const footer = u.el('footer', 'footer', scene);
      const difference = u.el('div', 'difference-value', footer, '—');
      difference.dataset.role = 'color-difference';
      difference.hidden = true;
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? footer : placement === 'header' ? tabs : footer;
        const cls =
          placement === 'link' ? 'submit submit-link' : placement === 'header' ? 'submit submit-header' : 'submit';
        submit = u.el('button', cls, parent);
        u.el('span', '', submit, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
      }
      if (collision) {
        const decoy = u.el('button', 'xtra-end', scene, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
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
        {
          cookie: 'Preferences',
          toast: 'Notice',
          chat: 'Companion help',
          promo: 'Did you know?',
          banner: 'CD-ROM notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'The colour picker is ready.',
          chat: 'Adjust the hue strip and the colour square to match the target.',
          promo: 'Browse the gallery for more inspiration.',
          banner: 'Insert disc 2 for additional artworks.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
