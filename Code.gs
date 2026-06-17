/**
 * LiTerrific Form Handler — handles 3 form types:
 *   signup    → resource confirmation email (signup.html)
 *   newsletter → welcome to the community email (all pages)
 *   quote     → someone will be in touch email (contact.html)
 *
 * Deployment URL:
 * https://script.google.com/macros/s/AKfycbwjws_klRQoPdVvHkmfFXbus3VFAo5oDwqf5pquPz9KKJd0gtrqUnUyKDIF2Im_hzwb/exec
 *
 * After editing this script, re-deploy:
 * Deploy → Manage deployments → edit → new version → Deploy
 */

// ── Configuration ─────────────────────────────────────────────────────────────

var LEADS_SHEET_ID  = '1hYmPwbsipdIkz34VSmrLskA7HHxBuxx_x5spRfhOaG4';
var FROM_NAME = 'Chase Young & the LiTerrific Team';

var RESOURCE_LINKS = {
  'read-like-me':        'PASTE_READ_LIKE_ME_DRIVE_LINK_HERE',
  'read-to-impress':     'PASTE_READ_TO_IMPRESS_DRIVE_LINK_HERE',
  'synergistic-lessons': 'PASTE_SYNERGISTIC_LESSONS_DRIVE_LINK_HERE',
  'fluency':             'PASTE_FLUENCY_DRIVE_LINK_HERE',
  'keynote':             'https://drive.google.com/file/d/1yfV25uAFZmUcjPfebQdZwo_Lrn66WorW/view?usp=sharing',
  'building-fluency':    'https://drive.google.com/file/d/11olBhedaFeR73TlSQfhac6Zl9Pj9X_3H/view?usp=sharing',
  'pd':                  'https://literacylive.org/contact.html'
};

var RESOURCE_LABELS = {
  'read-like-me':        'Read Like Me Resources',
  'read-to-impress':     'Read Two Impress Resources',
  'synergistic-lessons': 'Creating Synergistic Lessons',
  'fluency':             'Performance Based Fluency',
  'keynote':             'Keynote Presentation',
  'building-fluency':    'Building Reading Fluency',
  'pd':                  'Professional Development Information'
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function corsResponse(content) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  return SpreadsheetApp.openById(LEADS_SHEET_ID).getSheetByName('leads');
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
    sheet.appendRow(['Timestamp', 'Form Type', 'Name', 'Email', 'Details', 'Source', 'Stay Updated', 'District', 'State']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
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
  sheet.appendRow([new Date(), 'newsletter', '', email, '', source, 'Yes', '', '']);

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
    grades   ? 'Grades: ' + grades     : '',
    services ? 'Services: ' + services : '',
    teachers ? 'Teachers: ' + teachers : '',
    message  ? 'Notes: ' + message     : ''
  ].filter(Boolean).join(' | ');

  var sheet = getSheet();
  ensureHeader(sheet);
  sheet.appendRow([new Date(), 'quote', name, email, details, 'contact-form', '', district, state]);

  sendQuoteEmail(name, email, district);
}

function sendQuoteEmail(name, email, district) {
  if (!email) return;

  var districtLine = district ? ' at <strong>' + district + '</strong>' : '';

  var body =
    '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
    '<p style="font-size:1rem;margin-bottom:16px;">We are so excited to connect with you' + districtLine + '! ' +
    'Someone from the LiTerrific team will be in touch with you within 24 hours.</p>' +
    '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  GmailApp.sendEmail(email, 'Your Professional Development Request', '', {
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

  var details = RESOURCE_LABELS[referral] || referral;
  var stayUpdated = updatesOptin === 'yes' ? 'Yes' : 'No';

  var sheet = getSheet();
  ensureHeader(sheet);
  sheet.appendRow([new Date(), 'signup', name, email, details, source, stayUpdated, '', '']);

  sendSignupEmail(name, email, referral);
}

