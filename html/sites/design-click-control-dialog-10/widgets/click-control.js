// This design adds a portal directory and moves the dialog opener above the calibration panel.
(function () {
  'use strict';
  const ARCHIVE_ICON = '<svg viewBox="0 0 60 54" aria-hidden="true"><defs><linearGradient id="displaycal-drive" x2="0" y2="1"><stop stop-color="#e4e2dc"/><stop offset=".52" stop-color="#cac9c2"/><stop offset="1" stop-color="#a5a59e"/></linearGradient></defs><g stroke="#686963" stroke-width="1.4" fill="url(#displaycal-drive)"><rect x="3" y="33" width="54" height="18" rx="5"/><rect x="3" y="18" width="54" height="18" rx="5"/><rect x="3" y="3" width="54" height="18" rx="5"/></g><g fill="none" stroke="#eeeae3" stroke-width="1"><path d="M7 18h45M7 33h45M7 48h45M6 8v6M6 23v6M6 38v6"/></g><g fill="#b9bab2" stroke="#81847b" stroke-width=".65"><rect x="11" y="11" width="4" height="3"/><rect x="11" y="26" width="4" height="3"/><rect x="11" y="41" width="4" height="3"/><rect x="46" y="11" width="4" height="2"/><rect x="43" y="26" width="7" height="2"/><rect x="43" y="41" width="7" height="2"/></g></svg>';
  env.widget({
    task: 'click-control',
    site: 'design-click-control-dialog-10',
    name: 'design',
    split: 'train',
    scenarios: ['dialog'],
    traits: { menuOpen: ['hover', 'click'] },
    template: 'click-control/controls',
    design: {
      dlgIcon: ARCHIVE_ICON,
      dlgName: ['Archive name:', 'my_display_2004-06-12.zip'],
      dlgLocation: '/home/user/profiles',
      dlgReport: 'Include subfolders:',
      parts: {
        dialogBefore: (base) => (ctx, content) => {
          base(ctx, content);
          const { util } = ctx;
          const dir = util.el('div', 'portal-dir', content);
          [
            ['Arts & Humanities', 'Literature|History|Philosophy|Visual Arts|Performing Arts'],
            ['Education', 'Colleges & Universities|K-12|Distance Learning|Libraries'],
            ['News & Media', 'Newspapers|Magazines|Radio|Television|Weather'],
            ['Business & Economy', 'Companies|Investing|Jobs|Real Estate|Small Business'],
            ['Entertainment', 'Movies|Music|Humor|Books|Celebrities'],
            ['Recreation & Sports', 'Sports|Outdoors|Travel|Games|Hobbies'],
            ['Computers & Internet', 'Hardware|Software|Programming|Internet|Technical Support'],
            ['Health & Medicine', 'Diseases & Conditions|Fitness|Mental Health|Nutrition|Alternative Medicine'],
            ['Society & People', 'Government|Law|People Finder|Religion|Nonprofit Organizations'],
          ].forEach(([heading, labels]) => {
            const section = util.el('section', 'pd-sec', dir);
            util.el('h3', '', section, heading);
            labels.split('|').forEach((label) => util.el('a', '', section, label));
          });
          util.el('div', 'portal-opener-slot', content);
        },
        dialogOpener: (base) => (ctx, settings) => {
          const { spec, util } = ctx;
          if (spec.opener) {
            const opener = util.el('button', 'uc-btn', settings.parentNode.parentNode.querySelector('.portal-opener-slot'), spec.opener);
            opener.type = 'button';
            return opener;
          }
          base(ctx, settings);
          return null;
        },
      },
    },
  });
})();
