/**
 * Server-side module template loader.
 *
 * Only registered templates can be requested by the client. This keeps the
 * dynamic loader from becoming an arbitrary HtmlService file reader.
 */
const MODULE_TEMPLATES = Object.freeze({
  Dashboard: 'App',
  Settings: 'Modules/Settings',
  Society: 'Modules/Society'
});

function loadModule(moduleName) {
  const templateName = MODULE_TEMPLATES[String(moduleName || '').trim()];

  if (!templateName) {
    throw new Error('Module not found: ' + moduleName);
  }

  return HtmlService.createTemplateFromFile(templateName)
    .evaluate()
    .getContent();
}
