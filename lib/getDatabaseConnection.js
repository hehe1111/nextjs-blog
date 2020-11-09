"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var promise = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var manager, current;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          manager = (0, _typeorm.getConnectionManager)();

          if (!manager.has('default')) {
            _context.next = 4;
            break;
          }

          current = manager.get('default');
          return _context.abrupt("return", current.isConnected ? current : current.connect());

        case 4:
          return _context.abrupt("return", (0, _typeorm.createConnection)());

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

var getDatabaseConnection = function getDatabaseConnection() {
  return promise;
};

var _default = getDatabaseConnection;
exports["default"] = _default;
