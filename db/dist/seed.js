"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _Post = require("./entity/Post");

var _User = require("./entity/User");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var manager, users, user, post, posts, _user;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manager = connection.manager;
            _context.next = 3;
            return manager.find(_User.User);

          case 3:
            users = _context.sent;

            if (users.length) {
              _context.next = 10;
              break;
            }

            user = new _User.User();
            user.username = 'Bob';
            user.password = '1';
            _context.next = 10;
            return manager.save(user);

          case 10:
            _context.next = 12;
            return manager.find(_Post.Post);

          case 12:
            posts = _context.sent;

            if (posts.length) {
              _context.next = 23;
              break;
            }

            post = new _Post.Post();
            post.title = 'Post 1';
            post.content = 'Content of post 1.';
            _context.next = 19;
            return manager.findOne(_User.User);

          case 19:
            _user = _context.sent;
            post.author = _user;
            _context.next = 23;
            return manager.save(post);

          case 23:
            _context.next = 25;
            return connection.close();

          case 25:
            console.log('SEED DONE!');

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}())["catch"](function (error) {
  return console.log(error);
});