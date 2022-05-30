const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerDocument = require('../swagger.json');

const swagger = {
    get_swager : function(req,res) {
        swaggerJsdoc;
        swaggerDocument;
        res.status(200)
    }
}
module.exports = swagger