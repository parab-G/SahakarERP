/**
 * Serves the main HTML interface of the application framework.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Main')
    .evaluate()
    .setTitle('ERP System Framework')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper function to include HTML sub-files within other HTML files.
 * @param {string} filename - The name of the file to include.
 * @return {string} The raw content of the file.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}