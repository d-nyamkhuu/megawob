// Design of this site on the use-email/mail template (templates/use-email/mail.js): notebook tabs, a contact
// picker for the To and Cc fields, scroll buttons on the message and the contacts, the original's attachments
// inside the forward editor.
(function () {
  'use strict';
  let contactField = 'to';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-07',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 31,
      rowBasis: 'size',
      newLabel: 'New',
      columns: ['From', 'Subject', 'Received', ''],
      fieldColon: true,
      forwardTitle: 'Forward Message',
      paths: {
        new: 'M5 2h10l5 5v15H5z M15 2v6h5 M2 4h5 M3 2v5',
        print: 'M6 2h12v6H6z M3 8h18v10H3z M6 14h12v8H6z M7 5h8 M8 17h8 M8 20h8 M17 11h2',
        contact: 'M4 2h16v20H4z M2 5h2 M2 18h2 M9 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M8 17v-3h8v3z',
      },
      parts: {
        begin: () => () => {
          contactField = 'to';
        },
        toolbarMade: (base, S) => () => {
          const { el, button } = S;
          button(
            S.els.toolbar,
            'Print',
            null,
            () => {
              env.log('decoy', { label: 'Print' });
              return {};
            },
            'print',
          );
          const tabs = el('div', 'notebook-tabs', S.els.ledger);
          for (const label of ['Compose', 'Addresses']) {
            const t = el('button', 'notebook-tab', tabs, label);
            t.type = 'button';
            t.addEventListener('click', () => env.log('decoy', { label }));
          }
        },
        occupiedKeep: (base, S) => (v) => v !== S.els.listWrap && getComputedStyle(v).position !== 'absolute',
        contactButton: (base, S) => (p) =>
          S.button(
            S.els.cp,
            p.name,
            null,
            () => {
              const m = S.ctx.model;
              if (!m.compose) return {};
              S.els.contact.classList.remove('choosing');
              return { field: [contactField, p.name] };
            },
            'contact',
          ),
        contactsMade: (base, S) => () => {
          const contactScroll = S.el('div', 'contact-scroll', S.els.contact);
          for (const [label, amount] of [
            ['▲', -55],
            ['▼', 55],
          ]) {
            const b = S.el('button', '', contactScroll, label);
            b.type = 'button';
            b.addEventListener('click', () => {
              S.els.cp.scrollTop += amount;
            });
          }
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          for (const [label, value] of [
            ['From', e.name],
            ['To', S.spec.me.name + cc(e)],
            ['Subject', e.subject],
            ['Date', e.time],
          ]) {
            el('strong', 'meta-label', meta, label + ':');
            el('span', 'meta-value', meta, value);
          }
        },
        docContent: (base, S) => (d, e, i, m) => {
          const { el } = S;
          const content = (d.content = el('div', 'message-content', S.els.docInside, e.body));
          for (const a of e.att) {
            const b = el('div', 'attachment', S.els.docInside);
            b.innerHTML = S.P.icon('file');
            el('span', '', b, a.file + '\n(' + a.size + ')');
          }
          const docScroll = el('div', 'document-scroll', S.els.docInside);
          for (const [label, amount] of [
            ['▲', -100],
            ['▼', 100],
          ]) {
            const b = el('button', '', docScroll, label);
            b.type = 'button';
            b.addEventListener('click', () => {
              content.scrollTop += amount;
            });
          }
          S.sentNotes(content, i, m);
        },
        editorTitleMade: (base, S) => () => {
          contactField = 'to';
        },
        editorRowMade: (base, S) => (row, k, inp, shown) => {
          if (k !== 'subject') {
            const b = S.el('button', 'select-contact', row, 'Select...');
            b.type = 'button';
            b.addEventListener('click', (ev) => {
              ev.preventDefault();
              if (!S.ctx.model.compose) S.up(shown.mode === 'forward' ? { forward: shown.of } : { reply: shown.of });
              contactField = k;
              S.els.contact.classList.add('choosing');
              S.els.cp.querySelector('button')?.focus();
            });
          }
        },
        editorBody: (base, S) => (shown) => {
          const { el, D } = S;
          const { editor, reg } = S.els;
          const original = S.spec.emails[shown.of ?? 0];
          const bodyPane = el('div', 'editor-body-pane', editor);
          if (shown.mode === 'forward')
            el(
              'div',
              'forward-header',
              bodyPane,
              '--------- Forwarded message ---------\nFrom: ' +
                original.name +
                '\nDate: ' +
                original.time +
                '\nSubject: ' +
                original.subject +
                '\n',
            );
          const area = el('textarea', '', bodyPane);
          area.placeholder = shown.mode === 'forward' ? D.forwardPlaceholder : D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, { value: shown.body || '', label: 'body', onInput: (v) => S.field('body', v) });
          reg.set('field:body', area);
          for (const a of original.att) {
            const b = el('div', 'attachment', bodyPane);
            b.innerHTML = S.P.icon('file');
            el('span', '', b, a.file + '\n(' + a.size + ')');
          }
          return area;
        },
        cancelButton: (base, S) => (acts) => S.button(acts, 'Cancel', 'compose:discard', { discard: true }, null, 'discard'),
        cancelMade: (base, S) => (acts) => {
          S.button(
            acts,
            'Save Draft',
            null,
            () => {
              env.log('decoy', { label: 'Save Draft' });
              return {};
            },
            null,
            'save-draft',
          );
        },
      },
    },
  });
})();
