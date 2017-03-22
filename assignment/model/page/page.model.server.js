module.exports = function () {
    var model = null;
    var q = require('q');

    var api = {
        createPage: createPage,
        findPageById: findPageById,
        findAllPagesForWebsite: findAllPagesForWebsite,
        updatePage: updatePage,
        deletePage: deletePage,
        setModel: setModel
    };

    var mongoose = require('mongoose');

    var PageSchema = require('./page.schema.server.js')();
    var PageModel = mongoose.model('PageModel', PageSchema);

    return api;

    function createPage(websiteId, page) {
        var deffered = q.defer();
        page._website = websiteId;
        PageModel
            .create(page, function (err, page) {
                if(err) {
                    deffered.reject(err);
                } else {
                    model.websiteModel
                        .findWebsiteById(websiteId)
                        .then(function(website) {
                            website.pages.push(page._id);
                            website.save();
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                    deffered.resolve(page);
                }
            });
        return deffered.promise;
    }

    function findPageById(pageId) {
        var deffered = q.defer();
        PageModel
            .findById(pageId, function (err, page) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(page);
                }
            });
        return deffered.promise;
    }

    function findAllPagesForWebsite(websiteId){
        var deffered = q.defer();
        PageModel
            .find({_website:websiteId}, function (err, pages) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(pages);
                }
            });
        return deffered.promise;
    }

    function updatePage(pageId, page){
        var deffered = q.defer();
        PageModel
            .update({_id: pageId},
                {$set: page}, function (err, page) {
                    if(err) {
                        deffered.reject(err);
                    } else {
                        deffered.resolve(page);
                    }
                });
        return deffered.promise;
    }

    function deletePage(pageId){
        var deferred = q.defer();
        findPageById(pageId)
            .then(function(page) {
                console.log(page);
                model.websiteModel
                    .findWebsiteById(page._website)
                    .then(function(website) {
                        var index = website.pages.indexOf(page._id);
                        website.pages.splice(index, 1);
                        website.save();
                        PageModel
                            .remove({_id: page._id}, function (err, status) {
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

    function setModel(_model) {
        model = _model;
    }
};