module.exports = function (app, websiteModel) {
    app.get("/api/website/:websiteId", findWebsiteById);
    app.get("/api//user/:userId/website", findAllWebsitesForUser);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);
    app.post("/api/user/:userId/website", createWebsite);


    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        websiteModel.
            deleteWebsite(websiteId)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function createWebsite(req, res) {
        var newWebsite = req.body;
        var userId = req.params['userId'];
        websiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(function(newWebsite) {
                res.json(newWebsite);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;
        websiteModel.
            updateWebsite(websiteId, website)
            .then(function (status) {
                res.send(status);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params['userId'];
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function(sites) {
                res.send(sites);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        websiteModel
            .findWebsiteById(websiteId)
            .then(function(website) {
                res.json(website);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

};