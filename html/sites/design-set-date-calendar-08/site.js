(function () {
  'use strict';
  const C = {
    site: 'design-set-date-calendar-08',
    menu: ['Desk', 'File', 'Edit', 'Record', 'Tools', 'Window', 'Help'],
    clock: 'Mon 14 Sep 1986   10:24',
  };
  const FLOPPY =
    '<svg width="46" height="46" viewBox="0 0 24 24"><path d="M2 2h17l3 3v17H2z" fill="#fff" stroke="#000" stroke-width="2"/><rect x="6" y="2" width="11" height="7" fill="#000"/><rect x="13" y="3.5" width="2.5" height="4" fill="#fff"/><rect x="5" y="13" width="14" height="9" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="7" y="19" width="2" height="2"/></svg>';
  const TRASH =
    '<svg width="42" height="46" viewBox="0 0 24 26"><rect x="3" y="3" width="18" height="3" fill="#fff" stroke="#000" stroke-width="2"/><path d="M5 7h14l-1 17H6z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M9 10v11M12 10v11M15 10v11" stroke="#000" stroke-width="1.5"/></svg>';
  const INFO =
    '<svg width="56" height="68" viewBox="0 0 28 34"><path d="M2 2h16l8 8v22H2z" fill="#ddd" stroke="#000" stroke-width="2.5"/><path d="M18 2v8h8" fill="#eee" stroke="#000" stroke-width="1.5"/><circle cx="14" cy="11" r="2.4"/><path d="M10 15h7v11h3v3h-10v-3h3v-8h-3z"/></svg>';
  const DOC =
    '<svg width="38" height="46" viewBox="0 0 24 30"><path d="M3 2h13l5 6v20H3z" fill="#ddd" stroke="#000" stroke-width="2"/><path d="M16 2v6h5M7 11h10M7 15h10M7 19h10M7 23h10" fill="none" stroke="#000" stroke-width="1.6"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const b = document.body;
      const W = window.innerWidth,
        H = window.innerHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && (W < 1260 || H < 700)) display = 'header';
      if (display === 'toast' && (W < 1260 || H < 700)) display = 'header';
      const er = ctx.rng.fork('chrome/end');
      const rawEnds = ctx.content && ctx.content.END_LABELS;
      const ends = (
        Array.isArray(rawEnds) && rawEnds.length
          ? rawEnds
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'title', 'toolbar']);
      const preferred = ends.find((x) => x.trim().toLowerCase() === 'submit') || ends[0];
      const alternatives = ends.filter((x) => x.trim().toLowerCase() !== preferred.trim().toLowerCase());
      const label = er.bool(0.75) || !alternatives.length ? preferred : er.pick(alternatives);
      const cr = ctx.rng.fork('chrome/collide');
      const collideOptions = [...new Set(ends)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = !ctx.finish && collideOptions.length && cr.bool(0.3) ? cr.pick(collideOptions) : null;
      const bar = u.el('header', 'gm-bar', b);
      const mn = u.el('nav', 'gm-menu', bar);
      C.menu.forEach((t) => u.el('span', '', mn, t));
      const clock = u.el('span', 'gm-clock', bar, C.clock);
      const sv = u.el('span', 'gm-save', bar);
      sv.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M2 2h17l3 3v17H2z" fill="#fff" stroke="#000" stroke-width="2.5"/><rect x="6" y="2" width="10" height="7" fill="#000"/><rect x="5" y="13" width="14" height="9" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>';
      const dk = u.el('div', 'gm-icon gm-disk', b);
      dk.innerHTML = FLOPPY;
      u.el('span', '', dk, 'DISK');
      const tr = u.el('div', 'gm-icon gm-trash', b);
      tr.innerHTML = TRASH;
      u.el('span', '', tr, 'TRASH');
      function win(cls, title, min) {
        const w = u.el('section', 'gm-win ' + cls, b);
        const t = u.el('div', 'gm-title', w);
        u.el('i', 'gm-gad gm-gl', t);
        u.el('span', 'gm-tt', t, title);
        if (min) u.el('i', 'gm-gad gm-gmin', t);
        u.el('i', 'gm-gad gm-gx', t);
        return u.el('div', 'gm-wbody', w);
      }
      const tb = win('gm-task', 'Task', false);
      tb.parentNode.hidden = display !== 'header';
      const ic = u.el('div', 'gm-info', tb);
      ic.innerHTML = INFO;
      if (display === 'header') u.el('div', 'ds-instruction', tb, ctx.instruction);
      let submit = null;
      const endBtn = (parent, cls) => {
        const e = u.el('button', cls, parent, label);
        e.type = 'button';
        e.dataset.role = 'submit';
        e.title = label;
        e.setAttribute('aria-label', label);
        e.addEventListener('click', () => ctx.submit());
        return e;
      };
      const decoyBtn = (parent, text) => {
        const e = u.el('button', 'ds-xtra', parent, text);
        e.type = 'button';
        e.dataset.role = 'xtra';
        e.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return e;
      };
      if (!ctx.finish && placement === 'toolbar') submit = endBtn(bar, 'ds-toolbar-end');
      const ab = win('gm-main', 'Adoption Records', true);
      const stage = u.el('main', 'ds-stage', ab);
      const foot = u.el('footer', 'ds-footer', ab);
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'ds-submit');
      if (!ctx.finish && placement === 'title') {
        const title = ab.parentNode.querySelector('.gm-title');
        submit = endBtn(title, 'ds-title-end');
        title.insertBefore(submit, title.querySelector('.gm-gmin') || title.querySelector('.gm-gx'));
      }
      if (ctx.finish) submit = null;
      if (collide) decoyBtn(foot, collide);
      const fb = win('gm-fb', 'Feedback', true);
      if (display === 'panel') {
        const note = u.el('section', 'ds-panel-note', fb);
        u.el('b', '', note, 'Task');
        u.el('div', '', note, ctx.instruction);
      }
      if (display === 'toast') {
        const note = u.el('div', 'ds-toast', b, ctx.instruction);
        note.setAttribute('role', 'note');
      }
      const hd = u.el('div', 'gm-fbh', fb);
      const d = u.el('span', '', hd);
      d.innerHTML = DOC;
      u.el('b', '', hd, 'Record Details');
      u.el('div', 'ds-reservation-values', fb);
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
