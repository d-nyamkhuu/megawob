/* sort-into-bins/scenarios/desk.js: desktop sampling, drops, starts and oracle. Shared internals live on the task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('sort-into-bins').lib;

  // ---------------------------------------------------------------- desk

  const KIND_FOLDERS = {
    image: [
      'Photos', 'Pictures', 'Images', 'Papers', 'Writings'
    ], document: ['Documents', 'Paperwork', 'Docs'], spreadsheet: ['Spreadsheets', 'Finance', 'Sheets'],
    presentation: [
      'Slides', 'Presentations', 'Sounds', 'Tracks', 'Listening'
    ], audio: ['Music', 'Audio', 'Recordings'], video: ['Videos', 'Movies', 'Clips'],
    archive: ['Archives', 'Compressed'], text: ['Notes', 'Text files'], data: ['Data', 'Exports'],
  };
  const KIND_WORDS = {
    image: ['images', 'photos', 'pictures'], document: ['documents', 'docs'], spreadsheet: ['spreadsheets', 'sheets'],
    presentation: ['slide decks', 'presentations'], audio: ['audio files', 'recordings'], video: ['videos', 'video files'],
    archive: ['archives', 'compressed files'], text: ['text files', 'notes'], data: ['data files'],
  };

  function deskSpec(rng, base) {
    const lv = base.level;
    const cs = { csplit: base.csplit };
    const exts = lib.C.FILE_EXTENSIONS.filter((e) => KIND_FOLDERS[e.kind]);
    const kinds = [...new Set(exts.map((e) => e.kind))];
    let mode = lib.C.weighted(rng, [['into', 3], ['trash', 2], ['sort', 2]]);
    if (lv && mode === 'sort') mode = lv === 'easy' ? 'into' : 'trash';
    let nK = mode === 'sort' ? rng.int(2, 3) : rng.int(2, 3);
    if (lv) nK = 2;
    const useKinds = rng.sample(kinds, nK);
    let n = base.ood ? rng.int(8, 10) : rng.int(5, 7);
    if (lv) n = lv === 'easy' ? 5 : rng.fork('level').int(5, 6);
    const files = [];
    const seen = new Set();
    for (let i = 0; files.length < n && i < 200; i++) {
      const kind = useKinds[files.length % nK];
      const e = lib.C.pick(rng, exts.filter((x) => x.kind === kind), cs);
      const name = lib.C.fileName(rng, e.ext, cs);
      if (seen.has(name) || name.length > 30) continue;
      seen.add(name);
      files.push({ id: `f${files.length}`, name, ext: e.ext, kind });
    }
    const target = useKinds[0];
    const folderLabels = {};
    const folders = [];
    const wantKinds = mode === 'sort' ? useKinds : [target];
    for (const k of wantKinds) { folderLabels[k] = rng.pick(KIND_FOLDERS[k]); }
    if (mode !== 'trash') for (const k of wantKinds) folders.push({ id: `d${folders.length}`, label: folderLabels[k], kind: k });
    // Distractor folders, and the Trash.
    const extra = rng.sample(Object.keys(KIND_FOLDERS).filter((k) => !wantKinds.includes(k)), rng.int(1, 2));
    for (const k of extra) folders.push({ id: `d${folders.length}`, label: rng.pick(KIND_FOLDERS[k]), kind: k });
    folders.push({ id: 'trash', label: 'Trash', trash: true });
    const order = rng.shuffle(folders.slice(0, -1));
    const all = rng.bool(0.5) ? [...order, folders[folders.length - 1]] : [folders[folders.length - 1], ...order];
    const goal = {};
    for (const f of files) {
      if (mode === 'trash') goal[f.id] = f.kind === target ? 'trash' : 'desk';
      else if (mode === 'into') goal[f.id] = f.kind === target ? folders[0].id : 'desk';
      else goal[f.id] = folders.find((d) => d.kind === f.kind && wantKinds.includes(d.kind)).id;
    }
    // Layout: folders in a column on one side; the window region in the far corner of the desk area.
    const side = rng.pick(['left', 'right']);
    const fh = base.ood ? 0.14 : rng.float(0.15, 0.17);
    const fw = (fh * 0.95) / lib.ASPECT;
    const colX = side === 'left' ? 0.025 : 1 - 0.025 - fw;
    const gap = Math.min(0.05, (0.92 - all.length * fh) / Math.max(1, all.length - 1));
    const y0 = rng.float(0.03, Math.max(0.03, 0.97 - all.length * fh - (all.length - 1) * gap));
    all.forEach((d, i) => Object.assign(d, { x: colX, y: y0 + i * (fh + gap), w: fw, h: fh }));
    const deskX0 = side === 'left' ? colX + fw + 0.04 : 0.02;
    const deskX1 = side === 'left' ? 0.98 : colX - 0.04;
    const ww = (deskX1 - deskX0) * rng.float(0.5, 0.6);
    const wh = rng.float(0.5, 0.62);
    const win = { x: side === 'left' ? deskX1 - ww : deskX0, y: rng.bool(0.5) ? 0.03 : 0.97 - wh, w: ww, h: wh, head: 0.075 };
    const ih = base.ood ? rng.float(0.13, 0.15) : rng.float(0.15, 0.17);
    const spec = { ...base, scenario: 'desk', aspect: lib.ASPECT, item: { w: (ih * 0.85) / lib.ASPECT, h: ih }, files, folders: all, win,
      desk: [deskX0, 0.02, deskX1, 0.98], goal, rule: { mode, kind: target, kinds: wantKinds, labels: folderLabels } };
    return spec;
  }

  // Positions on the desk area that avoid folders and the window region.
  function deskPoints(spec) {
    const { w, h } = spec.item;
    const blocked = [...spec.folders.map((d) => lib.growBox(lib.boxRect(d), 0.2 * w, 0.2 * h)), lib.growBox(lib.boxRect(spec.win), 0.15 * w, 0.15 * h)];
    return lib.gridPoints(spec, 0.25, spec.desk).filter((p) => !blocked.some((b) => lib.overlap(lib.itemRect(spec, p), b)));
  }

  function deskScatter(rng, spec, n) {
    const cands = rng.shuffle(deskPoints(spec));
    for (const gap of [0.3, 0.12, 0.02]) {
      const picked = [];
      for (const p of cands) {
        const r = lib.itemRect(spec, p, gap / 2);
        if (picked.some((q) => lib.overlap(r, lib.itemRect(spec, q, gap / 2)))) continue;
        picked.push(p);
        if (picked.length === n) return picked;
      }
    }
    return null;
  }

  function freeDesk(spec, model, id) {
    const others = spec.files.filter((f) => f.id !== id && model.loc[f.id] === 'desk').map((f) => lib.itemRect(spec, model.pos[f.id], 0.08));
    const cur = model.pos[id] || [0.5, 0.5];
    let best = null;
    let bd = Infinity;
    for (const p of deskPoints(spec)) {
      if (others.some((o) => lib.overlap(lib.itemRect(spec, p), o))) continue;
      const d = Math.hypot((p[0] - cur[0]) * spec.aspect, p[1] - cur[1]);
      if (d < bd) { bd = d; best = p; }
    }
    return best || deskPoints(spec)[0];
  }

  // Slots for files listed in the open folder window (normalized centers), row-major.
  function winSlots(spec, n) {
    const { w, h } = spec.item;
    const W = spec.win;
    const pad = 0.012;
    const cols = Math.max(1, Math.floor((W.w - 2 * pad / spec.aspect) / (1.08 * w)));
    const rows = Math.max(1, Math.floor((W.h - W.head - 2 * pad) / (1.04 * h)));
    const cw = (W.w - (2 * pad) / spec.aspect) / cols;
    const ch = (W.h - W.head - 2 * pad) / rows;
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols) % rows;
      const k = i % cols;
      out.push([W.x + pad / spec.aspect + (k + 0.5) * cw, W.y + W.head + pad + (r + 0.5) * ch]);
    }
    return out;
  }

  // A file was dropped with its center at `center` and the pointer at `pointer` (normalized).
  function deskDrop(spec, model, id, center, pointer) {
    const m = { pos: { ...model.pos }, loc: { ...model.loc }, open: model.open };
    const folder = spec.folders.find((d) => lib.inPt(pointer, lib.boxRect(d)));
    if (folder) { m.loc[id] = folder.id; return m; }
    if (m.open && lib.inPt(pointer, lib.boxRect(spec.win))) { m.loc[id] = m.open; return m; }
    const { w, h } = spec.item;
    const [x0, y0, x1, y1] = spec.desk;
    m.pos[id] = [Math.min(x1 - w / 2, Math.max(x0 + w / 2, center[0])), Math.min(y1 - h / 2, Math.max(y0 + h / 2, center[1]))];
    m.loc[id] = 'desk';
    return m;
  }

  // A file in a folder it does not belong in costs EXTRA (as in boxErrors); one still on the desk costs 1.
  const deskError = (model, spec) => spec.files.reduce((a, f) => {
    const l = model.loc[f.id];
    const g = spec.goal[f.id];
    return a + (l === g ? 0 : l !== 'desk' ? lib.EXTRA : 1);
  }, 0) / spec.files.length;

  function deskPlan(model, spec) {
    const wrong = spec.files.filter((f) => model.loc[f.id] !== spec.goal[f.id]);
    if (!wrong.length) return null;
    const visible = wrong.find((f) => model.loc[f.id] === 'desk' || model.loc[f.id] === model.open);
    if (!visible) return { click: { folder: model.loc[wrong[0].id] } };
    const g = spec.goal[visible.id];
    if (g === 'desk') return { drag: [{ item: visible.id }, { point: freeDesk(spec, model, visible.id) }] };
    return { drag: [{ item: visible.id }, { folder: g }] };
  }


  function initDesk(spec, rng) {
    const pts = deskScatter(rng, spec, spec.files.length);
    const pos = {};
    const loc = {};
    spec.files.forEach((f, i) => { pos[f.id] = pts[i]; loc[f.id] = 'desk'; });
    const mode = lib.levelMode(spec);
    const movers = rng.shuffle(spec.files.filter((f) => spec.goal[f.id] !== 'desk'));
    if (mode === 'partial') for (const f of movers.slice(0, Math.max(1, Math.floor(movers.length / 2)))) loc[f.id] = spec.goal[f.id];
    if (mode === 'wrong') {
      // Some files went into the wrong folder (or the Trash): open it and drag them back.
      const pool = rng.shuffle(spec.files);
      for (const f of pool.slice(0, Math.max(1, Math.floor(pool.length / 3)))) {
        const wrong = rng.pick(spec.folders.filter((d) => d.id !== spec.goal[f.id]));
        loc[f.id] = wrong.id;
      }
    }
    return { pos, loc, open: null };
  }

  Object.assign(lib, { KIND_FOLDERS, KIND_WORDS, deskDrop, deskError, deskPlan, winSlots });
  env.scenario('sort-into-bins', { name: 'desk', sample: (rng, base) => deskSpec(rng.fork('desk'), base),
    init: initDesk, error: deskError, plan: deskPlan });
})();
