// Monochrome Mac recovery mail: striped window titles, recipient menu and an original-message scroll rail.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-12',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      style: 'macrecover',
      rowHeight: 34,
      folderList: [],
      ledgerTitle: 'Mail',
      newLabel: 'New',
      paths: { new: 'M5 2h10l5 5v17H5Z M15 2v6h5' },
      forwardTitle: 'Forward',
      fieldColon: true,
      fieldKeyClass: true,
      sendIcon: null,
      parts: {
        panel: (base, S) => (cls, title) => {
          const p = S.el('section', 'panel ' + cls, S.els.root);
          const t = S.el('div', 'window-title', p);
          S.el('span', 'title-label', t, title);
          S.el('span', 'gadgets', t, '□ ×');
          return p;
        },
        docMeta: (base, S) => (meta, e) => {
          const header = S.el('div', 'mail-header', meta);
          for (const [label, value] of [
            ['From', e.name],
            ['To', S.spec.me.name + S.cc(e)],
            ['Subject', e.subject],
          ]) {
            const line = S.el('div', 'meta-line', header);
            S.el('span', 'meta-label', line, label + ':');
            S.el('span', 'meta-value', line, value);
          }
          S.el('div', 'message-date', meta, e.time);
        },
        editorTitle: (base, S) => (shown) => {
          const title = S.el('div', 'window-title', S.els.editor);
          S.el('span', 'title-label', title, S.P.editorTitleText(shown));
          return title;
        },
        editorFields: (base, S) => (group, shown) => {
          const documentIcon = S.el('span', 'compose-document', group);
          documentIcon.innerHTML = S.P.icon('file');
          base(group, shown);
        },
        editorRowMade: (base, S) => (row, k, inp, shown) => {
          base(row, k, inp, shown);
          if (k !== 'to') return;
          const toggle = S.el('button', 'recipient-toggle', row);
          toggle.type = 'button';
          toggle.setAttribute('aria-label', 'Choose recipient');
          const choices = S.el('div', 'recipient-menu', row);
          choices.hidden = true;
          toggle.addEventListener('click', (ev) => {
            ev.preventDefault();
            choices.hidden = !choices.hidden;
          });
          for (const person of S.els.folks.filter((p, i, a) => a.findIndex((v) => v.name === p.name) === i)) {
            const option = S.el('button', '', choices, person.name);
            option.type = 'button';
            option.addEventListener('click', (ev) => {
              ev.preventDefault();
              S.field('to', person.name);
              S.paint(S.ctx.model);
              choices.hidden = true;
            });
          }
        },
        editorBody: (base, S) => (shown) => {
          const original = S.el('div', 'original-message', S.els.editor);
          if (shown.mode === 'forward') {
            const source = S.spec.emails[shown.of];
            S.el('div', 'original-header', original,
              '---------- Original Message ----------\nFrom: ' + source.name +
              '\nDate: ' + source.time + '\nSubject: ' + source.subject);
          }
          const area = S.el('textarea', '', original);
          area.placeholder = shown.mode === 'forward' ? S.D.forwardPlaceholder : S.D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '',
            label: 'body',
            onInput: (v) => S.field('body', v),
          });
          S.els.reg.set('field:body', area);
          const rail = S.el('div', 'original-scrollbar', original);
          const scrollUp = S.el('button', 'scroll-up', rail);
          scrollUp.type = 'button';
          scrollUp.setAttribute('aria-label', 'Scroll original message up');
          scrollUp.addEventListener('click', () => { area.scrollTop -= 60; });
          const scrollTrack = S.el('div', 'original-scrolltrack', rail);
          scrollTrack.addEventListener('click', (ev) => {
            const r = scrollTrack.getBoundingClientRect();
            area.scrollTop = (ev.clientY - r.top) / r.height * (area.scrollHeight - area.clientHeight);
          });
          const scrollDown = S.el('button', 'scroll-down', rail);
          scrollDown.type = 'button';
          scrollDown.setAttribute('aria-label', 'Scroll original message down');
          scrollDown.addEventListener('click', () => { area.scrollTop += 60; });
          return area;
        },
      },
    },
  });
})();
