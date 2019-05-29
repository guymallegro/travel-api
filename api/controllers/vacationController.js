'use strict';
let DButilsAzure = require('../../DButils');
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
let secret = "thisIsASecret";
let countries = ["Australia", "Bolivia", "China", "Denemark", "Israel", "Latvia", "Monaco", "August", "Norway",
    "Panama", "Switzerland", "USA"]

exports.register = function (req, res) {
    if (!req.body.userName || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.country ||
        !req.body.city || !req.body.email || !req.body.firstQuestion || !req.body.secondQuestion || !req.body.firstAnswer
        || !req.body.secondAnswer || !req.body.firstInterest || !req.body.secondInterest) {
        res.status(400).send("The request is invalid, the required fields are : userName, password, firstName, lastName," +
            " country, city, email, firstInterest, secondInterest, firstQuestion, secondQuestion, firstAnswer, secondAnswer");
        return;
    }
    if (req.body.userName.length < 3 || req.body.userName.length > 8) {
        res.status(400).send("user name should be between 3 and 8 chars.");
        return;
    }
    if (!(/^[a-zA-Z]+$/.test(req.body.userName))) {
        res.status(400).send("user name should contains letters only.");
        return;
    }
    if (req.body.password.length < 5 || req.body.password.length > 10) {
        res.status(400).send("password should be between 5 and 10 chars.");
        return;
    }
    if (!req.body.password.match("^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$")) {
        res.status(400).send("password should contains both letters and numbers.");
        return;
    }
    if (!countries.includes(req.body.country)) {
        res.status(400).send("The given country is not supported.");
        return;
    }
    DButilsAzure.execQuery("INSERT INTO Users (userName, password, firstName, lastName, country, city, email)" +
        "VALUES ('" + req.body.userName + "','" + req.body.password + "','" + req.body.firstName + "','" + req.body.lastName + "','" +
        req.body.country + "','" + req.body.city + "','" + req.body.email + "') " +
        "INSERT INTO UsersInterests (userName, firstInterest, secondInterest) " +
        "VALUES ('" + req.body.userName + "','" + req.body.firstInterest + "','" + req.body.secondInterest + "') " +
        "INSERT INTO UsersQuestions (userName, firstQuestion, firstAnswer, secondQuestion, secondAnswer) " +
        "VALUES ('" + req.body.userName + "','" + req.body.firstQuestion + "','" + req.body.firstAnswer + "','" +
        req.body.secondQuestion + "','" + req.body.secondAnswer + "')")
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.status(400).send("A user with the same username already exists.");
        });
};

