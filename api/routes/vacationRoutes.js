'use strict';
module.exports = function (app) {
  var vacation = require('../controllers/vacationController');

  app.route('/login')
      .post(vacation.login);

  app.route('/register')
      .post(vacation.register);

  app.route('/verifyAnswer')
      .post(vacation.verifyAnswer);

  app.route('/getMostPopular')
      .post(vacation.list_all_tasks);

  app.route('/getFavorites')
      .post(vacation.list_all_tasks);

  app.route('/getPOI')
      .get(vacation.list_all_tasks);

  app.route('/getQuestion')
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