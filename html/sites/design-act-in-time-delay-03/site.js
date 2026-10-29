(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        r = ctx.rng.fork('chrome/utility');
      const header = u.el('header', 'ds-top', document.body);
      const mark = u.el('div', 'ds-mark', header);
      mark.innerHTML =
        '<svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 31C15 18 25 9 34 9c0 12-7 23-19 25m1-3c4-7 9-12 15-17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 34l-3 3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      const brand = u.el('div', 'ds-brand', header);
      u.el('strong', '', brand, 'Evergreen Studio');
      u.el('small', '', brand, 'v1.4.2');
      const nav = u.el('nav', 'ds-nav', header);
      ['Refine', 'Adjust', 'Finish'].forEach((x, i) => {
        if (i) u.el('i', '', nav, '•');
        u.el('span', '', nav, x);
      });
      u.el('div', 'ds-window', header, '−　□　×');
      let display = ctx.display || 'header';
      if (display === 'toast' && document.documentElement.clientHeight < 700) display = 'header';
      const note = (parent, cls) => {
        const n = u.el('div', cls, parent);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        return n;
      };
      if (display === 'header') note(document.body, 'ds-header-note');
      const workspace = u.el('div', 'ds-workspace', document.body);
      const stage = u.el('main', 'ds-stage', workspace);
      const panel = u.el('aside', 'ds-adjustments', workspace);
      if (display === 'panel') {
        const n = note(panel, 'ds-panel-note');
        n.setAttribute('aria-label', 'Task instructions');
      }
      u.el('h2', '', panel, 'Image Adjustments');
      [
        ['Brightness', '−'],
        ['Contrast', '−'],
        ['Saturation', '−'],
        ['Warmth', '−'],
      ].forEach(([label]) => {
        const row = u.el('div', 'ds-adjust-row', panel);
        u.el('span', '', row, label);
        const track = u.el('span', 'ds-track', row);
        u.el('i', '', track);
        u.el('b', '', row, '0');
      });
      u.el('div', 'ds-rule', panel);
      const filter = u.el('div', 'ds-filter', panel);
      u.el('span', '', filter, 'Filter');
      u.el('span', 'ds-filter-value', filter, 'None　▾');
      u.el('div', 'ds-rule', panel);
      const preview = u.el('div', 'ds-preview', panel);
      u.el('b', '', preview, 'Preview');
      u.el('span', 'ds-check', preview, '✓');
      u.el('span', '', preview, 'Show changes in real time');
      if (display === 'toast') {
        const toast = note(document.body, 'ds-toast');
        const x = u.el('button', 'ds-toast-x', toast, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Dismiss instructions');
        x.onclick = () => {
          toast.style.visibility = 'hidden';
        };
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const meta = u.el('div', 'ds-filemeta', foot);
      u.el('span', '', meta, 'File:　mountain.jpg');
      u.el('span', '', meta, 'Size:　1920 × 1080');
      u.el('span', '', meta, 'Zoom:　100%');
      const status = u.el('div', 'ds-status', foot);
      u.el('span', 'ds-clockicon', status, '◷');
      const st = u.el('div', '', status);
      u.el('strong', '', st, 'Status:　Waiting...');
      u.el('small', '', st, 'The action button will be enabled on the task clock.');
      u.el('small', '', st, 'Please do not click it before then.');
      const controls = u.el('div', 'ds-footer-actions', foot);
      let submit = null;
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const endLabels = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || 'Submit'));
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const referenceEnd = er.bool(0.5);
      const label = referenceEnd ? 'Submit' : String(er.pick(endLabels));
      const place = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const options = endLabels.filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
      const decoy = cr.bool(0.3) && options.length ? String(cr.pick(options)) : null;
      let top = null;
      const headerTools = () => {
        if (!top) {
          top = u.el('div', 'ds-header-action', header);
          header.classList.add('ds-top-has-tools');
        }
        return top;
      };
      if (decoy) {
        const d = u.el('button', 'ds-xtra', headerTools(), decoy);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: decoy, collide: true });
      }
      if (!ctx.finish) {
        // Preserve the original utility stream, including its conditional draws.
        const oldLabel = String(r.bool(0.5) ? 'Submit' : r.pick(endLabels));
        r.pick(['footer', 'footer', 'header', 'link']);
        if (r.bool(0.3))
          r.pick(
            labels
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || 'Done'))
              .filter((x) => String(x).toLowerCase() !== oldLabel.toLowerCase()),
          );
        const button = (parent, cls, text) => {
          const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (place === 'header') {
          submit = button(headerTools(), 'ds-submit', label);
        } else {
          submit =
            place === 'link' ? button(controls, 'ds-endlink', label + ' ›') : button(controls, 'ds-submit', label);
        }
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
