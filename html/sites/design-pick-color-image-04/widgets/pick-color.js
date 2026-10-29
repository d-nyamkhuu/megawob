// Design on templates/pick-color/base.js: the base site's pick-color widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-image-04',
  name: 'design',
  split: 'train',
  scenarios: ['image'],
  template: 'pick-color/base',
  design: {
    parts: {
      // Keep the template's controls, random draws and coordinate mapping. Only
      // allocate the reference design's two columns inside the available stage.
      'buildPicker': (base) => function (ctx, card, maxH) {
        const readoutH = Math.min(198, Math.max(142, Math.floor(ctx.size.height * .30)));
        const out = base(ctx, card, Math.min(maxH, ctx.size.height - readoutH - 32));
        Object.assign(card.style, {
          position: 'absolute', inset: '0', width: ctx.size.width + 'px',
          height: ctx.size.height + 'px', boxSizing: 'border-box', display: 'grid',
          gridTemplateColumns: 'minmax(0,56fr) minmax(0,44fr)',
          gridTemplateRows: 'minmax(0,1fr) ' + readoutH + 'px',
          gap: '8px', padding: '12px 14px', margin: '0', overflow: 'hidden'
        });
        const sv = card.querySelector('[data-role="sv"]');
        Object.assign(sv.style, {
          gridColumn: '2', gridRow: '1', alignSelf: 'start', padding: '0',
          minWidth: '0', minHeight: '0'
        });
        const hue = card.querySelector('[data-role="hue"]');
        Object.assign(hue.style, { position: 'absolute', right: '12px', top: '12px', padding: '0' });
        return out;
      },
      'buildSide': (base, S) => function (ctx, parent, width, o = {}) {
        const out = base(ctx, parent, width, o);
        const side = parent.querySelector('.cp-side');
        side.style.display = 'contents';
        const image = side.querySelector('.cp-img');
        const box = image.parentElement;
        Object.assign(box.style, {
          gridColumn: '1', gridRow: '1 / 3', minWidth: '0', minHeight: '0',
          border: '0', padding: '0', background: 'transparent'
        });
        // The tool has its own space below the illustration, including at the
        // smallest viewport and when the instruction occupies multiple lines.
        const tool = box.querySelector('.cp-tool');
        Object.assign(image.style, {
          width: '100%', height: Math.max(1, ctx.size.height - 24 - (tool ? 62 : 0)) + 'px',
          boxSizing: 'border-box'
        });
        box.querySelector('.cp-label').hidden = true;
        if (tool) Object.assign(tool.style, {
          display: 'flex', marginTop: '10px', width: '110px', height: '52px',
          flexDirection: 'column', justifyContent: 'center', gap: '1px'
        });
        const cur = (o.curHost || side).lastElementChild;
        const compact = ctx.size.height < 560;
        Object.assign(cur.style, {
          gridColumn: '2', gridRow: '2', alignSelf: 'stretch', minWidth: '0',
          padding: compact ? '6px 10px' : '8px 12px', boxSizing: 'border-box',
          display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(150px,.9fr)',
          gridTemplateRows: 'auto minmax(0,1fr)', columnGap: '18px'
        });
        const label = cur.querySelector('.cp-label');
        Object.assign(label.style, { gridColumn: '1 / 3', gridRow: '1', margin: '0 0 5px', padding: '0 0 5px' });
        const swatch = cur.querySelector('.cp-swatch');
        Object.assign(swatch.style, { gridColumn: '1', gridRow: '2', width: '100%', height: '100%', margin: '0', minHeight: '0' });
        const hex = cur.querySelector('.cp-hex');
        if (hex) Object.assign(hex.style, {
          display: 'block', gridColumn: '2', gridRow: '2', alignSelf: 'start',
          margin: '0', padding: compact ? '2px 6px' : '6px 8px'
        });
        const fields = cur.querySelector('.cp-fields');
        if (fields) Object.assign(fields.style, { gridColumn: '2', gridRow: '2', minWidth: '0', marginTop: '0' });
        if (!ctx.spec.fields) {
          const rgb = ctx.util.el('dl', 'cp-rgb-readout', cur);
          Object.assign(rgb.style, {
            gridColumn: '2', gridRow: '2', alignSelf: 'end', display: 'grid',
            gridTemplateColumns: '58px minmax(0,1fr)', gap: compact ? '2px 8px' : '3px 10px',
            margin: (compact ? '27px' : '37px') + ' 0 0', fontSize: compact ? '14px' : '18px'
          });
          const cells = [];
          for (const name of ['Red:', 'Green:', 'Blue:']) {
            ctx.util.el('dt', '', rgb, name);
            const cell = ctx.util.el('dd', '', rgb);
            Object.assign(cell.style, { height: compact ? '23px' : '32px', padding: compact ? '1px 6px' : '4px 10px' });
            cells.push(cell);
          }
          const paint = out.paint;
          out.paint = m => {
            paint(m);
            S.M().modelRgb(m).forEach((value, i) => { cells[i].textContent = String(value); });
          };
        }
        return out;
      },
    },
  },
});
