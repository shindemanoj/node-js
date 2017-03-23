module.exports = function () {
    var model = null;
    var q = require('q');

    var api = {
        createPage: createPage,
        findPageById: findPageById,
        findAllPagesForWebsite: findAllPagesForWebsite,
        updatePage: updatePage,
        deletePage: deletePage,
        deletePageAndChildren: deletePageAndChildren,
        setModel: setModel,
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

    function deletePage(pageId) {
        return PageModel.findById(pageId).populate('_website').then(function (page) {
            page._website.pages.splice(page._website.pages.indexOf(pageId),1);
            page._website.save();
            return deletePageAndChildren(pageId);
        }, function (err) {
            return err;
        });
    }

    function recursiveDelete(widgetsOfPage, pageId) {
        if(widgetsOfPage.length == 0){
            return PageModel.remove({_id: pageId})
                .then(function (response) {
                    if(response.result.n == 1 && response.result.ok == 1){
                        return response;
                    }
                }, function (err) {
                    return err;
                });
        }

        return model.widgetModel.deleteWidgetOfPage(widgetsOfPage.shift())
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    return recursiveDelete(widgetsOfPage, pageId);
                }
            }, function (err) {
                return err;
            });
    }

    function deletePageAndChildren(pageId) {
        return PageModel.findById({_id: pageId})
            .then(function (page) {
                var widgetsOfPage = page.widgets;
                return recursiveDelete(widgetsOfPage, pageId);
            }, function (err) {
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }
};