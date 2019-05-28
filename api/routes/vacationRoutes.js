'use strict';
module.exports = function (app) {
    var vacation = require('../controllers/vacationController');

    app.route('/login')
        .post(vacation.login);

    app.route('/register')
        .post(vacation.register);

    app.route('/verifyAnswer')
        .post(vacation.verifyAnswer);

    app.route('/getUserRecommendation')
        .post(vacation.getUserRecommendation);

    app.route('/getUserFavorites')
        .post(vacation.getUserFavorites);

    app.route('/updateUser')
        .put(vacation.updateUser);

};