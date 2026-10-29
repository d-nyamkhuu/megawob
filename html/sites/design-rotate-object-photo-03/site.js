/* Academic hypertext photo editor frame. */
(function () {
  'use strict';
  function icon(parent, symbol) {
    const e = env.util.el('span', 'dock-icon', parent, symbol);
    e.setAttribute('aria-hidden', 'true');
    return e;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const box = u.el('section', 'notice overlay-' + ctx.kind, document.body);
    box.setAttribute('role', 'dialog');
    const c = u.el('button', 'notice-close', box, '×');
    c.type = 'button'; c.setAttribute('aria-label', 'Dismiss');
    c.onclick = () => ctx.dismiss('close');
    const titles = { cookie: 'Privacy notice', chat: 'Photo help', toast: 'Saved', promo: 'Photo tips', banner: 'Notice' };
    u.el('strong', '', box, titles[ctx.kind] || 'Notice');
    u.el('p', '', box, ctx.kind === 'chat' ? 'Need help rotating your photo? Drag the handle or use the controls.' : 'This photo editor works in your browser.');
    const dismiss = u.el('button', 'notice-dismiss', box, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el: box, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-photo-03', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'academic-photo display-' + ctx.display;
      const frame = u.el('div', 'app-frame', document.body);
      const content = u.el('div', 'content-area', frame);
      const editor = u.el('main', 'editor', content);
      const top = u.el('div', 'editor-toolbar', editor);
      const note = u.el('div', 'instruction', top, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel' || ctx.display === 'toast') note.hidden = true;
      const stage = u.el('section', 'photo-stage', editor);
      stage.dataset.role = 'stage';
      const controls = u.el('section', 'below-controls', editor);
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const placements = ['toolbar', 'toolbar', 'dock', 'link'];
        const where = r.pick(placements);
        const defaults = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : defaults;
        const raw = r.pick(labels);
        const label = typeof raw === 'string' ? raw : (raw.label || raw.text || raw.name || String(raw));
        const host = where === 'toolbar' ? top : where === 'dock' ? frame : controls;
        submit = u.el(where === 'link' ? 'a' : 'button', 'submit-button end-' + where, host, label);
        if (where === 'link') submit.href = '#'; else submit.type = 'button';
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', label); submit.title = label;
        submit.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(.3)) {
          const choices = labels.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x))).filter(x => x.toLowerCase() !== label.toLowerCase());
          if (choices.length) {
            const dlabel = cr.pick(choices), decoy = u.el('button', 'end-xtra', top, dlabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.onclick = () => env.log('decoy', { label: dlabel, collide: true });
          }
        }
      }
      const help = u.el('aside', 'help-panel', content);
      u.el('h2', '', help, 'Help');
      u.el('p', '', help, 'Drag the photo to rotate it to the desired orientation, or use the controls:');
      const list = u.el('ul', '', help);
      ['Drag the photo with the mouse.', 'Use the left and right arrow keys on your keyboard.', 'Click the 90° buttons to turn the photo quickly.', 'Use the Straighten slider for fine adjustments (−45° to 45°).'].forEach(t => u.el('li', '', list, t));
      u.el('h2', 'ruled-heading', help, 'Tips');
      const tips = u.el('ul', '', help);
      ['The angle readout shows the current rotation.', 'A level horizon looks natural in most photos.', 'You can also use the arrow keys for small changes (1° at a time).'].forEach(t => u.el('li', '', tips, t));
      u.el('h2', 'ruled-heading', help, 'Keyboard Shortcuts');
      const table = u.el('div', 'shortcut-table', help);
      [['Left arrow','Rotate left 1°'],['Right arrow','Rotate right 1°'],['Shift + Left arrow','Rotate left 5°'],['Shift + Right arrow','Rotate right 5°']].forEach(row => {
        const r = u.el('div', '', table); u.el('span', '', r, row[0]); u.el('span', '', r, row[1]);
      });
      if (ctx.display === 'panel') {
        const task = u.el('section', 'help-task', help); u.el('strong', '', task, 'Task'); u.el('div', '', task, ctx.instruction);
        help.prepend(task);
      }
      const dock = u.el('nav', 'bottom-dock', frame); dock.setAttribute('aria-label', 'Application navigation');
      [['⌂','Home'],['▰','Photos'],['🖉','Edit'],['▤','Print'],['◫','Help']].forEach((item, i) => {
        if (i) u.el('span', 'dock-divider', dock);
        const a = u.el('a', '', dock); a.href = '#'; a.onclick = e => e.preventDefault();
        icon(a, item[0]); u.el('span', '', a, item[1]);
      });
      if (submit && submit.classList.contains('end-dock')) dock.append(submit);
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'task-toast', frame, ctx.instruction);
        frame.insertBefore(toast, dock);
        const close = u.el('button', '', toast, '×'); close.type = 'button'; close.onclick = () => { toast.style.visibility = 'hidden'; };
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
