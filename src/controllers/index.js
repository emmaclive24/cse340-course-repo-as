// No model functions needed for the home page

const showHomePage = (req, res) => {
    res.render('home', { title: 'Home' });
};

export { showHomePage };
