/**
 * LiTerrific Form Handler — handles 3 form types:
 *   signup    → resource confirmation email (signup.html)
 *   newsletter → welcome to the community email (all pages)
 *   quote     → someone will be in touch email (contact.html)
 *
 * Deployment URL:
 * https://script.google.com/macros/s/AKfycbylNy2SUrdRbA7XfRnF81QyMkqBnXCjgdKCVFqgyV2HGfJiyEAL-6WSb9h7qbCLfno0zw/exec
 *
 * After editing this script, re-deploy:
 * Deploy → Manage deployments → edit → new version → Deploy
 */

// ── Configuration ─────────────────────────────────────────────────────────────

var SHEET_ID  = '1hYmPwbsipdIkz34VSmrLskA7HHxBuxx_x5spRfhOaG4';
var FROM_NAME = 'Chase Young & the LiTerrific Team';

var RESOURCE_LINKS = {
  'readers-theater':     'PASTE_READERS_THEATER_DRIVE_LINK_HERE',
  'read-like-me':        'PASTE_READ_LIKE_ME_DRIVE_LINK_HERE',
  'read-to-impress':     'PASTE_READ_TO_IMPRESS_DRIVE_LINK_HERE',
  'synergistic-lessons': 'PASTE_SYNERGISTIC_LESSONS_DRIVE_LINK_HERE',
  'poetry':              'PASTE_POETRY_RESOURCES_DRIVE_LINK_HERE',
  'pd':                  'https://literacylive.org/contact.html'
};

var RESOURCE_LABELS = {
  'readers-theater':     'Readers Theater Resources',
  'read-like-me':        'Read Like Me Resources',
  'read-to-impress':     'Read to Impress Resources',
  'synergistic-lessons': 'Creating Synergistic Lessons',
  'poetry':              'Poetry Resources',
  'pd':                  'Professional Development Information'
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function corsResponse(content) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName('leads');
}

function emailHeader() {
  return '<div style="background:#161616;padding:24px 28px;">' +
    '<span style="font-size:1.1rem;font-weight:700;color:#ffffff;">LiTerrific</span>' +
    '<span style="color:#01826d;font-weight:700;"> Professional Development</span>' +
    '</div>';
}

function emailFooter() {
  return '<div style="background:#f5f0e8;padding:14px 28px;font-size:.78rem;color:#5d6c7b;">' +
    'LiTerrific Professional Development · ' +
    '<a href="https://literacylive.org" style="color:#01826d;">literacylive.org</a>' +
    '</div>';
}

function wrapEmail(body) {
  return '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">' +
    emailHeader() +
    '<div style="padding:32px 28px;">' + body + '</div>' +
    emailFooter() +
    '</div>';
}

function greeting(name) {
  return name ? 'Hi ' + name.split(' ')[0] + ',' : 'Hi there,';
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Form Type', 'Name', 'Email', 'Details', 'Source']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
}

// ── Main router ───────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var params    = e.parameter  || {};
    var multiParams = e.parameters || {};
    var formType  = params.form_type || 'signup';

    if (formType === 'newsletter') {
      handleNewsletter(params);
    } else if (formType === 'quote') {
      handleQuote(params, multiParams);
    } else {
      handleSignup(params);
    }

    return corsResponse(JSON.stringify({ result: 'success' }));
  } catch (err) {
    return corsResponse(JSON.stringify({ result: 'error', message: err.message }));
  }
}

function doGet(e) {
  return corsResponse(JSON.stringify({ result: 'ok' }));
}

function doOptions(e) {
  return corsResponse(JSON.stringify({ result: 'ok' }));
}

// ── Newsletter handler ────────────────────────────────────────────────────────

function handleNewsletter(params) {
  var email  = params.email  || '';
  var source = params.source || 'newsletter';

  var sheet = getSheet();
  ensureHeader(sheet);
  sheet.appendRow([new Date(), 'newsletter', '', email, 'Updates: Yes', source]);

  sendWelcomeEmail(email);
}

function sendWelcomeEmail(email) {
  if (!email) return;

  var body =
    '<p style="font-size:1rem;margin-bottom:16px;">Hi there,</p>' +
    '<p style="font-size:1rem;margin-bottom:20px;">Welcome to the LiTerrific community! ' +
    'You\'re now connected with Chase Young and the team — expect practical resources, ' +
    'the latest in literacy research, and strategies that actually work in real classrooms.</p>' +
    '<p style="margin:28px 0;">' +
    '<a href="https://literacylive.org/resources.html" ' +
    'style="background:#ffc300;color:#161616;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:.95rem;">' +
    'Browse Our Resources →' +
    '</a>' +
    '</p>' +
    '<p style="font-size:.92rem;color:#5d6c7b;margin-top:28px;line-height:1.6;">' +
    'We\'re glad you\'re here. Feel free to ' +
    '<a href="https://literacylive.org/contact.html" style="color:#01826d;">reach out</a> any time.' +
    '</p>' +
    '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  GmailApp.sendEmail(email, 'Welcome to the LiTerrific Community', '', {
    htmlBody: wrapEmail(body),
    name:     FROM_NAME
  });
}

