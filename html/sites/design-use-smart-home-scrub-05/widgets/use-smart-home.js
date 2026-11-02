// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-scrub-05',
  name: 'design',
  split: 'train',
  scenarios: ['scrub'],
  template: 'use-smart-home/classic',
  design: {
    // Reference order: a full-width video, then the title with the seek timeline (times at its ends), then the transport row;
    // the chapter list is the right-hand index. Same slider, paints and pointer hooks as the template's scrub part.
    parts: {
      video: (base, S) => (R) => {
        const { e, main } = R;
        const video = e('div', 'ah-video', main);
        return e('div', 'ah-video-caption', video);
      },
      scrubAside: (base, S) => (R) => {
        const { P } = S;
        const { s, e, aside } = R;
        const index = e('div', 'ah-index', aside);
        e('div', 'ah-index-head', index, 'Chapters');
        const list = e('div', 'ah-index-list', index);
        const chapterRows = s.chapters.map(c => P.chapterRow({ ...R, aside: list }, c));
        ['Chapter', 'Remaining'].forEach(label => P.fact(R, label));
        return chapterRows;
      },
      transport: (base, S) => (R) => {
        const { P } = S;
        const { s, e, main } = R;
        const line = e('div', 'ah-player-footer', main);
        const btn = (cls, glyph, label) => { const b = e('button', 'ah-utility ah-tbtn ' + cls, line, glyph); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label); return b; };
        P.utility(R, line, 'play', 'Playback', [['Playback paused', 'Position is saved locally so you can resume here later.']], 'icon-only ah-tbtn');
        btn('ah-rew', '', 'Rewind').innerHTML = '<svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 1v16L1 9zM23 1v16L12 9z" fill="#000"/></svg>';
        btn('ah-ff', '', 'Fast-forward').innerHTML = '<svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 1v16l11-8zM1 1v16l11-8z" fill="#000"/></svg>';
        const position = e('strong', '', line); e('span', 'ah-muted ah-grow', line, '/ ' + env.taskDef.helpers.durationText(s.duration));
        P.utility(R, line, 'volume', 'Volume', [['Volume', '80% / System output']], 'icon-only ah-vol');
        const vol = e('div', 'ah-volume', line); e('div', 'ah-volume-knob', vol);
        P.utility(R, line, 'settings', 'Playback quality', [['Quality', '1080p / Original']], 'icon-only ah-hide');
        const chap = e('label', 'ah-chaps', line); const cb = e('input', '', chap); cb.type = 'checkbox'; cb.checked = true; chap.append(' Chapters');
        P.utility(R, line, '', 'Full Screen', [['Theater mode', 'The video is fitted to the current workspace.']], 'ah-fs');
        return position;
      },
      renderScrub: (base, S) => (R) => {
        const { P } = S;
        const { ctx, s, e, main, paints } = R;
        const { durationText, chapter } = env.taskDef.helpers;
        const chapterRows = P.scrubAside(R);
        const caption = P.video(R);
        const seek = e('div', 'ah-seek', main);
        e('h2', 'ah-seek-title', seek, s.title);
        const position = P.transport(R);
        seek.append(position);
        const track = P.linear(R, seek, 'position', s.duration, ctx.model.position, 'Video position');
        s.chapters.slice(1).forEach(c => { const marker = e('div', 'ah-marker', track); marker.style.left = c.time / s.duration * 100 + '%'; });
        e('span', 'ah-seek-time', seek, durationText(s.duration));
        const remaining = e('span', 'ah-seek-time', seek);
        const { preview, previewText } = P.preview(R, track);
        track.addEventListener('pointermove', event => {
          const r = track.getBoundingClientRect(), fraction = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
          P.patch(R, { preview: Math.round(fraction * s.duration) });
        });
        track.addEventListener('pointerleave', () => P.patch(R, { preview: null }));
        paints.push(m => {
          position.textContent = durationText(Math.round(m.position));
          remaining.textContent = '-' + durationText(Math.max(0, Math.round(s.duration - m.position)));
          const ch = chapter(m, s); caption.textContent = 'Paused / ' + ch.title;
          chapterRows.forEach((row, i) => row.classList.toggle('active', s.chapters[i] === ch));
          preview.hidden = m.preview === null; previewText.textContent = durationText(m.preview || 0) + ' / ' + chapter({ position: m.preview || 0 }, s).title;
          preview.style.left = Math.max(17, Math.min(83, 100 * (m.preview || 0) / s.duration)) + '%';
        });
      },
    },
  },
});
