/**
 * Haltev Trial Class Apps Script endpoint.
 * Required Script Properties:
 *   SPREADSHEET_ID, CALENDAR_ID, API_TOKEN
 * Enable the Advanced Google service "Google Calendar API" before deploying
 * if online registrations should receive a Google Meet link.
 */

const CONFIG = {
  spreadsheetId: '1kLH4X7JTUX0NmRgQ0IFNlrKbs2geJ_785n41KcKFi4U',
  calendarId: 'c_ab93f6334ac6bdc6ad918eea35c3f1af7e1fb7aefb695fd7a03fd7b0ebbdaac5@group.calendar.google.com',
  timezone: 'Asia/Jakarta',
  registrationSheet: 'Pendaftar',
  slotSheet: 'Slot',
  tutorSheet: 'Tutor',
  salesSheet: 'Sales',
  location: 'Grand Galaxy City, Bekasi Selatan',
};

const COURSE_MAP = {
  'digital-marketing': 'DM',
  'data-science': 'DS',
  'web-development': 'Web',
  'mobile-development': 'Mobile Apps',
  DM: 'DM',
  DS: 'DS',
  Web: 'Web',
  'Mobile Apps': 'Mobile Apps',
};

function doGet(e) {
  try {
    requireToken_(e && e.parameter && e.parameter.token);
    const action = (e && e.parameter && e.parameter.action) || 'slots';
    if (action !== 'slots') return json_({ ok: false, error: 'Aksi tidak dikenal.' });
    return json_({ ok: true, slots: listAvailableSlots_() });
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Terjadi kesalahan.' });
  }
}

function doPost(e) {
  let eventId = '';
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    requireToken_(payload.token);
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const result = createRegistration_(payload);
      eventId = result.eventId;
      return json_({ ok: true, registrationId: result.registrationId, eventId: result.eventId, meetLink: result.meetLink || '' });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Pendaftaran belum dapat diproses.' });
  }
}

function testKoneksi() {
  const spreadsheet = spreadsheet_();
  const calendar = CalendarApp.getCalendarById(config_().calendarId);
  if (!calendar) throw new Error('Kalender tidak ditemukan atau belum dibagikan ke akun Apps Script.');
  Logger.log(JSON.stringify({
    spreadsheet: spreadsheet.getName(),
    tabs: spreadsheet.getSheets().map((sheet) => sheet.getName()),
    calendar: calendar.getName(),
  }));
}

function listAvailableSlots_() {
  const sheet = spreadsheet_().getSheetByName(CONFIG.slotSheet);
  const records = readRecords_(sheet);
  return records.map((row) => {
    const date = dateValue_(row['Tanggal']);
    const course = String(row['Kelas'] || '').trim();
    const capacity = Number(row['Kuota'] || 0);
    const occupied = Number(row['Terisi'] || 0);
    const status = String(row['Status Slot'] || '').trim().toLowerCase();
    return {
      id: String(row['ID Slot'] || '').trim(),
      course: courseId_(course),
      courseName: course,
      date,
      time: timeValue_(row['Jam Mulai']),
      endTime: timeValue_(row['Jam Selesai']),
      tutor: String(row['Nama Tutor'] || '').trim(),
      seats: Math.max(0, capacity - occupied),
      mode: String(row['Mode Tersedia'] || 'Online, Offline'),
      status: String(row['Status Slot'] || ''),
    };
  }).filter((slot) => slot.id && slot.date && slot.seats > 0 && slot.status.toLowerCase() === 'aktif');
}

