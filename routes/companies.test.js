process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");

let db = require("../db")

let company= {code:'Apple', name:'Apple Computer', description:'Maker of OSX.'}
let invoice= {comp_code:'Apple', amt:100, paid:false, paid_date:null}
         
beforeEach(async () => {
    // create one record in companies
    const companyResult = await db.query(
        `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3)`, 
        [company.code, company.name, company.description]
    );
    // company = companyResult.rows[0];
    // RETURNING code, name, description
    // create one record in invoices
    const invoiceResult = await db.query(
        `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
        [invoice.comp_code, invoice.amt]
    );
    invoice.id= invoiceResult.rows[0].id;
});

            // 

afterEach(async () => {
    // delete any data created by test
    await db.query("DELETE FROM companies");
});


/** GET /companies - returns `{companies: [company]}` */

describe("GET /companies", async function () {
  test("Gets a list of companies", async function () {
    const response = await request(app).get(`/companies`);
    const { companies } = response.body;
    expect(response.statusCode).toBe(200);
    expect(companies).toHaveLength(1);
  });
});
// end


// /** GET /companies/:code get a single company with a single invoice */

describe("GET /companies/:code", async function () {
  test("Gets a single company and single invoice", async function () {
    const response = await request(app).get(`/companies/${company.code}`);
    expect(response.statusCode).toBe(200);
    console.log('response.body.compan= ',response.body.company);
    expect(response.body.company).toEqual({ "code":"Apple", 
                    "name":"Apple Computer", 
                    "description": "Maker of OSX.", 
                    "invoices": [Number(`${invoice.id}`)]
        });
  });

  test("Responds with 404 if can't find company", async function () {
    const response = await request(app).get(`/companies/0`);
    expect(response.statusCode).toBe(404);
  });
});
// end


// /** POST /items - create item from data; return `{item: item}` */

// describe("POST /items", async function () {
//   test("Creates a new item", async function () {
//     const response = await request(app)
//       .post(`/items`)
//       .send({
//         name: "Taco",
//         price: 0
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.item).toHaveProperty("name");
//     expect(response.body.item).toHaveProperty("price");
//     expect(response.body.item.name).toEqual("Taco");
//     expect(response.body.item.price).toEqual(0);
//   });
// });
// // end


// /** PATCH /items/[name] - update item; return `{item: item}` */

// describe("PATCH /items/:name", async function () {
//   test("Updates a single item", async function () {
//     const response = await request(app)
//       .patch(`/items/${item.name}`)
//       .send({
//         name: "Troll"
//       });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.item).toEqual({
//       name: "Troll"
//     });
//   });

//   test("Responds with 404 if can't find item", async function () {
//     const response = await request(app).patch(`/items/0`);
//     expect(response.statusCode).toBe(404);
//   });
// });
// // end


// /** DELETE /items/[name] - delete item, 
//  *  return `{message: "item deleted"}` */

// describe("DELETE /items/:name", async function () {
//   test("Deletes a single a item", async function () {
//     const response = await request(app)
//       .delete(`/items/${item.name}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual({ message: "Deleted" });
//   });
// });
// // end


// end afterEach
afterAll(async function() {
    // close db connection
    await db.end();
  });