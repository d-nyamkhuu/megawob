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
        'frame.header': () => function (_c) {
          const { util } = _c;
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
          Object.assign(_c, { header, kineticTools: tools });
        },
        'frame.nav': () => function () {},
        'frame.instruction': (base) => function (_c) {
          const { display, util } = _c;
          if (display === 'header' || display === 'hidden') {
            const help = util.el('div', 'kinetic-help', document.body);
            util.el('span', 'kinetic-info', help, 'i');
            const header = _c.header;
            _c.header = help;
            base(_c);
            _c.header = header;
            const note = help.querySelector('.ref-instruction');
            if (note) note.setAttribute('aria-live', 'polite');
            if (display === 'hidden') util.el('div', 'kinetic-help-text', help, 'Multiline fields support line breaks.');
          } else {
            base(_c);
          }
        },
        'frame.tools': (base) => function (_c) {
          const header = _c.header;
          _c.header = _c.kineticTools;
          base(_c);
          _c.header = header;
        },
        'frame.body': () => function (_c) {
          const { display, util } = _c;
          const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
          const workspace = el('div', `kinetic-workspace${display === 'panel' ? ' has-panel' : ''}`, document.body);
          const column = el('section', 'kinetic-content', workspace);
          const title = el('div', 'kinetic-title', column);
          el('span', '', title, 'BILLING INFORMATION');
          const stage = el('main', 'kinetic-stage', column);
          Object.assign(_c, { body: workspace, stage });
        },
        'frame.stage': () => function () {},
        'frame.panel': (base) => function (_c) {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('kinetic-panel');
            const info = _c.util.el('span', 'kinetic-info', null, 'i');
            panel.insertBefore(info, panel.firstChild);
          }
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            const dock = _c.util.el('div', 'kinetic-note-dock', document.body);
            dock.appendChild(note);
            note.classList.add('kinetic-toast');
            const info = _c.util.el('span', 'kinetic-info', null, 'i');
            note.insertBefore(info, note.firstChild);
          }
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.classList.add('kinetic-footer');
            foot.querySelector('.ref-foot-text').textContent = 'Ready';
          }
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
