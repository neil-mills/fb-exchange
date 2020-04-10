const indexRoutes = require('./indexRoutes');
const adminRoutes = require('./adminRoutes');
const accountRoutes = require('./accountRoutes');
const apiRoutes = require('./apiRoutes');

module.exports = app => {
    app.use('/', indexRoutes);
    app.use('/admin', adminRoutes);
    app.use('/account', accountRoutes);    
    app.use('/api', apiRoutes);
}