function sendSignupEmail(name, email, referral) {
  if (!email) return;

  var subject = 'Welcome to the LiTerrific Community';
  var body;

  if (referral === 'read-like-me') {
    subject = 'Read Like Us — Resources & Links';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">Thanks so much for reaching out. To learn more about Read Like Us you might want to listen to me and Jake were interviewed on Melissa and Lori Love Literacy\'s podcast. Feel free to share it with others; you can find it here:</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Podcast Episode:</strong><br>' +
      '<a href="https://literacypodcast.com/?podcast=Buzzsprout-18300927" style="color:#01826d;">https://literacypodcast.com/?podcast=Buzzsprout-18300927</a></p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">In the episode, we talked about the Read Like Us approach to building fluency through purposeful repeated reading with appropriately challenging texts.</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Article:</strong><br>' +
      '<a href="https://ila.onlinelibrary.wiley.com/doi/epdf/10.1002/trtr.70024" style="color:#01826d;">https://ila.onlinelibrary.wiley.com/doi/epdf/10.1002/trtr.70024</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">Many have reached out asking for the intervention texts I mentioned—so here they are:</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Read Like Us Intervention Texts (Free PDF):</strong><br>' +
      '<a href="https://www.thebestclass.org/uploads/5/6/2/4/56249715/read_like_us_texts.pdf" style="color:#01826d;">https://www.thebestclass.org/uploads/5/6/2/4/56249715/read_like_us_texts.pdf</a></p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">These texts are designed to support repeated reading routines that build fluency, confidence, and comprehension through authentic reading experiences. Feel free to use them, adapt them for your students, and share them with colleagues.</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">If you have questions about implementation, differentiation, or ways to make this work in your classroom or school, don\'t hesitate to reach out—I\'m always happy to talk shop and help however I can. And if your team is looking for deeper support or professional learning around fluency, active engagement, or practical literacy instruction, I\'d love to work with you.</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;">Thanks for everything you do for readers every day.</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  } else if (referral === 'read-to-impress') {
    subject = 'Read Two Impress — Overview & Resources';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">I\'m glad you asked about Read Two Impress (R2I)—it\'s a highly effective, targeted fluency intervention when used as intended.</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">R2I combines two well-established approaches: repeated reading and the Neurological Impress Method (NIM). In practice, a more proficient reader reads simultaneously with the student—slightly ahead and with strong expression—then the student immediately rereads the same text independently. This creates a built-in gradual release on a single text, moving from supported to independent reading in real time.</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Article:</strong><br>' +
      '<a href="https://literacy.virginia.edu/sites/g/files/jsddwu1006/files/2023-03/readtwoimpress.pdf" style="color:#01826d;">https://literacy.virginia.edu/sites/g/files/jsddwu1006/files/2023-03/readtwoimpress.pdf</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Video:</strong><br>' +
      '<a href="https://youtu.be/X2aGBWeB4rs" style="color:#01826d;">https://youtu.be/X2aGBWeB4rs</a></p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">R2I is grounded in automaticity theory (fluency frees up attention for comprehension) and aligns with Vygotsky\'s Zone of Proximal Development, as students read more challenging text (shoot for grade level text or higher) with support. The power comes from the synergy of modeling + immediate practice—students hear fluent reading and then approximate it right away.</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">Research shows strong outcomes. In one study, students who received about 20 minutes of daily R2I for four weeks demonstrated:</p>' +
      '<ul style="font-size:1rem;margin-bottom:16px;padding-left:1.5rem;">' +
      '<li>Large gains in oral reading fluency and expression (prosody)</li>' +
      '<li>Moderate gains in reading comprehension</li>' +
      '</ul>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>A few key implementation points:</strong></p>' +
      '<ul style="font-size:1rem;margin-bottom:16px;padding-left:1.5rem;">' +
      '<li>Use a more proficient reader (not just peer pairing)</li>' +
      '<li>Read together, with the model slightly ahead</li>' +
      '<li>Work in short chunks (paragraphs/pages), then reread</li>' +
      '<li>Use texts above the student\'s independent level</li>' +
      '<li>Aim for ~20 minutes daily of focused practice</li>' +
      '</ul>' +
      '<p style="font-size:1rem;margin-bottom:16px;">R2I is not just repeated reading—it\'s a purposeful, scaffolded fluency intervention designed for students who struggle with automaticity and expression. When done well, it accelerates fluency and helps bridge to comprehension.</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;">Let me know if you want help adapting this for small groups or integrating it into your intervention block.</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase</p>';

  } else if (referral === 'synergistic-lessons') {
    subject = 'Creating Synergistic Lessons — Resources';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">Thanks for your interest in developing synergistic lessons—this is one of the most impactful shifts teachers can make in literacy instruction.</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">At a high level, synergistic lessons are about intentionally combining multiple, research-based practices so that the impact is greater than any single strategy used in isolation. Instead of teaching skills in silos, we design instruction where decoding, fluency, vocabulary, and comprehension work together in the same learning experience.</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">I break this down in more detail (with classroom examples) in this blog post:</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Blog:</strong><br>' +
      '<a href="https://robbreviewblog.com/" style="color:#01826d;">https://robbreviewblog.com/</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">If you\'d rather see it in action and hear the thinking behind it, these two webinars walk through the approach step-by-step:</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Webinar (Literacy Matters – Episode 8):</strong><br>' +
      '<a href="https://www.lwtears.com/literacymatters/season-3/episode-8" style="color:#01826d;">https://www.lwtears.com/literacymatters/season-3/episode-8</a></p>' +
      '<p style="font-size:1rem;margin-bottom:16px;"><strong>Webinar (edWeb – includes continuation education credit):</strong><br>' +
      '<a href="https://home.edweb.net/webinar/lwt20240410/" style="color:#01826d;">https://home.edweb.net/webinar/lwt20240410/</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">A quick example of what this looks like in practice:</p>' +
      '<ul style="font-size:1rem;margin-bottom:16px;padding-left:1.5rem;">' +
      '<li>Students engage with a complex text (comprehension + vocabulary)</li>' +
      '<li>Instruction includes modeled and supported reading (fluency)</li>' +
      '<li>Students revisit the text through structured rereading or discussion</li>' +
      '<li>Writing or response tasks reinforce language and meaning-making</li>' +
      '</ul>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>The key idea is simple:</strong><br>We don\'t need more time—we need better alignment of what we\'re already doing.</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;">When lessons are synergistic, students get more meaningful practice, stronger transfer, and ultimately better outcomes. Let me know how I can help!</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase</p>';

  } else if (referral === 'fluency') {
    subject = 'Performance Based Fluency — Resources';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">Thanks for connecting! Fluency grows when reading has purpose. Performance gives students a reason to reread.</p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Podcast on Implementing Reader\'s Theater:</strong><br>' +
      '<a href="https://reachallreaders.com/implement-readers-theater/" style="color:#01826d;">https://reachallreaders.com/implement-readers-theater/</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Blog Post on Implementing Reader\'s Theater:</strong><br>' +
      '<a href="https://therobbreviewblog.com/uncategorized/readers-theater/" style="color:#01826d;">https://therobbreviewblog.com/uncategorized/readers-theater/</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;"><strong>Giggle Poetry (2017 Archive)</strong> — still one of the best collections of performance-friendly poems out there:<br>' +
      '<a href="https://web.archive.org/web/20170605121007/http://gigglepoetry.com/poemcategories.aspx" style="color:#01826d;">https://web.archive.org/web/20170605121007/http://gigglepoetry.com/poemcategories.aspx</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">You can also grab free Reader\'s Theater scripts, research, and more at:<br>' +
      '<a href="https://www.thebestclass.org" style="color:#01826d;">https://www.thebestclass.org</a></p>' +
      '<p style="font-size:1rem;margin-bottom:8px;">More literacy ideas and classroom tools:<br>' +
      '<a href="https://justtwoteachers.com" style="color:#01826d;">https://justtwoteachers.com</a><br>' +
      '<a href="https://creativeenglishteacher.com" style="color:#01826d;">https://creativeenglishteacher.com</a></p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">Feel free to pass these along to your colleagues. Good literacy instruction spreads teacher to teacher.</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;">And if your school or district wants help building a clear, practical fluency plan — from intervention to whole-class routines — I\'d love to keep the conversation going.</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;">Thanks again for the work you\'re doing for readers across Nevada. Keep going. It matters.</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase</p>';

  } else if (referral === 'keynote') {
    subject = 'Slides from My Session — Dr. Chase Young';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">Hi and thanks for coming to my session!</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;"><a href="' + (RESOURCE_LINKS['keynote']) + '" style="color:#01826d;font-weight:600;">You can find my slides here!</a></p>' +
      '<p style="font-size:.92rem;margin-top:24px;">Dr. Chase Young</p>';

  } else if (referral === 'building-fluency') {
    subject = 'Session Materials — Dr. Chase Young';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">Hi and thanks for coming!</p>' +
      '<p style="font-size:1rem;margin-bottom:24px;"><a href="' + (RESOURCE_LINKS['building-fluency']) + '" style="color:#01826d;font-weight:600;">Click here to get the materials from my session.</a></p>' +
      '<p style="font-size:.92rem;margin-top:24px;">Dr. Chase Young</p>';

  } else if (referral === 'pd') {
    subject = 'Your Professional Development Request';
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">We are so excited to connect with you! ' +
      'Someone from the LiTerrific team will be in touch with you within 24 hours.</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';

  } else {
    body =
      '<p style="font-size:1rem;margin-bottom:16px;">' + greeting(name) + '</p>' +
      '<p style="font-size:1rem;margin-bottom:16px;">Thanks for connecting with us! We\'re glad you\'re here. ' +
      'Feel free to reach out any time.</p>' +
      '<p style="font-size:.92rem;margin-top:24px;">— Chase Young &amp; the LiTerrific Team</p>';
  }

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: wrapEmail(body),
    name:     FROM_NAME
  });
}
