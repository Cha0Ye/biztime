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

/* GET /invoices/:id
Returns obj on given invoice.
If invoice cannot be found, returns 404.
Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}x
*/
router.get("/invoices/:id", async function(req, res, next) {
    try{
        let id = req.params.id;
        const invoiceResult = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, comp_code 
            FROM invoices
            WHERE id=$1`, 
            [id]
            );
            if (invoiceResult.rows.length===0) {
              throw new ExpressError("Invoice code does not exist", 404);
            }
            code = invoiceResult.rows[0].comp_code;

            const companyResult = await db.query(
                `SELECT code, name, description 
                FROM companies
                WHERE code =$1`,[code]);
                //if (companyResult.rows[0]) {
            if(companyResult.rows.length === 0){
                throw new ExpressError("Company code does not exist", 404);
            }
                return res.json({invoice: { id: id, 
                                            amt: invoiceResult.rows[0].amt, 
                                            paid: invoiceResult.rows[0].paid, 
                                            add_date: invoiceResult.rows[0].add_date, 
                                            paid_date: invoiceResult.rows[0].paid_date, 
                                            company: {  code: code, 
                                                        name: companyResult.rows[0].name, 
                                                        description: companyResult.rows[0].description
                                            }
                                            }
                                        });
        }
        
    catch(err){
        return next(err);
    }
});


/** POST /invoices
Adds an invoice.
Needs to be passed in JSON body of: {comp_code, amt}
Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
*/

router.post("/invoices", async function(req, res, next) {
    try{
        const {comp_code, amt} = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
                VALUES ($1, $2)
                RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
            [comp_code, amt]
        );
            return res.status(201).json(result.rows[0]);
    }
    catch(err){
        return next(err);
    }
});


/** PUT /invoices/[id]
Updates an invoice.
If invoice cannot be found, returns a 404.
Needs to be passed in a JSON body of {amt}
Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}} */

router.put("/invoices/:id", async function(req, res, next) {
    try{
        let id = req.params.id;
        const {amt} = req.body;

        const amtResult = await db.query(
            `SELECT amt FROM invoices WHERE id=$1`, [id]);
            // console.log(result.rows[0]);
            if (amtResult.rows.length === 0) {
                throw new ExpressError("Company id does not exist", 404);
            }
            const putResult = await db.query(
                `UPDATE invoices 
                SET amt=$1
                WHERE id=$2
                RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
                [amt,id]
            );
            return res.json(putResult.rows[0]);
}
    catch(err){
        return next(err);
    }
});

/** DELETE /invoices/[id]
Deletes an invoice.
If invoice cannot be found, returns a 404.
Returns: {status: "deleted"} */

router.delete("/invoices/:id", async function(req, res, next) {
    let id = req.params.id;
    try {
        const result = await db.query(
            `SELECT id FROM invoices WHERE id=$1`, [id]);
            // console.log(result.rows[0]);
            if (result.rows.length === 0) {
                throw new ExpressError("Company id does not exist", 404);
            }
            const deleteResult = await db.query(
            "DELETE FROM invoices WHERE id = $1",
            [id]
            );
            return res.json({message: "Deleted"});
    }
    catch (err) {
        return next(err);
    }
    });



module.exports=router;