// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-nested-02',
  name: 'design',
  split: 'train',
  scenarios: ['nested'],
  template: 'scroll-page/longform',
  design: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    foreground: '#080f20', muted: '#555d6c', line: '#d4dae2',
    parts: {
      frame: (base, S) => (st) => {
        const frame = base(st);
        st.acmeSize = {
          width: st.ctx.size.width || st.ctx.size.w || st.ctx.stage.clientWidth,
          height: st.ctx.size.height || st.ctx.size.h || st.ctx.stage.clientHeight,
        };
        Object.assign(frame.wrap.style, {
          display: 'block', width: st.acmeSize.width + 'px',
          height: st.acmeSize.height + 'px', margin: '0', padding: '0',
          boxSizing: 'border-box', alignSelf: 'stretch',
        });
        Object.assign(frame.main.style, {
          display: 'flex', flexDirection: 'column', height: '100%', minHeight: '0',
        });
        return frame;
      },
      header: (base, S) => (st) => {
        const head = base(st);
        const tools = head.querySelector('.ps-tools');
        head.replaceChildren();
        head.className = 'acme-list-title acme-task-heading';
        st.el('span', '', head, st.spec.pane.title);
        st.acmeTools = tools;
        return head;
      },
      row: (base, S) => (st, list, r, pitch) => {
        const row = base(st, list, r, pitch);
        const meta = row.querySelector('.m');
        meta.textContent = `Information and guidance about ${r.title.toLowerCase()}.`;
        const actions = st.el('div', 'acme-row-actions', row);
        for (const button of [...row.querySelectorAll('.ps-btn')]) actions.appendChild(button);
        return row;
      },
      paneTitle: (base, S) => (st, parent, text) => {
        // The pane's title is also the stable page header above the collection.
        return st.head;
      },
      toc: (base, S) => (st) => {
        base(st);
        const toc = st.main.querySelector('.ps-toc') || st.sideNav;
        if (toc) {
          toc.classList.add('acme-contents');
          st.head.appendChild(toc);
        }
      },
      pane: (base, S) => (st, parent, p, height, rowH, parentList) => {
        const available = Math.floor(st.acmeSize.height - st.head.getBoundingClientRect().height);
        const pitch = p.groups ? Math.min(290, Math.max(160, available - 12)) : 38;
        const paneHeight = p.groups ? available
          : parentList ? height - 12 : Math.min(230, Math.max(120, available - 66));
        const rec = base(st, parent, p, paneHeight, pitch, parentList);
        if (!p.groups) {
          rec.box.classList.add('acme-table-pane');
          Object.assign(rec.box.style, {
            margin: '0 3px 3px 10px', paddingTop: '34px',
            border: '1px solid #dce1e7', position: 'relative',
          });
          const columns = st.el('div', 'acme-columns', rec.box);
          for (const label of ['Title', 'Description', 'Action']) st.el('span', '', columns, label);
          rec.box.insertBefore(columns, rec.list);
        }
        return rec;
      },
      group: (base, S) => (st, list, g, rowH) => {
        const head = base(st, list, g, rowH);
        head.parentElement.style.height = (rowH - 12) + 'px';
        return head;
      },
      rendered: (base, S) => (st) => {
        base(st);
        for (const pane of st.acmeDecorativePanes || []) pane.placeThumb();
      },
      fitPage: (base, S) => (st) => {
        // Keep the template's additional content and controls reachable within the
        // outer collection, without moving the title anchor or adding body overflow.
        const appendix = st.el('section', 'acme-page-details', st.acmeOuterList);
        appendix.appendChild(st.acmeTools);
        for (const child of [...st.main.children]) {
          if (child !== st.head && child !== st.acmeSurface) appendix.appendChild(child);
        }
        for (const child of [...st.wrap.children]) {
          if (child !== st.main) appendix.appendChild(child);
        }
        base(st);
      },
      nested: (base, S) => (st, sec) => {
        // The base consumes the original height draws and registers every task pane.
        base(st, sec);
        const rec = st.panes[st.spec.pane.id];
        const surface = st.el('section', 'ps-sec acme-task-surface', st.main);
        Object.assign(surface.style, {
          display: 'flex', flex: '1 1 0', minHeight: '0',
          padding: '0', overflow: 'hidden',
        });
        st.acmeSurface = surface;
        st.secEls[st.spec.sections[st.spec.pane.at].id] = surface;
        if (st.spec.pane.groups) {
          rec.box.classList.add('acme-outer-pane');
          Object.assign(rec.box.style, { flex: '1 1 0', minHeight: '0', margin: '0', border: '0' });
          surface.appendChild(rec.box);
          st.acmeOuterList = rec.list;
          return;
        }
        const frame = S.P.paneFrame(st, surface, 'ps-pane acme-outer-pane acme-flat-outer');
        Object.assign(frame.box.style, { flex: '1 1 0', minHeight: '0', margin: '0', border: '0' });
        const groups = frame.list;
        groups.classList.add('acme-groups');
        st.acmeOuterList = groups;
        const outerPane = { ...frame, axis:'y', pitch:290 };
        S.P.scrollbar(st, outerPane);
        st.acmeDecorativePanes = [outerPane];
        rec.parentList = groups;
        const first = st.el('section', 'acme-flat-group', groups);
        st.el('h5', '', first, 'Getting Started');
        first.appendChild(rec.box);
        for (const [title, entries] of [
          ['Account Management', [['Notifications', 'Control your email and in-app notifications.'], ['Privacy and Security', 'Learn how we keep your data safe and secure.'], ['Teams and Collaboration', 'Work with your team and share resources.'], ['Account preferences', 'Choose your account preferences.'], ['Password and recovery', 'Keep your sign-in information up to date.']]],
          ['Integrations', [['Connected services', 'Connect your account to the tools you use.'], ['API access', 'Manage your application connections.'], ['Import and export', 'Move your data between services.']]],
          ['More help', [['Contact us', 'Get assistance from our support team.']]],
          ['Billing and Subscriptions', [['Payment methods', 'Add and manage your payment methods.'], ['Invoices', 'View your billing history and invoices.'], ['Subscription plans', 'Find the right plan for your needs.'], ['Renewals', 'Review your subscription renewal settings.']]],
          ['Security Guides', [['Two-step verification', 'Add another layer of account protection.'], ['Sign-in history', 'Review recent account activity.'], ['Trusted devices', 'Manage devices connected to your account.'], ['Recovery options', 'Prepare your account recovery options.']]],
          ['Troubleshooting', [['Connection problems', 'Resolve common connection issues.'], ['Browser compatibility', 'Check supported browsers and settings.'], ['Performance tips', 'Improve your experience with the service.'], ['Error messages', 'Understand and resolve common errors.']]],
          ['Using the Mobile App', [['Installing the app', 'Get started on your mobile device.'], ['Mobile settings', 'Choose your mobile preferences.'], ['Offline access', 'Use your content when you are offline.'], ['App updates', 'Keep your mobile app up to date.']]],
          ['Product Updates', [['Release overview', 'Explore recent product improvements.'], ['New features', 'Learn about the latest features.'], ['Service notices', 'Read the latest service information.'], ['Feedback', 'Share your suggestions with our team.']]],
        ]) {
          const group = st.el('section', 'acme-flat-group acme-support-group', groups);
          st.el('h5', '', group, title);
          const table = st.el('div', 'acme-support-table', group);
          const columns = st.el('div', 'acme-columns', table);
          for (const label of ['Title', 'Description', 'Action']) st.el('span', '', columns, label);
          const list = st.el('div', 'acme-support-rows', table);
          for (const [name, description] of entries) {
            const row = st.el('div', 'ps-row', list);
            st.el('span', 't', row, name);
            st.el('span', 'm', row, description);
            const actions = st.el('div', 'acme-row-actions', row);
            const button = st.el('button', 'ps-btn', actions, 'Open');
            button.type = 'button';
            button.addEventListener('click', () => env.log('decoy', { label: name }));
          }
          const track = st.el('div', 'ps-track acme-static-track', table);
          const thumb = st.el('span', 'ps-thumb', track);
          const pane = { box:table, list, track, thumb, axis:'y', pitch:38 };
          S.P.scrollbar(st, pane);
          st.acmeDecorativePanes.push(pane);
        }
      },
    },
  },
});
