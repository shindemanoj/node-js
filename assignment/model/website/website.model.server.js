module.exports = function () {
    var q = require('q');
    var model = null;
    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findWebsiteById: findWebsiteById,
        findAllWebsitesForUser: findAllWebsitesForUser,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        deleteWebsiteAndChildren: deleteWebsiteAndChildren,
        setModel: setModel,
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
        return WebsiteModel.findOne({_id:websiteId}).populate('_user').then(function (website) {
            website._user.websites.splice(website._user.websites.indexOf(websiteId),1);
            website._user.save();
            return deleteWebsiteAndChildren(websiteId);
        }, function (err) {
            console.log(err);
            return err;
        });
    }

    function recursiveDelete(pagesOfWebsite, websiteId) {
        if(pagesOfWebsite.length == 0){
            return WebsiteModel.remove({_id: websiteId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    console.log(err);
                    return err;
                });
        }

        return model.pageModel.deletePageAndChildren(pagesOfWebsite.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(pagesOfWebsite, websiteId);
                }
            }, function (err) {
                return err;
            });
    }

    function deleteWebsiteAndChildren(websiteId){
        return WebsiteModel.findById({_id: websiteId}).select({'pages':1})
            .then(function (website) {
                var pagesOfWebsite = website.pages;
                return recursiveDelete(pagesOfWebsite, websiteId);
            }, function (err) {
                return err;
            });
    }
    function setModel(_model) {
        model = _model;
    }
};