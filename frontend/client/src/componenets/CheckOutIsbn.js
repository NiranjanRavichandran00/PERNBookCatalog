import React, { Fragment, useEffect, useState } from "react";
import BorrowerInfoModal from "./BorrowerInfoModal";

const CheckOutIsbn = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
 // const [checkedBooks, setCheckedBooks] = useState([]);


  const checkoutBooks = async (card_id) => {
    try {
      const response = await fetch(`http://localhost:5000/findBookISBN/${searchTerm}`);
      var jsonData = await response.json();
    
      setBooks(jsonData);
      console.log(jsonData)
      //If invalid ISBN/ Book does not exist
      if (jsonData === undefined || jsonData.length == 0) {
         alert('Given ISBN does not exist in the library')
         return;
      }

      // IF books is already checked out
      console.log(jsonData)
      if(jsonData[0].exists == true)
      {
          alert('The book is already checked out');
          return
      }

      var isbn_list = [];
      isbn_list.push(searchTerm);

      const body = { isbn_list };

      var valid_id = await fetch(`http://localhost:5000/checkBorrower/${card_id}`);
      valid_id = await valid_id.json();
      if(valid_id.case == 'true')
      {
            var borrowerLimit = await fetch(`http://localhost:5000/checkExistingLoans/${card_id}`);
            borrowerLimit = await borrowerLimit.json();
            if(parseInt(borrowerLimit.count) >= 3)
            {
                alert(`Borrower Already has ${borrowerLimit.count} checked out`)
                return;
            }
            else if(parseInt(borrowerLimit.count) + isbn_list.length > 3)
            {
                alert(`Borrower Already has ${borrowerLimit.count} checked out and can only check out ${3 - parseInt(borrowerLimit.count)} books`);
                return;
            }
            const response = await fetch(`http://localhost:5000/checkOutBooks/${card_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            var checkoutb = await response.json();
            console.log(checkoutb)
            window.location = "/checkOut";
            alert(`Checkout Successful`)
      }
      else
      {
          alert(`Invalid Borrower ID`)
          return;
      }

      window.location = "/checkOutISBN";
    } catch (err) {

        alert(`Checkout Un-Successful`)
      console.error(err.message);
    }
  }
  
  return (
    <Fragment>
        <form className="d-flex mt-5">
        <input
          type="text"
          className="form-control"
          placeholder="Enter ISBN"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </form>
      {" "}
      <BorrowerInfoModal onCheckout={checkoutBooks}></BorrowerInfoModal>
    </Fragment>
  );
};

export default CheckOutIsbn;