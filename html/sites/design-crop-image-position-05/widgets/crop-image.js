// Studio photograph treatment; the shared widget retains all crop interactions and anchors.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-position-05',
  name: 'design',
  split: 'train',
  scenarios: ['position'],
  template: 'crop-image/base',
  design: {
    parts: {
      'box.traits': (base) => ({ ...base, aspect: 0.95 }),
      'boxFit': (base, S) => function (spec, rng, size, tools, pan) {
        const result = base(spec, rng, size, tools, pan);
        S.H = Math.floor(Math.min(size.height - 16, (size.width * .567 - 26) / spec.aspect));
        S.W = Math.round(S.H * spec.aspect);
        return result;
      },
      'placeIn@0': (base) => function (ctx, el, rng, pad) {
        base(ctx, el, rng, pad);
        Object.assign(el.style, { position: 'absolute', left: '0px', top: '0px', width: '56.7%', height: '100%', transform: 'none' });
      },
      'drawScene@0': (base, S) => function (g, spec, fam, rng) {
        // Run the original painter first so its random stream is consumed unchanged.
        base(g, spec, fam, rng);
        const W = S.W, H = S.H;
        let bg = g.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#a3a09e'); bg.addColorStop(.5, '#b5b0ac'); bg.addColorStop(1, '#8f8a87');
        g.fillStyle = bg; g.fillRect(0, 0, W, H);
        const horizon = H * Math.min(.44, ...(spec.objects || []).map(o => o.box.b * .86));
        const floor = g.createLinearGradient(0, horizon, 0, H);
        floor.addColorStop(0, '#9d9893'); floor.addColorStop(.18, '#aaa49b'); floor.addColorStop(1, '#c2bbb0');
        g.fillStyle = floor; g.fillRect(0, horizon, W, H);
        const tone = (hex, amount) => {
          const c = /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#2374b0';
          return '#' + [1, 3, 5].map(i => Math.round(Math.max(0, Math.min(255, parseInt(c.slice(i, i + 2), 16) * amount))).toString(16).padStart(2, '0')).join('');
        };
        for (const o of spec.objects || []) {
          const b = o.box || { l: o.sq.x, t: o.sq.y, r: o.sq.x + o.sq.w, b: o.sq.y + o.sq.h };
          const x = b.l * W, y = b.t * H, w = (b.r - b.l) * W, h = (b.b - b.t) * H;
          const c = o.hex || '#2374b0', shape = o.shape || 'circle';
          g.save();
          g.fillStyle = '#171915'; g.shadowColor = '#161714'; g.shadowBlur = Math.max(5, w * .08);
          g.shadowOffsetX = -w * .05; g.shadowOffsetY = h * .025;
          g.globalAlpha = .42; g.beginPath(); g.ellipse(x + w * .48, y + h * .98, w * .49, h * .07, -.12, 0, Math.PI * 2); g.fill();
          g.restore();
          const path = new Path2D();
          if (/circle|ellipse|oval/.test(shape)) {
            path.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
            const light = g.createRadialGradient(x + w * .71, y + h * .25, w * .02, x + w * .61, y + h * .36, w * .76);
            light.addColorStop(0, tone(c, 1.34)); light.addColorStop(.28, tone(c, 1.04)); light.addColorStop(.65, tone(c, .65)); light.addColorStop(.9, tone(c, .28)); light.addColorStop(1, tone(c, .15));
            g.fillStyle = light; g.fill(path);
          } else if (/triangle/.test(shape)) {
            path.moveTo(x + w / 2, y); path.lineTo(x + w, y + h * .92);
            path.bezierCurveTo(x + w * .97, y + h * 1.025, x + w * .12, y + h * 1.025, x, y + h * .92); path.closePath();
            const light = g.createLinearGradient(x, y, x + w, y);
            light.addColorStop(0, tone(c, .28)); light.addColorStop(.3, tone(c, .65)); light.addColorStop(.65, tone(c, 1.2)); light.addColorStop(1, tone(c, .7));
            g.fillStyle = light; g.fill(path);
            if (/purple|violet/.test(o.color)) {
              g.fillStyle = tone(c, .51); g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w * .58, y + h); g.lineTo(x, y + h * .92); g.fill();
            }
          } else if (/square|rect/.test(shape)) {
            path.moveTo(x, y + h * .11); path.lineTo(x + w * .66, y); path.lineTo(x + w, y + h * .16); path.lineTo(x + w, y + h * .89); path.lineTo(x + w * .31, y + h); path.lineTo(x, y + h * .83); path.closePath();
            const light = g.createLinearGradient(x, y, x + w, y + h);
            light.addColorStop(0, tone(c, 1.25)); light.addColorStop(1, tone(c, .72));
            g.fillStyle = light; g.fill(path);
            g.fillStyle = tone(c, .53); g.beginPath(); g.moveTo(x, y + h * .11); g.lineTo(x + w * .31, y + h * .27); g.lineTo(x + w * .31, y + h); g.lineTo(x, y + h * .83); g.fill();
            g.fillStyle = tone(c, 1.12); g.beginPath(); g.moveTo(x, y + h * .11); g.lineTo(x + w * .66, y); g.lineTo(x + w, y + h * .16); g.lineTo(x + w * .31, y + h * .27); g.fill();
          } else {
            const points = shape === 'star' ? 10 : shape === 'diamond' ? 4 : 6;
            for (let j = 0; j < points; j++) {
              const a = -Math.PI / 2 + j * Math.PI * 2 / points;
              const r = shape === 'star' && j % 2 ? .42 : 1;
              const px = x + w / 2 + Math.cos(a) * w / 2 * r, py = y + h / 2 + Math.sin(a) * h / 2 * r;
              if (j) path.lineTo(px, py); else path.moveTo(px, py);
            }
            path.closePath();
            const light = g.createLinearGradient(x, y, x + w, y + h);
            light.addColorStop(0, tone(c, 1.4)); light.addColorStop(.45, tone(c, 1)); light.addColorStop(1, tone(c, .38));
            g.fillStyle = light; g.fill(path);
            g.save(); g.clip(path); g.strokeStyle = tone(c, .65); g.lineWidth = 1;
            for (let j = 0; j < points; j += 2) {
              const a = -Math.PI / 2 + j * Math.PI * 2 / points;
              g.beginPath(); g.moveTo(x + w / 2, y + h / 2); g.lineTo(x + w / 2 + Math.cos(a) * w / 2, y + h / 2 + Math.sin(a) * h / 2); g.stroke();
            }
            g.restore();
          }
        }
        // Deterministic fine grain, without changing the episode random streams.
        const pixels = g.getImageData(0, 0, W, H);
        for (let i = 0; i < pixels.data.length; i += 4) {
          let noise = Math.imul((i >>> 2) ^ spec.bg.seed, 0x45d9f3b);
          noise = Math.imul(noise ^ (noise >>> 16), 0x45d9f3b);
          noise ^= noise >>> 16;
          const grain = ((noise & 255) / 255 - .5) * 8;
          for (let k = 0; k < 3; k++) pixels.data[i + k] += grain;
        }
        g.putImageData(pixels, 0, 0);
      },
      'box.render': (base, S) => function (ctx) {
        // A goal switch rebuilds the stage; remove the toolbar moved into the frame.
        document.querySelectorAll('.cropside .cr-tools').forEach(bar => bar.remove());
        let refresh = () => {};
        const viewContext = new Proxy(ctx, {
          get(target, key) {
            if (key === 'update') return (model) => { target.update(model); refresh(model); };
            return Reflect.get(target, key);
          },
        });
        const result = base(viewContext);
        const toolbar = ctx.stage.querySelector('.cr-tools');
        const side = document.querySelector('.cropside');
        if (toolbar && side) side.append(toolbar);
        const source = S.frame.querySelector('canvas');
        const preview = document.querySelector('canvas.cs-prev');
        const thumbnail = document.querySelector('canvas.band-ball');
        const paintCrop = (target, r) => {
          if (!target || !r) return;
          const g = target.getContext('2d');
          const sw = Math.max(1, (r.r - r.l) * source.width), sh = Math.max(1, (r.b - r.t) * source.height);
          target.width = 320; target.height = Math.max(1, Math.round(320 * sh / sw));
          g.drawImage(source, r.l * source.width, r.t * source.height, sw, sh, 0, 0, target.width, target.height);
        };
        refresh = (m) => {
          const values = { w: (m.r - m.l) * S.W, h: (m.b - m.t) * S.H, x: m.l * S.W, y: m.t * S.H };
          for (const [key, value] of Object.entries(values)) {
            const field = document.querySelector('[data-crop-field="' + key + '"]');
            if (field) field.textContent = Math.round(value);
          }
          paintCrop(preview, m);
        };
        const object = (ctx.spec.objects || []).find(o => o.shape === 'circle') || (ctx.spec.objects || [])[0];
        if (object) {
          const b = object.box;
          paintCrop(thumbnail, { l: Math.max(0, b.l - .025), t: Math.max(0, b.t - .025), r: Math.min(1, b.r + .025), b: Math.min(1, b.b + .025) });
        }
        refresh(ctx.model);
        return { ...result, sync: (m) => { result.sync(m); refresh(m); } };
      },
    },
  },
});
