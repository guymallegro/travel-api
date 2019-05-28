'use strict';
module.exports = function (app) {
  var vacation = require('../controllers/vacationController');

  app.route('/login')
      .post(vacation.login);

  app.route('/register')
      .post(vacation.register);

  app.route('/verifyAnswer')
      .post(vacation.verifyAnswer);

  app.route('/getUserInterests')
      .post(vacation.getUserInterests);

  app.route('/getUserFavorites')
      .post(vacation.getUserFavorites);

  app.route('/getPOIDetails')
      .get(vacation.list_all_tasks);

  app.route('/getUserQuestions')
      .get(vacation.list_all_tasks);

  app.route('/GetRandomPIO')
      .get(vacation.list_all_tasks);

  app.route('/getRecommendedPOI')
      .get(vacation.list_all_tasks);

  app.route('/getAllPOI')
      .get(vacation.list_all_tasks);

  app.route('/searchByName')
      .get(vacation.list_all_tasks);

  app.route('/updateUser')
      .put(vacation.list_all_tasks);

  app.route('/addToFavorites')
      .put(vacation.list_all_tasks);

  app.route('/addRank')
      .put(vacation.list_all_tasks);

  app.route('/addReview')
      .put(vacation.list_all_tasks);

  app.route('/removePOI')
      .delete(vacation.list_all_tasks);
};