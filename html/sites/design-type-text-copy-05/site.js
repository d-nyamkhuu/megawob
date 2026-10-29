// Kinetic Billing frame around the shared type-text task widget.
(function () {
  'use strict';
  env.site({
    name: 'design-type-text-copy-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        frame: (_base, S) => function (ctx) {
          const { util, rng, content } = ctx;
          const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
          document.body.classList.add('kinetic-page');
          const header = el('header', 'kinetic-header', document.body);
          const brand = el('div', 'kinetic-brand', header);
          el('span', '', brand, 'BILLING');
          const nav = el('nav', 'kinetic-tabs', header);
          ['INVOICES', 'CUSTOMERS', 'PAYMENTS', 'REPORTS', 'SETTINGS'].forEach((label, i) => {
            const tab = el('button', `kinetic-tab${i === 1 ? ' selected' : ''}`, nav);
            el('span', '', tab, label);
            tab.type = 'button';
            tab.addEventListener('click', () => env.log('decoy', { what: 'nav', label }));
          });
          const tools = el('div', 'kinetic-tools', header);
          el('span', 'kinetic-search', tools, '');
          const bell = el('span', 'kinetic-bell', tools);
          el('span', 'kinetic-unread', bell);
          el('span', 'kinetic-avatar', tools, 'JD');

          const display = ctx.display || 'header';
          if (display === 'header' || display === 'hidden') {
            const help = el('div', 'kinetic-help', document.body);
            el('span', 'kinetic-info', help, 'i');
            const note = el('div', display === 'header' ? 'kinetic-instruction' : 'kinetic-help-text', help,
              display === 'header' ? ctx.instruction : 'Multiline fields support line breaks.');
            if (display === 'header') note.setAttribute('aria-live', 'polite');
          }
          const workspace = el('div', `kinetic-workspace${display === 'panel' ? ' has-panel' : ''}`, document.body);
          const column = el('section', 'kinetic-content', workspace);
          const title = el('div', 'kinetic-title', column);
          el('span', '', title, 'BILLING INFORMATION');
          const stage = el('main', 'kinetic-stage', column);
          if (display === 'panel') {
            const panel = el('aside', 'kinetic-panel', workspace);
            el('span', 'kinetic-info', panel, 'i');
            el('div', '', panel, ctx.instruction);
          }
          let submit = null;
          let foot = null;
          const labelRng = rng.fork('chrome/end-label');
          const sampledLabel = content.endLabel(labelRng);
          const label = labelRng.bool(0.5) ? 'Apply' : sampledLabel;
          const { collide, cr } = S.frameCollide({ content, rng, util, word: null }, label);
          const extra = (parent, text, collides) => {
            const b = el('button', 'kinetic-secondary', parent, text);
            b.type = 'button';
            b.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
            return b;
          };
          if (!ctx.finish) {
            const placementRng = rng.fork('chrome/end');
            const place = placementRng.pick(['header', 'header', 'header', 'footer', 'link', 'icon']);
            const parent = place === 'footer' || place === 'link'
              ? (foot = el('footer', 'kinetic-footer', document.body))
              : tools;
            if (collide) extra(parent, collide.text, true);
            if (foot && cr.bool(0.35)) {
              const filler = content.decoyLabels(cr, 1)[0];
              if (filler) extra(parent, filler, false);
            }
            if (place === 'link') {
              submit = el('button', 'kinetic-submit kinetic-link', parent, `${label} ›`);
            } else {
              submit = el('button', `kinetic-submit${place === 'icon' ? ' icon-only' : ''}`, parent, place === 'icon' ? '✓' : label);
            }
            submit.type = 'button';
            submit.dataset.role = 'submit';
            submit.setAttribute('aria-label', label);
            submit.title = label;
            submit.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
          }
          if (display === 'toast') {
            const dock = el('div', 'kinetic-note-dock', document.body);
            if (foot) document.body.insertBefore(dock, foot);
            const toast = el('div', 'kinetic-toast', dock);
            el('span', 'kinetic-info', toast, 'i');
            el('div', '', toast, ctx.instruction);
            const close = el('button', '', toast, '×');
            close.type = 'button';
            close.setAttribute('aria-label', 'Close');
            close.addEventListener('click', () => { toast.remove(); env.log('note-close'); });
          }
          return { stage, submit };
        },
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'promo') {
            const box = result.el.querySelector('.ref-ov-box');
            const heading = ctx.util.el('h2', 'kinetic-promo-title', null, 'Stay in the loop');
            box.insertBefore(heading, box.firstChild);
            const input = ctx.util.el('input', 'kinetic-promo-input', null);
            input.placeholder = 'Your email address';
            input.setAttribute('aria-label', 'Your email address');
            box.insertBefore(input, box.querySelector('.ref-ov-row'));
            const close = ctx.util.el('button', 'kinetic-promo-close', box, '×');
            close.type = 'button';
            close.setAttribute('aria-label', 'Close');
            close.addEventListener('click', () => result.dismiss.click());
          }
          return result;
        },
      },
    },
  });
})();
