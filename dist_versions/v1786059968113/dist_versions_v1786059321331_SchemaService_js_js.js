/**
 * Reusable schema provisioning service.
 *
 * Module services call ensureSchema() before accessing their sheet. Existing
 * sheets are never replaced or rewritten; only missing sheets are provisioned.
 */
const SCHEMA_DEFINITIONS = Object.freeze({
  SOCIETY_MASTER: Object.freeze([
    'Society ID', 'Society Name', 'Short Name', 'Registration Number',
    'Registration Date', 'Society Type', 'District', 'Taluka', 'Village',
    'Office Address', 'PIN Code', 'Mobile No.', 'Email', 'Website', 'PAN',
    'GSTIN', 'Professional Tax No.', 'UDYAM No.', 'Labour Licence No.',
    'Chairman', 'Secretary', 'Office Assistant', 'CA Name', 'Auditor Name',
    'Default Society Account', 'Active Status', 'Remarks',
    ...SYSTEM_FIELDS
  ])
});

function ensureSchema(moduleKey) {
  return safeExecute(() => {
    const key = String(moduleKey || '').trim().toUpperCase();
    const headers = SCHEMA_DEFINITIONS[key];
    const sheetName = getSheetName(key);

    if (!headers || !sheetName) {
      return Response.error('Schema is not registered for module: ' + moduleKey);
    }

    const spreadsheet = Database.getDatabase();
    const existingSheet = spreadsheet.getSheetByName(sheetName);
    if (existingSheet) {
      return {
        moduleKey: key,
        sheetName,
        created: false,
        headers: existingSheet.getLastColumn() > 0
          ? existingSheet.getRange(1, 1, 1, existingSheet.getLastColumn()).getValues()[0]
          : []
      };
    }

    const sheet = spreadsheet.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, headers.length);

    return {
      moduleKey: key,
      sheetName,
      created: true,
      headers
    };
  }, 'ensureSchema');
}

function ensureSocietySchema() {
  return ensureSchema('SOCIETY_MASTER');
}
