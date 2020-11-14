"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddCreatedAtAndUpdatedAt1603965110627 = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeorm = require("typeorm");

var AddCreatedAtAndUpdatedAt1603965110627 = /*#__PURE__*/function () {
  function AddCreatedAtAndUpdatedAt1603965110627() {
    (0, _classCallCheck2["default"])(this, AddCreatedAtAndUpdatedAt1603965110627);
  }

  (0, _createClass2["default"])(AddCreatedAtAndUpdatedAt1603965110627, [{
    key: "up",
    value: function () {
      var _up = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(queryRunner) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                ['users', 'posts', 'comments'].forEach( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(table) {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return queryRunner.addColumns(table, ['createdAt', 'updatedAt'].map(function (field) {
                              return new _typeorm.TableColumn({
                                name: field,
                                type: 'timestamp',
                                isNullable: false,
                                "default": 'now()'
                              });
                            }));

                          case 2:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function up(_x) {
        return _up.apply(this, arguments);
      }

      return up;
    }()
  }, {
    key: "down",
    value: function () {
      var _down = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(queryRunner) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                ['users', 'posts', 'comments'].forEach( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(table) {
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            ['createdAt', 'updatedAt'].forEach( /*#__PURE__*/function () {
                              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(field) {
                                return _regenerator["default"].wrap(function _callee3$(_context3) {
                                  while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        _context3.next = 2;
                                        return queryRunner.dropColumn(table, field);

                                      case 2:
                                      case "end":
                                        return _context3.stop();
                                    }
                                  }
                                }, _callee3);
                              }));

                              return function (_x5) {
                                return _ref3.apply(this, arguments);
                              };
                            }());

                          case 1:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x4) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function down(_x3) {
        return _down.apply(this, arguments);
      }

      return down;
    }()
  }]);
  return AddCreatedAtAndUpdatedAt1603965110627;
}();

exports.AddCreatedAtAndUpdatedAt1603965110627 = AddCreatedAtAndUpdatedAt1603965110627;