function createRegistration_(data) {
  const required = ['name', 'phone', 'email', 'status', 'itBackground', 'goal', 'course', 'slot', 'attendanceMode'];
  required.forEach((key) => {
    if (!String(data[key] || '').trim()) throw new Error('Lengkapi semua data wajib terlebih dahulu.');
  });
  if (!['Online', 'Offline'].includes(String(data.attendanceMode))) throw new Error('Mode kehadiran tidak valid.');
  if (data.consent !== 'on' && data.consent !== true) throw new Error('Persetujuan privasi diperlukan.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) throw new Error('Format email belum sesuai.');

  const ss = spreadsheet_();
  const slotSheet = ss.getSheetByName(CONFIG.slotSheet);
  const slotRecords = readRecords_(slotSheet);
  const slot = slotRecords.find((row) => String(row['ID Slot']).trim() === String(data.slot).trim());
  if (!slot) throw new Error('Jadwal yang dipilih tidak ditemukan. Silakan muat ulang halaman.');
  if (String(slot['Status Slot']).toLowerCase() !== 'aktif') throw new Error('Jadwal ini sudah tidak tersedia.');
  if (Number(slot['Terisi'] || 0) >= Number(slot['Kuota'] || 0)) throw new Error('Kuota kelas ini sudah penuh.');
  if (courseId_(String(slot['Kelas'])) !== courseId_(String(data.course))) throw new Error('Kelas tidak cocok dengan jadwal yang dipilih.');

  const tutorEmail = String(slot['Email Tutor'] || '').trim();
  const event = createCalendarEvent_(data, slot, tutorEmail);
  const registrationId = Utilities.getUuid();
  const registrationSheet = ss.getSheetByName(CONFIG.registrationSheet);
  const sales = findSales_(data.salesCode || '');
  const now = new Date();
  const values = {
    'ID': registrationId,
    'Waktu Daftar': now,
    'Nama Lengkap': String(data.name).trim(),
    'No WhatsApp': String(data.phone).trim(),
    'Email': String(data.email).trim(),
    'Kelas': String(slot['Kelas']),
    'ID Slot': String(slot['ID Slot']),
    'Tanggal': dateValue_(slot['Tanggal']),
    'Jam Mulai': timeValue_(slot['Jam Mulai']),
    'Jam Selesai': timeValue_(slot['Jam Selesai']),
    'Mode Kehadiran': String(data.attendanceMode),
    'Nama Tutor': String(slot['Nama Tutor'] || ''),
    'Kode Sales': sales.code,
    'Nama Sales': sales.name,
    'Status Saat Ini': String(data.status),
    'Latar Belakang IT': String(data.itBackground),
    'Tujuan Belajar': String(data.goal),
    'Alasan Ragu': String(data.hesitation || ''),
    'Persetujuan Privasi': 'Ya',
    'Status Kehadiran': 'Terdaftar',
    'Catatan Tutor': '',
    'Status Konversi': 'Belum ditindaklanjuti',
    'ID Event Kalender': event.id,
    'Status Sinkronisasi Kalender': 'Berhasil',
  };

  try {
    appendByHeaders_(registrationSheet, values);
    updateSlotOccupied_(slotSheet, slot['ID Slot'], Number(slot['Terisi'] || 0) + 1);
  } catch (error) {
    try { Calendar.Events.remove(event.id, config_().calendarId); } catch (_) {}
    throw error;
  }
  return { registrationId, eventId: event.id, meetLink: event.hangoutLink || '' };
}

function createCalendarEvent_(data, slot, tutorEmail) {
  if (typeof Calendar === 'undefined' || !Calendar.Events) {
    throw new Error('Aktifkan Google Calendar API di Services Apps Script untuk membuat undangan kalender.');
  }
  const date = dateValue_(slot['Tanggal']);
  const start = timeValue_(slot['Jam Mulai']);
  const end = timeValue_(slot['Jam Selesai']);
  const mode = String(data.attendanceMode);
  const resource = {
    summary: 'Trial Class ' + String(slot['Kelas']) + ' — ' + String(data.name),
    description: [
      'Pendaftaran Trial Class Haltev',
      'Peserta: ' + String(data.name),
      'WhatsApp: ' + String(data.phone),
      'Mode: ' + mode,
      'Tutor: ' + String(slot['Nama Tutor'] || '-'),
      'Tujuan belajar: ' + String(data.goal),
    ].join('\n'),
    start: { dateTime: date + 'T' + start + ':00+07:00', timeZone: CONFIG.timezone },
    end: { dateTime: date + 'T' + end + ':00+07:00', timeZone: CONFIG.timezone },
    attendees: [{ email: String(data.email).trim() }],
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    guestsCanSeeOtherGuests: false,
  };
  if (tutorEmail && tutorEmail !== String(data.email).trim()) resource.attendees.push({ email: tutorEmail });
  if (mode === 'Offline') resource.location = CONFIG.location;
  if (mode === 'Online') {
    resource.conferenceData = {
      createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
    };
  }
  return Calendar.Events.insert(resource, config_().calendarId, {
    sendUpdates: 'all',
    conferenceDataVersion: 1,
  });
}

function updateSlotOccupied_(sheet, slotId, occupied) {
  const table = table_(sheet);
  const idColumn = table.headers.indexOf('ID Slot') + 1;
  const occupiedColumn = table.headers.indexOf('Terisi') + 1;
  if (!idColumn || !occupiedColumn) throw new Error('Header ID Slot atau Terisi tidak ditemukan di tab Slot.');
  for (let i = 0; i < table.rows.length; i++) {
    if (String(table.rows[i][idColumn - 1]).trim() === String(slotId).trim()) {
      sheet.getRange(i + 2, occupiedColumn).setValue(occupied);
      return;
    }
  }
  throw new Error('Slot tidak ditemukan saat memperbarui kuota.');
}

function findSales_(code) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return { code: '', name: '' };
  const sheet = spreadsheet_().getSheetByName(CONFIG.salesSheet);
  const person = readRecords_(sheet).find((row) => String(row['Kode Link'] || '').trim().toLowerCase() === normalized && String(row['Aktif']).toLowerCase() === 'true');
  return person ? { code: String(person['Kode Link']), name: String(person['Nama Sales']) } : { code: '', name: '' };
}

