(function(){
  var defaultVars = { '--sahakar-zindex-modal': '1050', '--sahakar-progress-height': '6px' };
  function applyThemeVars(vars){ var root = document.documentElement; Object.keys(vars||{}).forEach(function(k){ root.style.setProperty(k, vars[k]); }); }
  function setTheme(name, vars){ // name unused for now
    applyThemeVars(vars || defaultVars);
  }
  function getThemeVars(){ var root = getComputedStyle(document.documentElement); var out={}; Object.keys(defaultVars).forEach(function(k){ out[k] = root.getPropertyValue(k) || defaultVars[k]; }); return out; }
  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.ThemeManager = { setTheme: setTheme, getThemeVars: getThemeVars, defaultVars: defaultVars };
})();