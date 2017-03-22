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

    function deleteUser(userId){
        var deferred = q.defer();
        UserModel.remove({_id: userId}, function (err, status) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function setModel(_model) {
        model = _model;
    }
};