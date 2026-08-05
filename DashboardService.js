/**
 * ==========================================================
 * SAHAKAR ERP
 * DashboardService.js
 * Version: 1.0.0
 * Dashboard Business Service
 * ==========================================================
 */

const DASHBOARD_SERVICE = (() => {

  'use strict';

  function countSheet(sheetName) {
    try {
      return Database.count(sheetName);
    } catch (error) {
      logError('DashboardService.countSheet', error);
      return 0;
    }
  }

  function readCounts() {
    return {
      societies: countSheet(SHEET_NAMES.SOCIETY_MASTER),
      executionAgencies: countSheet(SHEET_NAMES.EXECUTION_AGENCY),
      suppliers: countSheet(SHEET_NAMES.SUPPLIER),
      societyAccounts: countSheet(SHEET_NAMES.SOCIETY_ACCOUNTS),
      chartOfAccounts: countSheet(SHEET_NAMES.CHART_OF_ACCOUNTS),
      tenders: countSheet(SHEET_NAMES.TENDER),
      workOrders: countSheet(SHEET_NAMES.WORK_ORDER),
      executionAssignments: countSheet(SHEET_NAMES.EXECUTION_ASSIGNMENT),
      vouchers: countSheet(SHEET_NAMES.VOUCHER),
      transactions: countSheet(SHEET_NAMES.TRANSACTION),
      governmentBills: countSheet(SHEET_NAMES.GOVERNMENT_BILL),
      gstPurchases: countSheet(SHEET_NAMES.GST_PURCHASE),
      settlements: countSheet(SHEET_NAMES.SETTLEMENT),
      documents: countSheet(SHEET_NAMES.DOCUMENT),
      compliances: countSheet(SHEET_NAMES.COMPLIANCE),
      reports: countSheet(SHEET_NAMES.REPORTS)
    };
  }

  /**
   * Returns all dashboard summary information.
   */
  function getDashboardSummary() {

    return safeExecute(() => {

      const summary = {
        ...readCounts(),

        generatedOn: generateTimestamp(),

        application: APP_NAME,

        version: ERP_VERSION

      };

      return summary;

    });

  }

  /**
   * Simple health check.
   */
  function getSystemStatus() {

    return safeExecute(() => {

      const summary = {
        application: APP_NAME,
        version: ERP_VERSION,
        databaseConnected: false,
        spreadsheetName: '',
        generatedOn: generateTimestamp()
      };

      try {
        summary.spreadsheetName = Database.getDatabase().getName();
        summary.databaseConnected = true;
      } catch (error) {
        logError('DashboardService.getSystemStatus', error);
      }

      return summary;
    });

  }

  /**
   * Returns dashboard cards.
   * Frontend can directly bind these.
   */
  function getDashboardCards() {

    return safeExecute(() => {

      const counts = readCounts();

      return [

        {
          title: "Societies",
          value: counts.societies,
          icon: "groups",
          color: "primary"
        },

        {
          title: "Execution Agencies",
          value: counts.executionAgencies,
          icon: "engineering",
          color: "success"
        },

        {
          title: "Suppliers",
          value: counts.suppliers,
          icon: "local_shipping",
          color: "warning"
        },

        {
          title: "Tenders",
          value: counts.tenders,
          icon: "gavel",
          color: "danger"
        },

        {
          title: "Work Orders",
          value: counts.workOrders,
          icon: "assignment",
          color: "info"
        },

        {
          title: "Vouchers",
          value: counts.vouchers,
          icon: "receipt_long",
          color: "secondary"
        },

        {
          title: "Government Bills",
          value: counts.governmentBills,
          icon: "receipt_long",
          color: "info"
        },

        {
          title: "GST Purchases",
          value: counts.gstPurchases,
          icon: "shopping_bag",
          color: "secondary"
        }

      ];

    });

  }

  /**
   * Recent activity.
   * Placeholder for now.
   */
  function getRecentActivity() {

    return safeExecute(() => {

      return [];

    });

  }

  /**
   * Dashboard initialization.
   */
  function initializeDashboard() {

    return safeExecute(() => {

      return {

        summary: getDashboardSummary().data,

        cards: getDashboardCards().data,

        system: getSystemStatus().data,

        recentActivity: getRecentActivity().data

      };

    });

  }

  return Object.freeze({

    initializeDashboard,

    getDashboardSummary,

    getDashboardCards,

    getSystemStatus,

    getRecentActivity

  });

})();

/** Public Apps Script entry point used by the Dashboard frontend. */
function initializeDashboard() {
  return DASHBOARD_SERVICE.initializeDashboard();
}
