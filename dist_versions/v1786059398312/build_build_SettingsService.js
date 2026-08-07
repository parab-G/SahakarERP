/**
 * SettingsService.gs
 * Backend service layer managing configuration settings and centralized dropdown data.
 */

const SETTINGS_SHEET_NAME = SHEET_NAMES.SETTINGS;

/**
 * Retrieves a list of all unique categories present in the Settings table.
 * @return {Object} Standardized Response containing an array of unique category strings.
 */
function getCategories() {
  return safeExecute(() => {
    const records = Database.getAll(SETTINGS_SHEET_NAME);
    const categories = [...new Set(records.map(r => r.Category).filter(Boolean))].sort();
    return categories;
  }, 'getCategories');
}

/**
 * Retrieves all active and inactive setting records for a specific category.
 * @param {string} category - Category identifier.
 * @return {Object} Standardized Response containing filtered records sorted by Sequence.
 */
function getCategory(category) {
  return safeExecute(() => {
    if (isBlank(category)) {
      throw new Error('Category parameter is required');
    }
    const records = Database.getAll(SETTINGS_SHEET_NAME);
    const filtered = records
      .filter(r => String(r.Category).trim().toLowerCase() === String(category).trim().toLowerCase())
      .sort((a, b) => (Number(a.Sequence) || 0) - (Number(b.Sequence) || 0));
    return filtered;
  }, 'getCategory');
}

/**
 * Retrieves active dropdown key-value options for a given category.
 * Used across Sahakar ERP modules to eliminate hardcoded dropdown values.
 * @param {string} category - Category identifier.
 * @return {Object} Standardized Response with active, sequence-sorted dropdown options.
 */
function getDropdown(category) {
  return safeExecute(() => {
    if (isBlank(category)) {
      throw new Error('Category parameter is required');
    }
    const records = Database.getAll(SETTINGS_SHEET_NAME);
    const dropdownItems = records
      .filter(r => 
        String(r.Category).trim().toLowerCase() === String(category).trim().toLowerCase() && 
        (r.Active === true || String(r.Active).toUpperCase() === 'TRUE')
      )
      .sort((a, b) => (Number(a.Sequence) || 0) - (Number(b.Sequence) || 0))
      .map(r => ({
        code: r.Code,
        displayName: r['Display Name'],
        description: r.Description || '',
        sequence: r.Sequence
      }));
    return dropdownItems;
  }, 'getDropdown');
}

/**
 * Saves a new setting record after verifying uniqueness and payload validation.
 * @param {Object} record - The setting object to create.
 * @return {Object} Standardized Response containing the saved record.
 */
function saveSetting(record) {
  return safeExecute(() => {
    const validation = validateSetting(record);
    if (!validation.success) {
      return validation;
    }

    const records = Database.getAll(SETTINGS_SHEET_NAME);
    
    // Uniqueness Check: Category + Code
    const isDuplicate = records.some(r => 
      String(r.Category).trim().toLowerCase() === String(record.Category).trim().toLowerCase() &&
      String(r.Code).trim().toLowerCase() === String(record.Code).trim().toLowerCase()
    );

    if (isDuplicate) {
      return Response.validationError([{ field: 'Code', message: 'Category + Code combination must be unique.' }]);
    }

    // Auto-generate Setting ID (SET000001 format)
    const nextSeq = records.length + 1;
    const formattedId = `SET${String(nextSeq).padStart(6, '0')}`;

    const newRecord = {
      'Setting ID': formattedId,
      'Category': sanitizeInput(record.Category.trim()),
      'Code': sanitizeInput(record.Code.trim().toUpperCase()),
      'Display Name': sanitizeInput(record['Display Name'].trim()),
      'Description': sanitizeInput(record.Description || ''),
      'Sequence': Number(record.Sequence) || 1,
      'Active': record.Active === true || String(record.Active).toUpperCase() === 'TRUE',
      'Remarks': sanitizeInput(record.Remarks || ''),
      'is_deleted': false,
      'created_at': generateTimestamp(),
      'updated_at': generateTimestamp()
    };

    Database.insertRecord(SETTINGS_SHEET_NAME, newRecord);
    return newRecord;
  }, 'saveSetting');
}

