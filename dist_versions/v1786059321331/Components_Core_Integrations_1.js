(function(){
  // Integration shim to augment existing component factories with Core features
  var Core = window.SahakarComponents && window.SahakarComponents.Core;
  if (!Core) return; // Core not loaded
  var Shared = Core.SharedHelpers;
  var BaseComponent = Core.BaseComponent;
  var ConfigManager = Core.ConfigManager;
  var Registry = Core.ComponentRegistry;
  var names = ['Card','Toolbar','Alert','Spinner','Modal','SearchBox','Pagination','DataTable'];

  names.forEach(function(name){
    try{
      var comp = window.SahakarComponents && window.SahakarComponents[name];
      if (!comp || typeof comp.create !== 'function') return;
      var origFactory = comp.create;

      // Avoid double-wrapping
      if (comp._integratedWithCore) return;

      function wrappedFactory(container, config){
        var cfg = config || {};
        // call original factory
        var instance = origFactory(container, cfg) || {};

        // resolve host and element
        var host = Shared && Shared.ensureElement(container);
        var el = instance.el || instance.node || instance.dom || (host && host.querySelector('#'+(cfg.id||''))) || null;

        // merge defaults (keep original config object mutation to preserve backward compat)
        var merged = ConfigManager && ConfigManager.mergeDefaults({}, cfg) || cfg;

        // create base component and apply base config
        try{
          if (BaseComponent && el){
            var base = new BaseComponent(host || el.parentNode, el, merged);
            base.applyBaseConfig(merged);
            // expose base emitter and lifecycle helpers on instance for compatibility
            instance._coreBase = base;
            // forward standard methods only if not present to keep original behavior
            if (!instance.on) instance.on = base.on.bind(base);
            if (!instance.off) instance.off = base.off.bind(base);
            // wrap show/hide/update/destroy to call base lifecycle then original
            var origShow = instance.show && instance.show.bind(instance);
            instance.show = function(){ try{ base.show(); } catch(e){} if (origShow) try{ origShow(); } catch(e){} };
            var origHide = instance.hide && instance.hide.bind(instance);
            instance.hide = function(){ try{ base.hide(); } catch(e){} if (origHide) try{ origHide(); } catch(e){} };
            var origUpdate = instance.update && instance.update.bind(instance);
            instance.update = function(cfg2){ try{ base.update(cfg2); } catch(e){} if (origUpdate) try{ origUpdate(cfg2); } catch(e){} };
            var origDestroy = instance.destroy && instance.destroy.bind(instance);
            instance.destroy = function(){ try{ base.destroy(); } catch(e){} if (origDestroy) try{ origDestroy(); } catch(e){} };
          }
        }catch(e){ console.warn('Core integration failed for ' + name, e); }

        return instance;
      }

      // mark integrated and replace factory on global namespace
      comp.create = wrappedFactory;
      comp._integratedWithCore = true;

      // register with ComponentRegistry for runtime creation
      try{ if (Registry && typeof Registry.register === 'function') Registry.register(name, function(container, cfg){ return wrappedFactory(container, cfg); }); } catch(e){ console.warn('Registry registration failed for ' + name, e); }

    }catch(err){ console.error('Error integrating component', name, err); }
  });
})();
