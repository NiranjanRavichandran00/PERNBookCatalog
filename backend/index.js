const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
//middleware
app.use(cors());
app.use(express.json());

//Routes 

//Find Single Book
app.get("/findBookISBN/:searchTerm", async (req, res) => {
    try {
        let {searchTerm} = req.params;
        searchTerm = searchTerm.toString().toLowerCase()

        const matchingBooks = await pool.query(`SELECT  a.isbn,  a.title, \
                    string_agg(c.author_name, ',' ORDER BY c.author_name) AS Authors, \
                    EXISTS(SELECT * FROM book_loans WHERE a.isbn = book_loans.isbn AND date_in IS NULL)\
            FROM    Book a \
                    INNER JOIN book_authors b \
                        ON a.isbn = b.isbn \
                    INNER JOIN Authors c \
                        ON b.author_id = c.author_id \
            \
            GROUP   BY a.isbn, a.title \
            HAVING a.isbn='${searchTerm}';`)
            //console.log(matchingBooks.rows);
            res.json(matchingBooks.rows)
    } catch (error) {
        console.error(error.message)
    }
});
//Search/Query books
app.get("/findBook/:searchTerm", async (req, res) => {
    try {
        let {searchTerm} = req.params;
        searchTerm = searchTerm.toString().toLowerCase()

        const matchingBooks = await pool.query(`SELECT  a.isbn,  a.title, \
                    string_agg(c.author_name, ',' ORDER BY c.author_name) AS Authors, \
                    EXISTS(SELECT * FROM book_loans WHERE a.isbn = book_loans.isbn AND date_in IS NULL)\
            FROM    Book a \
                    INNER JOIN book_authors b \
                        ON a.isbn = b.isbn \
                    INNER JOIN Authors c \
                        ON b.author_id = c.author_id \
            \
            GROUP   BY a.isbn, a.title \
            HAVING LOWER(string_agg(c.author_name, ',' ORDER BY c.author_name)) LIKE '%${searchTerm}%' \
            OR a.isbn LIKE '%${searchTerm}%' OR LOWER(a.title) like '%${searchTerm}%'`)
            res.json(matchingBooks.rows)
    } catch (error) {
        console.error(error.message)
    }
});

//Check in books

//Find Book loans
app.get("/findBookLoans/:searchTerm", async (req, res) => {
    try {
        let {searchTerm} = req.params;
        searchTerm = searchTerm.toString().toLowerCase()

        const matchingBookLoans = await pool.query(`SELECT  a.loan_id, a.isbn,  a.card_id, b.b_fname, b.b_lname, a.date_out, a.due_date \
            FROM    Book_Loans a \
                    INNER JOIN borrower b \
                        ON a.card_id = b.card_id \
            WHERE date_in IS NULL AND (a.isbn = '${searchTerm}' \
            OR LOWER(a.card_id) = '${searchTerm}' OR LOWER(b.b_fname) like '%${searchTerm}%' OR LOWER(b.b_lname) like '%${searchTerm}%')`)
            res.json(matchingBookLoans.rows)
    } catch (error) {
        console.error(error.message)
    }
});

app.put("/checkInBooks", async (req,res) => {
    try {
        const {loan_list} = req.body;

        var checkInList = [];
        for(let i = 0; i < loan_list.length; i++)
        {
            date_in = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ');
            const checkIn = await pool.query("UPDATE BOOK_LOANS SET date_in = $1 WHERE loan_id = $2", [date_in, loan_list[i]])
            checkInList.push(checkIn.rows)
        }
        res.json(checkInList)
    } catch (error) {
        console.log(error.message)
    }
})

//Check book loans
app.get("/checkExistingLoans/:card_id", async (req,res) => {
    try {
        var { card_id } = req.params;
        card_id = card_id.toString().toUpperCase();
        console.log(card_id + "Test")

        const numLoans = await pool.query(`SELECT COUNT(*) FROM BOOK_LOANS WHERE card_id = '${card_id}' AND date_in IS NULL`)
        console.log(numLoans.rows)
        res.json(numLoans.rows[0])
    } catch (error) {
        console.log(error.message)
    }
});


