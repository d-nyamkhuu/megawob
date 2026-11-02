// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-retention-03',
  name: 'design',
  split: 'train',
  scenarios: ['retention'],
  template: 'protect-privacy/classic',
  design: {
    widthScale: 0.99,
    font: '13px/1.35 Arial, Helvetica, sans-serif',
    radius: '0px',
    parts: {
      fit: (base, S) => function (ctx) {
        const geo = base(ctx);
        // Keep the template's random draws, then bound the sheet to this stage.
        const fullW = Math.max(1, ctx.size.width - 2 * geo.M);
        const fullH = Math.max(1, ctx.size.height - 2 * geo.M);
        return { ...geo, fullW, fullH, winW: fullW, winH: fullH };
      },
      tabs: (base, S) => function (ctx) {
        base(ctx);
        S.win.querySelector('.sp-tabs').remove();
      },
      address: (base, S) => function (ctx) {
        base(ctx);
        S.win.querySelector('.sp-bar').remove();
      },
      frame: (base, S) => function (ctx) {
        const win = base(ctx);
        for (const [key, value] of Object.entries({
          '--bg': '#f4f4f4', '--panel': '#eee', '--fg': '#111',
          '--muted': '#444', '--line': '#888', '--accent': '#555',
        })) win.style.setProperty(key, value);
        return win;
      },
      view: (base, S) => function (m) {
        base(m);
        const app = S.app;
        const main = app && app.querySelector('.sp-acct-main');
        const cols = main && main.querySelector('.sp-cols');
        if (!cols) return;
        // The native compact view keeps every target visible in short stages.
        const compact = S.ctx.size.height < 570 || S.ctx.size.width < 850;
        main.style.minHeight = '0';
        main.style.gap = compact ? '6px' : '12px';
        main.style.padding = compact ? '8px' : '16px 20px';
        const nav = app.querySelector('.sp-crm-nav');
        if (nav) nav.style.width = compact ? '120px' : '190px';
        const top = main.firstElementChild;
        top.style.flexWrap = 'wrap';
        top.style.flex = 'none';
        if (top) {
          const heading = top.querySelector('.sp-h2');
          if (heading) heading.textContent = 'Your Data and Privacy';
          const intro = !compact && S.ctx.util.el('div', 'sp-retention-intro', main,
            'Download a copy of your data or delete specific categories from your Tessellate Cloud account. Select the categories to include or remove, and review delivery details.');
          if (intro) main.insertBefore(intro, top.nextSibling);
        }
        if (compact) {
          for (const card of cols.children) card.style.padding = '8px 10px';
          for (const row of cols.querySelectorAll('.sp-cb')) {
            row.style.fontSize = '13px';
            row.style.padding = '2px 0';
          }
          return;
        }
        const dl = cols.querySelector('.sp-card:has(.sp-rel)');
        const deletion = cols.querySelector('.sp-card:not(:has(.sp-rel))');
        if (!dl || !deletion) return;

        const el = (tag, cls, parent, text) => S.ctx.util.el(tag, cls, parent, text);
        const layout = el('div', 'sp-retention-layout', main);
        const categories = el('section', 'sp-card sp-retention-categories', layout);
        const options = el('section', 'sp-card sp-retention-options', layout);
        const title = dl.querySelector('.sp-sec');
        title.textContent = 'Data Categories';
        categories.append(title);
        const descriptions = [
          [/profile|account information/i, 'Profile details, email addresses, and account preferences.'],
          [/payment|billing|transaction/i, 'Transactions and billing records associated with this account.'],
          [/location|place/i, 'Places and location activity saved to your account.'],
          [/photo|video|image/i, 'Images and video files stored in your account.'],
          [/contact/i, "People and contact details you've connected with."],
          [/message|conversation/i, 'Direct messages and conversations.'],
          [/calendar|event/i, 'Events, schedules, and invitations.'],
          [/search/i, 'Searches and queries made in this account.'],
          [/watch|viewing/i, 'Videos and shows viewed with this account.'],
        ];
        for (const row of Array.from(dl.querySelectorAll(':scope > .sp-cb'))) {
          const label = row.children[1];
          const match = descriptions.find(([re]) => re.test(label.textContent));
          el('small', 'sp-retention-desc', label, match ? match[1] : 'Information saved in this account.');
          categories.append(row);
        }

        const req = main.querySelector('.sp-req');
        if (req) options.append(req);
        el('div', 'sp-sec', options, 'Download Options');
        const desc = dl.querySelector(':scope > .sp-muted');
        if (desc) options.append(desc);
        const delivery = dl.querySelector(':scope > .sp-rel');
        if (delivery) options.append(delivery);
        const request = dl.querySelector('[data-k="dl-go"]');
        if (request) options.append(request);
        for (const receipt of dl.querySelectorAll(':scope > .sp-ok')) options.append(receipt);

        deletion.classList.add('sp-retention-delete');
        options.append(deletion);
        cols.remove();
      },
    },
  },
});
