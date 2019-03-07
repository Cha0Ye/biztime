// Create routes/companies.js with a router in it.

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")

const db =  require('../db');

/** GET /users: get list of users */

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

// /companies** DELETE /users/[id]: delete user, return status */

// router.delete("/companies/:id", function(req, res) {
//   const idx = users.findIndex(u => u.id === +req.params.id);
//   users.splice(idx, 1);
//   return res.json({ message: "Deleted" });
// });


module.exports = router;