function appendByHeaders_(sheet, values) {
  if (!sheet) throw new Error('Tab Pendaftar tidak ditemukan.');
  const headers = table_(sheet).headers;
  const row = headers.map((header) => Object.prototype.hasOwnProperty.call(values, header) ? values[header] : '');
  sheet.appendRow(row);
}

function readRecords_(sheet) {
  if (!sheet) throw new Error('Tab spreadsheet tidak ditemukan.');
  const table = table_(sheet);
  return table.rows.map((row) => table.headers.reduce((record, header, index) => {
    record[header] = row[index];
    return record;
  }, {}));
}

function table_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error('Tab ' + sheet.getName() + ' belum memiliki header.');
  return { headers: values[0].map((value) => String(value).trim()), rows: values.slice(1) };
}

function dateValue_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, CONFIG.timezone, 'yyyy-MM-dd');
  const text = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return '';
  return Utilities.formatDate(parsed, CONFIG.timezone, 'yyyy-MM-dd');
}

function timeValue_(value) {
  if (value instanceof Date) return Utilities.formatDate(value, CONFIG.timezone, 'HH:mm');
  const text = String(value || '').trim();
  const match = text.match(/^(\d{1,2}):(\d{2})/);
  return match ? ('0' + match[1]).slice(-2) + ':' + match[2] : '';
}

function courseId_(course) {
  const normalized = String(course || '').trim().toLowerCase();
  const entry = Object.entries(COURSE_MAP).find(([key]) => key.toLowerCase() === normalized);
  return entry ? entry[1] : normalized;
}

function spreadsheet_() {
  return SpreadsheetApp.openById(config_().spreadsheetId);
}

function config_() {
  const props = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: props.getProperty('SPREADSHEET_ID') || CONFIG.spreadsheetId,
    calendarId: props.getProperty('CALENDAR_ID') || CONFIG.calendarId,
    token: props.getProperty('API_TOKEN') || '',
  };
}

function requireToken_(provided) {
  const expected = config_().token;
  if (!expected || !provided || String(provided) !== expected) throw new Error('Akses ditolak.');
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
