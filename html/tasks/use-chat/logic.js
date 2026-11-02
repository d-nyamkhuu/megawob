/*
 * use-chat: reply in threads, pin and react, manage channels and run meetings in a team chat app.
 * Fictional team chat and video meetings. Real-app counterparts: channel-based team
 * messengers, threaded discussions, meeting controls and host breakout-room management; no MiniWoB
 * counterpart.
 *
 * Scenarios: thread (reply inside a named thread), pinreact (pin + emoji picker),
 * channel (save name/topic and invite members), meeting (mute, share a chosen window, raise hand),
 * breakout (drag participants to rooms). Every scenario supports easy/medium/normal and OOD counts.
 * Start modes: off, partial, wrong, solved; wrong effects are editable/removable without ending.
 * Spec: scenario, level, ood, startMode, isplit/csplit, people [{first,last,full,role}], workspace,
 * messages [{author,text,replies,reactions,time}], history/threadHistory (unscored conversations),
 * sharedFiles (unscored documents), channelName/topic, roomNames, sources;
 * goals: message/reply/emoji, newName/newTopic/addMembers, muted/share/hand, assignments (room ids).
 * Model: thread, draft/channelDraft, replies (one own reply per thread), channelPosts, pins/reactions,
 * settings/tab, name/topic + editName/editTopic, members/invite/selected, remove (confirmation id),
 * muted/share/hand/camera, sharePicker, rooms; touched records committed edits in ambiguous episodes.
 * UI-only scrollTargets maps control ids to {pane,dy}, mirrored by widgets from live geometry.
 * Plan vocabulary: {control: id}, {pane: id}; ids include thread:i, more:i, react:i, pin:i,
 * emoji:key, draft, send, delete:i, channelDraft/channelSend/channelDelete:i, settings, tab:about,
 * tab:members, editName/editTopic, save, invite, person:i, inviteSave, remove:i, removeConfirm,
 * mute, share, source:i, shareStart, hand, participant:i, room:i. All locate calls are read-only.
 * Helpers (widget API, env.taskDef.helpers):
 *   act(model,spec,event): apply a chat or meeting action to a cloned model.
 *   EMOJI: reaction keys mapped to icon names and visible labels.
 * facts(model,spec): 2 visible resulting counts/statuses, also rendered in the app status strip.
 * silent(next,prev,spec,rng): an added reaction fails to persist; repeating the picker action fixes it.
 * retarget(spec,model,rng): change goals within the same messages, directory, windows and room roster.
 * parts(model,spec): preempt=cancel items by visible name: messages by text (value: own reply or pin and reaction), 'Open thread', 'Reply draft', 'Channel
 * messages', 'Channel name', 'Topic', people by full name (member or room), meeting controls.
 * judgeModes: ambiguous (two people share a first name; the reply asks, one option per person, by full name or surname
 * (spec.judge.cands; others: the other people, never offered), before replying, pinning, inviting, muting or assigning;
 * judged() checks nothing was changed); confirm (open a named channel/meeting member's removal dialog, status confirm
 * before committing; the widget flags irreversible on confirmation). Available in every scenario.
 */
