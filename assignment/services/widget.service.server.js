module.exports = function (app, widgetModel) {

    var multer = require('multer');
    var fs = require("fs");
    var uploadsDirectory = __dirname+"/../../public/uploads";
    var publicDirectory =__dirname+"/../../public";
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(!fs.existsSync(uploadsDirectory)){
                fs.mkdir(uploadsDirectory, function(err){
                    if (err) {
                        return console.error(err);
                    }
                });
            }
            cb(null, uploadsDirectory);
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'widget_image_' + Date.now()+ '.' +extension)
        }
    });
    var upload = multer({storage: storage});

    app.get("/api/widget/:widgetId", findWidgetById);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/page/:pageId/widget", createWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put("/page/:pid/widget", updateWidgetOrder);

    function uploadImage(req, res){
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;

        var imageWidget = {
            width: width,
            _id:widgetId
        };

        if(req.file){
            var myFile = req.file;
            var filename = myFile.filename;
            if(imageWidget.url){
                deleteUploadedImage(imageWidget.url);
            }
            imageWidget.url = "/uploads/" + filename;

            widgetModel
                .updateWidget(widgetId, imageWidget)
                .then(function (response) {
                    if(response.ok === 1 && response.n === 1){
                        res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/"+widgetId);
                    }
                    else{
                        res.sendStatus(404);
                    }
                }, function (err) {
                    res.sendStatus(404);
                });
        }
        else{
            res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/");
        }
    }

    function deleteUploadedImage(imageUrl) {
        if(imageUrl && imageUrl.search('http') == -1){
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
            });
        }
    }

    function updateWidgetOrder(req, res) {
        var pageId = req.params.pid;
        var startIndex = parseInt(req.query.initial);
        var endIndex = parseInt(req.query.final);
        widgetModel
            .reorderWidget(pageId, startIndex, endIndex)
            .then(function (response) {
                res.sendStatus(response);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteWidget(req, res){
        var widgetId = req.params.widgetId;
        widgetModel
            .deleteWidget(widgetId)
            .then(function (response) {
                if(response.result.n == 1 && response.result.ok == 1){
                    res.sendStatus(200);
                }
            }, function (err) {
                console.log(err);
                res.sendStatus(404);
            });
    }

    function createWidget(req, res) {
        var widget = req.body;
        var pageId = req.params.pageId;
        switch(widget.type){
            case "HEADER":
                widget.text = "Default Text";
                widget.size = 3;
                break;
            case "IMAGE":
                widget.width = "100%";
                widget.url = "http://lorempixel.com/400/200/sports/1/";
                break;
            case "YOUTUBE":
                widget.width = "100%";
                widget.url = "https://youtu.be/AM2Ivdi9c4E";
                break;
            case "HTML":
                widget.text = "Default Text";
                break;
            case "TEXT":
                widget.text = "Default Text";
                widget.placeholder = "Enter Text";
                break;
        }
        widgetModel
            .createWidget(pageId, widget)
            .then(function(widget) {
                res.json(widget);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var newWidget = req.body;
        widgetModel.
        updateWidget(widgetId, newWidget)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function(widgets) {
                res.send(widgets);
            }, function (error) {

                res.sendStatus(500).send(error);
            });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(function(widget) {
                res.json(widget);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

};