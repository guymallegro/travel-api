'use strict';
module.exports = function(app) {
  var vacation = require('../controllers/vacationController');

  // todoList Routes
  app.route('/tasks')
    .get(vacation.list_all_tasks)
    .post(vacation.create_a_task);

  app.route('/test')
    .get(vacation.list_all_tasks);


  app.route('/tasks/:taskId')
    .get(vacation.read_a_task)
    .put(vacation.update_a_task)
    .delete(vacation.delete_a_task);
};
