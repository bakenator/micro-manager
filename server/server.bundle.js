/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4cb273bfcd6e3e59650d"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = __webpack_require__(8);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventParser = function () {
	function EventParser() {
		_classCallCheck(this, EventParser);
	}

	_createClass(EventParser, [{
		key: 'parseWebhook',
		value: function parseWebhook(req) {
			var data = req.body;
			data.id = req.headers['x-github-delivery'];
			data.type = req.headers['x-github-event'];
			return data;
		}

		// uppercase for api events, lower case for webhooks

	}, {
		key: 'processEvent',
		value: function processEvent(e) {
			// having each type directly access methods to avoid one long switch
			try {
				return this[e.type](e);
			} catch (e) {
				return null;
			}
		}
	}, {
		key: 'PushEvent',
		value: function PushEvent(e) {
			var pEvent = {};
			var branch = e.payload.ref.replace(/refs\/heads\//g, '');
			pEvent.id = e.id;
			pEvent.time = e.created_at;
			pEvent.type = e.type;
			pEvent.user = e.actor && e.actor.login;
			pEvent.icon = '';
			pEvent.text = '';
			pEvent.icon = 'P';
			pEvent.text = 'Pushed ' + e.payload.size + ' commits to ' + branch + ' branch';
			pEvent.link = 'https://github.com/' + process.env.REPO + '/tree/' + branch;
			return pEvent;
		}
	}, {
		key: 'PullRequestEvent',
		value: function PullRequestEvent(e) {
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.time = e.created_at;
			pEvent.type = e.type;
			pEvent.user = e.actor && e.actor.login;
			pEvent.icon = '';
			pEvent.text = '';
			pEvent.icon = 'PR';
			if (e.payload.pull_request.merged) {
				pEvent.text = 'Merged PR #' + e.payload.number + ' - ' + e.payload.pull_request.title;
			} else {
				pEvent.text = e.payload.action + ' PR #' + e.payload.number + ' - ' + e.payload.pull_request.title;
			}
			pEvent.link = e.payload.pull_request.html_url;
			return pEvent;
		}
	}, {
		key: 'issues',
		value: function issues(e) {
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.type = e.type;
			pEvent.user = e.sender.login;
			pEvent.icon = 'I';
			pEvent.time = (0, _moment2.default)().format();
			pEvent.text = e.action + ' issue #' + e.issue.number + ' - ' + e.issue.title;
			return pEvent;
		}
	}, {
		key: 'IssuesEvent',
		value: function IssuesEvent(e) {
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.type = e.type;
			pEvent.user = e.actor.login;
			pEvent.icon = 'I';
			pEvent.time = e.created_at;
			pEvent.text = e.payload.action + ' issue #' + e.payload.issue.number + ' - ' + e.payload.issue.title;
			pEvent.link = e.payload.issue.html_url;
			return pEvent;
		}
	}, {
		key: 'CreateEvent',
		value: function CreateEvent(e) {
			// dont care about repo/tag creation
			if (e.payload.ref_type !== 'branch') {
				return;
			}
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.type = e.type;
			pEvent.user = e.actor.login;
			pEvent.icon = 'B';
			pEvent.time = e.created_at;
			pEvent.text = 'Created branch - ' + e.payload.ref;
			pEvent.link = 'https://github.com/' + process.env.REPO + '/tree/' + e.payload.ref;
			return pEvent;
		}
	}, {
		key: 'IssueCommentEvent',
		value: function IssueCommentEvent(e) {
			// dont care about comment edits
			if (e.payload.action !== 'created') {
				return;
			}
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.type = e.type;
			pEvent.user = e.actor.login;
			pEvent.icon = 'C';
			pEvent.time = e.created_at;
			pEvent.text = 'Commented on issue #' + e.payload.issue.number + ' - ' + e.payload.issue.title;
			pEvent.link = e.payload.comment.html_url;
			return pEvent;
		}
	}, {
		key: 'PullRequestReviewCommentEvent',
		value: function PullRequestReviewCommentEvent(e) {
			var pEvent = {};
			pEvent.id = e.id;
			pEvent.type = e.type;
			pEvent.user = e.actor.login;
			pEvent.icon = 'C';
			pEvent.time = e.created_at;
			pEvent.text = 'Commented on PR #' + e.payload.pull_request.number + ' - ' + e.payload.pull_request.title;
			pEvent.link = e.payload.comment.html_url;
			return pEvent;
		}
	}]);

	return EventParser;
}();

exports.default = EventParser;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(4);

var _express2 = _interopRequireDefault(_express);

var _http = __webpack_require__(5);

var _http2 = _interopRequireDefault(_http);

