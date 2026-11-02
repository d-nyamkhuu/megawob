// Adds the email metadata layout, primary field marks, pane icons, and the page's Clear and fit behavior.
(function () {
  'use strict';

  const EMAIL_ICON = '<svg viewBox="0 0 40 40" fill="none"><defs><linearGradient id="envelopeGloss" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a9defb"/></linearGradient></defs><rect x="3" y="7" width="34" height="26" rx="2" fill="url(#envelopeGloss)" stroke="#2087d4" stroke-width="2.5"/><path d="M4 9L20 22L36 9" fill="#d1edff" stroke="#499ede" stroke-width="3"/><path d="M4 31L15 20M36 31L25 20" stroke="#7cbfe7" stroke-width="2"/></svg>';
  const FORM_ICON = '<svg viewBox="0 0 40 40" fill="none" stroke="#2786d4" stroke-width="2.2" stroke-linejoin="round"><path d="M8 4H24L33 13V35H8Z" fill="#ecf8ff"/><path d="M24 4V13H33M13 14H20M13 20H28M13 25H28M13 30H28"/></svg>';

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-email-10',
    name: 'design',
    split: 'train',
    scenarios: ['email'],
    template: 'fill-form/document',
    design: {
      parts: {
        showList: (base) => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          const r = btn.getBoundingClientRect();
          const pane = dd.closest('.ff-formpane').getBoundingClientRect();
          const footer = document.querySelector('.ds-footer');
          const end = footer && footer.getBoundingClientRect();
          const top = Math.max(6, pane.top + 54);
          const bottom = Math.min(window.innerHeight - 6, pane.bottom - 6,
            end && r.left < end.right && r.right > end.left ? end.top - 8 : pane.bottom - 6);
          const above = Math.max(0, r.top - top - 4);
          const below = Math.max(0, bottom - r.bottom - 4);
          list.style.fontSize = '';
          const room = Math.max(above, below);
          const height = list.offsetHeight;
          if (height > room) list.style.fontSize = parseFloat(getComputedStyle(list).fontSize) * room / height + 'px';
          if (list.offsetHeight > below && above > below) dd.classList.add('up');
        },
        fieldWrap: () => (f, wrap) => {
          if (/^(first name|last name|company|organization|employer|e-?mail)$/i.test(f.label)) wrap.classList.add('ff-primary');
        },
        renderEmail: (base) => (util, pane, d, rng) => {
          const tools = d.style !== 'plain' ? rng.pick([
            ['Reply', 'Forward', 'Archive'],
            ['Reply all', 'Forward', 'Delete'],
            ['Inbox', 'Reply', 'Mark unread'],
          ]) : null;
          if (d.style === 'plain') {
            const box = util.el('div', 'ff-plainmail ff-paper', pane);
            util.el('div', 'ff-mailsubj', box, d.subject);
            const meta = util.el('div', 'ff-mailmeta', box);
            for (const [label, value] of [['From:', `${d.from.name} <${d.from.addr}>`], ['To:', d.to], ['Date:', d.date]]) {
              util.el('span', 'ff-metalabel', meta, label);
              util.el('span', '', meta, value);
            }
            util.el('hr', '', box);
            util.el('p', '', box, d.greeting);
            for (const p of d.paragraphs) util.el('p', '', box, p);
            util.el('p', '', box, d.signature.join('\n')).style.marginBottom = '0';
            return box;
          }
          const box = util.el('div', 'ff-mail', pane);
          const bar = util.el('div', 'ff-mailbar', box);
          for (const label of tools) util.el('span', '', bar, label);
          util.el('div', 'ff-mailsubj', box, d.subject);
          const from = util.el('div', 'ff-mailfrom', box);
          util.el('div', 'ff-avatar', from, d.initials);
          const who = util.el('div', 'ff-mailmeta', from);
          for (const [label, value] of [['From:', `${d.from.name} <${d.from.addr}>`], ['To:', d.to], ['Date:', d.date]]) {
            util.el('span', 'ff-metalabel', who, label);
            util.el('span', '', who, value);
          }
          const body = util.el('div', 'ff-mailbody', box);
          util.el('p', '', body, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', body, p);
          util.el('p', 'sig', body, d.signature.join('\n'));
          return box;
        },
        panes: (base) => (ctx, R) => {
          base(ctx, R);
          const icon = (parent, markup) => {
            const el = ctx.util.el('span', 'ff-paneicon', parent);
            el.innerHTML = markup;
          };
          icon(R.docPane, EMAIL_ICON);
          icon(R.formPane, FORM_ICON);
        },
        arranged: (base, S) => (ctx, R) => {
          base(ctx, R);
          const { util, spec } = ctx;
          const { root, formPane } = R;
          const foot = document.querySelector('.ds-footer');
          if (foot) {
            (spec.layout.tabs ? root : formPane).append(foot);
            const clear = util.el('button', 'ds-clearall', foot, 'Clear');
            clear.type = 'button';
            foot.insertBefore(clear, foot.querySelector('.ds-submit'));
            clear.addEventListener('click', () => {
              const fields = { ...ctx.model.fields };
              for (const f of spec.fields) {
                fields[f.id] = f.kind === 'checkbox' ? false : '';
                const x = S.st.el[f.id];
                if (x.input) {
                  x.input.value = '';
                  x.input.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                  if (x.w && typeof x.w.set === 'function') x.w.set(f.kind === 'checkbox' ? [] : null);
                  if (x.dd) {
                    x.btn.querySelector('.ff-ddval').textContent = 'Select…';
                    x.btn.querySelector('.ff-ddval').classList.add('empty');
                    x.dd.classList.remove('open');
                    x.list.querySelectorAll('.sel').forEach((o) => o.classList.remove('sel'));
                  }
                }
              }
              formPane.querySelectorAll('input[type=checkbox],input[type=radio]').forEach((x) => { x.checked = false; });
              ctx.update({ ...ctx.model, fields, open: null });
            });
          }
          const form = formPane.querySelector('.ff-form');
          const available = ctx.size.height - 188;
          let rowGap = Math.min(30, Math.max(10, (available - spec.fields.length * 48) / Math.max(1, spec.fields.length - 1)));
          form.style.setProperty('--ff-row-gap', rowGap + 'px');
          const mail = R.docPane.querySelector('.ff-mail,.ff-plainmail');
          if (mail) {
            mail.classList.toggle('dense', spec.doc.paragraphs.length > 4);
            let mailSize = Math.min(24, ctx.size.height / 28);
            mail.style.fontSize = mailSize + 'px';
            while (mail.offsetHeight > ctx.size.height - 64 && mailSize > 12) {
              mailSize -= 0.5;
              mail.style.fontSize = mailSize + 'px';
            }
          }
        },
        fit: (base) => (ctx, R) => {
          const { formPane } = R;
          const form = formPane.querySelector('.ff-form');
          const grid = form.querySelector('.ff-grid');
          const foot = document.querySelector('.ds-footer');
          const paneBox = formPane.getBoundingClientRect();
          const actionBox = foot && foot.getBoundingClientRect();
          const rowLimit = Math.min(paneBox.bottom - 12, actionBox ? actionBox.top - 12 : paneBox.bottom - 12);
          if (grid.getBoundingClientRect().bottom > rowLimit) {
            let rowGap = parseFloat(form.style.getPropertyValue('--ff-row-gap'));
            for (; rowGap > 2 && grid.getBoundingClientRect().bottom > rowLimit; rowGap -= 1) {
              form.style.setProperty('--ff-row-gap', Math.max(2, rowGap - 1) + 'px');
            }
            if (grid.getBoundingClientRect().bottom > rowLimit) {
              const fontSize = parseFloat(getComputedStyle(grid).fontSize);
              const controlHeight = parseFloat(getComputedStyle(form.querySelector('.ff-field')).minHeight);
              form.classList.add('ff-fit');
              for (let scale = 0.98; scale >= 0.5; scale -= 0.02) {
                grid.style.fontSize = fontSize * scale + 'px';
                form.style.setProperty('--ff-fit-height', Math.max(22, controlHeight * scale) + 'px');
                if (grid.getBoundingClientRect().bottom <= rowLimit) break;
              }
            }
          }
          base(ctx, R);
        },
      },
    },
  });
})();
