// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base, S) => function (rng, content) {
      const label = base(rng, content);
      return rng.fork('gem/end-label').bool(0.55) ? 'Submit' : label;
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // 1987 monochrome mail utility window with a lower application dock.
      document.body.classList.add('beos-mail');
      document.body.classList.toggle('beos-header-note', display === 'header');
      document.body.classList.toggle('gem-panel-note', display === 'panel');
      document.body.classList.toggle('gem-toast-note', display === 'toast');
      const menu = util.el('div', 'beos-menu', document.body);
      for (const item of ['File', 'Edit', 'View', 'Message', 'Accounts', 'Help'])
        util.el('span', '', menu, item);
      const folders = util.el('aside', 'beos-folders', body);
      util.el('div', 'beos-folder-head', folders, '✉  Mail');
      for (const [icon, label, count, selected] of [['▱','Inbox','3',true], ['▱','Sent','12'], ['▱','Drafts','1'], ['▱','Deleted','4']]) {
        const row = util.el('div', `beos-folder${selected ? ' selected' : ''}`, folders);
        util.el('span', '', row, icon);
        util.el('span', '', row, label);
        util.el('span', 'beos-count', row, count);
      }
      util.el('div', 'gem-message-heading', folders, 'Messages');
      const related = util.el('aside', 'beos-related', body);
      const cards = [
        ['accounts','Accounts Payable', [['Pending Invoices','7'],['Approved','12'],['Scheduled','5']]],
        ['calendar','Calendar', [['Today','3'],['Tomorrow','1'],['This Week','6']]],
        ['chat','Chat', [['Unread','0'],['Conversations','2']]],
      ];
      for (const [kind, title, rows] of cards) {
        const card = util.el('section', `beos-stat-card ${kind}`, related);
        const heading = util.el('div', 'beos-panel-title', card);
        util.el('span', `beos-stat-icon ${kind}`, heading);
        util.el('span', '', heading, title);
        for (const [label, value] of rows) {
          const row = util.el('div', 'beos-stat-row', card);
          util.el('span', '', row, label);
          util.el('span', '', row, value);
        }
      }
      const dock = util.el('nav', 'beos-dock', body);
      const dockIcons = {
        mail: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="11" width="38" height="27"/><path d="m6 13 18 15 18-15"/></svg>',
        contacts: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 6h29v36H13zM8 12H5m3 9H5m3 9H5m3 9H5"/><circle cx="25" cy="18" r="5"/><path d="M17 33c1-8 15-8 16 0m4-18h2m-2 7h2m-2 7h2"/></svg>',
        documents: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 4h21l10 10v30H9zM30 4v11h10M15 23h19M15 29h19M15 35h19"/></svg>',
        calendar: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 10h36v33H6zM6 18h36M15 5v10m18-10v10M13 24h5v5h-5zm9 0h5v5h-5zm9 0h5v5h-5zm-18 9h5v5h-5zm9 0h5v5h-5z"/></svg>',
        chat: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 8h34v25H22L11 42v-9H7z"/></svg>',
        accounts: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="10" rx="16" ry="6"/><path d="M8 10v9c0 8 32 8 32 0v-9M8 20v9c0 8 32 8 32 0v-9M8 30v8c0 8 32 8 32 0v-8"/><path d="M8 15c0 8 32 8 32 0M8 25c0 8 32 8 32 0M8 35c0 8 32 8 32 0"/></svg>',
        signin: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="12" r="8"/><path d="M9 43V33c0-12 30-12 30 0v10z"/></svg>',
      };
      for (const [label, active, kind] of [['Mail',true,'mail'],['Contacts',false,'contacts'],['Documents',false,'documents'],['Calendar',false,'calendar'],['Chat',false,'chat'],['Accounts Payable',false,'accounts'],['Sign In',false,'signin']]) {
        const item = util.el('div', `beos-dock-item${active ? ' active' : ''}`, dock);
        const icon = util.el('span', `beos-dock-icon ${kind}`, item);
        icon.innerHTML = dockIcons[kind];
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, folders, menu, related, stage });
    },
    'frame.end': (base, S) => function (_c) {
      const result = base(_c);
      const { ctx, util, rng, label, submit } = _c;
      const form = ctx.finish ? null : rng.fork('gem/end-placement').pick(['footer', 'footer', 'footer', 'header', 'icon']);
      document.body.classList.toggle('gem-footer-end', form === 'footer');
      document.body.style.setProperty('--gem-end-width', `${Math.max(_c.H < 700 ? 112 : 148, label.length * (_c.H < 700 ? 9 : 11) + 40)}px`);
      const tools = util.el('div', 'gem-header-tools', document.body);
      for (const button of document.querySelectorAll('.ref-xtra')) tools.appendChild(button);
      if (submit) {
        submit.className = `ref-submit${form === 'icon' ? ' gem-end-icon' : ''}`;
        submit.textContent = form === 'icon' ? '✓' : label;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        const holder = form === 'footer' ? util.el('footer', 'gem-endbar', document.body) : tools;
        holder.appendChild(submit);
      }
      const note = document.querySelector('.ref-instruction');
      document.body.style.setProperty('--gem-note-height', `${note ? Math.ceil(note.getBoundingClientRect().height) + 12 : 0}px`);
      return result;
    },
  };

  env.site({
    name: 'design-avoid-phishing-attachment-05',
    template: 'site/base',
    design: { parts },
  });
})();
