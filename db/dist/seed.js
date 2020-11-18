"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _Post = require("./entity/Post");

var _User = require("./entity/User");

var _Comment = require("./entity/Comment");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var manager, users, user, post, comment, posts, _user, comments, _post, i, comment2, comment3;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manager = connection.manager;
            _context.next = 3;
            return manager.find('User');

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
            return manager.find('Post');

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
            return manager.findOne('User');

          case 19:
            _user = _context.sent;
            post.author = _user;
            _context.next = 23;
            return manager.save(post);

          case 23:
            _context.next = 25;
            return manager.find('Comment');

          case 25:
            comments = _context.sent;

            if (comments.length) {
              _context.next = 66;
              break;
            }

            _context.next = 29;
            return manager.findOne('Post');

          case 29:
            _post = _context.sent;
            i = 1;

          case 31:
            if (!(i < 10)) {
              _context.next = 42;
              break;
            }

            comment = new _Comment.Comment();
            comment.username = "\u7528\u6237".concat(Math.ceil(Math.random() * 10000 + 1000));
            comment.email = "".concat(i, "@example.com");
            comment.content = "This is a comment.".concat(i);
            comment.post = _post;
            _context.next = 39;
            return manager.save(comment);

          case 39:
            i++;
            _context.next = 31;
            break;

          case 42:
            comment2 = new _Comment.Comment();
            _context.next = 45;
            return manager.findOne('Comment');

          case 45:
            comment = _context.sent;
            comment2.username = 'nobody2';
            comment2.email = '456@example.com';
            comment2.content = 'Reply to nobody.';
            comment2.post = _post;
            comment2.sourceCommentId = comment.id;
            comment2.replyTo = comment.username;
            _context.next = 54;
            return manager.save(comment2);

          case 54:
            comment3 = new _Comment.Comment();
            _context.next = 57;
            return manager.findOne('Comment', {
              where: {
                username: comment2.username
              }
            });

          case 57:
            comment2 = _context.sent;
            comment3.username = 'nobody3';
            comment3.email = '789@example.com';
            comment3.content = 'Reply to nobody2.';
            comment3.post = _post;
            comment3.sourceCommentId = comment2.sourceCommentId;
            comment3.replyTo = comment2.username;
            _context.next = 66;
            return manager.save(comment3);

          case 66:
            _context.next = 68;
            return connection.close();

          case 68:
            console.log('SEED DONE!');

          case 69:
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