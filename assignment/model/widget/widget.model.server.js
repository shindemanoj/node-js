module.exports = function() {
    var q = require('q');
    var model = null;

    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        //"deleteWidgetOfPage":deleteWidgetOfPage,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    var mongoose = require("mongoose");
    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);

    return api;

    function createWidget(pageId, widget) {
        var deffered = q.defer();
        widget._page = pageId;
        WidgetModel
            .create(widget, function (err, widget) {
                if(err) {
                    deffered.reject(err);
                } else {
                    model.pageModel
                        .findPageById(pageId)
                        .then(function(page) {
                            page.widgets.push(widget._id);
                            page.save();
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                    deffered.resolve(widget);
                }
            });
        return deffered.promise;
    }

    function findWidgetById(widgetId) {
        var deffered = q.defer();
        WidgetModel
            .findById(widgetId, function (err, widget) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(widget);
                }
            });
        return deffered.promise;
    }

    function findAllWidgetsForPage(pageId){
        var deffered = q.defer();
        WidgetModel
            .find({_page:pageId}, function (err, widgets) {
                if(err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(widgets);
                }
            });
        return deffered.promise;
    }

    function updateWidget(widgetId, widget){
        var deffered = q.defer();
        WidgetModel
            .update({_id: widgetId},
                {$set: widget}, function (err, status) {
                    if(err) {
                        deffered.reject(err);
                    } else {
                        deffered.resolve(status);
                    }
                });
        return deffered.promise;
    }

    function deleteWidget(widgetId){
        var deferred = q.defer();
        findWidgetById(widgetId)
            .then(function(widget) {
                model.pageModel
                    .findPageById(widget._page)
                    .then(function(page) {
                        var index = page.widgets.indexOf(widget._id);
                        page.widgets.splice(index, 1);
                        page.save();
                        WidgetModel
                            .remove({_id: widget._id}, function (err, status) {
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

    function reorderWidget(pageId, start, end) {
        var deferred = q.defer();
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                deffered.resolve(page);
            }, function (err) {
                deffered.reject(err);
            });
    }

    function setModel(_model) {
        model = _model;
    }
};