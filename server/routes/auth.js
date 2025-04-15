const express = require('express');
const router = express.Router();
const passport = require('passport');

// GitHub 登录路由
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub 回调路由
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // 登录成功重定向
    res.redirect('/');
  }
);

// 获取当前登录用户信息
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    // 返回用户信息，但不包含敏感信息
    const { id, username, displayName, avatarUrl } = req.user;
    res.json({ id, username, displayName, avatarUrl, isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// 登出
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router; 