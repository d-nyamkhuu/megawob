// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-wrongfield-01',
  name: 'design',
  split: 'train',
  scenarios: ['wrongfield'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      view: (base, S) => (m) => {
        const P = S.P;
        const app = S.app;
        const U = S.spec.user;
        // The custom view owns the app layout. Size it from the stage, rather
        // than retaining the browser mockup's offsets and fixed form geometry.
        const stage = app.closest('.ref-stage');
        const shell = app.parentElement;
        Object.assign(shell.style, {
          left: '0px', top: '0px', width: `${stage.clientWidth}px`,
          height: `${stage.clientHeight}px`, margin: '0', border: '0',
          borderRadius: '0', boxShadow: 'none',
        });
        for (const decoration of shell.children) {
          if (decoration !== app) decoration.style.display = 'none';
        }
        Object.assign(app.style, {
          position: 'absolute', inset: '0', width: 'auto', height: 'auto',
          margin: '0', display: 'flex', alignItems: 'stretch', gap: '0',
          boxSizing: 'border-box',
        });
        const content = P.element('div', 'crm-content', app);
        const profile = P.element('section', 'sp-card crm-profile', content);
        P.element('h2', 'crm-title', profile, 'Profile');
        const row = P.element('div', 'crm-profile-row', profile);
        const photo = P.element('div', 'crm-profile-photo', row);
        P.avatar(photo, U.full, 194);
        const details = P.element('dl', 'crm-profile-kv', row);
        for (const [k, v] of [['Full Name', U.full], ['Email', U.email], ['Phone', U.phone],
          ['Job Title', U.title || 'Marketing Specialist'], ['Company', U.company || S.spec.org.name],
          ['Address', `${U.street}, ${U.city}, ${U.region} ${U.postcode}`]]) P.detailRow(details, k, v);
        const formHost = P.element('div', 'crm-form-host', content);
        P.form(formHost, m);
        const form = formHost.querySelector('.sp-form');
        Object.assign(form.style, {
          position: 'static', width: '100%', height: 'auto', minHeight: '0',
          maxWidth: 'none', margin: '0', padding: '0 0 10px',
          boxSizing: 'border-box',
        });
        const title = form.querySelector('.sp-h2');
        Object.assign(title.style, { margin: '0', padding: '12px 18px' });
        const grid = form.querySelector('.sp-grid');
        const narrow = stage.clientWidth < 1000;
        const inset = narrow ? 16 : 40;
        const labelWidth = narrow ? 190 : 260;
        Object.assign(grid.style, {
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '7px', margin: `10px ${inset}px 0`, width: 'auto',
        });
        for (const field of grid.querySelectorAll('.sp-fld')) {
          Object.assign(field.style, {
            display: 'grid', gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`,
            alignItems: 'center', gap: '0', margin: '0', minWidth: '0',
            gridColumn: 'auto',
          });
          const label = field.querySelector('label');
          if (label) Object.assign(label.style, { gridColumn: '1', gridRow: '1', margin: '0' });
          const input = field.querySelector('.sp-in');
          if (input) Object.assign(input.style, {
            gridColumn: '2', gridRow: '1', width: '100%', minWidth: '0',
            height: input.tagName === 'TEXTAREA' ? '70px' : '38px',
            boxSizing: 'border-box', padding: '8px 12px',
          });
          const hint = field.querySelector('.hint');
          if (hint) Object.assign(hint.style, { gridColumn: '2', gridRow: '2' });
        }
        for (const child of form.children) {
          if (child !== grid && child !== title) {
            Object.assign(child.style, { margin: `8px ${inset}px` });
          }
        }
        const inspector = P.element('aside', 'crm-inspector', app);
        P.detailsPanel(m);
        const panel = app.querySelector('.sp-side');
        if (panel) {
          panel.classList.add('crm-inspector-inner');
          Object.assign(panel.style, {
            position: 'static', width: '100%', height: '100%', boxSizing: 'border-box',
            display: 'block', overflow: 'auto',
          });
          inspector.append(panel);
          const kv = panel.querySelector('.sp-kv');
          if (kv) Object.assign(kv.style, { display: 'block', height: 'auto', padding: '10px 12px' });
        }
        // Measure at the final width, including the inspector and any frame.
        // Compact only when the ordinary form would leave no room for Profile.
        const spacing = getComputedStyle(content);
        const available = content.clientHeight - parseFloat(spacing.paddingTop) - parseFloat(spacing.paddingBottom);
        if (form.offsetHeight > available - 152) {
          Object.assign(title.style, { padding: '8px 12px', fontSize: '18px' });
          Object.assign(grid.style, { gap: '4px', marginTop: '6px' });
          for (const input of grid.querySelectorAll('.sp-in')) {
            Object.assign(input.style, {
              height: input.tagName === 'TEXTAREA' ? '46px' : '26px',
              padding: '4px 8px', fontSize: '14px',
            });
          }
          for (const child of form.children) {
            if (child !== grid && child !== title) child.style.margin = `6px ${inset}px`;
          }
        }
        const profileHeight = Math.max(140, Math.min(available * .37, available - form.offsetHeight - 12));
        profile.style.height = `${profileHeight}px`;
        profile.style.minHeight = '0';
        if (profileHeight < 210) {
          profile.classList.add('crm-profile-compact');
          Object.assign(details.style, { gap: '0', fontSize: '12px', lineHeight: '1.1' });
          photo.style.width = `${Math.max(60, profileHeight - 48)}px`;
          photo.style.height = `${Math.max(60, profileHeight - 48)}px`;
        }
        const avatar = photo.querySelector('.sp-av');
        if (avatar) Object.assign(avatar.style, {
          width: '100%', height: '100%', fontSize: '40px', color: '#16345a',
          background: 'linear-gradient(150deg,#725544,#d3a58b 55%,#293c32)',
        });
      },
    },
  },
});
