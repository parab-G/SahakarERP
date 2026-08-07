/**
 * ==========================================================
 * SAHAKAR ERP
 * Config.gs
 * Version: 1.0.0
 * ==========================================================
 */

const APP_NAME = "Sahakar ERP";
const ERP_VERSION = "1.0.0";
const SPREADSHEET_ID = "";

const DEFAULT_TIMEZONE = "Asia/Kolkata";
const DEFAULT_CURRENCY = "INR";

const SHEET_NAMES = Object.freeze({
  SETTINGS: "Settings",
  SOCIETY_MASTER: "Society Master",
  EXECUTION_AGENCY: "Execution Agency Register",
  SUPPLIER: "Supplier Register",
  SOCIETY_ACCOUNTS: "Society Accounts Register",
  CHART_OF_ACCOUNTS: "Chart of Accounts",
  TENDER: "Tender Register",
  WORK_ORDER: "Work Order Register",
  EXECUTION_ASSIGNMENT: "Execution Assignment Register",
  VOUCHER: "Voucher Register",
  TRANSACTION: "Transaction Register",
  GOVERNMENT_BILL: "Government Bill Register",
  GST_PURCHASE: "GST Purchase Register",
  SETTLEMENT: "Settlement Register",
  DOCUMENT: "Document Register",
  COMPLIANCE: "Compliance Register",
  REPORTS: "Reports"
});

const PRIMARY_KEYS = Object.freeze({
  SETTINGS: "Setting ID",
  SOCIETY_MASTER: "Society ID",
  EXECUTION_AGENCY: "Agency ID",
  SUPPLIER: "Supplier ID",
  SOCIETY_ACCOUNTS: "Account ID",
  CHART_OF_ACCOUNTS: "Account Head ID",
  TENDER: "Tender ID",
  WORK_ORDER: "Work Order ID",
  EXECUTION_ASSIGNMENT: "Assignment ID",
  VOUCHER: "Voucher ID",
  TRANSACTION: "Transaction ID",
  GOVERNMENT_BILL: "Bill ID",
  GST_PURCHASE: "Purchase ID",
  SETTLEMENT: "Settlement ID",
  DOCUMENT: "Document ID"
});

const ID_PREFIX = Object.freeze({
  SETTINGS: "SET",
  SOCIETY_MASTER: "SOC",
  EXECUTION_AGENCY: "AGN",
  SUPPLIER: "SUP",
  SOCIETY_ACCOUNTS: "ACC",
  CHART_OF_ACCOUNTS: "COA",
  TENDER: "TND",
  WORK_ORDER: "WO",
  EXECUTION_ASSIGNMENT: "ASN",
  VOUCHER: "VCH",
  TRANSACTION: "TRN",
  GOVERNMENT_BILL: "GB",
  GST_PURCHASE: "GST",
  SETTLEMENT: "STL",
  DOCUMENT: "DOC"
});

const SYSTEM_FIELDS = Object.freeze([
  "Created On",
  "Created By",
  "Updated On",
  "Updated By",
  "Status",
  "is_deleted"
]);

function getSheetName(key){ return SHEET_NAMES[key]; }
function getPrimaryKey(key){ return PRIMARY_KEYS[key]; }
function getPrefix(key){ return ID_PREFIX[key]; }