//Multiple Books
app.put("/checkOutBooks/:card_id", async (req,res) => {
    try {
        const {isbn_list} = req.body;
        const {card_id} = req.params;

        console.log(isbn_list)
        console.log(card_id)
        var checkOutList = [];
        for(let i = 0; i < isbn_list.length; i++)
        {
            date_out = new Date().toISOString().slice(0, 19).replace('T', ' ');
            due_date = new Date(Date.now() + 12096e5).toISOString().slice(0, 19).replace('T', ' ');
            const checkOut = await pool.query("INSERT INTO BOOK_LOANS(isbn, card_id, date_out, due_date) VALUES($1,$2,$3,$4)", [isbn_list[i], card_id, date_out, due_date])
            checkOutList.push(checkOut.rows)
        }
        res.json(checkOutList)
    } catch (error) {
        console.log(error.message)
    }
})
//Update Loan details 

//  app.put()
//Create borrower
app.post("/borrower", async (req,res) => {
    try {
        const { ssn, fname, lname, streetAddress, city, state, phoneNum } = req.body;
        let id = await pool.query("SELECT MAX(card_id) from borrower;")
        id = "ID" + (parseInt(id.rows[0].max.replace("ID",''))+1).toString().padStart(6,'0');
        const newBorrower = await pool.query(
            "INSERT INTO BORROWER VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *", 
            [id, ssn, fname, lname,  streetAddress, city, state, phoneNum]
        );
        res.json(newBorrower.rows[0])
    } catch (error) {
        //Check for duplicate ssn 
        console.error(error.message)
    }
});

//Check Borrower By Card_id

app.get("/checkBorrower/:card_id", async (req,res) => {
    try {
        const { card_id } = req.params;
        let id = await pool.query(`SELECT CASE WHEN EXISTS (SELECT * FROM borrower WHERE card_id = '${card_id}')
        THEN 'true'
        ELSE 'false'
        END;`);
    
        res.json(id.rows[0])
    } catch (error) {
        //Check for duplicate ssn 
        console.error(error.message)
    }
});

//Check Borrower By SSN

app.get("/checkBorrowerSsn/:ssn", async (req,res) => {
    try {
        const { ssn } = req.params;
        let id = await pool.query(`SELECT CASE WHEN EXISTS (SELECT * FROM borrower WHERE ssn = '${ssn}')
        THEN 'true'
        ELSE 'false'
        END;`);
    
        res.json(id.rows[0])
    } catch (error) {
        //Check for duplicate ssn 
        console.error(error.message)
    }
});

//Update Loan Info

app.put("/updateFines", async (req,res) => {

    //Loop through all loans

    //Get all book_loans
    const loan_list = await pool.query(`SELECT loan_id, due_date, date_in FROM book_loans;`);
    //Get all loans in fines
    const fines_list = await pool.query(`SELECT loan_id, paid FROM FINES;`)
    //console.log(loan_list.rows)
    //console.log(fines_list.rows)
    var allFines = [];

    for(let i = 0; i < loan_list.rows.length; i++)
    {
        //Check If row already exists and is late
        //if(loan_list.rows[i].loan_id)
        var exists = false;
        var fine_idx = 0;
        for(let j = 0; j < fines_list.rows.length; j++)
        {
            if(loan_list.rows[i].loan_id == fines_list.rows[j].loan_id)
            {
                //console.log("found" + loan_list.rows[i].loan_id)
                exists = true
                fine_idx = j; 
            }
        }
        if(exists == true)
        {
            //Not paid update fine 
            if(fines_list.rows[fine_idx].paid == false)
            {
                if(loan_list.rows[i].date_in === null)
                {
                    date_today = new Date()
                    if(loan_list.rows[i].due_date < date_today)
                    {
                        //console.log('Update Late book Today' + loan_list.rows[i].loan_id)
                        const diffTime = Math.abs(date_today - loan_list.rows[i].due_date);
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                        var price = diffDays * 0.25;
                        price = price.toFixed(2);
                        const updateFine = await pool.query(
                            "UPDATE FINES SET fine_amt=$1 WHERE loan_id=$2 RETURNING *", 
                            [price, loan_list.rows[i].loan_id]
                        );
                        allFines.push(updateFine.rows)
                    }
                }
                else
                {
                    if(loan_list.rows[i].due_date < loan_list.rows[i].date_in)
                    {
                        if(loan_list.rows[i].due_date < loan_list.rows[i].date_in)
                        {
                            //console.log('Update Late book Checked in' + loan_list.rows[i].loan_id)
                            const diffTime = Math.abs(loan_list.rows[i].date_in - loan_list.rows[i].due_date);
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                            var price = diffDays * 0.25;
                            price = price.toFixed(2);
                            const updateFine = await pool.query(
                                "UPDATE FINES SET fine_amt=$1 WHERE loan_id=$2 RETURNING *", 
                                [price, loan_list.rows[i].loan_id]
                            );
                            allFines.push(updateFine.rows)
                        }
                    }

                }
            }

        }
        //If late but row doesn't exist create new row in fines
        else
        {
            if(loan_list.rows[i].date_in === null)
            {
                date_today = new Date()
                if(loan_list.rows[i].due_date < date_today)
                {
                    const diffTime = Math.abs(date_today - loan_list.rows[i].due_date);
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                    var price = diffDays * 0.25;
                    price = price.toFixed(2);
                    const newFine = await pool.query(
                          "INSERT INTO FINES VALUES($1,$2,$3) RETURNING *", 
                          [loan_list.rows[i].loan_id, price, '0']
                     );
                     allFines.push(newFine.rows)
                }
            }
            else
            {
                if(loan_list.rows[i].due_date < loan_list.rows[i].date_in)
                {
                    if(loan_list.rows[i].due_date < loan_list.rows[i].date_in)
                    {
                        const diffTime = Math.abs(loan_list.rows[i].date_in - loan_list.rows[i].due_date);
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                        var price = diffDays * 0.25;
                        price = price.toFixed(2);
                        const newFine = await pool.query(
                            "INSERT INTO FINES VALUES($1,$2,$3) RETURNING *", 
                            [loan_list.rows[i].loan_id, price, '0']
                        );
                        allFines.push(newFine.rows)
                    }
                }

            }
        }
    }

    res.json(allFines)

})

