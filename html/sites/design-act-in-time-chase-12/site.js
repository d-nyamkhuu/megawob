(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-12' };
  const ICONS = {
    floppy:
      '<path d="M7 3H45L53 11V54H7Z" fill="#ddd" stroke="#080808" stroke-width="3"/><path d="M12 4H45V27H12Z" fill="#080808"/><path d="M20 5H39V23H20Z" fill="#eee"/><path d="M31 8H36V19H31Z" fill="#080808"/><path d="M12 33H47V50H12Z" fill="#ccc"/><path d="M20 37H39M20 41H35" stroke="#777" stroke-width="2"/><path d="M9 52H50" stroke="#f3f3f3" stroke-width="2"/>',
    folder:
      '<path d="M2 15V7H20L26 12H61V57H2Z" fill="#bcbcbc" stroke="#080808" stroke-width="3"/><path d="M3 17H60" stroke="#080808" stroke-width="3"/><path d="M5 20H58M5 20V54" stroke="#e8e8e8" stroke-width="2"/>',
    trash:
      '<path d="M15 17H47V59L42 62H20L15 58Z" fill="#ccc" stroke="#080808" stroke-width="3"/><path d="M12 13L22 9H40L50 13V19L40 23H23L12 19Z" fill="#ccc" stroke="#080808" stroke-width="3"/><path d="M24 10V5H39V10" fill="#aaa" stroke="#080808" stroke-width="3"/><path d="M21 27V56M26 27V58M31 27V58M36 27V58M41 26V56" stroke="#888" stroke-width="2"/><path d="M18 26V56M45 24V56" stroke="#eee" stroke-width="2"/>',
  };
  function desktopIcon(u, parent, kind) {
    const svg = u.svg(
      'svg',
      { class: 'ds-pixel-icon ds-pixel-' + kind, viewBox: '0 0 64 66', 'aria-hidden': 'true' },
      parent,
    );
    svg.innerHTML = ICONS[kind];
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      ['Desk', 'File', 'Edit', 'Options', 'Window', 'Help'].forEach((t) => u.el('span', '', top, t));
      u.el('time', 'ds-date', top, 'Mon 27 Jan 1986  10:14 AM');
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      [
        ['floppy', 'Floppy Disk'],
        ['folder', 'Work'],
        ['folder', 'Utilities'],
        ['trash', 'Trash'],
      ].forEach(([i, t]) => {
        const item = u.el('div', 'ds-desktop-icon', rail);
        desktopIcon(u, item, i);
        u.el('span', '', item, t);
      });
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const classic = endR.bool(0.5);
      const placement = classic ? 'preferences' : endR.pick(['preferences-head', 'task-toolbar']);
      const endLabel = classic ? 'Submit' : endR.pick(endLabels);
      const collideR = ctx.rng.fork('chrome/collide');
      const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideR.bool(0.3) && alternatives.length ? collideR.pick(alternatives) : null;
      const content = u.el('div', 'ds-content', body);
      u.el('div', 'ds-titlebar', content, 'Pointer Trainer');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content),
        stage = u.el('main', 'ds-stage', main);
      if (mode === 'left' || mode === 'right') briefing(main, 'ds-brief');
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const task = u.el('section', 'ds-task-controls', content);
      const taskHead = u.el('div', 'ds-section-head', task);
      u.el('b', 'ds-triangle', taskHead, '▶');
      u.el('strong', '', taskHead, 'Task controls');
      u.el('span', 'ds-collapsed', taskHead, '(collapsed)');
      const reveal = u.el('button', 'ds-show-controls', taskHead, 'Show controls');
      reveal.type = 'button';
      const taskBody = u.el(
        'div',
        'ds-task-body',
        task,
        'Move the pointer over the moving circle and keep it inside for the required time.',
      );
      taskBody.hidden = true;
      reveal.addEventListener('click', () => {
        const open = taskBody.hidden;
        taskBody.hidden = !open;
        reveal.textContent = open ? 'Hide controls' : 'Show controls';
        taskHead.querySelector('.ds-triangle').textContent = open ? '▼' : '▶';
        taskHead.querySelector('.ds-collapsed').textContent = open ? '(expanded)' : '(collapsed)';
      });
      const pref = u.el('section', 'ds-preferences', content),
        prefHead = u.el('div', 'ds-pref-head', pref);
      u.el('span', 'ds-triangle', prefHead, '▼');
      u.el('strong', '', prefHead, 'Preferences');
      const prefBody = u.el('div', 'ds-pref-body', pref),
        speed = u.el('div', 'ds-speed', prefBody);
      u.el('span', '', speed, 'Circle speed:');
      const range = u.el('div', 'ds-range', speed);
      range.setAttribute('aria-hidden', 'true');
      u.el('i', '', range);
      u.el('span', '', speed, 'Medium');
      const bg = u.el('div', 'ds-background', prefBody);
      u.el('span', '', bg, 'Background:');
      u.el('span', 'ds-radio selected', bg, 'Plain');
      u.el('span', 'ds-radio', bg, 'Grid');
      const checks = u.el('div', 'ds-checks', prefBody);
      [
        ['☑', 'Show elapsed time'],
        ['☑', 'Show dwell counter'],
        ['□', 'Play sound on success'],
      ].forEach(([i, t]) => {
        const row = u.el('div', '', checks);
        u.el('b', '', row, i);
        u.el('span', '', row, t);
      });
      const action = u.el('div', 'ds-action', prefBody);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'preferences' ? action : placement === 'preferences-head' ? prefHead : taskHead;
        submit = u.el(
          'button',
          placement === 'preferences' ? 'ds-submit' : 'ds-submit ds-end-compact',
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
        if (placement === 'task-toolbar') taskHead.insertBefore(submit, reveal);
      }
      if (ctx.finish || placement !== 'preferences') {
        action.classList.add('ds-inactive');
        u.el('span', 'ds-device-note', action, 'Mouse only');
      }
      if (collide) {
        const parent = placement === 'preferences-head' && !ctx.finish ? taskHead : prefHead;
        const decoy = u.el('button', 'ds-xtra', parent, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        if (parent === taskHead) taskHead.insertBefore(decoy, reveal);
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
