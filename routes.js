const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError")
let items = require("./fakeDb");

router.get("/", function (req, res) {
    return res.json({ items })
})

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

router.get("/:name", function (req, res) {
    const searchedItem = items.find(item => item.name === req.params.name)
    if (searchedItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    return res.json({ name: searchedItem.name,
                        price: searchedItem.price
                    })
})

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

router.delete("/:name", function (req, res) {
    try {
        const searchedItem = items.findIndex(item => item.name === req.params.name)
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