var _socket = __webpack_require__(6);

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = __webpack_require__(7);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _eventParser = __webpack_require__(1);

var _eventParser2 = _interopRequireDefault(_eventParser);

var _eventList = __webpack_require__(9);

var _eventList2 = _interopRequireDefault(_eventList);

var _memberModel = __webpack_require__(10);

var _memberModel2 = _interopRequireDefault(_memberModel);

var _expressSession = __webpack_require__(11);

var _expressSession2 = _interopRequireDefault(_expressSession);

var _ejs = __webpack_require__(12);

var _ejs2 = _interopRequireDefault(_ejs);

var _authentication = __webpack_require__(13);

var _authentication2 = _interopRequireDefault(_authentication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(15).config();

var fs = __webpack_require__(16);

var app = (0, _express2.default)();
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_express2.default.static('public'));
app.set('view engine', 'ejs');
app.use((0, _expressSession2.default)({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

var http = _http2.default.Server(app);
var io = (0, _socket2.default)(http);
//building list of github users
var githubMembers = new _memberModel2.default();
githubMembers.fetch();

var groups = [];
try {
  var groupsFile = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../groups.json\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  groups = groupsFile.groups;
} catch (e) {}

// building list of previously occuring events
var githubEvents = new _eventList2.default();
githubEvents.fetch();

var auth = new _authentication2.default();

app.get('/', function (req, res) {
  if (auth.authorizedRequest(req)) {
    res.render('app.ejs', { token: req.session.token, repo: process.env.REPO });
  } else {
    res.render('auth.ejs', { client_id: process.env.GH_BASIC_CLIENT_ID, repo: process.env.REPO });
  }
});

app.get('/githubauth', function (req, res) {
  var ghCode = req.query.code;
  // calls redirect once complete
  auth.ghOauth(ghCode, req, function () {
    res.redirect('/');
  });
});

app.post('/event', function (req, res) {
  var ep = new _eventParser2.default();
  var hookEvent = ep.parseWebhook(req);
  var newEvent = ep.processEvent(hookEvent);
  githubEvents.add(newEvent);

  io.emit('newEvent', { newEvent: newEvent });
  res.send({});
});

io.on('connection', function (socket) {
  // user must send in a valid known token with the connection req
  if (!auth.authorizedSocket(socket)) {
    socket.disconnect();
  }
  // having the connection call for the starting info after react loads and is ready to receive
  socket.on('appLoad', function (msg) {
    var connOb = {
      githubEvents: githubEvents.events,
      githubMembers: githubMembers.members,
      groups: groups
    };
    socket.emit('startingEventList', connOb);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

// update events every minute, remove once webhooks work
setInterval(function () {
  githubEvents.fetch(function () {
    var connOb = {
      githubEvents: githubEvents.events,
      githubMembers: githubMembers.members
    };
    io.emit('updateEventList', connOb);
  });
}, 60000);

// remaining events
// ProjectCardEvent
// PullRequestReviewEvent - hook only?

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = __webpack_require__(0);

var _request2 = _interopRequireDefault(_request);

var _eventParser = __webpack_require__(1);

var _eventParser2 = _interopRequireDefault(_eventParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventList = function () {
	function EventList() {
		_classCallCheck(this, EventList);

		this._events = [];
		// github starts pages at 1
		this.pageNum = 1;
		this.totalCheckPages = 10;
		this.options = {
			url: 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum,
			headers: {
				'User-Agent': 'request',
				'Authorization': process.env.TOKEN ? 'token ' + process.env.TOKEN : ''
			}
		};
	}

	_createClass(EventList, [{
		key: 'add',
		value: function add(e) {
			if (!e) {
				return;
			}
			this._events.unshift(e);
			if (this._events.length > 300) {
				this._events = this._events.slice(250);
			}
		}
	}, {
		key: 'concat',
		value: function concat(list) {
			this._events = this._events.concat(list);
		}
	}, {
		key: 'fetch',
		value: function fetch(completeCallback) {
			// this is a hack, but ok for now
			this._completeCallback = completeCallback;
			(0, _request2.default)(this.options, this.eventCallback.bind(this));
		}
	}, {
		key: 'eventCallback',
		value: function eventCallback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				var ep = new _eventParser2.default();
				var events = data.map(function (d) {
					return ep.processEvent(d);
				});

				var eventIds = this._events.map(function (e) {
					return e.id;
				});

				var processedEvents = events.filter(function (e) {
					return e;
				});
				// removing any duplicates
				processedEvents = processedEvents.filter(function (e) {
					return !eventIds.includes(e.id);
				});

				this._events = this._events.concat(processedEvents);
				this._events.sort(function (a, b) {
					return new Date(b.time) - new Date(a.time);
				});
				// chaining multiple page calls for the events
				if (this.pageNum < this.totalCheckPages) {
					this.pageNum++;
					this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum;
					(0, _request2.default)(this.options, this.eventCallback.bind(this));
				} else {
					// limiting the # of api calls after the first full check is done
					this.totalCheckPages = 3;
					this.pageNum = 1;
					this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/events?page=' + this.pageNum;
					this._completeCallback && this._completeCallback();
					this._completeCallback = null;
					return;
				}
			} else {
				console.log('event fetch error');
			}
		}
	}, {
		key: 'events',
		get: function get() {
			return this._events;
		}
	}]);

	return EventList;
}();

exports.default = EventList;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = __webpack_require__(0);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MemberModel = function () {
	function MemberModel() {
		_classCallCheck(this, MemberModel);

		this._members = [];
		// github starts pages at 1
		this.pageNum = 1;
		this.options = {
			url: 'https://api.github.com/repos/' + process.env.REPO + '/contributors?page=' + this.pageNum,
			headers: {
				'User-Agent': 'request',
				'Authorization': process.env.TOKEN ? 'token ' + process.env.TOKEN : ''
			}
		};
	}

	_createClass(MemberModel, [{
		key: 'fetch',
		value: function fetch() {
			(0, _request2.default)(this.options, this.memberCallback.bind(this));
		}
	}, {
		key: 'memberCallback',
		value: function memberCallback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);

				this._members = this._members.concat(data.map(function (m) {
					return { user: m.login, user_pic: m.avatar_url };
				}));
				// chaining multiple page calls for the events
				if (this.pageNum < 3) {
					this.pageNum++;
					this.options.url = 'https://api.github.com/repos/' + process.env.REPO + '/contributors?page=' + this.pageNum;
					(0, _request2.default)(this.options, this.memberCallback.bind(this));
				}
			} else {
				console.log('member fetch error');
			}
		}
	}, {
		key: 'members',
		get: function get() {
			return this._members;
		}
	}]);

	return MemberModel;
}();

exports.default = MemberModel;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("ejs");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = __webpack_require__(0);

var _request2 = _interopRequireDefault(_request);

var _crypto = __webpack_require__(14);

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Authentication = function () {
	function Authentication() {
		_classCallCheck(this, Authentication);

		this._authTokens = {};
	}

	_createClass(Authentication, [{
		key: 'authorizedRequest',
		value: function authorizedRequest(req) {
			//test env can be set in .env since tokens dont work offline
			if (process.env.NO_AUTH) {
				return true;
			}
			return req.session && req.session.token && this._authTokens[req.session.token];
		}
	}, {
		key: 'authorizedSocket',
		value: function authorizedSocket(socket) {
			//test env can be set in .env since tokens dont work offline
			if (process.env.NO_AUTH) {
				return true;
			}
			return socket.handshake.query && socket.handshake.query.token && this._authTokens[socket.handshake.query.token];
		}
	}, {
		key: 'ghOauth',
		value: function ghOauth(ghCode, req, redirectCallback) {
			var _this = this;

			var postOps = {
				url: 'https://github.com/login/oauth/access_token',
				headers: {
					"Content-Type": "application/json"
				},
				body: {
					"client_id": process.env.GH_BASIC_CLIENT_ID,
					"client_secret": process.env.GH_BASIC_SECRET_ID,
					"code": ghCode,
					"accept": "json"
				},
				json: true
			};

			_request2.default.post(postOps, function (error, response, body) {
				// exiting early if scope not enough
				if (body.scope !== 'read:org') {
					redirectCallback();
				}
				var token = body.access_token;
				// checks that they can see the members of org
				// only performs callback on success
				_this.checkToken(token, function () {
					var isMember = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

					if (isMember) {
						var tokenHash = _crypto2.default.createHash('md5').update(token).digest('hex');
						_this._authTokens[tokenHash] = true;
						req.session.token = tokenHash;
					}
					redirectCallback();
				});
			});
		}

		// pulls the org member list to make sure token is for a valid member

	}, {
		key: 'checkToken',
		value: function checkToken(token, callback) {
			var options = {
				url: 'https://api.github.com/orgs/' + process.env.ORG + '/members?page=' + 1,
				headers: {
					'User-Agent': 'request',
					'Authorization': 'token ' + token
				}
			};
			(0, _request2.default)(options, function (error, response, body) {
				if (error || response.statusCode != 200) {
					callback(false);
					return;
				}
				// not a member if they can't see more than our 1 public member
				var data = JSON.parse(body);
				if (data.length < 5) {
					callback(false);
					return;
				}

				callback(true);
			});
		}
	}]);

	return Authentication;
}();

exports.default = Authentication;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);