// ── Quote / contact handler ───────────────────────────────────────────────────

function handleQuote(params, multiParams) {
  var name     = params.name     || '';
  var email    = params.email    || '';
  var role     = params.role     || '';
  var district = params.district || '';
  var state    = params.state    || '';
  var teachers = params.teachers || '';
  var message  = params.message  || '';
  var grades   = (multiParams.grades   || []).join(', ');
  var services = (multiParams.services || []).join(', ');

  var details = [
    role     ? 'Role: ' + role         : '',
    district ? 'District: ' + district : '',
    state    ? 'State: ' + state       : '',
    grades   ? 'Grades: ' + grades     : '',
    services ? 'Services: ' + services : '',
    teachers ? 'Teachers: ' + teachers : '',
    message  ? 'Notes: ' + message     : ''
  ].filter(Boolean).join(' | ');

  var sheet = getSheet();
  ensureHeader(sheet);
  sheet.appendRow([new Date(), 'quote', name, email, details, 'contact-form']);

  sendQuoteEmail(name, email, district);
}

function sendQuoteEmail(name, email, district) {
  if (!email) return;

  var districtLine = district ? ' from <strong>' + district + '</strong>' : '';

  var body =
    '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
    '<p style="font-size:1rem;margin-bottom:20px;">Thank you for reaching out' + districtLine + '! ' +
    'We\'ve received your inquiry and someone from the LiTerrific team will be in touch within one business day.</p>' +
    '<p style="font-size:1rem;margin-bottom:20px;">In the meantime, feel free to browse our resources or learn more about what a LiTerrific session looks like.</p>' +
    '<p style="margin:28px 0;">' +
    '<a href="https://literacylive.org/resources.html" ' +
    'style="background:#ffc300;color:#161616;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:.95rem;">' +
    'Browse Our Resources →' +
    '</a>' +
    '</p>' +
    '<p style="font-size:.92rem;color:#5d6c7b;margin-top:28px;line-height:1.6;">' +
    'No pressure, no sales pitch — just a conversation about what your students need.' +
    '</p>' +
    '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  GmailApp.sendEmail(email, 'Your Professional Development Request — LiTerrific', '', {
    htmlBody: wrapEmail(body),
    name:     FROM_NAME
  });
}

// ── Signup / resource handler (signup.html) ───────────────────────────────────

function handleSignup(params) {
  var name         = params.name            || '';
  var email        = params.email           || '';
  var referral     = params.referral_source || '';
  var updatesOptin = params.updates_optin   || 'no';
  var source       = params.source          || 'signup-page';

  var details = (RESOURCE_LABELS[referral] || referral) +
    (updatesOptin === 'yes' ? ' | Updates: Yes' : '');

  var sheet = getSheet();
  ensureHeader(sheet);
  sheet.appendRow([new Date(), 'signup', name, email, details, source]);

  sendSignupEmail(name, email, referral);
}

function sendSignupEmail(name, email, referral) {
  if (!email) return;

  var resourceLink  = RESOURCE_LINKS[referral]  || 'https://literacylive.org/resources.html';
  var resourceLabel = RESOURCE_LABELS[referral] || 'LiTerrific Resources';
  var linkReady     = resourceLink.indexOf('PASTE_') === -1;

  var body =
    '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
    '<p style="font-size:1rem;margin-bottom:16px;">Welcome to our community of literacy instruction resources! ' +
    'You\'re now connected with Chase Young and the LiTerrific team — we\'re glad you\'re here.</p>' +
    '<p style="font-size:1rem;margin-bottom:16px;">You mentioned you\'re looking for <strong>' + resourceLabel + '</strong>. ' +
    (linkReady ? 'Here\'s your link:' : 'Those resources are coming soon — in the meantime, browse everything we have available:') +
    '</p>' +
    '<p style="margin:28px 0;">' +
    '<a href="' + (linkReady ? resourceLink : 'https://literacylive.org/resources.html') + '" ' +
    'style="background:#ffc300;color:#161616;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:.95rem;">' +
    (linkReady ? 'Get ' + resourceLabel + ' →' : 'Browse All Resources →') +
    '</a>' +
    '</p>' +
    '<p style="font-size:.92rem;color:#5d6c7b;margin-top:28px;line-height:1.6;">' +
    'Expect practical strategies, the latest in literacy research, and resources that actually work in real classrooms.<br>' +
    'Feel free to <a href="https://literacylive.org/contact.html" style="color:#01826d;">reach out</a> any time.' +
    '</p>' +
    '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  GmailApp.sendEmail(email, 'Welcome to the LiTerrific Community', '', {
    htmlBody: wrapEmail(body),
    name:     FROM_NAME
  });
}
