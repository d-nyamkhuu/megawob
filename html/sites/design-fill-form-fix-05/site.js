// Design on templates/site/form-fill-receipt-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-fill-form-fix-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/fill-form-receipt-03',
    design: {
      C: {"site": "design-fill-form-fix-05", "brand": "Document to Form", "title": "Customer Booking", "instruction": "header", "rail": "", "menu": ""},
      parts: {
        overlay: (base) => (ctx) => {
          const result = base(ctx);
          if (result && result.el) result.el.classList.add('breeze-overlay');
          return result;
        },
        frame: (base) => (ctx) => {
          const result = base(ctx);
          const { util } = ctx;
          const stage = result.stage;
          const submit = result.submit;
          const extras = [...document.querySelectorAll('[data-role="xtra"], .ds-xtra')];
          const topEnd = submit && /ribbon|toolbar|header/.test(submit.parentElement.className);
          const iconEnd = submit && /icon/.test(submit.className);
          const old = [...document.body.children].filter(n => !['SCRIPT', 'STYLE', 'LINK'].includes(n.tagName));
          const shell = util.el('div', 'breeze-shell', document.body);
          const width = shell.clientWidth || 1672;
          shell.style.setProperty('--s', String(Math.max(.61, width / 1672)));
          const svg = (parent, name) => {
            const paths = {
              document: '<path d="M6 2h12l7 7v23H6z M18 2v8h7 M10 15h11 M10 20h11 M10 25h8"/>',
              form: '<path d="m5 25-2 8 8-3L29 9l-6-6z M20 6l6 6 M5 25l6 5"/>',
              data: '<ellipse cx="16" cy="7" rx="12" ry="5"/><path d="M4 7v21c0 7 24 7 24 0V7 M4 14c0 7 24 7 24 0 M4 21c0 7 24 7 24 0"/>',
              help: '<circle cx="17" cy="17" r="15"/><path d="M12 12c0-7 12-7 12 0 0 5-7 4-7 10 M17 26v2"/>',
              reply: '<path d="m14 8-9 9 9 9 M6 17h13c8 0 10 4 10 11"/>',
              all: '<path d="m11 8-9 9 9 9 M20 8l-9 9 9 9 M12 17h10c7 0 9 5 9 11"/>',
              forward: '<path d="M3 17h25 M20 8l9 9-9 9"/>',
              delete: '<path d="M8 10h19 M12 10V5h11v5 M10 10l1 21h14l1-21 M15 14v12 M21 14v12"/>',
            };
            const span = util.el('span', 'breeze-icon', parent);
            span.innerHTML = '<svg viewBox="0 0 34 36" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' + paths[name] + '</svg>';
          };
          const title = util.el('div', 'breeze-title', shell);
          svg(title, 'document');
          util.el('span', '', title, 'Document to Form');
          util.el('span', 'breeze-window-actions', title, '—　 □　 ×');
          const body = util.el('div', 'breeze-body', shell);
          const rail = util.el('nav', 'breeze-rail', body);
          for (const [name, label] of [['document','Documents'],['form','Form'],['data','Data'],['help','Help']]) {
            const b = util.el('button', 'breeze-nav' + (name === 'document' ? ' selected' : ''), rail);
            b.type = 'button'; svg(b, name); util.el('span', '', b, label);
            b.addEventListener('click', () => env.log('decoy', {label}));
          }
          const center = util.el('div', 'breeze-center', body);
          let display = ctx.display;
          if (width < 1260 && (display === 'panel' || display === 'toast')) display = 'header';
          const workspace = util.el('div', 'breeze-workspace', center);
          if (display === 'panel') {
            const note = util.el('aside', 'breeze-note panel-note', workspace);
            util.el('strong', '', note, 'Task'); util.el('p', '', note, ctx.instruction);
          }
          const main = util.el('div', 'breeze-main', workspace);
          const toolbar = util.el('div', 'breeze-toolbar', main);
          const actions = util.el('div', 'breeze-mail-actions', toolbar);
          for (const [name,label] of [['reply','Reply'],['all','Reply All'],['forward','Forward'],['delete','Delete']]) {
            const b = util.el('button', 'breeze-tool', actions); b.type = 'button'; svg(b,name); util.el('span','',b,label);
            b.addEventListener('click', () => env.log('decoy', {label}));
          }
          if (display === 'header') util.el('div', 'breeze-note header-note', toolbar, ctx.instruction);
          else util.el('div', 'breeze-form-title', toolbar, 'Customer Booking');
          const tools = util.el('div', 'breeze-end-tools', toolbar);
          extras.forEach(n => tools.appendChild(n));
          if (submit && (topEnd || iconEnd)) tools.appendChild(submit);
          main.appendChild(stage); stage.classList.add('breeze-stage');
          if (display === 'toast') util.el('div', 'breeze-note toast-note', center, ctx.instruction);
          const tips = util.el('div', 'breeze-tips', shell);
          util.el('span', 'breeze-info', tips, 'i');
          util.el('span', 'breeze-tips-title', tips, 'Field tips');
          for (const text of ['Enter the customer’s details from the document into the form.', 'If a field is not mentioned in the document, leave it blank.', 'Dates should be entered in the format DD/MM/YYYY.']) util.el('span', 'breeze-tip', tips, text);
          if (submit && !topEnd && !iconEnd) {
            const footer = util.el('div', 'breeze-footer', shell); footer.appendChild(submit);
          }
          old.forEach(n => { if (n !== stage && !shell.contains(n)) n.remove(); });
          return result;
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
      },
    },
  });
})();
