module.exports = function () {
    var q = require('q');
    var model = null;
    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findWebsiteById: findWebsiteById,
        findAllWebsitesForUser: findAllWebsitesForUser,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel: setModel,
        deleteAllPages: deleteAllPages
    };

    var mongoose = require('mongoose');

    var WebsiteSchema = require('./website.schema.server.js')();
    var WebsiteModel = mongoose.model('WebsiteModel', WebsiteSchema);

    return api;

    function createWebsiteForUser(userId, website) {
        var deffered = q.defer();
        website._user = userId;
        WebsiteModel
            .create(website, function (err, website) {
                if(err) {
                    deffered.reject(err);
                } else {
                    model.userModel
                        .findUserById(userId)
                        .then(function(user) {
                            user.websites.push(website._id);
                            user.save();
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                    deffered.resolve(website);
                }
            });
        return deffered.promise;
    }

    function findWebsiteById(websiteId) {
        var deffered = q.defer();
        WebsiteModel
            .findById(websiteId, function (err, website) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(website);
                }
            });
        return deffered.promise;
    }

    function findAllWebsitesForUser(userId){
        var deffered = q.defer();
        WebsiteModel
            .find({_user:userId}, function (err, websites) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(websites);
                }
            });
        return deffered.promise;
    }

    function updateWebsite(websiteId, website){
        var deffered = q.defer();
        WebsiteModel
            .update({_id: websiteId},
                {$set: website}, function (err, website) {
                 if(err) {
                     deffered.reject(err);
                 } else {
                     deffered.resolve(website);
                 }
             });
        return deffered.promise;
    }

    function deleteWebsite(websiteId){
        var deferred = q.defer();
        findWebsiteById(websiteId)
            .then(function(website) {
                model.userModel
                    .findUserById(website._user)
                    .then(function(user) {
                        var index = user.websites.indexOf(website._id);
                        user.websites.splice(index, 1);
                        user.save();
                        WebsiteModel
                            .remove({_id: website._id}, function (err, status) {
                                if(err) {
                                    deferred.reject(err);
                                } else {
                                    deferred.resolve(status);
                                }
                            });
                    }, function (error) {
                        res.sendStatus(500).send(error);
                    });
            }, function (error) {
                res.sendStatus(500).send(error);
            });
        return deferred.promise;
     }

     function deleteAllPages(pageId, pages, website){
         if(pages.length > 0){
             console.log(pageId);
             model.pageModel.deletePage(pageId)
                 .then(function (status) {
                     deleteAllPages(pages[0], pages, website)
                 }, function (err) {
                     res.sendStatus(500).send(err);
                 });
         }
         else{
             model.userModel
                 .findUserById(website._user)
                 .then(function(user) {
                     var index = user.websites.indexOf(website._id);
                     user.websites.splice(index, 1);
                     user.save();
                     WebsiteModel
                         .remove({_id: website._id}, function (err, status) {
                             if(err) {
                                 deferred.reject(err);
                             } else {
                                 deferred.resolve(status);
                             }
                         });
                 }, function (error) {
                     res.sendStatus(500).send(error);
                 });
         }
     }

    function setModel(_model) {
        model = _model;
    }
};