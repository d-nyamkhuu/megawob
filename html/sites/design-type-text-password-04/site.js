(function () {
  'use strict';
  const C = { 'site': 'design-type-text-password-04', 'instruction': 'top' };
  const ICONS = {
    logo: '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="2" stroke-linejoin="round"><path d="M20 13C8 12 8 5 5 3c8-3 14-1 15 6 2-7 8-9 16-6-4 3-4 9-16 10z" fill="#429b1a"/><path d="m10 3 9 5m11-5-10 5" fill="none"/><g fill="#e31636"><ellipse cx="20" cy="17" rx="5" ry="5"/><ellipse cx="12" cy="19" rx="5" ry="5"/><ellipse cx="28" cy="19" rx="5" ry="5"/><ellipse cx="10" cy="26" rx="5" ry="5"/><ellipse cx="20" cy="25" rx="5" ry="5"/><ellipse cx="30" cy="26" rx="5" ry="5"/><ellipse cx="14" cy="32" rx="5" ry="5"/><ellipse cx="25" cy="32" rx="5" ry="5"/><ellipse cx="20" cy="37" rx="4" ry="3"/></g></g></svg>',
    apps: '<svg viewBox="0 0 40 40"><path d="M3 9h14l3 4h17v22H3z" fill="#e8b830" stroke="#222" stroke-width="2"/><path d="M5 13h30v6H5z" fill="#fff3a4" stroke="#555"/><path d="M3 18h35l-2 17H3z" fill="#f2d04a" stroke="#222" stroke-width="2"/><path d="M5 20h30" stroke="#fff8b9" stroke-width="2"/></svg>',
    discs:
      '<svg viewBox="0 0 40 40"><path d="M4 3h31v34H4z" fill="#3055c8" stroke="#111" stroke-width="2"/><rect x="10" y="3" width="19" height="13" fill="#ddd" stroke="#111" stroke-width="2"/><path d="M21 5h5v8h-5z" fill="#202634"/><rect x="9" y="21" width="22" height="16" fill="#eee" stroke="#111" stroke-width="2"/><path d="M14 23v12" stroke="#333"/><path d="M6 6v28" stroke="#9cb4ff"/></svg>',
    files:
      '<svg viewBox="0 0 40 40"><path d="M9 5h17l8 8v23H9z" fill="#aaa" stroke="#222" stroke-width="2"/><path d="M7 2h17l8 8v24H7z" fill="#f4f4f4" stroke="#222" stroke-width="2"/><path d="M24 2v8h8M11 14h17M11 19h17M11 24h17M11 29h13" fill="none" stroke="#222" stroke-width="1.6"/></svg>',
    settings:
      '<svg viewBox="0 0 40 40"><path d="m17 2 6 0 1 5 4 2 4-3 4 4-3 4 2 4 5 1v6l-5 1-2 4 3 4-4 4-4-3-4 2-1 5h-6l-1-5-4-2-4 3-4-4 3-4-2-4-5-1v-6l5-1 2-4-3-4 4-4 4 3 4-2z" transform="translate(1 0) scale(.92)" fill="#ddd" stroke="#111" stroke-width="2"/><circle cx="20" cy="20" r="7" fill="#aaa" stroke="#111" stroke-width="2"/><circle cx="20" cy="20" r="4" fill="#eee"/></svg>',
    help: '<svg viewBox="0 0 40 40"><path d="M11 3h19l7 7v20l-7 7H10l-7-7V10z" fill="#1a3fc0" stroke="#111" stroke-width="2"/><path d="M11 5h17l7 7" fill="none" stroke="#789bff" stroke-width="2"/><text x="20" y="30" font-size="32" font-weight="bold" text-anchor="middle" fill="#fff" font-family="monospace">?</text></svg>',
    doc: '<svg viewBox="0 0 40 50"><rect x="3" y="3" width="34" height="44" fill="#f4f4f4" stroke="#111" stroke-width="2.5"/><path d="M5 5v39M8 13h25M8 18h25M8 23h25M8 28h25M8 33h25M8 38h25M8 43h17" stroke="#444" stroke-width="1.5"/><rect x="8" y="8" width="4" height="3" fill="#263ca3" stroke="#111"/><path d="M16 9h16m-3 31v5h4" stroke="#222" stroke-width="2"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(endLabels));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'task', 'feedback']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endLabels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length)
          collide = { label: collideRng.pick(options), where: collideRng.pick(['task', 'feedback', 'footer']) };
      }
      const bar = u.el('header', 'ds-iconbar', document.body);
      [
        ['logo', 'RISC OS'],
        ['apps', 'Apps'],
        ['discs', 'Discs'],
        ['files', 'Files'],
        ['settings', 'Settings'],
        ['help', 'Help'],
      ].forEach((p) => {
        const it = u.el('span', 'ds-ib ds-ib-' + p[0], bar);
        const ic = u.el('i', 'ds-ic', it);
        ic.innerHTML = ICONS[p[0]];
        u.el('b', '', it, p[1]);
      });
      u.el('span', 'ds-clock', bar, 'Mon 27 Nov 1989    10:24');
      const win = u.el('div', 'ds-win', document.body);
      const title = u.el('div', 'ds-title', win);
      u.el('span', 'ds-tgad', title);
      u.el('span', 'ds-ttext', title, 'Password Utility');
      u.el('span', 'ds-close', title, '×');
      const wb = u.el('div', 'ds-wbody', win);
      const left = u.el('div', 'ds-left', wb);
      const mode = ctx.display;
      const task = u.el('section', 'ds-pane ds-task', left);
      const taskHead = u.el('h3', 'ds-ph', task, 'Task');
      const action = (parent, cls, label, role) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = role;
        b.addEventListener('click', () =>
          role === 'submit' ? ctx.submit() : env.log('decoy', { label, collide: true }),
        );
        return b;
      };
      const decoy = (where) => {
        if (!collide || collide.where !== where) return null;
        return action(
          where === 'task' ? taskHead : where === 'feedback' ? fbtools : foot,
          'ds-xtra',
          collide.label,
          'decoy',
        );
      };
      const tb = u.el('div', 'ds-tbody', task);
      u.el('i', 'ds-docicon', tb).innerHTML = ICONS.doc;
      if (mode === 'hidden') {
        u.el('div', 'ds-instruction ds-hiddenmsg', tb, '');
      } else if (mode !== 'toast') u.el('div', 'ds-instruction', tb, ctx.instruction);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', tb);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const setp = u.el('section', 'ds-pane ds-setp', left);
      u.el('h3', 'ds-ph', setp, 'Set Password');
      const stage = u.el('main', 'ds-stage', setp);
      const foot = u.el('footer', 'ds-footer', setp);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = action(foot, 'ds-btn ds-submit', endLabel, 'submit');
        else if (placement === 'task') submit = action(taskHead, 'ds-btn ds-submit ds-head-submit', endLabel, 'submit');
      }
      const cancel = u.el('button', 'ds-btn ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const fb = u.el('aside', 'ds-pane ds-fb', wb);
      u.el('h3', 'ds-ph ds-fbh', fb, 'Feedback');
      const fbb = u.el('div', 'ds-fbbody', fb);
      u.el('i', 'ds-info', fbb, 'i');
      const tx = u.el('div', 'ds-fbtext', fbb);
      u.el(
        'p',
        '',
        tx,
        'Enter the new password in both boxes.',
      );
      u.el('p', '', tx, 'The password must match exactly.');
      const fbtools = u.el('div', 'ds-fbtools', fb);
      if (!ctx.finish && placement === 'feedback')
        submit = action(fbtools, 'ds-btn ds-submit ds-panel-submit', endLabel, 'submit');
      if (collide) decoy(collide.where);
      u.el('div', 'ds-status', document.body);
      document.body.lastChild.remove();
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
