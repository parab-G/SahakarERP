(function(){
  var Shared = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.SharedHelpers;
  function mergeDefaults(defaults, cfg){ var out = Object.assign({}, defaults || {}); if (!cfg) return out; Object.keys(cfg).forEach(function(k){ out[k] = cfg[k]; }); return out; }
  function pick(obj, keys){ var r = {}; keys.forEach(function(k){ if (k in obj) r[k] = obj[k]; }); return r; }
  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.ConfigManager = { mergeDefaults: mergeDefaults, pick: pick };
})();