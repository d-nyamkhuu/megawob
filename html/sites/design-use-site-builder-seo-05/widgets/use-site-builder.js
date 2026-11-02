// Riverdale CMS metadata editor.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-seo-05',
  name: 'design',
  split: 'train',
  scenarios: ['seo'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    colors: { bg: '#f5f8fb', panel: '#ffffff', fg: '#111318', muted: '#536078', line: '#dde3eb', accent: '#2468e8' },
    parts: {
      header: (base, S) => function () {
        const u = S.ctx.util, head = u.el('header', 'ab-head', S.els.app);
        const image = u.el('img', 'rd-summary-image', head);
        image.src = 'sites/design-use-site-builder-seo-05/assets/heat-pump.png';
        image.alt = '';
        const info = u.el('div', 'rd-summary-info', head);
        u.el('div', 'rd-summary-kind', info, 'Blog post');
        u.el('h1', 'rd-summary-title', info, S.spec.project);
        u.el('div', 'rd-summary-url', info, '/blog/' + S.spec.project.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
        const meta = u.el('div', 'rd-summary-meta', info);
        u.el('span', 'rd-draft-dot', meta);
        u.el('span', '', meta, 'Draft');
        u.el('span', 'rd-last-edited', meta, 'Last edited 12 Jun 2014, 10:24 by ' + S.spec.owner);
        S.P.publish(head);
      },
      toolbar: (base, S) => function () {
        const u = S.ctx.util, tabs = u.el('div', 'ab-tools', S.els.app);
        ['Content', 'SEO', 'Social', 'Settings'].forEach((name) =>
          u.el('span', name === 'SEO' ? 'rd-active' : '', tabs, name));
      },
      settingsMenu: (base, S) => function () {
        const u = S.ctx.util, side = u.el('aside', 'ab-side rd-pages', S.els.work);
        const heading = u.el('div', 'rd-pages-heading', side);
        u.el('strong', '', heading, 'Pages');
        u.el('span', 'rd-plus', heading, '+');
        const pane = S.P.pane('settingsMenu', side, 'ab-library');
        const row = (name, cls, depth) => {
          const r = u.el('div', 'rd-page-row ' + (cls || ''), pane);
          r.style.paddingLeft = (depth ? 58 : 27) + 'px';
          u.el('span', 'rd-doc-icon', r);
          u.el('span', '', r, name);
          return r;
        };
        row('Home'); row('About us'); row('Products', 'rd-expand');
        row('Sustainability'); row('Blog', 'rd-expand rd-open');
        row('All posts', '', 1); row('How to reduce energy bills', '', 1);
        row(S.spec.project, 'rd-selected', 1);
        row('Keeping your home warm this winter', '', 1);
        row('The future of clean energy', '', 1);
        row('Resources', 'rd-expand'); row('Contact');
      },
      seoForm: (base, S) => function () {
        const u = S.ctx.util, form = S.P.pane('form', S.els.work, 'ab-form');
        u.el('h2', '', form, 'Page metadata');
        u.el('div', 'ab-hint', form, 'Improve how this page appears in search engines and social media.');
        const fields = S.spec.fields.slice().sort((a,b) =>
          ({title:0,slug:1,description:2}[a.id] ?? 3) - ({title:0,slug:1,description:2}[b.id] ?? 3));
        fields.forEach((def) => S.P.field(form, def, false, 'form'));
      },
      seoPreview: (base, S) => function () {
        const u = S.ctx.util, panel = S.P.pane('seoPreview', S.els.work, 'ab-main rd-inspector');
        const tabs = u.el('div', 'rd-inspector-tabs', panel);
        u.el('span', 'rd-active', tabs, 'Page'); u.el('span', '', tabs, 'Block');
        const body = u.el('div', 'rd-inspector-body', panel);
        const status = u.el('section', 'rd-inspector-section rd-status', body);
        u.el('div', 'rd-status-row', status, 'Status');
        u.el('span', 'rd-status-value', status, '◯  Draft');
        u.el('div', 'rd-detail-label', status, 'Last edited');
        u.el('div', 'rd-detail-value', status, '12 Jun 2014, 10:24');
        u.el('div', 'rd-detail-label', status, 'Edited by');
        u.el('div', 'rd-detail-value', status, S.spec.owner);
        const feature = u.el('section', 'rd-inspector-section rd-feature', body);
        u.el('h3', '', feature, 'Featured image');
        const image = u.el('img', '', feature);
        image.src = 'sites/design-use-site-builder-seo-05/assets/heat-pump.png';
        image.alt = '';
        const actions = u.el('div', 'rd-image-actions', feature);
        u.el('button', '', actions, 'Replace').type = 'button';
        u.el('button', 'rd-remove', actions, 'Remove').type = 'button';
        const details = u.el('section', 'rd-inspector-section rd-details', body);
        u.el('h3', '', details, 'Page details');
        [['Template','Blog post'],['Parent page','Blog'],
          ['URL','/blog/' + S.spec.project.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')],['Language','English (UK)']]
          .forEach(([key,value]) => {
            u.el('div', 'rd-detail-label', details, key);
            u.el('div', 'rd-detail-value' + (key === 'URL' ? '' : ' rd-dropdown'), details, value);
          });
      },
      paintSeo: (base, S) => function () {},
    },
  },
});
