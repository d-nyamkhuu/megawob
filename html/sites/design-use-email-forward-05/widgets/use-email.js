// Bauhaus mail with contact search, attachment cards and a forward summary beside the message.
(function () {
  'use strict';
  const PERSON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 22v-4c0-5 16-5 16 0v4z"/></svg>';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-05',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      folderList: ['inbox', 'sent', 'drafts', 'archive', 'trash'],
      rowHeight: 73,
      rowBasis: 'size',
      newLabel: 'Compose',
      newIn: 'folders',
      newClass: 'compose-btn',
      forwardTitle: 'Forward',
      paths: {
        new: 'M4 10v11h15v-7 M8 14l2-5 10-8 3 3-10 9z M17 3l3 3',
        sent: 'm2 3 20 9-20 9 4-9z M6 12h16',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
      },
      parts: {
        panel: (base) => (...args) => {
          const p = base(...args);
          p.querySelector('.gadgets').textContent = '− ×';
          return p;
        },
        searchInput: (base, S) => (searchline) => {
          S.el('span', 'sort-caption', searchline, 'Sort by: Date ▾');
          return base(searchline);
        },
        contactsStart: (base, S) => () => {
          const search = S.els.contactSearch = S.el('input', 'contact-search', S.els.contact);
          S.els.contact.insertBefore(search, S.els.cp);
          search.type = 'search';
          search.placeholder = '⌕  Search contacts...';
          search.setAttribute('aria-label', 'Search contacts');
        },
        contactMade: () => (b) => {
          b.insertAdjacentHTML('afterbegin', PERSON.replace('<svg ', '<svg aria-hidden="true" '));
        },
        contactsMade: (base, S) => () => {
          const { contactSearch, cp } = S.els;
          contactSearch.addEventListener('input', () => {
            for (const b of cp.children)
              b.hidden = !b.textContent.toLowerCase().includes(contactSearch.value.toLowerCase());
          });
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          const inbox = S.els.folderButtons.get('inbox');
          let count = inbox.querySelector('.count');
          if (!count) count = S.el('span', 'count', inbox);
          count.textContent = S.spec.emails.filter((e, i) => m.box[i] === 'inbox' && m.flags[i].unread).length;
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, spec, cc } = S;
          el('h2', '', meta, e.subject);
          for (const [label, value] of [
            ['From:', e.name + ' <' + e.addr + '>'],
            ['To:', spec.me.name + (spec.me.addr ? ' <' + spec.me.addr + '>' : '') + cc(e)],
            ['Date:', e.time],
          ]) {
            const line = el('div', 'meta-line', meta);
            el('span', 'meta-label', line, label);
            el('span', 'meta-value', line, value);
          }
        },
        docContent: (base, S) => (d, e, i, m) => {
          const content = d.content = S.el('div', 'message-content', S.els.docInside);
          S.el('div', 'message-body', content, e.body);
          if (e.att.length) {
            const attachments = S.el('div', 'attachments', content);
            S.el('div', 'attachment-heading', attachments, e.att.length + ' attachments');
            const cards = S.el('div', 'attachment-cards', attachments);
            for (const a of e.att) S.P.attachment(cards, a, e);
          }
          S.sentNotes(content, i, m);
        },
        attachment: (base, S) => (content, a) => {
          const b = S.el('div', 'attachment', content);
          const preview = S.el('div', 'attachment-preview', b);
          preview.innerHTML = S.P.icon('file');
          if (/\.(jpe?g|png|heic|gif)$/i.test(a.file)) {
            const img = S.el('img', '', preview);
            img.src = 'sites/' + S.site + '/assets/lake-photo.webp';
            img.alt = 'Image attachment';
            b.classList.add('image-attachment');
          }
          S.el('span', 'attachment-name', b, a.file);
          S.el('span', 'attachment-size', b, '(' + a.size + ')');
        },
        docDone: (base, S) => (d) => {
          const more = S.el('button', 'more-tools', d.tools, 'Message actions');
          more.type = 'button';
          more.addEventListener('click', () => S.els.doc.classList.toggle('tools-expanded'));
        },
        editorTitleMade: (base, S) => (title) => { S.els.composeTitle = title; },
        editorRowMade: (base, S) => (row, k) => {
          if (k !== 'to') return;
          const picker = S.el('button', 'contact-picker', row);
          picker.type = 'button';
          picker.title = 'Contacts';
          picker.setAttribute('aria-label', 'Choose a contact');
          picker.innerHTML = PERSON;
          picker.addEventListener('click', (ev) => {
            ev.preventDefault();
            S.els.contactSearch.focus();
          });
        },
        editorBody: (base, S) => (shown) => {
          const { el, spec } = S;
          const bodyBox = el('div', 'composer-body', S.els.editor);
          if (shown.mode === 'forward' && !/forwarded message/i.test(shown.body || '')) {
            const original = spec.emails[shown.of ?? 0];
            el('div', 'forward-summary', bodyBox,
              '---------- Forwarded message ----------\nFrom: ' + original.name + ' <' + original.addr +
              '>\nDate: ' + original.time + '\nSubject: ' + original.subject + '\nTo: ' + spec.me.name +
              (spec.me.addr ? ' <' + spec.me.addr + '>' : ''));
          }
          const area = el('textarea', '', bodyBox);
          area.placeholder = shown.mode === 'forward' ? S.D.forwardPlaceholder : S.D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '', label: 'body', onInput: (v) => S.field('body', v),
          });
          S.els.reg.set('field:body', area);
          return area;
        },
        actionsStart: (base, S) => (acts) => {
          const addAttachment = S.el('button', 'add-attachment', acts);
          addAttachment.type = 'button';
          addAttachment.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 8v11a5 5 0 0010 0V6a3 3 0 00-6 0v12a1 1 0 002 0V7 M8 5v14"/></svg>';
          S.el('span', '', addAttachment, 'Add Attachment');
          addAttachment.addEventListener('click', () => env.log('decoy', { label: 'Add Attachment' }));
        },
        cancelButton: (base, S) => () =>
          S.button(S.els.composeTitle, 'Cancel', 'compose:discard', { discard: true }, 'close', 'discard-title'),
      },
    },
  });
})();
