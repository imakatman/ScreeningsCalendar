/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./getScreenings.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./getScreenings.js":
/*!**************************!*\
  !*** ./getScreenings.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar screenings = {};\nvar children_data = {};\n\nfunction readSheets() {\n  locations.map(function (item, i) {\n    var label = item.label;\n\n    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(label),\n        headers = sheet.getRange(label + '!A1:O1').getValues(),\n        values = sheet.getRange(label + '!A2:O').getValues();\n\n    for (var n = 0; n <= headers.length; n++) {\n      Logger.log(headers[i][n]);\n      Logger.log(values[i][n]);\n\n      return Object.assign(screenings, _defineProperty({}, item.uid, _defineProperty({}, headers[i][n], values[i][n])));\n    }\n    // normalizeAndStoreData(item, headers, values)\n  });\n\n  Logger.log(screenings);\n}\n\n// function normalizeAndStoreData(item, headers, values) {\n//   return function (dispatch, getState) {\n//     var cityUid  = item.uid,\n//         timezone = getState().screenings[uid].children_data[cityUid].timezone;\n//\n//     let obj = {\n//       city: item.label\n//     };\n//\n//     obj.screenings = formatScreeningsData(headers[0], values, item.label, timezone);\n//\n//     dispatch(storeScreenings(uid, cityUid, obj));\n//   }\n// }\n//\n// function formatData(headers, values, labels, tz) {\n//\n// }\n\n// function readRange(spreadsheetId) {\n//     var response = Sheets.Spreadsheets.Values.get(spreadsheetId, 'Sheet1!A1:D5');\n//     Logger.log(response.values);\n// }\n\n// // Creates an event for the mars landing and logs the ID.\n// var event = CalendarApp.getCalendarById('4h8n7e9pvernebghcs52d23s44@group.calendar.google.com').createEvent('Falcon\n// Heavy Landing', new Date('July 28, 2018 20:00:00 UTC'), new Date('July 28, 2018 21:00:00 UTC'), {location: 'Mars'});\n\n// function addEvents() {\n//     Logger.log('Event ID: ' + event.getId());\n// }\n\n//# sourceURL=webpack:///./getScreenings.js?");

/***/ })

/******/ });