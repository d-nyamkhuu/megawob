// GEM desktop design: monochrome email, custom form frame, and viewport-aware fitting.
(function () {
  'use strict';

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-email-03',
    name: 'design',
    split: 'train',
    scenarios: ['email'],
    template: 'fill-form/document',
    design: {
      fitStart: 21,
      fitReserve: 12,
      parts: {
        renderEmail: () => (util, pane, d, rng) => {
          if (d.style !== 'plain') rng.pick([
            ['Reply', 'Forward', 'Archive'], ['Reply all', 'Forward', 'Delete'], ['Inbox', 'Reply', 'Mark unread'],
          ]);
          const message = util.el('div', 'gem-message', pane);
          const header = util.el('div', 'gem-mailhead', message);
          for (const [label, value] of [
            ['From:', `${d.from.name} <${d.from.addr}>`], ['To:', d.to], ['Subject:', d.subject], ['Date:', d.date],
          ]) {
            util.el('span', '', header, label);
            util.el('span', '', header, value);
          }
          const body = util.el('div', 'gem-mailtext', message);
          util.el('p', '', body, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', body, p);
          util.el('p', 'sig', body, d.signature.join('\n'));
          return message;
        },
        rootReady: (base, S) => (ctx, R) => {
          base(ctx, R);
          R.root.style.setProperty('--gem-font', Math.min(27, ctx.size.width / 55) + 'px');
          R.root.style.setProperty('--gem-title', Math.min(27, ctx.size.width / 55) + 'px');
          R.root.style.setProperty('--gem-gap', Math.min(30, ctx.size.height / 25) + 'px');
        },
        beforeForm: () => (ctx, R) => {
          const util = ctx.util;
          const title = util.el('div', 'gem-formtitle', R.formPane);
          util.el('i', 'gem-box', title);
          util.el('span', '', title, 'Customer Information Form');
          util.el('i', 'gem-box r', title);
          const note = ctx.display === 'panel' ? null : ctx.stage.parentElement.querySelector('.ds-brief');
          if (note) R.formPane.append(note);
          R.gemTitle = title;
          R.gemNote = note;
        },
        arranged: (base, S) => (ctx, R) => {
          base(ctx, R);
          const { util } = ctx;
          const footer = document.querySelector('.ds-footer');
          R.gemFooter = footer;
          if (!footer) return;
          (ctx.spec.layout.tabs ? R.root : R.formPane).append(footer);
          const clear = util.el('button', 'gem-clearall', footer, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => {
            const fields = {};
            for (const f of ctx.spec.fields) fields[f.id] = f.kind === 'checkbox' ? false : '';
            for (const checkbox of R.formPane.querySelectorAll('input[type=checkbox]:checked')) checkbox.click();
            ctx.update({ ...ctx.model, fields, open: null });
            for (const x of Object.values(S.el)) {
              if (x.input) {
                x.input.value = '';
                x.input.parentElement.classList.remove('filled');
              }
              if (x.dd) {
                x.dd.classList.remove('open');
                const val = x.dd.querySelector('.ff-ddval');
                val.textContent = 'Select…';
                val.classList.add('empty');
                for (const o of Object.values(x.opts)) o.classList.remove('sel');
              }
            }
            for (const radio of R.formPane.querySelectorAll('input[type=radio]')) radio.checked = false;
          });
        },
        fit: (base) => (ctx, R) => {
          const { root, formPane, docPane } = R;
          const message = docPane.querySelector('.gem-message');
          if (message) {
            let size = Math.min(27, ctx.size.width / 55);
            for (; size > 11; size -= 0.5) {
              message.style.fontSize = size + 'px';
              if (message.scrollHeight <= docPane.clientHeight - 2) break;
            }
          }
          const form = formPane.querySelector('.ff-form');
          if (form) {
            const count = ctx.spec.fields.length;
            root.style.setProperty('--gem-gap', Math.min(count > 5 ? 18 : 30, ctx.size.height / (count > 5 ? 40 : 25)) + 'px');
            const available = formPane.clientHeight - R.gemTitle.offsetHeight -
              (R.gemNote ? R.gemNote.offsetHeight + 24 : 0) -
              (R.gemFooter && formPane.contains(R.gemFooter) ? R.gemFooter.offsetHeight : 0) - 55;
            form.style.fontSize = Math.min(27, ctx.size.width / 55, Math.max(13, available / (count * 2.3))) + 'px';
            const grid = form.querySelector('.ff-grid');
            const padding = parseFloat(getComputedStyle(form).paddingTop) + parseFloat(getComputedStyle(form).paddingBottom);
            let font = parseFloat(form.style.fontSize);
            const gap = parseFloat(getComputedStyle(grid).rowGap);
            const initial = font;
            while (font > 10.5 && grid.scrollHeight > form.clientHeight - padding) {
              font -= 0.5;
              form.style.fontSize = font + 'px';
              grid.style.setProperty('gap', Math.max(4, gap * font / initial) + 'px', 'important');
            }
          }
          base(ctx, R);
        },
      },
    },
  });
})();
