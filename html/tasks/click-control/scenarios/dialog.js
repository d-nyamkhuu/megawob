/*
 * click-control / dialog: click-dialog / -2.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { fileName, personName, pickIn, T, targetCorrect } = fam.lib;

  // Realistic dialogs: {opener, title, text, buttons: [[labels], ...]} with {file} / {person} / {team} slots.
  const DIALOGS = [
    { opener: 'Close document…', title: 'Unsaved changes', text: 'You have unsaved changes in "{file}". Save them before closing?',
      buttons: [["Don't save", 'Cancel', 'Save'], ['Discard', 'Save'], ['Cancel', 'Save changes']] },
    { opener: 'Delete file…', title: 'Delete file?', text: '"{file}" will be moved to the trash. You can restore it within 30 days.',
      buttons: [['Cancel', 'Delete'], ['Keep', 'Move to trash']] },
    { opener: 'Leave editor…', title: 'Leave this page?', text: 'Changes you made may not be saved.', buttons: [['Stay', 'Leave'], ['Cancel', 'Leave page']] },
    { opener: 'Remove member…', title: 'Remove member', text: 'Remove {person} from {team}? They will lose access to all shared projects.',
      buttons: [['Cancel', 'Remove'], ['Keep', 'Remove member']] },
    { opener: 'Check for updates…', title: 'Update available', text: 'Version {ver} is ready to install. The app will restart.',
      buttons: [['Later', 'Install now'], ['Remind me tomorrow', 'Restart now'], ['Skip this version', 'Later', 'Install']] },
    { opener: 'Notification settings…', title: 'Allow notifications?', text: 'Get notified about mentions, replies and shared files.',
      buttons: [['Block', 'Allow'], ['Not now', 'Turn on']] },
    { opener: 'Sign out…', title: 'Sign out', text: 'Are you sure you want to sign out of all devices?', buttons: [['Cancel', 'Sign out'], ['No', 'Yes']] },
    { opener: 'Manage plan…', title: 'Cancel subscription', text: 'Your plan stays active until the end of the billing period. After that you lose access to premium features.',
      buttons: [['Keep subscription', 'Cancel subscription'], ['Go back', 'Confirm']] },
    { opener: 'Session…', title: 'Session expiring', text: 'You will be signed out in 2 minutes due to inactivity.',
      buttons: [['Sign out', 'Stay signed in'], ['Log out now', 'Continue']] },
    { opener: 'Upload…', title: 'Replace file?', text: 'A file named "{file}" already exists in this folder.',
      buttons: [['Keep both', 'Replace'], ['Cancel', 'Skip', 'Replace']] },
    { opener: 'Share…', title: 'Share "{file}"', text: 'Anyone with the link will be able to view this file.',
      buttons: [['Cancel', 'Copy link'], ['Restrict', 'Share']] },
    { opener: 'Export…', title: 'Export report', text: 'The export of "{file}" may take a few minutes. We will email you when it is ready.',
      buttons: [['Cancel', 'Export'], ['Cancel', 'OK']] },
    { opener: 'Archive…', title: 'Archive project?', text: 'Archived projects are read-only. {team} members can still view them.',
      buttons: [['Cancel', 'Archive'], ['No', 'Yes']] },
    { opener: 'Reset settings…', title: 'Reset to defaults', text: 'All your preferences will be restored to their default values.',
      buttons: [['Cancel', 'Reset'], ['Keep my settings', 'Reset all']] },
    { opener: 'Version history…', title: 'Restore this version?', text: 'Make this earlier version of "{file}" the current one? Your latest version will remain in the history.', buttons: [['Cancel', 'Restore'], ['Go back', 'Use this version']] },
    { opener: 'Invite guests…', title: 'Send invitations?', text: 'Send email invitations to the selected guests? Each invitation includes the event details and a reply link.', buttons: [['Cancel', 'Send invites'], ['Review list', 'Send']] },
    { opener: 'Offline access…', title: 'Keep an offline copy?', text: 'Download "{file}" to this device so you can view it without a connection.', buttons: [['Not now', 'Download'], ['Cancel', 'Keep offline']] },
    { opener: 'Connection details…', title: 'Connection lost', text: 'We could not reach the workspace. Your changes are stored on this device and will sync when you reconnect.', buttons: [['Work offline', 'Retry'], ['Dismiss', 'Try again']] },
    { opener: 'Import contacts…', title: 'Unrecognized columns', text: 'Some columns in "{file}" do not match a contact field. Match them now or skip those columns.', buttons: [['Cancel', 'Match fields', 'Skip'], ['Review columns', 'Skip columns']] },
    { opener: 'Duplicate board…', title: 'Include completed cards?', text: 'A new board will be created with the same lists. Choose whether to copy completed cards as well.', buttons: [['Cancel', 'Active only', 'All cards'], ['Skip completed', 'Copy all']] },
    { opener: 'Merge contacts…', title: 'Combine these contacts?', text: 'The selected contacts will become one entry. All email addresses and notes will be kept.', buttons: [['Cancel', 'Merge'], ['Keep separate', 'Combine']] },
    { opener: 'Publish draft…', title: 'Publish announcement?', text: 'This draft will appear on the {team} notice board. Members will be able to read and comment on it.', buttons: [['Keep draft', 'Publish'], ['Review', 'Publish now']] },
    { opener: 'End meeting…', title: 'End for everyone?', text: 'Ending this meeting will disconnect all participants. You can also leave while the others continue.', buttons: [['Cancel', 'Leave', 'End for all'], ['Keep meeting', 'End meeting']] },
    { opener: 'Record session…', title: 'Start recording?', text: 'Audio and the shared screen will be recorded. Everyone in the session will see a recording indicator.', buttons: [['Cancel', 'Start recording'], ['Not now', 'Record']] },
    { opener: 'Test microphone…', title: 'Use your microphone?', text: 'Allow microphone access to record a short audio sample. The sample will play back only on this device.', buttons: [['Deny', 'Allow'], ['Not now', 'Enable microphone']] },
    { opener: 'Clear cache…', title: 'Clear downloaded previews?', text: 'Stored previews will be removed from this device. Files and comments will remain in your workspace.', buttons: [['Cancel', 'Clear cache'], ['Keep previews', 'Clear']] },
    { opener: 'Calendar connection…', title: 'Disconnect calendar?', text: 'New events will no longer sync with this workspace. Events already copied here will remain.', buttons: [['Cancel', 'Disconnect'], ['Keep connected', 'Confirm']] },
    { opener: 'Open attachment…', title: 'Unfamiliar sender', text: 'This attachment came from someone outside {team}. You can preview it before downloading a copy.', buttons: [['Cancel', 'Preview', 'Download'], ['Go back', 'Preview file']] },
    { opener: 'Review form…', title: 'Required details missing', text: 'Two required fields are empty. Fill them in before sending, or keep this form as a draft.', buttons: [['Edit form', 'Save draft'], ['Go back', 'Keep draft']] },
    { opener: 'Create backup…', title: 'Back up this workspace?', text: 'Create a backup of the current projects, files and settings. You can keep working while it is prepared.', buttons: [['Cancel', 'Create backup'], ['Later', 'Back up now']] },
    { opener: 'Upload progress…', title: 'Upload interrupted', text: 'The upload of "{file}" stopped halfway through. Resume from where it stopped or start over.', buttons: [['Cancel', 'Start over', 'Resume'], ['Stop upload', 'Resume upload']] },
    { opener: 'Convert document…', title: 'Formatting may change', text: 'Converting "{file}" to plain text will remove images, tables and text styles. The original file will be kept.', buttons: [['Cancel', 'Convert'], ['Keep format', 'Create text copy']] },
    { opener: 'Optimize images…', title: 'Reduce image size?', text: 'Compress images in "{file}" to make it smaller. Fine details may look less sharp.', buttons: [['Cancel', 'Compress'], ['Keep quality', 'Reduce size']] },
    { opener: 'Room reservation…', title: 'Release this room?', text: 'The room will become available for others to book. Your meeting and its guest list will remain.', buttons: [['Keep room', 'Release'], ['Cancel', 'Release room']] },
    { opener: 'Pin conversation…', title: 'Pinned list is full', text: 'You already have five pinned conversations. Choose one to unpin before adding another.', buttons: [['Cancel', 'Manage pins'], ['Not now', 'Review pinned']] },
    { opener: 'Move folder…', title: 'Folder access will change', text: 'Moving this folder into {team} will let all team members view its contents. Existing direct access will remain.', buttons: [['Cancel', 'Move folder'], ['Review access', 'Move']] },
    { opener: 'Pause timer…', title: 'Take a break?', text: 'Your focus timer is still running. Pause it during your break or let it continue counting.', buttons: [['Keep running', 'Pause'], ['Cancel', 'Pause timer']] },
    { opener: 'Apply template…', title: 'Replace the page layout?', text: 'The selected template will rearrange your text and images. You can undo the layout change afterward.', buttons: [['Cancel', 'Apply template'], ['Preview', 'Apply']] },
    { opener: 'Sort rows…', title: 'Replace manual row order?', text: 'Sorting this table will replace the order you arranged by hand. Cell values will stay the same.', buttons: [['Keep order', 'Sort'], ['Cancel', 'Sort rows']] },
    { opener: 'Crop photo…', title: 'Trim the edges?', text: 'The area outside the crop frame will be hidden. You can adjust the frame later to show those parts again.', buttons: [['Cancel', 'Apply crop'], ['Keep editing', 'Crop']] },
    { opener: 'Ungroup objects…', title: 'Separate these shapes?', text: 'Each shape in this group will become selectable on its own. Their positions and colors will stay the same.', buttons: [['Cancel', 'Ungroup'], ['Keep grouped', 'Separate']] },
    { opener: 'Review outbox…', title: 'Send queued messages?', text: 'You are connected again. Three messages written while offline are waiting in your outbox.', buttons: [['Later', 'Review', 'Send all'], ['Keep queued', 'Send now']] },
    { opener: 'Unlock archive…', title: 'Password did not match', text: 'The archive is still locked. Try entering the password again or return to the file list.', buttons: [['Back to files', 'Try again'], ['Cancel', 'Reenter password']] },
    { opener: 'Automation status…', title: 'Scheduled task failed', text: 'The nightly task stopped before making any changes. Run it again now or leave it for the next scheduled attempt.', buttons: [['Wait', 'Run again'], ['Dismiss', 'Retry now']] },
    { opener: 'Audio output…', title: 'Headphones disconnected', text: 'Your headphones are no longer available. Continue playing through this device\'s speakers or pause playback.', buttons: [['Pause', 'Use speakers'], ['Stop playback', 'Play aloud']] },
    { opener: 'Display mode…', title: 'Use high contrast?', text: 'Increase the contrast of text and controls throughout the workspace. Your selected theme will be remembered.', buttons: [['Cancel', 'Enable'], ['Keep theme', 'Use high contrast']] },
  ];
  const NOTICE = [
    { title: 'Notice', }, { title: 'Message' }, { title: 'Heads up' }, { title: 'Confirm' }, { title: 'Warning' },
    { title: 'Update' }, { title: 'Details' }, { title: 'Status' }, { title: 'Brief' }, { title: 'Topic' },
    { title: 'Context' }, { title: 'Record' }, { title: 'General' }, { title: 'Bulletin' }
  ];

  function sampleDialog(rng, ctx) {
    const { o } = ctx;
    const vars = {
      file: fileName(rng.fork('file'), o), person: personName(rng.fork('person'), o),
      team: rng.pick([
        'Design', 'Marketing', 'the Berlin office', 'Growth', 'Support', 'Platform', 'Research', 'Editorial',
        'Operations', 'People', 'Training', 'Logistics', 'Analytics', 'Quality', 'Facilities', 'Events', 'Security',
        'Legal', 'Outreach', 'Purchasing', 'Production', 'Cedar office', 'Ridge office', 'Maple office'
      ]), ver: `${rng.int(2, 9)}.${rng.int(0, 12)}`,
    };
    const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
    if (rng.bool(0.3)) {
      const n = rng.pick(NOTICE);
      const text = C.pick(rng, C.SENTENCES.filter((s) => s.length <= 110), o);
      return { title: n.title, text, buttons: [], target: 'x', opener: rng.bool(0.3) ? rng.pick(['Details…', 'Show message…', 'Info…']) : null };
    }
    const d = C.pick(rng, DIALOGS, o);
    const buttons = rng.pick(d.buttons).slice();
    return { title: fill(d.title), text: fill(d.text), buttons, target: rng.pick(buttons.concat(['x'])), opener: rng.bool(0.3) ? d.opener : null };
  }

  env.scenario('click-control', {
    name: 'dialog',
    sample: sampleDialog,
    baseModel(spec, c) {
      return { open: !spec.opener, ...c };
    },
    progress: (model, spec) => spec.opener && model.open ? 0.5 : 1,
    correct: targetCorrect,
    result: (spec, key) => key === 'x' ? 'Dialog closed' : `${key} chosen`,
    wrongFinal(spec, rng) {
      const ks = spec.buttons.concat(['x']).filter((k) => k !== spec.target);
      return ks.length ? { key: rng.pick(ks), patch: { open: false } } : null;
    },
    partial: (spec) => spec.opener ? { open: true } : null,
    scene() {
      return { open: true };
    },
    planStep(model, spec) {
      if (!model.open) return spec.opener ? { click: { opener: true } } : null;
      return { click: { dialog: spec.target } };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      if (easy && spec.buttons.length > 2) spec.buttons = pickIn(r, spec.buttons, (b) => b === spec.target, 1);
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const what = spec.target === 'x' ? (spec.buttons.length ? 'the "x" button' : 'the "x"') : q(spec.target);
      if (spec.opener) {
        core = P(T.dialogOpen, { o: q(spec.opener), what });
        steps = [`open ${q(spec.opener)}`, `click ${what}`];
      } else if (spec.target === 'x') core = P(T.dialogX, {});
      else core = P(T.dialogBtn, { q: q(spec.target) });
      terse = spec.target === 'x' ? 'close the dialog' : q(spec.target);
      return { core, terse, steps };
    },
    phKind: () => 'dialog',
    retarget: (spec, model, rng, out, other) => other(['x', ...spec.buttons], spec.target),
  });
})();
