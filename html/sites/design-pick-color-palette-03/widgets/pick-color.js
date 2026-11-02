// Keep the reference controls and side panel; size the academic layout from the stage.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-palette-03',
  name: 'design',
  split: 'train',
  scenarios: ['palette'],
  template: 'pick-color/base',
  design: {
    parts: {
      '+0.academicSize': () => (ctx) => {
        const width = Math.floor(ctx.size.width) - 8;
        const height = Math.floor(ctx.size.height) - 8;
        const compact = height < 540;
        const padding = compact ? 8 : 13;
        const gap = compact ? 8 : 12;
        const top = compact ? 122 : 158;
        const selected = compact ? 112 : 144;
        const pickerH = Math.max(96, Math.min(328, height - padding * 2 - gap * 2 - top - selected));
        return { width, height, compact, padding, gap, top, selected, pickerH,
          pickerW: Math.min(400, Math.floor(width - padding * 2 - 96)), hueW: compact ? 35 : 48 };
      },
      buildPicker: (base, S) => (ctx, card, maxH) => {
        // Preserve the template's four seeded layout draws.
        ctx.rng.int(230, 320);
        ctx.rng.pick([2, 4, 6]);
        ctx.rng.int(20, 30);
        const knob = ctx.rng.int(12, 16);
        const a = S.academicSize(ctx);
        const make = (role, width) => {
          const hit = ctx.util.el('div', 'cp-hit', card);
          hit.dataset.role = role;
          Object.assign(hit.style, { padding: '0', gridColumn: role === 'sv' ? '1' : '2', gridRow: '2' });
          const el = ctx.util.el('div', 'cp-' + role, hit);
          Object.assign(el.style, { width: width + 'px', height: a.pickerH + 'px', borderRadius: '0' });
          return { hit, el };
        };
        const sv = make('sv', a.pickerW), hue = make('hue', a.hueW);
        ctx.util.el('div', 'cp-sv-layer cp-sv-white', sv.el);
        ctx.util.el('div', 'cp-sv-layer cp-sv-black', sv.el);
        const dot = ctx.util.el('div', 'cp-knob', sv.el);
        Object.assign(dot.style, { width: knob + 'px', height: knob + 'px', margin: `${-knob / 2}px 0 0 ${-knob / 2}px` });
        const bar = ctx.util.el('div', 'cp-bar', hue.el);
        const pad = env.ui.pad(sv.hit, {
          label: 'sv',
          rect: () => { const r = sv.el.getBoundingClientRect(); return { left: r.left, top: r.top, width: a.pickerW - 1, height: a.pickerH - 1 }; },
          value: [ctx.model.s, 1 - ctx.model.v],
          onInput: ([s, v]) => S.commit({ s, v: 1 - v }),
        });
        const slider = env.ui.slider(hue.hit, {
          label: 'hue', thumbs: [bar], values: [ctx.model.h], min: 0, max: 360, keyboard: !!ctx.spec.keys,
          geometry: () => { const r = hue.el.getBoundingClientRect(), x = r.left + r.width / 2; return { start: [x, r.top], end: [x, r.top + a.pickerH - 1] }; },
          place: (el, point, f) => { el.style.top = f * (a.pickerH - 1) + 'px'; },
          onInput: ([h]) => S.commit({ h }),
        });
        return {
          anchors: [sv.el, hue.el],
          paint(m) {
            sv.el.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
            Object.assign(dot.style, { left: m.s * (a.pickerW - 1) + 'px', top: (1 - m.v) * (a.pickerH - 1) + 'px' });
            pad.set([m.s, 1 - m.v]); slider.set([m.h]);
          },
          locate(t, m) {
            if(t.surface === 'sv')return pad.locate(t.current ? [m.s, 1 - m.v] : [t.s, 1 - t.v]);
            if(t.surface === 'hue')return slider.locate(t.current ? m.h : t.h);
            return null;
          },
        };
      },
      buildSide: (base, S) => (ctx, parent, width, options) => {
        const result = base(ctx, parent, width, options);
        const a = S.academicSize(ctx);
        const side = parent.querySelector('.cp-side');
        Object.assign(side.style, { display: 'contents', padding: '0' });
        const boxes = Array.from(side.children);
        const top = ctx.util.el('div', 'academic-presets', side);
        Object.assign(top.style, { gridColumn: '1 / -1', gridRow: '1', display: 'flex', gap: '10px', minWidth: '0' });
        for(const box of boxes){
          const grid = box.querySelector('.cp-presets');
          if(grid){
            top.append(box);
            Object.assign(box.style, { flex: '1 1 0', minWidth: '0' });
            Object.assign(grid.style, { display: 'grid', gridTemplateColumns: `repeat(${ctx.spec.presets.length}, minmax(0, 1fr))`, gap: a.compact ? '5px' : '12px', padding: '4px 10px 8px' });
            for(const cell of grid.children){
              cell.style.minWidth = '0';
              const sw = cell.querySelector('.cp-preset');
              Object.assign(sw.style, { width: '100%', height: (a.compact ? 44 : 72) + 'px', borderRadius: '0' });
            }
          }else if(box.querySelector('.cp-fields, .cp-hex')){
            box.classList.add('academic-selected');
            Object.assign(box.style, { gridColumn: '1 / -1', gridRow: '3', width: Math.min(590, a.width - a.padding * 2) + 'px', display: 'grid', gridTemplateColumns: (a.compact ? 80 : 110) + 'px minmax(0, 1fr)', gap: '8px 18px', padding: '0 10px 10px', alignItems: 'center', boxSizing: 'border-box' });
            const label = box.querySelector('.cp-label');
            Object.assign(label.style, { gridColumn: '1 / -1', margin: '0 -10px', padding: '5px 12px' });
            const sw = box.querySelector('.cp-swatch');
            Object.assign(sw.style, { height: (a.compact ? 58 : 86) + 'px', margin: '0', borderRadius: '0' });
            const fields = box.querySelector('.cp-fields');
            if(fields)Object.assign(fields.style, { margin: '0', minWidth: '0', gap: '6px' });
          }else{
            top.append(box);
            Object.assign(box.style, { flex: '0 0 ' + (a.compact ? 80 : 110) + 'px', minWidth: '0' });
            const sw = box.querySelector('.cp-swatch');
            if(sw)Object.assign(sw.style, { height: (a.compact ? 44 : 72) + 'px', margin: '4px 10px 8px', borderRadius: '0' });
          }
        }
        return result;
      },
      placeCard: (base, S) => (card, ctx) => {
        const a = S.academicSize(ctx);
        Object.assign(card.style, { display: 'grid', boxSizing: 'border-box', width: a.width + 'px', height: a.height + 'px', padding: a.padding + 'px', gridTemplateColumns: `${a.pickerW}px ${a.hueW}px minmax(0, 1fr)`, gridTemplateRows: `${a.top}px ${a.pickerH}px auto`, gap: a.gap + 'px', alignContent: 'start' });
        base(card, ctx);
      },
    },
  },
});
