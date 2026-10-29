(function () {
  'use strict';
  env.site({
    name: 'design-click-control-flyout-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref darkshop';
      // The native reference viewport can capture before the linked stylesheet is applied. Keep a
      // compact inline fallback for that size; the full stylesheet remains authoritative elsewhere.
      {
        const s = document.createElement('style');
        s.textContent = `html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#0d171b;color:#edf2f4}body.ref.darkshop{font:15px Arial,Helvetica,sans-serif;background:#0d171b;color:#edf2f4}.darkshop .shop-shell{height:100vh;display:flex;flex-direction:column;background:radial-gradient(ellipse at 58% 53%,#142126,#0c1519 70%);overflow:hidden}.darkshop .app-head{height:55px;flex:none;display:flex;align-items:center;padding:0 20px;border-bottom:1px solid #26343a;gap:16px;background:linear-gradient(#111b20,#0d171b)}.darkshop .app-brand{display:flex;align-items:center;gap:12px;width:calc(100% - 590px);font-size:20px;white-space:nowrap}.darkshop .brand-mark{font-size:30px;color:#a4f13b}.darkshop .app-search{height:38px;width:368px;flex:none;border:1px solid #34434a;border-radius:6px;background:#1a252b;color:#aebac1;display:flex;align-items:center;gap:14px;padding:0 14px;font-size:14px}.darkshop .search-glass{width:15px;height:15px;border:2px solid #ecf3f4;border-radius:50%;position:relative}.darkshop .bell{font-size:22px;margin-left:20px}.darkshop .avatar{height:30px;width:30px;border-radius:50%;display:grid;place-items:center;background:#a5ef34;color:#17300b;font-weight:700}.darkshop .account{font-size:14px;white-space:nowrap}.darkshop .menu-row{height:39px;flex:none;display:flex;align-items:center;gap:31px;padding:0 24px;border-bottom:1px solid #26343a;background:#0f191e;font-size:14px}.darkshop .action-row{height:54px;flex:none;display:flex;align-items:center;gap:32px;padding:0 27px;border-bottom:1px solid #26343a;background:#101a1f}.darkshop .action-item{display:flex;align-items:center;gap:10px;font-size:15px;white-space:nowrap}.darkshop .action-item i{font-size:22px;font-style:normal}.darkshop .action-item:first-child i{color:#a4ef32}.darkshop .action-item:nth-child(4){padding-right:26px;border-right:1px solid #46535a}.darkshop .shop-work{flex:1;min-height:0;display:flex;overflow:hidden}.darkshop .orders-rail{width:321px;flex:none;border-right:1px solid #29383e;background:linear-gradient(110deg,#131e23,#101a1f);overflow:hidden}.darkshop .rail-heading{height:53px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #29383e;font-size:18px}.darkshop .rail-heading a{color:#a3ef36;text-decoration:underline;font-size:15px}.darkshop .order-row{height:87px;border-bottom:1px solid #29383e;padding:12px 15px 7px 22px;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:23px 22px 20px;align-items:center}.darkshop .order-id{font:15px monospace;color:#b8e8f5;grid-column:1;grid-row:1;white-space:nowrap;overflow:hidden}.darkshop .order-price{grid-column:2;grid-row:2;white-space:nowrap}.darkshop .order-desc,.darkshop .order-date{color:#aab6bd;font:14px monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.darkshop .order-desc{grid-column:1;grid-row:2}.darkshop .order-date{grid-column:1;grid-row:3}.darkshop .shop-center{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;padding:12px 12px 0;overflow:hidden}.darkshop .instruction{z-index:20;flex:none;margin:0 0 9px;padding:8px 12px;border:1px solid #36464b;border-radius:4px;background:#172328;color:#dce7e8;font-size:14px;line-height:1.35;max-height:68px;overflow:auto}.darkshop .instruction[hidden]{display:none}.darkshop .instruction-panel{width:260px;flex:none;border-right:1px solid #29383e;padding:14px;background:#121e23}.darkshop .instruction-toast{position:absolute;top:8px;right:12px;width:min(390px,58%);z-index:25}.darkshop .stage{flex:1;min-height:0;min-width:0;position:relative;overflow:hidden}.darkshop .shop-footer{height:24px;flex:none;display:flex;align-items:center;border-top:1px solid #26343a;color:#77878e;font:11px monospace;padding:0 14px}.darkshop .chrome-submit,.darkshop .chrome-xtra{height:30px;padding:0 15px;border-radius:4px;background:#a2ed36;border:1px solid #aefa46;color:#10200b;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap}.darkshop .chrome-submit.toolbar,.darkshop .chrome-submit.header{margin-left:auto}.darkshop .chrome-submit.footer{margin-left:auto;height:22px}.darkshop .chrome-xtra{background:#1d292e;border-color:#45545b;color:#dbe2e3;font-weight:400}.darkshop .uc-page{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;left:0!important;top:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:visible!important}.darkshop .uc-nav{display:none!important}.darkshop .uc-body{height:100%;min-height:0}.darkshop .uc-side{display:none}.darkshop .uc-main{flex:1;min-width:0;display:flex;flex-direction:column;padding:0!important;min-height:0;position:relative}.darkshop .uc-crumb{display:none!important}.darkshop .uc-content{padding:0!important;height:100%;min-height:0;position:relative;display:flex;flex-direction:column;gap:13px}.darkshop .uc-shopbar{height:55px;flex:none;border:0;background:transparent;display:flex;align-items:center;gap:14px;padding:0 5px}.darkshop .uc-flywrap{position:relative;flex:none}.darkshop .uc-flytrig{height:42px;min-width:225px;padding:0 15px;border:1px solid #3b4a50;border-radius:5px;background:linear-gradient(#1d292e,#172228);color:#eef3f3;font:15px Arial,sans-serif;display:flex;align-items:center;gap:12px}.darkshop .uc-flytrig svg{width:17px;height:17px;color:#a5ee39}.darkshop .uc-shopsearch{height:38px;max-width:340px;flex:1;border:1px solid #34434a;border-radius:5px;background:#182329;color:#9eabb2;font:14px Arial,sans-serif;padding:10px 14px}.darkshop .uc-shoplinks{display:flex;gap:21px;color:#bac6ca;font-size:14px;white-space:nowrap}.darkshop .uc-prods{flex:1;min-height:0;width:100%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:12px;padding:0 5px 8px;overflow:hidden}.darkshop .uc-prod{min-width:0;border:1px solid #2b3b42;border-radius:5px;background:linear-gradient(145deg,#172329,#111b20);color:#eaf0f1;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;font:14px Arial,sans-serif;box-shadow:inset 0 1px #233238}.darkshop .uc-prod i{height:54%;margin:0 auto 8px;width:58%;border-radius:2px;background:radial-gradient(ellipse,#35434a,#1b292e 55%,transparent 57%);box-shadow:0 7px 8px #0007}.darkshop .uc-prod b{font-size:15px;font-weight:600;color:#f2f4f3;margin-bottom:6px}.darkshop .uc-mpanel{border:1px solid #45545a;border-radius:4px;background:#182329;box-shadow:0 8px 22px #0009;color:#edf2f4}.darkshop .uc-mi{border-radius:3px;color:#e4ebec;font:14px Arial,sans-serif;display:flex;align-items:center;justify-content:space-between}.darkshop .uc-mi:hover{background:#27373d;color:#b0f346}.darkshop .uc-mi .car{color:#a5ed37}.darkshop .perturb{background:#172329;border:1px solid #45545a;color:#edf2f4}.darkshop .perturb button{background:#a2ed36;color:#13200c;border:0;border-radius:4px}@media(max-width:1100px){.darkshop .orders-rail{width:230px}.darkshop .order-row{padding-left:12px;padding-right:10px}.darkshop .order-desc,.darkshop .order-date{font-size:12px}.darkshop .order-id,.darkshop .order-price{font-size:13px}.darkshop .action-row{gap:16px;padding:0 14px}.darkshop .menu-row{gap:18px}.darkshop .uc-shoplinks{display:none}.darkshop .instruction-panel{width:210px}}`;
        document.head.appendChild(s);
      }
      const shell = u.el('main', 'shop-shell', document.body);
      const head = u.el('header', 'app-head', shell);
      const brand = u.el('div', 'app-brand', head);
      brand.innerHTML = '<span class="brand-mark">◆</span><b>ProSupply</b>';
      const search = u.el('div', 'app-search', head);
      search.innerHTML = '<span class="search-glass"></span><span>Search products, SKUs, or brands...</span>';
      u.el('span', 'bell', head, '♧');
      const avatar = u.el('span', 'avatar', head, 'JD');
      u.el('span', 'account', head, 'Jordan Davis　⌄');
      const nav = u.el('nav', 'menu-row', shell);
      ['File', 'Edit', 'View', 'Inventory', 'Orders', 'Customers', 'Reports', 'Tools', 'Help'].forEach((x) =>
        u.el('span', 'menu-label', nav, x),
      );
      const bar = u.el('div', 'action-row', shell);
      [
        [
          '<svg viewBox="0 0 24 24"><path d="M3 4h2l2 12h12l2-8H6M9 20h.01M18 20h.01"/><path d="M8 8h12"/></svg>',
          'New Order',
        ],
        ['<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 13h7M9 17h7"/></svg>', 'Open'],
        ['<svg viewBox="0 0 24 24"><path d="M12 3 21 12 12 21 3 12zM12 8v5M12 17h.01"/></svg>', 'Save Draft'],
        ['<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v7M14 11v7"/></svg>', 'Delete'],
        [
          '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 0-14-5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2m0 4v-4h-4"/></svg>',
          'Refresh',
        ],
        ['<svg viewBox="0 0 24 24"><path d="M12 15V3m-5 5 5-5 5 5M5 14v6h14v-6"/></svg>', 'Export'],
      ].forEach(([svg, x]) => {
        const b = u.el('span', 'action-item', bar);
        const icon = u.el('i', '', b);
        icon.innerHTML = svg;
        u.el('span', '', b, x);
      });
      const work = u.el('div', 'shop-work', shell);
      const rail = u.el('aside', 'orders-rail', work);
      const rh = u.el('div', 'rail-heading', rail);
      u.el('b', '', rh, 'Recent Orders');
      u.el('a', '', rh, 'View All');
      [
        ['#SO-10483', 'Office Supplies', 'Apr 28, 2022', '$125.40'],
        ['#SO-10482', 'Paper Products', 'Apr 27, 2022', '$312.20'],
        ['#SO-10481', 'Breakroom', 'Apr 26, 2022', '$89.75'],
        ['#SO-10480', 'Ink & Toner', 'Apr 24, 2022', '$451.10'],
        ['#SO-10479', 'Cleaning Supplies', 'Apr 22, 2022', '$93.26'],
        ['#SO-10478', 'Office Furniture', 'Apr 21, 2022', '$1,204.00'],
        ['#SO-10477', 'Technology', 'Apr 19, 2022', '$668.35'],
        ['#SO-10476', 'Safety & PPE', 'Apr 15, 2022', '$214.90'],
        ['#SO-10475', 'Facilities', 'Apr 12, 2022', '$118.45'],
      ].forEach((row) => {
        const r = u.el('div', 'order-row', rail);
        u.el('span', 'order-id', r, row[0]);
        u.el('span', 'order-price', r, row[3]);
        u.el('span', 'order-desc', r, row[1]);
        u.el('span', 'order-date', r, row[2]);
      });
      const center = u.el('section', 'shop-center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const hero = u.el('section', 'store-hero', center);
      hero.style.backgroundImage =
        "linear-gradient(90deg,rgba(13,24,20,.28),transparent 66%),url('sites/design-click-control-flyout-02/assets/prosupply-hero.webp')";
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
      const heroCopy = u.el('div', 'hero-copy', hero);
      u.el('h1', '', heroCopy, 'Everything your');
      const h2 = u.el('h2', '', heroCopy);
      h2.append('business ', u.el('span', 'hero-accent', h2, 'needs'));
      u.el('p', '', heroCopy, 'Office supplies, technology, furniture and more —\nall in one place.');
      const photoCss = document.createElement('style');
      photoCss.textContent = `.darkshop .store-hero:before,.darkshop .store-hero:after{display:none!important}`;
      document.head.appendChild(photoCss);
      const hs = document.createElement('style');
      hs.textContent = `.darkshop .store-hero{height:276px;flex:none;position:relative;overflow:hidden;border-radius:6px;background:linear-gradient(90deg,#14211b,#17251d 43%,#182621 65%,#101719);box-shadow:inset 0 0 48px #0004}.darkshop .store-hero:before{content:'';position:absolute;right:6%;bottom:12%;width:42%;height:38%;background:linear-gradient(0deg,#392b20,#171d19 35%,transparent 36%);border-radius:45% 45% 2px 2px}.darkshop .store-hero:after{content:'';position:absolute;right:18%;bottom:16%;width:14%;height:78%;background:radial-gradient(ellipse at 50% 87%,#b9b9ab 0 20%,transparent 21%),radial-gradient(ellipse at 36% 22%,#456044 0 10%,transparent 11%),radial-gradient(ellipse at 63% 32%,#53704c 0 12%,transparent 13%),radial-gradient(ellipse at 50% 44%,#354d38 0 18%,transparent 19%);filter:drop-shadow(0 4px 8px #0008)}.darkshop .hero-copy{position:relative;z-index:2;padding:42px 56px}.darkshop .hero-copy h1,.darkshop .hero-copy h2{margin:0;color:#f6f8f7;font-size:clamp(38px,3.7vw,58px);font-weight:750;line-height:1.1;letter-spacing:-1px}.darkshop .hero-copy .hero-accent{color:#a2ee37}.darkshop .hero-copy p{margin:14px 0 0;color:#becbd0;font-size:23px;line-height:1.35;white-space:pre-line;max-width:620px}.darkshop .uc-prods{width:100%!important;max-width:none!important;box-sizing:border-box!important}@media(max-width:1280px){.darkshop .store-hero{height:150px}.darkshop .hero-copy{padding:20px 28px}.darkshop .hero-copy h1,.darkshop .hero-copy h2{font-size:clamp(27px,3.2vw,40px)}.darkshop .hero-copy p{font-size:16px;margin-top:5px;line-height:1.2}}@media(max-width:1100px),(max-height:680px){.darkshop .store-hero{height:100px}.darkshop .hero-copy{padding:11px 20px}.darkshop .hero-copy h1,.darkshop .hero-copy h2{font-size:24px;line-height:1}.darkshop .hero-copy p{font-size:12px;margin-top:3px}}`;
      document.head.appendChild(hs);
      const art = document.createElement('style');
      art.textContent = `.darkshop .uc-prod i{box-shadow:none!important;background:none!important;border-radius:0!important}.darkshop .uc-prod:nth-child(4n+1) i{height:58%!important;width:31%!important;border-radius:4px 4px 8px 8px!important;background:repeating-linear-gradient(90deg,#25343a 0 5px,#c57c32 6px 8px,#324b5a 9px 12px,#202b31 13px 16px)!important;box-shadow:0 4px 9px #0008!important}.darkshop .uc-prod:nth-child(4n+2) i{height:48%!important;width:52%!important;background:linear-gradient(165deg,#9aaab1 0 6%,#273b45 8% 73%,#111b20 75%),linear-gradient(#465c67,#18262d)!important;clip-path:polygon(7% 0,95% 8%,100% 88%,0 100%)!important;box-shadow:0 5px 8px #0008!important}.darkshop .uc-prod:nth-child(4n+3) i{height:57%!important;width:39%!important;background:linear-gradient(90deg,transparent 0 42%,#495a60 44% 56%,transparent 58%),linear-gradient(0deg,#27363b 0 12%,transparent 13%),linear-gradient(90deg,transparent 0 12%,#34434a 14% 22%,transparent 24% 76%,#34434a 78% 86%,transparent 88%)!important;clip-path:polygon(20% 0,80% 0,88% 52%,100% 58%,95% 64%,78% 62%,76% 100%,24% 100%,22% 62%,5% 64%,0 58%,12% 52%)!important}.darkshop .uc-prod:nth-child(4n) i{height:50%!important;width:47%!important;background:linear-gradient(90deg,transparent 0 48%,#775334 49% 52%,transparent 53%),linear-gradient(155deg,#d1a16d 0 48%,#865a36 49% 52%,#b98552 54% 100%)!important;clip-path:polygon(4% 18%,52% 0,100% 18%,100% 88%,54% 100%,4% 87%)!important;box-shadow:0 5px 8px #0008!important}.darkshop .store-hero:after{background:radial-gradient(ellipse at 50% 87%,#c2c1b5 0 18%,transparent 19%),radial-gradient(ellipse at 35% 21%,#4b6a45 0 8%,transparent 9%),radial-gradient(ellipse at 57% 17%,#52734b 0 9%,transparent 10%),radial-gradient(ellipse at 72% 27%,#3f6040 0 10%,transparent 11%),radial-gradient(ellipse at 28% 35%,#476743 0 10%,transparent 11%),radial-gradient(ellipse at 48% 39%,#38573a 0 12%,transparent 13%),radial-gradient(ellipse at 67% 47%,#4d7048 0 10%,transparent 11%),radial-gradient(ellipse at 32% 54%,#537448 0 9%,transparent 10%),radial-gradient(ellipse at 51% 62%,#3d5b3b 0 11%,transparent 12%)}.darkshop .action-item i{display:flex;align-items:center;justify-content:center;width:22px;height:22px;font-size:18px}`;
      document.head.appendChild(art);
      const responsive = document.createElement('style');
      responsive.textContent = `.darkshop .has-panel-note{display:grid!important;grid-template-columns:minmax(0,1fr) 260px;grid-template-rows:276px minmax(0,1fr);gap:12px}.darkshop .has-panel-note .instruction{grid-column:2;grid-row:1;margin:0;align-self:start}.darkshop .has-panel-note .store-hero{grid-column:1;grid-row:1}.darkshop .has-panel-note .stage{grid-column:1/-1;grid-row:2;min-height:0}.darkshop .uc-prod i{position:static!important;display:block!important;flex:none!important;height:35%!important;width:45%!important;margin:0 auto 8px!important}.darkshop .uc-prod:nth-child(4n+1) i,.darkshop .uc-prod:nth-child(4n+2) i,.darkshop .uc-prod:nth-child(4n+3) i,.darkshop .uc-prod:nth-child(4n) i{height:35%!important}@media(max-width:1280px){.darkshop .has-panel-note{grid-template-rows:150px minmax(0,1fr)}}@media(max-width:1100px),(max-height:680px){.darkshop .has-panel-note{display:flex!important;flex-direction:column!important;gap:0!important}.darkshop .has-panel-note .instruction{order:0;margin:0 0 8px}.darkshop .has-panel-note .store-hero{order:1}.darkshop .has-panel-note .stage{order:2;flex:1}}`;
      document.head.appendChild(responsive);
      const iconCss = document.createElement('style');
      iconCss.textContent = `.darkshop .action-item i{font-size:0!important}.darkshop .action-item i svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.darkshop .action-item:first-child i{color:#a4ef32}`;
      document.head.appendChild(iconCss);
      const narrow = document.createElement('style');
      narrow.textContent = `@media(max-width:1100px){.darkshop .uc-prods{grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:minmax(82px,1fr)!important;overflow-y:auto!important}.darkshop .uc-prod{min-height:82px!important}}`;
      document.head.appendChild(narrow);
      const productPhotos = document.createElement('style');
      productPhotos.textContent = `.darkshop .uc-prod i{position:static!important;display:block!important;flex:none!important;width:82%!important;height:55%!important;min-height:64px!important;margin:0 auto 5px!important;border:0!important;border-radius:3px!important;clip-path:none!important;background-image:url('sites/design-click-control-flyout-02/assets/prosupply-products.webp')!important;background-size:200% 200%!important;background-repeat:no-repeat!important;background-color:#142126!important;box-shadow:none!important}.darkshop .uc-prod:nth-child(4n+1) i{background-image:url('sites/design-click-control-flyout-02/assets/prosupply-products.webp')!important;background-size:200% 200%!important;background-position:0 0!important}.darkshop .uc-prod:nth-child(4n+2) i{background-image:url('sites/design-click-control-flyout-02/assets/prosupply-products.webp')!important;background-size:200% 200%!important;background-position:100% 0!important}.darkshop .uc-prod:nth-child(4n+3) i{background-image:url('sites/design-click-control-flyout-02/assets/prosupply-products.webp')!important;background-size:200% 200%!important;background-position:0 100%!important}.darkshop .uc-prod:nth-child(4n) i{background-image:url('sites/design-click-control-flyout-02/assets/prosupply-products.webp')!important;background-size:200% 200%!important;background-position:100% 100%!important}@media(max-width:1100px){.darkshop .uc-prod{padding:6px!important;justify-content:center!important;overflow:hidden!important}.darkshop .uc-prod i{height:24px!important;min-height:24px!important;max-height:24px!important;width:68%!important;margin:0 auto 2px!important}.darkshop .uc-prod b{font-size:12px!important;margin-bottom:2px!important}}`;
      document.head.appendChild(productPhotos);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'shop-footer', shell);
      u.el('span', 'foot-status', foot, '●　Inventory synced');
      if (ctx.display === 'panel') center.classList.add('has-panel-note');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const bank = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const val = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = er.bool(0.5) ? 'Apply' : val(er.pick(bank.filter((x) => val(x) !== 'Apply')));
      const place = er.pick(['toolbar', 'toolbar', 'footer', 'header']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [...new Set(bank.map(val).filter((x) => x.toLowerCase() !== label.toLowerCase()))];
        if (choices.length) collide = cr.pick(choices);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish) {
        const p = place === 'toolbar' ? bar : place === 'header' ? head : foot;
        submit = u.el('button', 'chrome-submit ref-submit ' + place, p, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
        if (collide) decoy(bar, collide);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
