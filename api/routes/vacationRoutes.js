'use strict';
module.exports = function (app) {
    var vacation = require('../controllers/vacationController');

    app.route('/users/login')
        .post(vacation.login);

    app.route('/users/register')
        .post(vacation.register);

    app.route('/users/verifyAnswer')
        .post(vacation.verifyUserAnswer);

    app.route('/users/getRestoreQuestions')
        .post(vacation.getUserQuestions);

    app.route('/users/getRecommendation')
        .post(vacation.getUserRecommendation);

    app.route('/users/getFavorites')
        .post(vacation.getUserFavorites);

    app.route('/users/getInfo')
        .post(vacation.getUserInfo);

    app.route('/users/updateInfo')
        .put(vacation.updateUserInfo);

    app.route('/users/addFavoritePOI')
        .put(vacation.addFavoritePOI);

    app.route('/users/removeFavoritePOI')
        .delete(vacation.removeFavoritePOI);

    app.route('/users/rankPOI')
        .put(vacation.setUserRank);

    app.route('/poi/getDetails')
        .post(vacation.getPOIDetails);

    app.route('/poi/getAll')
        .post(vacation.getAllPOI);

    app.route('/poi/addReview')
        .put(vacation.addPOIReview);

    app.route('/poi/updateRank')
        .put(vacation.updatePOIRank);

    app.route('/poi/getAllRanks')
        .put(vacation.getAllPOIRanks);

};