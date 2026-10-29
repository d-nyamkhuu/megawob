// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-pin-04',
  name: 'design',
  split: 'train',
  scenarios: ['pin'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    widthInset: 0,
    heightInset: 0,
    editorSearch: 'Search for an address or place',
    parts: {
      editorFrame(base, S) { return function(ctx, work) {
        const util = ctx.util;
        const side = util.el('aside', 'mpp-ipad-tools', work);
        const root = work.parentElement;
        const top = root.querySelector('.mpp-top');
        const brand = top.querySelector('.mpp-brand');
        const actions = top.querySelector('.mpp-top-actions');
        side.append(top);
        Object.assign(top.style, { height:'42px', flex:'none', padding:'0', border:'0', background:'transparent' });
        const toolsSlot = util.el('div', 'mpp-ipad-tool-slot', side);
        const saved = util.el('details', 'mpp-ipad-collection', side);
        const summary = util.el('summary', 'mpp-ipad-saved', saved);
        summary.innerHTML = '<b>◆</b> Saved Pins <span>›</span>';
        const collection = util.el('div', 'mpp-ipad-collection-body', saved);
        for (const element of [brand, actions, root.querySelector('.mpp-project'), work.querySelector('.mpp-rail'), work.querySelector('.mpp-panel'), root.querySelector('.mpp-foot')]) {
          collection.append(element);
          Object.assign(element.style, { width:'100%', height:'auto', flex:'none', border:'0', flexWrap:'wrap' });
        }
        const panel = collection.querySelector('.mpp-panel');
        Object.assign(panel.style, { height:'280px', minHeight:'280px' });
        saved.addEventListener('toggle', () => ctx.reanchor());
        side.insertAdjacentHTML('beforeend', '<div class="mpp-ipad-layers"><strong>Map Layers</strong><div><i>●</i> Points of Interest <em></em></div><div><i>▣</i> Transit <em></em></div><div><i>♣</i> Parks &amp; Green Spaces <em></em></div><div><i>♧</i> Bike Routes <em class="off"></em></div><div><i>┄</i> Transit Routes <em></em></div></div>');
        const result = base(ctx, work);
        const oldMap = result.map;
        oldMap.classList.add('mpp-ipad-map');
        return result;
      }; },
      editorTools(base, S) { return function(ctx, port, commit) {
        const { util, spec: s } = ctx;
        const parts = base(ctx, port, commit);
        const slot = port.closest('.mpp-work').querySelector('.mpp-ipad-tool-slot');
        parts.tools.classList.add('mpp-ipad-actions');
        Object.assign(parts.tools.style, { position:'static', flexDirection:'column', padding:'0 0 8px', border:'0', borderRadius:'0' });
        slot.append(parts.tools);
        parts.tools.insertAdjacentHTML('beforeend', '<button><b>⌁</b> Add Route Stop</button><button><b>▧</b> Draw Boundary</button>');
        return parts;
      }; },
      editorWorld(base, S) { return function(ctx, port, W, H) {
        const result = base(ctx, port, W, H);
        const ns = 'http://www.w3.org/2000/svg';
        const water = document.createElementNS(ns, 'path');
        const sx = ctx.spec.spacing[0], sy = ctx.spec.spacing[1];
        const cw = ctx.model.c[0], ch = ctx.model.c[1];
        water.setAttribute('d', `M${cw-1000} ${ch-1800}H${cw-700}C${cw-620} ${ch-1320},${cw-800} ${ch-1030},${cw-660} ${ch-740}S${cw-780} ${ch-120},${cw-620} ${ch+180}S${cw-800} ${ch+840},${cw-620} ${ch+1140}S${cw-720} ${ch+1540},${cw-460} ${ch+1800}H${cw-1000}Z`);
        water.setAttribute('fill', '#79c5fa'); water.setAttribute('opacity','.94');
        const firstStreet = result.world.querySelector('.mp-streets');
        result.world.insertBefore(water, firstStreet || null);
        const river = document.createElementNS(ns, 'path');
        river.setAttribute('d', `M${cw-1100} ${ch+390} C${cw-500} ${ch+150},${cw-100} ${ch+570},${cw+420} ${ch+390}S${cw+1320} ${ch+510},${cw+1900} ${ch+240}L${cw+1900} ${ch+520}C${cw+1300} ${ch+790},${cw+700} ${ch+730},${cw+230} ${ch+580}S${cw-560} ${ch+710},${cw-1100} ${ch+660}Z`);
        river.setAttribute('fill', '#79c5fa'); river.setAttribute('opacity','.9'); result.world.insertBefore(river, firstStreet || null);
        const grid = document.createElementNS(ns, 'path');
        let d = '';
        for (let x = -7; x <= 7; x++) d += `M${cw+x*sx/2} ${ch-1500}V${ch+1500}`;
        for (let y = -7; y <= 7; y++) d += `M${cw-1800} ${ch+y*sy/2}H${cw+2600}`;
        grid.setAttribute('d', d); grid.setAttribute('fill','none'); grid.setAttribute('stroke','#fff'); grid.setAttribute('stroke-width','7'); result.world.append(grid);
        for (const [name,x,y] of [['Northview',cw-300,ch-350],['West End',cw-700,ch+80],['Downtown',cw-300,ch+400],['Brookfield',cw+650,ch+80],['Riverside Park',cw-300,ch-270],['Maplewood Park',cw+585,ch+255]]) {
          const label = document.createElementNS(ns,'text'); label.classList.add('mpp-svg-label'); label.setAttribute('x',x); label.setAttribute('y',y); label.textContent = name;
          if (name.includes('Park')) label.classList.add('park'); result.world.append(label);
        }
        const greens = document.createElementNS(ns, 'g');
        for (const [dx,dy,rx,ry] of [[190,-360,160,110],[600,260,190,130],[-520,740,210,110],[950,720,150,95]]) {
          const park = document.createElementNS(ns,'path');
          park.setAttribute('d',`M${cw+dx-rx} ${ch+dy-ry/2} Q${cw+dx-rx/2} ${ch+dy-ry},${cw+dx} ${ch+dy-ry/2} T${cw+dx+rx} ${ch+dy} Q${cw+dx+rx/2} ${ch+dy+ry},${cw+dx-rx} ${ch+dy-ry/2}Z`);
          park.setAttribute('fill','#bce8ba'); park.setAttribute('opacity','.95'); greens.append(park);
        }
        const firstBuilding = result.world.querySelector('.mpe-block');
        result.world.insertBefore(greens, firstBuilding || null);
        return result;
      }; }
    }
  },
});
