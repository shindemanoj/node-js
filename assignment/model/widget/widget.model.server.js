module.exports = function() {
    var q = require('q');
    var model = null;

    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        createWidget:createWidget,
        findAllWidgetsForPage:findAllWidgetsForPage,
        findWidgetById:findWidgetById,
        updateWidget:updateWidget,
        deleteWidget:deleteWidget,
        deleteWidgetOfPage: deleteWidgetOfPage,
        reorderWidget:reorderWidget,
        setModel:setModel
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

    function getWidgetsRecursively(count, widgetsOfPage, widgetCollectionForPage) {
        if(count == 0){
            return widgetCollectionForPage;
        }

        return WidgetModel.findById(widgetsOfPage.shift()).select('-__v')
            .then(function (widget) {
                widgetCollectionForPage.push(widget);
                return getWidgetsRecursively(--count, widgetsOfPage, widgetCollectionForPage);
            }, function (err) {
                return err;
            });
    }

    function findAllWidgetsForPage(pageId){
       return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                var widgetsOfPage = page.widgets;
                var numberOfWidgets = widgetsOfPage.length;
                var widgetCollectionForPage = [];

                return getWidgetsRecursively(numberOfWidgets, widgetsOfPage, widgetCollectionForPage);
            }, function (err) {
                return err;
            });
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
        return WidgetModel.findById(widgetId).populate('_page').then(function (widget) {
            widget._page.widgets.splice(widget._page.widgets.indexOf(widgetId),1);
            widget._page.save();
            if(widget.type == "IMAGE"){
                deleteUploadedImage(widget.url);
            }
            return WidgetModel.remove({_id:widgetId});
        }, function (err) {
            return err;
        });
    }

    function deleteWidgetOfPage(widgetId) {
        return WidgetModel.findById(widgetId)
            .then(function (widget) {
                if(widget.type == "IMAGE"){
                    deleteUploadedImage(widget.url);
                }
                return WidgetModel.remove({_id: widgetId});
            }, function (err) {
                return err;
            });
    }

    function deleteUploadedImage(imageUrl) {
        // Local helper function
        if(imageUrl && imageUrl.search('http') == -1){
            // Locally uploaded image
            // Delete it
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log('successfully deleted '+publicDirectory+imageUrl);
            });
        }
    }

    function reorderWidget(pageId, start, end) {
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                return 200;
            }, function (err) {
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }
};