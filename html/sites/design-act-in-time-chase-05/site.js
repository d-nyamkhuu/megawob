(function () {
  'use strict';
  const C = { site: 'design-act-in-time-chase-05' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'FocusPad');
      const menu = u.el('nav', 'ds-menu', top);
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const shell = u.el('div', 'ds-shell', document.body);
      const tabs = u.el('nav', 'ds-tabs', shell);
      [
        ['Tasks', 'orange'],
        ['Notes', 'cream'],
        ['Journal', 'blue'],
        ['Sketches', 'green'],
        ['Archive', 'mauve'],
      ].forEach(([name, color], i) => {
        const t = u.el('div', 'ds-tab ds-tab-' + color + (i === 0 ? ' active' : ''), tabs, name);
        t.setAttribute('aria-current', i === 0 ? 'page' : 'false');
      });
      const paper = u.el('section', 'ds-paper', shell);
      const head = u.el('div', 'ds-paper-head', paper);
      u.el('span', '', head, 'Task 1');
      u.el('span', '', head, 'Apr 24, 2018');
      const natural =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      paper.dataset.display = natural;
      const endR = ctx.rng.fork('chrome/end'),
        labelR = ctx.rng.fork('chrome/end-label'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const refControl = labelR.bool(0.5);
      const alternatives = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const label = refControl ? 'Submit' : alternatives[labelR.int(0, alternatives.length - 1)] || 'Done';
      const placement = ctx.finish ? null : refControl ? 'footer' : endR.pick(['footer', 'toolbar', 'link']);
      const other = labels.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
      const collideLabel = collideR.bool(0.3) && other.length ? other[collideR.int(0, other.length - 1)] : null;
      const collideWhere = collideLabel ? collideR.pick(['toolbar', 'footer']) : null;
      if (natural === 'header') {
        const note = u.el('div', 'ds-instruction-row', paper);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const headControls =
        placement === 'toolbar' || placement === 'link' || (collideLabel && collideWhere === 'toolbar')
          ? u.el('div', 'ds-head-controls', head)
          : null;
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (collideLabel && collideWhere === 'toolbar') addDecoy(headControls, collideLabel);
      let submit = null;
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'toolbar') submit = makeSubmit(headControls, 'ds-submit ds-toolbar-submit');
      if (placement === 'link') submit = makeSubmit(headControls, 'ds-submit ds-link-submit');
      const main = u.el('div', 'ds-main', paper);
      const brief = u.el('aside', 'ds-brief', main);
      if (natural === 'panel') {
        const panel = u.el('section', 'ds-note-panel', brief);
        u.el('div', 'ds-note-title', panel, 'Task notes');
        u.el('div', 'ds-note-copy', panel, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', brief);
      if (collideLabel && collideWhere === 'footer') addDecoy(foot, collideLabel);
      if (placement === 'footer') submit = makeSubmit(foot, 'ds-submit');
      if (natural === 'toast') {
        const note = u.el('div', 'ds-toast', paper);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (!submit && !ctx.finish) {
        foot.setAttribute('role', 'button');
        foot.tabIndex = 0;
        foot.setAttribute('aria-label', label);
        foot.dataset.role = 'end-control';
        u.el('span', 'ds-end-fallback', foot, label);
        foot.addEventListener('click', () => ctx.submit());
        foot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            ctx.submit();
          }
        });
        submit = foot;
      }
      return { stage, submit: ctx.finish ? null : submit };
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
