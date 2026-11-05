"use strict";
var niimbluelib = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/eventemitter3/index.js
  var require_eventemitter3 = __commonJS({
    "node_modules/eventemitter3/index.js"(exports, module) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var prefix = "~";
      function Events() {
      }
      if (Object.create) {
        Events.prototype = /* @__PURE__ */ Object.create(null);
        if (!new Events().__proto__) prefix = false;
      }
      function EE(fn, context, once) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
      }
      function addListener(emitter, event, fn, context, once) {
        if (typeof fn !== "function") {
          throw new TypeError("The listener must be a function");
        }
        var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
        if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
        else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
        else emitter._events[evt] = [emitter._events[evt], listener];
        return emitter;
      }
      function clearEvent(emitter, evt) {
        if (--emitter._eventsCount === 0) emitter._events = new Events();
        else delete emitter._events[evt];
      }
      function EventEmitter2() {
        this._events = new Events();
        this._eventsCount = 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        var names = [], events, name;
        if (this._eventsCount === 0) return names;
        for (name in events = this._events) {
          if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
        }
        if (Object.getOwnPropertySymbols) {
          return names.concat(Object.getOwnPropertySymbols(events));
        }
        return names;
      };
      EventEmitter2.prototype.listeners = function listeners(event) {
        var evt = prefix ? prefix + event : event, handlers = this._events[evt];
        if (!handlers) return [];
        if (handlers.fn) return [handlers.fn];
        for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
          ee[i] = handlers[i].fn;
        }
        return ee;
      };
      EventEmitter2.prototype.listenerCount = function listenerCount(event) {
        var evt = prefix ? prefix + event : event, listeners = this._events[evt];
        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
      };
      EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return false;
        var listeners = this._events[evt], len = arguments.length, args, i;
        if (listeners.fn) {
          if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
          switch (len) {
            case 1:
              return listeners.fn.call(listeners.context), true;
            case 2:
              return listeners.fn.call(listeners.context, a1), true;
            case 3:
              return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
              return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
              return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
          }
          for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
          }
          listeners.fn.apply(listeners.context, args);
        } else {
          var length = listeners.length, j;
          for (i = 0; i < length; i++) {
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
            switch (len) {
              case 1:
                listeners[i].fn.call(listeners[i].context);
                break;
              case 2:
                listeners[i].fn.call(listeners[i].context, a1);
                break;
              case 3:
                listeners[i].fn.call(listeners[i].context, a1, a2);
                break;
              case 4:
                listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                break;
              default:
                if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
                listeners[i].fn.apply(listeners[i].context, args);
            }
          }
        }
        return true;
      };
      EventEmitter2.prototype.on = function on(event, fn, context) {
        return addListener(this, event, fn, context, false);
      };
      EventEmitter2.prototype.once = function once(event, fn, context) {
        return addListener(this, event, fn, context, true);
      };
      EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
        var evt = prefix ? prefix + event : event;
        if (!this._events[evt]) return this;
        if (!fn) {
          clearEvent(this, evt);
          return this;
        }
        var listeners = this._events[evt];
        if (listeners.fn) {
          if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
            clearEvent(this, evt);
          }
        } else {
          for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
              events.push(listeners[i]);
            }
          }
          if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
          else clearEvent(this, evt);
        }
        return this;
      };
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
        var evt;
        if (event) {
          evt = prefix ? prefix + event : event;
          if (this._events[evt]) clearEvent(this, evt);
        } else {
          this._events = new Events();
          this._eventsCount = 0;
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
      EventEmitter2.prefixed = prefix;
      EventEmitter2.EventEmitter = EventEmitter2;
      if ("undefined" !== typeof module) {
        module.exports = EventEmitter2;
      }
    }
  });

  // node_modules/@capacitor/core/dist/index.js
  var ExceptionCode, CapacitorException, getPlatformId, createCapacitor, initCapacitorGlobal, Capacitor, registerPlugin, WebPlugin, encode, decode, CapacitorCookiesPluginWeb, CapacitorCookies, readBlobAsBase64, normalizeHttpHeaders, buildUrlParams, buildRequestInit, CapacitorHttpPluginWeb, CapacitorHttp, SystemBarsStyle, SystemBarType, SystemBarsPluginWeb, SystemBars;
  var init_dist = __esm({
    "node_modules/@capacitor/core/dist/index.js"() {
      (function(ExceptionCode2) {
        ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
        ExceptionCode2["Unavailable"] = "UNAVAILABLE";
      })(ExceptionCode || (ExceptionCode = {}));
      CapacitorException = class extends Error {
        constructor(message, code, data) {
          super(message);
          this.message = message;
          this.code = code;
          this.data = data;
        }
      };
      getPlatformId = (win) => {
        var _a, _b;
        if (win === null || win === void 0 ? void 0 : win.androidBridge) {
          return "android";
        } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
          return "ios";
        } else {
          return "web";
        }
      };
      createCapacitor = (win) => {
        const capCustomPlatform = win.CapacitorCustomPlatform || null;
        const cap = win.Capacitor || {};
        const Plugins = cap.Plugins = cap.Plugins || {};
        const getPlatform = () => {
          return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
        };
        const isNativePlatform = () => getPlatform() !== "web";
        const isPluginAvailable = (pluginName) => {
          const plugin = registeredPlugins.get(pluginName);
          if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
            return true;
          }
          if (getPluginHeader(pluginName)) {
            return true;
          }
          return false;
        };
        const getPluginHeader = (pluginName) => {
          var _a;
          return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
        };
        const handleError = (err) => win.console.error(err);
        const registeredPlugins = /* @__PURE__ */ new Map();
        const registerPlugin2 = (pluginName, jsImplementations = {}) => {
          const registeredPlugin = registeredPlugins.get(pluginName);
          if (registeredPlugin) {
            console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
            return registeredPlugin.proxy;
          }
          const platform = getPlatform();
          const pluginHeader = getPluginHeader(pluginName);
          let jsImplementation;
          const loadPluginImplementation = () => __async(null, null, function* () {
            if (!jsImplementation && platform in jsImplementations) {
              jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = yield jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
            } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
              jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = yield jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
            }
            return jsImplementation;
          });
          const createPluginMethod = (impl, prop) => {
            var _a, _b;
            if (pluginHeader) {
              const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
              if (methodHeader) {
                if (methodHeader.rtype === "promise") {
                  return (options) => cap.nativePromise(pluginName, prop.toString(), options);
                } else {
                  return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
                }
              } else if (impl) {
                return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
              }
            } else if (impl) {
              return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
            } else {
              throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
            }
          };
          const createPluginMethodWrapper = (prop) => {
            let remove;
            const wrapper = (...args) => {
              const p = loadPluginImplementation().then((impl) => {
                const fn = createPluginMethod(impl, prop);
                if (fn) {
                  const p2 = fn(...args);
                  remove = p2 === null || p2 === void 0 ? void 0 : p2.remove;
                  return p2;
                } else {
                  throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
                }
              });
              if (prop === "addListener") {
                p.remove = () => __async(null, null, function* () {
                  return remove();
                });
              }
              return p;
            };
            wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
            Object.defineProperty(wrapper, "name", {
              value: prop,
              writable: false,
              configurable: false
            });
            return wrapper;
          };
          const addListener = createPluginMethodWrapper("addListener");
          const removeListener = createPluginMethodWrapper("removeListener");
          const addListenerNative = (eventName, callback) => {
            const call = addListener({ eventName }, callback);
            const remove = () => __async(null, null, function* () {
              const callbackId = yield call;
              removeListener({
                eventName,
                callbackId
              }, callback);
            });
            const p = new Promise((resolve) => call.then(() => resolve({ remove })));
            p.remove = () => __async(null, null, function* () {
              console.warn(`Using addListener() without 'await' is deprecated.`);
              yield remove();
            });
            return p;
          };
          const proxy = new Proxy({}, {
            get(_, prop) {
              switch (prop) {
                // https://github.com/facebook/react/issues/20030
                case "$$typeof":
                  return void 0;
                case "toJSON":
                  return () => ({});
                case "addListener":
                  return pluginHeader ? addListenerNative : addListener;
                case "removeListener":
                  return removeListener;
                default:
                  return createPluginMethodWrapper(prop);
              }
            }
          });
          Plugins[pluginName] = proxy;
          registeredPlugins.set(pluginName, {
            name: pluginName,
            proxy,
            platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
          });
          return proxy;
        };
        if (!cap.convertFileSrc) {
          cap.convertFileSrc = (filePath) => filePath;
        }
        cap.getPlatform = getPlatform;
        cap.handleError = handleError;
        cap.isNativePlatform = isNativePlatform;
        cap.isPluginAvailable = isPluginAvailable;
        cap.registerPlugin = registerPlugin2;
        cap.Exception = CapacitorException;
        cap.DEBUG = !!cap.DEBUG;
        cap.isLoggingEnabled = !!cap.isLoggingEnabled;
        return cap;
      };
      initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
      Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
      registerPlugin = Capacitor.registerPlugin;
      WebPlugin = class {
        constructor() {
          this.listeners = {};
          this.retainedEventArguments = {};
          this.windowListeners = {};
        }
        addListener(eventName, listenerFunc) {
          let firstListener = false;
          const listeners = this.listeners[eventName];
          if (!listeners) {
            this.listeners[eventName] = [];
            firstListener = true;
          }
          this.listeners[eventName].push(listenerFunc);
          const windowListener = this.windowListeners[eventName];
          if (windowListener && !windowListener.registered) {
            this.addWindowListener(windowListener);
          }
          if (firstListener) {
            this.sendRetainedArgumentsForEvent(eventName);
          }
          const remove = () => __async(this, null, function* () {
            return this.removeListener(eventName, listenerFunc);
          });
          const p = Promise.resolve({ remove });
          return p;
        }
        removeAllListeners() {
          return __async(this, null, function* () {
            this.listeners = {};
            for (const listener in this.windowListeners) {
              this.removeWindowListener(this.windowListeners[listener]);
            }
            this.windowListeners = {};
          });
        }
        notifyListeners(eventName, data, retainUntilConsumed) {
          const listeners = this.listeners[eventName];
          if (!listeners) {
            if (retainUntilConsumed) {
              let args = this.retainedEventArguments[eventName];
              if (!args) {
                args = [];
              }
              args.push(data);
              this.retainedEventArguments[eventName] = args;
            }
            return;
          }
          listeners.forEach((listener) => listener(data));
        }
        hasListeners(eventName) {
          var _a;
          return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
        }
        registerWindowListener(windowEventName, pluginEventName) {
          this.windowListeners[pluginEventName] = {
            registered: false,
            windowEventName,
            pluginEventName,
            handler: (event) => {
              this.notifyListeners(pluginEventName, event);
            }
          };
        }
        unimplemented(msg = "not implemented") {
          return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
        }
        unavailable(msg = "not available") {
          return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
        }
        removeListener(eventName, listenerFunc) {
          return __async(this, null, function* () {
            const listeners = this.listeners[eventName];
            if (!listeners) {
              return;
            }
            const index = listeners.indexOf(listenerFunc);
            if (index !== -1) {
              this.listeners[eventName].splice(index, 1);
            }
            if (!this.listeners[eventName].length) {
              this.removeWindowListener(this.windowListeners[eventName]);
            }
          });
        }
        addWindowListener(handle) {
          window.addEventListener(handle.windowEventName, handle.handler);
          handle.registered = true;
        }
        removeWindowListener(handle) {
          if (!handle) {
            return;
          }
          window.removeEventListener(handle.windowEventName, handle.handler);
          handle.registered = false;
        }
        sendRetainedArgumentsForEvent(eventName) {
          const args = this.retainedEventArguments[eventName];
          if (!args) {
            return;
          }
          delete this.retainedEventArguments[eventName];
          args.forEach((arg) => {
            this.notifyListeners(eventName, arg);
          });
        }
      };
      encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
      CapacitorCookiesPluginWeb = class extends WebPlugin {
        getCookies() {
          return __async(this, null, function* () {
            const cookies = document.cookie;
            const cookieMap = {};
            cookies.split(";").forEach((cookie) => {
              if (cookie.length <= 0)
                return;
              let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
              key = decode(key).trim();
              value = decode(value).trim();
              cookieMap[key] = value;
            });
            return cookieMap;
          });
        }
        setCookie(options) {
          return __async(this, null, function* () {
            try {
              const encodedKey = encode(options.key);
              const encodedValue = encode(options.value);
              const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
              const path = (options.path || "/").replace("path=", "");
              const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
              document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
            } catch (error) {
              return Promise.reject(error);
            }
          });
        }
        deleteCookie(options) {
          return __async(this, null, function* () {
            try {
              document.cookie = `${options.key}=; Max-Age=0`;
            } catch (error) {
              return Promise.reject(error);
            }
          });
        }
        clearCookies() {
          return __async(this, null, function* () {
            try {
              const cookies = document.cookie.split(";") || [];
              for (const cookie of cookies) {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
              }
            } catch (error) {
              return Promise.reject(error);
            }
          });
        }
        clearAllCookies() {
          return __async(this, null, function* () {
            try {
              yield this.clearCookies();
            } catch (error) {
              return Promise.reject(error);
            }
          });
        }
      };
      CapacitorCookies = registerPlugin("CapacitorCookies", {
        web: () => new CapacitorCookiesPluginWeb()
      });
      readBlobAsBase64 = (blob) => __async(null, null, function* () {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result;
            resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        });
      });
      normalizeHttpHeaders = (headers = {}) => {
        const originalKeys = Object.keys(headers);
        const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
        const normalized = loweredKeys.reduce((acc, key, index) => {
          acc[key] = headers[originalKeys[index]];
          return acc;
        }, {});
        return normalized;
      };
      buildUrlParams = (params, shouldEncode = true) => {
        if (!params)
          return null;
        const output = Object.entries(params).reduce((accumulator, entry) => {
          const [key, value] = entry;
          let encodedValue;
          let item;
          if (Array.isArray(value)) {
            item = "";
            value.forEach((str) => {
              encodedValue = shouldEncode ? encodeURIComponent(str) : str;
              item += `${key}=${encodedValue}&`;
            });
            item.slice(0, -1);
          } else {
            encodedValue = shouldEncode ? encodeURIComponent(value) : value;
            item = `${key}=${encodedValue}`;
          }
          return `${accumulator}&${item}`;
        }, "");
        return output.substr(1);
      };
      buildRequestInit = (options, extra = {}) => {
        const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
        const headers = normalizeHttpHeaders(options.headers);
        const type = headers["content-type"] || "";
        if (typeof options.data === "string") {
          output.body = options.data;
        } else if (type.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(options.data || {})) {
            params.set(key, value);
          }
          output.body = params.toString();
        } else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
          const form = new FormData();
          if (options.data instanceof FormData) {
            options.data.forEach((value, key) => {
              form.append(key, value);
            });
          } else {
            for (const key of Object.keys(options.data)) {
              form.append(key, options.data[key]);
            }
          }
          output.body = form;
          const headers2 = new Headers(output.headers);
          headers2.delete("content-type");
          output.headers = headers2;
        } else if (type.includes("application/json") || typeof options.data === "object") {
          output.body = JSON.stringify(options.data);
        }
        return output;
      };
      CapacitorHttpPluginWeb = class extends WebPlugin {
        /**
         * Perform an Http request given a set of options
         * @param options Options to build the HTTP request
         */
        request(options) {
          return __async(this, null, function* () {
            const requestInit = buildRequestInit(options, options.webFetchExtra);
            const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
            const url = urlParams ? `${options.url}?${urlParams}` : options.url;
            const response = yield fetch(url, requestInit);
            const contentType = response.headers.get("content-type") || "";
            let { responseType = "text" } = response.ok ? options : {};
            if (contentType.includes("application/json")) {
              responseType = "json";
            }
            let data;
            let blob;
            switch (responseType) {
              case "arraybuffer":
              case "blob":
                blob = yield response.blob();
                data = yield readBlobAsBase64(blob);
                break;
              case "json":
                data = yield response.json();
                break;
              case "document":
              case "text":
              default:
                data = yield response.text();
            }
            const headers = {};
            response.headers.forEach((value, key) => {
              headers[key] = value;
            });
            return {
              data,
              headers,
              status: response.status,
              url: response.url
            };
          });
        }
        /**
         * Perform an Http GET request given a set of options
         * @param options Options to build the HTTP request
         */
        get(options) {
          return __async(this, null, function* () {
            return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
          });
        }
        /**
         * Perform an Http POST request given a set of options
         * @param options Options to build the HTTP request
         */
        post(options) {
          return __async(this, null, function* () {
            return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
          });
        }
        /**
         * Perform an Http PUT request given a set of options
         * @param options Options to build the HTTP request
         */
        put(options) {
          return __async(this, null, function* () {
            return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
          });
        }
        /**
         * Perform an Http PATCH request given a set of options
         * @param options Options to build the HTTP request
         */
        patch(options) {
          return __async(this, null, function* () {
            return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
          });
        }
        /**
         * Perform an Http DELETE request given a set of options
         * @param options Options to build the HTTP request
         */
        delete(options) {
          return __async(this, null, function* () {
            return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
          });
        }
      };
      CapacitorHttp = registerPlugin("CapacitorHttp", {
        web: () => new CapacitorHttpPluginWeb()
      });
      (function(SystemBarsStyle2) {
        SystemBarsStyle2["Dark"] = "DARK";
        SystemBarsStyle2["Light"] = "LIGHT";
        SystemBarsStyle2["Default"] = "DEFAULT";
      })(SystemBarsStyle || (SystemBarsStyle = {}));
      (function(SystemBarType2) {
        SystemBarType2["StatusBar"] = "StatusBar";
        SystemBarType2["NavigationBar"] = "NavigationBar";
      })(SystemBarType || (SystemBarType = {}));
      SystemBarsPluginWeb = class extends WebPlugin {
        setStyle() {
          return __async(this, null, function* () {
            this.unavailable("not available for web");
          });
        }
        setAnimation() {
          return __async(this, null, function* () {
            this.unavailable("not available for web");
          });
        }
        show() {
          return __async(this, null, function* () {
            this.unavailable("not available for web");
          });
        }
        hide() {
          return __async(this, null, function* () {
            this.unavailable("not available for web");
          });
        }
      };
      SystemBars = registerPlugin("SystemBars", {
        web: () => new SystemBarsPluginWeb()
      });
    }
  });

  // node_modules/crc-32/crc32.js
  var require_crc32 = __commonJS({
    "node_modules/crc-32/crc32.js"(exports) {
      var CRC323;
      (function(factory) {
        if (typeof DO_NOT_EXPORT_CRC === "undefined") {
          if ("object" === typeof exports) {
            factory(exports);
          } else if ("function" === typeof define && define.amd) {
            define(function() {
              var module2 = {};
              factory(module2);
              return module2;
            });
          } else {
            factory(CRC323 = {});
          }
        } else {
          factory(CRC323 = {});
        }
      })(function(CRC324) {
        CRC324.version = "1.2.2";
        function signed_crc_table() {
          var c = 0, table = new Array(256);
          for (var n = 0; n != 256; ++n) {
            c = n;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
            table[n] = c;
          }
          return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
        }
        var T0 = signed_crc_table();
        function slice_by_16_tables(T) {
          var c = 0, v = 0, n = 0, table = typeof Int32Array !== "undefined" ? new Int32Array(4096) : new Array(4096);
          for (n = 0; n != 256; ++n) table[n] = T[n];
          for (n = 0; n != 256; ++n) {
            v = T[n];
            for (c = 256 + n; c < 4096; c += 256) v = table[c] = v >>> 8 ^ T[v & 255];
          }
          var out = [];
          for (n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== "undefined" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
          return out;
        }
        var TT = slice_by_16_tables(T0);
        var T1 = TT[0], T2 = TT[1], T3 = TT[2], T4 = TT[3], T5 = TT[4];
        var T6 = TT[5], T7 = TT[6], T8 = TT[7], T9 = TT[8], Ta = TT[9];
        var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
        function crc32_bstr(bstr, seed) {
          var C = seed ^ -1;
          for (var i = 0, L = bstr.length; i < L; ) C = C >>> 8 ^ T0[(C ^ bstr.charCodeAt(i++)) & 255];
          return ~C;
        }
        function crc32_buf(B, seed) {
          var C = seed ^ -1, L = B.length - 15, i = 0;
          for (; i < L; ) C = Tf[B[i++] ^ C & 255] ^ Te[B[i++] ^ C >> 8 & 255] ^ Td[B[i++] ^ C >> 16 & 255] ^ Tc[B[i++] ^ C >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
          L += 15;
          while (i < L) C = C >>> 8 ^ T0[(C ^ B[i++]) & 255];
          return ~C;
        }
        function crc32_str(str, seed) {
          var C = seed ^ -1;
          for (var i = 0, L = str.length, c = 0, d = 0; i < L; ) {
            c = str.charCodeAt(i++);
            if (c < 128) {
              C = C >>> 8 ^ T0[(C ^ c) & 255];
            } else if (c < 2048) {
              C = C >>> 8 ^ T0[(C ^ (192 | c >> 6 & 31)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
            } else if (c >= 55296 && c < 57344) {
              c = (c & 1023) + 64;
              d = str.charCodeAt(i++) & 1023;
              C = C >>> 8 ^ T0[(C ^ (240 | c >> 8 & 7)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c >> 2 & 63)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | d >> 6 & 15 | (c & 3) << 4)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | d & 63)) & 255];
            } else {
              C = C >>> 8 ^ T0[(C ^ (224 | c >> 12 & 15)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c >> 6 & 63)) & 255];
              C = C >>> 8 ^ T0[(C ^ (128 | c & 63)) & 255];
            }
          }
          return ~C;
        }
        CRC324.table = T0;
        CRC324.bstr = crc32_bstr;
        CRC324.buf = crc32_buf;
        CRC324.str = crc32_str;
      });
    }
  });

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/conversion.js
  function numbersToDataView(value) {
    return new DataView(Uint8Array.from(value).buffer);
  }
  function dataViewToNumbers(value) {
    return Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  }
  function numberToUUID(value) {
    return `0000${value.toString(16).padStart(4, "0")}-0000-1000-8000-00805f9b34fb`;
  }
  function hexStringToDataView(hex) {
    const bin = [];
    let i, c, isEmpty = 1, buffer = 0;
    for (i = 0; i < hex.length; i++) {
      c = hex.charCodeAt(i);
      if (c > 47 && c < 58 || c > 64 && c < 71 || c > 96 && c < 103) {
        buffer = buffer << 4 ^ (c > 64 ? c + 9 : c) & 15;
        if (isEmpty ^= 1) {
          bin.push(buffer & 255);
        }
      }
    }
    return numbersToDataView(bin);
  }
  function dataViewToHexString(value) {
    return dataViewToNumbers(value).map((n) => {
      let s = n.toString(16);
      if (s.length == 1) {
        s = "0" + s;
      }
      return s;
    }).join("");
  }
  function webUUIDToString(uuid) {
    if (typeof uuid === "string") {
      return uuid;
    } else if (typeof uuid === "number") {
      return numberToUUID(uuid);
    } else {
      throw new Error("Invalid UUID");
    }
  }
  function mapToObject(map) {
    const obj = {};
    if (!map) {
      return void 0;
    }
    map.forEach((value, key) => {
      obj[key.toString()] = value;
    });
    return obj;
  }
  function toUint8Array(value) {
    if (value === void 0) {
      return void 0;
    }
    if (typeof value === "string") {
      const dataView = hexStringToDataView(value);
      return new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);
    }
    if (value instanceof DataView) {
      return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }
    return value;
  }
  function toHexString(value) {
    if (value === void 0) {
      return void 0;
    }
    if (value instanceof DataView) {
      return dataViewToHexString(value);
    }
    return dataViewToHexString(new DataView(value.buffer, value.byteOffset, value.byteLength));
  }
  function toArrayBufferDataView(value) {
    if (typeof SharedArrayBuffer !== "undefined" && value.buffer instanceof SharedArrayBuffer) {
      const uint8Array = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      const buffer = uint8Array.slice().buffer;
      return new DataView(buffer);
    }
    return value;
  }
  var init_conversion = __esm({
    "node_modules/@capacitor-community/bluetooth-le/dist/esm/conversion.js"() {
    }
  });

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/timeout.js
  function runWithTimeout(promise, time, exception) {
    return __async(this, null, function* () {
      let timer;
      return Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(exception), time);
        })
      ]).finally(() => clearTimeout(timer));
    });
  }
  var init_timeout = __esm({
    "node_modules/@capacitor-community/bluetooth-le/dist/esm/timeout.js"() {
    }
  });

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/web.js
  var web_exports = {};
  __export(web_exports, {
    BluetoothLeWeb: () => BluetoothLeWeb
  });
  var BluetoothLeWeb;
  var init_web = __esm({
    "node_modules/@capacitor-community/bluetooth-le/dist/esm/web.js"() {
      init_dist();
      init_conversion();
      init_timeout();
      BluetoothLeWeb = class extends WebPlugin {
        constructor() {
          super(...arguments);
          this.deviceMap = /* @__PURE__ */ new Map();
          this.discoveredDevices = /* @__PURE__ */ new Map();
          this.scan = null;
          this.DEFAULT_CONNECTION_TIMEOUT = 1e4;
          this.onAdvertisementReceivedCallback = this.onAdvertisementReceived.bind(this);
          this.onDisconnectedCallback = this.onDisconnected.bind(this);
          this.onCharacteristicValueChangedCallback = this.onCharacteristicValueChanged.bind(this);
        }
        initialize() {
          return __async(this, null, function* () {
            if (typeof navigator === "undefined" || !navigator.bluetooth) {
              throw this.unavailable("Web Bluetooth API not available in this browser.");
            }
            const isAvailable = yield navigator.bluetooth.getAvailability();
            if (!isAvailable) {
              throw this.unavailable("No Bluetooth radio available.");
            }
          });
        }
        isEnabled() {
          return __async(this, null, function* () {
            return { value: true };
          });
        }
        requestEnable() {
          return __async(this, null, function* () {
            throw this.unavailable("requestEnable is not available on web.");
          });
        }
        enable() {
          return __async(this, null, function* () {
            throw this.unavailable("enable is not available on web.");
          });
        }
        disable() {
          return __async(this, null, function* () {
            throw this.unavailable("disable is not available on web.");
          });
        }
        startEnabledNotifications() {
          return __async(this, null, function* () {
          });
        }
        stopEnabledNotifications() {
          return __async(this, null, function* () {
          });
        }
        isLocationEnabled() {
          return __async(this, null, function* () {
            throw this.unavailable("isLocationEnabled is not available on web.");
          });
        }
        openLocationSettings() {
          return __async(this, null, function* () {
            throw this.unavailable("openLocationSettings is not available on web.");
          });
        }
        openBluetoothSettings() {
          return __async(this, null, function* () {
            throw this.unavailable("openBluetoothSettings is not available on web.");
          });
        }
        openAppSettings() {
          return __async(this, null, function* () {
            throw this.unavailable("openAppSettings is not available on web.");
          });
        }
        setDisplayStrings() {
          return __async(this, null, function* () {
          });
        }
        requestDevice(options) {
          return __async(this, null, function* () {
            const filters = this.getFilters(options);
            const device = yield navigator.bluetooth.requestDevice({
              filters: filters.length ? filters : void 0,
              optionalServices: options === null || options === void 0 ? void 0 : options.optionalServices,
              acceptAllDevices: filters.length === 0
            });
            this.deviceMap.set(device.id, device);
            const bleDevice = this.getBleDevice(device);
            return bleDevice;
          });
        }
        requestLEScan(options) {
          return __async(this, null, function* () {
            this.requestBleDeviceOptions = options;
            const filters = this.getFilters(options);
            yield this.stopLEScan();
            this.discoveredDevices = /* @__PURE__ */ new Map();
            navigator.bluetooth.removeEventListener("advertisementreceived", this.onAdvertisementReceivedCallback);
            navigator.bluetooth.addEventListener("advertisementreceived", this.onAdvertisementReceivedCallback);
            this.scan = yield navigator.bluetooth.requestLEScan({
              filters: filters.length ? filters : void 0,
              acceptAllAdvertisements: filters.length === 0,
              keepRepeatedDevices: options === null || options === void 0 ? void 0 : options.allowDuplicates
            });
          });
        }
        onAdvertisementReceived(event) {
          var _a, _b, _c;
          const deviceId = event.device.id;
          this.deviceMap.set(deviceId, event.device);
          const isNew = !this.discoveredDevices.has(deviceId);
          if (((_a = this.requestBleDeviceOptions) === null || _a === void 0 ? void 0 : _a.serviceData) && !this.matchesServiceDataFilter(event)) {
            return;
          }
          if (isNew || ((_b = this.requestBleDeviceOptions) === null || _b === void 0 ? void 0 : _b.allowDuplicates)) {
            this.discoveredDevices.set(deviceId, true);
            const device = this.getBleDevice(event.device);
            const result = {
              device,
              localName: device.name,
              rssi: event.rssi,
              txPower: event.txPower,
              manufacturerData: mapToObject(event.manufacturerData),
              serviceData: mapToObject(event.serviceData),
              uuids: (_c = event.uuids) === null || _c === void 0 ? void 0 : _c.map(webUUIDToString)
            };
            this.notifyListeners("onScanResult", result);
          }
        }
        stopLEScan() {
          return __async(this, null, function* () {
            var _a;
            if ((_a = this.scan) === null || _a === void 0 ? void 0 : _a.active) {
              this.scan.stop();
            }
            this.scan = null;
          });
        }
        getDevices(options) {
          return __async(this, null, function* () {
            const devices = yield navigator.bluetooth.getDevices();
            const bleDevices = devices.filter((device) => options.deviceIds.includes(device.id)).map((device) => {
              this.deviceMap.set(device.id, device);
              const bleDevice = this.getBleDevice(device);
              return bleDevice;
            });
            return { devices: bleDevices };
          });
        }
        getConnectedDevices(_options) {
          return __async(this, null, function* () {
            const devices = yield navigator.bluetooth.getDevices();
            const bleDevices = devices.filter((device) => {
              var _a;
              return (_a = device.gatt) === null || _a === void 0 ? void 0 : _a.connected;
            }).map((device) => {
              this.deviceMap.set(device.id, device);
              const bleDevice = this.getBleDevice(device);
              return bleDevice;
            });
            return { devices: bleDevices };
          });
        }
        getBondedDevices() {
          return __async(this, null, function* () {
            return {};
          });
        }
        connect(options) {
          return __async(this, null, function* () {
            var _a, _b;
            const device = this.getDeviceFromMap(options.deviceId);
            device.removeEventListener("gattserverdisconnected", this.onDisconnectedCallback);
            device.addEventListener("gattserverdisconnected", this.onDisconnectedCallback);
            const timeoutError = /* @__PURE__ */ Symbol();
            if (device.gatt === void 0) {
              throw new Error("No gatt server available.");
            }
            try {
              const timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : this.DEFAULT_CONNECTION_TIMEOUT;
              yield runWithTimeout(device.gatt.connect(), timeout, timeoutError);
            } catch (error) {
              yield (_b = device.gatt) === null || _b === void 0 ? void 0 : _b.disconnect();
              if (error === timeoutError) {
                throw new Error("Connection timeout");
              } else {
                throw error;
              }
            }
          });
        }
        onDisconnected(event) {
          const deviceId = event.target.id;
          const key = `disconnected|${deviceId}`;
          this.notifyListeners(key, null);
        }
        createBond(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("createBond is not available on web.");
          });
        }
        isBonded(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("isBonded is not available on web.");
          });
        }
        disconnect(options) {
          return __async(this, null, function* () {
            var _a;
            (_a = this.getDeviceFromMap(options.deviceId).gatt) === null || _a === void 0 ? void 0 : _a.disconnect();
          });
        }
        getServices(options) {
          return __async(this, null, function* () {
            var _a, _b;
            const services = (_b = yield (_a = this.getDeviceFromMap(options.deviceId).gatt) === null || _a === void 0 ? void 0 : _a.getPrimaryServices()) !== null && _b !== void 0 ? _b : [];
            const bleServices = [];
            for (const service of services) {
              const characteristics = yield service.getCharacteristics();
              const bleCharacteristics = [];
              for (const characteristic of characteristics) {
                bleCharacteristics.push({
                  uuid: characteristic.uuid,
                  properties: this.getProperties(characteristic),
                  descriptors: yield this.getDescriptors(characteristic)
                });
              }
              bleServices.push({ uuid: service.uuid, characteristics: bleCharacteristics });
            }
            return { services: bleServices };
          });
        }
        getDescriptors(characteristic) {
          return __async(this, null, function* () {
            try {
              const descriptors = yield characteristic.getDescriptors();
              return descriptors.map((descriptor) => ({
                uuid: descriptor.uuid
              }));
            } catch (_a) {
              return [];
            }
          });
        }
        getProperties(characteristic) {
          return {
            broadcast: characteristic.properties.broadcast,
            read: characteristic.properties.read,
            writeWithoutResponse: characteristic.properties.writeWithoutResponse,
            write: characteristic.properties.write,
            notify: characteristic.properties.notify,
            indicate: characteristic.properties.indicate,
            authenticatedSignedWrites: characteristic.properties.authenticatedSignedWrites,
            reliableWrite: characteristic.properties.reliableWrite,
            writableAuxiliaries: characteristic.properties.writableAuxiliaries
          };
        }
        getCharacteristic(options) {
          return __async(this, null, function* () {
            var _a;
            const service = yield (_a = this.getDeviceFromMap(options.deviceId).gatt) === null || _a === void 0 ? void 0 : _a.getPrimaryService(options === null || options === void 0 ? void 0 : options.service);
            return service === null || service === void 0 ? void 0 : service.getCharacteristic(options === null || options === void 0 ? void 0 : options.characteristic);
          });
        }
        getDescriptor(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            return characteristic === null || characteristic === void 0 ? void 0 : characteristic.getDescriptor(options === null || options === void 0 ? void 0 : options.descriptor);
          });
        }
        discoverServices(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("discoverServices is not available on web.");
          });
        }
        getMtu(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("getMtu is not available on web.");
          });
        }
        requestConnectionPriority(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("requestConnectionPriority is not available on web.");
          });
        }
        readRssi(_options) {
          return __async(this, null, function* () {
            throw this.unavailable("readRssi is not available on web.");
          });
        }
        read(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            const value = yield characteristic === null || characteristic === void 0 ? void 0 : characteristic.readValue();
            return { value };
          });
        }
        write(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            let dataView;
            if (typeof options.value === "string") {
              dataView = hexStringToDataView(options.value);
            } else {
              dataView = options.value;
            }
            yield characteristic === null || characteristic === void 0 ? void 0 : characteristic.writeValueWithResponse(toArrayBufferDataView(dataView));
          });
        }
        writeWithoutResponse(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            let dataView;
            if (typeof options.value === "string") {
              dataView = hexStringToDataView(options.value);
            } else {
              dataView = options.value;
            }
            yield characteristic === null || characteristic === void 0 ? void 0 : characteristic.writeValueWithoutResponse(toArrayBufferDataView(dataView));
          });
        }
        readDescriptor(options) {
          return __async(this, null, function* () {
            const descriptor = yield this.getDescriptor(options);
            const value = yield descriptor === null || descriptor === void 0 ? void 0 : descriptor.readValue();
            return { value };
          });
        }
        writeDescriptor(options) {
          return __async(this, null, function* () {
            const descriptor = yield this.getDescriptor(options);
            let dataView;
            if (typeof options.value === "string") {
              dataView = hexStringToDataView(options.value);
            } else {
              dataView = options.value;
            }
            yield descriptor === null || descriptor === void 0 ? void 0 : descriptor.writeValue(toArrayBufferDataView(dataView));
          });
        }
        startNotifications(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            characteristic === null || characteristic === void 0 ? void 0 : characteristic.removeEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback);
            characteristic === null || characteristic === void 0 ? void 0 : characteristic.addEventListener("characteristicvaluechanged", this.onCharacteristicValueChangedCallback);
            yield characteristic === null || characteristic === void 0 ? void 0 : characteristic.startNotifications();
          });
        }
        onCharacteristicValueChanged(event) {
          var _a, _b;
          const characteristic = event.target;
          const key = `notification|${(_a = characteristic.service) === null || _a === void 0 ? void 0 : _a.device.id}|${(_b = characteristic.service) === null || _b === void 0 ? void 0 : _b.uuid}|${characteristic.uuid}`;
          this.notifyListeners(key, {
            value: characteristic.value
          });
        }
        stopNotifications(options) {
          return __async(this, null, function* () {
            const characteristic = yield this.getCharacteristic(options);
            yield characteristic === null || characteristic === void 0 ? void 0 : characteristic.stopNotifications();
          });
        }
        getFilters(options) {
          var _a, _b;
          const filters = [];
          for (const service of (_a = options === null || options === void 0 ? void 0 : options.services) !== null && _a !== void 0 ? _a : []) {
            filters.push({
              services: [service],
              name: options === null || options === void 0 ? void 0 : options.name,
              namePrefix: options === null || options === void 0 ? void 0 : options.namePrefix
            });
          }
          if (((options === null || options === void 0 ? void 0 : options.name) || (options === null || options === void 0 ? void 0 : options.namePrefix)) && filters.length === 0) {
            filters.push({
              name: options.name,
              namePrefix: options.namePrefix
            });
          }
          for (const manufacturerData of (_b = options === null || options === void 0 ? void 0 : options.manufacturerData) !== null && _b !== void 0 ? _b : []) {
            filters.push({
              manufacturerData: [manufacturerData]
            });
          }
          return filters;
        }
        matchesServiceDataFilter(event) {
          var _a;
          const filters = (_a = this.requestBleDeviceOptions) === null || _a === void 0 ? void 0 : _a.serviceData;
          if (!filters || filters.length === 0) {
            return true;
          }
          if (!event.serviceData) {
            return false;
          }
          for (const filter of filters) {
            const serviceData = event.serviceData.get(filter.serviceUuid);
            if (!serviceData) {
              continue;
            }
            if (!filter.dataPrefix) {
              return true;
            }
            const data = new Uint8Array(serviceData.buffer);
            const prefixView = filter.dataPrefix;
            if (data.length < prefixView.byteLength) {
              continue;
            }
            if (filter.mask) {
              const maskView = filter.mask;
              let matches = true;
              for (let i = 0; i < prefixView.byteLength; i++) {
                if ((data[i] & maskView.getUint8(i)) !== (prefixView.getUint8(i) & maskView.getUint8(i))) {
                  matches = false;
                  break;
                }
              }
              if (matches) {
                return true;
              }
            } else {
              let matches = true;
              for (let i = 0; i < prefixView.byteLength; i++) {
                if (data[i] !== prefixView.getUint8(i)) {
                  matches = false;
                  break;
                }
              }
              if (matches) {
                return true;
              }
            }
          }
          return false;
        }
        getDeviceFromMap(deviceId) {
          const device = this.deviceMap.get(deviceId);
          if (device === void 0) {
            throw new Error('Device not found. Call "requestDevice", "requestLEScan" or "getDevices" first.');
          }
          return device;
        }
        getBleDevice(device) {
          var _a;
          const bleDevice = {
            deviceId: device.id,
            // use undefined instead of null if name is not available
            name: (_a = device.name) !== null && _a !== void 0 ? _a : void 0
          };
          return bleDevice;
        }
      };
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    AbstractPrintTask: () => AbstractPrintTask,
    AutoShutdownTime: () => AutoShutdownTime,
    B1PrintTask: () => B1PrintTask,
    B21L2BPrintTask: () => B21L2BPrintTask,
    B21V1PrintTask: () => B21V1PrintTask,
    BitmapColorMode: () => BitmapColorMode,
    CanvasImageSource: () => CanvasImageSource,
    ConnectEvent: () => ConnectEvent,
    ConnectResult: () => ConnectResult,
    D110MV4PrintTask: () => D110MV4PrintTask,
    D110PrintTask: () => D110PrintTask,
    DisconnectEvent: () => DisconnectEvent,
    FirmwareProgressEvent: () => FirmwareProgressEvent,
    H1SPrintTask: () => H1SPrintTask,
    HeartbeatEvent: () => HeartbeatEvent,
    HeartbeatFailedEvent: () => HeartbeatFailedEvent,
    HeartbeatType: () => HeartbeatType,
    ImageEncoder: () => ImageEncoder,
    LabelType: () => LabelType,
    NIIMBOT_CLIENT_DEFAULTS: () => NIIMBOT_CLIENT_DEFAULTS,
    NiimbotAbstractClient: () => NiimbotAbstractClient,
    NiimbotBluetoothClient: () => NiimbotBluetoothClient,
    NiimbotCapacitorBleClient: () => NiimbotCapacitorBleClient,
    NiimbotCrc32Packet: () => NiimbotCrc32Packet,
    NiimbotEvent: () => NiimbotEvent,
    NiimbotPacket: () => NiimbotPacket,
    NiimbotProtocol: () => NiimbotProtocol,
    NiimbotSerialClient: () => NiimbotSerialClient,
    NiimbotVirtualClient: () => NiimbotVirtualClient,
    OldD11PrintTask: () => OldD11PrintTask,
    PacketGenerator: () => PacketGenerator,
    PacketParser: () => PacketParser,
    PacketReceivedEvent: () => PacketReceivedEvent,
    PacketSentEvent: () => PacketSentEvent,
    PageColorType: () => PageColorType,
    PrintEndEvent: () => PrintEndEvent,
    PrintError: () => PrintError,
    PrintPacketProgressEvent: () => PrintPacketProgressEvent,
    PrintProgressEvent: () => PrintProgressEvent,
    PrintTaskCapability: () => PrintTaskCapability,
    PrinterCapabilitiesField: () => PrinterCapabilitiesField,
    PrinterConfig2Action: () => PrinterConfig2Action,
    PrinterConfig2Type: () => PrinterConfig2Type,
    PrinterErrorCode: () => PrinterErrorCode,
    PrinterInfoFetchedEvent: () => PrinterInfoFetchedEvent,
    PrinterInfoType: () => PrinterInfoType,
    PrinterModel: () => PrinterModel,
    RawPacketReceivedEvent: () => RawPacketReceivedEvent,
    RawPacketSentEvent: () => RawPacketSentEvent,
    RequestCommandId: () => RequestCommandId,
    ResolutionClass: () => ResolutionClass,
    ResponseCommandId: () => ResponseCommandId2,
    RfidInfoFetchedEvent: () => RfidInfoFetchedEvent,
    SequentialDataReader: () => SequentialDataReader,
    SoundSettingsItemType: () => SoundSettingsItemType,
    SoundSettingsType: () => SoundSettingsType,
    Utils: () => Utils,
    Validators: () => Validators,
    commandsMap: () => commandsMap,
    createPrinterInfo: () => createPrinterInfo,
    findPrintTask: () => findPrintTask,
    firmwareExchangePackets: () => firmwareExchangePackets,
    getPrinterMetaById: () => getPrinterMetaById,
    getPrinterMetaByModel: () => getPrinterMetaByModel,
    instantiateClient: () => instantiateClient,
    modelPrintTasks: () => modelPrintTasks,
    modelsLibrary: () => modelsLibrary,
    printTaskNames: () => printTaskNames,
    printTasks: () => printTasks,
    printTasksCapabilities: () => printTasksCapabilities
  });

  // node_modules/eventemitter3/index.mjs
  var import_index = __toESM(require_eventemitter3(), 1);

  // node_modules/async-mutex/index.mjs
  var E_TIMEOUT = new Error("timeout while waiting for mutex to become available");
  var E_ALREADY_LOCKED = new Error("mutex already locked");
  var E_CANCELED = new Error("request for lock canceled");
  var __awaiter$2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Semaphore = class {
    constructor(_value, _cancelError = E_CANCELED) {
      this._value = _value;
      this._cancelError = _cancelError;
      this._queue = [];
      this._weightedWaiters = [];
    }
    acquire(weight = 1, priority = 0) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      return new Promise((resolve, reject) => {
        const task = { resolve, reject, weight, priority };
        const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
        if (i === -1 && weight <= this._value) {
          this._dispatchItem(task);
        } else {
          this._queue.splice(i + 1, 0, task);
        }
      });
    }
    runExclusive(callback_1) {
      return __awaiter$2(this, arguments, void 0, function* (callback, weight = 1, priority = 0) {
        const [value, release] = yield this.acquire(weight, priority);
        try {
          return yield callback(value);
        } finally {
          release();
        }
      });
    }
    waitForUnlock(weight = 1, priority = 0) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      if (this._couldLockImmediately(weight, priority)) {
        return Promise.resolve();
      } else {
        return new Promise((resolve) => {
          if (!this._weightedWaiters[weight - 1])
            this._weightedWaiters[weight - 1] = [];
          insertSorted(this._weightedWaiters[weight - 1], { resolve, priority });
        });
      }
    }
    isLocked() {
      return this._value <= 0;
    }
    getValue() {
      return this._value;
    }
    setValue(value) {
      this._value = value;
      this._dispatchQueue();
    }
    release(weight = 1) {
      if (weight <= 0)
        throw new Error(`invalid weight ${weight}: must be positive`);
      this._value += weight;
      this._dispatchQueue();
    }
    cancel() {
      this._queue.forEach((entry) => entry.reject(this._cancelError));
      this._queue = [];
    }
    _dispatchQueue() {
      this._drainUnlockWaiters();
      while (this._queue.length > 0 && this._queue[0].weight <= this._value) {
        this._dispatchItem(this._queue.shift());
        this._drainUnlockWaiters();
      }
    }
    _dispatchItem(item) {
      const previousValue = this._value;
      this._value -= item.weight;
      item.resolve([previousValue, this._newReleaser(item.weight)]);
    }
    _newReleaser(weight) {
      let called = false;
      return () => {
        if (called)
          return;
        called = true;
        this.release(weight);
      };
    }
    _drainUnlockWaiters() {
      if (this._queue.length === 0) {
        for (let weight = this._value; weight > 0; weight--) {
          const waiters = this._weightedWaiters[weight - 1];
          if (!waiters)
            continue;
          waiters.forEach((waiter) => waiter.resolve());
          this._weightedWaiters[weight - 1] = [];
        }
      } else {
        const queuedPriority = this._queue[0].priority;
        for (let weight = this._value; weight > 0; weight--) {
          const waiters = this._weightedWaiters[weight - 1];
          if (!waiters)
            continue;
          const i = waiters.findIndex((waiter) => waiter.priority <= queuedPriority);
          (i === -1 ? waiters : waiters.splice(0, i)).forEach(((waiter) => waiter.resolve()));
        }
      }
    }
    _couldLockImmediately(weight, priority) {
      return (this._queue.length === 0 || this._queue[0].priority < priority) && weight <= this._value;
    }
  };
  function insertSorted(a, v) {
    const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
    a.splice(i + 1, 0, v);
  }
  function findIndexFromEnd(a, predicate) {
    for (let i = a.length - 1; i >= 0; i--) {
      if (predicate(a[i])) {
        return i;
      }
    }
    return -1;
  }
  var __awaiter$1 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Mutex = class {
    constructor(cancelError) {
      this._semaphore = new Semaphore(1, cancelError);
    }
    acquire() {
      return __awaiter$1(this, arguments, void 0, function* (priority = 0) {
        const [, releaser] = yield this._semaphore.acquire(1, priority);
        return releaser;
      });
    }
    runExclusive(callback, priority = 0) {
      return this._semaphore.runExclusive(() => callback(), 1, priority);
    }
    isLocked() {
      return this._semaphore.isLocked();
    }
    waitForUnlock(priority = 0) {
      return this._semaphore.waitForUnlock(1, priority);
    }
    release() {
      if (this._semaphore.isLocked())
        this._semaphore.release();
    }
    cancel() {
      return this._semaphore.cancel();
    }
  };

  // src/utils/utils.ts
  init_dist();

  // src/utils/validators.ts
  var Validators = class {
    /**
     * Compares two Uint8Arrays for equality and throws an error if they are not equal.
     */
    static u8ArraysEqual(arr, b, message) {
      if (!Utils.u8ArraysEqual(arr, b)) {
        throw new Error(message != null ? message : "Arrays must be equal");
      }
    }
    /**
     * Checks if the length of a Uint8Array equals a specified length and throws an error if the lengths do not match.
     */
    static arrayLengthEquals(arr, len, message) {
      if (arr.length !== len) {
        throw new Error(message != null ? message : `Array length must be ${len}`);
      }
    }
    /**
     * Checks if the length of a Uint8Array is at least a specified length.
     * Throws an error if the length is less than the specified length.
     */
    static arrayLengthAtLeast(arr, len, message) {
      if (arr.length < len) {
        throw new Error(message != null ? message : `Array length must be at least ${len}`);
      }
    }
  };

  // src/utils/utils.ts
  var Utils = class _Utils {
    /**
     * Converts a given number to its hexadecimal representation.
     */
    static numberToHex(n) {
      const hex = n.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }
    /**
     * Converts a DataView, Uint8Array, or number array to a hexadecimal string with byte separator.
     */
    static bufToHex(buf, separator = " ") {
      const arr = buf instanceof DataView ? this.dataViewToNumberArray(buf) : Array.from(buf);
      return arr.map((n) => _Utils.numberToHex(n)).join(separator);
    }
    /**
     * Converts a hexadecimal string to a Uint8Array buffer.
     */
    static hexToBuf(str) {
      const match = str.match(/[\da-f]{2}/gi);
      if (!match) {
        return new Uint8Array();
      }
      return new Uint8Array(
        match.map((h) => {
          return parseInt(h, 16);
        })
      );
    }
    /**
     * Converts a DataView object to an array of numbers.
     */
    static dataViewToNumberArray(dw) {
      const a = [];
      for (let i = 0; i < dw.byteLength; i++) {
        a.push(dw.getUint8(i));
      }
      return a;
    }
    /**
     * Converts a DataView object to a Uint8Array
     */
    static dataViewToU8Array(dw) {
      return Uint8Array.from(this.dataViewToNumberArray(dw));
    }
    /**
     * Converts a Uint8Array to a string using TextDecoder.
     */
    static u8ArrayToString(arr) {
      return new TextDecoder().decode(arr);
    }
    /**
     * Count `non-zero` bits in the byte array.
     *
     * For `split` mode:
     *
     * Data splitted to the three chunks (last chunk sizes can be lesser, base chunk size is `printhead size / 8 / 3`)
     * and `non-zero` bit count calculated from each chunk.
     *
     * If data size is more than `printheadPixels / 8`, only `total` mode can be used.
     *
     * For `total` mode:
     *
     * Return total number of pixel in little-endian format: `[0, LL, HH]`
     *
     * For `auto` mode:
     *
     * By default `split` mode used. If it is not available, `total` mode used.
     *
     **/
    static countPixelsForBitmapPacket(buf, printheadPixels, mode = "auto") {
      let total = 0;
      const parts = [0, 0, 0];
      const chunkSize = Math.floor(printheadPixels / 8 / 3);
      let split = buf.byteLength <= chunkSize * 3;
      if (mode === "total") {
        split = false;
      } else if (mode === "split") {
        if (buf.byteLength > chunkSize * 3) {
          console.warn(
            `Can't use split mode: buffer size (${buf.byteLength}) is large than chunk size * 3 (${chunkSize * 3}), maybe printheadPixels is set incorrectly`
          );
        } else {
          split = true;
        }
      }
      buf.forEach((value, byteN) => {
        const chunkIdx = Math.floor(byteN / chunkSize);
        for (let bitN = 0; bitN < 8; bitN++) {
          if ((value & 1 << bitN) !== 0) {
            total++;
            if (!split) {
              continue;
            }
            if (chunkIdx > 2) {
              console.warn(`Overflow (chunk index ${chunkIdx})`);
              continue;
            }
            parts[chunkIdx]++;
            if (parts[chunkIdx] > 255) {
              console.warn("Pixel count overflow");
            }
          }
        }
      });
      if (split) {
        return { total, parts };
      }
      const [c, b] = this.u16ToBytes(total);
      return { total, parts: [0, b, c] };
    }
    /**
     * Converts a 16-bit unsigned integer to an array of two bytes (big endian).
     */
    static u16ToBytes(n) {
      const h = n >> 8 & 255;
      const l = n % 256 & 255;
      return [h, l];
    }
    /**
     * Converts a 32-bit unsigned integer to an array of two bytes (big endian).
     */
    static u32ToBytes(n) {
      return [n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255];
    }
    /**
     * Converts a Uint8Array of length 2 to a 16-bit signed integer (big endian).
     */
    static bytesToI16(arr) {
      Validators.arrayLengthEquals(arr, 2);
      return new DataView(arr.buffer).getInt16(0, false);
    }
    /**
     * Converts a Uint8Array of length 2 to a 16-bit unsigned integer (big endian).
     */
    static bytesToU16(arr) {
      Validators.arrayLengthEquals(arr, 2);
      return new DataView(arr.buffer).getUint16(0, false);
    }
    /**
     * Converts a Uint8Array of length 2 to a 16-bit signed integer (big endian).
     */
    static bytesToI32(arr) {
      Validators.arrayLengthEquals(arr, 4);
      return new DataView(arr.buffer).getInt32(0, false);
    }
    /**
     * Converts a Uint8Array of length 2 to a 16-bit unsigned integer (big endian).
     */
    static bytesToU32(arr) {
      Validators.arrayLengthEquals(arr, 4);
      return new DataView(arr.buffer).getUint32(0, false);
    }
    /**
     * 1-based indexing, LSB first
     * input [ 0, 0, 0, 23 ] => output [1, 2, 3, 5]
     */
    static bytesToBitPositions(arr) {
      const result = [];
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        const byte = arr[i];
        if (byte === 0) continue;
        const byteOffset = (len - 1 - i) * 8;
        for (let bit = 0; bit < 8; bit++) {
          if ((byte & 1 << bit) !== 0) {
            result.push(byteOffset + bit + 1);
          }
        }
      }
      return result;
    }
    /**
     * Compares two Uint8Arrays to check if they are equal.
     */
    static u8ArraysEqual(a, b) {
      return a.length === b.length && a.every((el, i) => el === b[i]);
    }
    static u8ArrayAppend(src, data) {
      const newBuf = new Uint8Array(src.length + data.length);
      newBuf.set(src, 0);
      newBuf.set(data, src.length);
      return newBuf;
    }
    /**
     * Asynchronously pauses the execution for the specified amount of time.
     */
    static sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Checks if the browser supports Bluetooth functionality.
     * @deprecated use {@link getAvailableTransports}
     */
    static isBluetoothSupported() {
      var _a;
      return typeof ((_a = navigator.bluetooth) == null ? void 0 : _a.requestDevice) !== "undefined";
    }
    /**
     * Checks if the browser supports the Web Serial API for serial communication.
     * @deprecated use {@link getAvailableTransports}
     */
    static isSerialSupported() {
      var _a;
      return typeof ((_a = navigator.serial) == null ? void 0 : _a.requestPort) !== "undefined";
    }
    /**
     * Checks environment functionality
     */
    static getAvailableTransports() {
      var _a, _b;
      return {
        capacitorBle: Capacitor.getPlatform() !== "web",
        webBluetooth: typeof ((_a = navigator.bluetooth) == null ? void 0 : _a.requestDevice) !== "undefined",
        webSerial: typeof ((_b = navigator.serial) == null ? void 0 : _b.requestPort) !== "undefined"
      };
    }
    /** Find check array has subarray at index */
    static hasSubarrayAtPos(arr, sub, pos) {
      if (pos > arr.length - sub.length) {
        return false;
      }
      for (let i = 0; i < sub.length; i++) {
        if (arr[pos + i] !== sub[i]) {
          return false;
        }
      }
      return true;
    }
    static doUntilTrue(fn, attempts, delay) {
      return __async(this, null, function* () {
        let lastError = new Error("Maximum attempts reached");
        for (let attempt = 0; attempt < attempts; attempt++) {
          try {
            const ok = yield fn();
            if (ok) {
              return;
            }
            yield _Utils.sleep(delay);
          } catch (e) {
            console.warn(`Attempt ${attempt + 1} failed:`, e);
            lastError = e;
          }
        }
        throw lastError;
      });
    }
  };

  // src/utils/image_encoder.ts
  var CanvasImageSource = class _CanvasImageSource {
    constructor(iData, width, height) {
      this.iData = iData;
      this.width = width;
      this.height = height;
    }
    static fromCanvas(canvas) {
      const ctx = canvas.getContext("2d");
      const iData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return new _CanvasImageSource(iData, canvas.width, canvas.height);
    }
    getPixelColor(x, y, printDirection = "left") {
      let idx = y * this.iData.width + x;
      if (printDirection === "left") {
        idx = (this.iData.height - 1 - x) * this.iData.width + y;
      }
      idx *= 4;
      return this.iData.data[idx + 2] | this.iData.data[idx + 1] << 8 | this.iData.data[idx] << 16;
    }
  };
  var ImageEncoder = class _ImageEncoder {
    /** printDirection = "left" rotates image for 90 degrees clockwise */
    static encodeCanvas(canvas, pageColor, printDirection) {
      const imageSource = CanvasImageSource.fromCanvas(canvas);
      return _ImageEncoder.encode(imageSource, pageColor, printDirection);
    }
    static encode(source, pageColor, printDirection) {
      const rowsData = [];
      let originalCols = source.width;
      let rows = source.height;
      if (printDirection === "left") {
        originalCols = source.height;
        rows = source.width;
      }
      const cols = Math.ceil(originalCols / 8) * 8;
      for (let row = 0; row < rows; row++) {
        let isVoid = true;
        let blackPixelsCount = 0;
        let redPixelsCount = 0;
        const blackRowData = new Uint8Array(cols / 8);
        const redRowData = new Uint8Array(cols / 8);
        for (let colOct = 0; colOct < cols / 8; colOct++) {
          let blackPixelsOctet = 0;
          let redPixelsOctet = 0;
          for (let colBit = 0; colBit < 8; colBit++) {
            const col = colOct * 8 + colBit;
            const color = source.getPixelColor(col, row, printDirection);
            if (col >= originalCols) {
              continue;
            }
            if (color === 16711680 && pageColor === 1 /* DoubleColor */) {
              redPixelsOctet |= 1 << 7 - colBit;
              isVoid = false;
              redPixelsCount++;
            } else if (color !== 16777215) {
              blackPixelsOctet |= 1 << 7 - colBit;
              isVoid = false;
              blackPixelsCount++;
            }
          }
          blackRowData[colOct] = blackPixelsOctet;
          redRowData[colOct] = redPixelsOctet;
        }
        const newPart = {
          dataType: isVoid ? "void" : "pixels",
          rowNumber: row,
          repeat: 1,
          rowDataBlack: isVoid ? void 0 : blackRowData,
          rowDataRed: isVoid ? void 0 : redRowData,
          blackPixelsCount,
          redPixelsCount
        };
        if (rowsData.length === 0) {
          rowsData.push(newPart);
        } else {
          const lastPacket = rowsData[rowsData.length - 1];
          let same = newPart.dataType === lastPacket.dataType;
          if (same && newPart.dataType === "pixels") {
            same = Utils.u8ArraysEqual(newPart.rowDataBlack, lastPacket.rowDataBlack) && Utils.u8ArraysEqual(newPart.rowDataRed, lastPacket.rowDataRed);
          }
          if (same) {
            lastPacket.repeat++;
          } else {
            rowsData.push(newPart);
          }
          const sendRowCheck = row % 200 === 199;
          if (sendRowCheck) {
            rowsData.push({
              dataType: "check",
              rowNumber: row,
              repeat: 0,
              blackPixelsCount: 0,
              redPixelsCount: 0
            });
          }
        }
      }
      return { cols, rows, rowsData, pageColor };
    }
    /**
     * @param data Pixels encoded by {@link encodeCanvas} (byte is 8 pixels)
     * @returns Array of indexes where every index stored in two bytes (big endian)
     */
    static indexPixels(data) {
      const result = [];
      for (let bytePos = 0; bytePos < data.byteLength; bytePos++) {
        const b = data[bytePos];
        for (let bitPos = 0; bitPos < 8; bitPos++) {
          if (b & 1 << 7 - bitPos) {
            result.push(...Utils.u16ToBytes(bytePos * 8 + bitPos));
          }
        }
      }
      return new Uint8Array(result);
    }
  };

  // src/packets/packet.ts
  var import_crc_32 = __toESM(require_crc32());
  var _NiimbotPacket = class _NiimbotPacket {
    constructor(command, data, validResponseIds = []) {
      this._command = command;
      this._data = data instanceof Uint8Array ? data : new Uint8Array(data);
      this._validResponseIds = validResponseIds;
      this._oneWay = false;
    }
    /** Data length (header, command, dataLen, checksum, tail are excluded). */
    get dataLength() {
      return this._data.length;
    }
    get length() {
      return _NiimbotPacket.HEAD.length + // head
      1 + // cmd
      1 + // dataLength
      this.dataLength + 1 + // checksum
      _NiimbotPacket.TAIL.length;
    }
    set oneWay(value) {
      this._oneWay = value;
    }
    get oneWay() {
      return this._oneWay;
    }
    get validResponseIds() {
      return this._validResponseIds;
    }
    set validResponseIds(ids) {
      this._validResponseIds = ids;
    }
    get command() {
      return this._command;
    }
    get data() {
      return this._data;
    }
    get checksum() {
      let checksum = 0;
      checksum ^= this._command;
      checksum ^= this._data.length;
      this._data.forEach((i) => checksum ^= i);
      return checksum;
    }
    /** [0x55, 0x55, CMD, DATA_LEN, DA =//= TA, CHECKSUM, 0xAA, 0xAA] */
    toBytes() {
      const buf = new ArrayBuffer(
        _NiimbotPacket.HEAD.length + // head
        1 + // cmd
        1 + // dataLength
        this._data.length + 1 + // checksum
        _NiimbotPacket.TAIL.length
      );
      const arr = new Uint8Array(buf);
      let pos = 0;
      arr.set(_NiimbotPacket.HEAD, pos);
      pos += _NiimbotPacket.HEAD.length;
      arr[pos] = this._command;
      pos += 1;
      arr[pos] = this._data.length;
      pos += 1;
      arr.set(this._data, pos);
      pos += this._data.length;
      arr[pos] = this.checksum;
      pos += 1;
      arr.set(_NiimbotPacket.TAIL, pos);
      if (this._command === 193 /* Connect */) {
        return new Uint8Array([3, ...arr]);
      }
      return arr;
    }
    static fromBytes(buf) {
      const reader = new SequentialDataReader(buf);
      const minPacketSize = _NiimbotPacket.HEAD.length + 1 + // cmd
      1 + // dataLen
      1 + // checksum
      _NiimbotPacket.TAIL.length;
      if (buf.length < minPacketSize) {
        throw new Error(`Packet is too small (${buf.length} < ${minPacketSize})`);
      }
      Validators.u8ArraysEqual(reader.readBytes(_NiimbotPacket.HEAD.length), _NiimbotPacket.HEAD, "Invalid packet head");
      const cmd = reader.readU8();
      const dataLen = reader.readU8();
      if (buf.length !== minPacketSize + dataLen) {
        throw new Error(`Invalid packet size (${buf.length} < ${minPacketSize + dataLen})`);
      }
      const data = reader.readBytes(dataLen);
      const checksum = reader.readU8();
      Validators.u8ArraysEqual(reader.readBytes(_NiimbotPacket.TAIL.length), _NiimbotPacket.TAIL, "Invalid packet tail");
      reader.end();
      const packet = new _NiimbotPacket(cmd, data);
      if (packet.checksum !== checksum) {
        throw new Error(`Invalid packet checksum (${packet.checksum} !== ${checksum})`);
      }
      return packet;
    }
    static fromHex(hex) {
      return _NiimbotPacket.fromBytes(Utils.hexToBuf(hex));
    }
  };
  _NiimbotPacket.HEAD = new Uint8Array([85, 85]);
  _NiimbotPacket.TAIL = new Uint8Array([170, 170]);
  var NiimbotPacket = _NiimbotPacket;
  var NiimbotCrc32Packet = class _NiimbotCrc32Packet extends NiimbotPacket {
    constructor(command, chunkNumber, data, validResponseIds = []) {
      super(command, data, validResponseIds);
      this._chunkNumber = chunkNumber;
    }
    get chunkNumber() {
      return this._chunkNumber;
    }
    /** Calculate CRC checksum from command and data */
    get checksum() {
      const data = [this._command, ...Utils.u16ToBytes(this._chunkNumber), this._data.length, ...this._data];
      return import_crc_32.default.buf(data) >>> 0;
    }
    static fromBytes(buf) {
      const reader = new SequentialDataReader(buf);
      const minPacketSize = NiimbotPacket.HEAD.length + 1 + // cmd
      2 + // chunkNumber
      1 + // dataLen
      4 + // checksum
      NiimbotPacket.TAIL.length;
      if (buf.length < minPacketSize) {
        throw new Error(`Packet is too small (${buf.length} < ${minPacketSize})`);
      }
      Validators.u8ArraysEqual(reader.readBytes(NiimbotPacket.HEAD.length), NiimbotPacket.HEAD, "Invalid packet head");
      const cmd = reader.readU8();
      const chunkNumber = reader.readU16();
      const dataLen = reader.readU8();
      if (buf.length !== minPacketSize + dataLen) {
        throw new Error(`Invalid packet size (${buf.length} < ${minPacketSize + dataLen})`);
      }
      const data = reader.readBytes(dataLen);
      const checksum = reader.readU32();
      Validators.u8ArraysEqual(reader.readBytes(NiimbotPacket.TAIL.length), NiimbotPacket.TAIL, "Invalid packet tail");
      reader.end();
      const packet = new _NiimbotCrc32Packet(cmd, chunkNumber, data);
      if (packet.checksum !== checksum) {
        throw new Error(`Invalid packet checksum (${packet.checksum} !== ${checksum})`);
      }
      return packet;
    }
    /** [0x55, 0x55, CMD, CHUNK_NUMBER, DATA_SIZE, DA =//= TA, CRC32_CHECKSUM, 0xAA, 0xAA] */
    toBytes() {
      const buf = new ArrayBuffer(
        NiimbotPacket.HEAD.length + // head
        1 + // cmd
        2 + // chunkNumber
        1 + // dataLength
        this._data.length + 4 + // checksum
        NiimbotPacket.TAIL.length
      );
      const arr = new Uint8Array(buf);
      let pos = 0;
      arr.set(NiimbotPacket.HEAD, pos);
      pos += NiimbotPacket.HEAD.length;
      arr[pos] = this._command;
      pos += 1;
      const [h, l] = Utils.u16ToBytes(this._chunkNumber);
      arr[pos] = h;
      pos += 1;
      arr[pos] = l;
      pos += 1;
      arr[pos] = this._data.length;
      pos += 1;
      arr.set(this._data, pos);
      pos += this._data.length;
      const crc = this.checksum;
      arr[pos] = crc >> 24 & 255;
      pos += 1;
      arr[pos] = crc >> 16 & 255;
      pos += 1;
      arr[pos] = crc >> 8 & 255;
      pos += 1;
      arr[pos] = crc & 255;
      pos += 1;
      arr.set(NiimbotPacket.TAIL, pos);
      return arr;
    }
    static fromHex(hex) {
      return _NiimbotCrc32Packet.fromBytes(Utils.hexToBuf(hex));
    }
  };

  // src/packets/commands.ts
  var RequestCommandId = /* @__PURE__ */ ((RequestCommandId2) => {
    RequestCommandId2[RequestCommandId2["Invalid"] = -1] = "Invalid";
    RequestCommandId2[RequestCommandId2["Connect"] = 193] = "Connect";
    RequestCommandId2[RequestCommandId2["CancelPrint"] = 218] = "CancelPrint";
    RequestCommandId2[RequestCommandId2["GetPaperInfo"] = 89] = "GetPaperInfo";
    RequestCommandId2[RequestCommandId2["Heartbeat"] = 220] = "Heartbeat";
    RequestCommandId2[RequestCommandId2["LabelPositioningCalibration"] = 142] = "LabelPositioningCalibration";
    RequestCommandId2[RequestCommandId2["PageEnd"] = 227] = "PageEnd";
    RequestCommandId2[RequestCommandId2["PrinterLog"] = 5] = "PrinterLog";
    RequestCommandId2[RequestCommandId2["PageStart"] = 3] = "PageStart";
    RequestCommandId2[RequestCommandId2["PrintBitmapRow"] = 133] = "PrintBitmapRow";
    RequestCommandId2[RequestCommandId2["PrintBitmapRowIndexed"] = 131] = "PrintBitmapRowIndexed";
    RequestCommandId2[RequestCommandId2["PrintClear"] = 32] = "PrintClear";
    RequestCommandId2[RequestCommandId2["PrintEmptyRow"] = 132] = "PrintEmptyRow";
    RequestCommandId2[RequestCommandId2["PrintEnd"] = 243] = "PrintEnd";
    RequestCommandId2[RequestCommandId2["PrinterInfo"] = 64] = "PrinterInfo";
    RequestCommandId2[RequestCommandId2["GetPrinterCapabilities"] = 175] = "GetPrinterCapabilities";
    RequestCommandId2[RequestCommandId2["PrinterStatusData"] = 165] = "PrinterStatusData";
    RequestCommandId2[RequestCommandId2["PrinterReset"] = 40] = "PrinterReset";
    RequestCommandId2[RequestCommandId2["PrintQuantity"] = 21] = "PrintQuantity";
    RequestCommandId2[RequestCommandId2["PrintStart"] = 1] = "PrintStart";
    RequestCommandId2[RequestCommandId2["PrintStatus"] = 163] = "PrintStatus";
    RequestCommandId2[RequestCommandId2["RfidInfo"] = 26] = "RfidInfo";
    RequestCommandId2[RequestCommandId2["RfidInfo2"] = 28] = "RfidInfo2";
    RequestCommandId2[RequestCommandId2["RfidSuccessTimes"] = 84] = "RfidSuccessTimes";
    RequestCommandId2[RequestCommandId2["SetAutoShutdownTime"] = 39] = "SetAutoShutdownTime";
    RequestCommandId2[RequestCommandId2["SetDensity"] = 33] = "SetDensity";
    RequestCommandId2[RequestCommandId2["SetPrintSpeed"] = 34] = "SetPrintSpeed";
    RequestCommandId2[RequestCommandId2["SetLabelType"] = 35] = "SetLabelType";
    RequestCommandId2[RequestCommandId2["SetLanguageType"] = 38] = "SetLanguageType";
    RequestCommandId2[RequestCommandId2["SetVolumeLevel"] = 46] = "SetVolumeLevel";
    RequestCommandId2[RequestCommandId2["SetAntiSetter"] = 47] = "SetAntiSetter";
    RequestCommandId2[RequestCommandId2["SetPageSize"] = 19] = "SetPageSize";
    RequestCommandId2[RequestCommandId2["SetReversePrinterFeedOrMarginTop"] = 30] = "SetReversePrinterFeedOrMarginTop";
    RequestCommandId2[RequestCommandId2["SoundSettings"] = 88] = "SoundSettings";
    RequestCommandId2[RequestCommandId2["AntiFake"] = 11] = "AntiFake";
    RequestCommandId2[RequestCommandId2["GetVolumeLevel"] = 112] = "GetVolumeLevel";
    RequestCommandId2[RequestCommandId2["PrintTestPage"] = 90] = "PrintTestPage";
    RequestCommandId2[RequestCommandId2["StartFirmwareUpgrade"] = 245] = "StartFirmwareUpgrade";
    RequestCommandId2[RequestCommandId2["FirmwareCrc"] = 145] = "FirmwareCrc";
    RequestCommandId2[RequestCommandId2["FirmwareCommit"] = 146] = "FirmwareCommit";
    RequestCommandId2[RequestCommandId2["FirmwareChunk"] = 155] = "FirmwareChunk";
    RequestCommandId2[RequestCommandId2["FirmwareNoMoreChunks"] = 156] = "FirmwareNoMoreChunks";
    RequestCommandId2[RequestCommandId2["PrinterCheckLine"] = 134] = "PrinterCheckLine";
    RequestCommandId2[RequestCommandId2["SetCurrentTimeFormat"] = 17] = "SetCurrentTimeFormat";
    RequestCommandId2[RequestCommandId2["GetCurrentTimeFormatOrTemplateInfo"] = 18] = "GetCurrentTimeFormatOrTemplateInfo";
    RequestCommandId2[RequestCommandId2["PrinterConfig2"] = 7] = "PrinterConfig2";
    RequestCommandId2[RequestCommandId2["GetKeyFunction"] = 9] = "GetKeyFunction";
    RequestCommandId2[RequestCommandId2["GetPrintQuality"] = 13] = "GetPrintQuality";
    RequestCommandId2[RequestCommandId2["GetPrinterConfigurationWifi"] = 162] = "GetPrinterConfigurationWifi";
    RequestCommandId2[RequestCommandId2["TubeTypeAndWidth"] = 15] = "TubeTypeAndWidth";
    RequestCommandId2[RequestCommandId2["HalfCut"] = 92] = "HalfCut";
    RequestCommandId2[RequestCommandId2["GetPrinterUsage"] = 25] = "GetPrinterUsage";
    RequestCommandId2[RequestCommandId2["GetTemplateHistory"] = 23] = "GetTemplateHistory";
    RequestCommandId2[RequestCommandId2["GetCompress"] = 137] = "GetCompress";
    RequestCommandId2[RequestCommandId2["GetPrinterFree"] = 195] = "GetPrinterFree";
    RequestCommandId2[RequestCommandId2["PrintBitmapRowDoubleColor"] = 138] = "PrintBitmapRowDoubleColor";
    RequestCommandId2[RequestCommandId2["SetLabelMaterial"] = 45] = "SetLabelMaterial";
    RequestCommandId2[RequestCommandId2["TubeSettings"] = 14] = "TubeSettings";
    RequestCommandId2[RequestCommandId2["Pause"] = 166] = "Pause";
    return RequestCommandId2;
  })(RequestCommandId || {});
  var ResponseCommandId2 = /* @__PURE__ */ ((ResponseCommandId3) => {
    ResponseCommandId3[ResponseCommandId3["In_Invalid"] = -1] = "In_Invalid";
    ResponseCommandId3[ResponseCommandId3["In_NotSupported"] = 0] = "In_NotSupported";
    ResponseCommandId3[ResponseCommandId3["In_Connect"] = 194] = "In_Connect";
    ResponseCommandId3[ResponseCommandId3["In_GetPaperInfo"] = 105] = "In_GetPaperInfo";
    ResponseCommandId3[ResponseCommandId3["In_CancelPrint"] = 208] = "In_CancelPrint";
    ResponseCommandId3[ResponseCommandId3["In_AntiFake"] = 12] = "In_AntiFake";
    ResponseCommandId3[ResponseCommandId3["In_HeartbeatAdvanced1"] = 221] = "In_HeartbeatAdvanced1";
    ResponseCommandId3[ResponseCommandId3["In_HeartbeatBasic"] = 222] = "In_HeartbeatBasic";
    ResponseCommandId3[ResponseCommandId3["In_HeartbeatPrinterInfo"] = 223] = "In_HeartbeatPrinterInfo";
    ResponseCommandId3[ResponseCommandId3["In_HeartbeatAdvanced2"] = 217] = "In_HeartbeatAdvanced2";
    ResponseCommandId3[ResponseCommandId3["In_LabelPositioningCalibration"] = 143] = "In_LabelPositioningCalibration";
    ResponseCommandId3[ResponseCommandId3["In_PageStart"] = 4] = "In_PageStart";
    ResponseCommandId3[ResponseCommandId3["In_PrintClear"] = 48] = "In_PrintClear";
    ResponseCommandId3[ResponseCommandId3["In_PrinterCheckLine"] = 211] = "In_PrinterCheckLine";
    ResponseCommandId3[ResponseCommandId3["In_PrintEnd"] = 244] = "In_PrintEnd";
    ResponseCommandId3[ResponseCommandId3["In_GetPrinterCapabilities"] = 191] = "In_GetPrinterCapabilities";
    ResponseCommandId3[ResponseCommandId3["In_PrinterLog"] = 6] = "In_PrinterLog";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoAutoShutDownTime"] = 71] = "In_PrinterInfoAutoShutDownTime";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoBluetoothAddress"] = 77] = "In_PrinterInfoBluetoothAddress";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSpeed"] = 66] = "In_PrinterInfoSpeed";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoDensity"] = 65] = "In_PrinterInfoDensity";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoLanguage"] = 70] = "In_PrinterInfoLanguage";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoChargeLevel"] = 74] = "In_PrinterInfoChargeLevel";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoHardWareVersion"] = 76] = "In_PrinterInfoHardWareVersion";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoLabelType"] = 67] = "In_PrinterInfoLabelType";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoPrinterCode"] = 72] = "In_PrinterInfoPrinterCode";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSerialNumber"] = 75] = "In_PrinterInfoSerialNumber";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoSoftWareVersion"] = 73] = "In_PrinterInfoSoftWareVersion";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoPrintMode"] = 78] = "In_PrinterInfoPrintMode";
    ResponseCommandId3[ResponseCommandId3["In_PrinterInfoArea"] = 79] = "In_PrinterInfoArea";
    ResponseCommandId3[ResponseCommandId3["In_PrinterStatusData"] = 181] = "In_PrinterStatusData";
    ResponseCommandId3[ResponseCommandId3["In_PrinterReset"] = 56] = "In_PrinterReset";
    ResponseCommandId3[ResponseCommandId3["In_PrintStatus"] = 179] = "In_PrintStatus";
    ResponseCommandId3[ResponseCommandId3["In_PrintError"] = 219] = "In_PrintError";
    ResponseCommandId3[ResponseCommandId3["In_PrintQuantity"] = 22] = "In_PrintQuantity";
    ResponseCommandId3[ResponseCommandId3["In_PrintStart"] = 2] = "In_PrintStart";
    ResponseCommandId3[ResponseCommandId3["In_RfidInfo"] = 27] = "In_RfidInfo";
    ResponseCommandId3[ResponseCommandId3["In_RfidInfo2"] = 29] = "In_RfidInfo2";
    ResponseCommandId3[ResponseCommandId3["In_RfidSuccessTimes"] = 100] = "In_RfidSuccessTimes";
    ResponseCommandId3[ResponseCommandId3["In_SetAutoShutdownTime"] = 55] = "In_SetAutoShutdownTime";
    ResponseCommandId3[ResponseCommandId3["In_SetDensity"] = 49] = "In_SetDensity";
    ResponseCommandId3[ResponseCommandId3["In_SetPrintSpeed"] = 50] = "In_SetPrintSpeed";
    ResponseCommandId3[ResponseCommandId3["In_SetLabelType"] = 51] = "In_SetLabelType";
    ResponseCommandId3[ResponseCommandId3["In_SetLanguageType"] = 54] = "In_SetLanguageType";
    ResponseCommandId3[ResponseCommandId3["In_SetVolumeLevel"] = 62] = "In_SetVolumeLevel";
    ResponseCommandId3[ResponseCommandId3["In_SetAntiSetter"] = 63] = "In_SetAntiSetter";
    ResponseCommandId3[ResponseCommandId3["In_SetPageSize"] = 20] = "In_SetPageSize";
    ResponseCommandId3[ResponseCommandId3["In_PrintMarginTop"] = 31] = "In_PrintMarginTop";
    ResponseCommandId3[ResponseCommandId3["In_SetReversePrinterFeed"] = 30] = "In_SetReversePrinterFeed";
    ResponseCommandId3[ResponseCommandId3["In_SoundSettings"] = 104] = "In_SoundSettings";
    ResponseCommandId3[ResponseCommandId3["In_PageEnd"] = 228] = "In_PageEnd";
    ResponseCommandId3[ResponseCommandId3["In_PrinterPageIndex"] = 224] = "In_PrinterPageIndex";
    ResponseCommandId3[ResponseCommandId3["In_PrintTestPage"] = 106] = "In_PrintTestPage";
    ResponseCommandId3[ResponseCommandId3["In_GetVolumeLevel"] = 113] = "In_GetVolumeLevel";
    ResponseCommandId3[ResponseCommandId3["In_StartFirmwareUpgrade"] = 246] = "In_StartFirmwareUpgrade";
    ResponseCommandId3[ResponseCommandId3["In_RequestFirmwareCrc"] = 144] = "In_RequestFirmwareCrc";
    ResponseCommandId3[ResponseCommandId3["In_RequestFirmwareChunk"] = 154] = "In_RequestFirmwareChunk";
    ResponseCommandId3[ResponseCommandId3["In_FirmwareCheckResult"] = 157] = "In_FirmwareCheckResult";
    ResponseCommandId3[ResponseCommandId3["In_FirmwareResult"] = 158] = "In_FirmwareResult";
    ResponseCommandId3[ResponseCommandId3["In_ResetTimeout"] = 198] = "In_ResetTimeout";
    ResponseCommandId3[ResponseCommandId3["In_SetCurrentTimeFormat"] = 17] = "In_SetCurrentTimeFormat";
    ResponseCommandId3[ResponseCommandId3["In_GetCurrentTimeFormatOrTemplateInfo"] = 18] = "In_GetCurrentTimeFormatOrTemplateInfo";
    ResponseCommandId3[ResponseCommandId3["In_PrinterConfig2"] = 8] = "In_PrinterConfig2";
    ResponseCommandId3[ResponseCommandId3["In_GetKeyFunction"] = 10] = "In_GetKeyFunction";
    ResponseCommandId3[ResponseCommandId3["In_GetPrintQuality"] = 13] = "In_GetPrintQuality";
    ResponseCommandId3[ResponseCommandId3["In_GetPrinterConfigurationWifi"] = 178] = "In_GetPrinterConfigurationWifi";
    ResponseCommandId3[ResponseCommandId3["In_TubeTypeAndWidth"] = 15] = "In_TubeTypeAndWidth";
    ResponseCommandId3[ResponseCommandId3["In_HalfCut"] = 108] = "In_HalfCut";
    ResponseCommandId3[ResponseCommandId3["In_GetPrinterUsage"] = 25] = "In_GetPrinterUsage";
    ResponseCommandId3[ResponseCommandId3["In_GetTemplateHistory"] = 23] = "In_GetTemplateHistory";
    ResponseCommandId3[ResponseCommandId3["In_GetCompress"] = 136] = "In_GetCompress";
    ResponseCommandId3[ResponseCommandId3["In_GetPrinterFree"] = 196] = "In_GetPrinterFree";
    ResponseCommandId3[ResponseCommandId3["In_SetLabelMaterial"] = 61] = "In_SetLabelMaterial";
    ResponseCommandId3[ResponseCommandId3["In_TubeSettings"] = 14] = "In_TubeSettings";
    ResponseCommandId3[ResponseCommandId3["In_Pause"] = 182] = "In_Pause";
    return ResponseCommandId3;
  })(ResponseCommandId2 || {});
  var TX = RequestCommandId;
  var RX = ResponseCommandId2;
  var commandsMap = {
    [TX.Invalid]: null,
    [TX.PrintBitmapRow]: null,
    [TX.PrintBitmapRowIndexed]: null,
    [TX.PrintEmptyRow]: null,
    [TX.PrintBitmapRowDoubleColor]: null,
    [TX.Connect]: [RX.In_Connect],
    [TX.CancelPrint]: [RX.In_CancelPrint],
    [TX.GetPaperInfo]: [RX.In_GetPaperInfo],
    [TX.Heartbeat]: [RX.In_HeartbeatBasic, RX.In_HeartbeatPrinterInfo, RX.In_HeartbeatAdvanced1, RX.In_HeartbeatAdvanced2],
    [TX.LabelPositioningCalibration]: [RX.In_LabelPositioningCalibration],
    [TX.PageEnd]: [RX.In_PageEnd],
    [TX.PrinterLog]: [RX.In_PrinterLog],
    [TX.PageStart]: [RX.In_PageStart],
    [TX.PrintClear]: [RX.In_PrintClear],
    [TX.PrintEnd]: [RX.In_PrintEnd],
    [TX.PrinterInfo]: [
      RX.In_PrinterInfoArea,
      RX.In_PrinterInfoAutoShutDownTime,
      RX.In_PrinterInfoBluetoothAddress,
      RX.In_PrinterInfoChargeLevel,
      RX.In_PrinterInfoDensity,
      RX.In_PrinterInfoHardWareVersion,
      RX.In_PrinterInfoLabelType,
      RX.In_PrinterInfoLanguage,
      RX.In_PrinterInfoPrinterCode,
      RX.In_PrinterInfoSerialNumber,
      RX.In_PrinterInfoSoftWareVersion,
      RX.In_PrinterInfoSpeed,
      RX.In_PrinterInfoPrintMode
    ],
    [TX.GetPrinterCapabilities]: [RX.In_GetPrinterCapabilities],
    [TX.PrinterStatusData]: [RX.In_PrinterStatusData],
    [TX.PrinterReset]: [RX.In_PrinterReset],
    [TX.PrintQuantity]: [RX.In_PrintQuantity],
    [TX.PrintStart]: [RX.In_PrintStart],
    [TX.PrintStatus]: [RX.In_PrintStatus],
    [TX.RfidInfo]: [RX.In_RfidInfo],
    [TX.RfidInfo2]: [RX.In_RfidInfo2],
    [TX.RfidSuccessTimes]: [RX.In_RfidSuccessTimes],
    [TX.SetAutoShutdownTime]: [RX.In_SetAutoShutdownTime],
    [TX.SetDensity]: [RX.In_SetDensity],
    [TX.SetPrintSpeed]: [RX.In_SetPrintSpeed],
    [TX.SetLabelType]: [RX.In_SetLabelType],
    [TX.SetLanguageType]: [RX.In_SetLanguageType],
    [TX.SetVolumeLevel]: [RX.In_SetVolumeLevel],
    [TX.SetAntiSetter]: [RX.In_SetAntiSetter],
    [TX.SetPageSize]: [RX.In_SetPageSize],
    [TX.SetReversePrinterFeedOrMarginTop]: [RX.In_SetReversePrinterFeed, RX.In_PrintMarginTop],
    [TX.SoundSettings]: [RX.In_SoundSettings],
    [TX.AntiFake]: [RX.In_AntiFake],
    [TX.GetVolumeLevel]: [RX.In_GetVolumeLevel],
    [TX.PrintTestPage]: [RX.In_PrintTestPage],
    [TX.StartFirmwareUpgrade]: [RX.In_StartFirmwareUpgrade],
    [TX.FirmwareCrc]: null,
    [TX.FirmwareChunk]: null,
    [TX.FirmwareNoMoreChunks]: null,
    [TX.FirmwareCommit]: null,
    [TX.PrinterCheckLine]: [RX.In_PrinterCheckLine],
    [TX.SetCurrentTimeFormat]: [RX.In_SetCurrentTimeFormat],
    [TX.GetCurrentTimeFormatOrTemplateInfo]: [RX.In_GetCurrentTimeFormatOrTemplateInfo],
    [TX.PrinterConfig2]: [RX.In_PrinterConfig2],
    [TX.GetKeyFunction]: [RX.In_GetKeyFunction],
    [TX.GetPrintQuality]: [RX.In_GetPrintQuality],
    [TX.GetPrinterConfigurationWifi]: [RX.In_GetPrinterConfigurationWifi],
    [TX.TubeTypeAndWidth]: [RX.In_TubeTypeAndWidth],
    [TX.HalfCut]: [RX.In_HalfCut],
    [TX.GetPrinterUsage]: [RX.In_GetPrinterUsage],
    [TX.GetTemplateHistory]: [RX.In_GetTemplateHistory],
    [TX.GetCompress]: [RX.In_GetCompress],
    [TX.GetPrinterFree]: [RX.In_GetPrinterFree],
    [TX.SetLabelMaterial]: [RX.In_SetLabelMaterial],
    [TX.TubeSettings]: [RX.In_TubeSettings],
    [TX.Pause]: [RX.In_Pause]
  };
  var firmwareExchangePackets = {
    tx: [TX.FirmwareChunk, TX.FirmwareCrc, TX.FirmwareNoMoreChunks, TX.FirmwareCommit],
    rx: [RX.In_RequestFirmwareCrc, RX.In_RequestFirmwareChunk, RX.In_FirmwareCheckResult, RX.In_FirmwareResult]
  };

  // src/packets/enumerations.ts
  var PrinterInfoType = /* @__PURE__ */ ((PrinterInfoType3) => {
    PrinterInfoType3[PrinterInfoType3["Density"] = 1] = "Density";
    PrinterInfoType3[PrinterInfoType3["Speed"] = 2] = "Speed";
    PrinterInfoType3[PrinterInfoType3["LabelType"] = 3] = "LabelType";
    PrinterInfoType3[PrinterInfoType3["Language"] = 6] = "Language";
    PrinterInfoType3[PrinterInfoType3["AutoShutdownTime"] = 7] = "AutoShutdownTime";
    PrinterInfoType3[PrinterInfoType3["PrinterModelId"] = 8] = "PrinterModelId";
    PrinterInfoType3[PrinterInfoType3["SoftWareVersion"] = 9] = "SoftWareVersion";
    PrinterInfoType3[PrinterInfoType3["BatteryChargeLevel"] = 10] = "BatteryChargeLevel";
    PrinterInfoType3[PrinterInfoType3["SerialNumber"] = 11] = "SerialNumber";
    PrinterInfoType3[PrinterInfoType3["HardWareVersion"] = 12] = "HardWareVersion";
    PrinterInfoType3[PrinterInfoType3["BluetoothAddress"] = 13] = "BluetoothAddress";
    PrinterInfoType3[PrinterInfoType3["PrintMode"] = 14] = "PrintMode";
    PrinterInfoType3[PrinterInfoType3["Area"] = 15] = "Area";
    return PrinterInfoType3;
  })(PrinterInfoType || {});
  var PrinterConfig2Type = /* @__PURE__ */ ((PrinterConfig2Type2) => {
    PrinterConfig2Type2[PrinterConfig2Type2["Time"] = 8] = "Time";
    return PrinterConfig2Type2;
  })(PrinterConfig2Type || {});
  var PrinterConfig2Action = /* @__PURE__ */ ((PrinterConfig2Action2) => {
    PrinterConfig2Action2[PrinterConfig2Action2["SetValue"] = 1] = "SetValue";
    PrinterConfig2Action2[PrinterConfig2Action2["GetValue"] = 2] = "GetValue";
    return PrinterConfig2Action2;
  })(PrinterConfig2Action || {});
  var SoundSettingsType = /* @__PURE__ */ ((SoundSettingsType2) => {
    SoundSettingsType2[SoundSettingsType2["SetSound"] = 1] = "SetSound";
    SoundSettingsType2[SoundSettingsType2["GetSoundState"] = 2] = "GetSoundState";
    return SoundSettingsType2;
  })(SoundSettingsType || {});
  var SoundSettingsItemType = /* @__PURE__ */ ((SoundSettingsItemType4) => {
    SoundSettingsItemType4[SoundSettingsItemType4["BluetoothConnectionSound"] = 1] = "BluetoothConnectionSound";
    SoundSettingsItemType4[SoundSettingsItemType4["PowerSound"] = 2] = "PowerSound";
    return SoundSettingsItemType4;
  })(SoundSettingsItemType || {});
  var LabelType = /* @__PURE__ */ ((LabelType3) => {
    LabelType3[LabelType3["Invalid"] = 0] = "Invalid";
    LabelType3[LabelType3["WithGaps"] = 1] = "WithGaps";
    LabelType3[LabelType3["Black"] = 2] = "Black";
    LabelType3[LabelType3["Continuous"] = 3] = "Continuous";
    LabelType3[LabelType3["Perforated"] = 4] = "Perforated";
    LabelType3[LabelType3["Transparent"] = 5] = "Transparent";
    LabelType3[LabelType3["PvcTag"] = 6] = "PvcTag";
    LabelType3[LabelType3["BlackMarkGap"] = 10] = "BlackMarkGap";
    LabelType3[LabelType3["HeatShrinkTube"] = 11] = "HeatShrinkTube";
    return LabelType3;
  })(LabelType || {});
  var HeartbeatType = /* @__PURE__ */ ((HeartbeatType3) => {
    HeartbeatType3[HeartbeatType3["Advanced1"] = 1] = "Advanced1";
    HeartbeatType3[HeartbeatType3["Basic"] = 2] = "Basic";
    HeartbeatType3[HeartbeatType3["PrinterInfo"] = 3] = "PrinterInfo";
    HeartbeatType3[HeartbeatType3["Advanced2"] = 4] = "Advanced2";
    return HeartbeatType3;
  })(HeartbeatType || {});
  var AutoShutdownTime = /* @__PURE__ */ ((AutoShutdownTime4) => {
    AutoShutdownTime4[AutoShutdownTime4["ShutdownTime1"] = 1] = "ShutdownTime1";
    AutoShutdownTime4[AutoShutdownTime4["ShutdownTime2"] = 2] = "ShutdownTime2";
    AutoShutdownTime4[AutoShutdownTime4["ShutdownTime3"] = 3] = "ShutdownTime3";
    AutoShutdownTime4[AutoShutdownTime4["ShutdownTime4"] = 4] = "ShutdownTime4";
    return AutoShutdownTime4;
  })(AutoShutdownTime || {});
  var ConnectResult = /* @__PURE__ */ ((ConnectResult4) => {
    ConnectResult4[ConnectResult4["Disconnect"] = 0] = "Disconnect";
    ConnectResult4[ConnectResult4["Connected"] = 1] = "Connected";
    ConnectResult4[ConnectResult4["ConnectedNew"] = 2] = "ConnectedNew";
    ConnectResult4[ConnectResult4["ConnectedV3"] = 3] = "ConnectedV3";
    ConnectResult4[ConnectResult4["FirmwareErrors"] = 90] = "FirmwareErrors";
    return ConnectResult4;
  })(ConnectResult || {});
  var PrinterErrorCode = /* @__PURE__ */ ((PrinterErrorCode2) => {
    PrinterErrorCode2[PrinterErrorCode2["CoverOpen"] = 1] = "CoverOpen";
    PrinterErrorCode2[PrinterErrorCode2["LackPaper"] = 2] = "LackPaper";
    PrinterErrorCode2[PrinterErrorCode2["LowBattery"] = 3] = "LowBattery";
    PrinterErrorCode2[PrinterErrorCode2["BatteryException"] = 4] = "BatteryException";
    PrinterErrorCode2[PrinterErrorCode2["UserCancel"] = 5] = "UserCancel";
    PrinterErrorCode2[PrinterErrorCode2["DataError"] = 6] = "DataError";
    PrinterErrorCode2[PrinterErrorCode2["Overheat"] = 7] = "Overheat";
    PrinterErrorCode2[PrinterErrorCode2["PaperOutException"] = 8] = "PaperOutException";
    PrinterErrorCode2[PrinterErrorCode2["PrinterBusy"] = 9] = "PrinterBusy";
    PrinterErrorCode2[PrinterErrorCode2["NoPrinterHead"] = 10] = "NoPrinterHead";
    PrinterErrorCode2[PrinterErrorCode2["TemperatureLow"] = 11] = "TemperatureLow";
    PrinterErrorCode2[PrinterErrorCode2["PrinterHeadLoose"] = 12] = "PrinterHeadLoose";
    PrinterErrorCode2[PrinterErrorCode2["NoRibbon"] = 13] = "NoRibbon";
    PrinterErrorCode2[PrinterErrorCode2["WrongRibbon"] = 14] = "WrongRibbon";
    PrinterErrorCode2[PrinterErrorCode2["UsedRibbon"] = 15] = "UsedRibbon";
    PrinterErrorCode2[PrinterErrorCode2["WrongPaper"] = 16] = "WrongPaper";
    PrinterErrorCode2[PrinterErrorCode2["SetPaperFail"] = 17] = "SetPaperFail";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintModeFail"] = 18] = "SetPrintModeFail";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintDensityFail"] = 19] = "SetPrintDensityFail";
    PrinterErrorCode2[PrinterErrorCode2["WriteRfidFail"] = 20] = "WriteRfidFail";
    PrinterErrorCode2[PrinterErrorCode2["SetMarginFail"] = 21] = "SetMarginFail";
    PrinterErrorCode2[PrinterErrorCode2["CommunicationException"] = 22] = "CommunicationException";
    PrinterErrorCode2[PrinterErrorCode2["Disconnect"] = 23] = "Disconnect";
    PrinterErrorCode2[PrinterErrorCode2["CanvasParameterError"] = 24] = "CanvasParameterError";
    PrinterErrorCode2[PrinterErrorCode2["RotationParameterException"] = 25] = "RotationParameterException";
    PrinterErrorCode2[PrinterErrorCode2["JsonParameterException"] = 26] = "JsonParameterException";
    PrinterErrorCode2[PrinterErrorCode2["B3sAbnormalPaperOutput"] = 27] = "B3sAbnormalPaperOutput";
    PrinterErrorCode2[PrinterErrorCode2["ECheckPaper"] = 28] = "ECheckPaper";
    PrinterErrorCode2[PrinterErrorCode2["RfidTagNotWritten"] = 29] = "RfidTagNotWritten";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintDensityNoSupport"] = 30] = "SetPrintDensityNoSupport";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintModeNoSupport"] = 31] = "SetPrintModeNoSupport";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintLabelMaterialError"] = 32] = "SetPrintLabelMaterialError";
    PrinterErrorCode2[PrinterErrorCode2["SetPrintLabelMaterialNoSupport"] = 33] = "SetPrintLabelMaterialNoSupport";
    PrinterErrorCode2[PrinterErrorCode2["NotSupportWrittenRfid"] = 34] = "NotSupportWrittenRfid";
    PrinterErrorCode2[PrinterErrorCode2["IllegalPage"] = 50] = "IllegalPage";
    PrinterErrorCode2[PrinterErrorCode2["IllegalRibbonPage"] = 51] = "IllegalRibbonPage";
    PrinterErrorCode2[PrinterErrorCode2["ReceiveDataTimeout"] = 52] = "ReceiveDataTimeout";
    PrinterErrorCode2[PrinterErrorCode2["NonDedicatedRibbon"] = 53] = "NonDedicatedRibbon";
    return PrinterErrorCode2;
  })(PrinterErrorCode || {});
  var PageColorType = /* @__PURE__ */ ((PageColorType2) => {
    PageColorType2[PageColorType2["SingleColor"] = 0] = "SingleColor";
    PageColorType2[PageColorType2["DoubleColor"] = 1] = "DoubleColor";
    PageColorType2[PageColorType2["SingleColorAlt"] = 2] = "SingleColorAlt";
    PageColorType2[PageColorType2["MultiorderColor"] = 3] = "MultiorderColor";
    return PageColorType2;
  })(PageColorType || {});
  var BitmapColorMode = /* @__PURE__ */ ((BitmapColorMode2) => {
    BitmapColorMode2[BitmapColorMode2["Empty"] = 0] = "Empty";
    BitmapColorMode2[BitmapColorMode2["Red"] = 1] = "Red";
    BitmapColorMode2[BitmapColorMode2["Black"] = 2] = "Black";
    BitmapColorMode2[BitmapColorMode2["Mixed"] = 3] = "Mixed";
    return BitmapColorMode2;
  })(BitmapColorMode || {});
  var ResolutionClass = /* @__PURE__ */ ((ResolutionClass2) => {
    ResolutionClass2[ResolutionClass2["DPI203"] = 2] = "DPI203";
    ResolutionClass2[ResolutionClass2["DPI300"] = 3] = "DPI300";
    return ResolutionClass2;
  })(ResolutionClass || {});
  var PrinterCapabilitiesField = /* @__PURE__ */ ((PrinterCapabilitiesField2) => {
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["Language"] = 1] = "Language";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintMode"] = 2] = "PrintMode";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["UhfRfid"] = 3] = "UhfRfid";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintheadDpi"] = 4] = "PrintheadDpi";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["RfidSupport"] = 5] = "RfidSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["BatteryRange"] = 6] = "BatteryRange";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["DensityRange"] = 7] = "DensityRange";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["SpeedRange"] = 8] = "SpeedRange";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["SupportedLabelTypes"] = 9] = "SupportedLabelTypes";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintheadWidth"] = 10] = "PrintheadWidth";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["MaxPrintHeight"] = 11] = "MaxPrintHeight";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["LabelHeightAndGap"] = 12] = "LabelHeightAndGap";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintheadPosition"] = 13] = "PrintheadPosition";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["VolumeSupport"] = 14] = "VolumeSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["HostStyle"] = 15] = "HostStyle";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintProtocol"] = 16] = "PrintProtocol";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["AutoShutdownRange"] = 17] = "AutoShutdownRange";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["CutterSupport"] = 18] = "CutterSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["CutterDepthRange"] = 19] = "CutterDepthRange";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintControl"] = 20] = "PrintControl";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PauseTimeSupport"] = 21] = "PauseTimeSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PaperDetection"] = 22] = "PaperDetection";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["RealTimeClock"] = 23] = "RealTimeClock";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["KeyFunctions"] = 24] = "KeyFunctions";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["Unknown19"] = 25] = "Unknown19";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PrintColor"] = 26] = "PrintColor";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["SpeedQualityMode"] = 27] = "SpeedQualityMode";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["TubeCalibration"] = 28] = "TubeCalibration";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["PartialRetransmitSupport"] = 29] = "PartialRetransmitSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["MaxCompressLines"] = 30] = "MaxCompressLines";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["TubeSupport"] = 31] = "TubeSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["SixteenGrayMaxBuffer"] = 32] = "SixteenGrayMaxBuffer";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["LocalTemplateSupport"] = 33] = "LocalTemplateSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["ImageCompressSupport"] = 34] = "ImageCompressSupport";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["MaxImageCompressBytes"] = 35] = "MaxImageCompressBytes";
    PrinterCapabilitiesField2[PrinterCapabilitiesField2["LocalTemplateMaxTimeCount"] = 36] = "LocalTemplateMaxTimeCount";
    return PrinterCapabilitiesField2;
  })(PrinterCapabilitiesField || {});

  // src/packets/packet_generator.ts
  var PacketGenerator = class {
    /**
     * Maps a request command ID to its corresponding response IDs and creates a packet object.
     * Sends `0x01` as payload by default.
     */
    static mapped(sendCmd, data = [1]) {
      const respIds = commandsMap[sendCmd];
      if (respIds === null) {
        const p = new NiimbotPacket(sendCmd, data);
        p.oneWay = true;
        return p;
      }
      return new NiimbotPacket(sendCmd, data, respIds);
    }
    static connect() {
      return this.mapped(193 /* Connect */);
    }
    static getPrinterStatusData() {
      return this.mapped(165 /* PrinterStatusData */);
    }
    static rfidInfo() {
      return this.mapped(26 /* RfidInfo */);
    }
    static rfidInfo2() {
      return this.mapped(28 /* RfidInfo2 */);
    }
    static antiFake(queryType) {
      return this.mapped(11 /* AntiFake */, [queryType]);
    }
    static setAutoShutDownTime(time) {
      return this.mapped(39 /* SetAutoShutdownTime */, [time]);
    }
    static getPrinterInfo(type) {
      return this.mapped(64 /* PrinterInfo */, [type]);
    }
    static setSoundSettings(soundType, on) {
      return this.mapped(88 /* SoundSettings */, [1 /* SetSound */, soundType, on ? 1 : 0]);
    }
    static getSoundSettings(soundType) {
      return this.mapped(88 /* SoundSettings */, [2 /* GetSoundState */, soundType, 1]);
    }
    static heartbeat(type) {
      return this.mapped(220 /* Heartbeat */, [type]);
    }
    static setDensity(value) {
      return this.mapped(33 /* SetDensity */, [value]);
    }
    static setLabelType(value) {
      return this.mapped(35 /* SetLabelType */, [value]);
    }
    static setPageSize2b(rows) {
      return this.mapped(19 /* SetPageSize */, [...Utils.u16ToBytes(rows)]);
    }
    /**
     * B1 behavior: strange, first print is blank or printer prints many copies (use {@link setPageSize6b} instead)
     *
     * D110 behavior: ordinary.
     *
     * @param rows Height in pixels
     * @param cols Width in pixels
     */
    static setPageSize4b(rows, cols) {
      return this.mapped(19 /* SetPageSize */, [...Utils.u16ToBytes(rows), ...Utils.u16ToBytes(cols)]);
    }
    /**
     * @param rows Height in pixels
     * @param cols Width in pixels
     * @param copiesCount Page instances
     */
    static setPageSize6b(rows, cols, copiesCount) {
      return this.mapped(19 /* SetPageSize */, [
        ...Utils.u16ToBytes(rows),
        ...Utils.u16ToBytes(cols),
        ...Utils.u16ToBytes(copiesCount)
      ]);
    }
    /** First seen on H1S */
    static setPageSize9b(rows, cols, copiesCount, cutHeight = 0, cutType = 0) {
      return this.mapped(19 /* SetPageSize */, [
        ...Utils.u16ToBytes(rows),
        ...Utils.u16ToBytes(cols),
        ...Utils.u16ToBytes(copiesCount),
        ...Utils.u16ToBytes(cutHeight),
        cutType
      ]);
    }
    /** First seen on D110M v4
     *
     * @param serial Something called "local template data id", 32 bytes
     */
    static setPageSize13b(rows, cols, copiesCount, cutHeight = 0, cutType = 0, sendAll = 0, partHeight = 0, serial = []) {
      if (serial && serial.length !== 0) {
        Validators.arrayLengthEquals(serial, 32);
      }
      return this.mapped(19 /* SetPageSize */, [
        ...Utils.u16ToBytes(rows),
        ...Utils.u16ToBytes(cols),
        ...Utils.u16ToBytes(copiesCount),
        ...Utils.u16ToBytes(cutHeight),
        cutType,
        0,
        sendAll,
        ...Utils.u16ToBytes(partHeight),
        ...serial
      ]);
    }
    static setPrintQuantity(quantity) {
      return this.mapped(21 /* PrintQuantity */, [...Utils.u16ToBytes(quantity)]);
    }
    static printStatus() {
      return this.mapped(163 /* PrintStatus */);
    }
    /** Reset printer settings (sound and maybe some other settings). */
    static printerReset() {
      return this.mapped(40 /* PrinterReset */);
    }
    /**
     * B1 behavior: after {@link pageEnd} paper stops at printhead position, on {@link printEnd} paper moved further.
     *
     * D110 behavior: ordinary.
     * */
    static printStart1b() {
      return this.mapped(1 /* PrintStart */);
    }
    static printStart2b(totalPages) {
      return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages)]);
    }
    /**
     * B1 behavior: when {@link totalPages} > 1 after {@link pageEnd} paper stops at printhead position and waits for next page.
     * When last page ({@link totalPages}) printed paper moved further.
     *
     * D110 behavior: ordinary.
     *
     * @param totalPages Declare how many pages will be printed
     */
    static printStart7b(totalPages, pageColor = 0 /* SingleColor */) {
      return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages), 0, 0, 0, 0, pageColor]);
    }
    /** First seen on D110M v4 */
    static printStart9b(totalPages, pageColor = 0 /* SingleColor */, speed = 0, someFlag = false) {
      return this.mapped(1 /* PrintStart */, [...Utils.u16ToBytes(totalPages), 0, 0, 0, 0, pageColor, speed, someFlag ? 1 : 0]);
    }
    static printEnd() {
      return this.mapped(243 /* PrintEnd */);
    }
    static pageStart() {
      return this.mapped(3 /* PageStart */);
    }
    static pageEnd() {
      return this.mapped(227 /* PageEnd */);
    }
    static printEmptySpace(pos, repeats) {
      return this.mapped(132 /* PrintEmptyRow */, [...Utils.u16ToBytes(pos), repeats]);
    }
    static printBitmapRow(pos, repeats, data, printheadPixels, countsMode = "auto") {
      const counts = Utils.countPixelsForBitmapPacket(data, printheadPixels, countsMode);
      return this.mapped(133 /* PrintBitmapRow */, [...Utils.u16ToBytes(pos), ...counts.parts, repeats, ...data]);
    }
    static printBitmapRowWithColor(pos, repeats, data, colorMode = 2 /* Black */) {
      return this.mapped(138 /* PrintBitmapRowDoubleColor */, [colorMode, 133 /* PrintBitmapRow */, ...Utils.u16ToBytes(pos), repeats, ...data]);
    }
    /** Printer powers off if black pixel count > 6 */
    // 5555 83 0e 007e 000400 01 0027 0028 0029 002a fa aaaa
    static printBitmapRowIndexed(pos, repeats, data, printheadPixels, countsMode = "auto") {
      const counts = Utils.countPixelsForBitmapPacket(data, printheadPixels != null ? printheadPixels : 0, countsMode);
      const indexes = ImageEncoder.indexPixels(data);
      if (counts.total > 6) {
        throw new Error(`Black pixel count > 6 (${counts.total})`);
      }
      return this.mapped(131 /* PrintBitmapRowIndexed */, [...Utils.u16ToBytes(pos), ...counts.parts, repeats, ...indexes]);
    }
    static printBitmapRowDoubleColor(blackData, redData, pos, repeats, cols) {
      const maskBytes = [];
      const colorBytes = [];
      const bytesPerOctet = cols / 8;
      for (let i = 0; i < bytesPerOctet; i++) {
        const bByte = blackData ? blackData[i] : 0;
        const rByte = redData ? redData[i] : 0;
        const mask = bByte | rByte;
        maskBytes.push(mask);
        if (mask !== 0) {
          let colorByte = 0;
          for (let bit = 7; bit >= 0; bit--) {
            const isRed = (rByte & 1 << bit) !== 0;
            colorByte = colorByte << 1 | (isRed ? 1 : 0);
          }
          colorBytes.push(colorByte);
        }
      }
      return this.mapped(138 /* PrintBitmapRowDoubleColor */, [3 /* Mixed */, ...Utils.u16ToBytes(pos), repeats, ...maskBytes, ...colorBytes]);
    }
    static printClear() {
      return this.mapped(32 /* PrintClear */);
    }
    static getVolumeLevel(data) {
      return this.mapped(112 /* GetVolumeLevel */, data);
    }
    static checkLine(line) {
      return this.mapped(134 /* PrinterCheckLine */, [...Utils.u16ToBytes(line), 1]);
    }
    static writeImageData(image, options) {
      if (image.pageColor === 0 /* SingleColor */) {
        return this.writeImageDataSingleColor(image, options);
      } else if (image.pageColor === 1 /* DoubleColor */) {
        return this.writeImageDataDoubleColor(image);
      }
      throw new Error(`Page color ${image.pageColor} not implemented`);
    }
    static writeImageDataSingleColor(image, options) {
      var _a, _b, _c, _d;
      const out = [];
      for (const d of image.rowsData) {
        if (d.dataType === "pixels") {
          if (d.blackPixelsCount <= 6 && !(options == null ? void 0 : options.noIndexPacket)) {
            out.push(
              this.printBitmapRowIndexed(
                d.rowNumber,
                d.repeat,
                d.rowDataBlack,
                (_a = options == null ? void 0 : options.printheadPixels) != null ? _a : 0,
                (_b = options == null ? void 0 : options.countsMode) != null ? _b : "auto"
              )
            );
          } else {
            out.push(
              this.printBitmapRow(
                d.rowNumber,
                d.repeat,
                d.rowDataBlack,
                (_c = options == null ? void 0 : options.printheadPixels) != null ? _c : 0,
                (_d = options == null ? void 0 : options.countsMode) != null ? _d : "auto"
              )
            );
          }
          continue;
        }
        if (d.dataType === "check" && (options == null ? void 0 : options.enableCheckLine)) {
          out.push(this.checkLine(d.rowNumber));
          continue;
        }
        if (d.dataType === "void") {
          out.push(this.printEmptySpace(d.rowNumber, d.repeat));
        }
      }
      return out;
    }
    static writeImageDataDoubleColor(image) {
      const out = [];
      if (image.pageColor !== 1 /* DoubleColor */) {
        throw new Error("EncodedImage.pageColor must be PageColorType.DoubleColor");
      }
      for (const d of image.rowsData) {
        if (d.dataType === "pixels") {
          const hasBlack = d.blackPixelsCount > 0;
          const hasRed = d.redPixelsCount > 0;
          if (hasBlack && hasRed) {
            out.push(this.printBitmapRowDoubleColor(d.rowDataBlack, d.rowDataRed, d.rowNumber, d.repeat, image.cols));
          } else if (hasBlack || hasRed) {
            const color = hasBlack ? 2 /* Black */ : 1 /* Red */;
            const rowData = hasBlack ? d.rowDataBlack : d.rowDataRed;
            out.push(this.printBitmapRowWithColor(d.rowNumber, d.repeat, rowData, color));
          }
          continue;
        }
        if (d.dataType === "void") {
          const p = this.printEmptySpace(d.rowNumber, d.repeat);
          out.push(this.mapped(138 /* PrintBitmapRowDoubleColor */, [0 /* Empty */, p.command, ...p.data]));
        }
      }
      return out;
    }
    static printTestPage() {
      return this.mapped(90 /* PrintTestPage */);
    }
    static labelPositioningCalibration(value) {
      return this.mapped(142 /* LabelPositioningCalibration */, [value]);
    }
    static startFirmwareUpgrade(version) {
      if (!/^\d+\.\d+$/.test(version)) {
        throw new Error("Invalid version format (x.x expected)");
      }
      const [a, b] = version.split(".").map((p) => parseInt(p));
      return this.mapped(245 /* StartFirmwareUpgrade */, [a, b]);
    }
    static sendFirmwareChecksum(crc) {
      const p = new NiimbotCrc32Packet(145 /* FirmwareCrc */, 0, [...Utils.u32ToBytes(crc)]);
      p.oneWay = true;
      return p;
    }
    static sendFirmwareChunk(idx, data) {
      const p = new NiimbotCrc32Packet(155 /* FirmwareChunk */, idx, data);
      p.oneWay = true;
      return p;
    }
    static firmwareNoMoreChunks() {
      const p = new NiimbotCrc32Packet(156 /* FirmwareNoMoreChunks */, 0, [1]);
      p.oneWay = true;
      return p;
    }
    static firmwareCommit() {
      const p = new NiimbotCrc32Packet(146 /* FirmwareCommit */, 0, [1]);
      p.oneWay = true;
      return p;
    }
    static setTubeTypeAndWidth(tubeType, mmWidth) {
      const widthFixed = Math.floor(mmWidth * 100);
      return this.mapped(15 /* TubeTypeAndWidth */, [1, 1, tubeType, ...Utils.u16ToBytes(widthFixed)]);
    }
    static setHalfCut(value) {
      return this.mapped(92 /* HalfCut */, [1, value ? 1 : 0]);
    }
    static setPrinterTime(date = /* @__PURE__ */ new Date()) {
      return this.mapped(7 /* PrinterConfig2 */, [
        8 /* Time */,
        1 /* SetValue */,
        ...Utils.u16ToBytes(date.getFullYear()),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ]);
    }
    static getPaperInfo() {
      return this.mapped(89 /* GetPaperInfo */);
    }
    static getPrinterCapabilities() {
      return this.mapped(175 /* GetPrinterCapabilities */);
    }
  };

  // src/packets/packet_parser.ts
  var PacketParser = class {
    /**
     * Parse raw data containing one or more packets.
     *
     * For example, `55554a01044faaaa5555f60101f6aaaa` will be converted to the two NiimbotPackets.
     *
     * @param buf bytes
     * @returns list of packet objects
     */
    static parsePacketBundle(buf) {
      const chunks = [];
      const bufLength = buf.byteLength;
      while (buf.byteLength > 0) {
        if (!Utils.hasSubarrayAtPos(buf, NiimbotPacket.HEAD, 0)) {
          break;
        }
        if (buf.byteLength < 3) {
          break;
        }
        const cmd = buf[2];
        let cls = NiimbotPacket;
        let sizePos = 3;
        let crcSize = 1;
        if (firmwareExchangePackets.rx.includes(cmd) || firmwareExchangePackets.tx.includes(cmd)) {
          cls = NiimbotCrc32Packet;
          sizePos = 5;
          crcSize = 4;
        }
        if (buf.byteLength <= sizePos) {
          break;
        }
        const size = buf[sizePos];
        if (buf.byteLength <= sizePos + size + crcSize + NiimbotPacket.TAIL.byteLength) {
          break;
        }
        const tailPos = sizePos + size + crcSize + 1;
        if (!Utils.hasSubarrayAtPos(buf, NiimbotPacket.TAIL, tailPos)) {
          console.warn("Invalid tail");
          break;
        }
        const tailEnd = tailPos + NiimbotPacket.TAIL.byteLength;
        chunks.push({ cls, raw: buf.slice(0, tailEnd) });
        buf = buf.slice(tailEnd);
      }
      const chunksDataLen = chunks.reduce((acc, c) => acc + c.raw.length, 0);
      if (bufLength !== chunksDataLen) {
        throw new Error(`Splitted chunks data length not equals buffer length (${bufLength} !== ${chunksDataLen})`);
      }
      return chunks.map((c) => c.cls.fromBytes(c.raw));
    }
    static parsePrintStatusResponse(packet) {
      Validators.arrayLengthAtLeast(packet.data, 4);
      const r = new SequentialDataReader(packet.data);
      const page = r.readU16();
      const pagePrintProgress = r.readU8();
      const pageFeedProgress = r.readU8();
      let error = 0;
      if (packet.dataLength === 10) {
        r.skip(2);
        error = r.readU8();
      }
      return { page, pagePrintProgress, pageFeedProgress, error };
    }
    static parseConnectResponse(packet) {
      Validators.arrayLengthAtLeast(packet.data, 1);
      return packet.data[0];
    }
    static parsePrinterStatusDataResponse(packet) {
      const result = {
        protocolVersion: 0,
        supportColor: false
      };
      if (packet.dataLength >= 13) {
        result.supportColor = packet.data[10] > 0;
        const n = packet.data[11] * 100 + packet.data[12];
        if (n >= 204 && n < 300) {
          result.protocolVersion = 3;
        } else if (n >= 300 && n < 302) {
          result.protocolVersion = 4;
        } else if (n >= 302) {
          result.protocolVersion = 5;
        }
      }
      return result;
    }
    static parsePrinterInfoModelIdResponse(packet) {
      Validators.arrayLengthAtLeast(packet.data, 1);
      if (packet.data.length === 1) {
        return packet.data[0] << 8;
      }
      Validators.arrayLengthEquals(packet.data, 2);
      return Utils.bytesToU16(packet.data);
    }
    static parseRfidInfoResponse(packet) {
      const info = {
        tagPresent: false,
        uuid: "",
        barCode: "",
        serialNumber: "",
        allPaper: -1,
        usedPaper: -1,
        consumablesType: 0 /* Invalid */
      };
      if (packet.dataLength === 1) {
        return info;
      }
      const r = new SequentialDataReader(packet.data);
      info.tagPresent = true;
      info.uuid = Utils.bufToHex(r.readBytes(8), "");
      info.barCode = r.readVString();
      info.serialNumber = r.readVString();
      info.allPaper = r.readU16();
      info.usedPaper = r.readU16();
      info.consumablesType = r.readU8();
      if (r.canRead(2)) {
        info.capacity = r.readU16();
      }
      if (r.canRead(8)) {
        info.uuid2 = Utils.bufToHex(r.readBytes(8), "");
      }
      r.end();
      return info;
    }
    static parseHeartbeatPrinterInfoResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 10);
      const r = new SequentialDataReader(packet.data);
      const [hwH, hwL] = r.readBytes(2);
      const [fwH, fwL] = r.readBytes(2);
      const info = {
        softwareVersion: (fwL / 100 + fwH).toFixed(2),
        hardwareVersion: (hwL / 100 + hwH).toFixed(2),
        printheadWidth: r.readU16(),
        resolutionClass: r.readU8(),
        printheadAlignment: r.readU8(),
        supportsRFID: r.readBool(),
        supportsWriteRFID: r.readBool()
      };
      r.end();
      return info;
    }
    static parseHeartbeatAdvanced1Response(packet, modelId) {
      const len = packet.dataLength;
      const r = new SequentialDataReader(packet.data);
      const info = {};
      if (len === 10) {
        r.skip(8);
        info.lidClosed = r.readU8() === 0;
        info.batteryPercents = r.readU8();
      } else if (len === 13) {
        r.skip(9);
        info.lidClosed = r.readU8() === 0;
        info.batteryPercents = r.readU8();
        info.paperInserted = r.readU8() === 0;
        info.paperRfidSuccess = r.readU8() !== 0;
      } else if (len === 19) {
        r.skip(15);
        info.lidClosed = r.readU8() === 0;
        info.batteryPercents = r.readU8();
        info.paperInserted = r.readU8() === 0;
        info.paperRfidSuccess = r.readU8() !== 0;
      } else if (len === 20) {
        r.skip(18);
        info.paperInserted = r.readU8() === 0;
        info.paperRfidSuccess = r.readU8() !== 0;
      } else {
        throw new Error("Invalid heartbeat length");
      }
      r.end();
      const invertedLidModels = [512, 514, 513, 2304, 1792, 3584, 5120, 2560, 3840, 4352, 272, 273, 274];
      if (modelId !== void 0 && invertedLidModels.includes(modelId)) {
        info.lidClosed = !info.lidClosed;
      }
      if (info.batteryPercents !== void 0 && info.batteryPercents <= 4) {
        info.batteryPercents *= 25;
      }
      return info;
    }
    static parseHeartbeatAdvanced2Response(packet) {
      const r = new SequentialDataReader(packet.data);
      const info = {};
      Validators.arrayLengthAtLeast(packet.data, 9);
      r.skip(2);
      info.batteryPercents = r.readU8();
      info.temp = r.readU8();
      info.lidClosed = r.readU8() === 0;
      info.paperInserted = r.readU8() === 0;
      info.paperRfidSuccess = r.readU8() !== 0;
      info.ribbonRfidSuccess = r.readU8() !== 0;
      info.ribbonInserted = r.readU8() === 0;
      if (r.canRead(2)) {
        info.wifiRssi = r.readU16();
      }
      if (r.canRead(2)) {
        r.skip(1);
        info.lightingErrorCode = r.readU8();
      }
      if (r.canRead(1)) {
        info.voltageState = r.readU8();
      }
      r.end();
      if (info.batteryPercents <= 4) {
        info.batteryPercents *= 25;
      }
      return info;
    }
    static parsePrinterVersionResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 2);
      const v1 = packet.data[1] / 100 + packet.data[0];
      const v2 = (packet.data[0] * 256 + packet.data[1]) / 100;
      return `${v1.toFixed(2)}/${v2.toFixed(2)}`;
    }
    static parsePrinterSerialNumberResponse(packet) {
      Validators.arrayLengthAtLeast(packet.data, 1);
      if (packet.data.length < 4) {
        return "-1";
      }
      if (packet.data.length >= 8) {
        return Utils.u8ArrayToString(packet.data);
      }
      return Utils.bufToHex(packet.data.slice(0, 4), "").toUpperCase();
    }
    static parsePrinterBluetoothMacAddressResponse(packet) {
      Validators.arrayLengthAtLeast(packet.data, 1);
      return Utils.bufToHex(packet.data.reverse(), ":");
    }
    static parseIsSoundEnabledResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 3);
      return !!packet.data[2];
    }
    static parseBatteryChargeLevelResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      const value = packet.data[0];
      return value <= 4 ? value * 25 : value;
    }
    static parseAutoShutdownTimeResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      return packet.data[0];
    }
    static parseLabelTypeResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      return packet.data[0];
    }
    static parseBooleanResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      return packet.data[0] === 1;
    }
    static parseFirmwareCheckResultResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      return packet.data[0] === 1;
    }
    static parseFirmwareResultResponse(packet) {
      Validators.arrayLengthEquals(packet.data, 1);
      return packet.data[0] === 1;
    }
    static parsePaperInfoResponse(packet, totalHeightIncludesGap = false) {
      Validators.arrayLengthAtLeast(packet.data, 4);
      const info = {
        valid: false
      };
      if (packet.dataLength === 18) {
        info.valid = true;
        const r = new SequentialDataReader(packet.data);
        info.gapHeightPixel = r.readU16();
        info.totalHeightPixel = r.readU16();
        info.paperType = r.readU8();
        info.gapHeight = r.readU16() / 10;
        info.totalHeight = r.readU16() / 10;
        info.paperWidthPixel = r.readU16();
        info.paperWidth = r.readU16() / 10;
        info.direction = r.readU8();
        info.tailLengthPixel = r.readU16();
        info.tailLength = r.readU16() / 10;
        r.end();
        info.paperHeight = info.totalHeight;
        info.paperHeightPixel = info.totalHeightPixel;
        if (totalHeightIncludesGap) {
          info.paperHeight -= info.gapHeight;
          info.paperHeightPixel -= info.gapHeightPixel;
        }
      }
      return info;
    }
    /** Payload is Type–length–value data */
    static parsePrinterCapabilities(pkt) {
      const data = {};
      const reader = new SequentialDataReader(pkt.data);
      while (reader.canRead(2)) {
        const type = reader.readU8();
        const length = reader.readU8();
        if (!reader.canRead(length)) break;
        const skipIfLengthIsNot = (expected) => {
          if (length === expected) return false;
          reader.skip(length);
          return true;
        };
        switch (type) {
          case 1 /* Language */:
            data.language = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 2 /* PrintMode */:
            data.printMode = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 3 /* UhfRfid */:
            data.uhfRfid = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 4 /* PrintheadDpi */:
            if (skipIfLengthIsNot(2)) break;
            data.printheadDpi = reader.readU16();
            break;
          case 5 /* RfidSupport */:
            data.rfidSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 6 /* BatteryRange */:
            if (skipIfLengthIsNot(2)) break;
            data.batteryRange = { max: reader.readU8(), min: reader.readU8() };
            break;
          case 7 /* DensityRange */:
            if (skipIfLengthIsNot(2)) break;
            data.densityRange = { max: reader.readU8(), min: reader.readU8() };
            break;
          case 8 /* SpeedRange */:
            if (skipIfLengthIsNot(2)) break;
            data.speedRange = { max: reader.readU8(), min: reader.readU8() };
            break;
          case 9 /* SupportedLabelTypes */:
            data.supportedLabelTypes = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 10 /* PrintheadWidth */:
            if (skipIfLengthIsNot(2)) break;
            data.printheadWidth = reader.readU16();
            break;
          case 11 /* MaxPrintHeight */:
            if (skipIfLengthIsNot(2)) break;
            data.maxPrintHeight = reader.readU16();
            break;
          case 12 /* LabelHeightAndGap */:
            if (skipIfLengthIsNot(1)) break;
            data.labelHeightAndGap = reader.readU8();
            break;
          case 13 /* PrintheadPosition */:
            if (skipIfLengthIsNot(1)) break;
            data.printheadPosition = reader.readU8();
            break;
          case 14 /* VolumeSupport */:
            data.volumeSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 15 /* HostStyle */:
            data.hostStyle = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 16 /* PrintProtocol */:
            data.printProtocol = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 17 /* AutoShutdownRange */:
            if (skipIfLengthIsNot(2)) break;
            data.autoShutdownRange = { max: reader.readU8(), min: reader.readU8() };
            break;
          case 18 /* CutterSupport */:
            data.cutterSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 19 /* CutterDepthRange */:
            if (skipIfLengthIsNot(2)) break;
            data.cutterDepthRange = { max: reader.readU8(), min: reader.readU8() };
            break;
          case 20 /* PrintControl */:
            data.printControl = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 21 /* PauseTimeSupport */:
            data.pauseTimeSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 22 /* PaperDetection */:
            if (skipIfLengthIsNot(1)) break;
            data.paperDetection = reader.readU8();
            break;
          case 23 /* RealTimeClock */:
            data.realTimeClock = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 24 /* KeyFunctions */: {
            if (length % 5 !== 0) {
              reader.skip(length);
              break;
            }
            data.keyFunctions = [];
            for (let i = 0; i < length; i += 5) {
              data.keyFunctions.push({
                key: reader.readU8(),
                functions: Utils.bytesToBitPositions(reader.readBytes(4))
              });
            }
            break;
          }
          case 25 /* Unknown19 */:
            if (skipIfLengthIsNot(1)) break;
            data.unknown19 = reader.readU8();
            break;
          case 26 /* PrintColor */:
            data.printColor = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 27 /* SpeedQualityMode */:
            data.speedQualityMode = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 28 /* TubeCalibration */:
            data.tubeCalibration = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 29 /* PartialRetransmitSupport */:
            data.partialRetransmitSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 30 /* MaxCompressLines */:
            if (skipIfLengthIsNot(2)) break;
            data.maxCompressLines = reader.readU16();
            break;
          case 31 /* TubeSupport */:
            data.tubeSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 32 /* SixteenGrayMaxBuffer */:
            if (skipIfLengthIsNot(2)) break;
            data.sixteenGrayMaxBuffer = reader.readU16();
            break;
          case 33 /* LocalTemplateSupport */:
            data.localTemplateSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 34 /* ImageCompressSupport */:
            data.imageCompressSupport = Utils.bytesToBitPositions(reader.readBytes(length));
            break;
          case 35 /* MaxImageCompressBytes */:
            if (skipIfLengthIsNot(4)) break;
            data.maxImageCompressBytes = reader.readU32();
            break;
          case 36 /* LocalTemplateMaxTimeCount */:
            if (skipIfLengthIsNot(1)) break;
            data.localTemplateMaxTimeCount = reader.readU8();
            break;
          default:
            reader.skip(length);
            break;
        }
      }
      return data;
    }
  };

  // src/events.ts
  var NiimbotEvent = class {
    constructor(type) {
      this.type = type;
    }
  };
  var ConnectEvent = class extends NiimbotEvent {
    constructor(info) {
      super("connect");
      this.info = info;
    }
  };
  var DisconnectEvent = class extends NiimbotEvent {
    constructor() {
      super("disconnect");
    }
  };
  var PacketReceivedEvent = class extends NiimbotEvent {
    constructor(packet) {
      super("packetreceived");
      this.packet = packet;
    }
  };
  var PacketSentEvent = class extends NiimbotEvent {
    constructor(packet) {
      super("packetsent");
      this.packet = packet;
    }
  };
  var RawPacketSentEvent = class extends NiimbotEvent {
    constructor(data) {
      super("rawpacketsent");
      this.data = data;
    }
  };
  var RawPacketReceivedEvent = class extends NiimbotEvent {
    constructor(data) {
      super("rawpacketreceived");
      this.data = data;
    }
  };
  var HeartbeatEvent = class extends NiimbotEvent {
    constructor(data) {
      super("heartbeat");
      this.data = data;
    }
  };
  var HeartbeatFailedEvent = class extends NiimbotEvent {
    constructor(failedAttempts) {
      super("heartbeatfailed");
      this.failedAttempts = failedAttempts;
    }
  };
  var PrinterInfoFetchedEvent = class extends NiimbotEvent {
    constructor(info) {
      super("printerinfofetched");
      this.info = info;
    }
  };
  var PrintEndEvent = class extends NiimbotEvent {
    constructor(pagesPrinted) {
      super("printend");
      this.pagesPrinted = pagesPrinted;
    }
  };
  var RfidInfoFetchedEvent = class extends NiimbotEvent {
    constructor(info) {
      super("rfidinfofetched");
      this.info = info;
    }
  };
  var PrintProgressEvent = class extends NiimbotEvent {
    constructor(page, pagesTotal, pagePrintProgress, pageFeedProgress) {
      super("printprogress");
      this.page = page;
      this.pagesTotal = pagesTotal;
      this.pagePrintProgress = pagePrintProgress;
      this.pageFeedProgress = pageFeedProgress;
    }
  };
  var PrintPacketProgressEvent = class extends NiimbotEvent {
    constructor(progress) {
      super("printpacketprogress");
      this.progress = progress;
    }
  };
  var FirmwareProgressEvent = class extends NiimbotEvent {
    constructor(currentChunk, totalChunks) {
      super("firmwareprogress");
      this.currentChunk = currentChunk;
      this.totalChunks = totalChunks;
    }
  };

  // src/printer_models.ts
  var PrinterModel = /* @__PURE__ */ ((PrinterModel2) => {
    PrinterModel2["UNKNOWN"] = "UNKNOWN";
    PrinterModel2["A1_PRO"] = "A1_PRO";
    PrinterModel2["A20"] = "A20";
    PrinterModel2["A203"] = "A203";
    PrinterModel2["A63"] = "A63";
    PrinterModel2["A8"] = "A8";
    PrinterModel2["A8_P"] = "A8_P";
    PrinterModel2["B1"] = "B1";
    PrinterModel2["B1_PRO"] = "B1_PRO";
    PrinterModel2["B1_SE"] = "B1_SE";
    PrinterModel2["B11"] = "B11";
    PrinterModel2["B16"] = "B16";
    PrinterModel2["B18"] = "B18";
    PrinterModel2["B18S"] = "B18S";
    PrinterModel2["B2"] = "B2";
    PrinterModel2["B2_PRO"] = "B2_PRO";
    PrinterModel2["B203"] = "B203";
    PrinterModel2["B21"] = "B21";
    PrinterModel2["B21_PRO"] = "B21_PRO";
    PrinterModel2["B21_C2B"] = "B21_C2B";
    PrinterModel2["B21_L2B"] = "B21_L2B";
    PrinterModel2["B21S"] = "B21S";
    PrinterModel2["B21S_C2B"] = "B21S_C2B";
    PrinterModel2["B3"] = "B3";
    PrinterModel2["B31"] = "B31";
    PrinterModel2["B32"] = "B32";
    PrinterModel2["B32R"] = "B32R";
    PrinterModel2["B3S"] = "B3S";
    PrinterModel2["B3S_A"] = "B3S_A";
    PrinterModel2["B3S_P"] = "B3S_P";
    PrinterModel2["B4"] = "B4";
    PrinterModel2["B4_PRO"] = "B4_PRO";
    PrinterModel2["B50"] = "B50";
    PrinterModel2["B50W"] = "B50W";
    PrinterModel2["BETTY"] = "BETTY";
    PrinterModel2["C1"] = "C1";
    PrinterModel2["D101"] = "D101";
    PrinterModel2["D11"] = "D11";
    PrinterModel2["D11_H"] = "D11_H";
    PrinterModel2["D11_PRO"] = "D11_PRO";
    PrinterModel2["D110"] = "D110";
    PrinterModel2["D110_M"] = "D110_M";
    PrinterModel2["D11S"] = "D11S";
    PrinterModel2["D41"] = "D41";
    PrinterModel2["D61"] = "D61";
    PrinterModel2["DXX"] = "DXX";
    PrinterModel2["EP1C"] = "EP1C";
    PrinterModel2["EP2M_H"] = "EP2M_H";
    PrinterModel2["EP3M"] = "EP3M";
    PrinterModel2["ET10"] = "ET10";
    PrinterModel2["FUST"] = "FUST";
    PrinterModel2["H1"] = "H1";
    PrinterModel2["H1S"] = "H1S";
    PrinterModel2["HI_D110"] = "HI_D110";
    PrinterModel2["HI_NB_D11"] = "HI_NB_D11";
    PrinterModel2["JC_M90"] = "JC_M90";
    PrinterModel2["JCB3S"] = "JCB3S";
    PrinterModel2["K2"] = "K2";
    PrinterModel2["K3"] = "K3";
    PrinterModel2["K3_ITD"] = "K3_ITD";
    PrinterModel2["K3_W"] = "K3_W";
    PrinterModel2["K4"] = "K4";
    PrinterModel2["M2_H"] = "M2_H";
    PrinterModel2["M3"] = "M3";
    PrinterModel2["MP3K"] = "MP3K";
    PrinterModel2["MP3K_W"] = "MP3K_W";
    PrinterModel2["N1"] = "N1";
    PrinterModel2["P1"] = "P1";
    PrinterModel2["P18"] = "P18";
    PrinterModel2["P1S"] = "P1S";
    PrinterModel2["S1"] = "S1";
    PrinterModel2["S3"] = "S3";
    PrinterModel2["S6"] = "S6";
    PrinterModel2["S6_P"] = "S6_P";
    PrinterModel2["T2S"] = "T2S";
    PrinterModel2["T6"] = "T6";
    PrinterModel2["T7"] = "T7";
    PrinterModel2["T8"] = "T8";
    PrinterModel2["T8S"] = "T8S";
    PrinterModel2["TP2M_H"] = "TP2M_H";
    PrinterModel2["Z401"] = "Z401";
    return PrinterModel2;
  })(PrinterModel || {});
  var modelsLibrary = [
    {
      model: "A1_PRO" /* A1_PRO */,
      id: [7424],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 296,
      paperTypes: [4 /* Perforated */, 3 /* Continuous */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "A20" /* A20 */,
      id: [2817],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 400,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "A203" /* A203 */,
      id: [2818],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 400,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "A63" /* A63 */,
      id: [2054],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "A8" /* A8 */,
      id: [256],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [2 /* Black */, 1 /* WithGaps */, 3 /* Continuous */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "A8_P" /* A8_P */,
      id: [273],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B1" /* B1 */,
      id: [4096],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B1_PRO" /* B1_PRO */,
      id: [4097],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 567,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B1_SE" /* B1_SE */,
      id: [4098],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B11" /* B11 */,
      id: [51457],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */, 5 /* Transparent */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "B16" /* B16 */,
      id: [1792],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "B18" /* B18 */,
      id: [3584],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 10 /* BlackMarkGap */, 11 /* HeatShrinkTube */, 3 /* Continuous */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "B18S" /* B18S */,
      id: [3585],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 10 /* BlackMarkGap */, 11 /* HeatShrinkTube */, 3 /* Continuous */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "B2" /* B2 */,
      id: [6913],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B2_PRO" /* B2_PRO */,
      id: [6912],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 567,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B203" /* B203 */,
      id: [2816],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 400,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21" /* B21 */,
      id: [768],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21_PRO" /* B21_PRO */,
      id: [785],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 591,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21_C2B" /* B21_C2B */,
      id: [771, 775],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 3 /* Continuous */, 5 /* Transparent */, 2 /* Black */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21_L2B" /* B21_L2B */,
      id: [769],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21S" /* B21S */,
      id: [777],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B21S_C2B" /* B21S_C2B */,
      id: [776],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B3" /* B3 */,
      id: [52993],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 600,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B31" /* B31 */,
      id: [5632],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 600,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B32" /* B32 */,
      id: [2049],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "B32R" /* B32R */,
      id: [2050],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "B3S" /* B3S */,
      id: [256, 260, 262],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B3S_A" /* B3S_A */,
      id: [275],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B3S_P" /* B3S_P */,
      id: [272],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B4" /* B4 */,
      id: [6656],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 832,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B4_PRO" /* B4_PRO */,
      id: [6657],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 1229,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "B50" /* B50 */,
      id: [51713],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 400,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "B50W" /* B50W */,
      id: [51714],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "BETTY" /* BETTY */,
      id: [2561],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 192,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "C1" /* C1 */,
      id: [5120],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 178,
      paperTypes: [3 /* Continuous */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "D101" /* D101 */,
      id: [2560],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 192,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "D11" /* D11 */,
      id: [512],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "D11_H" /* D11_H */,
      id: [528],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 142,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "D11_PRO" /* D11_PRO */,
      id: [531],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 142,
      paperTypes: [5 /* Transparent */, 1 /* WithGaps */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "D110" /* D110 */,
      id: [2304, 2305],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "D110_M" /* D110_M */,
      id: [2320],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "D11S" /* D11S */,
      id: [514],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "EP1C" /* EP1C */,
      id: [5121],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 178,
      paperTypes: [3 /* Continuous */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "EP2M_H" /* EP2M_H */,
      id: [4610],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 567,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "EP3M" /* EP3M */,
      id: [6402],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "ET10" /* ET10 */,
      id: [5376],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 1600,
      paperTypes: [3 /* Continuous */],
      densityMin: 3,
      densityMax: 3,
      densityDefault: 3
    },
    {
      model: "FUST" /* FUST */,
      id: [513],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "H1" /* H1 */,
      id: [3840],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "H1S" /* H1S */,
      id: [4352],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "HI_D110" /* HI_D110 */,
      id: [2305],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 120,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 3
    },
    {
      model: "HI_NB_D11" /* HI_NB_D11 */,
      id: [512],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 120,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "JC_M90" /* JC_M90 */,
      id: [51461],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "JCB3S" /* JCB3S */,
      id: [256],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 2
    },
    {
      model: "K2" /* K2 */,
      id: [6144],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 448,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "K3" /* K3 */,
      id: [4864],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 640,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "K3_ITD" /* K3_ITD */,
      id: [4868],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 640,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "K3_W" /* K3_W */,
      id: [4865],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 640,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "K4" /* K4 */,
      id: [7168],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 832,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 7
    },
    {
      model: "M2_H" /* M2_H */,
      id: [4608],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 567,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "M3" /* M3 */,
      id: [6400],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */, 2 /* Black */, 10 /* BlackMarkGap */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "MP3K" /* MP3K */,
      id: [4866],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 640,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "MP3K_W" /* MP3K_W */,
      id: [4867],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 640,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "N1" /* N1 */,
      id: [3586],
      dpi: 203,
      printDirection: "left",
      printheadPixels: 96,
      paperTypes: [1 /* WithGaps */, 11 /* HeatShrinkTube */, 5 /* Transparent */, 10 /* BlackMarkGap */, 3 /* Continuous */],
      densityMin: 1,
      densityMax: 3,
      densityDefault: 2
    },
    {
      model: "P1" /* P1 */,
      id: [1024],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 697,
      paperTypes: [6 /* PvcTag */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "P18" /* P18 */,
      id: [1026],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 662,
      paperTypes: [6 /* PvcTag */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "P1S" /* P1S */,
      id: [1025],
      dpi: 300,
      printDirection: "left",
      printheadPixels: 662,
      paperTypes: [6 /* PvcTag */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "S1" /* S1 */,
      id: [51458],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "S3" /* S3 */,
      id: [51460],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "S6" /* S6 */,
      id: [261, 259, 258, 257],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 576,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "S6_P" /* S6_P */,
      id: [274],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 600,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "T2S" /* T2S */,
      id: [53250],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 832,
      paperTypes: [1 /* WithGaps */, 2 /* Black */],
      densityMin: 1,
      densityMax: 20,
      densityDefault: 15
    },
    {
      model: "T6" /* T6 */,
      id: [51715],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "T7" /* T7 */,
      id: [51717],
      dpi: 203,
      printDirection: "top",
      printheadPixels: 384,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "T8" /* T8 */,
      id: [51718],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 567,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 3 /* Continuous */, 4 /* Perforated */],
      densityMin: 6,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "T8S" /* T8S */,
      id: [2053],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 10
    },
    {
      model: "TP2M_H" /* TP2M_H */,
      id: [4609],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 591,
      paperTypes: [1 /* WithGaps */, 2 /* Black */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 5,
      densityDefault: 3
    },
    {
      model: "Z401" /* Z401 */,
      id: [2051],
      dpi: 300,
      printDirection: "top",
      printheadPixels: 851,
      paperTypes: [1 /* WithGaps */, 5 /* Transparent */],
      densityMin: 1,
      densityMax: 15,
      densityDefault: 10
    }
  ];
  var getPrinterMetaById = (id) => {
    return modelsLibrary.find((o) => o.id.includes(id));
  };
  var getPrinterMetaByModel = (model) => {
    return modelsLibrary.find((o) => o.model === model);
  };

  // src/print_tasks/AbstractPrintTask.ts
  var printOptionsDefaults = {
    labelType: 1 /* WithGaps */,
    density: 2,
    totalPages: 1,
    statusPollIntervalMs: 300,
    statusTimeoutMs: 5e3,
    pageTimeoutMs: 1e4,
    speed: 1,
    pageColor: 0 /* SingleColor */,
    cutType: 0,
    cutHeight: 0
  };
  var AbstractPrintTask = class {
    constructor(protocol, printOptions) {
      this.protocol = protocol;
      this.pagesPrinted = 0;
      this.printOptions = __spreadValues(__spreadValues({}, printOptionsDefaults), printOptions);
    }
    /** Update print options for this print task */
    setPrintOptions(printOptions) {
      this.printOptions = __spreadValues(__spreadValues({}, this.printOptions), printOptions);
    }
    /** Reset print task state (pages printed) */
    reset() {
      this.pagesPrinted = 0;
    }
    /**
     * Validate page before printing. Checks:
     *  - Page color is supported by this print task
     *  - Page color matches print task color
     *  - Added pages not does not exceed {@link pagesPrinted}
     *
     * Also increments {@link pagesPrinted} by quantity.
     **/
    validatePage(image, quantity) {
      var _a;
      if (this.pagesPrinted + quantity > ((_a = this.printOptions.totalPages) != null ? _a : 1)) {
        throw new Error("Trying to print too many pages (task totalPages may not be set correctly)");
      }
      if (!this.isSupportColor(image.pageColor)) {
        throw new Error(`Page color ${image.pageColor} is not supported by this print task`);
      }
      if (this.printOptions.pageColor !== image.pageColor) {
        throw new Error(`Page color ${image.pageColor} does not match print task color ${this.printOptions.pageColor}`);
      }
      this.pagesPrinted += quantity;
    }
    /** Wait for page print is finished */
    waitForPageFinished() {
      return Promise.resolve();
    }
    /** Printer's printhead resolution in pixels */
    printheadPixels() {
      var _a;
      return (_a = this.protocol.getClient().getModelMetadata()) == null ? void 0 : _a.printheadPixels;
    }
    /** End print, cleanup */
    printEnd() {
      return __async(this, null, function* () {
        const result = yield this.protocol.printEnd();
        this.emitPrintEndEvent();
        return result;
      });
    }
    /** Check if this print task supports a specified page color */
    isSupportColor(pageColor) {
      return pageColor === 0 /* SingleColor */;
    }
    makePacketProgressCallback(stepPercent = 5) {
      let lastReportedStep = -1;
      return (current, total) => {
        const percent = Math.floor(current / total * 100);
        const step = Math.floor(percent / stepPercent);
        if (step > lastReportedStep || current === total) {
          lastReportedStep = step;
          this.protocol.getClient().emit("printpacketprogress", new PrintPacketProgressEvent(percent));
        }
      };
    }
    emitProgressEvent(pagePrintProgress = 100, pageFeedProgress = 100) {
      this.protocol.getClient().emit(
        "printprogress",
        new PrintProgressEvent(this.pagesPrinted, this.printOptions.totalPages, pagePrintProgress, pageFeedProgress)
      );
    }
    emitPrintEndEvent() {
      this.protocol.getClient().emit("printend", new PrintEndEvent(this.pagesPrinted));
    }
  };

  // src/print_tasks/B1PrintTask.ts
  var B1PrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart7b(this.printOptions.totalPages, this.printOptions.pageColor)
      ]);
    }
    printPage(image, quantity) {
      this.validatePage(image, quantity != null ? quantity : 1);
      return this.protocol.sendAll(
        [
          PacketGenerator.pageStart(),
          PacketGenerator.setPageSize6b(image.rows, image.cols, quantity != null ? quantity : 1),
          ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
          PacketGenerator.pageEnd()
        ],
        this.printOptions.pageTimeoutMs,
        this.makePacketProgressCallback()
      );
    }
    waitForFinished() {
      this.protocol.setPacketTimeout(this.printOptions.statusTimeoutMs);
      return this.protocol.waitUntilPrintFinishedByStatusPoll(this.printOptions.totalPages, this.printOptions.statusPollIntervalMs).finally(() => this.protocol.setDefaultPacketTimeout());
    }
    isSupportColor(pageColor) {
      return pageColor === 0 /* SingleColor */ || pageColor === 1 /* DoubleColor */;
    }
  };

  // src/print_tasks/B21V1PrintTask.ts
  var B21V1PrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart1b()
      ]);
    }
    printPage(image, quantity) {
      return __async(this, null, function* () {
        this.validatePage(image, quantity != null ? quantity : 1);
        for (let i = 0; i < (quantity != null ? quantity : 1); i++) {
          yield this.protocol.sendAll(
            [
              // PacketGenerator.printClear(),
              PacketGenerator.pageStart(),
              PacketGenerator.setPageSize4b(image.rows, image.cols),
              ...PacketGenerator.writeImageData(image, {
                countsMode: "total",
                enableCheckLine: true,
                printheadPixels: this.printheadPixels()
              }),
              PacketGenerator.pageEnd()
            ],
            this.printOptions.pageTimeoutMs,
            this.makePacketProgressCallback()
          );
        }
      });
    }
    waitForFinished() {
      this.protocol.setPacketTimeout(this.printOptions.statusTimeoutMs);
      return this.protocol.waitUntilPrintFinishedByPrintEndPoll(this.printOptions.totalPages, this.printOptions.statusPollIntervalMs).finally(() => this.protocol.setDefaultPacketTimeout());
    }
  };

  // src/print_tasks/B21L2BPrintTask.ts
  var B21L2BPrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart1b()
      ]);
    }
    printPage(image, quantity) {
      return __async(this, null, function* () {
        this.validatePage(image, quantity != null ? quantity : 1);
        for (let i = 0; i < (quantity != null ? quantity : 1); i++) {
          yield Utils.doUntilTrue(() => this.protocol.pageStart(), 5, 500);
          yield this.protocol.sendAll(
            [
              PacketGenerator.setPageSize4b(image.rows, image.cols),
              ...PacketGenerator.writeImageData(image, {
                countsMode: "total",
                enableCheckLine: true,
                printheadPixels: this.printheadPixels()
              }),
              PacketGenerator.pageEnd()
            ],
            this.printOptions.pageTimeoutMs,
            this.makePacketProgressCallback()
          );
        }
      });
    }
    waitForPageFinished() {
      return __async(this, null, function* () {
        yield Utils.doUntilTrue(() => this.protocol.pageEnd(), 20, 500);
        this.emitProgressEvent();
      });
    }
    waitForFinished() {
      return Promise.resolve();
    }
  };

  // src/print_tasks/D110PrintTask.ts
  var D110PrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart1b()
      ]);
    }
    printPage(image, quantity) {
      this.validatePage(image, quantity != null ? quantity : 1);
      return this.protocol.sendAll(
        [
          PacketGenerator.printClear(),
          PacketGenerator.pageStart(),
          PacketGenerator.setPageSize4b(image.rows, image.cols),
          PacketGenerator.setPrintQuantity(quantity != null ? quantity : 1),
          ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
          PacketGenerator.pageEnd()
        ],
        this.printOptions.pageTimeoutMs,
        this.makePacketProgressCallback()
      );
    }
    waitForPageFinished() {
      this.protocol.setPacketTimeout(this.printOptions.statusTimeoutMs);
      return this.protocol.waitUntilPrintFinishedByStatusPoll(this.pagesPrinted, this.printOptions.statusPollIntervalMs).finally(() => this.protocol.setDefaultPacketTimeout());
    }
    waitForFinished() {
      return this.waitForPageFinished();
    }
  };

  // src/print_tasks/OldD11PrintTask.ts
  var OldD11PrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart1b()
      ]);
    }
    printPage(image, quantity) {
      this.validatePage(image, quantity != null ? quantity : 1);
      return this.protocol.sendAll(
        [
          PacketGenerator.printClear(),
          PacketGenerator.pageStart(),
          PacketGenerator.setPageSize2b(image.rows),
          PacketGenerator.setPrintQuantity(quantity != null ? quantity : 1),
          ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
          PacketGenerator.pageEnd()
        ],
        this.printOptions.pageTimeoutMs,
        this.makePacketProgressCallback()
      );
    }
    waitForFinished() {
      var _a;
      return this.protocol.waitUntilPrintFinishedByPageIndex(
        (_a = this.printOptions.totalPages) != null ? _a : 1,
        this.printOptions.statusTimeoutMs
      );
    }
  };

  // src/print_tasks/D110MV4PrintTask.ts
  var D110MV4PrintTask = class extends AbstractPrintTask {
    printInit() {
      const pkts = [];
      if ((this.printOptions.tubeWidthMm !== void 0 || this.printOptions.tubeType !== void 0) && this.printOptions.labelType !== 3 /* Continuous */) {
        throw new Error("When using tube parameters, labelType must set to Continuous");
      }
      pkts.push(
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.setDensity(this.printOptions.density)
      );
      if (this.printOptions.tubeType !== void 0 && this.printOptions.tubeWidthMm !== void 0) {
        pkts.push(PacketGenerator.setTubeTypeAndWidth(this.printOptions.tubeType, this.printOptions.tubeWidthMm));
      }
      if (this.printOptions.halfCut !== void 0) {
        pkts.push(PacketGenerator.setHalfCut(this.printOptions.halfCut));
      }
      pkts.push(
        PacketGenerator.printStart9b(this.printOptions.totalPages, this.printOptions.pageColor, this.printOptions.speed)
      );
      return this.protocol.sendAll(pkts);
    }
    printPage(image, quantity) {
      return __async(this, null, function* () {
        this.validatePage(image, quantity != null ? quantity : 1);
        const statusPacket = PacketGenerator.printStatus();
        statusPacket.oneWay = true;
        yield this.protocol.send(statusPacket);
        return this.protocol.sendAll(
          [
            PacketGenerator.setPageSize13b(image.rows, image.cols, quantity != null ? quantity : 1, this.printOptions.cutHeight, this.printOptions.cutType),
            ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
            PacketGenerator.pageEnd()
          ],
          this.printOptions.pageTimeoutMs,
          this.makePacketProgressCallback()
        );
      });
    }
    waitForFinished() {
      var _a;
      this.protocol.setPacketTimeout(this.printOptions.statusTimeoutMs);
      return this.protocol.waitUntilPrintFinishedByStatusPoll((_a = this.printOptions.totalPages) != null ? _a : 1, this.printOptions.statusPollIntervalMs).finally(() => this.protocol.setDefaultPacketTimeout());
    }
    printEnd() {
      return __async(this, null, function* () {
        const pkt = PacketGenerator.heartbeat(1 /* Advanced1 */);
        pkt.oneWay = true;
        const result = yield this.protocol.printEnd();
        yield this.protocol.send(pkt);
        this.emitPrintEndEvent();
        return result;
      });
    }
    isSupportColor(pageColor) {
      return pageColor === 0 /* SingleColor */ || pageColor === 1 /* DoubleColor */;
    }
  };

  // src/print_tasks/H1SPrintTask.ts
  var H1SPrintTask = class extends AbstractPrintTask {
    printInit() {
      return this.protocol.sendAll([
        PacketGenerator.setDensity(this.printOptions.density),
        PacketGenerator.setLabelType(this.printOptions.labelType),
        PacketGenerator.printStart2b(this.printOptions.totalPages)
      ]);
    }
    printPage(image, quantity) {
      this.validatePage(image, quantity != null ? quantity : 1);
      return this.protocol.sendAll(
        [
          PacketGenerator.pageStart(),
          PacketGenerator.setPageSize9b(image.rows, image.cols, quantity != null ? quantity : 1),
          ...PacketGenerator.writeImageData(image, { printheadPixels: this.printheadPixels() }),
          PacketGenerator.pageEnd()
        ],
        this.printOptions.pageTimeoutMs,
        this.makePacketProgressCallback()
      );
    }
    waitForFinished() {
      this.protocol.setPacketTimeout(this.printOptions.statusTimeoutMs);
      return this.protocol.waitUntilPrintFinishedByStatusPoll(this.printOptions.totalPages, this.printOptions.statusPollIntervalMs).finally(() => this.protocol.setDefaultPacketTimeout());
    }
  };

  // src/print_tasks/index.ts
  var PrintTaskCapability = /* @__PURE__ */ ((PrintTaskCapability2) => {
    PrintTaskCapability2[PrintTaskCapability2["SupportDoubleColor"] = 0] = "SupportDoubleColor";
    PrintTaskCapability2[PrintTaskCapability2["SupportTubePrinting"] = 1] = "SupportTubePrinting";
    return PrintTaskCapability2;
  })(PrintTaskCapability || {});
  var printTasks = {
    D11_V1: OldD11PrintTask,
    D110: D110PrintTask,
    B1: B1PrintTask,
    B21_V1: B21V1PrintTask,
    B21_L2B: B21L2BPrintTask,
    D110M_V4: D110MV4PrintTask,
    H1S: H1SPrintTask
  };
  var printTaskNames = Object.keys(printTasks);
  var printTasksCapabilities = {
    D11_V1: [],
    D110: [],
    B1: [0 /* SupportDoubleColor */],
    B21_V1: [],
    B21_L2B: [],
    D110M_V4: [0 /* SupportDoubleColor */, 1 /* SupportTubePrinting */],
    H1S: []
  };
  var modelPrintTasks = {
    D11_V1: ["D11" /* D11 */, "D11S" /* D11S */],
    B21_V1: ["B21" /* B21 */],
    B21_L2B: ["B21_L2B" /* B21_L2B */],
    D110: ["B21S" /* B21S */, "B21S_C2B" /* B21S_C2B */, "D110" /* D110 */, { m: "D11" /* D11 */, v: 1 }, { m: "D11" /* D11 */, v: 2 }],
    B1: ["D110_M" /* D110_M */, "B1" /* B1 */, "B21_C2B" /* B21_C2B */, "M2_H" /* M2_H */, "N1" /* N1 */, "D101" /* D101 */],
    D110M_V4: [{ m: "D110_M" /* D110_M */, v: 4 }, "D11_H" /* D11_H */, "B21_PRO" /* B21_PRO */, "B1_PRO" /* B1_PRO */, "C1" /* C1 */, "EP1C" /* EP1C */],
    H1S: ["H1S" /* H1S */]
  };
  var findPrintTask = (model, protocolVersion) => {
    const tasks = Object.keys(modelPrintTasks);
    const foundExact = tasks.find(
      (key) => {
        var _a;
        return (_a = modelPrintTasks[key]) == null ? void 0 : _a.find(
          (o) => typeof o === "object" && o.v === protocolVersion && o.m === model
        );
      }
    );
    const task = foundExact != null ? foundExact : tasks.find((key) => {
      var _a;
      return (_a = modelPrintTasks[key]) == null ? void 0 : _a.includes(model);
    });
    if (!task && protocolVersion && protocolVersion >= 4) {
      return "D110M_V4";
    }
    return task;
  };

  // src/packets/dto.ts
  var PrintError = class extends Error {
    constructor(message, reasonId) {
      super(message);
      this.reasonId = reasonId;
    }
  };

  // src/packets/protocol.ts
  var import_crc_322 = __toESM(require_crc32());
  var NiimbotProtocol = class {
    constructor(client) {
      this.DEFAULT_PACKET_TIMEOUT = 1e3;
      this.packetTimeout = this.DEFAULT_PACKET_TIMEOUT;
      this.client = client;
    }
    getClient() {
      return this.client;
    }
    getPacketTimeout() {
      return this.packetTimeout;
    }
    setPacketTimeout(value) {
      this.packetTimeout = value;
    }
    setDefaultPacketTimeout() {
      this.packetTimeout = this.DEFAULT_PACKET_TIMEOUT;
    }
    newPrintTask(name, options) {
      return new printTasks[name](this, options);
    }
    /** Send packet and wait for response */
    send(packet, forceTimeout) {
      return __async(this, null, function* () {
        return this.client.sendPacketWaitResponse(packet, forceTimeout != null ? forceTimeout : this.packetTimeout);
      });
    }
    /** Send packet, wait for response, repeat if failed */
    sendRepeatUntilSuccess(packet, attempts, forceTimeout) {
      return __async(this, null, function* () {
        let lastError = new Error("Unknown error");
        for (let attempt = 0; attempt < attempts; attempt++) {
          try {
            return yield this.client.sendPacketWaitResponse(packet, forceTimeout != null ? forceTimeout : this.packetTimeout);
          } catch (e) {
            console.warn(`Attempt ${attempt + 1} failed:`, e);
            lastError = e;
          }
        }
        throw lastError;
      });
    }
    sendAll(packets, forceTimeout, onProgress) {
      return __async(this, null, function* () {
        const total = packets.length;
        for (let i = 0; i < total; i++) {
          onProgress == null ? void 0 : onProgress(i + 1, total);
          yield this.send(packets[i], forceTimeout);
        }
      });
    }
    cancelStatusPoll() {
      if (this.statusPollTimer) {
        clearInterval(this.statusPollTimer);
        this.statusPollTimer = void 0;
      }
    }
    waitUntilPrintFinishedByPageIndex(pagesToPrint, timeoutMs = 5e3) {
      return __async(this, null, function* () {
        return new Promise((resolve, reject) => {
          const listener = (evt) => {
            if (evt.packet.command === 224 /* In_PrinterPageIndex */) {
              Validators.arrayLengthEquals(evt.packet.data, 2);
              const page = Utils.bytesToU16(evt.packet.data);
              this.client.emit("printprogress", new PrintProgressEvent(page, pagesToPrint, 100, 100));
              clearTimeout(this.statusTimeoutTimer);
              this.statusTimeoutTimer = setTimeout(() => {
                this.client.off("packetreceived", listener);
                reject(new Error("Timeout waiting print status"));
              }, timeoutMs != null ? timeoutMs : 5e3);
              if (page === pagesToPrint) {
                clearTimeout(this.statusTimeoutTimer);
                this.client.off("packetreceived", listener);
                resolve();
              }
            }
          };
          clearTimeout(this.statusTimeoutTimer);
          this.statusTimeoutTimer = setTimeout(() => {
            this.client.off("packetreceived", listener);
            reject(new Error("Timeout waiting print status"));
          }, timeoutMs);
          this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
          this.client.on("packetreceived", listener);
        });
      });
    }
    /**
     * Poll printer every {@link pollIntervalMs} and resolve when printer pages equals {@link pagesToPrint}.
     *
     * printprogress event is firing during this process.
     *
     * @param pagesToPrint Total pages to print.
     * @param pollIntervalMs Poll interval in milliseconds.
     */
    waitUntilPrintFinishedByStatusPoll(pagesToPrint, pollIntervalMs = 300) {
      return __async(this, null, function* () {
        return new Promise((resolve, reject) => {
          this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
          this.statusPollTimer = setInterval(() => {
            this.getPrintStatus(2).then((status) => {
              this.client.emit(
                "printprogress",
                new PrintProgressEvent(status.page, pagesToPrint, status.pagePrintProgress, status.pageFeedProgress)
              );
              if (status.page === pagesToPrint) {
                this.cancelStatusPoll();
                resolve();
              }
            }).catch((e) => {
              this.cancelStatusPoll();
              reject(e);
            });
          }, pollIntervalMs != null ? pollIntervalMs : 300);
        });
      });
    }
    /**
     * Poll printer every {@link pollIntervalMs} and resolve when printer pages equals {@link pagesToPrint}.
     *
     * printprogress event is firing during this process.
     *
     * PrintEnd call is not needed after this functions is done running.
     *
     * @param pagesToPrint Total pages to print.
     * @param pollIntervalMs Poll interval in milliseconds.
     */
    waitUntilPrintFinishedByPrintEndPoll(pagesToPrint, pollIntervalMs = 500) {
      return __async(this, null, function* () {
        return new Promise((resolve, reject) => {
          this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
          this.statusPollTimer = setInterval(() => {
            this.printEnd().then((printEndDone) => {
              if (!printEndDone) {
                this.client.emit("printprogress", new PrintProgressEvent(1, pagesToPrint, 0, 0));
              } else {
                this.client.emit("printprogress", new PrintProgressEvent(pagesToPrint, pagesToPrint, 100, 100));
                this.cancelStatusPoll();
                resolve();
              }
            }).catch((e) => {
              this.cancelStatusPoll();
              reject(e);
            });
          }, pollIntervalMs != null ? pollIntervalMs : 500);
        });
      });
    }
    firmwareUpgrade(data, version) {
      return __async(this, null, function* () {
        const chunkSize = 200;
        const totalChunks = Math.ceil(data.byteLength / chunkSize);
        const crc = import_crc_322.default.buf(data);
        yield this.send(PacketGenerator.startFirmwareUpgrade(version));
        yield this.client.waitForPacket([144 /* In_RequestFirmwareCrc */], true, 5e3);
        yield this.send(PacketGenerator.sendFirmwareChecksum(crc));
        let rejectFirmwareError;
        const firmwareError = new Promise((_, reject) => {
          rejectFirmwareError = reject;
        });
        const packetListener = (e) => {
          const packet = e.packet;
          if (packet.command === 158 /* In_FirmwareResult */ && packet instanceof NiimbotCrc32Packet && packet.dataLength === 1 && packet.data[0] === 0) {
            rejectFirmwareError(new Error("Firmware rejected: invalid file or downgrade protection."));
          }
        };
        this.client.on("packetreceived", packetListener);
        try {
          while (true) {
            const packet = yield Promise.race([
              this.client.waitForPacket(
                [154 /* In_RequestFirmwareChunk */, 158 /* In_FirmwareResult */],
                true,
                5e3
              ),
              firmwareError
            ]);
            if (!(packet instanceof NiimbotCrc32Packet)) {
              throw new Error("Not a firmware packet");
            }
            if (packet.command === 158 /* In_FirmwareResult */) {
              throw new Error("Firmware error");
            }
            const offset = packet.chunkNumber * chunkSize;
            if (offset >= data.byteLength) {
              break;
            }
            const chunk = data.subarray(offset, offset + chunkSize);
            yield Promise.race([this.send(PacketGenerator.sendFirmwareChunk(packet.chunkNumber, chunk)), firmwareError]);
            this.client.emit("firmwareprogress", new FirmwareProgressEvent(packet.chunkNumber + 1, totalChunks));
          }
        } finally {
          this.client.off("packetreceived", packetListener);
        }
        yield this.send(PacketGenerator.firmwareNoMoreChunks());
        const checkResult = yield this.client.waitForPacket([157 /* In_FirmwareCheckResult */], true, 5e3);
        if (!PacketParser.parseFirmwareCheckResultResponse(checkResult)) {
          throw new Error("Firmware check error (maybe CRC does not match)");
        }
        yield this.send(PacketGenerator.firmwareCommit());
        const firmwareResult = yield this.client.waitForPacket([158 /* In_FirmwareResult */], true, 5e3);
        if (!PacketParser.parseFirmwareResultResponse(firmwareResult)) {
          throw new Error("Firmware error");
        }
      });
    }
    getPrintStatus(tries = 1) {
      return __async(this, null, function* () {
        const packet = yield this.sendRepeatUntilSuccess(PacketGenerator.printStatus(), tries != null ? tries : 1);
        const status = PacketParser.parsePrintStatusResponse(packet);
        if (status.error !== 0) {
          throw new PrintError(`Print error ${status.error} (${ResponseCommandId2[packet.command]} packet flag)`, status.error);
        }
        return status;
      });
    }
    sendConnect() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.connect());
        return PacketParser.parseConnectResponse(packet);
      });
    }
    getPrinterStatusData() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterStatusData());
        return PacketParser.parsePrinterStatusDataResponse(packet);
      });
    }
    connectNegotiate() {
      return __async(this, null, function* () {
        const result = {
          protocolVersion: 0,
          supportColor: false,
          connectResult: 0 /* Disconnect */
        };
        result.connectResult = yield this.sendConnect();
        if (result.connectResult === 2 /* ConnectedNew */) {
          result.protocolVersion = 1;
        } else if (result.connectResult === 3 /* ConnectedV3 */) {
          const statusData = yield this.getPrinterStatusData();
          result.protocolVersion = statusData.protocolVersion;
          result.supportColor = statusData.supportColor;
        }
        return result;
      });
    }
    getPrinterModel() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(8 /* PrinterModelId */));
        return PacketParser.parsePrinterInfoModelIdResponse(packet);
      });
    }
    /** Read paper nfc tag info */
    rfidInfo() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.rfidInfo());
        return PacketParser.parseRfidInfoResponse(packet);
      });
    }
    /** Read ribbon nfc tag info */
    rfidInfo2() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.rfidInfo2());
        return PacketParser.parseRfidInfoResponse(packet);
      });
    }
    heartbeatPrinterInfo() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.heartbeat(3 /* PrinterInfo */));
        return PacketParser.parseHeartbeatPrinterInfoResponse(packet);
      });
    }
    heartbeat() {
      return __async(this, null, function* () {
        const printerInfo = this.client.getPrinterInfo();
        let heartbeatType = 1 /* Advanced1 */;
        if (printerInfo.protocolVersion !== void 0 && printerInfo.protocolVersion >= 3) {
          heartbeatType = 4 /* Advanced2 */;
        }
        const packet = yield this.send(PacketGenerator.heartbeat(heartbeatType), 500);
        if (packet.command === 221 /* In_HeartbeatAdvanced1 */) {
          const printerInfo2 = this.client.getPrinterInfo();
          return PacketParser.parseHeartbeatAdvanced1Response(packet, printerInfo2.modelId);
        }
        if (packet.command === 217 /* In_HeartbeatAdvanced2 */) {
          return PacketParser.parseHeartbeatAdvanced2Response(packet);
        }
        throw new Error("Unsupported heartbeat response");
      });
    }
    getBatteryChargeLevel() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(10 /* BatteryChargeLevel */));
        return PacketParser.parseBatteryChargeLevelResponse(packet);
      });
    }
    getAutoShutDownTime() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(7 /* AutoShutdownTime */));
        return PacketParser.parseAutoShutdownTimeResponse(packet);
      });
    }
    getSoftwareVersion() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(9 /* SoftWareVersion */));
        return PacketParser.parsePrinterVersionResponse(packet);
      });
    }
    getHardwareVersion() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(12 /* HardWareVersion */));
        return PacketParser.parsePrinterVersionResponse(packet);
      });
    }
    setAutoShutDownTime(time) {
      return __async(this, null, function* () {
        yield this.send(PacketGenerator.setAutoShutDownTime(time));
      });
    }
    getLabelType() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(3 /* LabelType */));
        return PacketParser.parseLabelTypeResponse(packet);
      });
    }
    getPrinterSerialNumber() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(11 /* SerialNumber */));
        return PacketParser.parsePrinterSerialNumberResponse(packet);
      });
    }
    getPrinterBluetoothMacAddress() {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getPrinterInfo(13 /* BluetoothAddress */));
        return PacketParser.parsePrinterBluetoothMacAddressResponse(packet);
      });
    }
    isSoundEnabled(soundType) {
      return __async(this, null, function* () {
        const packet = yield this.send(PacketGenerator.getSoundSettings(soundType));
        return PacketParser.parseIsSoundEnabledResponse(packet);
      });
    }
    setSoundEnabled(soundType, value) {
      return __async(this, null, function* () {
        yield this.send(PacketGenerator.setSoundSettings(soundType, value));
      });
    }
    /** Clear settings */
    printerReset() {
      return __async(this, null, function* () {
        yield this.send(PacketGenerator.printerReset());
      });
    }
    /** False returned when pageStart refused */
    pageStart() {
      return __async(this, null, function* () {
        const response = yield this.send(PacketGenerator.pageStart());
        return PacketParser.parseBooleanResponse(response);
      });
    }
    /** False returned when pageEnd refused */
    pageEnd() {
      return __async(this, null, function* () {
        const response = yield this.send(PacketGenerator.pageEnd());
        return PacketParser.parseBooleanResponse(response);
      });
    }
    /** False returned when printEnd refused */
    printEnd() {
      return __async(this, null, function* () {
        this.cancelStatusPoll();
        const response = yield this.send(PacketGenerator.printEnd());
        return PacketParser.parseBooleanResponse(response);
      });
    }
    /**
     * When 1 or 2 sent to B1, it starts to throw out some, paper (~15cm)
     * @param value success
     */
    labelPositioningCalibration(value) {
      return __async(this, null, function* () {
        const response = yield this.send(PacketGenerator.labelPositioningCalibration(value));
        return PacketParser.parseBooleanResponse(response);
      });
    }
    setPrinterTime() {
      return __async(this, arguments, function* (value = /* @__PURE__ */ new Date()) {
        yield this.send(PacketGenerator.setPrinterTime(value));
      });
    }
    getPaperInfo() {
      return __async(this, null, function* () {
        const response = yield this.send(PacketGenerator.getPaperInfo());
        let totalHeightIncludesGap = false;
        const modelId = this.client.getPrinterInfo().modelId;
        if (modelId !== void 0 && [785].includes(modelId)) {
          totalHeightIncludesGap = true;
        }
        return PacketParser.parsePaperInfoResponse(response, totalHeightIncludesGap);
      });
    }
    /** Only for protocol >= 5 */
    gePrinterCapabilities() {
      return __async(this, null, function* () {
        const response = yield this.send(PacketGenerator.getPrinterCapabilities());
        return PacketParser.parsePrinterCapabilities(response);
      });
    }
  };

  // src/packets/data_reader.ts
  var SequentialDataReader = class {
    constructor(bytes) {
      this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      this.offset = 0;
    }
    /** Check available bytes */
    canRead(count) {
      return this.offset + count <= this.view.byteLength;
    }
    /** Check available bytes and throw exception if EOF met */
    willRead(count) {
      if (!this.canRead(count)) {
        throw new Error("Tried to read too much data");
      }
    }
    /** Skip bytes */
    skip(len) {
      this.willRead(len);
      this.offset += len;
    }
    /** Read fixed length bytes */
    readBytes(len) {
      this.willRead(len);
      const part = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, len).slice();
      this.offset += len;
      return part;
    }
    /** Read variable length bytes */
    readVBytes() {
      return this.readBytes(this.readI8());
    }
    /** Read variable length string */
    readVString() {
      return Utils.u8ArrayToString(this.readVBytes());
    }
    /** Read 8 bit signed int */
    readI8() {
      this.willRead(1);
      return this.view.getInt8(this.offset++);
    }
    /** Read 8 bit unsigned int */
    readU8() {
      this.willRead(1);
      return this.view.getUint8(this.offset++);
    }
    /** Read 16 bit signed int */
    readI16() {
      this.willRead(2);
      const result = this.view.getInt16(this.offset, false);
      this.offset += 2;
      return result;
    }
    /** Read 16 bit unsigned int */
    readU16() {
      this.willRead(2);
      const result = this.view.getUint16(this.offset, false);
      this.offset += 2;
      return result;
    }
    /** Read 32 bit signed int */
    readI32() {
      this.willRead(4);
      const result = this.view.getInt32(this.offset, false);
      this.offset += 4;
      return result;
    }
    /** Read 32 bit unsigned int */
    readU32() {
      this.willRead(4);
      const result = this.view.getUint32(this.offset, false);
      this.offset += 4;
      return result;
    }
    readBool() {
      return this.readU8() !== 0;
    }
    /** Check EOF condition */
    end() {
      if (this.offset !== this.view.byteLength) {
        throw new Error("Extra data left");
      }
    }
  };

  // src/client/abstract_client.ts
  var NIIMBOT_CLIENT_DEFAULTS = {
    packetIntervalMs: 10,
    heartbeatIntervalMs: 2e3
  };
  var createPrinterInfo = () => {
    return {
      settings: {
        connectionSound: false,
        powerSound: false,
        autoShutdownTime: 1 /* ShutdownTime1 */
      }
    };
  };
  var NiimbotAbstractClient = class extends import_index.default {
    constructor() {
      super();
      this.printerInfo = createPrinterInfo();
      this.rfidInfo = {};
      this.heartbeatData = {};
      this.heartbeatFails = 0;
      this.heartbeatIntervalMs = NIIMBOT_CLIENT_DEFAULTS.heartbeatIntervalMs;
      this.heartbeatAutoStart = true;
      this.heartbeatMaxFails = 5;
      this.skipNextHeartbeatRfidCheck = false;
      this.mutex = new Mutex();
      this.debug = false;
      this.packetBuf = new Uint8Array();
      this.fetchRfidOnPrintEnd = true;
      /** @see https://github.com/MultiMote/niimblue/issues/5 */
      this.packetIntervalMs = NIIMBOT_CLIENT_DEFAULTS.packetIntervalMs;
      this.protocol = new NiimbotProtocol(this);
      this.on("connect", () => {
        if (this.heartbeatAutoStart) {
          this.startHeartbeat();
        }
      });
      this.on("disconnect", () => {
        this.stopHeartbeat();
        this.packetBuf = new Uint8Array();
        this.printerInfo = createPrinterInfo();
        this.rfidInfo = {};
        this.heartbeatData = {};
      });
      this.on("printend", () => {
        if (this.fetchRfidOnPrintEnd) {
          void this.fetchRfidInfo();
        }
      });
    }
    setHeartbeatAutoStart(value) {
      this.heartbeatAutoStart = value;
    }
    getHeartbeatAutoStart() {
      return this.heartbeatAutoStart;
    }
    /**
     * Send packet and wait for response for {@link timeoutMs} milliseconds.
     *
     * If {@link NiimbotPacket.validResponseIds() validResponseIds} is defined, it will wait for packet with this command id.
     *
     * @throws {@link PrintError} when {@link ResponseCommandId.In_PrintError} or {@link ResponseCommandId.In_NotSupported} received.
     *
     * @returns {NiimbotPacket} Packet object.
     */
    sendPacketWaitResponse(packet, timeoutMs = 1e3) {
      return __async(this, null, function* () {
        return this.mutex.runExclusive(() => __async(this, null, function* () {
          yield this.sendPacket(packet, true);
          if (packet.oneWay) {
            return new NiimbotPacket(-1 /* In_Invalid */, []);
          }
          return this.waitForPacket(packet.validResponseIds, true, timeoutMs);
        }));
      });
    }
    /**
     * Send wait for response for {@link timeoutMs} milliseconds.
     *
     * If {@link ids} is set, it will wait for packet with this command ids.
     *
     * @throws {@link PrintError} when {@link ResponseCommandId.In_PrintError} or {@link ResponseCommandId.In_NotSupported} received and {@link catchErrorPackets} is true.
     *
     * @returns {NiimbotPacket} Packet object.
     */
    waitForPacket() {
      return __async(this, arguments, function* (ids = [], catchErrorPackets = true, timeoutMs = 1e3) {
        return new Promise((resolve, reject) => {
          let timeout = void 0;
          const listener = (evt) => {
            var _a;
            const pktIn = evt.packet;
            const cmdIn = pktIn.command;
            if (ids.length === 0 || ids.includes(cmdIn) || catchErrorPackets && [219 /* In_PrintError */, 0 /* In_NotSupported */].includes(cmdIn)) {
              clearTimeout(timeout);
              this.off("packetreceived", listener);
              if (cmdIn === 219 /* In_PrintError */) {
                Validators.arrayLengthEquals(pktIn.data, 1);
                const errorName = (_a = PrinterErrorCode[pktIn.data[0]]) != null ? _a : "unknown";
                reject(new PrintError(`Print error ${pktIn.data[0]}: ${errorName}`, pktIn.data[0]));
              } else if (cmdIn === 0 /* In_NotSupported */) {
                reject(new PrintError("Feature not supported", 0));
              } else {
                resolve(pktIn);
              }
            }
          };
          timeout = setTimeout(() => {
            this.off("packetreceived", listener);
            reject(new Error(`Timeout waiting response (waited for ${Utils.bufToHex(ids, ", ")})`));
          }, timeoutMs != null ? timeoutMs : 1e3);
          this.on("packetreceived", listener);
        });
      });
    }
    /**
     * Convert raw bytes to packet objects and fire events. Defragmentation included.
     * @param data Bytes to process.
     */
    processRawPacket(data) {
      if (data.byteLength === 0) {
        return;
      }
      if (data instanceof DataView) {
        data = new Uint8Array(data.buffer);
      }
      this.packetBuf = Utils.u8ArrayAppend(this.packetBuf, data);
      if (this.packetBuf.length > 1 && !Utils.hasSubarrayAtPos(this.packetBuf, NiimbotPacket.HEAD, 0)) {
        console.warn("Dropping invalid buffer", Utils.bufToHex(this.packetBuf));
        this.packetBuf = new Uint8Array();
      }
      try {
        const packets = PacketParser.parsePacketBundle(this.packetBuf);
        if (packets.length > 0) {
          this.emit("rawpacketreceived", new RawPacketReceivedEvent(this.packetBuf));
          packets.forEach((p) => {
            this.emit("packetreceived", new PacketReceivedEvent(p));
          });
          this.packetBuf = new Uint8Array();
        }
      } catch (_e) {
        if (this.debug) {
          console.info(`Incomplete packet, ignoring:${Utils.bufToHex(this.packetBuf)}`, _e);
        }
      }
    }
    sendPacket(packet, force) {
      return __async(this, null, function* () {
        yield this.sendRaw(packet.toBytes(), force);
        this.emit("packetsent", new PacketSentEvent(packet));
      });
    }
    /**
     * Send "connect" packet and fetch the protocol version.
     **/
    connectNegotiate() {
      return __async(this, null, function* () {
        const result = yield this.protocol.connectNegotiate();
        this.printerInfo.connectResult = result.connectResult;
        this.printerInfo.protocolVersion = result.protocolVersion;
        this.printerInfo.supportColor = result.supportColor;
      });
    }
    /**
     * Fetch printer information and store it
     */
    fetchPrinterInfo() {
      return __async(this, null, function* () {
        var _a, _b, _c;
        const safeGet = (promise, msg) => promise.catch((e) => {
          console.warn(`Unable to get ${msg} (${e})`);
          return void 0;
        });
        this.printerInfo.modelId = yield this.protocol.getPrinterModel();
        this.printerInfo.serial = yield safeGet(this.protocol.getPrinterSerialNumber(), "serial number");
        this.printerInfo.mac = yield safeGet(this.protocol.getPrinterBluetoothMacAddress(), "bluetooth address");
        this.printerInfo.batteryPercents = yield safeGet(this.protocol.getBatteryChargeLevel(), "charge level");
        this.printerInfo.settings.autoShutdownTime = (_a = yield safeGet(this.protocol.getAutoShutDownTime(), "auto shutdown time")) != null ? _a : 1 /* ShutdownTime1 */;
        this.printerInfo.settings.connectionSound = (_b = yield safeGet(this.protocol.isSoundEnabled(1 /* BluetoothConnectionSound */), "sound value")) != null ? _b : false;
        this.printerInfo.settings.powerSound = (_c = yield safeGet(this.protocol.isSoundEnabled(2 /* PowerSound */), "sound value")) != null ? _c : false;
        try {
          const i = yield this.protocol.heartbeatPrinterInfo();
          this.printerInfo.printheadWidth = i.printheadWidth;
          this.printerInfo.hardwareVersion = i.hardwareVersion;
          this.printerInfo.softwareVersion = i.softwareVersion;
          this.printerInfo.resolutionClass = i.resolutionClass;
        } catch (e) {
          console.warn(`Unable to get printhead width and some other info (${e})`);
          this.printerInfo.hardwareVersion = yield safeGet(this.protocol.getHardwareVersion(), "hardware version");
          this.printerInfo.softwareVersion = yield safeGet(this.protocol.getSoftwareVersion(), "software version");
        }
        if (this.printerInfo.protocolVersion !== void 0 && this.printerInfo.protocolVersion >= 4) {
          this.printerInfo.capabilities = yield safeGet(this.protocol.gePrinterCapabilities(), "printer capabilities");
        }
        this.emit("printerinfofetched", new PrinterInfoFetchedEvent(this.printerInfo));
        return this.printerInfo;
      });
    }
    /**
     * Fetch label and ribbon RFID information and store it. Do not throws exceptions.
     */
    fetchRfidInfo() {
      return __async(this, null, function* () {
        const info = {};
        try {
          info.labelRfidInfo = yield this.protocol.rfidInfo();
        } catch (e) {
          console.warn("Unable to fetch RFID info", e);
        }
        try {
          info.paperInfo = yield this.protocol.getPaperInfo();
        } catch (e) {
        }
        try {
          info.ribbonRfidInfo = yield this.protocol.rfidInfo2();
        } catch (e) {
        }
        this.rfidInfo = info;
        this.emit("rfidinfofetched", new RfidInfoFetchedEvent(info));
        return info;
      });
    }
    /**
     * Calls {@link connectNegotiate} (exceptions are not ignored) then calls {@link fetchPrinterInfo} and {@link fetchRfidInfo} (exceptions ignored)
     * @param cleanup cleanup/disconnect function, called when initialNegotiate fails
     */
    negotiateAndGetPrinterInfo(cleanup) {
      return __async(this, null, function* () {
        try {
          yield this.connectNegotiate();
        } catch (e) {
          if (cleanup) cleanup();
          throw new Error(`Unable to perform initial negotiate: ${e}`);
        }
        try {
          yield this.fetchPrinterInfo();
        } catch (e) {
          if (cleanup) cleanup();
          throw new Error(`Unable to fetch printer info: ${e}`);
        }
        yield this.fetchRfidInfo();
        this.skipNextHeartbeatRfidCheck = true;
      });
    }
    /**
     * Fetch heartbeat information and store it. Emits `heartbeat`/`heartbeatfailed` event.  Do not throws exceptions.
     */
    fetchHeartbeatData() {
      return __async(this, null, function* () {
        try {
          const data = yield this.protocol.heartbeat();
          this.heartbeatFails = 0;
          this.heartbeatReceived(data);
          this.emit("heartbeat", new HeartbeatEvent(data));
          this.heartbeatData = data;
          return data;
        } catch (e) {
          console.error(e);
          this.heartbeatFails++;
          this.emit("heartbeatfailed", new HeartbeatFailedEvent(this.heartbeatFails));
          if (this.heartbeatFails > 0 && this.heartbeatFails >= this.heartbeatMaxFails) {
            yield this.disconnect();
          }
        }
        return void 0;
      });
    }
    setSoundEnabled(soundType, value) {
      return __async(this, null, function* () {
        yield this.protocol.setSoundEnabled(soundType, value);
        if (soundType === 1 /* BluetoothConnectionSound */) {
          this.printerInfo.settings.connectionSound = value;
        }
        if (soundType === 2 /* PowerSound */) {
          this.printerInfo.settings.powerSound = value;
        }
        this.emit("printerinfofetched", new PrinterInfoFetchedEvent(this.printerInfo));
      });
    }
    setAutoShutdownTime(value) {
      return __async(this, null, function* () {
        yield this.protocol.setAutoShutDownTime(value);
        this.printerInfo.settings.autoShutdownTime = value;
        this.emit("printerinfofetched", new PrinterInfoFetchedEvent(this.printerInfo));
      });
    }
    /**
     * Get the stored information about the printer. Call {@link fetchPrinterInfo} to update.
     */
    getPrinterInfo() {
      return this.printerInfo;
    }
    /**
     * Get the stored information about RFID tags. Call {@link fetchRfidInfo} to update.
     */
    getRfidInfo() {
      return this.rfidInfo;
    }
    /**
     * Get the stored heartbeat information about RFID tags. Call {@link fetchHeartbeatData} to update.
     */
    getHeartbeatData() {
      return this.heartbeatData;
    }
    /**
     * Set interval for {@link startHeartbeat}.
     *
     * @param intervalMs Heartbeat interval, default is 1000ms
     */
    setHeartbeatInterval(intervalMs) {
      this.heartbeatIntervalMs = intervalMs;
    }
    getHeartbeatInterval() {
      return this.heartbeatIntervalMs;
    }
    /**
     * Starts the heartbeat timer, "heartbeat" is emitted after packet received.
     *
     * If you need to change interval, call {@link setHeartbeatInterval} before.
     */
    startHeartbeat() {
      this.heartbeatFails = 0;
      this.stopHeartbeat();
      this.heartbeatTimer = setInterval(() => void this.fetchHeartbeatData(), this.heartbeatIntervalMs);
    }
    heartbeatReceived(data) {
      var _a, _b, _c;
      if (data.batteryPercents) {
        this.printerInfo.batteryPercents = data.batteryPercents;
      }
      if (this.skipNextHeartbeatRfidCheck) {
        this.skipNextHeartbeatRfidCheck = false;
      } else {
        const paperRfidChanged = ((_a = this.heartbeatData) == null ? void 0 : _a.paperRfidSuccess) !== (data == null ? void 0 : data.paperRfidSuccess);
        const ribbonRfidChanged = ((_b = this.heartbeatData) == null ? void 0 : _b.ribbonRfidSuccess) !== (data == null ? void 0 : data.ribbonRfidSuccess);
        const lidChanged = ((_c = this.heartbeatData) == null ? void 0 : _c.lidClosed) !== (data == null ? void 0 : data.lidClosed);
        if (lidChanged || paperRfidChanged || ribbonRfidChanged) {
          void this.fetchRfidInfo();
        }
      }
    }
    /**
     * Stops the heartbeat by clearing the interval timer.
     */
    stopHeartbeat() {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = void 0;
    }
    /**
     * Checks if the heartbeat timer has been started.
     */
    isHeartbeatStarted() {
      return this.heartbeatTimer === void 0;
    }
    /**
     * Get printer capabilities based on the printer model. Model library is hardcoded.
     **/
    getModelMetadata() {
      if (this.printerInfo.modelId === void 0) {
        return void 0;
      }
      return getPrinterMetaById(this.printerInfo.modelId);
    }
    /**
     * Determine print task version if any.
     **/
    getPrintTaskType() {
      const meta = this.getModelMetadata();
      if (meta === void 0) {
        return void 0;
      }
      return findPrintTask(meta.model, this.getPrinterInfo().protocolVersion);
    }
    /**
     * Set the interval between packets in milliseconds.
     */
    setPacketInterval(milliseconds) {
      this.packetIntervalMs = milliseconds;
    }
    getPacketInterval() {
      return this.packetIntervalMs;
    }
    /**
     * Enable some debug information logging.
     */
    setDebug(value) {
      this.debug = value;
    }
    getDebug() {
      return this.debug;
    }
    /**
     * Set max failed heartbeat attempts to disconnect. Use 0 to disable.
     */
    setHeartbeatMaxFails(value) {
      this.heartbeatMaxFails = value;
    }
    getHeartbeatMaxFails() {
      return this.heartbeatMaxFails;
    }
    isFetchRfidOnPrintEnd() {
      return this.fetchRfidOnPrintEnd;
    }
    setFetchRfidOnPrintEnd(value) {
      this.fetchRfidOnPrintEnd = value;
    }
  };

  // src/client/bluetooth_impl.ts
  var getAllModelFirstLetters = () => [...new Set(modelsLibrary.map((m) => m.model[0]))];
  var BleDefaultConfiguration = class {
  };
  BleDefaultConfiguration.SERVICES = ["e7810a71-73ae-499d-8c15-faa9aef0c3f2"];
  BleDefaultConfiguration.NAME_FILTERS = [
    ...getAllModelFirstLetters().map((l) => ({ namePrefix: l }))
  ];
  var NiimbotBluetoothClient = class extends NiimbotAbstractClient {
    constructor() {
      super(...arguments);
      this.gattServer = void 0;
      this.channel = void 0;
      this.serviceUuidFilter = BleDefaultConfiguration.SERVICES;
    }
    getServiceUuidFilter() {
      return this.serviceUuidFilter;
    }
    setServiceUuidFilter(ids) {
      this.serviceUuidFilter = ids;
    }
    connect(options) {
      return __async(this, null, function* () {
        var _a, _b;
        yield this.disconnect();
        let device;
        if ((options == null ? void 0 : options.authorizedDevice) !== void 0) {
          device = options == null ? void 0 : options.authorizedDevice;
        } else {
          const options2 = {
            filters: [
              ...BleDefaultConfiguration.NAME_FILTERS,
              { services: (_a = this.serviceUuidFilter) != null ? _a : BleDefaultConfiguration.SERVICES }
            ]
          };
          device = yield navigator.bluetooth.requestDevice(options2);
        }
        if (device.gatt === void 0) {
          throw new Error("Device has no Bluetooth Generic Attribute Profile");
        }
        const disconnectListener = () => {
          this.gattServer = void 0;
          this.channel = void 0;
          this.emit("disconnect", new DisconnectEvent());
          device.removeEventListener("gattserverdisconnected", disconnectListener);
        };
        device.addEventListener("gattserverdisconnected", disconnectListener);
        const gattServer = yield device.gatt.connect();
        const channel = yield this.findSuitableBluetoothCharacteristic(
          gattServer
        );
        if (channel === void 0) {
          gattServer.disconnect();
          throw new Error("Suitable device characteristic not found");
        }
        console.log(`Found suitable characteristic ${channel.uuid}`);
        channel.addEventListener("characteristicvaluechanged", (event) => {
          const target = event.target;
          this.processRawPacket(target.value);
        });
        yield channel.startNotifications();
        this.gattServer = gattServer;
        this.channel = channel;
        yield this.negotiateAndGetPrinterInfo(() => this.disconnect());
        const result = {
          deviceName: device.name,
          result: (_b = this.printerInfo.connectResult) != null ? _b : 90 /* FirmwareErrors */
        };
        this.emit("connect", new ConnectEvent(result));
        return result;
      });
    }
    findSuitableBluetoothCharacteristic(gattServer) {
      return __async(this, null, function* () {
        const services = yield gattServer.getPrimaryServices();
        for (const service of services) {
          if (service.uuid.length < 5) {
            continue;
          }
          const characteristics = yield service.getCharacteristics();
          for (const c of characteristics) {
            if (c.properties.notify && c.properties.writeWithoutResponse) {
              return c;
            }
          }
        }
        return void 0;
      });
    }
    isConnected() {
      return this.gattServer !== void 0 && this.channel !== void 0;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    disconnect() {
      return __async(this, null, function* () {
        var _a;
        this.stopHeartbeat();
        (_a = this.gattServer) == null ? void 0 : _a.disconnect();
        this.gattServer = void 0;
        this.channel = void 0;
      });
    }
    sendRaw(data, force) {
      return __async(this, null, function* () {
        const send = () => __async(this, null, function* () {
          if (this.channel === void 0) {
            throw new Error("Channel is closed");
          }
          yield Utils.sleep(this.packetIntervalMs);
          yield this.channel.writeValueWithoutResponse(data.buffer);
          this.emit("rawpacketsent", new RawPacketSentEvent(data));
        });
        if (force) {
          yield send();
        } else {
          yield this.mutex.runExclusive(send);
        }
      });
    }
    getType() {
      return "bluetooth";
    }
  };

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/definitions.js
  var ScanMode;
  (function(ScanMode2) {
    ScanMode2[ScanMode2["SCAN_MODE_LOW_POWER"] = 0] = "SCAN_MODE_LOW_POWER";
    ScanMode2[ScanMode2["SCAN_MODE_BALANCED"] = 1] = "SCAN_MODE_BALANCED";
    ScanMode2[ScanMode2["SCAN_MODE_LOW_LATENCY"] = 2] = "SCAN_MODE_LOW_LATENCY";
  })(ScanMode || (ScanMode = {}));
  var ConnectionPriority;
  (function(ConnectionPriority2) {
    ConnectionPriority2[ConnectionPriority2["CONNECTION_PRIORITY_BALANCED"] = 0] = "CONNECTION_PRIORITY_BALANCED";
    ConnectionPriority2[ConnectionPriority2["CONNECTION_PRIORITY_HIGH"] = 1] = "CONNECTION_PRIORITY_HIGH";
    ConnectionPriority2[ConnectionPriority2["CONNECTION_PRIORITY_LOW_POWER"] = 2] = "CONNECTION_PRIORITY_LOW_POWER";
  })(ConnectionPriority || (ConnectionPriority = {}));

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/bleClient.js
  init_dist();
  init_conversion();

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/plugin.js
  init_dist();
  var BluetoothLe = registerPlugin("BluetoothLe", {
    web: () => Promise.resolve().then(() => (init_web(), web_exports)).then((m) => new m.BluetoothLeWeb())
  });

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/queue.js
  var makeQueue = () => {
    let currentTask = Promise.resolve();
    return (fn) => new Promise((resolve, reject) => {
      currentTask = currentTask.then(() => fn()).then(resolve).catch(reject);
    });
  };
  function getQueue(enabled) {
    if (enabled) {
      return makeQueue();
    }
    return (fn) => fn();
  }

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/validators.js
  function parseUUID(uuid) {
    if (typeof uuid !== "string") {
      throw new Error(`Invalid UUID type ${typeof uuid}. Expected string.`);
    }
    uuid = uuid.toLowerCase();
    const is128BitUuid = uuid.search(/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/) >= 0;
    if (!is128BitUuid) {
      throw new Error(`Invalid UUID format ${uuid}. Expected 128 bit string (e.g. "0000180d-0000-1000-8000-00805f9b34fb").`);
    }
    return uuid;
  }

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/bleClient.js
  var BleClientClass = class {
    constructor() {
      this.scanListener = null;
      this.eventListeners = /* @__PURE__ */ new Map();
      this.queue = getQueue(true);
    }
    enableQueue() {
      this.queue = getQueue(true);
    }
    disableQueue() {
      this.queue = getQueue(false);
    }
    initialize(options) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.initialize(options);
        }));
      });
    }
    isEnabled() {
      return __async(this, null, function* () {
        const enabled = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.isEnabled();
          return result.value;
        }));
        return enabled;
      });
    }
    requestEnable() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.requestEnable();
        }));
      });
    }
    enable() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.enable();
        }));
      });
    }
    disable() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.disable();
        }));
      });
    }
    startEnabledNotifications(callback) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          const key = `onEnabledChanged`;
          yield (_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove();
          const listener = yield BluetoothLe.addListener(key, (result) => {
            callback(result.value);
          });
          this.eventListeners.set(key, listener);
          yield BluetoothLe.startEnabledNotifications();
        }));
      });
    }
    stopEnabledNotifications() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          const key = `onEnabledChanged`;
          yield (_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove();
          this.eventListeners.delete(key);
          yield BluetoothLe.stopEnabledNotifications();
        }));
      });
    }
    isLocationEnabled() {
      return __async(this, null, function* () {
        const enabled = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.isLocationEnabled();
          return result.value;
        }));
        return enabled;
      });
    }
    openLocationSettings() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.openLocationSettings();
        }));
      });
    }
    openBluetoothSettings() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.openBluetoothSettings();
        }));
      });
    }
    openAppSettings() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.openAppSettings();
        }));
      });
    }
    setDisplayStrings(displayStrings) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.setDisplayStrings(displayStrings);
        }));
      });
    }
    requestDevice(options) {
      return __async(this, null, function* () {
        options = options ? this.validateRequestBleDeviceOptions(options) : void 0;
        const result = yield this.queue(() => __async(this, null, function* () {
          const device = yield BluetoothLe.requestDevice(options);
          return device;
        }));
        return result;
      });
    }
    requestLEScan(options, callback) {
      return __async(this, null, function* () {
        options = this.validateRequestBleDeviceOptions(options);
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          yield (_a = this.scanListener) === null || _a === void 0 ? void 0 : _a.remove();
          this.scanListener = yield BluetoothLe.addListener("onScanResult", (resultInternal) => {
            const result = Object.assign(Object.assign({}, resultInternal), { manufacturerData: this.convertObject(resultInternal.manufacturerData), serviceData: this.convertObject(resultInternal.serviceData), rawAdvertisement: resultInternal.rawAdvertisement ? this.convertValue(resultInternal.rawAdvertisement) : void 0 });
            callback(result);
          });
          yield BluetoothLe.requestLEScan(options);
        }));
      });
    }
    stopLEScan() {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          yield (_a = this.scanListener) === null || _a === void 0 ? void 0 : _a.remove();
          this.scanListener = null;
          yield BluetoothLe.stopLEScan();
        }));
      });
    }
    getDevices(deviceIds) {
      return __async(this, null, function* () {
        if (!Array.isArray(deviceIds)) {
          throw new Error("deviceIds must be an array");
        }
        return this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.getDevices({ deviceIds });
          return result.devices;
        }));
      });
    }
    getConnectedDevices(services) {
      return __async(this, null, function* () {
        if (!Array.isArray(services)) {
          throw new Error("services must be an array");
        }
        services = services.map(parseUUID);
        return this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.getConnectedDevices({ services });
          return result.devices;
        }));
      });
    }
    getBondedDevices() {
      return __async(this, null, function* () {
        return this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.getBondedDevices();
          return result.devices;
        }));
      });
    }
    connect(deviceId, onDisconnect, options) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          if (onDisconnect) {
            const key = `disconnected|${deviceId}`;
            yield (_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove();
            const listener = yield BluetoothLe.addListener(key, () => {
              onDisconnect(deviceId);
            });
            this.eventListeners.set(key, listener);
          }
          yield BluetoothLe.connect(Object.assign({ deviceId }, options));
        }));
      });
    }
    createBond(deviceId, options) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.createBond(Object.assign({ deviceId }, options));
        }));
      });
    }
    isBonded(deviceId) {
      return __async(this, null, function* () {
        const isBonded = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.isBonded({ deviceId });
          return result.value;
        }));
        return isBonded;
      });
    }
    disconnect(deviceId) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.disconnect({ deviceId });
        }));
      });
    }
    getServices(deviceId) {
      return __async(this, null, function* () {
        const services = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.getServices({ deviceId });
          return result.services;
        }));
        return services;
      });
    }
    discoverServices(deviceId) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.discoverServices({ deviceId });
        }));
      });
    }
    getMtu(deviceId) {
      return __async(this, null, function* () {
        const value = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.getMtu({ deviceId });
          return result.value;
        }));
        return value;
      });
    }
    requestConnectionPriority(deviceId, connectionPriority) {
      return __async(this, null, function* () {
        yield this.queue(() => __async(this, null, function* () {
          yield BluetoothLe.requestConnectionPriority({ deviceId, connectionPriority });
        }));
      });
    }
    readRssi(deviceId) {
      return __async(this, null, function* () {
        const value = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.readRssi({ deviceId });
          return parseFloat(result.value);
        }));
        return value;
      });
    }
    read(deviceId, service, characteristic, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        const value = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.read(Object.assign({
            deviceId,
            service,
            characteristic
          }, options));
          return this.convertValue(result.value);
        }));
        return value;
      });
    }
    write(deviceId, service, characteristic, value, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        return this.queue(() => __async(this, null, function* () {
          if (!(value === null || value === void 0 ? void 0 : value.buffer)) {
            throw new Error("Invalid data.");
          }
          let writeValue = value;
          if (Capacitor.getPlatform() !== "web") {
            writeValue = dataViewToHexString(value);
          }
          yield BluetoothLe.write(Object.assign({
            deviceId,
            service,
            characteristic,
            value: writeValue
          }, options));
        }));
      });
    }
    writeWithoutResponse(deviceId, service, characteristic, value, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        yield this.queue(() => __async(this, null, function* () {
          if (!(value === null || value === void 0 ? void 0 : value.buffer)) {
            throw new Error("Invalid data.");
          }
          let writeValue = value;
          if (Capacitor.getPlatform() !== "web") {
            writeValue = dataViewToHexString(value);
          }
          yield BluetoothLe.writeWithoutResponse(Object.assign({
            deviceId,
            service,
            characteristic,
            value: writeValue
          }, options));
        }));
      });
    }
    readDescriptor(deviceId, service, characteristic, descriptor, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        descriptor = parseUUID(descriptor);
        const value = yield this.queue(() => __async(this, null, function* () {
          const result = yield BluetoothLe.readDescriptor(Object.assign({
            deviceId,
            service,
            characteristic,
            descriptor
          }, options));
          return this.convertValue(result.value);
        }));
        return value;
      });
    }
    writeDescriptor(deviceId, service, characteristic, descriptor, value, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        descriptor = parseUUID(descriptor);
        return this.queue(() => __async(this, null, function* () {
          if (!(value === null || value === void 0 ? void 0 : value.buffer)) {
            throw new Error("Invalid data.");
          }
          let writeValue = value;
          if (Capacitor.getPlatform() !== "web") {
            writeValue = dataViewToHexString(value);
          }
          yield BluetoothLe.writeDescriptor(Object.assign({
            deviceId,
            service,
            characteristic,
            descriptor,
            value: writeValue
          }, options));
        }));
      });
    }
    startNotifications(deviceId, service, characteristic, callback, options) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          const key = `notification|${deviceId}|${service}|${characteristic}`;
          yield (_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove();
          const listener = yield BluetoothLe.addListener(key, (event) => {
            callback(this.convertValue(event === null || event === void 0 ? void 0 : event.value));
          });
          this.eventListeners.set(key, listener);
          yield BluetoothLe.startNotifications(Object.assign({
            deviceId,
            service,
            characteristic
          }, options));
        }));
      });
    }
    stopNotifications(deviceId, service, characteristic) {
      return __async(this, null, function* () {
        service = parseUUID(service);
        characteristic = parseUUID(characteristic);
        yield this.queue(() => __async(this, null, function* () {
          var _a;
          const key = `notification|${deviceId}|${service}|${characteristic}`;
          yield (_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove();
          this.eventListeners.delete(key);
          yield BluetoothLe.stopNotifications({
            deviceId,
            service,
            characteristic
          });
        }));
      });
    }
    validateRequestBleDeviceOptions(options) {
      options = Object.assign({}, options);
      if (options.services) {
        options.services = options.services.map(parseUUID);
      }
      if (options.optionalServices) {
        options.optionalServices = options.optionalServices.map(parseUUID);
      }
      if (options.serviceData && Capacitor.getPlatform() !== "web") {
        options.serviceData = options.serviceData.map((filter) => Object.assign(Object.assign({}, filter), { serviceUuid: parseUUID(filter.serviceUuid), dataPrefix: toHexString(filter.dataPrefix), mask: toHexString(filter.mask) }));
      }
      if (options.manufacturerData) {
        if (Capacitor.getPlatform() !== "web") {
          options.manufacturerData = options.manufacturerData.map((filter) => Object.assign(Object.assign({}, filter), { dataPrefix: toHexString(filter.dataPrefix), mask: toHexString(filter.mask) }));
        } else {
          options.manufacturerData = options.manufacturerData.map((filter) => Object.assign(Object.assign({}, filter), { dataPrefix: toUint8Array(filter.dataPrefix), mask: toUint8Array(filter.mask) }));
        }
      }
      return options;
    }
    convertValue(value) {
      if (typeof value === "string") {
        return hexStringToDataView(value);
      } else if (value === void 0) {
        return new DataView(new ArrayBuffer(0));
      }
      return value;
    }
    convertObject(obj) {
      if (obj === void 0) {
        return void 0;
      }
      const result = {};
      for (const key of Object.keys(obj)) {
        result[key] = this.convertValue(obj[key]);
      }
      return result;
    }
  };
  var BleClient = new BleClientClass();

  // node_modules/@capacitor-community/bluetooth-le/dist/esm/index.js
  init_conversion();

  // src/client/capacitor_ble_impl.ts
  var NiimbotCapacitorBleClient = class extends NiimbotAbstractClient {
    connect(options) {
      return __async(this, null, function* () {
        var _a;
        yield this.disconnect();
        yield BleClient.initialize({ androidNeverForLocation: true });
        const bluetoothEnabled = yield BleClient.isEnabled();
        if (!bluetoothEnabled) {
          throw new Error("Bluetooth is not enabled");
        }
        let device;
        if ((options == null ? void 0 : options.deviceId) !== void 0) {
          device = {
            deviceId: options.deviceId,
            name: options.deviceId
          };
        } else {
          device = yield BleClient.requestDevice();
        }
        yield BleClient.connect(device.deviceId, () => this.onBleDisconnect());
        yield BleClient.discoverServices(device.deviceId);
        const { service, characteristic } = yield this.findSuitableCharacteristic(device.deviceId).catch((error) => {
          this.onBleDisconnect();
          throw error;
        });
        this.deviceId = device.deviceId;
        this.serviceUUID = service;
        this.characteristicUUID = characteristic;
        if (this.debug) {
          console.log("Suitable channel found:", { service, characteristic });
        }
        yield BleClient.startNotifications(this.deviceId, this.serviceUUID, this.characteristicUUID, (value) => {
          this.processRawPacket(value);
        });
        yield this.negotiateAndGetPrinterInfo(() => this.disconnect());
        const result = {
          deviceName: device.name,
          result: (_a = this.printerInfo.connectResult) != null ? _a : 90 /* FirmwareErrors */
        };
        this.emit("connect", new ConnectEvent(result));
        return result;
      });
    }
    findSuitableCharacteristic(devId) {
      return __async(this, null, function* () {
        const services = yield BleClient.getServices(devId);
        for (const service of services) {
          if (service.uuid.length < 5) {
            continue;
          }
          const characteristics = service.characteristics;
          for (const ch of characteristics) {
            if (ch.properties.notify && ch.properties.writeWithoutResponse) {
              return {
                characteristic: ch.uuid,
                service: service.uuid
              };
            }
          }
        }
        throw new Error("Unable to find suitable channel characteristic");
      });
    }
    onBleDisconnect() {
      this.deviceId = void 0;
      this.serviceUUID = void 0;
      this.characteristicUUID = void 0;
      this.emit("disconnect", new DisconnectEvent());
    }
    isConnected() {
      return this.deviceId !== void 0;
    }
    disconnect() {
      return __async(this, null, function* () {
        this.stopHeartbeat();
        if (this.deviceId !== void 0) {
          yield BleClient.stopNotifications(this.deviceId, this.serviceUUID, this.characteristicUUID);
          yield BleClient.disconnect(this.deviceId);
        }
        this.deviceId = void 0;
      });
    }
    sendRaw(data, force) {
      return __async(this, null, function* () {
        const send = () => __async(this, null, function* () {
          if (!this.isConnected()) {
            throw new Error("Channel is closed");
          }
          yield Utils.sleep(this.packetIntervalMs);
          const dw = new DataView(data.buffer, data.byteOffset, data.byteLength);
          yield BleClient.writeWithoutResponse(this.deviceId, this.serviceUUID, this.characteristicUUID, dw);
          this.emit("rawpacketsent", new RawPacketSentEvent(data));
        });
        if (force) {
          yield send();
        } else {
          yield this.mutex.runExclusive(send);
        }
      });
    }
    getType() {
      return "capacitor-ble";
    }
  };

  // src/client/serial_impl.ts
  var NiimbotSerialClient = class extends NiimbotAbstractClient {
    constructor() {
      super(...arguments);
      this.port = void 0;
      this.writer = void 0;
      this.reader = void 0;
    }
    connect(options) {
      return __async(this, null, function* () {
        var _a, _b, _c;
        yield this.disconnect();
        let _port;
        if ((options == null ? void 0 : options.authorizedPort) !== void 0) {
          _port = options == null ? void 0 : options.authorizedPort;
        } else {
          _port = yield navigator.serial.requestPort();
        }
        _port.addEventListener("disconnect", () => {
          this.port = void 0;
          this.emit("disconnect", new DisconnectEvent());
        });
        yield _port.open({ baudRate: 115200 });
        if (_port.readable === null) {
          throw new Error("Port is not readable");
        }
        if (_port.writable === null) {
          throw new Error("Port is not writable");
        }
        this.port = _port;
        const info = _port.getInfo();
        this.writer = _port.writable.getWriter();
        this.reader = _port.readable.getReader();
        setTimeout(() => {
          void (() => __async(this, null, function* () {
            yield this.waitSerialData();
          }))();
        }, 1);
        yield this.negotiateAndGetPrinterInfo(() => this.disconnect());
        const result = {
          deviceName: `Serial (VID:${(_a = info.usbVendorId) == null ? void 0 : _a.toString(16)} PID:${(_b = info.usbProductId) == null ? void 0 : _b.toString(16)})`,
          result: (_c = this.printerInfo.connectResult) != null ? _c : 90 /* FirmwareErrors */
        };
        this.emit("connect", new ConnectEvent(result));
        return result;
      });
    }
    waitSerialData() {
      return __async(this, null, function* () {
        while (true) {
          try {
            const result = yield this.reader.read();
            if (result.value) {
              if (this.debug) {
                console.info(`<< serial chunk ${Utils.bufToHex(result.value)}`);
              }
              this.processRawPacket(result.value);
            }
            if (result.done) {
              console.log("done");
              break;
            }
          } catch (_e) {
            break;
          }
        }
      });
    }
    disconnect() {
      return __async(this, null, function* () {
        this.stopHeartbeat();
        if (this.writer !== void 0) {
          this.writer.releaseLock();
        }
        if (this.reader !== void 0) {
          this.reader.releaseLock();
        }
        if (this.port !== void 0) {
          yield this.port.close();
          this.emit("disconnect", new DisconnectEvent());
        }
        this.port = void 0;
        this.writer = void 0;
      });
    }
    isConnected() {
      return this.port !== void 0 && this.writer !== void 0 && this.reader !== void 0;
    }
    sendRaw(data, force) {
      return __async(this, null, function* () {
        const send = () => __async(this, null, function* () {
          if (!this.isConnected()) {
            throw new Error("Port is not readable/writable");
          }
          yield Utils.sleep(this.packetIntervalMs);
          yield this.writer.write(data);
          this.emit("rawpacketsent", new RawPacketSentEvent(data));
        });
        if (force) {
          yield send();
        } else {
          yield this.mutex.runExclusive(send);
        }
      });
    }
    getType() {
      return "serial";
    }
  };

  // src/client/virtual_impl.ts
  var NiimbotVirtualClient = class extends NiimbotAbstractClient {
    constructor() {
      super();
      this.connected = false;
      this.notSupportedPacket = Utils.hexToBuf("55 55 00 01 01 00 aa aa");
      this.virtualDump = [];
      this.setHeartbeatAutoStart(false);
    }
    /**
     * Dump example (case and spaces are ignored):
     *
     * ```
     * >> 03 5555 c1 01 01 c1 aaaa
     * << 5555 c2 01 02 c1 aaaa
     * >> 5555 40 01 08 49 aaaa (packet comment)
     * << 5555 48 02 0900 43 aaaa
     * >> 5555 40 01 0c 4d aaaa
     * << 5555 4c 02 051e 55 aaaa
     * >> 5555 40 01 09 48 aaaa
     * << 5555 49 02 051e 50 aaaa
     * >> 5555 84 03 00c827 68 aaaa
     * << NA
     * >> 5555 85 *
     * << NA
     * ```
     *
     */
    loadHexDump(hex) {
      this.virtualDump = [];
      let request;
      const lineRegexp = /^\s*(>>|<<)\s*(.+?)\s*$/;
      const parenthesesRegexp = /\(.*?\)/g;
      for (const line of hex.split(/\r?\n/)) {
        const match = lineRegexp.exec(line);
        if (!match) {
          continue;
        }
        const [, direction, value] = match;
        const cleanValue = value.replace(parenthesesRegexp, "").replace(/\s+/g, "");
        if (direction === ">>") {
          if (request) {
            throw new Error("Missing response for request");
          }
          const isPrefix = cleanValue.endsWith("*");
          const hexStr = isPrefix ? cleanValue.slice(0, -1) : cleanValue;
          request = {
            packet: Utils.hexToBuf(hexStr),
            isPrefix
          };
        } else {
          if (!request) {
            throw new Error("Unexpected response without request");
          }
          const response = cleanValue.toUpperCase() === "NA" ? void 0 : Utils.hexToBuf(cleanValue);
          this.virtualDump.push({
            request: request.packet,
            response,
            isPrefix: request.isPrefix
          });
          request = void 0;
        }
      }
      if (request) {
        throw new Error("Missing response for request");
      }
    }
    virtualSend(data) {
      const requestHex = Utils.bufToHex(data, "").toLowerCase();
      const entry = this.virtualDump.find(({ request, isPrefix }) => {
        const entryHex = Utils.bufToHex(request, "").toLowerCase();
        return isPrefix ? requestHex.startsWith(entryHex) : requestHex === entryHex;
      });
      if (!entry) {
        setTimeout(() => this.processRawPacket(this.notSupportedPacket), 1);
        return;
      }
      if (entry.response) {
        setTimeout(() => this.processRawPacket(entry.response), 1);
      }
    }
    connect() {
      return __async(this, null, function* () {
        var _a;
        this.connected = true;
        yield this.negotiateAndGetPrinterInfo(() => this.connected = false);
        const result = {
          deviceName: "Virtual",
          result: (_a = this.printerInfo.connectResult) != null ? _a : 90 /* FirmwareErrors */
        };
        this.emit("connect", new ConnectEvent(result));
        return result;
      });
    }
    disconnect() {
      return __async(this, null, function* () {
        this.stopHeartbeat();
        if (this.connected) {
          this.connected = false;
          this.emit("disconnect", new DisconnectEvent());
        }
      });
    }
    isConnected() {
      return this.connected;
    }
    sendRaw(data, force) {
      return __async(this, null, function* () {
        const send = () => __async(this, null, function* () {
          if (!this.isConnected()) {
            throw new Error("Port is not readable/writable");
          }
          yield Utils.sleep(this.packetIntervalMs);
          this.virtualSend(data);
          this.emit("rawpacketsent", new RawPacketSentEvent(data));
        });
        if (force) {
          yield send();
        } else {
          yield this.mutex.runExclusive(send);
        }
      });
    }
    getType() {
      return "virtual";
    }
  };

  // src/client/index.ts
  var clientFactories = {
    "bluetooth": () => new NiimbotBluetoothClient(),
    "serial": () => new NiimbotSerialClient(),
    "capacitor-ble": () => new NiimbotCapacitorBleClient(),
    "virtual": () => new NiimbotVirtualClient()
  };
  var instantiateClient = (t) => {
    const client = clientFactories[t]();
    if (client !== void 0) {
      return client;
    }
    throw new Error("Invalid client type");
  };
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

@capacitor/core/dist/index.js:
  (*! Capacitor: https://capacitorjs.com/ - MIT License *)

crc-32/crc32.js:
  (*! crc32.js (C) 2014-present SheetJS -- http://sheetjs.com *)
*/
//# sourceMappingURL=niimbluelib.js.map
