/**
 * Society Master service.
 *
 * This is the reference Master Module Pattern for future master services:
 * one configured sheet, one normalized payload, shared validation, shared
 * Database CRUD, and standardized Response objects.
 */
const SOCIETY_SHEET_NAME = SHEET_NAMES.SOCIETY_MASTER;
const SOCIETY_PRIMARY_KEY = getPrimaryKey('SOCIETY_MASTER');
const SOCIETY_ID_PREFIX = getPrefix('SOCIETY_MASTER');

const SOCIETY_FIELDS = Object.freeze([
  'Society ID', 'Society Name', 'Short Name', 'Registration Number',
  'Registration Date', 'Society Type', 'District', 'Taluka', 'Village',
  'Office Address', 'PIN Code', 'Mobile No.', 'Email', 'Website', 'PAN',
  'GSTIN', 'Professional Tax No.', 'UDYAM No.', 'Labour Licence No.',
  'Chairman', 'Secretary', 'Office Assistant', 'CA Name', 'Auditor Name',
  'Default Society Account', 'Active Status', 'Remarks'
]);

function societyActor() {
  try {
    return Session.getActiveUser().getEmail() || 'System';
  } catch (error) {
    return 'System';
  }
}

function societyText(value) {
  return isBlank(value) ? '' : String(value).trim();
}

function normalizeSociety(record) {
  const source = record || {};
  const normalized = {};
  SOCIETY_FIELDS.forEach(field => {
    normalized[field] = source[field];
  });

  ['Society Name', 'Short Name', 'Registration Number', 'Society Type',
    'District', 'Taluka', 'Village', 'Office Address', 'PIN Code',
    'Mobile No.', 'Email', 'Website', 'PAN', 'GSTIN', 'Professional Tax No.',
    'UDYAM No.', 'Labour Licence No.', 'Chairman', 'Secretary',
    'Office Assistant', 'CA Name', 'Auditor Name', 'Default Society Account',
    'Remarks'].forEach(field => {
    normalized[field] = societyText(source[field]);
  });

  normalized.PAN = normalized.PAN.toUpperCase();
  normalized.GSTIN = normalized.GSTIN.toUpperCase();
  normalized['Active Status'] = source['Active Status'] === undefined
    ? true : toBoolean(source['Active Status']);
  return normalized;
}

function validateSociety(record) {
  const errors = [];
  const required = ['Society Name', 'Registration Number', 'Village', 'Taluka', 'Chairman', 'Mobile No.'];
  required.forEach(field => {
    if (isBlank(record[field])) errors.push({ field, message: field + ' is required.' });
  });
  if (!isBlank(record['Mobile No.']) && !isValidMobile(record['Mobile No.'])) {
    errors.push({ field: 'Mobile No.', message: 'Mobile No. must be a valid 10-digit Indian mobile number.' });
  }
  if (!isBlank(record.Email) && !isValidEmail(record.Email)) {
    errors.push({ field: 'Email', message: 'Email must be valid.' });
  }
  if (!isBlank(record.PAN) && !isValidPAN(record.PAN)) {
    errors.push({ field: 'PAN', message: 'PAN must be valid.' });
  }
  if (!isBlank(record.GSTIN) && !isValidGSTIN(record.GSTIN)) {
    errors.push({ field: 'GSTIN', message: 'GSTIN must be valid.' });
  }
  return errors;
}

function duplicateRegistration(record, societyId) {
  const registration = record['Registration Number'].toLowerCase();
  return Database.getAll(SOCIETY_SHEET_NAME).some(existing =>
    String(existing[SOCIETY_PRIMARY_KEY]) !== String(societyId || '') &&
    societyText(existing['Registration Number']).toLowerCase() === registration
  );
}

function getSocieties(keyword) {
  return safeExecute(() => {
    const term = societyText(keyword).toLowerCase();
    return Database.getAll(SOCIETY_SHEET_NAME)
      .filter(record => !term || SOCIETY_FIELDS.some(field =>
        societyText(record[field]).toLowerCase().includes(term)))
      .sort((a, b) => societyText(a['Society Name']).localeCompare(societyText(b['Society Name'])));
  }, 'getSocieties');
}

function getSociety(societyId) {
  return safeExecute(() => {
    if (isBlank(societyId)) return Response.error('Society ID is required');
    const record = Database.findById(SOCIETY_SHEET_NAME, societyId);
    return record || Response.notFound('Society record not found');
  }, 'getSociety');
}

function saveSociety(record) {
  return safeExecute(() => {
    const normalized = normalizeSociety(record);
    const errors = validateSociety(normalized);
    if (errors.length) return Response.validationError(errors);
    if (duplicateRegistration(normalized)) {
      return Response.validationError([{ field: 'Registration Number', message: 'Registration Number must be unique.' }]);
    }

    const now = generateTimestamp();
    const actor = societyActor();
    const newRecord = Object.assign({}, normalized, {
      [SOCIETY_PRIMARY_KEY]: Database.nextId(SOCIETY_SHEET_NAME, SOCIETY_ID_PREFIX),
      'is_deleted': false,
      'Created On': now,
      'Created By': actor,
      'Updated On': now,
      'Updated By': actor,
      Status: normalized['Active Status'] ? 'Active' : 'Inactive'
    });
    Database.insertRecord(SOCIETY_SHEET_NAME, newRecord);
    return newRecord;
  }, 'saveSociety');
}

function updateSociety(societyId, record) {
  return safeExecute(() => {
    if (isBlank(societyId)) return Response.error('Society ID is required for update');
    if (!Database.findById(SOCIETY_SHEET_NAME, societyId)) return Response.notFound('Society record not found');
    const normalized = normalizeSociety(record);
    const errors = validateSociety(normalized);
    if (errors.length) return Response.validationError(errors);
    if (duplicateRegistration(normalized, societyId)) {
      return Response.validationError([{ field: 'Registration Number', message: 'Registration Number must be unique.' }]);
    }

    normalized[SOCIETY_PRIMARY_KEY] = societyId;
    normalized['Updated On'] = generateTimestamp();
    normalized['Updated By'] = societyActor();
    normalized.Status = normalized['Active Status'] ? 'Active' : 'Inactive';
    return Database.updateRecord(SOCIETY_SHEET_NAME, societyId, normalized)
      ? normalized : Response.error('Failed to update society');
  }, 'updateSociety');
}

function softDeleteSociety(societyId) {
  return safeExecute(() => {
    if (isBlank(societyId)) return Response.error('Society ID is required');
    if (!Database.findById(SOCIETY_SHEET_NAME, societyId)) return Response.notFound('Society record not found');
    return Database.updateRecord(SOCIETY_SHEET_NAME, societyId, {
      is_deleted: true,
      'Active Status': false,
      Status: 'Deleted',
      'Updated On': generateTimestamp(),
      'Updated By': societyActor()
    });
  }, 'softDeleteSociety');
}
