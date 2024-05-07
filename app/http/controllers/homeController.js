const Menu = require("../../models/menu");

function homeController() {
    return {
        async index(req, res) {
            try {
                const cakes = await Menu.find();
                // console.log(cakes);
                res.render('home', { cakes: cakes });
            } catch (error) {
                console.error('Error fetching data:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    };
}

module.exports = homeController;