//Check If there is an unreturned book

app.get("/allBooksReturned/:card_id", async (req,res) => {

    var { card_id } = req.params;
    card_id = card_id.toString().toUpperCase();

    try {
        let id = await pool.query(`SELECT CASE WHEN EXISTS (SELECT * FROM book_loans, fines WHERE card_id = '${card_id}' AND date_in IS NULL)
        THEN 'true'
        ELSE 'false'
        END;`);
        console.log(id.rows)
        res.json(id.rows[0])
        
    } catch (error) {
        console.error(error.message)
    }
}
);

//Get Outstanding fines 

app.get("/getOutFines", async (req,res) => {

    try {
        let id = await pool.query(`SELECT bl.card_id, b.b_fname, b.b_lname, SUM(f.fine_amt) AS total_fine FROM FINES as f, BOOK_LOANS as bl, Borrower as b WHERE f.paid='false' AND bl.card_id=b.card_id AND f.loan_id = bl.loan_id GROUP BY bl.card_id, b.b_fname, b.b_lname;`);
    
        res.json(id.rows)
        
    } catch (error) {
        console.error(error.message)
    }
}
);

app.get("/getFinesFor/:card_id", async (req,res) => {

    try {
        var { card_id } = req.params;
        card_id = card_id.toString().toUpperCase();
    
        let id = await pool.query(`SELECT bl.card_id, b.b_fname, b.b_lname, SUM(f.fine_amt) AS total_fine \
                                    FROM FINES as f, BOOK_LOANS as bl, Borrower as b \
                                    WHERE f.paid='false' AND bl.card_id=b.card_id AND f.loan_id = bl.loan_id \
                                    GROUP BY bl.card_id, b.b_fname, b.b_lname\
                                    HAVING bl.card_id='${card_id}';`);
    
        res.json(id.rows)
        
    } catch (error) {
        console.error(error.message)
    }
}
);

//Mark books paid

app.put("/markPaid", async (req,res) => {
    const {card_list} = req.body;
    for(let i = 0; i < card_list.length; i++)
    {
        const marked = await pool.query(`UPDATE FINES SET paid='1' WHERE loan_id IN (SELECT b.loan_id FROM BOOK_LOANS AS b WHERE b.card_id='${card_list[i]}');`) 
        console.log(marked.rows)
        res.json(marked.rows)
    }
});

app.listen(5000, ()=> {
    console.log("server has started on port 5000")
});