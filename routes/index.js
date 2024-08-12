const Router = require('express').Router();

Router.get('/test', (req, res)=>{
    res.send('Working correctly');
})
Router.use('/auth', require('./auth.routes'))
Router.use('/posts', require('./post.routes'))
Router.use('/comments', require('./comments.routes'))
Router.use('/likes', require('./likes.routes'))
Router.use('/follows', require('./follows.routes'))
Router.use('/users', require('./user.routes'))

module.exports = Router