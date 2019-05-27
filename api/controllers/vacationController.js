'use strict';
let DButilsAzure = require('../../DButils');
var User = require('../models/user');

exports.register = function (req, res) {
    DButilsAzure.execQuery("INSERT INTO Users (userName, password, firstName, lastName, country, city, email)\n" +
        "VALUES (" + req.body.userName +","+ req.body.password +","+ req.body.firstName +","+ req.body.lastName +","+
        req.body.country +","+ req.body.city +","+ req.body.email+")")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err)
            res.send(err)
        })
};

exports.login = function (req, res) {
    res.send("Given user name is: " + req.body.userName);
};

exports.verifyAnswer = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM UsersQuestions WHERE (userName='"+req.body.userName+ "' AND firstQuestion='"+req.body.firstQuesstion + "' AND firstAnswer='"+req.body.firstAnswer+"')")
        .then(function (result) {
            if (result == 0)
                res.send("Incorrect answer. Please try again");
            else{
                DButilsAzure.execQuery("SELECT password FROM Users WHERE (userName='"+req.body.userName+"')")
                    .then(function (pass) {
                        res.send(pass);
                    })
            }
        })
};


exports.list_all_tasks = function (req, res) {
    res.send("TEST");
};

exports.list_all_tasks = function (req, res) {
    res.send("TEST");
};