exports.login = function (req, res) {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send("The request is invalid, the required fields are : userName, password");
        return;
    }
    DButilsAzure.execQuery("SELECT * FROM Users \n" +
        "WHERE (userName = '" + req.body.userName + "') AND (password = '" + req.body.password + "')")
        .then(function (result) {
            if (result.length === 1) {
                let payload = {name: req.body.userName};
                let options = {expiresIn: "1d"};
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            } else {
                res.status(400).send("The given password/username is incorrect.")
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.verifyUserAnswer = function (req, res) {
    if (!req.body.userName || !req.body.firstAnswer || !req.body.secondAnswer) {
        res.status(400).send("The request is invalid, the required fields are : userName, firstAnswer, secondAnswer");
        return;
    }
    DButilsAzure.execQuery("SELECT * FROM UsersQuestions WHERE (userName='" + req.body.userName + "') AND" +
        " (firstAnswer='" + req.body.firstAnswer + "') AND (secondAnswer='" + req.body.secondAnswer + "')")
        .then(function (result) {
            if (result == 0) {
                res.send("Incorrect answer. Please try again");
            } else {
                DButilsAzure.execQuery("SELECT password FROM Users WHERE (userName='" + req.body.userName + "')")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.status(400).send("One of the input values is invalid.")
                    })
            }
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
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
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.getUserFavorites = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("SELECT * FROM POI " +
        "JOIN UsersFavoritePOI " +
        "ON POI.poiName = UsersFavoritePOI.point " +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.updateUserInfo = function (req, res) {
    if (!req.body.password || !req.body.firstName || !req.body.lastName || !req.body.country || !req.body.city ||
        !req.body.email || !req.body.firstQuestion || !req.body.firstAnswer || !req.body.secondQuestion || !req.body.secondAnswer) {
        res.status(400).send("The request is invalid, the required fields are : password, firstName, lastName, country," +
            " city, email, firstInterest, secondInterest, firstQuestion, firstAnswer, secondQuestion, secondAnswer");
        return;
    }
    let userName = auth(req, res)
    DButilsAzure.execQuery("UPDATE Users " +
        "SET password ='" + req.body.password + "', firstName = '" + req.body.firstName + "', lastName = '" +
        req.body.lastName + "', city = '" + req.body.city + "', country = '" + req.body.country + "', email = '" + req.body.email + "'" +
        "WHERE (userName='" + userName + "') " +
        "UPDATE UsersInterests " +
        "SET firstInterest = '" + req.body.firstInterest + "', secondInterest = '" + req.body.secondInterest + "' " +
        "WHERE (userName='" + userName + "') " +
        "UPDATE UsersQuestions " +
        "SET firstQuestion = '" + req.body.firstQuestion + "', secondQuestion = '" + req.body.secondQuestion + "', firstAnswer = '" + req.body.firstAnswer + "', secondAnswer = '" + req.body.secondAnswer + "' " +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.getUserInfo = function (req, res) {
    let userName = auth(req, res)
    DButilsAzure.execQuery("SELECT * FROM Users " +
        "WHERE (userName='" + userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.getPOIDetails = function (req, res) {
    if (!req.body.poiName) {
        res.status(400).send("The request is invalid, the required fields are : poiName");
        return;
    }
    DButilsAzure.execQuery("Select distinct POI.category, POI.description, POI.watchedAmount, POI.rank, POI.image,\n" +
        "POIReviews.dateFirstReview, POIReviews.firstReview, POIReviews.dateSecondReview,\n" +
        "POIReviews.secondReview\n" +
        "from POI join POIReviews on POIReviews.poiName=POI.poiName and POI.poiName='" + req.body.poiName + "'")
        .then(function (result) {
            if (result == 0)
                res.send("The given POI doesn't exist.")
            else
                res.send(result);
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
};

exports.getUserQuestions = function (req, res) {
    if (!req.body.userName) {
        res.status(400).send("The request is invalid, the required fields are : userName");
        return;
    }
    DButilsAzure.execQuery("SELECT firstQuestion, secondQuestion FROM UsersQuestions\n" +
        "WHERE (userName = '" + req.body.userName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.getAllPOI = function (req, res) {
    DButilsAzure.execQuery("Select POI.poiName, POI.category, POI.description, POI.watchedAmount, POI.rank, POI.image,\n" +
        "POIReviews.dateFirstReview, POIReviews.firstReview, POIReviews.dateSecondReview,\n" +
        "POIReviews.secondReview\n" +
        "from POI join POIReviews on POIReviews.poiName=POI.poiName")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.addPOIReview = function (req, res) {
    if (!req.body.reviewIndex || !req.body.review || !req.body.date || !req.body.poiName) {
        res.status(400).send("The request is invalid, the required fields are : poiName, review, date, reviewIndex(1 or 2)");
        return;
    }
    auth(req, res);
    if (req.body.reviewIndex === 1) {
        DButilsAzure.execQuery("UPDATE POIReviews " +
            "SET firstReview = '" + req.body.review + "', dateFirstReview = '" + req.body.date + "'" +
            "WHERE (poiName='" + req.body.poiName + "')")
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.status(400).send("One of the input values is invalid.")
            })
    } else {
        DButilsAzure.execQuery("UPDATE POIReviews " +
            "SET secondReview = '" + req.body.review + "', dateSecondReview = '" + req.body.date + "'" +
            "WHERE (poiName='" + req.body.poiName + "')")
            .then(function (result) {
                res.send(result)
            })
            .catch(function (err) {
                res.status(400).send("One of the input values is invalid.")
            })
    }

}

exports.addFavoritePOI = function (req, res) {
    if (!req.body.poiName) {
        res.status(400).send("The request is invalid, the required fields are : poiName");
        return;
    }
    let userName = auth(req, res);
    DButilsAzure.execQuery("INSERT INTO UsersFavoritePOI " +
        "VALUES ('" + userName + "','" + req.body.poiName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}


exports.removeFavoritePOI = function (req, res) {
    if (!req.body.poiName) {
        res.status(400).send("The request is invalid, the required fields are : poiName");
        return;
    }
    let userName = auth(req, res);
    DButilsAzure.execQuery("DELETE FROM UsersFavoritePOI " +
        "WHERE (userName = '" + userName + "') AND (point = '" + req.body.poiName + "')")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.setUserRank = function (req, res) {
    let userName = auth(req, res)
    if (!req.body.poiName || !req.body.rank) {
        res.status(400).send("The request is invalid, the required fields are : poiName, rank");
        return;
    }
    if (req.body.rank < 1 || req.body.rank > 5) {
        res.status(400).send("rank should be between 1 and 5.")
        return;
    }
    DButilsAzure.execQuery("SELECT rank FROM UsersRanks WHERE (userName='" + userName + "') AND" +
        " (poiName='" + req.body.poiName + "')")
        .then(function (result) {
            if (result == 0) {
                DButilsAzure.execQuery("INSERT INTO usersRanks (userName, poiName, rank) VALUES " +
                    "('" + userName + "','" + req.body.poiName + "','" + req.body.rank + "')")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.status(400).send("One of the input values is invalid.")
                    })
            } else {
                DButilsAzure.execQuery("UPDATE usersRanks SET rank='" + req.body.rank + "' WHERE poiName='" + req.body.poiName +
                    "' AND userName='" + userName + "'")
                    .then(function (pass) {
                        res.send(pass);
                    })
                    .catch(function (err) {
                        res.status(400).send("One of the input values is invalid.")
                    })
            }
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.getAllPOIRanks = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM usersRanks")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.updatePOIRank = function (req, res) {
    if (!req.body.poiName || !req.body.rank) {
        res.status(400).send("The request is invalid, the required fields are : poiName, rank");
        return;
    }
    if (req.body.rank < 1 || req.body.rank > 5) {
        res.status(400).send("rank should be between 1 and 5.")
        return;
    }
    DButilsAzure.execQuery("UPDATE POI SET rank='" + req.body.rank + "' WHERE poiName='" + req.body.poiName + "'")
        .then(function (pass) {
            res.send(pass);
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.updateWatched = function (req, res) {
    DButilsAzure.execQuery("UPDATE POI SET watchedAmount='" + req.body.watchedAmount + "' WHERE poiName='" + req.body.poiName + "'")
        .then(function (pass) {
            res.send(pass);
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
        })
}

exports.getCategories = function (req, res) {
    DButilsAzure.execQuery("SELECT * FROM Categories")
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.status(400).send("One of the input values is invalid.")
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
