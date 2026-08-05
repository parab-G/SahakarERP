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

  /**
   * Returns all dashboard summary information.
   */
  function getDashboardSummary() {

    return safeExecute(() => {

      const summary = {

        societies: Database.count(SHEET_NAMES.SOCIETY_MASTER),

        executionAgencies: Database.count(SHEET_NAMES.EXECUTION_AGENCY),

        suppliers: Database.count(SHEET_NAMES.SUPPLIER),

        societyAccounts: Database.count(SHEET_NAMES.SOCIETY_ACCOUNTS),

        chartOfAccounts: Database.count(SHEET_NAMES.CHART_OF_ACCOUNTS),

        tenders: Database.count(SHEET_NAMES.TENDER),

        workOrders: Database.count(SHEET_NAMES.WORK_ORDER),

        executionAssignments: Database.count(SHEET_NAMES.EXECUTION_ASSIGNMENT),

        vouchers: Database.count(SHEET_NAMES.VOUCHER),

        transactions: Database.count(SHEET_NAMES.TRANSACTION),

        governmentBills: Database.count(SHEET_NAMES.GOVERNMENT_BILL),

        gstPurchases: Database.count(SHEET_NAMES.GST_PURCHASE),

        settlements: Database.count(SHEET_NAMES.SETTLEMENT),

        documents: Database.count(SHEET_NAMES.DOCUMENT),

        compliances: Database.count(SHEET_NAMES.COMPLIANCE),

        reports: Database.count(SHEET_NAMES.REPORTS),

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

      return {

        application: APP_NAME,

        version: ERP_VERSION,

        databaseConnected: true,

        spreadsheetName:
          Database.getDatabase().getName(),

        generatedOn: generateTimestamp()

      };

    });

  }

  /**
   * Returns dashboard cards.
   * Frontend can directly bind these.
   */
  function getDashboardCards() {

    return safeExecute(() => {

      return [

        {
          title: "Societies",
          value: Database.count(SHEET_NAMES.SOCIETY_MASTER),
          icon: "groups",
          color: "primary"
        },

        {
          title: "Execution Agencies",
          value: Database.count(SHEET_NAMES.EXECUTION_AGENCY),
          icon: "engineering",
          color: "success"
        },

        {
          title: "Suppliers",
          value: Database.count(SHEET_NAMES.SUPPLIER),
          icon: "local_shipping",
          color: "warning"
        },

        {
          title: "Tenders",
          value: Database.count(SHEET_NAMES.TENDER),
          icon: "gavel",
          color: "danger"
        },

        {
          title: "Work Orders",
          value: Database.count(SHEET_NAMES.WORK_ORDER),
          icon: "assignment",
          color: "info"
        },

        {
          title: "Vouchers",
          value: Database.count(SHEET_NAMES.VOUCHER),
          icon: "receipt_long",
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