(function () {
  'use strict';
  const C = env.content, I = env.instruct, { clone, lev } = env.util;
  const SCENARIOS = ['thread', 'pinreact', 'channel', 'meeting', 'breakout'];
  const EMOJI = { thumbsup: ['thumbsup', 'thumbs up'], heart: ['heart', 'heart'], celebrate: ['celebrate', 'celebration'], eyes: ['eyes', 'eyes'], check: ['check', 'check mark'], clap: ['clap', 'clap'] };
  const CHANNELS = ['project-orbit', 'design-lab', 'release-desk', 'team-lounge', 'field-notes', 'launch-room', 'research-hub', 'studio-news'];
  const REPLIES = [
    'Thanks, I will review this today.', 'The updated notes are ready.', 'I can take the next review.',
    'Confirmed, the checklist is complete.', 'Please include me in the next session.',
    'I have added my feedback to the draft.', 'I will share a short summary soon.',
    'That gives us a clear way ahead.', 'I will keep the discussion moving.',
    'The key points are clearly noted here.', 'This is useful context for the team.', 'I will add this to our notes.',
    'The details are easy to follow.', 'Glad to help with the next steps.', 'We have a good starting point.',
    'I will bring this to our next meeting.', 'I can keep our notes organized.', 'This should smooth the handoff.',
    'I can make time to check the details.', 'The team has a solid basis to proceed.',
    'I will share helpful updates here.'
  ];
  const TOPICS = [
    'Launch planning and weekly updates', 'Design reviews and working notes', 'Research questions and follow-ups',
    'Release readiness and team handoffs', 'Shared decisions and action items', 'Project planning and useful links',
    'Team priorities and work progress', 'Planning notes and key questions', 'Cross-team coordination and updates',
    'Upcoming work and team milestones', 'Process notes and useful references', 'Current tasks and team coordination',
    'Discussion notes and follow-through', 'Work in progress and key decisions', 'Planning details and team inputs',
    'Project updates and active items', 'Shared resources and work notes', 'Team schedules and upcoming tasks',
    'Ideas for smoother collaboration', 'Status updates and helpful context', 'Coordination notes and action plans',
    'Ongoing work and shared questions', 'Team discussions and shared context'
  ];
  const textError = (a, b) => lev(a, b) / Math.max(a.length, b.length, 1);
  const diff = (a, b) => new Set([...a, ...b].filter(x => a.includes(x) !== b.includes(x))).size;
  function sample(rng, opts) {
    const r = rng.fork('content'), cs = { csplit: opts.csplit };
    const level = opts.level || 'normal', ood = !!opts.ood;
    const n = level === 'easy' ? 4 : level === 'medium' ? 5 : ood ? 9 : 6;
    const people = [];
    while (people.length < n) {
      const p = C.personName(r, cs);
      if (!people.some(x => x.full === p.full)) people.push({ ...p, role: C.pick(r, C.DEPARTMENTS, cs) });
    }
    const scenario = opts.scenario || rng.pick(opts.scenarios || SCENARIOS);
    const count = level === 'easy' ? 3 : level === 'medium' ? 4 : ood ? 7 : 5;
    const texts = C.sample(r, C.SENTENCE_GROUPS.chat, count, cs);
    const messages = Array.from({ length: count }, (_, i) => ({ author: i % n,
      text: texts[i % texts.length], replies: r.int(1, 7), reactions: r.int(1, 9), time: `10:${String(12 + i * 3).padStart(2, '0')}` }));
    const s = { scenario, level, ood, startMode: opts.startMode || 'off', isplit: opts.isplit, csplit: opts.csplit,
      people, messages, workspace: C.pick(r, C.COMPANIES, cs), channelName: C.pick(r, CHANNELS, cs), topic: C.pick(r, TOPICS, cs),
      visibility: r.bool() ? 'Private' : 'Public', message: rng.int(0, count - 1), reply: C.pick(r, REPLIES, cs),
      emoji: rng.pick(Object.keys(EMOJI)), newName: '', newTopic: '', addMembers: [2],
      muted: true, share: rng.int(0, 2), hand: true, sources: ['Project notes', 'Sprint board', 'Research deck'],
      roomNames: ['Workshop A', 'Workshop B', ...(level === 'normal' ? ['Workshop C'] : [])] };
    s.newName = C.pick(r, CHANNELS.filter(x => x !== s.channelName), cs);
    s.newTopic = C.pick(r, TOPICS.filter(x => x !== s.topic), cs);
    if (level !== 'easy') s.addMembers.push(3);
    s.assignments = people.map((_, i) => i % s.roomNames.length);
    // Background conversation and documents never become additional scored targets.
    const br = rng.fork('workspace-background');
    s.history = Array.from({ length: level === 'easy' ? 8 : 14 }, (_, i) => ({ author: i % n,
      text: C.pick(br, C.SENTENCE_GROUPS.meeting, cs), time: `09:${String(10 + i * 3).padStart(2, '0')}`,
      attachment: i % 5 === 2 ? C.fileName(br, 'pdf', cs) : null }));
    s.threadHistory = messages.map(msg => Array.from({ length: msg.replies }, (_, i) => ({
      author: (msg.author + i + 1) % n, text: C.pick(br, C.SENTENCE_GROUPS.chat, cs),
      time: `10:${String(31 + i * 2).padStart(2, '0')}` })));
    s.sharedFiles = Array.from({ length: 3 }, () => ({ name: C.fileName(br, 'pdf', cs), size: C.fileSize(br, 'document') }));
    if (opts.judge === 'ambiguous' || opts.judge === 'confirm') {
      const jr = rng.fork('judge-text'); // judge-only draws, after everything else
      if (opts.judge === 'ambiguous') {
        const a = scenario === 'channel' ? 2 : 0, b = scenario === 'channel' ? 3 : 1;
        people[b].first = people[a].first;
        if (people[b].last === people[a].last) people[b].last += '-Vale';
        people[b].full = `${people[b].first} ${people[b].last}`;
        // nobody else shares the first name: the two are the only candidates
        people.forEach((q, i) => {
          if (i === a || i === b || q.first !== people[a].first) return;
          let p;
          for (let k = 0; k < 30; k++) { p = C.personName(jr, cs); if (p.first !== people[a].first && !people.some(x => x.full === p.full)) break; }
          people[i] = { ...p, role: q.role };
        });
        // told apart by full name or surname; the other people must not be offered
        const others = people.filter((_, i) => i !== a && i !== b).map(q => [q.full, ...(q.last === people[a].last || q.last === people[b].last ? [] : [q.last])]);
        s.judge = { mode: 'ambiguous', a, b, first: people[a].first, room: jr.int(0, s.roomNames.length - 1),
          cands: [[people[a].full, people[a].last], [people[b].full, people[b].last]], others,
          message: `Which ${people[a].first} do you mean: ${people[a].full} or ${people[b].full}?` };
      } else {
        const person = jr.int(0, 1);
        s.judge = { mode: 'confirm', person,
          message: `Should I remove ${people[person].full} from the ${['meeting', 'breakout'].includes(scenario) ? 'meeting' : 'channel'}?` };
      }
    }
    return s;
  }
  function init(s) {
    const m = { thread: null, menu: null, picker: null, draft: '', channelDraft: '', replies: s.messages.map(() => ''),
      channelPosts: [], pins: s.messages.map(() => false), reactions: s.messages.map(() => ''),
      settings: false, tab: 'about', name: s.channelName, topic: s.topic, editName: s.channelName, editTopic: s.topic,
      members: [0, 1], invite: false, selected: [], remove: null,
      muted: false, share: null, hand: false, camera: true, sharePicker: false, source: null,
      rooms: s.people.map(() => -1), touched: false, scrollTargets: {} };
    if (s.judge) return m;
    if (s.startMode === 'partial') {
      if (s.scenario === 'thread') { m.thread = s.message; m.draft = s.reply.slice(0, Math.ceil(s.reply.length / 2)); }
      if (s.scenario === 'pinreact') m.pins[s.message] = true;
      if (s.scenario === 'channel') { m.name = s.newName; m.editName = s.newName; }
      if (s.scenario === 'meeting') m.muted = true;
      if (s.scenario === 'breakout') m.rooms[0] = s.assignments[0];
    }
    if (s.startMode === 'wrong') {
      if (s.scenario === 'thread') m.channelPosts = [s.reply];
      if (s.scenario === 'pinreact') { m.pins[(s.message + 1) % s.messages.length] = true; m.reactions[s.message] = 'eyes' === s.emoji ? 'heart' : 'eyes'; }
      if (s.scenario === 'channel') { m.name = 'draft-channel'; m.editName = m.name; m.members.push(s.people.length - 1); }
      if (s.scenario === 'meeting') m.share = (s.share + 1) % s.sources.length;
      if (s.scenario === 'breakout') m.rooms = s.assignments.map(x => (x + 1) % s.roomNames.length);
    }
    return m;
  }
  function errorOf(m, s) {
    if (s.judge?.mode === 'ambiguous') return m.touched ? 1 : 0;
    if (s.judge?.mode === 'confirm') return !m.members.includes(s.judge.person) ? 1 : m.remove === s.judge.person ? 0 : m.settings && m.tab === 'members' ? .5 : 1;
    if (s.scenario === 'thread') {
      const sent = m.replies[s.message];
      const need = sent ? textError(sent, s.reply) : 1 - (m.thread === s.message ? .15 + .35 * (1 - textError(m.draft, s.reply)) : 0);
      return .8 * need + .2 * (m.channelPosts.length + m.replies.filter((x, i) => i !== s.message && x).length);
    }
    if (s.scenario === 'pinreact') return (s.messages.reduce((n, _, i) => n + Number(m.pins[i] !== (i === s.message)) + Number(m.reactions[i] !== (i === s.message ? s.emoji : '')), 0)) / 2;
    if (s.scenario === 'channel') return (textError(m.name, s.newName) + textError(m.topic, s.newTopic) + diff(m.members, [0, 1, ...s.addMembers]) / (2 + s.addMembers.length)) / 3;
    if (s.scenario === 'meeting') return (Number(m.muted !== s.muted) + Number(m.share !== s.share) + Number(m.hand !== s.hand) + Number(!m.camera)) / 4;
    return m.rooms.reduce((n, x, i) => n + Number(x !== s.assignments[i]), 0) / s.people.length;
  }
  function act(model, s, ev) {
    const m = clone(model);
    if (ev.openThread !== undefined) { m.thread = ev.openThread; m.draft = ev.openThread === null ? '' : m.replies[ev.openThread]; }
    if (ev.field) m[ev.field[0]] = ev.field[1];
    if (ev.send) { if (m.thread !== null && m.draft.trim()) { m.replies[m.thread] = m.draft; m.draft = ''; m.touched = true; } }
    if (ev.channelSend && m.channelDraft.trim()) { m.channelPosts.push(m.channelDraft); m.channelDraft = ''; m.touched = true; }
    if (ev.deleteReply !== undefined) { m.replies[ev.deleteReply] = ''; m.touched = true; }
    if (ev.deleteChannel !== undefined) { m.channelPosts.splice(ev.deleteChannel, 1); m.touched = true; }
    if (ev.menu !== undefined) m.menu = ev.menu;
    if (ev.pin !== undefined) { m.pins[ev.pin] = !m.pins[ev.pin]; m.menu = null; m.touched = true; }
    if (ev.picker !== undefined) m.picker = ev.picker;
    if (ev.emoji !== undefined && m.picker !== null) { const i = m.picker; m.reactions[i] = m.reactions[i] === ev.emoji ? '' : ev.emoji; m.picker = null; m.touched = true; }
    if (ev.clearReaction !== undefined) { m.reactions[ev.clearReaction] = ''; m.touched = true; }
    if (ev.settings !== undefined) { m.settings = ev.settings; m.remove = null; }
    if (ev.tab) m.tab = ev.tab;
    if (ev.save) { m.name = m.editName.trim(); m.topic = m.editTopic.trim(); m.touched = true; }
    if (ev.invite !== undefined) { m.invite = ev.invite; m.selected = []; }
    if (ev.person !== undefined) m.selected = m.selected.includes(ev.person) ? m.selected.filter(x => x !== ev.person) : [...m.selected, ev.person];
    if (ev.inviteSave) { m.members = [...new Set([...m.members, ...m.selected])]; m.selected = []; m.invite = false; m.touched = true; }
    if (ev.remove !== undefined) m.remove = ev.remove;
    if (ev.removeConfirm && m.remove !== null) { m.members = m.members.filter(x => x !== m.remove); m.remove = null; m.touched = true; }
    if (ev.toggle) { m[ev.toggle] = !m[ev.toggle]; m.touched = true; }
    if (ev.sharePicker !== undefined) { m.sharePicker = ev.sharePicker; m.source = null; }
    if (ev.source !== undefined) m.source = ev.source;
    if (ev.shareStart && m.source !== null) { m.share = m.source; m.sharePicker = false; m.touched = true; }
    if (ev.stopShare) { m.share = null; m.touched = true; }
    if (ev.assign) { m.rooms[ev.assign[0]] = ev.assign[1]; m.touched = true; }
    return m;
  }
  function plan(m, s) {
    const control = k => ({ control: k });
    const scroll = k => m.scrollTargets?.[k] ? { wheel: [{ pane: m.scrollTargets[k].pane }, m.scrollTargets[k].dy] } : null;
    const click = k => scroll(k) || { click: control(k) };
    const type = (k, v) => scroll(k) || { type: [control(k), v] };
    if (s.judge?.mode === 'ambiguous') return { finish: true, message: s.judge.message };
    if (s.judge?.mode === 'confirm') {
      if (!m.settings) return click('settings');
      if (m.tab !== 'members') return click('tab:members');
      if (m.remove !== s.judge.person) return click(`remove:${s.judge.person}`);
      return { finish: true, message: s.judge.message };
    }
    if (s.scenario === 'thread') {
      if (m.channelPosts.length) return click('channelDelete:0');
      const wrong = m.replies.findIndex((x, i) => i !== s.message && x);
      if (wrong !== -1) { if (m.thread !== wrong) return click(`thread:${wrong}`); return click(`delete:${wrong}`); }
      if (m.thread !== s.message) return click(`thread:${s.message}`);
      if (m.replies[s.message] !== s.reply) {
        if (m.draft !== s.reply) return type('draft', s.reply);
        return click('send');
      }
    }
    if (s.scenario === 'pinreact') {
      const pin = s.messages.findIndex((_, i) => m.pins[i] !== (i === s.message));
      if (pin !== -1) return m.menu === pin ? click(`pin:${pin}`) : click(`more:${pin}`);
      const extra = m.reactions.findIndex((x, i) => x && (i !== s.message || x !== s.emoji));
      if (extra !== -1) return click(`clearReaction:${extra}`);
      if (m.reactions[s.message] !== s.emoji) return m.picker === s.message ? click(`emoji:${s.emoji}`) : click(`react:${s.message}`);
    }
    if (s.scenario === 'channel') {
      if (!m.settings) return click('settings');
      if (m.name !== s.newName || m.topic !== s.newTopic) {
        if (m.tab !== 'about') return click('tab:about');
        if (m.editName !== s.newName) return type('editName', s.newName);
        if (m.editTopic !== s.newTopic) return type('editTopic', s.newTopic);
        return click('save');
      }
      if (m.tab !== 'members') return click('tab:members');
      const wanted = [0, 1, ...s.addMembers];
      const extra = m.members.find(x => !wanted.includes(x));
      if (extra !== undefined) return m.remove === extra ? click('removeConfirm') : click(`remove:${extra}`);
      const missing = wanted.filter(x => !m.members.includes(x));
      if (missing.length) {
        if (!m.invite) return click('invite');
        const wrong = m.selected.find(x => !missing.includes(x));
        if (wrong !== undefined) return click(`person:${wrong}`);
        const next = missing.find(x => !m.selected.includes(x));
        return next !== undefined ? click(`person:${next}`) : click('inviteSave');
      }
    }
    if (s.scenario === 'meeting') {
      if (m.muted !== s.muted) return click('mute');
      if (m.share !== s.share) {
        if (!m.sharePicker) return click('share');
        if (m.source !== s.share) return click(`source:${s.share}`);
        return click('shareStart');
      }
      if (m.hand !== s.hand) return click('hand');
      if (!m.camera) return click('camera');
    }
    if (s.scenario === 'breakout') {
      const i = m.rooms.findIndex((room, j) => room !== s.assignments[j]);
      if (i !== -1) return scroll(`participant:${i}`) || { drag: [control(`participant:${i}`), control(`room:${s.assignments[i]}`)] };
    }
    return null;
  }
  function solve(s, model) {
    const m = clone(model || init(s));
    if (s.judge?.mode === 'ambiguous') { m.touched = false; return m; }
    if (s.judge?.mode === 'confirm') { m.settings = true; m.tab = 'members'; m.remove = s.judge.person; return m; }
    if (s.scenario === 'thread') { m.replies = s.messages.map((_, i) => i === s.message ? s.reply : ''); m.channelPosts = []; m.thread = s.message; m.draft = ''; }
    if (s.scenario === 'pinreact') { m.pins = s.messages.map((_, i) => i === s.message); m.reactions = s.messages.map((_, i) => i === s.message ? s.emoji : ''); }
    if (s.scenario === 'channel') { m.name = m.editName = s.newName; m.topic = m.editTopic = s.newTopic; m.members = [0, 1, ...s.addMembers]; m.settings = true; m.tab = 'members'; }
    if (s.scenario === 'meeting') { m.muted = s.muted; m.share = s.share; m.hand = s.hand; m.camera = true; }
    if (s.scenario === 'breakout') m.rooms = s.assignments.slice();
    return m;
  }
  function instruction(s, rng) {
    const S = s.isplit, phrase = (ts, vars) => I.phrase(rng, ts, vars, S);
    let core;
    if (s.judge?.mode === 'ambiguous') {
      const first = s.judge.first;
      core = s.scenario === 'thread' ? `Reply to ${first}'s message in #${s.channelName} with "${s.reply}" in its thread.`
        : s.scenario === 'pinreact' ? `Pin ${first}'s message in #${s.channelName} and add the ${EMOJI[s.emoji][1]} reaction.`
        : s.scenario === 'channel' ? `Add ${first} to #${s.channelName}.`
        : s.scenario === 'meeting' ? `Mute ${first} in this meeting.`
        : `Assign ${first} to ${s.roomNames[s.judge.room]}.`;
    }
    else if (s.judge?.mode === 'confirm') core = `Prepare to remove ${s.people[s.judge.person].full} from ${['meeting', 'breakout'].includes(s.scenario) ? 'the meeting' : '#' + s.channelName}, but check with me before removing the member.`;
    else if (s.scenario === 'thread') core = phrase(['Reply with "{reply}" in the thread on "{text}" by {who} in #{channel}. Keep the reply out of the channel.', 'Send "{reply}" as a thread reply to {who}’s message "{text}" in #{channel}.'], { reply: s.reply, text: s.messages[s.message].text, who: s.people[s.messages[s.message].author].full, channel: s.channelName });
    else if (s.scenario === 'pinreact') core = phrase(['Pin "{text}" in #{channel} and add the {emoji} reaction.', 'Add a {emoji} reaction to "{text}" in #{channel}, and pin that message.'], { text: s.messages[s.message].text, emoji: EMOJI[s.emoji][1], channel: s.channelName });
    else if (s.scenario === 'channel') core = phrase(['Rename #{channel} to "{name}", set its topic to "{topic}", and add {people}.', 'Update #{channel}: name "{name}"; topic "{topic}"; invite {people}.'], { channel: s.channelName, name: s.newName, topic: s.newTopic, people: s.addMembers.map(i => s.people[i].full).join(' and ') });
    else if (s.scenario === 'meeting') core = phrase(['Set your microphone to {mute}, share the "{source}" window, and {hand}.', 'Share "{source}" in the meeting, {hand}, and leave your microphone {mute}.'], { mute: s.muted ? 'muted' : 'unmuted', source: s.sources[s.share], hand: s.hand ? 'raise your hand' : 'lower your hand' });
    else core = phrase(['Assign participants to the breakout rooms as follows: {list}.', 'Arrange the participants in these breakout rooms: {list}.'], { list: s.roomNames.map((name, room) => `${name}: ${s.people.filter((_, i) => s.assignments[i] === room).map(p => p.full).join(', ')}`).join('; ') });
    return I.say(rng, core, { isplit: S });
  }
  function facts(m, s) {
    if (s.judge) return [];
    const f = (label, value) => ({ label, value: String(value) });
    if (s.scenario === 'thread') return [f('Thread replies', s.messages[s.message].replies + Number(!!m.replies[s.message])), f('Channel messages', (s.history?.length || 0) + s.messages.length + m.channelPosts.length)];
    if (s.scenario === 'pinreact') return [f('Pinned messages', m.pins.filter(Boolean).length), f('Reactions on message', s.messages[s.message].reactions + Number(!!m.reactions[s.message]))];
    if (s.scenario === 'channel') return [f('Members', m.members.length), f('Channel visibility', s.visibility)];
    if (s.scenario === 'meeting') return [f('Participants', s.people.length + 1), f('Connection', 'Encrypted')];
    return [f('Assigned', m.rooms.filter(x => x >= 0).length), f('Unassigned', m.rooms.filter(x => x < 0).length)];
  }
  // preempt=cancel: what the scenario changes, by the name the page shows: messages by text (reply / pin / reaction), the channel name,
  // topic and members, the meeting controls, each participant's room
  function parts(m, s) {
    const seen = {};
    const msg = (i) => { let n = s.messages[i].text; seen[n] = (seen[n] || 0) + 1; return seen[n] > 1 ? `${n} (${seen[n]})` : n; };
    if (s.scenario === 'thread') return [...s.messages.map((_, i) => ({ name: msg(i), value: m.replies[i] })), { name: 'Channel messages', value: m.channelPosts },
      { name: 'Open thread', value: m.thread }, { name: 'Reply draft', value: m.draft }];
    if (s.scenario === 'pinreact') return s.messages.map((_, i) => ({ name: msg(i), value: [m.pins[i], m.reactions[i]] }));
    if (s.scenario === 'channel') return [{ name: 'Channel name', value: m.name }, { name: 'Topic', value: m.topic },
      ...s.people.map((p, i) => ({ name: p.full, value: m.members.includes(i) }))];
    if (s.scenario === 'meeting') return [{ name: 'Microphone', value: m.muted }, { name: 'Screen share', value: m.share }, { name: 'Raise hand', value: m.hand }, { name: 'Camera', value: m.camera }];
    return s.people.map((p, i) => ({ name: p.full, value: m.rooms[i] }));
  }
  function silent(next, prev, s, rng) {
    if (s.judge || s.scenario !== 'pinreact') return null;
    const changed = next.reactions.map((x, i) => x === s.emoji && x !== prev.reactions[i] ? i : -1).filter(i => i >= 0);
    if (!changed.length) return null;
    const m = clone(next); m.reactions[rng.pick(changed)] = '';
    return errorOf(m, s) > 0 ? m : null;
  }
  function retarget(s, m, rng) {
    if (s.judge) return null;
    const t = clone(s);
    if (s.scenario === 'thread' || s.scenario === 'pinreact') t.message = rng.pick(s.messages.map((_, i) => i).filter(i => i !== s.message));
    if (s.scenario === 'channel') t.addMembers = [rng.pick(s.people.map((_, i) => i).filter(i => i > 1 && !m.members.includes(i)))];
    if (s.scenario === 'meeting') t.share = rng.pick(s.sources.map((_, i) => i).filter(i => i !== s.share && i !== m.share));
    if (s.scenario === 'breakout') t.assignments = s.assignments.map(x => (x + 1) % s.roomNames.length);
    if (t.addMembers?.some(x => x === undefined)) return null;
    return errorOf(m, t) > 0 ? t : null;
  }
  env.task({ name: 'use-chat',
    reply: true, // judge and report endings are structured replies under the default reply=auto (kit/runtime/reply.js)
    scenarios: SCENARIOS, startModes: ['off', 'partial', 'wrong', 'solved'],
    inputs: ['pointer', 'keyboard', 'wheel'], judgeModes: ['ambiguous', 'confirm'], helpers: { EMOJI, act },
    sample, init, error: errorOf, tolerance: () => ({ tau: 0, sigma: .5, minInitialError: .2 }),
    instruction, plan, solve, facts, silent, retarget,
    parts,
    // model check (the reply is graded by the kit): ambiguous: nothing was changed; confirm: the removal dialog is open
    judged(m, s, info) { return !info.infeasible && (s.judge.mode === 'ambiguous' ? !m.touched : m.members.includes(s.judge.person) && m.remove === s.judge.person); },
  });
})();
