/* pan-map/_chrome: city frame parts; installed per page, preserving the city design API. */
(function () {
  'use strict';
  const sv = (tag, attrs, parent) => env.util.svg(tag, attrs, parent);

  function installShell(BASE, S) {
    const { MAP_COLORS } = env.templateLib('pan-map/_assets');
    BASE.cssText = (text) => {
      const colors = Object.fromEntries(Object.entries(MAP_COLORS).map(([key, color]) => [color, S.D.mapColors[key]]));
      return text.replace(/#[0-9a-f]{6}\b/gi, (color) => colors[color] ?? color)
        .replace('font:12px/1.4 system-ui,sans-serif;', `font:${S.D.font};`)
        .replaceAll('width:242px', `width:${S.D.panelWidth}px`)
        .replaceAll('width:190px', `width:${S.D.narrowPanelWidth}px`);
    };

    BASE.building = (ctx, parent, attrs) => sv('rect', attrs, parent);

    BASE.handle = (ctx, port, index) => {
      const el = ctx.util.el('div', 'mpe-handle', port, String(index + 1));
      el.dataset.waypoint = index;
      el.setAttribute('aria-label', `Waypoint ${index + 1}`);
      return el;
    };

    BASE.style = () => {
      if (document.getElementById('mp-style')) return;
      const s = document.createElement('style');
      s.id = 'mp-style';
      s.textContent = S.P.cssText(S.D.css);
      document.head.append(s);
    };

    // Local product frame: navigation and presentation state never enter task scoring.

    BASE.icon = (parent, name, n = 17) => {
      const svg = sv('svg', { width: n, height: n, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'mpp-icon' }, parent);
      sv('path', { d: S.D.icons[name] || S.D.icons.pin }, svg);
      return svg;
    };

    BASE.iconButton = (parent, name, title, text) => {
      const b = env.util.el('button', 'mpp-button', parent);
      S.P.icon(b, name); if (text) env.util.el('span', '', b, text);
      b.type = 'button'; b.title = title; b.setAttribute('aria-label', title); return b;
    };

    BASE.kindIcon = (p) => { return /cafe|bakery|grocer|market/.test(p.kind) ? 'food' : /station/.test(p.kind) ? 'route' : 'building'; };

    BASE.placeMeta = (ctx, p) => {
      const h = env.util.hash32(p.id + p.name), roads = ctx.spec.world.roads;
      return { rating: (4 + h % 9 / 10).toFixed(1), reviews: 24 + h % 310,
        address: p.address || `${12 + h % 180} ${roads[h % roads.length].name}`,
        hours: /hospital|hotel|station/.test(p.kind) ? 'Open 24 hours' : `Open until ${17 + h % 4}:00` };
    };

    BASE.productStyle = (ctx) => {
      ctx.css('map-product-polish', S.P.cssText(S.D.productCss));
    };

    BASE.shell = (ctx, editor) => {
      S.P.productStyle(ctx);
      const { spec } = ctx, r = ctx.rng.fork('product-chrome');
      const { width, height } = S.P.fit(ctx);
      const root = S.P.frame(ctx, width, height);
      const { top } = S.P.shellHeader(ctx, root, editor);
      const { work, rail, panel, foot, status, position, drawer, title, dc, db } = S.P.shellPanels(ctx, root);
      let active = null;
      const person = env.content.personName(r.fork('person'), { csplit: spec.csplit });
      function open(kind) {
        if (!drawer.hidden && active === kind) { drawer.hidden = true; return; }
        active = kind; drawer.hidden = false; db.replaceChildren();
        title.textContent = { saved: 'Saved maps', layers: 'Layers & legend', activity: 'Workspace activity', share: 'Share map' }[kind];
        S.P.drawerContent(ctx, root, db, kind, person);
      }
      S.P.navigation(ctx, rail, position, open, drawer);
      function finishTop() {
        S.P.topActions(ctx, top, person, open);
      }
      return { root, top, work, panel, foot, status, position, finishTop };
    };

    BASE.fit = (ctx) => {
      const { size } = ctx;
      const width = Math.floor(Math.min(S.D.maxWidth, size.width - S.D.widthInset)), height = Math.floor(Math.min(S.D.maxHeight, size.height - S.D.heightInset));

      return { width, height };
    };

    BASE.frame = (ctx, width, height) => {
      const { util } = ctx;
      const root = util.el('div', `mpe mp-product${width < S.D.narrowWidth ? ' narrow' : ''}`, ctx.stage);
      Object.assign(root.style, { width: width + 'px', height: height + 'px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--panel)' });

      return root;
    };

    BASE.shellHeader = (ctx, root, editor) => {
      const { util, spec } = ctx;
      const top = util.el('div', 'mpp-top', root), brand = util.el('div', 'mpp-brand', top);
      S.P.icon(brand, 'map', 21); brand.append(document.createTextNode(S.D.brand));
      const bar = util.el('div', 'mpp-project', root);
      util.el('span', '', bar, 'Operations'); S.P.icon(bar, 'chevron', 11);
      util.el('strong', '', bar, editor ? { pin: 'Field locations', route: 'Delivery planning', zone: 'Service coverage', zoomto: 'City survey' }[spec.scenario] : 'City explorer');
      util.el('span', 'mpp-tag', bar, 'Team workspace'); util.el('span', 'mpp-grow', bar);
      S.P.icon(bar, 'check', 12); util.el('span', '', bar, 'Offline copy up to date');

      return { top, bar };
    };

    BASE.shellPanels = (ctx, root) => {
      const { util } = ctx;
      const work = util.el('div', 'mpp-work', root), rail = util.el('nav', 'mpp-rail', work);
      rail.setAttribute('aria-label', 'Map workspace');
      const panel = util.el('aside', 'mpe-panel mpp-panel', work);
      const foot = util.el('div', 'mpp-foot', root), status = util.el('span', '', foot, 'Local survey / All changes saved');
      const position = util.el('span', '', foot, 'Local grid / North up');
      const drawer = util.el('div', 'mpp-drawer', root); drawer.hidden = true;
      const dh = util.el('div', 'mpp-drawer-head', drawer), title = util.el('span', '', dh);
      const dc = S.P.iconButton(dh, 'close', 'Close panel'); dc.addEventListener('click', () => { drawer.hidden = true; });
      const db = util.el('div', 'mpp-drawer-body', drawer);

      return { work, rail, panel, foot, status, position, drawer, title, dc, db };
    };
  }

  function installNavigation(BASE, S) {
    BASE.drawerContent = (ctx, root, db, kind, person) => {
      const { util } = ctx;
      if (kind === 'layers') {
        for (const [label, key] of [['Buildings', 'buildings'], ['Place labels', 'labels'], ['Parks & green space', 'parks']]) {
          const row = util.el('label', '', db), check = util.el('input', '', row); check.type = 'checkbox';
          check.checked = !root.querySelector('.mp-port').classList.contains('hide-' + key);
          util.el('span', '', row, label);
          check.addEventListener('change', () => root.querySelector('.mp-port').classList.toggle('hide-' + key, !check.checked));
        }
        util.el('div', 'mpp-note', db, 'Base map: Local streets\nReference system: Local survey grid');
        for (const text of ['Place / landmark', 'Road network', 'Park / recreation']) { const line = util.el('div', 'mpp-collection', db); S.P.icon(line, text.startsWith('Place') ? 'pin' : text.startsWith('Road') ? 'route' : 'map'); line.append(document.createTextNode(' ' + text)); }
      } else if (kind === 'saved') {
        ['Depot catchments', 'Weekend handoff', 'Neighbourhood survey', 'Retail field visits', 'Winter service areas', 'Archive / last quarter'].forEach((name, i) => {
          const row = util.el('div', 'mpp-collection', db); S.P.icon(row, 'folder'); util.el('strong', '', row, ' ' + name);
          util.el('small', '', row, `${i % 2 ? 'Private' : 'Operations team'} / ${3 + i * 2} saved places`);
        });
        util.el('div', 'mpp-note', db, 'Shared collections are read-only in this offline workspace.');
      } else if (kind === 'activity') {
        [person.full + ' updated Depot catchments', 'Field survey package is available', '2 service areas are awaiting review', 'Weekend handoff was shared with Operations', 'Offline map downloaded'].forEach((text, i) => {
          const row = util.el('div', 'mpp-collection', db); util.el('strong', '', row, text); util.el('small', '', row, `${i + 1} ${i ? 'hours' : 'hour'} ago / Operations`);
        });
      } else {
        util.el('strong', '', db, 'Only people in Operations can view this map.');
        util.el('p', 'mpp-meta', db, 'Offline changes stay on this device until the workspace reconnects.');
        const b = S.P.iconButton(db, 'share', 'Prepare map link', 'Prepare link');
        b.addEventListener('click', () => { const note = db.querySelector('.mpp-note') || util.el('div', 'mpp-note', db); note.textContent = 'Sharing is unavailable offline. Your map remains saved on this device.'; });
      }
    };

    BASE.navigation = (ctx, rail, position, open, drawer) => {
      const { util } = ctx;
      const explorer = S.P.iconButton(rail, 'map', 'Explore map'); explorer.classList.add('active'); explorer.addEventListener('click', () => { drawer.hidden = true; });
      for (const [kind, symbol, label] of [['saved', 'folder', 'Saved maps'], ['layers', 'layers', 'Layers and legend'], ['activity', 'bell', 'Workspace activity']]) {
        const b = S.P.iconButton(rail, symbol, label); b.addEventListener('click', () => open(kind));
        if (kind === 'activity') util.el('span', 'mpp-count', b, '2');
      }
      util.el('div', 'mpp-grow', rail); S.P.iconButton(rail, 'compass', 'North up').addEventListener('click', () => { position.textContent = 'North up / Rotation 0 degrees'; });
    };

    BASE.topActions = (ctx, top, person, open) => {
      const { util } = ctx;
      const actions = util.el('div', 'mpp-top-actions', top);
      S.P.iconButton(actions, 'folder', 'Saved maps', 'Saved').addEventListener('click', () => open('saved'));
      S.P.iconButton(actions, 'share', 'Share map', 'Share').addEventListener('click', () => open('share'));
      const avatar = util.el('div', 'mpp-avatar', actions, person.first[0] + person.last[0]); avatar.title = person.full + ' / Operations';
    };
  }

  env.template('pan-map/_chrome', () => ({
    install(BASE, S) {
      installShell(BASE, S);
      installNavigation(BASE, S);
    },
  }));
})();
