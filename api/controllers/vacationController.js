'use strict';
let DButilsAzure = require('../../DButils');
var User = require('../models/user');

exports.register = function (req, res) {
    DButilsAzure.execQuery("INSERT INTO Users (userName, password, firstName, lastName, city, country, email)\n" +
        "VALUES ('guy', 'Smith', 'New York', 'USA', 'test', 'test', 'test')")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err)
            res.send(err)
        })

    // var user = new User({
    //     userName: req.body.userName,
    //     password: req.body.password,
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     city: req.body.city,
    //     country: req.body.country,
    //     email: req.body.email
    // });

};

exports.login = function (req, res) {
    res.send("Given user name is: " + req.body.userName);
};

exports.list_all_tasks = function (req, res) {
    res.send("TEST");
};

exports.list_all_tasks = function (req, res) {
    res.send("TEST");
};

exports.list_all_tasks = function (req, res) {
    res.send("TEST");
};