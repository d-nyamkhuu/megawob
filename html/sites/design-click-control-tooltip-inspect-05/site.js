// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-tooltip-inspect-05',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'User Archive',
        'theme': 'os2',
        'layout': 'os2',
        'tools': 'File Edit View Contact Tools Help',
        'side':
          'Contacts Manager|Keep track of your personal and business contacts. Use the toolbar to work with the selected item(s).',
        'foot': 'Actions',
      },
      parts: {
        'frame.6': (base) => function (_c) {
          base(_c);
          const icons = _c.u.el('div', 'archive-header-icons', _c.title);
          const paths = [
            '<circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="m21 21 9 9" fill="none" stroke="currentColor" stroke-width="4"/>',
            '<path d="M3 5h28L20 18v12l-7-3V18z"/>',
            '<path d="m14 2 6 0 1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z"/><circle cx="17" cy="17" r="5.5" fill="white"/>'
          ];
          paths.forEach((path, i) => {
            const icon = _c.u.el('span', 'archive-header-icon', icons);
            icon.setAttribute('aria-label', ['Search', 'Filter', 'Settings'][i]);
            icon.innerHTML = '<svg viewBox="0 0 34 34" aria-hidden="true">' + path + '</svg>';
          });
        },
        'frame.18': (base) => function (_c) {
          base(_c);
          const { aside, u } = _c;
          aside.replaceChildren();
          u.el('h2', 'archive-details-title', aside, 'User Details');
          const card = u.el('div', 'archive-user-card', aside);
          const avatar = u.el('div', 'archive-avatar', card);
          avatar.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="32" r="18"/><path d="M18 86V76a32 25 0 0 1 64 0v10z"/></svg>';
          const summary = u.el('div', 'archive-user-summary', card);
          u.el('strong', '', summary, 'Marcus Lee');
          u.el('b', '', summary, 'ID: 1043');
          u.el('span', 'archive-status', summary, 'Archived');
          const fields = u.el('dl', 'archive-fields', aside);
          const values = [
            ['Name:', 'Marcus Lee'], ['User ID:', '1043'],
            ['Email:', 'marcus.lee@example.com'], ['Department:', 'Engineering'],
            ['Role:', 'Software Engineer'], ['Status:', 'Archived'],
            ['Archived on:', '2019-03-14'], ['Archived by:', 'Dana Kim'],
            ['Notes:', 'Inactive account\n(> 180 days).']
          ];
          values.forEach(([label, value]) => {
            u.el('dt', '', fields, label);
            u.el('dd', '', fields, value);
          });
        },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, head, note, aside, shell } = _c;
            shell.dataset.instruction = ctx.display;
            if (ctx.display === 'panel' && shell.clientWidth >= 1150) aside.appendChild(note);
            else if (ctx.display !== 'hidden') {
              note.classList.remove('instruction-toast');
              note.classList.add(ctx.display === 'toast' ? 'archive-notification' : 'archive-header-note');
              head.appendChild(note);
            }
          },
        'frame.36': (base) => function (_c) {
          base(_c);
          const { shell, head, submit, u } = _c;
          const extras = Array.from(shell.querySelectorAll('.xtra-task'));
          const headerControls = u.el('div', 'archive-header-actions', head);
          const footer = u.el('div', 'archive-footer', shell);
          if (submit) {
            const header = _c.placement === 'header';
            (header ? headerControls : footer).appendChild(submit);
            submit.classList.toggle('archive-end-link', _c.placement === 'status');
          }
          extras.forEach((button) => {
            const header = button.parentElement.classList.contains('tools');
            (header ? headerControls : footer).prepend(button);
          });
          if (!footer.children.length) footer.remove();
          if (!headerControls.children.length) headerControls.remove();
          shell.classList.toggle('has-header-actions', !!headerControls.children.length);
          _c.foot.hidden = true;
          _c.statusbar.hidden = true;
          },
        'overlay.7': (base) => function (_c) {
          const result = base(_c);
          const { ctx, el, dismiss } = _c;
          const u = ctx.util;
          const heading = el.querySelector('strong');
          const message = el.querySelector('p');
          el.classList.add('archive-obstruction');
          if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
            heading.hidden = true;
            dismiss.textContent = 'Dismiss';
            const symbol = u.el('span', 'archive-obstruction-symbol', el);
            symbol.innerHTML = ctx.kind === 'banner'
              ? '<svg viewBox="0 0 44 44"><path d="M5 17h10L35 7v30L15 27H5zM13 28l4 11h7l-5-10" fill="none" stroke="currentColor" stroke-width="3"/><path d="m39 12 4-3m-4 13h5m-5 10 4 3" stroke="currentColor" stroke-width="2"/></svg>'
              : '<svg viewBox="0 0 44 44"><path d="M25 3a8 8 0 0 0 10 10 8 8 0 0 0 6 10A19 19 0 1 1 25 3Z" fill="none" stroke="currentColor" stroke-width="2.5"/><g fill="currentColor"><circle cx="13" cy="15" r="2.5"/><circle cx="22" cy="22" r="2.5"/><circle cx="11" cy="28" r="2.5"/><circle cx="28" cy="32" r="2.5"/><circle cx="20" cy="35" r="2"/></g></svg>';
            el.prepend(symbol);
            message.textContent = ctx.kind === 'banner'
              ? 'System maintenance scheduled for this Saturday, 2:00 AM – 6:00 AM (UTC).\nSome features may be temporarily unavailable.'
              : 'We use cookies to improve your experience, analyze traffic, and personalize content. Learn more in our Privacy Policy.';
            if (ctx.kind === 'banner') {
              el.style.setProperty('--archive-banner-top', document.querySelector('.head').getBoundingClientRect().bottom + 'px');
            }
          } else if (ctx.kind === 'chat' || ctx.kind === 'promo') {
            dismiss.textContent = '×';
            dismiss.setAttribute('aria-label', 'Close');
            heading.textContent = ctx.kind === 'chat' ? '● Need help?' : 'Stay in the loop';
            message.textContent = ctx.kind === 'chat' ? 'Hi! How can we help you today?' : 'Get product updates, tips, and company news delivered to your inbox.';
            const field = u.el('input', 'archive-message-field', el);
            field.type = 'text';
            field.placeholder = ctx.kind === 'chat' ? 'Type a message...' : 'your.email@example.com';
            field.setAttribute('aria-label', ctx.kind === 'chat' ? 'Message' : 'Email');
            const action = u.el('button', 'archive-message-action', el, ctx.kind === 'chat' ? '➤' : 'Subscribe');
            action.type = 'button';
            if (ctx.kind === 'promo') {
              const graphic = u.el('div', 'archive-promo-graphic', el);
              graphic.innerHTML = '<svg viewBox="0 0 100 100"><rect x="8" y="20" width="84" height="64" rx="2" fill="none" stroke="currentColor" stroke-width="5"/><path d="m9 23 41 36 41-36" fill="none" stroke="currentColor" stroke-width="5"/></svg>';
            }
          }
          return result;
        },
      },
    },
  });
})();
