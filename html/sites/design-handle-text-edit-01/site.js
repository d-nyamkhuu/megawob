// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-edit-01',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': 'NEXUS',
        'theme': 'swiss',
        'layout': 'editorial',
        'tools': 'Mail　 Contacts　 Calendar　 Tasks　 Documents　　　　　⌕　 Search mail　　　JD',
        'rail': '',
        'side':
          'Message Details|To　　Daniel Kim|Cc　　—|Bcc　　—|Subject　　Meeting tomorrow|Tags　　project, planning|Category　　Work|Priority　　Normal|Attachments|roadmap.pdf　　428 KB|budget.xlsx　　312 KB',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.tools) {
              const nav = u.el('nav', 'tools', head);
              ['Mail', 'Contacts', 'Calendar', 'Tasks', 'Documents'].forEach((v, i) => {
                const a = u.el('span', 'nav-link' + (i === 0 ? ' active' : ''), nav, v);
              });
              const search = u.el('div', 'nav-search', nav);
              search.innerHTML =
                '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><span>Search mail</span>';
              u.el('span', 'nav-avatar', nav, 'JD');
            }
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { center, ctx, note, stage, u } = _c;
            const extra = u.el('section', 'editorial-extras', center);
            const agreement = u.el('section', 'agreement-extra', extra);
            u.el('h3', '', agreement, 'Agreement');
            const terms = u.el('div', 'terms-extra', agreement);
            u.el('strong', '', terms, 'Nexus Collaboration Terms of Service');
            u.el('small', '', terms, 'Last updated: March 3, 2016');
            u.el(
              'p',
              '',
              terms,
              'These Terms of Service govern your use of the Nexus collaboration platform and related services provided by Nexus Inc. By accessing or using the Service, you agree to be bound by these Terms.',
            );
            u.el(
              'p',
              '',
              terms,
              '1. Accounts: You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.',
            );
            const agreeLine = u.el('div', 'agree-extra', agreement);
            u.el('span', 'fake-check', agreeLine);
            u.el('span', '', agreeLine, 'I have read and agree to the Terms of Service.');
            const people = u.el('section', 'attendee-extra', extra);
            u.el('h3', '', people, 'Attendees');
            ['Daniel Kim', 'Sophia Nguyen', 'Liam Chen', 'Priya Shah', 'Marcus Bell'].forEach((name, i) => {
              const row = u.el('div', 'person-extra', people);
              u.el('span', i < 2 ? 'fake-check checked' : 'fake-check', row);
              u.el('span', '', row, name);
            });
            const rem = u.el('section', 'reminder-extra', people);
            u.el('h3', '', rem, 'Reminders');
            const remRow = u.el('div', 'reminder-row', rem);
            u.el('span', 'reminder-number', remRow, '1');
            u.el('span', 'reminder-arrows', remRow, '+ -');
            u.el('span', '', remRow, 'days before');
            if (ctx.display === 'panel') {
              note.classList.add('instruction-panel');
              center.style.display = 'grid';
              center.style.gridTemplateColumns = 'minmax(0,1fr) minmax(170px,22%)';
              center.style.gridTemplateRows = 'minmax(0,1fr)';
              center.style.gap = '1vw';
              center.style.padding = '1.8vh 2.3vw 1.2vh 4.55vw';
              note.style.gridColumn = '2';
              note.style.gridRow = '1';
              note.style.margin = '0';
              note.style.alignSelf = 'start';
              note.style.padding = '16px';
              note.style.fontSize = 'clamp(16px,1.25vw,21px)';
              note.style.border = '2px solid #156bb0';
              note.style.borderLeft = '7px solid #156bb0';
              note.style.borderRadius = '6px';
              note.style.background = '#f3f8fe';
              stage.style.gridColumn = '1';
              stage.style.gridRow = '1';
            }
            Object.assign(_c, { agreeLine, agreement, extra, people, rem, remRow, terms });
          },
        'frame.24': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => {
                const row = u.el(i === 0 ? 'h2' : 'p', i >= 9 ? 'attachment' : '', _c.aside);
                if (i >= 9) {
                  const parts = s.trim().split(/\s+/);
                  row.innerHTML =
                    '<svg class="paperclip" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12.5 14.8 5.7a3 3 0 0 1 4.2 4.2l-8.5 8.5a5 5 0 0 1-7.1-7.1l9.2-9.2"/></svg><span class="attachment-name">' +
                    parts[0] +
                    '</span><span class="attachment-size">' +
                    parts.slice(1).join(' ') +
                    '</span>';
                } else row.textContent = s;
              });
            }
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
      },
    },
  });
})();
