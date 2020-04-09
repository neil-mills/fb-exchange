const indexRoutes = require('./indexRoutes');
const adminRoutes = require('./adminRoutes');
const accountRoutes = require('./accountRoutes');

module.exports = app => {
    app.use('/', indexRoutes);
    app.use('/admin', adminRoutes);
    app.use('/account', accountRoutes);    
}

