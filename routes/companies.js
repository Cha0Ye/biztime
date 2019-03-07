// Create routes/companies.js with a router in it.

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")

const db =  require('../db');

/** GET /companies: get list of all companies */

router.get("/companies", async function(req, res, next) {
    try{
        const result = await db.query(
            `SELECT code, name FROM companies`);
            console.log(result);
        return res.json({companies: result.rows});
    }
    catch(err){
        return next(err);
    }
});

/** GET /companies/:code get a single company */

router.get("/companies/:code", async function(req, res, next) {
    try{
        let code = req.params.code;
        const result = await db.query(
            `SELECT code, name, description FROM companies WHERE code=$1`, [code]);
            // console.log(result.rows[0]);
            if (result.rows[0]) {
                return res.json({companies: result.rows[0]});
            }
        throw new ExpressError("Company code does not exist", 404);
        }
    catch(err){
        return next(err);
    }
});

/** POST /companies: create a new company */

router.post("/companies", async function(req, res, next) {
    try{
        const {code, name, description} = req.body;
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
                VALUES ($1, $2, $3)
                RETURNING code, name, description`, 
            [code, name, description]
        );
            return res.status(201).json(result.rows[0]);
    }
    catch(err){
        return next(err);
    }
});

/** PUT /companies/:code: update an existing company */

router.put("/companies/:code", async function(req, res, next) {
    try{
        let code = req.params.code;
        const {name, description} = req.body;

        const result = await db.query(
            `SELECT code, name, description FROM companies WHERE code=$1`, [code]);
            // console.log(result.rows[0]);
            if (result.rows[0]) {
                const result = await db.query(
                    `UPDATE companies 
                    SET name=$1, description=$2
                    WHERE code=$3
                    RETURNING code, name, description`, 
                    [name, description, code]
                );
                return res.json(result.rows[0]);
            }
            throw new ExpressError("Company code does not exist", 404);
    }
    catch(err){
        return next(err);
    }
});

/** DELETE /companies/:code: update an existing company */

router.delete("/companies/:code", async function(req, res, next) {
    let code = req.params.code;
    try {
        const result = await db.query(
            `SELECT code, name, description FROM companies WHERE code=$1`, [code]);
            // console.log(result.rows[0]);
            if (result.rows[0]) {
                const result = await db.query(
                "DELETE FROM companies WHERE code = $1",
                [code]
                );
                return res.json({message: "Deleted"});
            }
            throw new ExpressError("Company code does not exist", 404);
    }

    catch (err) {
        return next(err);
    }
    });


module.exports = router;