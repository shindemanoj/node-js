module.exports = function (app, userModel) {
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserByUserId);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user", createUser);

     function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel.
            deleteUser(userId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
        });
    }

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(function(user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        var newUser = req.body;
        userModel.updateUser(userId, newUser)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findUserByUserId(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function(user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if(username && password) {
            findUserByCredentials(req, res);
        } else if(username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];
        userModel
            .findUserByUsername(username)
            .then(function(user) {
                if(user) {
                    res.json(user);
                } else {
                    res.sendStatus(400).send('User not found for username: ' + username);
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserByCredentials(req, res){
        var username = req.query['username'];
        var password = req.query['password'];
        userModel
            .findUserByCredentials(username, password)
            .then(function(user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }
};