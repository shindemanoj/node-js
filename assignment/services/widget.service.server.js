module.exports = function (app) {
    app.get("/api/widget/:widgetId", findWidgetById);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post("/api/page/:pageId/widget", createWidget);

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    function uploadImage(req, res) {

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var widget = req.body.widget;
        widget._id = widgetId;
        widget.widgetType = "IMAGE";
        widget.pageId = "321";
        widget.width = width;
        widget.url = path;
        widgets.push(widget);
        res.redirect('/assignment/#/user/456/website/456/page/321/widget');
    }

     var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "https://i.kinja-img.com/gawker-media/image/upload/s--UE7cu6DV--/c_scale,fl_progressive,q_80,w_800/xoo0evqxzxrrmrn4ayoq.jpg"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": '<p>Anker’s kevlar-reinforced PowerLine cables are <a href="http://gear.lifehacker.com/your-favorite-lightning-cables-anker-powerline-and-pow-1782036601" target="_blank" rel="noopener">far and away our readers’ top choice for charging their gadgets</a>, and you can save on several models today, including some from the nylon-wrapped PowerLine+ collection. I use these cables every single day, and I’ve never had one fray or stop working. Just be sure to note the promo codes below.<br></p>'},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for(var w in widgets) {
            if(widgets[w]._id === widgetId) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function createWidget(req, res) {
        var widget = req.body;
        widget.pageId = req.params.pageId;
        switch(widget.widgetType){
            case "HEADER":
                widget.text = "Default Text";
                widget.size = 3;
                break;
            case "IMAGE":
                widget.width = "100%";
                widget.url = "http://lorempixel.com/";
                break;
            case "YOUTUBE":
                widget.width = "100%";
                widget.url = "http://lorempixel.com/";
                break;
            case "HTML":
                widget.text = "Default Text";
                break;
        }
        widgets.push(widget);
        res.json(widget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var newWidget = req.body;
        for(w in widgets){
            widget = widgets[w];
            if(widget._id === widgetId){
                switch(widget.widgetType){
                    case "HEADER":
                        widget.text = newWidget.text;
                        widget.size = newWidget.size;
                        res.sendStatus(200);
                        return;
                    case "IMAGE":
                        widget.width = newWidget.width;
                        widget.url = newWidget.url;
                        res.sendStatus(200);
                        return;
                    case "YOUTUBE":
                        widget.width = newWidget.width;
                        widget.url = newWidget.url;
                        res.sendStatus(200);
                        return;
                    case "HTML":
                        widget.text = newWidget.text;
                        res.sendStatus(200);
                        return;
                }
            }
        }
        res.sendStatus(404);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var widgetsOfId = [];
        for(var w in widgets) {
            if(widgets[w].pageId === pageId) {
                widgetsOfId.push(widgets[w]);
            }
        }
        res.send(widgetsOfId);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        for(var w in widgets) {
            if(widgets[w]._id === widgetId) {
                res.send(widgets[w]);
                return;
            }
        }
        res.sendStatus(404).send({});
    }

};