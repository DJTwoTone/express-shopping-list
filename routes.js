const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError")
let items = require("./fakeDb");
// const { query } = require("express");



// GET /items - this should render a list of shopping items.
// Here is what a response looks like:

// [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
router.get("/", function (req, res) {
    return res.json({ items })
})

// POST /items - this route should accept JSON data and add it to the shopping list.
// Here is what a sample request/response looks like:

// {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}

router.post("/", function (req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) throw new ExpressError("Cannot add empty item", 400);
        if (!req.body.name) throw new ExpressError("Item name is required", 400);
        if (!req.body.price) throw new ExpressError("Item price is required", 400);
        const newItem = { name: req.body.name,  price: parseFloat(req.body.price) }
        items.push(newItem)
        return res.status(201).json({added: newItem})
        
    } catch (err) {
        return next(err)
    }
})

// GET /items/:name - this route should display a single item’s name and price.
// Here is what a sample response looks like:

// {“name”: “popsicle”, “price”: 1.45}

router.get("/:name", function (req, res) {
    const searchedItem = items.find(item => item.name === req.params.name)
    if (searchedItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    return res.json({ name: searchedItem.name,
                        price: searchedItem.price
                    })
})


// PATCH /items/:name, this route should modify a single item’s name and/or price.
// Here is what a sample request/response looks like:

// {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}

router.patch("/:name", function(req, res, next) {
    try {
        if (Object.keys(req.body).length === 0) throw new ExpressError("Cannot update with empty item", 400)
        if (!req.body.name) throw new ExpressError("Item name is required", 400)
        if (!req.body.price) throw new ExpressError("Item price is required", 400)
        let searchedItem = items.find(item => item.name === req.params.name)
        if (searchedItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        searchedItem.name = req.body.name
        searchedItem.price = parseFloat(req.body.price)
        return res.json({ updated: searchedItem })
        
    } catch (err) {
        return next(err)
    }
})


// DELETE /items/:name - this route should allow you to delete a specific item from the array.

// Here is what a sample response looks like:

// {message: “Deleted”}

router.delete("/:name", function (req, res) {
    try {
        const searchedItem = items.findIndex(item => item.name === req.params.name)
        console.log(items)
        console.log(req.params.name)
        console.log(searchedItem)
        if (searchedItem === -1) {
            throw new ExpressError("Item not found", 404)
        }
        items.splice(searchedItem, 1)
        return res.json({ message: "Deleted" })
    } catch (err) {
        return next(err)
    }
})

module.exports = router;
