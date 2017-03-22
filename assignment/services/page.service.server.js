module.exports = function (app, pageModel) {
    app.get("/api/page/:pageId", findPageById);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);
    app.post("/api/website/:websiteId/page", createPage);

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        pageModel.
        deletePage(pageId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
        });
    }

    function createPage(req, res) {
        var page = req.body;
        var websiteId = req.params['websiteId'];
        pageModel
            .createPage(websiteId, page)
            .then(function(page) {
                res.json(page);
            }, function (error) {
                res.sendStatus(500).send(error);
        });
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var page = req.body;
        pageModel.
            updatePage(pageId, page)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function(pages) {
                res.send(pages);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findPageById(req, res) {
        var pageId = req.params['pageId'];
        pageModel
            .findPageById(pageId)
            .then(function(page) {
                res.json(page);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

};