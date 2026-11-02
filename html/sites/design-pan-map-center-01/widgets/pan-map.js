// Default center design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-center-01',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: { maxWidth: 2400, maxHeight: 1400, widthInset: 0, heightInset: 0, panelWidth: 374,
    maxMapWidth: 920, brand: 'City Explorer', mapHeaderHeight: 0, font: '14px/1.25 Arial,sans-serif',
    parts: {
      explorerHeading: (base, S) => (ctx, panel) => {
        const section = ctx.util.el('div', 'mpe-section', panel);
        const heading = ctx.util.el('div', 'mpe-heading', section);
        ctx.util.el('span', '', heading, 'Places');
        ctx.util.el('span', 'map-place-count', heading, `${ctx.spec.places.length} places`);
        return section;
      },
      explorerFrame: (base, S) => (ctx, chrome) => {
        const frame = base(ctx, chrome);
        frame.head.querySelector('.mp-title').textContent = 'City Map';
        return frame;
      },
      filter: (base, S) => (ctx, parent, label, active) => {
        const count = label === 'All places' ? ctx.spec.places.length : ctx.spec.places.filter((p) =>
          label === 'Food' ? /cafe|market|bakery|grocer/.test(p.kind) : /station|museum|library|university/.test(p.kind)).length;
        const button = base(ctx, parent, `${label}   ${count}`, active);
        return button;
      },
      directoryEnd: (base, S) => (ctx, list, count) => {
        base(ctx, list, count);
        const panel = list.parentElement;
        panel.querySelector('.map-status')?.remove();
        const status = ctx.util.el('section', 'map-status', panel);
        ctx.util.el('div', 'map-status-title', status, 'Map Status');
        const visible = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', visible, 'Visible Places');
        ctx.util.el('b', 'map-visible-count', visible, String(count));
        const zoom = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', zoom, 'Zoom Level');
        ctx.util.el('b', 'map-zoom-level', zoom, String(ctx.model.z));
        const centre = ctx.util.el('div', 'map-status-row', status);
        ctx.util.el('span', '', centre, 'Centre');
        ctx.util.el('b', 'map-centre', centre, ctx.model.c.map((n) => Math.round(n)).join(', '));
      },
      explorerPaint: (base, S) => (ctx, elements, model) => {
        base(ctx, elements, model);
        const port = ctx.stage.querySelector('.mp-port');
        const svg = port?.querySelector('.mp-svg');
        const geography = svg?.querySelector('g');
        if (svg && geography && !svg.querySelector('#map-block-texture')) {
          svg.insertAdjacentHTML('afterbegin', `<defs>
            <pattern id="map-block-texture" width="150" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <rect width="150" height="120" fill="#e9e7e3"/>
              <path d="M3 3h44v34H3zM53 43h44v34H53zM103 83h44v34h-44z" fill="#e2e0dc"/>
              <path d="M53 3h44v34H53zM103 43h44v34h-44zM3 83h44v34H3z" fill="#edeae4"/>
              <path d="M0 0H150V120H0Z" fill="none" stroke="#fff" stroke-width="5"/>
              <path d="M50 0V120M100 0V120M0 40H150M0 80H150" fill="none" stroke="#faf9f6" stroke-width="1.8"/>
              <path d="M7 8h35M7 15h35M57 48h35M57 55h35M107 88h35M107 95h35" stroke="#f3f1ec" stroke-width="1"/>
            </pattern>
            <pattern id="map-park-texture" width="180" height="160" patternUnits="userSpaceOnUse">
              <rect width="180" height="160" fill="#c4e6b7"/>
              <path d="M0 12L55 0 91 43 64 85 0 62ZM180 40L135 17 105 66 125 111 180 98Z" fill="#b5dda6" opacity=".55"/>
              <path d="M10 160L25 109 83 93 122 139 116 160Z" fill="#aedb9e" opacity=".4"/>
            </pattern>
            <linearGradient id="map-water-shade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#88cef9"/><stop offset="1" stop-color="#93d2f7"/></linearGradient>
          </defs>`);
        }
        if (geography && !geography.querySelector('.map-blocks')) {
          geography.insertAdjacentHTML('afterbegin', '<rect class="map-blocks" x="-2000" y="-2000" width="8200" height="8200" fill="url(#map-block-texture)" pointer-events="none"/>');
        }
        const categories = { station: 'Transport Hub', museum: 'Museum', hospital: 'Hospital', medical: 'Hospital', school: 'School', college: 'College', library: 'Library', stadium: 'Stadium', park: 'Park', marina: 'Marina', river: 'Natural Feature', market: 'Market', theatre: 'Theatre', cafe: 'Café', bakery: 'Bakery', pharmacy: 'Pharmacy' };
        const markerColor = (place) => {
          const type = `${place.kind || ''} ${place.name || ''}`.toLowerCase();
          if (/hospital|medical|clinic|pharmacy/.test(type)) return '#e92e49';
          if (/station|transport|marina|harbor/.test(type)) return '#0052f5';
          if (/museum|gallery|theatre/.test(type)) return '#873ce5';
          if (/school/.test(type)) return '#8bcfff';
          if (/library|market|cafe|bakery/.test(type)) return '#f18a00';
          if (/park|stadium|college|university/.test(type)) return '#348e43';
          return '#07875f';
        };
        const iconFor = (place) => {
          const kind = String(place.kind || '').toLowerCase();
          const type = kind && !/^(venue|place|other)$/.test(kind) ? kind : String(place.name || '').toLowerCase();
          if (/hospital|medical|clinic|pharmacy/.test(type)) return '<path fill="currentColor" d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z"/>';
          if (/station|transport/.test(type)) return '<rect x="5" y="2" width="14" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 10h14M9 3v4m6-4v4M8 19l-3 3m11-3 3 3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="15" r="1.5" fill="currentColor"/><circle cx="15" cy="15" r="1.5" fill="currentColor"/>';
          if (/museum|gallery|theatre|chapel|church/.test(type)) return '<path d="M2 7l10-5 10 5zM3 20h18v2H3zM4 9h3v10H4zm6 0h4v10h-4zm7 0h3v10h-3z" fill="currentColor"/>';
          if (/school|college|university/.test(type)) return '<path d="M1 8l11-5 11 5-11 5zm5 4v5c4 3 8 3 12 0v-5l-6 3z" fill="currentColor"/><path d="M22 9v9" stroke="currentColor" stroke-width="2"/>';
          if (/stadium/.test(type)) return '<path d="M4 9v6c0 8 16 8 16 0V9M8 13c0 5 8 5 8 0" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="8" cy="5" r="2" fill="currentColor"/><circle cx="16" cy="5" r="2" fill="currentColor"/>';
          if (/library/.test(type)) return '<path d="M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2z" fill="currentColor"/><path d="M12 5v16" stroke="#e48b13" stroke-width="1.4"/>';
          if (/park|garden|\bwood\b|\bfield\b/.test(type)) return '<path fill="currentColor" d="M12 1L5 11h3l-5 7h7v5h4v-5h7l-5-7h3z"/>';
          if (/marina|harbor/.test(type)) return '<path fill="currentColor" d="M11 2v15H2zm2 3l8 12h-8zM2 19h20l-3 3H5z"/>';
          if (/river|pool|lake/.test(type)) return '<path d="M2 7q3-4 6 0t6 0 6 0M2 12q3-4 6 0t6 0 6 0M2 17q3-4 6 0t6 0 6 0" fill="none" stroke="currentColor" stroke-width="2.5"/>';
          return null;
        };
        const paintIcon = (badge, place) => {
          if (!badge) return;
          badge.style.setProperty('background-color', markerColor(place), 'important');
          const icon = iconFor(place);
          if (icon) badge.innerHTML = `<svg class="map-symbol" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`;
        };
        for (const item of ctx.stage.querySelectorAll('.mpe-item')) {
          const name = item.querySelector('.mpe-name')?.textContent || '';
          const place = ctx.spec.places.find((p) => p.name === name);
          if (place) paintIcon(item.querySelector('.mpe-badge'), place);
          const address = item.querySelector('.mpe-address');
          if (address && place) {
            const kind = String(place.kind || '').toLowerCase();
            address.textContent = Object.entries(categories).find(([key]) => kind.includes(key))?.[1] || (/^(venue|place|other)$/.test(kind) ? Object.entries(categories).find(([key]) => name.toLowerCase().includes(key))?.[1] : '') || (kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : 'Place');
          }
          item.querySelectorAll('.mpe-address').forEach((node, index) => {
            if (index) node.style.setProperty('display', 'none', 'important');
          });
        }
        for (const pin of ctx.stage.querySelectorAll('.mp-pin')) {
          const name = pin.querySelector('.mp-name')?.textContent || '';
          const place = ctx.spec.places.find((p) => p.name === name);
          if (place) paintIcon(pin.querySelector('.mp-dot'), place);
        }
        for (const label of ctx.stage.querySelectorAll('.mp-lbl.mp-district')) {
          label.textContent = label.textContent.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
        }
        const list = ctx.stage.querySelector('.mpe-list');
        if (list) {
          const panel = list.closest('.mpe-panel');
          let track = panel?.querySelector('.map-scroll-track');
          if (track && track._mapList !== list) { track.remove(); track = null; }
          if (panel && !track) {
            track = ctx.util.el('div', 'map-scroll-track', panel);
            const thumb = ctx.util.el('div', 'map-scroll-thumb', track);
            track._mapList = list;
            const updateThumb = () => {
              const extent = track.clientHeight;
              const thumbHeight = Math.min(275, Math.max(110, extent * list.clientHeight / Math.max(list.scrollHeight, 1)));
              thumb.style.height = `${thumbHeight}px`;
              thumb.style.top = `${(extent - thumbHeight) * list.scrollTop / Math.max(list.scrollHeight - list.clientHeight, 1)}px`;
            };
            list.addEventListener('scroll', updateThumb, { passive: true });
            track._updateThumb = updateThumb;
          }
          track?._updateThumb?.();
        }
        const status = ctx.stage.querySelector('.map-status');
        if (!status) return;
        status.querySelector('.map-zoom-level').textContent = String(model.z);
        status.querySelector('.map-centre').textContent = model.c.map((n) => Math.round(n)).join(', ');
      },
    } },
});
