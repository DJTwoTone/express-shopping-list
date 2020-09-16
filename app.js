const express = require('express');
const itemsRoutes = require("./routes");
const ExpressError = require('./expressError');
// let items = require('./fakeDb');


const app = express()

app.use(express.json())
app.use("/items", itemsRoutes)

app.use(function (req, res, next) {
    return new ExpressError("Not Found", 404)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

// app.listen(3000, function () {
//     console.log('Running on port 3000')
// })

module.exports = app