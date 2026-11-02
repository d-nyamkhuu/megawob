// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-visibility-02',
  name: 'design',
  split: 'train',
  scenarios: ['visibility'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx); // Keep the template's seeded geometry draws in their original order.
          const width = ctx.size.width;
          const height = ctx.size.height;
          return { M: 0, fullW: width, fullH: height, winW: width, winH: height, ax: 'left' };
        };
      },
      view(base, S) {
        return (m) => {
        const { spec, D, P, app } = S;
        const labels = { public: 'Public', friends: 'Friends Only', close: 'Close Friends', only: 'Only Me' };
        const audiences = ['public', 'friends', 'close', 'only'];
        if (spec.mode !== 'post') return base(m);
        P.friendPost(document.createElement('div')); // Preserve the original post view's forked content draws.
        const soc = P.element('div', 'sp-soc mycircle-composer', app);
        const feed = P.element('div', 'mycircle-content', soc);
        const composer = P.element('section', 'mycircle-compose', feed);
        P.element('h1', '', composer, 'Create a Post');
        const audrow = P.element('div', 'mycircle-audience', composer);
        P.element('span', '', audrow, 'Audience:');
        const audwrap = P.element('span', 'sp-rel', audrow);
        const aud = P.key(P.element('button', 'sp-audbtn mycircle-select', audwrap, `${D.audienceIcons[m.aud]} ${labels[m.aud]} ▾`), 'aud-btn');
        aud.type = 'button';
        if (m.menu) {
          const mn = P.menu(audwrap, audiences.map((a) => ({ k: `aud:${a}`, label: `${D.audienceIcons[a]} ${labels[a]}`, v: a })), m.aud);
          mn.style.left = '0'; mn.style.top = '100%';
        }
        P.element('div', 'mycircle-draft', composer, spec.text);
        const tools = P.element('div', 'mycircle-compose-tools', composer);
        P.element('button', 'sp-btn', tools, '#doc Add Photo…').type = 'button';
        P.element('button', 'sp-btn', tools, '#link Add Link…').type = 'button';
        P.element('button', 'sp-btn', tools, '#pin Add Location…').type = 'button';
        if (!m.posted) {
          const post = P.key(P.element('button', 'sp-btn pri mycircle-post', tools, 'Post'), 'post');
          post.type = 'button';
        } else P.element('span', 'sp-ok', tools, `${D.audienceIcons[m.aud]} Posted · ${labels[m.aud]}`);

        const profile = P.element('section', 'mycircle-profile', feed);
        P.element('h2', '', profile, 'My Profile');
        const audience = ['friends', 'only', 'public', 'only', 'friends'];
        const user = spec.user || {};
        const fields = [
          { label: 'Name', value: user.full || 'Alex Carter' },
          { label: 'Email', value: user.email || 'alex.carter@example.com' },
          { label: 'Hometown', value: 'Riverton, CO' },
          { label: 'Birthday', value: 'March 14, 1988' },
          { label: 'About Me', value: 'I love the outdoors, good food, and great friends.\nAlways up for a new adventure.', about: true },
        ];
        fields.forEach((field, i) => {
          const row = P.element('div', 'mycircle-profile-row', profile);
          P.element('span', 'mycircle-field-label', row, `${field.label}:`);
          const value = P.element('span', `mycircle-field-value${field.about ? ' about' : ''}`, row, field.value);
          const lock = audience[i % audience.length];
          P.element('span', `sp-audbtn mycircle-profile-aud mycircle-aud-${lock}`, row, `${D.audienceIcons[lock]} ${labels[lock]} ▾`);
        });
        return undefined;
        };
      },
    },
  },
});
