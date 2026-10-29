// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('folio-header');
      const mast = util.el('div', 'folio-mast', header);
      const brandMark = util.el('span', 'folio-mark', mast, '◧');
      brandMark.setAttribute('aria-hidden', 'true');
      util.el('strong', 'folio-brand', mast, 'POCKET ATLAS');
      const folioNav = util.el('nav', 'folio-nav', mast);
      for (const item of ['Explore', 'Saved', 'Trips', 'Maps', 'Community']) {
        const a = util.el('a', item === 'Saved' ? 'folio-tab active' : 'folio-tab', folioNav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'folio-search', mast, '⌕');
      S.frameBrand(_c, header);
      Object.assign(_c, { brandMark, folioNav, header, mast, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stats = util.el('aside', 'folio-stats', document.body);
      util.el('div', 'folio-stats-title', stats, '▥　My reading activity');
      for (const [caption, value] of [['Articles read', '24'], ['Saved to lists', '8'], ['Comments', '3']]) {
        const row = util.el('div', 'folio-stats-row', stats);
        util.el('span', '', row, caption);
        util.el('span', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, stats });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const workspace = util.el('div', 'atlas-workspace', body);
      const banner = util.el('section', 'atlas-banner', workspace);
      const heroMeta = util.el('div', 'atlas-hero-details', banner);
      util.el('strong', 'atlas-banner-title', heroMeta, 'FIND A VIEWPOINT');
      const stage = util.el('main', 'ref-stage', workspace);
      S.frameAlign(_c, stage);
      util.el('div', 'atlas-hero-meta', heroMeta, '⌖　Pocket Atlas　　☆　4.8　　▣　Photos');
      util.el('div', 'atlas-hero-description', heroMeta, 'Discover a memorable view, then keep it close for your next trip.');
      util.el('div', 'atlas-hero-tags', heroMeta, 'Viewpoints　　City views　　Sunset　　Photogenic');
      const mapPin = util.el('span', 'atlas-hero-pin', banner, '●');
      mapPin.setAttribute('aria-hidden', 'true');
      Object.assign(_c, { heroMeta, mapPin, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tips = util.el('div', 'atlas-tipbar', foot);
        const tipTitle = util.el('strong', 'atlas-tip-title', tips);
        tipTitle.innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M16 2a11 11 0 0 0-7 19c2 2 3 4 3 6h8c0-2 1-4 3-6A11 11 0 0 0 16 2Z"/><path d="M12 31h8m-7 3h6"/></svg><span>Tips</span>';
        const tip1 = util.el('span', 'atlas-tip', tips);
        tip1.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 7h14v4H5zm0 7h14v4H5zm0 7h9v4H5zM22 16l3 3 5-6"/></svg><span>Collections keep places organised for your trips.</span>';
        const tip2 = util.el('span', 'atlas-tip', tips);
        tip2.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m3 8 8-4 10 4 8-4v20l-8 4-10-4-8 4zM11 4v20m10-16v20"/></svg><span>Add a place to multiple collections later.</span>';
        const tip3 = util.el('span', 'atlas-tip', tips);
        tip3.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="9" r="4"/><circle cx="6" cy="13" r="3"/><circle cx="26" cy="13" r="3"/><path d="M8 27c0-6 3-10 8-10s8 4 8 10zm-7-1c0-4 2-7 6-7m24 7c0-4-2-7-6-7"/></svg><span>Your collections are private by default.</span>';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-nag-04',
    template: 'site/base',
    design: { parts },
  });
})();
