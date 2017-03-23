module.exports = function () {
    var q = require('q');
    var model = null;

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel
    };

    var mongoose = require('mongoose');

    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    return api;

    function createUser(user) {
        var deffered = q.defer();
        UserModel
            .create(user, function (err, user) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(user);
                }
            });
        return deffered.promise;
    }

    function findUserById(userId) {
        var deffered = q.defer();
        UserModel
            .findById(userId, function (err, user) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(user);
                }
            });
        return deffered.promise;
    }

    function findUserByUsername(username){
        var deffered = q.defer();
        UserModel
            .find({username:username}, function (err, user) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(user[0]);
                }
            });
        return deffered.promise;
    }

    function findUserByCredentials(username, password){
        var deffered = q.defer();
        UserModel
            .find({username:username, password:password}, function (err, user) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(user[0]);
                }
            });
        return deffered.promise;
    }

    function updateUser(userId, user){
        var deffered = q.defer();
        UserModel
            .update({_id: userId},
                {$set: user}, function (err, user) {
                 if(err) {
                     deffered.reject(err);
                 } else {
                     deffered.resolve(user);
                 }
             });
        return deffered.promise;
    }

    function recursiveDelete(websitesOfUser, userId) {
        if(websitesOfUser.length == 0){
            return UserModel.remove({_id: userId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    return err;
                });
        }

        return model.websiteModel.deleteWebsiteAndChildren(websitesOfUser.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(websitesOfUser, userId);
                }
            }, function (err) {
                return err;
            });
    }

    function deleteUser(userId) {
        return UserModel.findById({_id: userId})
            .then(function (user) {
                var websitesOfUser = user.websites;
                return recursiveDelete(websitesOfUser, userId);
            }, function (err) {
                console.log(err);
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }
};