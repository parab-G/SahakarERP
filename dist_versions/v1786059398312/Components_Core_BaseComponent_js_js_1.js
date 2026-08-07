(function(){
  // Minimal base component class that provides standardized lifecycle and config handling
  var Shared = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.SharedHelpers;
  var EventEmitter = window.SahakarComponents && window.SahakarComponents.Core && window.SahakarComponents.Core.EventEmitter;

  function BaseComponent(host, node, config){ this.host = host; this.node = node; this.config = config || {}; this.id = this.config.id || (this.node && this.node.id) || (Shared && Shared.uid('comp')) || 'comp'; this.emitter = new (EventEmitter || function(){})(); }

  BaseComponent.prototype.applyBaseConfig = function(cfg){ if (!cfg) return; this.config = Object.assign({}, this.config, cfg); if (this.config.id) this.node.id = this.config.id; if (this.config.className) this.node.classList.add(...this.config.className.split(' ')); if (typeof this.config.visible !== 'undefined'){ if (this.config.visible) this.node.classList.remove('d-none'); else this.node.classList.add('d-none'); } if (typeof this.config.disabled !== 'undefined'){ if (this.config.disabled) this.node.setAttribute('aria-disabled','true'); else this.node.removeAttribute('aria-disabled'); } if (this.config.theme) this.node.dataset.theme = this.config.theme; if (this.config.callbacks) this._wireCallbacks(this.config.callbacks); };

  BaseComponent.prototype._wireCallbacks = function(callbacks){ var self=this; Object.keys(callbacks||{}).forEach(function(k){ if (typeof callbacks[k] === 'function') self.emitter.on(k, callbacks[k]); }); };

  BaseComponent.prototype.show = function(){ this.node.classList.remove('d-none'); this.emitter.emit('show', this); };
  BaseComponent.prototype.hide = function(){ this.node.classList.add('d-none'); this.emitter.emit('hide', this); };
  BaseComponent.prototype.update = function(cfg){ this.applyBaseConfig(cfg); this.emitter.emit('update', cfg); };
  BaseComponent.prototype.destroy = function(){ try{ this.node.remove(); } catch(e){} this.emitter.emit('destroy', this); };
  BaseComponent.prototype.on = function(event, handler){ this.emitter.on(event, handler); };
  BaseComponent.prototype.off = function(event, handler){ this.emitter.off(event, handler); };

  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.BaseComponent = BaseComponent;
})();