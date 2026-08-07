(function(){
  // Simple registry for component factories
  var registry = Object.create(null);
  function register(name, factory){ if (!name || typeof factory !== 'function') throw new Error('Invalid component registration'); registry[name] = factory; }
  function getFactory(name){ return registry[name]; }
  function list(){ return Object.keys(registry); }
  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.ComponentRegistry = { register: register, getFactory: getFactory, list: list };
})();