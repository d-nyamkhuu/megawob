(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-dropdown-07',
    'brand': 'Task Manager',
    'title': 'Task Details',
    'menu': 'File|Edit|Task|Window|Help',
    'notes': 'Review latest figures\nbefore assigning.',
    'updated': 'Last updated:   Apr 23, 1999   10:14 AM',
  };
  const PIN =
    '<svg viewBox="0 0 90 96" width="100%" height="100%"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#ffffdf"/><stop offset="1" stop-color="#e7e2b4"/></linearGradient><radialGradient id="pin"><stop stop-color="#fff"/><stop offset=".25" stop-color="#ff6b51"/><stop offset=".6" stop-color="#f00"/><stop offset="1" stop-color="#9b0000"/></radialGradient></defs><g transform="rotate(-9 45 48)" stroke="#161616" stroke-width="2.4" stroke-linejoin="round"><path d="M9 18h68v75H9z" fill="#aaa783" opacity=".35" transform="translate(3 3)"/><path d="M6 16h68v74H6z" fill="#e8e4bf"/><path d="M12 10h67v65l6 10H12z" fill="url(#paper)"/><g stroke="#8a886b" stroke-width="1.8"><path d="M22 28h41M22 37h44M22 46h43M22 55h43M22 64h36M22 73h24"/></g></g><path d="M61 22L45 38" stroke="#171717" stroke-width="3"/><ellipse cx="59" cy="22" rx="9" ry="10" fill="url(#pin)" stroke="#111" stroke-width="2.3"/><path d="M61 17l8-11 7 7-10 11" fill="#e60000" stroke="#111" stroke-width="2"/><ellipse cx="70" cy="11" rx="8" ry="8" fill="url(#pin)" stroke="#111" stroke-width="2.3"/><path d="M67 6q-3 3-1 5M55 18q-2 3 0 5" stroke="white" stroke-width="2" fill="none"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const pickKind = endRng.pick(['classic', 'classic', 'toolbar', 'link']);
      const placement = ctx.finish ? null : pickKind === 'classic' ? 'footer' : pickKind;
      const alternatives = bank.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
      const endLabel =
        pickKind === 'classic' ? 'Submit' : labelOf(endRng.pick(alternatives.length ? alternatives : bank));
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = labelOf(collideRng.pick(choices));
      }
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1180) display = 'header';
      const tab = u.el('div', 'bt-tab', document.body);
      const ic = u.el('span', 'bt-tabicon', tab);
      ic.innerHTML = PIN;
      u.el('span', '', tab, C.brand);
      u.el('i', 'bt-tabx', tab, 'x');
      const logo = u.el('div', 'bt-logo', document.body);
      logo.append('Be');
      u.el('span', '', logo, 'O');
      logo.append('S');
      const win = u.el('div', 'bt-win', document.body);
      const menu = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', menu, t));
      const tools = u.el('div', 'bt-episode-tools', menu);
      const wb = u.el('div', 'bt-wbtns', menu);
      ['min', 'max', 'close'].forEach((t) => u.el('b', 'bt-window-' + t, wb));
      const body = u.el('div', 'ds-body', win);
      const left = u.el('div', 'bt-left', body);
      let note = null;
      if (display === 'header' || display === 'toast') {
        note = u.el('aside', display === 'toast' ? 'ds-toast' : 'ds-header-note', left);
        note.dataset.display = display;
        if (display !== 'toast') {
          const pi = u.el('span', 'bt-pin', note);
          pi.innerHTML = PIN;
        }
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const det = u.el('section', 'bt-details', left);
      u.el('h2', 'bt-tablabel', det, C.title);
      const stage = u.el('main', 'ds-stage', det);
      function st(cls, txt, pos) {
        const e = u.el('div', 'bt-s ' + cls, stage, txt);
        Object.keys(pos).forEach((k) => (e.style[k] = 'calc(var(--u)*' + pos[k] + ')'));
        return e;
      }
      st('bt-lbl', 'Title:', { left: 26, top: 70 });
      st('bt-inp', 'Prepare quarterly report', { left: 167, top: 65, width: 544, height: 44 });
      st('bt-lbl', 'Description:', { left: 26, top: 134 });
      const ta = st('bt-inp bt-ta', 'Gather revenue data, update charts, and prepare for review meeting.', {
        left: 167,
        top: 131,
        width: 568,
        height: 155,
      });
      u.el('i', 'bt-sb up', ta);
      u.el('i', 'bt-sb dn', ta);
      st('bt-lbl', 'Priority:', { left: 771, top: 140 });
      st('bt-lbl', 'Due Date:', { left: 771, top: 208 });
      st('bt-lbl', 'Status:', { left: 771, top: 298 });
      const sel = st('bt-inp bt-sel', 'Not Started', { left: 899, top: 294, width: 244, height: 38 });
      u.el('i', 'bt-chev', sel);
      st('bt-lbl', 'Attachments:', { left: 26, top: 316 });
      const al = st('bt-inp bt-att', '', { left: 26, top: 354, width: 530, height: 148 });
      [
        ['revenue-plan.pdf', 'pdf'],
        ['chart-draft.xlsx', 'xls'],
      ].forEach((a) => {
        const r = u.el('div', 'bt-file', al);
        u.el('i', 'bt-fi ' + a[1], r);
        u.el('span', '', r, a[0]);
      });
      ['Add...', 'Remove', 'Open'].forEach((t, i) => {
        st('bt-btn', t, { left: 581, top: 354 + i * 53, width: 148, height: 40 });
      });
      st('bt-rule', '', { left: 26, top: 536, right: 22 });
      const foot = u.el('footer', 'ds-footer', det);
      const cancel = u.el('button', 'ds-motif-action', foot, 'Cancel');
      cancel.type = 'button';
      const right = u.el('aside', 'bt-right' + (display === 'panel' ? ' bt-right-panel' : ''), body);
      if (display === 'panel') {
        u.el('h3', '', right, 'Task Instructions');
        u.el('div', 'bt-panel-instruction', right, ctx.instruction);
        u.el('h3', 'bt-notes-heading', right, 'Task Notes');
      } else u.el('h3', '', right, 'Task Notes');
      const nb = u.el('div', 'bt-notes', right, C.notes);
      u.el('i', 'bt-sb up', nb);
      u.el('i', 'bt-sb dn', nb);
      u.el('div', 'bt-upd', right, C.updated);
      const makeEnd = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const makeDecoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'bt-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'toolbar') submit = makeEnd(tools, 'ds-submit bt-toolbar-submit', endLabel, false);
        else if (placement === 'link') submit = makeEnd(foot, 'ds-end-link', endLabel + ' ›', true);
        else submit = makeEnd(foot, 'ds-submit', endLabel, false);
      }
      if (collide) {
        if (placement === 'toolbar') makeDecoy(foot);
        else makeDecoy(tools);
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