/**
 * Updates an existing setting record by settingId.
 * @param {string} settingId - Primary key SET ID.
 * @param {Object} record - The updated fields payload.
 * @return {Object} Standardized Response indicating outcome.
 */
function updateSetting(settingId, record) {
  return safeExecute(() => {
    if (isBlank(settingId)) {
      return Response.error('Setting ID is required for update');
    }

    const existing = Database.findById(SETTINGS_SHEET_NAME, settingId);
    if (!existing) {
      return Response.notFound(`Setting record with ID ${settingId} not found`);
    }

    const validation = validateSetting(record);
    if (!validation.success) {
      return validation;
    }

    const records = Database.getAll(SETTINGS_SHEET_NAME);

    // Uniqueness Check for Category + Code (excluding current record)
    const isDuplicate = records.some(r => 
      String(r['Setting ID']) !== String(settingId) &&
      String(r.Category).trim().toLowerCase() === String(record.Category).trim().toLowerCase() &&
      String(r.Code).trim().toLowerCase() === String(record.Code).trim().toLowerCase()
    );

    if (isDuplicate) {
      return Response.validationError([{ field: 'Code', message: 'Category + Code combination must be unique.' }]);
    }

    const updatePayload = {
      'Category': sanitizeInput(record.Category.trim()),
      'Code': sanitizeInput(record.Code.trim().toUpperCase()),
      'Display Name': sanitizeInput(record['Display Name'].trim()),
      'Description': sanitizeInput(record.Description || ''),
      'Sequence': Number(record.Sequence) || 1,
      'Active': record.Active === true || String(record.Active).toUpperCase() === 'TRUE',
      'Remarks': sanitizeInput(record.Remarks || ''),
      'updated_at': generateTimestamp()
    };

    const successFlag = Database.updateRecord(SETTINGS_SHEET_NAME, settingId, updatePayload);
    return successFlag ? updatePayload : Response.error('Failed to update record');
  }, 'updateSetting');
}

/**
 * Performs a soft delete on a setting record.
 * @param {string} settingId - Target record ID.
 * @return {Object} Standardized Response.
 */
function softDeleteSetting(settingId) {
  return safeExecute(() => {
    if (isBlank(settingId)) {
      return Response.error('Setting ID is required');
    }
    const successFlag = Database.softDelete(SETTINGS_SHEET_NAME, settingId);
    return successFlag ? true : Response.notFound('Record not found or already deleted');
  }, 'softDeleteSetting');
}

/**
 * Searches settings matching a keyword against Category, Code, Display Name, or Description.
 * @param {string} keyword - Search term.
 * @return {Object} Standardized Response containing matching records.
 */
function searchSettings(keyword) {
  return safeExecute(() => {
    const records = Database.getAll(SETTINGS_SHEET_NAME);
    if (isBlank(keyword)) {
      return records;
    }
    const term = String(keyword).trim().toLowerCase();
    const matches = records.filter(r => 
      String(r.Category || '').toLowerCase().includes(term) ||
      String(r.Code || '').toLowerCase().includes(term) ||
      String(r['Display Name'] || '').toLowerCase().includes(term) ||
      String(r.Description || '').toLowerCase().includes(term)
    );
    return matches;
  }, 'searchSettings');
}

/**
 * Validates setting field constraints before persist.
 * @param {Object} record - Record payload.
 * @return {Object} Standardized response containing array of error details if invalid.
 */
function validateSetting(record) {
  const errors = [];

  if (isBlank(record.Category)) {
    errors.push({ field: 'Category', message: 'Category is mandatory.' });
  }

  if (isBlank(record.Code)) {
    errors.push({ field: 'Code', message: 'Code is mandatory.' });
  }

  if (isBlank(record['Display Name'])) {
    errors.push({ field: 'Display Name', message: 'Display Name is mandatory.' });
  }

  const seq = Number(record.Sequence);
  if (isNaN(seq) || seq <= 0 || !Number.isInteger(seq)) {
    errors.push({ field: 'Sequence', message: 'Sequence must be a positive integer.' });
  }

  if (errors.length > 0) {
    return Response.validationError(errors);
  }

  return Response.success(null, 'Validation passed');
}