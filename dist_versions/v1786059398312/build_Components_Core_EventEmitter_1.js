(function(){
  // Minimal EventEmitter
  function EventEmitter(){ this._events = Object.create(null); }
  EventEmitter.prototype.on = function(name, fn){ if (!this._events[name]) this._events[name] = []; this._events[name].push(fn); return this; };
  EventEmitter.prototype.off = function(name, fn){ if (!this._events[name]) return this; if (!fn) { delete this._events[name]; return this; } this._events[name] = this._events[name].filter(f=>f!==fn); return this; };
  EventEmitter.prototype.once = function(name, fn){ var self = this; function wrapped(){ fn.apply(this, arguments); self.off(name, wrapped); } this.on(name, wrapped); return this; };
  EventEmitter.prototype.emit = function(name){ var args = Array.prototype.slice.call(arguments,1); var fns = this._events[name]; if (!fns || !fns.length) return false; fns.slice().forEach(function(fn){ try{ fn.apply(null, args); } catch(e){ console.error('EventEmitter handler error', e); } }); return true; };

  window.SahakarComponents = window.SahakarComponents || {};
  window.SahakarComponents.Core = window.SahakarComponents.Core || {};
  window.SahakarComponents.Core.EventEmitter = EventEmitter;
})();