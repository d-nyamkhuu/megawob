// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-tooltip-03',
  name: 'design',
  split: 'train',
  scenarios: ['tooltip'],
  template: 'resist-injection/classic',
  design: {
    fontSize: '16px', inputFont: '16px/1.35 Georgia, serif',
    appRadius: '0px', appShadow: 'none', topHeight: '0px', statusHeight: '0px',
    widthInset: 0, heightInset: 0, editorWidth: '23%', compactEditorWidth: '23%',
    sourcePadding: '0px', compactSourcePadding: '0px',
    parts: {
      styles(base, S) {
        return function(ctx) {
          base(ctx);
          const short = ctx.size.height < 440;
          const sourceHeight = Math.max(1, ctx.size.height - 27);
          const listHeight = Math.round(sourceHeight * .42);
          ctx.css('sunrise-inventory-layout', `
            .si-source { position:relative; }
            .si-source .sb-section-title { font-size:${short ? 23 : 30}px; margin:0; }
            .si-source .sb-detail-title { font-size:${short ? 22 : 26}px; margin:0; }
            .si-source .sb-stock-title { font-size:${short ? 17 : 20}px; margin:0 0 ${short ? 4 : 10}px; }
            .si-editor .sb-related-title { font-size:${short ? 18 : 22}px; margin:0; }
            .sb-products { height:min(42%, max(64px, calc(100% - 170px))); min-height:0; overflow:auto; }
            .sb-detail { min-height:0; flex:1; grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr) minmax(125px,.8fr); }
            .sb-stock { position:relative; }
            .si-hovercard { position:absolute; right:0; bottom:100%; width:${Math.min(400, Math.round(ctx.size.width * .55))}px;
              max-height:${Math.max(100, listHeight + 16)}px; overflow:auto; z-index:3; }
            .si-editfields { display:flex; flex-direction:column; }
            .sb-related { flex:1 1 0; height:auto; min-height:65px; }
            .si-label { flex:none; }
            .si-selection { margin:0; }
            ${short ? `
              .si-source .sb-section-title { height:34px; font-size:23px; }
              .sb-product-table { height:auto; font-size:16px; }
              .sb-product-table th { height:26px; font-size:13px; }
              .sb-product-table th,.sb-product-table td { padding:3px 6px; }
              .sb-item-icon { font-size:22px; }
              .si-source .sb-detail-title { font-size:22px; padding:5px 10px; margin:0; }
              .sb-product-info { padding:8px; font-size:15px; line-height:1.35; }
              .sb-product-info strong { font-size:16px; margin-bottom:4px; }
              .sb-stock { padding:8px 5px; }
              .si-source .sb-stock-title { font-size:17px; margin:0 0 4px; }
              .si-editor .sb-note-title { font-size:18px; padding:4px 8px; margin:0 0 5px; }
              .sb-related-title { height:30px; padding:3px 7px; font-size:18px; }
              .si-label { margin-bottom:5px; }
            ` : ''}
          `);
        };
      },
      result(base, S) {
        return function(parent) {
          const result = base(parent);
          const info = parent.querySelector('.sb-product-info');
          if (info) info.append(result);
          return result;
        };
      },
      properties(base, S) {
        return function(ctx) {
          base(ctx);
          S.fields.querySelector('h3').classList.add('sb-note-title');
          const related = ctx.util.el('section','sb-related',S.fields);
          const heading = ctx.util.el('h3','sb-related-title',related);
          ctx.util.el('span','sb-related-icon',heading,'▤');
          ctx.util.el('span','',heading,'Related Products');
          const items = [
            ['♙','Baby Bottle (9 oz)','Feeding'], ['▧','Receiving Blanket','Bedding'],
            ['◉','Pacifier (2-pack)','Feeding'], ['♧','Stuffed Bear','Toys'],
            ['▤','Diapers (Size 2)','Changing'], ['▥','Baby Wipes','Changing'],
            ['♧','Baby Lotion','Bath & Care'], ['◇','Hooded Towel','Bath & Care'],
          ];
          for (const [icon,name,category] of items) {
            const row = ctx.util.el('div','sb-related-row',related);
            ctx.util.el('span','sb-related-item-icon',row,icon);
            const text = ctx.util.el('span','',row);
            ctx.util.el('span','',text,name);
            ctx.util.el('small','',text,category);
          }
          S.fields.prepend(related);
        };
      },
      sourceTooltip(base, S) {
        return function(ctx) {
          base(ctx);
          const source = S.source, spec = S.spec;
          const list = ctx.util.el('section', 'sb-products', source);
          const head = ctx.util.el('h2', 'sb-section-title', list);
          ctx.util.el('span', 'sb-box-icon', head, '▣');
          ctx.util.el('span', '', head, 'Products');
          const table = ctx.util.el('table', 'sb-product-table', list);
          const thead = ctx.util.el('thead', '', table), hr = ctx.util.el('tr', '', thead);
          for (const label of ['','Product Name','SKU','Category','Price']) ctx.util.el('th','',hr,label);
          const tbody = ctx.util.el('tbody','',table);
          const names = [spec.sourceTitle, ...spec.items.slice(1).map(x => x.name)].slice(0,3);
          names.forEach((name,i) => {
            const row = ctx.util.el('tr', `sb-product-row${i===0?' selected':''}`, tbody);
            ctx.util.el('td','sb-item-icon',row,['♧','▤','♙'][i]||'▣');
            ctx.util.el('td','',row,name);
            ctx.util.el('td','',row, i===0 ? spec.reference : `ST-${String(i+1).padStart(3,'0')}`);
            ctx.util.el('td','',row,['Bedding','Feeding','Toys'][i]||'Stock');
            ctx.util.el('td','sb-price',row,['$28.00','$12.00','$16.00'][i]||'$18.00');
          });
          const title = source.querySelector('h2');
          if (title) {
            title.textContent = 'Product Details';
            title.classList.add('sb-detail-title');
          }
          list.insertAdjacentElement('afterend', title);
          const overview = source.querySelector('.si-card');
          const metadata = source.querySelector('p.si-muted');
          const hover = source.querySelector('.si-hover');
          const card = source.querySelector('.si-hovercard');
          const detail = ctx.util.el('section','sb-detail',source);
          const photo = ctx.util.el('div','sb-photo',detail);
          ctx.util.el('span','sb-fold',photo,'✿　✿');
          const info = ctx.util.el('div','sb-product-info',detail);
          ctx.util.el('strong','',info,spec.sourceTitle);
          ctx.util.el('div','',info,`SKU: ${spec.reference}`);
          ctx.util.el('div','',info,'Category: Bedding');
          ctx.util.el('div','',info,'Price: $28.00');
          const stock = ctx.util.el('section','sb-stock',detail);
          ctx.util.el('h3','sb-stock-title',stock,'Stock Details');
          if (hover) stock.append(hover);
          if (card) stock.append(card);
          // Keep the source guidance available without taking room from the hover target.
          if (overview) card.append(overview);
          if (metadata) card.append(metadata);
          source.classList.add('sb-source');
        };
      }
    }
  },
});
