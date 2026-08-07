(function(){
  var Registry = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.ComponentRegistry;
  var Shared = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.SharedHelpers;
  function createByName(name, container, config){ var factory = Registry && Registry.getFactory(name); if (!factory) throw new Error('Component factory not found: ' + name); var host = Shared && Shared.ensureElement(container); if (!host) throw new Error('Invalid container: ' + container); return factory(host, config || {}); }
  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.ComponentFactory = { createByName: createByName };
})();