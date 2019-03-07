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

/** GET /invoices/:code get a single company */

router.get("/invoices/:code", async function(req, res, next) {
    try{
        let code = req.params.code;
        const result = await db.query(
            `SELECT id, amt, paid, add_date, paid_date FROM invoices WHERE code=$1`, [code]);
            // console.log(result.rows[0]);
            if (result.rows[0]) {
                return res.json({invoices: result.rows[0]});
            }
        throw new ExpressError("Company code does not exist", 404);
        }
    catch(err){
        return next(err);
    }
});


module.exports=router;