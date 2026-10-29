(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endLabels.filter((x) => x.toLowerCase() !== endLabel.toLowerCase()))
        : null;
      document.body.className = 'design metro';
      const shell = u.el('div', 'shell', document.body);
      const brief = u.el('aside', 'brief', shell);
      u.el('h1', 'brief-title', brief, 'Color Matching Task');
      const note = u.el('section', 'task-note', brief);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el(
        'p',
        'brief-copy',
        brief,
        'Use the controls on the right to adjust the color. Match the target color as closely as possible.',
      );
      u.el(
        'p',
        'brief-copy brief-after',
        brief,
        ctx.finish
          ? 'After matching the color, finish the task. You do not need to type anything.'
          : `After matching the color, click ${endLabel}. You do not need to type anything.`,
      );
      const win = u.el('div', 'win', shell);
      const title = u.el('header', 'title-bar', win);
      const icon = u.el('div', 'app-icon', title);
      for (let i = 0; i < 4; i++) u.el('i', '', icon);
      u.el('div', 'title', title, 'Color Studio');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'window-button' + (name === 'Close' ? ' close' : ''), controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('decoy', { label: name, what: 'window-control' });
      }
      const tabs = u.el('nav', 'tabs', win);
      const tabTask = u.el('button', 'tab', tabs, 'Task');
      const tabPrefs = u.el('button', 'tab on', tabs, 'Preferences');
      tabTask.type = 'button';
      tabPrefs.type = 'button';
      const br = u.el('div', 'tabs-fill', tabs);
      br.hidden = true;
      const tools = u.el('div', 'tab-tools', tabs);
      if (collide) {
        const decoy = u.el('button', 'end-xtra', tools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const body = u.el('div', 'win-body', win);
      const stage = u.el('main', 'stage', body);
      stage.dataset.role = 'stage';
      const prefs = u.el('section', 'prefs', body);
      u.el('h2', '', prefs, 'Preferences');
      u.el('p', 'prefs-sub', prefs, 'Customize the color picker and display settings.');
      const pc = u.el('div', 'prefs-cols', prefs);
      const c1 = u.el('div', '', pc);
      u.el('h3', '', c1, 'Color picker style');
      ['Hue / Saturation', 'Hue / Value', 'RGB Sliders'].forEach((t, i) => {
        const r = u.el('div', 'radio' + (i ? '' : ' on'), c1);
        u.el('span', 'dot', r);
        u.el('span', '', r, t);
      });
      u.el('h3', 'mt', c1, 'UI theme');
      u.el('div', 'fake-select', c1, 'Light');
      const ck = u.el('div', 'check', c1);
      u.el('span', 'box', ck, '✓');
      u.el('span', '', ck, 'Show color values (read-only)');
      const c2 = u.el('div', '', pc);
      u.el('h3', '', c2, 'Current color');
      const cur = u.el('div', 'cur', c2);
      u.el('div', 'cur-sw', cur);
      const cv = u.el('div', 'cur-vals', cur);
      [
        ['Hex', '#3A7BD5'],
        ['RGB', '58, 123, 213'],
        ['HSL', '217°, 68%, 53%'],
      ].forEach(([a, b]) => {
        const r = u.el('div', '', cv);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      });
      u.el('h3', 'mt2', c2, 'Hue / Saturation');
      const hs = u.el('div', 'hs', c2);
      u.el('div', 'hs-plane', hs).append(u.el('i', 'hs-ring'));
      u.el('div', 'hs-strip', hs).append(u.el('i', 'hs-thumb'));
      tabTask.onclick = () => {
        prefs.hidden = true;
        tabTask.classList.add('on');
        tabPrefs.classList.remove('on');
        env.log('tab', { name: 'Task' });
      };
      tabPrefs.onclick = () => {
        prefs.hidden = false;
        tabPrefs.classList.add('on');
        tabTask.classList.remove('on');
        env.log('tab', { name: 'Preferences' });
      };
      const footer = u.el('footer', 'footer', body);
      const difference = u.el('section', 'difference-section', footer);
      const delta = u.el('div', 'difference-value', difference, '—');
      delta.dataset.role = 'color-difference';
      const action = u.el('div', 'action-section', footer);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'link') footer.classList.add('footer-link');
        submit = u.el(
          'button',
          'submit' + (placement === 'toolbar' ? ' submit-toolbar' : placement === 'link' ? ' submit-link' : ''),
          placement === 'toolbar' ? tools : action,
        );
        u.el('span', '', submit, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      if (ctx.finish || placement === 'toolbar') action.hidden = true;
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
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
