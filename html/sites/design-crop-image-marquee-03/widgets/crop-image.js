// Design on templates/crop-image/base.js: the base site's crop-image widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'crop-image',
  site: 'design-crop-image-marquee-03',
  name: 'design',
  split: 'train',
  scenarios: ['marquee'],
  template: 'crop-image/base',
  design: {
    parts: {
      'paintScene': (base, S) => function paintScene(g, spec, fam, rng, W, H) {
        const { paintFace } = S;
        const bg = spec.bg;
        const grad = g.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, `hsl(${bg.hue} 30% 88%)`);
        grad.addColorStop(1, `hsl(${bg.hue2} 30% 70%)`);
        g.fillStyle = grad;
        g.fillRect(0, 0, W, H);
        const r = rng.fork('bg');
        if (bg.style === 'landscape') {
          const sky = g.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, `hsl(${bg.hue} 45% 78%)`);
          sky.addColorStop(1, `hsl(${bg.hue} 35% 92%)`);
          g.fillStyle = sky;
          g.fillRect(0, 0, W, H);
          g.fillStyle = 'rgba(255, 240, 200, .8)';
          g.beginPath();
          g.arc(r.float(0.1, 0.9) * W, r.float(0.1, 0.3) * H, H * 0.07, 0, 2 * Math.PI);
          g.fill();
          for (const [k, light] of [[0, 62], [1, 48]]) {
            g.fillStyle = `hsl(${(bg.hue2 + 60 * k) % 360} 25% ${light}%)`;
            g.beginPath();
            g.moveTo(0, H);
            const base = H * (0.55 + 0.15 * k);
            for (let x = 0; x <= W; x += W / 8) g.lineTo(x, base - r.float(0, H * 0.18));
            g.lineTo(W, H);
            g.closePath();
            g.fill();
          }
        } else if (bg.style === 'blobs') {
          for (let i = 0, n = r.int(5, 8); i < n; i++) {
            const cx = r.float(0, W);
            const cy = r.float(0, H);
            const rad = r.float(0.15, 0.4) * H;
            const rg = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
            rg.addColorStop(0, `hsla(${r.int(0, 359)} 55% 70% / .55)`);
            rg.addColorStop(1, 'hsla(0 0% 100% / 0)');
            g.fillStyle = rg;
            g.fillRect(0, 0, W, H);
          }
        } else if (bg.style === 'noise') {
          const img = g.getImageData(0, 0, W, H);
          const d = img.data;
          const n = r.fork('px');
          for (let i = 0; i < d.length; i += 4) {
            const v = (n.next() - 0.5) * 46;
            d[i] += v;
            d[i + 1] += v;
            d[i + 2] += v;
          }
          g.putImageData(img, 0, 0);
        } else if (bg.style === 'text') {
          g.save();
          g.fillStyle = 'rgba(255, 255, 255, .35)';
          g.font = `700 ${Math.round(H * 0.11)}px system-ui, sans-serif`;
          g.textAlign = 'center';
          g.translate(W / 2, H / 2);
          g.rotate(-0.35);
          g.fillText(bg.text, 0, 0);
          g.restore();
          g.fillStyle = 'rgba(0, 0, 0, .35)';
          g.fillRect(0, H - 26, W, 26);
          g.fillStyle = 'rgba(255, 255, 255, .9)';
          g.font = '13px system-ui, sans-serif';
          g.textAlign = 'left';
          g.fillText(`${bg.text} · ${W}×${H}`, 10, H - 9);
        }
        // This design uses a quiet paper field; retain the seeded background draws above
        // so the scene stream remains stable, then paint its neutral marquee backdrop.
        if (spec.scenario === 'marquee') {
          g.fillStyle = '#ebeae7';
          g.fillRect(0, 0, W, H);
        }
        for (const o of spec.objects) {
          const { x, y, w, h } = o.sq;
          if (o.kind === 'label') {
            const px = [x * W, y * H, w * W, h * H];
            g.fillStyle = o.hex;
            g.beginPath();
            g.roundRect(px[0], px[1], px[2], px[3], Math.min(8, px[3] / 4));
            g.fill();
            g.fillStyle = '#fff';
            g.font = `650 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(o.text, px[0] + px[2] / 2, px[1] + px[3] / 2 + 1, px[2] * 0.88);
            continue;
          }
          g.fillStyle = o.hex;
          g.beginPath();
          const pts = fam.shapePoints(o);
          if (pts) {
            pts.forEach(([px, py], k) => (k ? g.lineTo(px * W, py * H) : g.moveTo(px * W, py * H)));
            g.closePath();
          } else {
            g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
          }
          g.fill();
          if (o.kind === 'face') paintFace(g, fam, o, W, H);
        }
      },
    },
  },
});
