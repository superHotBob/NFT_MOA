const my_request = {
    get_404: function(req, res) {
        res.send(`<h1 style="margin-top: 40vh;text-align: center;">
        404! This is an invalid URL.</h1>`);
    },
    getDistance: function(req, res) {
            distance.find(req, res, function(err, dist) {
                if (err)
                    res.send(err);
                res.json(dist);
            });
        },
 };
 
 module.exports = my_request;