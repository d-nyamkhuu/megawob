/*
 * kit/content/ui.js: interface vocabulary: button labels by intent, menus, navigation, settings, form field
 * labels with aliases, icon names and tooltips, end-control and decoy labels, banner/toast/promo/chat texts.
 * API: see the header of kit/content/core.js.
 */
(function () {
  'use strict';
  const C = env.content;
  const L = C.lines;

  // intent | label; label; ...   Look-alike groups (save, delete, close, send, ...) keep near-synonyms and
  // states together so a family can ask for one and show the others as distractors.
  const BUTTON_LABELS = C.rows(`
    save | Save; Save as...; Save draft; Saved; Save & close; Save changes; Save and continue; Save for later; Saving...
    submit | Submit; Submit form; Submit for review; Submit order; Send for approval
    confirm | Confirm; Confirm order; Confirm and pay; Yes, confirm; Confirm booking; I agree
    cancel | Cancel; Cancel order; Cancel subscription; Discard; Discard changes; Never mind
    close | Close; Close window; Dismiss; Got it; Hide; Close panel
    delete | Delete; Delete forever; Delete account; Remove; Remove from cart; Move to trash; Clear all
    edit | Edit; Edit profile; Rename; Modify; Change; Update
    add | Add; Add item; Add to cart; Add another; Add new; Add to list; + New; Create
    next | Next; Next step; Continue; Continue to payment; Proceed; Go; Let's go
    back | Back; Go back; Previous; Return; Back to cart; Back to results
    finish | Finish; Done; Complete; Complete purchase; Finish setup; All done; I'm done
    send | Send; Send now; Send message; Send invite; Send reply; Resend code
    share | Share; Share link; Copy link; Invite people; Get link
    download | Download; Download PDF; Export; Export as CSV; Download all
    upload | Upload; Upload file; Choose file; Browse...; Attach; Import
    search | Search; Find; Search now; Look up
    filter | Filter; Apply filters; Clear filters; Reset filters; Show results
    sort | Sort; Sort by date; Sort A-Z; Newest first
    login | Sign in; Log in; Sign in with email; Continue with SSO; Use passkey
    logout | Sign out; Log out; Switch account
    signup | Sign up; Create account; Register; Join now; Get started; Start free trial
    buy | Buy now; Checkout; Place order; Pay now; Proceed to checkout; Reserve
    book | Book now; Book a table; Check availability; Select seat; Choose this flight
    subscribe | Subscribe; Follow; Unsubscribe; Unfollow; Notify me; Join waitlist
    accept | Accept; Accept all; Allow; Allow all; OK; Okay; Agree and continue
    reject | Reject; Reject all; Decline; Deny; Don't allow; No thanks
    help | Help; Get help; Contact us; Live chat; FAQ
    settings | Settings; Preferences; Options; Customize; Manage
    more | More; More options; Show more; See all; View all; Load more
    less | Show less; Collapse; See less
    expand | Expand; Expand all; Open; Show details; View details
    retry | Retry; Try again; Reload; Refresh; Reconnect
    undo | Undo; Redo; Restore; Revert; Undo send
    copy | Copy; Duplicate; Copy to clipboard; Clone
    print | Print; Print receipt; Print label
    preview | Preview; Preview changes; Live preview; View as visitor
    reply | Reply; Reply all; Forward; Quote
    archive | Archive; Unarchive; Mark as read; Mark as unread; Snooze
    reset | Reset; Reset password; Reset to defaults; Start over
    apply | Apply; Apply code; Redeem; Use this address
    select | Select; Select all; Deselect all; Choose; Pick a date
    verify | Verify; Verify email; Send code; Check
    skip | Skip; Skip for now; Remind me later; Maybe later; Not now
    publish | Publish; Unpublish; Schedule; Post; Go live
    approve | Approve; Reject request; Request changes; Mark resolved
    play | Play; Pause; Stop; Mute; Unmute
    zoom | Zoom in; Zoom out; Fit to screen; Full screen; Exit full screen
    move | Move; Move up; Move down; Move to...; Pin; Unpin
  `).map(([intent, labels]) => ({ intent, labels: labels.split(';').map((s) => s.trim()) }));


  // menu name, then 'label | shortcut' lines.
  const menu = (name, block) => ({ menu: name, items: C.rows(block).map(([label, shortcut]) => (shortcut ? { label, shortcut } : { label })) });
  const MENU_ITEMS = [
    menu('File', `
      New | Ctrl+N
      New window | Ctrl+Shift+N
      New from template...
      Open... | Ctrl+O
      Open recent
      Close | Ctrl+W
      Save | Ctrl+S
      Save as... | Ctrl+Shift+S
      Save a copy
      Export
      Import...
      Make a copy
      Share
      Version history
      Page setup
      Print | Ctrl+P
      Properties
      Exit
    `),
    menu('Edit', `
      Undo | Ctrl+Z
      Redo | Ctrl+Y
      Cut | Ctrl+X
      Copy | Ctrl+C
      Paste | Ctrl+V
      Paste without formatting | Ctrl+Shift+V
      Delete | Del
      Select all | Ctrl+A
      Find | Ctrl+F
      Find and replace | Ctrl+H
      Go to line... | Ctrl+G
      Duplicate | Ctrl+D
      Preferences
    `),
    menu('View', `
      Zoom in | Ctrl++
      Zoom out | Ctrl+-
      Actual size | Ctrl+0
      Full screen | F11
      Show ruler
      Show grid
      Show sidebar
      Hide toolbar
      Outline
      Page layout
      Dark theme
      Compact mode
      Split view
      Refresh | F5
    `),
    menu('Insert', `
      Image
      Table
      Chart
      Link | Ctrl+K
      Comment | Ctrl+Alt+M
      Footnote
      Page break
      Horizontal line
      Date and time
      Special characters
      Equation
      Bookmark
    `),
    menu('Format', `
      Bold | Ctrl+B
      Italic | Ctrl+I
      Underline | Ctrl+U
      Strikethrough
      Text color
      Highlight color
      Align left
      Align center
      Align right
      Line spacing
      Bullets and numbering
      Clear formatting | Ctrl+\\
    `),
    menu('Tools', `
      Spelling and grammar
      Word count
      Translate
      Macros
      Extensions
      Accessibility checker
      Compare documents
      Script editor
      Options...
    `),
    menu('Window', `
      Minimize | Ctrl+M
      Zoom
      Bring all to front
      Tile left
      Tile right
      Arrange all
      New tab
      Move tab to new window
    `),
    menu('Help', `
      Help center
      Keyboard shortcuts | Ctrl+/
      What's new
      Release notes
      Report a problem
      Send feedback
      Contact support
      Training videos
      Check for updates
      About
    `),
    menu('Account', `
      Profile
      Account settings
      Billing
      Plans and pricing
      Security
      Connected apps
      Notifications
      Language
      Switch account
      Sign out
    `),
    menu('Admin', `
      Users
      Groups
      Roles and permissions
      Invite members
      Audit log
      Billing and invoices
      Single sign-on
      API keys
      Webhooks
      Data retention
      Usage reports
      Organization settings
    `),
    menu('Row actions', `
      Open
      Edit
      Duplicate
      Rename
      Move to...
      Copy link
      Download
      Archive
      Add to favorites
      Delete
    `),
    menu('Message', `
      Reply
      Reply all
      Forward
      Mark as unread
      Flag
      Snooze
      Move to folder
      Add label
      Block sender
      Report spam
      Print message
      Show original
    `),
    menu('File actions', `
      Open with
      Preview
      Share
      Get link
      Make available offline
      Show file location
      Rename
      Move to
      Add shortcut
      Version history
      Download
      Remove
    `),
    menu('Table', `
      Insert row above
      Insert row below
      Insert column left
      Insert column right
      Delete row
      Delete column
      Merge cells
      Split cells
      Sort ascending
      Sort descending
      Freeze first row
      Table properties
    `),
    menu('Arrange', `
      Bring to front
      Bring forward
      Send backward
      Send to back
      Group
      Ungroup
      Lock
      Align to page
    `),
    menu('Sort by', `
      Name (A-Z)
      Name (Z-A)
      Date modified
      Date created
      Size
      Type
      Price: low to high
      Price: high to low
      Most popular
      Newest
      Best rated
    `),
    menu('Share', `
      Copy link
      Email
      Embed
      Invite people
      Share to channel
      Export as PDF
      QR code
      Who has access
    `),
    menu('Profile', `
      View profile
      Edit profile
      Status: Available
      Status: Busy
      Do not disturb
      Set away
      My files
      Saved items
      Help
      Log out
    `),
    menu('Project', `
      Project overview
      Board
      Timeline
      Backlog
      Reports
      Members
      Integrations
      Project settings
      Archive project
    `),
    menu('Go', `
      Back | Alt+Left
      Forward | Alt+Right
      Home
      Downloads
      Recent
      Starred
      Trash
      Go to folder...
    `),
    menu('Selection', `
      Select all
      Select none
      Invert selection
      Expand selection
      Select same color
      Select similar
      Save selection
    `),
    menu('Calendar', `
      Day
      Week
      Month
      Year
      Agenda
      Today | T
      New event
      Print calendar
      Subscribe to calendar
    `),
    menu('Cart', `
      View cart
      Edit quantities
      Save for later
      Apply coupon
      Estimate shipping
      Empty cart
      Checkout
    `),
    menu('Image', `
      Crop
      Rotate left
      Rotate right
      Flip horizontal
      Flip vertical
      Resize image...
      Adjust colors
      Replace image
      Alt text
    `),
  ];

  const NAV_ITEMS = L(`
    Home
    Dashboard
    Inbox
    Messages
    Notifications
    Projects
    Tasks
    Calendar
    Files
    Documents
    Reports
    Analytics
    Insights
    Customers
    Contacts
    Leads
    Deals
    Orders
    Invoices
    Payments
    Products
    Inventory
    Catalog
    Collections
    Shop
    Store
    Deals of the day
    Categories
    Brands
    New in
    Sale
    Wishlist
    Cart
    Account
    Profile
    Settings
    Billing
    Team
    Members
    People
    Directory
    Admin
    Integrations
    Apps
    Marketplace
    Help
    Support
    Docs
    Blog
    News
    Events
    Community
    Forum
    Groups
    Explore
    Discover
    Trending
    Saved
    Bookmarks
    History
    Library
    Playlists
    Watch later
    Downloads
    Photos
    Albums
    Videos
    Live
    Sports
    Weather
    Travel
    Flights
    Hotels
    Car rental
    Trips
    Bookings
    Reservations
    Menu
    Locations
    About
    Careers
    Contact
    Pricing
    Features
    Solutions
    Resources
    Partners
    Investors
    Press
    Status
    Security
    Privacy
    Legal
    Sitemap
    Feedback
    What's new
    Getting started
    Tutorials
    Templates
    Courses
    Grades
    Assignments
    Classes
    Schedule
    Timesheets
    Expenses
    Approvals
    Workflows
    Automations
    Audit log
    Archive
    Trash
    Drafts
    Sent
    Spam
    Starred
  `);

  // group, then 'id | label | kind | negated (0/1) | description | options or min..max unit'
  const SETTINGS = [];
  const S = (group, block) => {
    for (const [id, label, kind, neg, description, extra] of C.rows(block)) {
      const s = { id, label, group, kind, negated: neg === '1', description };
      if (kind === 'select') s.options = extra.split(',').map((x) => x.trim());
      if (kind === 'number') {
        const m = /^(-?[\d.]+)\.\.(-?[\d.]+)\s*(.*)$/.exec(extra);
        s.min = Number(m[1]);
        s.max = Number(m[2]);
        if (m[3]) s.unit = m[3];
      }
      SETTINGS.push(s);
    }
  };
  S('Notifications', `
    email_notifications | Email notifications | toggle | 0 | Get an email when something needs your attention.
    disable_notifications | Disable notifications | toggle | 1 | Turn off all notifications, including mentions.
    push_notifications | Push notifications on this device | toggle | 0 | Show alerts even when the app is closed.
    weekly_digest | Weekly summary email | toggle | 0 | A recap of activity every Monday morning.
    mute_mentions | Mute @mentions | toggle | 1 | You won't be notified when someone mentions you.
    notification_sound | Notification sound | select | 0 | Sound played for new alerts. | Chime, Ding, Pop, Marimba, None
    quiet_hours | Quiet hours | toggle | 0 | Pause notifications from 22:00 to 07:00.
    quiet_start | Quiet hours start | select | 0 | When quiet hours begin. | 20:00, 21:00, 22:00, 23:00, 00:00
    marketing_emails | Product news and offers | toggle | 0 | Occasional emails about new features and promotions.
    unsubscribe_all | Unsubscribe from all marketing emails | toggle | 1 | You'll still receive account and security emails.
    reminder_lead | Remind me before events | select | 0 | How early event reminders are sent. | 5 minutes, 10 minutes, 30 minutes, 1 hour, 1 day
    sms_alerts | Text message alerts | toggle | 0 | Standard messaging rates may apply.
    no_badges | Hide unread badges | toggle | 1 | Don't show unread counts on icons.
    digest_frequency | Digest frequency | select | 0 | How often we send activity summaries. | Daily, Weekly, Monthly, Never
    desktop_banner | Show desktop banners | toggle | 0 | Pop-up alerts in the corner of your screen.
  `);
  S('Privacy', `
    hide_email | Hide my email address | toggle | 1 | Other members won't see your email on your profile.
    public_profile | Public profile | toggle | 0 | Anyone on the internet can view your profile.
    private_account | Make account private | toggle | 1 | Only approved followers can see your posts.
    search_visibility | Show my profile in search results | toggle | 0 | Let search engines link to your profile.
    show_online | Show when I'm online | toggle | 0 | Let others see your active status.
    hide_activity | Hide my activity status | toggle | 1 | Others won't see when you were last active.
    read_receipts | Send read receipts | toggle | 0 | Let people know when you've read their messages.
    disable_read_receipts | Turn off read receipts | toggle | 1 | Senders won't see when you open their messages.
    ad_personalization | Personalized ads | toggle | 0 | Use your activity to show more relevant ads.
    opt_out_ads | Opt out of personalized ads | toggle | 1 | You'll still see ads, but they'll be less relevant.
    usage_data | Share usage data | toggle | 0 | Help us improve by sending anonymous usage statistics.
    do_not_track | Do not track my activity | toggle | 1 | We won't record pages you visit within the app.
    who_can_message | Who can message me | select | 0 | Limit who can start a conversation with you. | Everyone, People I follow, Contacts only, No one
    profile_photo_visibility | Profile photo visible to | select | 0 | Choose who sees your photo. | Everyone, Members, Contacts, Only me
    location_sharing | Share my location | toggle | 0 | Show your city on posts and your profile.
    block_tagging | Prevent others from tagging me | toggle | 1 | You won't appear in photos others post.
    data_retention | Keep my history for | select | 0 | Older activity is deleted automatically. | 3 months, 18 months, 36 months, Forever
  `);
  S('Security', `
    two_factor | Two-factor authentication | toggle | 0 | Require a code from your phone when you sign in.
    disable_2fa | Turn off two-step verification | toggle | 1 | Your account will be protected by your password only.
    login_alerts | Alert me about new sign-ins | toggle | 0 | Get an email when your account is used on a new device.
    remember_device | Remember this device | toggle | 0 | Skip the code on this browser for 30 days.
    session_timeout | Sign out after inactivity | select | 0 | Automatically sign out idle sessions. | 15 minutes, 30 minutes, 1 hour, 8 hours, Never
    password_expiry | Password expires every | select | 0 | Require a new password periodically. | 30 days, 90 days, 180 days, Never
    allow_api_tokens | Allow personal access tokens | toggle | 0 | Let scripts access your account with a token.
    block_unknown_devices | Block sign-ins from unknown devices | toggle | 0 | New devices must be approved from a trusted one.
    disable_password_login | Disable password sign-in | toggle | 1 | Use passkeys or single sign-on only.
    max_login_attempts | Lock account after failed attempts | number | 0 | Number of wrong passwords before a temporary lock. | 3..10
    recovery_email | Use recovery email | toggle | 0 | Send recovery codes to a second address.
  `);
  S('Appearance', `
    theme | Theme | select | 0 | Choose how the app looks. | Light, Dark, System default, High contrast
    dark_mode | Dark mode | toggle | 0 | Use a dark color scheme.
    disable_animations | Reduce motion | toggle | 1 | Turn off non-essential animations.
    font_size | Font size | select | 0 | Text size across the app. | Small, Medium, Large, Extra large
    compact_view | Compact view | toggle | 0 | Show more items with less spacing.
    hide_sidebar | Hide sidebar by default | toggle | 1 | Start with the navigation collapsed.
    accent_color | Accent color | select | 0 | Color for buttons and highlights. | Blue, Green, Purple, Orange, Pink, Gray
    density | Display density | select | 0 | How tightly lists are packed. | Comfortable, Cozy, Compact
    show_avatars | Show profile pictures | toggle | 0 | Display avatars next to names.
    hide_previews | Hide message previews | toggle | 1 | Show only the subject line in the inbox.
    zoom_level | Default zoom | number | 0 | Page zoom for all documents. | 50..200 %
    sidebar_width | Sidebar width | number | 0 | Width of the navigation panel. | 180..400 px
    show_line_numbers | Show line numbers | toggle | 0 | Display line numbers in the editor.
    no_emoji | Show emoji as text | toggle | 1 | Replace pictures with text codes.
  `);
  S('Language & region', `
    language | Language | select | 0 | Language used for menus and messages. | English (US), English (UK), Deutsch, Français, Español, Português (Brasil), Italiano, Nederlands, Polski, 日本語, 简体中文
    timezone | Time zone | select | 0 | Used for timestamps and reminders. | UTC-8 Pacific, UTC-5 Eastern, UTC+0 London, UTC+1 Berlin, UTC+5:30 Delhi, UTC+8 Singapore, UTC+9 Tokyo
    date_format | Date format | select | 0 | How dates are displayed. | MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD.MM.YYYY
    time_format | Use 24-hour clock | toggle | 0 | Show 13:00 instead of 1:00 PM.
    first_day | First day of the week | select | 0 | Affects calendars and date pickers. | Sunday, Monday, Saturday
    units | Measurement units | select | 0 | Distances, weights and temperatures. | Metric, Imperial
    currency | Display currency | select | 0 | Prices are converted for display only. | USD, EUR, GBP, JPY, CNY, BRL, PLN
    auto_translate | Translate posts automatically | toggle | 0 | Show posts in your language.
    no_auto_translate | Never translate | toggle | 1 | Always show posts in their original language.
    spellcheck_language | Spell-check language | select | 0 | Dictionary used while typing. | English, German, French, Spanish, Portuguese
  `);
  S('Account', `
    display_name | Show full name | toggle | 0 | Use your full name instead of your username.
    deactivate | Deactivate account | toggle | 1 | Hide your profile until you sign in again.
    email_frequency | Account emails | select | 0 | How often we email you about your account. | All, Important only, None
    default_visibility | Default post visibility | select | 0 | Who can see new posts by default. | Public, Followers, Team, Private
    stay_signed_in | Stay signed in | toggle | 0 | Keep me signed in on this device.
    export_attachments | Include attachments in data export | toggle | 0 | Exports will be larger but complete.
    storage_warning | Warn me when storage is | number | 0 | Show a warning at this usage level. | 50..100 %
    newsletter | Subscribe to newsletter | toggle | 0 | One email per month, no spam.
    pause_subscription | Pause my subscription | toggle | 1 | Billing stops until you resume.
    auto_renew | Renew automatically | toggle | 0 | Your plan renews at the end of each period.
    cancel_auto_renew | Cancel automatic renewal | toggle | 1 | Your plan ends at the end of the current period.
  `);
  S('Editor', `
    autosave | Auto-save | toggle | 0 | Save changes every few seconds.
    disable_autosave | Turn off auto-save | toggle | 1 | You'll need to save manually.
    spellcheck | Check spelling as I type | toggle | 0 | Underline misspelled words.
    autocorrect | Autocorrect | toggle | 0 | Fix common typos automatically.
    no_autocorrect | Don't correct spelling automatically | toggle | 1 | Typos are underlined but not changed.
    smart_quotes | Use smart quotes | toggle | 0 | Replace straight quotes with curly ones.
    tab_size | Tab size | number | 0 | Spaces per indentation level. | 2..8 spaces
    word_wrap | Wrap long lines | toggle | 0 | Lines break at the edge of the window.
    show_whitespace | Show whitespace characters | toggle | 0 | Display spaces and tabs as dots and arrows.
    default_font | Default font | select | 0 | Font for new documents. | Sans serif, Serif, Monospace, Rounded
    autosave_interval | Auto-save every | number | 0 | Interval between automatic saves. | 5..300 seconds
    suggestions | Writing suggestions | toggle | 0 | Grammar and style hints in the margin.
    hide_comments | Hide resolved comments | toggle | 1 | Resolved threads are collapsed.
  `);
  S('Media', `
    autoplay | Autoplay videos | toggle | 0 | Videos start playing as you scroll.
    disable_autoplay | Don't autoplay videos | toggle | 1 | Tap a video to start it.
    captions | Always show captions | toggle | 0 | Display subtitles when available.
    video_quality | Video quality | select | 0 | Higher quality uses more data. | Auto, 480p, 720p, 1080p, 4K
    data_saver | Data saver | toggle | 0 | Load lower-resolution images on mobile data.
    volume | Default volume | number | 0 | Starting volume for media. | 0..100 %
    download_wifi_only | Download over Wi-Fi only | toggle | 0 | Don't use mobile data for downloads.
    playback_speed | Playback speed | select | 0 | Default speed for audio and video. | 0.75x, 1x, 1.25x, 1.5x, 2x
    mute_on_start | Start muted | toggle | 1 | Media plays without sound until you unmute.
    crossfade | Crossfade between songs | number | 0 | Overlap between tracks. | 0..12 seconds
    explicit_filter | Filter explicit content | toggle | 0 | Hide songs and videos marked explicit.
  `);
  S('Shopping', `
    one_click | One-click ordering | toggle | 0 | Buy instantly with your default card and address.
    save_cards | Save payment methods | toggle | 0 | Store cards for faster checkout.
    no_save_cards | Don't save my card | toggle | 1 | You'll enter card details each time.
    price_alerts | Price drop alerts | toggle | 0 | Email me when wishlist items go on sale.
    paperless | Paperless receipts | toggle | 0 | Receipts are emailed instead of printed.
    default_shipping | Default shipping speed | select | 0 | Used when you check out. | Standard, Express, Next-day, Store pickup
    gift_receipt | Include gift receipt | toggle | 0 | Prices are hidden on the packing slip.
    hide_purchases | Hide purchases from family members | toggle | 1 | Shared accounts won't see your orders.
    order_updates | Order status updates | select | 0 | How we tell you about your orders. | Email, SMS, Push, Email and SMS
    max_budget | Monthly spending limit | number | 0 | Warn me when I go over this amount. | 0..5000 USD
  `);
  S('Workspace', `
    allow_guests | Allow guest access | toggle | 0 | People outside your organization can join channels.
    restrict_invites | Only admins can invite | toggle | 1 | Members can't invite new people.
    default_role | Default role for new members | select | 0 | Permissions granted on joining. | Viewer, Commenter, Editor, Admin
    retention_days | Delete messages after | number | 0 | Messages older than this are removed. | 30..3650 days
    disable_file_sharing | Disable external file sharing | toggle | 1 | Files can only be shared inside the organization.
    require_sso | Require single sign-on | toggle | 0 | Members must sign in through your identity provider.
    seat_limit | Maximum seats | number | 0 | Upper limit for paid seats. | 1..500
    working_hours | Show working hours | toggle | 0 | Let teammates see when you're available.
    meeting_length | Default meeting length | select | 0 | Duration of new calendar events. | 15 minutes, 25 minutes, 30 minutes, 45 minutes, 60 minutes
    hide_member_list | Hide member list from guests | toggle | 1 | Guests only see people they talk to.
  `);
  S('Accessibility', `
    screen_reader | Optimize for screen readers | toggle | 0 | Simplify layouts and add extra labels.
    high_contrast | High contrast mode | toggle | 0 | Stronger borders and text colors.
    keyboard_shortcuts | Keyboard shortcuts | toggle | 0 | Use single-key shortcuts like J and K.
    disable_shortcuts | Turn off single-key shortcuts | toggle | 1 | Avoid accidental actions while typing.
    underline_links | Always underline links | toggle | 0 | Make links easier to spot.
    cursor_size | Pointer size | number | 0 | Size of the mouse pointer. | 1..5
    flash_alerts | Flash screen for alerts | toggle | 0 | Visual alternative to notification sounds.
    no_flashing | Stop flashing images | toggle | 1 | Pause animated images automatically.
    dyslexia_font | Dyslexia-friendly font | toggle | 0 | Use a font with heavier letter bottoms.
    alt_text_prompt | Remind me to add alt text | toggle | 0 | Prompt for image descriptions before posting.
  `);
  S('Sync & storage', `
    sync_enabled | Sync across devices | toggle | 0 | Keep settings and history the same everywhere.
    pause_sync | Pause sync | toggle | 1 | Changes stay on this device until you resume.
    offline_mode | Make files available offline | toggle | 0 | Recent files are stored on this device.
    cache_size | Cache size limit | number | 0 | Space used for temporary files. | 100..5000 MB
    backup_frequency | Back up | select | 0 | How often to back up your data. | Hourly, Daily, Weekly, Manually
    clear_on_exit | Clear history when I close the app | toggle | 1 | Nothing is kept between sessions.
    upload_quality | Photo upload quality | select | 0 | Original uses more storage. | Original, High, Storage saver
    keep_versions | Versions to keep | number | 0 | Older versions are deleted. | 1..100
  `);
  S('Location & devices', `
    location_access | Allow location access | toggle | 0 | Used for nearby stores and local weather.
    deny_location | Never share my location | toggle | 1 | Location-based features won't work.
    camera_access | Allow camera access | toggle | 0 | Needed for video calls and scanning codes.
    microphone_access | Allow microphone access | toggle | 0 | Needed for voice messages.
    bluetooth_pairing | Allow Bluetooth pairing | toggle | 0 | Connect speakers and wearables.
    battery_saver | Battery saver | toggle | 0 | Reduce background activity when the battery is low.
    background_refresh | Refresh in background | toggle | 0 | Keep content up to date when the app is closed.
    default_printer | Default printer | select | 0 | Used when you press Print. | Office Printer 2F, Reception Printer, Save as PDF
    screen_timeout | Turn off screen after | select | 0 | Saves energy when idle. | 30 seconds, 1 minute, 5 minutes, 10 minutes, Never
    brightness | Brightness | number | 0 | Screen brightness. | 0..100 %
  `);

  // id | label | kind | aliases (; separated) | placeholder
  const FIELD_LABELS = C.rows(`
    first_name | First name | text | Given name; First Name; Forename; Name (first) | e.g. Amara
    last_name | Last name | text | Surname; Family name; last name; Last Name | e.g. Okafor
    full_name | Full name | text | Name; Your name; Full Name; Name and surname | Jane Doe
    middle_name | Middle name | text | Middle initial; Middle Name; Second name |
    preferred_name | Preferred name | text | Nickname; What should we call you?; Display name |
    username | Username | text | User name; Login; User ID; Handle | Choose a username
    email | Email | email | Email address; E-mail; Your email; Work email; email | you@example.com
    email_confirm | Confirm email | email | Repeat email; Re-enter email; Confirm email address |
    password | Password | text | Passcode; Your password; Create password; New password | At least 8 characters
    password_confirm | Confirm password | text | Repeat password; Re-enter password; Verify password |
    current_password | Current password | text | Old password; Existing password |
    phone | Phone number | phone | Phone; Mobile; Telephone; Cell phone; Contact number | +1 555 0100
    work_phone | Work phone | phone | Office phone; Business phone; Phone (work) |
    birth_date | Date of birth | date | Birthday; DOB; Birth date; Born on | MM/DD/YYYY
    gender | Gender | select | Sex; Gender identity |
    pronouns | Pronouns | select | Preferred pronouns |
    nationality | Nationality | select | Citizenship; Country of citizenship |
    address1 | Address line 1 | text | Street address; Address; Street and number; Street | 123 Main Street
    address2 | Address line 2 | text | Apartment, suite, etc.; Apt / Unit; Address (cont.); Flat, floor | Apt 4B (optional)
    city | City | text | Town; Town/City; City / Town; Locality |
    state | State | select | Province; Region; State / Province; County |
    postcode | ZIP code | text | Postal code; Postcode; ZIP; PLZ; Post code | 10001
    country | Country | select | Country/Region; Country of residence; Nation |
    company | Company | text | Organization; Company name; Employer; Business name |
    job_title | Job title | text | Position; Role; Title; Occupation |
    department | Department | select | Team; Division; Business unit |
    website | Website | text | URL; Homepage; Web address; Site | https://
    linkedin | Professional profile URL | text | Profile link; Portfolio link |
    bio | Bio | text | About you; About me; Short bio; Description | Tell us a little about yourself
    card_number | Card number | number | Credit card number; Card no.; Debit card number | 1234 5678 9012 3456
    card_name | Name on card | text | Cardholder name; Card holder; Name as it appears on card |
    card_expiry | Expiration date | date | Expiry; Exp. date; Valid thru; MM/YY | MM/YY
    card_cvc | Security code | number | CVC; CVV; CVV2; Card verification code | 3 digits
    billing_zip | Billing ZIP code | text | Billing postal code; Billing postcode |
    coupon | Promo code | text | Coupon code; Discount code; Voucher; Gift code | Enter code
    gift_message | Gift message | text | Message for the recipient; Card message | Add a personal note
    order_number | Order number | text | Order ID; Order #; Order reference | e.g. #48213
    quantity | Quantity | number | Qty; Amount; Number of items; Count | 1
    tracking_number | Tracking number | text | Tracking ID; Shipment number; Consignment number |
    check_in | Check-in date | date | Arrival; Arrival date; Check in | Add date
    check_out | Check-out date | date | Departure; Departure date; Check out | Add date
    guests | Guests | number | Number of guests; Travelers; Passengers; People | 2 adults
    rooms | Rooms | number | Number of rooms |
    departure_city | From | text | Origin; Leaving from; Departure city; Departure airport | City or airport
    arrival_city | To | text | Destination; Going to; Arrival city; Arrival airport | City or airport
    depart_date | Departure date | date | Depart; Outbound date; Leave on |
    return_date | Return date | date | Return; Inbound date; Come back on |
    cabin_class | Cabin class | select | Class; Travel class; Seat class |
    passport_number | Passport number | text | Passport No.; Travel document number |
    passport_expiry | Passport expiry date | date | Passport valid until; Expiration |
    seat_preference | Seat preference | select | Seat; Preferred seat |
    meal_preference | Meal preference | select | Dietary requirements; Special meal |
    subject | Subject | text | Title; Topic; Re; Regarding | What's this about?
    message | Message | text | Comments; Your message; Details; Description; Notes | Write your message...
    to | To | email | Recipient; Recipients; Send to |
    cc | Cc | email | Copy to; CC |
    search | Search | text | Find; Search for; Look up; Keywords | Search...
    start_date | Start date | date | From; Begins; Start; Valid from |
    end_date | End date | date | To; Until; Ends; Valid until |
    start_time | Start time | text | From (time); Begins at; Time |
    end_time | End time | text | Until (time); Ends at |
    due_date | Due date | date | Deadline; Due by; Due |
    priority | Priority | select | Urgency; Importance; Severity |
    status | Status | select | State; Stage |
    category | Category | select | Type; Kind; Topic; Section |
    tags | Tags | text | Labels; Keywords; Topics | Add tags
    assignee | Assignee | select | Assigned to; Owner; Responsible |
    project | Project | select | Workspace; Board |
    amount | Amount | number | Total; Sum; Value; Price | 0.00
    currency | Currency | select | Payment currency |
    account_number | Account number | text | Account no.; IBAN; Bank account |
    routing_number | Routing number | text | Sort code; Bank code; BIC/SWIFT |
    tax_id | Tax ID | text | VAT number; Tax number; TIN; SSN (last 4) |
    company_size | Company size | select | Number of employees; Team size; Organization size |
    industry | Industry | select | Sector; Field; Business type |
    budget | Budget | number | Budget range; Estimated budget |
    salary | Expected salary | number | Salary expectations; Desired pay; Compensation |
    start_availability | Available from | date | Earliest start date; Availability; Notice period |
    resume | Resume | text | CV; Curriculum vitae; Upload resume |
    cover_letter | Cover letter | text | Motivation letter; Why do you want to join? |
    years_experience | Years of experience | number | Experience (years); Work experience |
    school | School | text | University; College; Institution; Education |
    degree | Degree | select | Qualification; Highest degree; Level of education |
    graduation_year | Graduation year | number | Year of graduation; Class of |
    emergency_contact | Emergency contact | text | In case of emergency; ICE contact; Next of kin |
    emergency_phone | Emergency contact phone | phone | ICE phone; Emergency number |
    relationship | Relationship | select | Relation to you; Relationship to patient |
    allergies | Allergies | text | Known allergies; Allergy information | None
    medications | Current medications | text | Medicines; Prescriptions |
    insurance_number | Insurance number | text | Policy number; Member ID; Insurance ID |
    doctor | Preferred doctor | select | Physician; Practitioner; GP |
    appointment_date | Appointment date | date | Date; Visit date; Preferred date |
    appointment_time | Appointment time | select | Time slot; Preferred time |
    reason | Reason for visit | text | Reason; Purpose; What brings you in? |
    vehicle_make | Vehicle make | select | Make; Manufacturer; Car brand |
    vehicle_model | Model | text | Vehicle model; Car model |
    license_plate | License plate | text | Registration number; Plate number; Reg. no. |
    mileage | Mileage | number | Odometer; Kilometers; Miles driven |
    pet_name | Pet's name | text | Name of your pet; Pet name |
    pet_type | Pet type | select | Species; Animal |
    breed | Breed | text | Pet breed |
    weight | Weight | number | Weight (kg); Body weight; Weight (lbs) |
    height | Height | number | Height (cm); Height (ft/in) |
    size | Size | select | Clothing size; Fit; Shoe size |
    color | Color | select | Colour; Shade; Finish |
    language | Language | select | Preferred language; Language spoken |
    timezone | Time zone | select | Timezone; Your time zone |
    referral | How did you hear about us? | select | Referral source; Where did you find us?; Source |
    newsletter_optin | Subscribe to newsletter | checkbox | Email updates; Keep me informed; Sign me up for news |
    terms | I accept the terms | checkbox | Terms and conditions; Agree to terms; I agree |
    captcha | Verification | text | Type the characters you see; Security check |
    rating | Rating | number | Stars; Score; Your rating |
    review_title | Review title | text | Headline; Summarize your review |
    review_body | Your review | text | Review; Comments; Tell others what you think |
    file | Attachment | text | File; Upload; Attach file; Document |
    invite_code | Invite code | text | Invitation code; Access code; Referral code |
    pin | PIN | number | PIN code; Security PIN; 4-digit PIN | 4 digits
    otp | Verification code | number | One-time code; 6-digit code; Security code (SMS); OTP | 123456
    team_name | Team name | text | Workspace name; Group name; Organization name |
    project_name | Project name | text | Name of project; Title |
    url_slug | URL | text | Slug; Link; Permalink |
  `).map(([id, label, kind, aliases, placeholder]) => {
    const f = { id, label, kind, aliases: aliases ? aliases.split(';').map((a) => a.trim()).filter(Boolean) : [] };
    if (placeholder) f.placeholder = placeholder;
    if (/password|pin|card_cvc/.test(id)) f.secret = true;
    return f;
  });

  // name | tooltip
  const ICON_NAMES = C.rows(`
    home | Home
    search | Search
    menu | Open menu
    close | Close
    settings | Settings
    user | Account
    users | Team members
    bell | Notifications
    mail | Messages
    inbox | Inbox
    send | Send
    paperclip | Attach a file
    image | Insert image
    camera | Take a photo
    video | Start video call
    mic | Record voice message
    mic-off | Unmute
    phone | Call
    calendar | Open calendar
    clock | History
    star | Add to favorites
    star-filled | Remove from favorites
    heart | Like
    bookmark | Save for later
    share | Share
    link | Copy link
    download | Download
    upload | Upload
    cloud | Sync status
    trash | Delete
    archive | Archive
    edit | Edit
    pencil | Rename
    copy | Duplicate
    clipboard | Paste
    undo | Undo
    redo | Redo
    refresh | Refresh
    filter | Filter results
    sort | Sort
    grid | Grid view
    list | List view
    columns | Choose columns
    expand | Expand
    collapse | Collapse
    fullscreen | Full screen
    zoom-in | Zoom in
    zoom-out | Zoom out
    lock | Locked
    unlock | Unlock
    eye | Show password
    eye-off | Hide password
    info | More information
    help | Help
    alert | Warning
    check | Mark as done
    plus | Add new
    minus | Remove
    more-horizontal | More actions
    more-vertical | Options
    chevron-left | Previous
    chevron-right | Next
    arrow-up | Move up
    arrow-down | Move down
    external | Open in new tab
    cart | Shopping cart
    tag | Add label
    flag | Report
    pin | Pin to top
    print | Print
    moon | Dark mode
    sun | Light mode
    globe | Language
    map-pin | Location
    wifi | Connection status
    battery | Battery level
    logout | Sign out
    play | Play
    pause | Pause
    volume | Volume
    mute | Mute
    code | View source
    terminal | Open console
    layers | Layers
    crop | Crop image
    rotate | Rotate
    palette | Change color
    text | Text formatting
    bold | Bold
    italic | Italic
    align-left | Align left
  `).map(([name, tooltip]) => ({ name, tooltip }));


  const END_LABELS = L(`
    Submit
    Done
    Finish
    Continue
    Save
    OK
    Confirm
    Apply
    Send
    Complete
    Next
    I'm done
    Submit answer
    Check
    Finish task
    Save and exit
    Proceed
    Go
    Accept
    Update
    Finalize
    Mark complete
    Let's go
    All set
    Ready
  `);

  const DECOY_LABELS = L(`
    Help
    Reset view
    Feedback
    Preview
    Save draft
    Print
    Share
    Settings
    Learn more
    Undo
    Tips
    Show hints
    Refresh
    Zoom in
    Zoom out
    Full screen
    Report a problem
    Keyboard shortcuts
    Contact us
    View history
    Export
    Copy link
    About
    What's new
    Tutorial
    Change theme
    Language
    Notifications
    Sync
    Restore defaults
    Customize
    Expand
    Collapse all
    Bookmark
    Invite
  `);

  // kind -> [{ text, buttons[] }]; the first button is the primary action.
  const banner = (block) => C.rows(block).map(([text, buttons]) => ({ text, buttons: buttons.split(';').map((b) => b.trim()) }));
  const BANNER_TEXTS = {
    cookie: banner(`
      We use cookies to improve your experience and to analyze site traffic. | Accept all; Reject all; Cookie settings
      This site uses cookies. By continuing to browse, you agree to our use of cookies. | OK; Learn more
      We and our partners store and access information on your device to personalize content and ads. | Accept; Manage options
      Cookies help us deliver our services. Some are essential, others help us improve. | Allow all; Only essential; Customize
      We value your privacy. Choose which cookies you allow. | Accept all cookies; Reject non-essential; Preferences
      Can we use optional cookies? They help us understand how you use the site. | Yes, allow; No, thanks
      This website uses cookies for analytics and personalized content. | Got it; Decline; Settings
      To give you the best experience, we use cookies. You can change your choice at any time. | Agree; Disagree; More info
      We use essential cookies to make our site work. With your consent, we'd also like to set analytics cookies. | Accept analytics; Reject analytics; View policy
      Your privacy matters. We use cookies to remember your preferences. | Accept; Reject; Manage
      We'd like to set additional cookies to understand how you use our service. | Accept additional cookies; Reject additional cookies; View cookies
      Cookies on this site: essential, performance and marketing. | Accept all; Necessary only; Configure
      By clicking "Accept", you agree to the storing of cookies on your device. | Accept; Cookie settings
      We use cookies and similar technologies. See our Cookie Policy for details. | I understand; Change settings
      Hungry for cookies? So are we. We use them to improve your visit. | Sounds good; No thanks; Let me choose
      This site uses tracking technologies. You may opt in or opt out. | Opt in; Opt out
      We need your consent before you can continue using our website. | Continue with recommended settings; Reject all; Show details
      Cookies keep you signed in and help us fix bugs faster. | Allow cookies; Block optional cookies
      Some features need cookies to work properly. | Enable cookies; Continue without
      Privacy notice: we and 24 partners use cookies for measurement and ads. | Accept & close; Reject & close; Options
      Before you continue: we use cookies and data to deliver and maintain our services. | Accept all; Reject all; More options
      Help us improve: allow anonymous usage statistics? | Allow; Don't allow
    `),
    toast: banner(`
      Changes saved. | Dismiss
      Message sent. | Undo; Dismiss
      Item moved to trash. | Undo
      Link copied to clipboard. | Close
      Your file is uploading (2 of 5)... | Cancel
      Connection lost. Trying to reconnect... | Retry
      You're back online. | OK
      3 new messages | View; Dismiss
      Draft saved at 10:42 | Close
      Export complete: report.csv | Open; Dismiss
      Settings updated. | OK
      Couldn't save your changes. | Try again; Dismiss
      Added to cart: Stainless Steel Water Bottle 750 ml | View cart; Close
      Invitation sent to 4 people. | Dismiss
      A new version is available. | Reload; Later
      Session expires in 5 minutes. | Stay signed in; Sign out
      Payment received. Thank you! | Close
      Your password was changed. | Dismiss
      Reminder: Team sync starts in 10 minutes. | Join; Snooze; Dismiss
      Coupon applied: 15% off. | Remove; OK
      Upload failed: file is larger than 25 MB. | Choose another file; Close
      Conversation archived. | Undo
      Download started. | Show in folder; Dismiss
      Copied 12 rows. | OK
      You're offline. Some features may not work. | Dismiss
    `),
    promo: banner(`
      Get 15% off your first order when you sign up for our newsletter. | Sign up; No thanks
      Summer sale: up to 40% off selected items. Ends Sunday! | Shop now; Close
      Free shipping on all orders over $50 this week only. | Got it; Dismiss
      Try Pro free for 14 days. No credit card required. | Start free trial; Maybe later
      Download our app and get $10 off your next purchase. | Get the app; Not now
      Members save an extra 10% on everything. | Join now; Continue as guest
      Don't miss out: 2 for 1 on all coffees before 11 am. | Show me; No thanks
      Spin the wheel for a chance to win a $50 gift card! | Spin now; No thanks
      Wait! Here's 10% off before you go. | Claim discount; I'll pay full price
      Upgrade to annual billing and get 2 months free. | Upgrade; Not now
      New collection just dropped. Be the first to shop it. | Explore; Close
      Refer a friend and you both get $20. | Invite friends; Dismiss
      Weekend flash sale: 30% off sitewide with code FLASH30. | Copy code; Close
      Turn on notifications to hear about price drops. | Turn on; No thanks
      Complete your profile to get personalized picks. | Complete profile; Skip
      Black Friday preview: early access for subscribers. | Get early access; Close
      Love reading? Get 3 months of unlimited articles for $1. | Subscribe; No thanks
      Book now, pay later: reserve your stay with no deposit. | Find a stay; Dismiss
      Your cart is waiting: complete your order and get free gift wrap. | Go to cart; Not now
      Rate our app? It takes 10 seconds. | Rate now; Remind me later; No thanks
      Join 50,000 readers who get our weekly newsletter. | Subscribe; Close
      Exclusive offer: free dessert with orders over $30 tonight. | Order now; No thanks
    `),
    chat: banner(`
      Hi there! Need help finding something? | Chat now; Close
      Hello! I'm Nova, your virtual assistant. How can I help today? | Start chat; Minimize
      Questions about your order? We're online now. | Ask a question; Dismiss
      Hey! Want a quick tour of the new features? | Show me; Not now
      Our team typically replies in under 5 minutes. | Message us; Hide
      Looking for a size recommendation? Ask our fit expert. | Ask now; No thanks
      Hi! Can I help you choose the right plan? | Yes, please; No thanks
      Need help with checkout? | Chat with us; Close
      We're here 24/7. Send us a message anytime. | Open chat; Minimize
      Hello from support! Anything I can help with? | Reply; Dismiss
      Got a question about shipping or returns? | Ask us; Close chat
      Welcome back, Sam! Pick up where you left off? | Continue; Close
      Hi! Our agents are busy, but our assistant can help right away. | Talk to assistant; Leave a message
      Book a free 15-minute call with a product specialist. | Book a call; Later
      Need a hand? Search our help center or chat with us. | Search help; Chat; Close
      Hi, I'm Leo from sales. Any questions about pricing? | Ask Leo; Dismiss
      Unread message from Support: "Your ticket has been updated." | Open; Close
      Hey there! Get 10% off by chatting with us today. | Let's chat; No thanks
      Having trouble? Let us know what went wrong. | Report an issue; Close
      Hi! Do you want to set up delivery reminders? | Set up; No
      Our assistant can track your package. Want to try? | Track package; Not now
    `),
    notice: banner(`
      Scheduled maintenance on Sunday from 02:00 to 04:00 UTC. | Learn more; Dismiss
      We've updated our Terms of Service. | Review; OK
      Your trial ends in 3 days. | Upgrade; Dismiss
      Your browser is out of date. Some features may not work. | Update browser; Ignore
      Please verify your email address to unlock all features. | Resend email; Close
      Holiday hours: our support team is offline 24-26 December. | Got it
      Storage almost full: 92% of 15 GB used. | Manage storage; Dismiss
      You're viewing an archived version of this page. | Go to current version; Close
      Shipping delays expected due to severe weather. | Details; Dismiss
      New login from Lisbon, Portugal. Was this you? | Yes, it was me; No, secure my account
      This page is available in your language. | Switch to English; Stay
      Important: action required on your account. | Review now; Later
      We're experiencing higher than usual wait times. | Visit help center; Dismiss
      Two-factor authentication is not enabled. | Enable now; Remind me later
      Our privacy policy has changed. Please review the updates. | Read policy; Accept
      You have 2 unpaid invoices. | Pay now; View invoices
      Service restored. Thanks for your patience. | Close
      Beta: this feature is still in development. | Give feedback; Hide
      Read-only mode: you don't have permission to edit. | Request access; Close
      Price change effective 1 March. | See details; OK
    `),
  };

  // Chrome draws, so sites share one way to pick the end label, decoys and banner texts. Each takes the site's rng
  // and draws exactly what the inline form it replaces drew (rng.pick / rng.sample over the bank), so switching to
  // it keeps a site's episodes.
  const endLabel = (rng) => rng.pick(END_LABELS);
  const decoyLabels = (rng, n) => rng.sample(DECOY_LABELS, n);
  // An inert decoy that reads like an end control: another END_LABELS word (never `label`, case-insensitive),
  // or null when there is none.
  function collideLabel(rng, label) {
    const same = (x) => x.trim().toLowerCase() === String(label).trim().toLowerCase();
    const options = END_LABELS.filter((x) => !same(x));
    return options.length ? rng.pick(options) : null;
  }
  const bannerText = (rng, kind) => {
    if (!BANNER_TEXTS[kind]) throw new Error(`content.bannerText: no banner kind '${kind}'`);
    return rng.pick(BANNER_TEXTS[kind]);
  };

  Object.assign(C, {
    endLabel,
    decoyLabels,
    collideLabel,
    bannerText,
    BUTTON_LABELS,
    MENU_ITEMS,
    NAV_ITEMS,
    SETTINGS,
    FIELD_LABELS,
    ICON_NAMES,
    END_LABELS,
    DECOY_LABELS,
    BANNER_TEXTS,
  });
})();
