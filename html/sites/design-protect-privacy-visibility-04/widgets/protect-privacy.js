// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-visibility-04',
  name: 'design',
  split: 'train',
  scenarios: ['visibility'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      view(base, S) {
        return (m) => {
          const P = S.P;
          const soc = P.element('div', 'sp-soc drift-social-view', S.app);
          const grid = P.element('div', 'drift-task-grid', soc);
          const editor = P.element('section', 'drift-editor-window', grid);
          const title = P.element('div', 'drift-editor-title', editor);
          P.element('span', '', title, '▣');
          P.element('strong', '', title, specTitle(S));
          P.element('span', 'drift-win-actions', title, '—　□　×');
          const form = P.element('div', 'drift-editor-content', editor);
          if (S.spec.mode === 'post') P.post(P.element('div', 'drift-editor-form', form), m, {
            public: 'Anyone on or off Driftwood Social', friends: 'Your friends on Driftwood Social',
            close: 'Only your close friends list', only: 'Only you can see this',
          });
          else P.profile(P.element('div', 'drift-editor-form', form), m);

          const preview = P.element('aside', 'drift-preview', grid);
          P.element('strong', 'drift-preview-heading', preview, S.spec.mode === 'post' ? 'Post Preview' : 'Profile Preview');
          if (S.spec.mode === 'post') {
            const postPreview = P.element('div', 'drift-preview-post', preview);
            P.avatar(postPreview, S.spec.user.full, 48);
            P.element('strong', '', postPreview, S.spec.user.full);
            P.element('p', '', postPreview, S.spec.text);
          } else {
            const cover = P.element('div', 'drift-cover', preview);
            const identity = P.element('div', 'drift-profile-identity', preview);
            P.avatar(identity, S.spec.user.full, 112);
            P.element('strong', '', identity, S.spec.user.full);
            P.element('span', '', identity, `@${S.spec.user.handle || S.spec.user.full.toLowerCase().replace(/\\s+/g, '')}`);
            const bio = S.spec.fields.find((f) => /bio|about/i.test(f.label));
            if (bio) P.element('p', '', identity, bio.value);
            for (const f of S.spec.fields.filter((x) => /location|website|birthday/i.test(x.label))) {
              P.element('div', 'drift-preview-meta', identity, `⌖　${f.value}`);
            }
          }

          const composer = P.element('section', 'drift-composer', soc);
          P.element('strong', '', composer, 'Create a Post');
          const audience = P.element('div', 'drift-compose-audience', composer);
          P.element('span', '', audience, 'Audience:');
          P.element('span', '', audience, '◎　Public　⌄');
          const draft = S.spec.text || S.ctx.content.pick(S.ctx.rng.fork('drift-preview-draft'), S.ctx.content.POST_TEXTS);
          P.element('div', 'drift-compose-draft', composer, draft);
          const tools = P.element('div', 'drift-compose-tools', composer);
          for (const icon of ['▧', '▥', '♧', '☻']) P.element('span', '', tools, icon);

          // Keep the complete form, including its actions, inside the editor.
          // Fit during the view render so locate() sees the final geometry.
          const content = form.firstElementChild;
          const padding = getComputedStyle(form);
          const available = form.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
          const natural = content.getBoundingClientRect().height;
          if (available > 0 && natural > available) {
            const density = available / natural;
            content.style.zoom = String(density);
          }
        };
      },
    },
  },
});

function specTitle(S) { return S.spec.mode === 'post' ? 'Create Post' : 'Edit Profile'; }
