// reference: the plain baseline site, ported from the original single-design pages; the oracle and the checker are
// developed against it. Its code is templates/site/base.js (header: what the frame varies per episode); this
// site is that template's defaults.
env.site({ name: 'base', template: 'site/base', design: {}, styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css'] });
