const express = require('express');
const app = express();
const port = 80;
app.set('view engine', 'ejs');
app.set('views','views');
app.use(express.static('public'));
app.get('/', (req, res) => {
	res.render('index.ejs');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))