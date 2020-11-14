"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _initializerDefineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerDefineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _applyDecoratedDescriptor2 = _interopRequireDefault(require("@babel/runtime/helpers/applyDecoratedDescriptor"));

var _initializerWarningHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/initializerWarningHelper"));

var _typeorm = require("typeorm");

var _md = _interopRequireDefault(require("md5"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _getDatabaseConnection = _interopRequireDefault(require("backend/getDatabaseConnection"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp;

var User = (_dec = (0, _typeorm.Entity)('users'), _dec2 = (0, _typeorm.PrimaryGeneratedColumn)('increment'), _dec3 = (0, _typeorm.Column)('varchar'), _dec4 = (0, _typeorm.Column)('varchar'), _dec5 = (0, _typeorm.CreateDateColumn)(), _dec6 = (0, _typeorm.UpdateDateColumn)(), _dec7 = (0, _typeorm.OneToMany)('Post', 'author'), _dec8 = (0, _typeorm.OneToMany)('Comment', 'user'), _dec9 = (0, _typeorm.BeforeInsert)(), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
  function User() {
    (0, _classCallCheck2["default"])(this, User);
    (0, _initializerDefineProperty2["default"])(this, "id", _descriptor, this);
    (0, _initializerDefineProperty2["default"])(this, "username", _descriptor2, this);
    (0, _initializerDefineProperty2["default"])(this, "passwordDigest", _descriptor3, this);
    (0, _initializerDefineProperty2["default"])(this, "createdAt", _descriptor4, this);
    (0, _initializerDefineProperty2["default"])(this, "updatedAt", _descriptor5, this);
    (0, _initializerDefineProperty2["default"])(this, "posts", _descriptor6, this);
    (0, _initializerDefineProperty2["default"])(this, "comments", _descriptor7, this);
    (0, _defineProperty2["default"])(this, "password", void 0);
    (0, _defineProperty2["default"])(this, "passwordConfirmation", void 0);
  }

  (0, _createClass2["default"])(User, [{
    key: "validateSignUp",
    value: function () {
      var _validateSignUp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var errors, _name, found;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errors = {
                  username: [],
                  password: [],
                  passwordConfirmation: []
                };
                _name = this.username.trim();
                _name === '' && errors.username.push('用户名不能为空');
                !/[0-9A-Za-z]+/g.test(_name) && errors.username.push('用户名只能由大小写字母或数字组成');
                _name.length < 3 && errors.username.push('用户名不能少于 3 位');
                _name.length > 16 && errors.username.push('用户名不能多于 16 位');
                _context.next = 8;
                return (0, _getDatabaseConnection["default"])();

              case 8:
                _context.next = 10;
                return _context.sent.manager.findOne('User', {
                  where: {
                    username: this.username
                  }
                });

              case 10:
                found = _context.sent;
                found && errors.username.push('用户名已被占用');
                this.password.length === 0 && errors.password.push('密码不能为空');
                this.password !== this.passwordConfirmation && errors.passwordConfirmation.push('密码与确认密码不一致');
                return _context.abrupt("return", {
                  hasErrors: !!Object.values(errors).find(function (v) {
                    return v.length > 0;
                  }),
                  errors: errors
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function validateSignUp() {
        return _validateSignUp.apply(this, arguments);
      }

      return validateSignUp;
    }()
  }, {
    key: "validateSignIn",
    value: function () {
      var _validateSignIn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var errors, found;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                errors = {
                  username: [],
                  password: []
                };
                this.username.trim() === '' && errors.username.push('请填写用户名');
                this.password.trim() === '' && errors.password.push('请填写密码');
                _context2.next = 5;
                return (0, _getDatabaseConnection["default"])();

              case 5:
                _context2.next = 7;
                return _context2.sent.manager.findOne('User', {
                  where: {
                    username: this.username
                  }
                });

              case 7:
                found = _context2.sent;

                if (found) {
                  if (found.passwordDigest !== (0, _md["default"])(this.password)) {
                    errors.password.push('密码与用户名不匹配');
                  }
                } else {
                  this.username.trim() !== '' && errors.username.push('用户不存在');
                }

                return _context2.abrupt("return", {
                  hasErrors: !!Object.values(errors).find(function (v) {
                    return v.length > 0;
                  }),
                  errors: errors,
                  found: found
                });

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function validateSignIn() {
        return _validateSignIn.apply(this, arguments);
      }

      return validateSignIn;
    }()
  }, {
    key: "generatePasswordDigest",
    value: function generatePasswordDigest() {
      this.passwordDigest = (0, _md["default"])(this.password);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return (0, _omit["default"])(this, ['password', 'passwordConfirmation', 'passwordDigest']);
    }
  }]);
  return User;
}(), _temp), (_descriptor = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "id", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "username", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "passwordDigest", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "createdAt", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "updatedAt", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "posts", [_dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "comments", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), (0, _applyDecoratedDescriptor2["default"])(_class2.prototype, "generatePasswordDigest", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "generatePasswordDigest"), _class2.prototype)), _class2)) || _class);
exports.User = User;