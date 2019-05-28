'use strict';
let DButilsAzure = require('../../DButils');
var User = require('../models/user');
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
let secret = "thisIsASecret";
let countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "August", "Norway",
    "Panama", "Switzerland", "USA"]

exports.register = function (req, res) {
    if(!countries.includes(req.body.country)){
        res.status(400).send("The given country is not supported.")
        return;
    }
    DButilsAzure.execQuery("INSERT INTO Users (userName, password, firstName, lastName, country, city, email)\n" +
        "VALUES (" + req.body.userName + "," + req.body.password + "," + req.body.firstName + "," + req.body.lastName + "," +
        req.body.country + "," + req.body.city + "," + req.body.email + ")")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.login = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM Users \n" +
        "WHERE (userName = '" + req.body.userName + "') AND (password = '" + req.body.password + "')")
        .then(function (result) {
            if (result.length === 1) {
                let payload = {name: req.body.userName};
                let options = {expiresIn: "1d"};
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            } else {
                res.status(400).send("Invalid username or password")
            }
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.verifyAnswer = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM UsersQuestions WHERE (userName='" + req.body.userName + "') AND" +
        "(firstQuestion='" + req.body.firstQuestion + "') AND (firstAnswer='" + req.body.firstAnswer + "')")
        .then(function (result) {
            if (result == 0) {
                console.log(result);
                res.send("Incorrect answer. Please try again");
            } else {
                console.log(result);
                DButilsAzure.execQuery("SELECT password FROM Users WHERE (userName='" + req.body.userName + "')")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.send(err)
                    })
            }
        })
        .catch(function (err) {
            res.send(err)
        })
};


exports.getUserRecommendation = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("SELECT poiName, category, description, watchedAmount, rank, image FROM UsersInterests " +
        "JOIN POI " +
        "ON firstInterest = category OR secondInterest = category " +
        "WHERE (userName = '" + userName + "') " +
        "ORDER BY rank DESC")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.getUserFavorites = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("SELECT * FROM POI " +
        "JOIN UsersFavoritePOI " +
        "ON poiName = point " +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.updateUser = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("UPDATE Users " +
        "SET password ='" + req.body.password + "', firstName = '" + req.body.firstName + "', lastName = '" +
        req.body.lastName + "', city = '" + req.body.city + "', country = '" + req.body.country + "', email = '" + req.body.email + "'" +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.getUser = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("SELECT * FROM Users " +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
};

exports.getPOIDetails = function (req, res) {
    DButilsAzure.execQuery("Select distinct POI.category, POI.description, POI.watchedAmount, POI.rank, POI.image,\n" +
        "POIReviews.dateFirstReview, POIReviews.firstReview, POIReviews.dateSecondReview,\n" +
        "POIReviews.secondReview\n" +
        "from POI join POIReviews on POIReviews.poiName=POI.poiName and POI.poiName='" + req.body.poiName + "'")
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err)
        })
};

exports.getUserQuestions = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM UsersQuestions\n" +
        "WHERE (userName = '" + req.body.userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.getAllPOI = function (req, res) {
    DButilsAzure.execQuery("Select distinct POI.category, POI.description, POI.watchedAmount, POI.rank, POI.image,\n" +
        "POIReviews.dateFirstReview, POIReviews.firstReview, POIReviews.dateSecondReview,\n" +
        "POIReviews.secondReview\n" +
        "from POI join POIReviews on POIReviews.poiName=POI.poiName")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.addReview = function (req, res) {
    auth(req, res);
    if (req.body.firstReview) {
        DButilsAzure.execQuery("UPDATE POIReviews " +
            "SET firstReview = '" + req.body.review + "', dateFirstReview = '" + req.body.date + "'" +
            "WHERE (poiName='" + req.body.poi + "')")
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.send(err)
            })
    } else {
        DButilsAzure.execQuery("UPDATE POIReviews " +
            "SET secondReview = '" + req.body.review + "', dateSecondReview = '" + req.body.date + "'" +
            "WHERE (poiName='" + req.body.poi + "')")
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.send(err)
            })
    }

}

exports.addFavoritePOI = function (req,res) {
    let userName = auth(req, res);
    DButilsAzure.execQuery("INSERT INTO UsersFavoritePOI " +
        "VALUES ('"+userName+"','" + req.body.poi + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.removeFavoritePOI = function (req, res) {
    let userName = auth(req, res);
    DButilsAzure.execQuery("DELETE FROM UsersFavoritePOI " +
        "WHERE (userName = '" + userName + "') AND (point = '" + req.body.poi + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.setUserRank = function (req, res) {
    DButilsAzure.execQuery("SELECT rank FROM UsersRanks WHERE (userName='" + req.body.userName + "') AND" +
        " (poiName='" + req.body.poiName + "')")
        .then(function (result) {
            if (result == 0) {
                DButilsAzure.execQuery("INSERT INTO usersRanks (userName, poiName, rank) VALUES " +
                    "('"+req.body.userName+ "','"+req.body.poiName+"','"+req.body.rank+"')")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.send(err)
                    })
            } else {
                DButilsAzure.execQuery("UPDATE usersRanks SET rank='"+req.body.rank+"' WHERE poiName='"+req.body.poiName+
                    "' AND userName='"+req.body.userName+"'")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.send(err)
                    })
            }
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.getAllRanks = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM usersRanks")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.updatePOIRank = function (req, res) {
    DButilsAzure.execQuery("UPDATE POI SET rank='"+req.body.rank+"' WHERE poiName='"+req.body.poiName+"'")
        .then(function (pass) {
            res.send(pass);
        })
        .catch(function (err) {
            res.send(err)
        })
}

function auth(req, res) {
    const token = req.header("x-auth-token");
    if (!token) res.status(400).send("Access denied. No token provided.");
    try {
        req.decoded = jwt.verify(token, secret);
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
    return req.decoded.name;
}
