// Create routes/invoices.js with a router in it.

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")

const db =  require('../db');

/** GET /invoices: get list of all invoices */

router.get("/invoices", async function(req, res, next) {
    try{
        const result = await db.query(
            `SELECT id, comp_code FROM invoices`);
            console.log(result);
        return res.json({invoices: result.rows});
    }
    catch(err){
        return next(err);
    }
});


module.exports=router;