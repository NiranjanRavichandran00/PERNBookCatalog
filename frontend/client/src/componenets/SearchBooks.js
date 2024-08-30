import React, { Fragment, useEffect, useState } from "react";
import BorrowerInfoModal from "./BorrowerInfoModal";

const ListTodos = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
 // const [checkedBooks, setCheckedBooks] = useState([]);


  const checkoutBooks = async (card_id) => {

    console.log(card_id)
    try {
        //Preprocess the books 
        var isbn_list = [];
        var invalid_request = false;
        for(let i = 0; i < books.length; i++)
        {
            if(books[i].isChecked == true && books[i].exists == true)
            {
                alert(`Book ${books[i].isbn} is unavailable`)
                invalid_request = true;
            }
            if(books[i].isChecked == true && books[i].exists == false)
            {
                isbn_list.push(books[i].isbn)
                console.log("Test")
            }

        }
        
        if(!invalid_request)
        {
            const body = { isbn_list };
            var jsonData;
            var valid_id = await fetch(`http://localhost:5000/checkBorrower/${card_id}`);
            valid_id = await valid_id.json();
            console.log(valid_id)
            console.log(isbn_list)
            if(valid_id.case == 'true')
            {
                var borrowerLimit = await fetch(`http://localhost:5000/checkExistingLoans/${card_id}`);
                borrowerLimit = await borrowerLimit.json();
                console.log(borrowerLimit.count)
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
                jsonData = await response.json();
                console.log(jsonData)
                window.location = "/checkOut";
                alert(`Checkout Successful`)
            }
            else
            {
                alert(`Invalid Borrower ID`)
            }
            
        }     
    
    } catch (error) {
        console.error(error.message);
        alert(`Checkout Failed`)
    }
  }

  const handleChange = e => {

    const {name, checked} = e.target;

    if(name == "selectAll")
    {
        const checkedValue = books.map((book) => {return {...book, isChecked:checked}})
        setBooks(checkedValue)
    }
    else
    {
        const checkedValue = books.map((book) =>book.isbn == name? {...book, isChecked:checked}:book)
        setBooks(checkedValue)
    }
  }

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/findBook/${searchTerm}`);
      const jsonData = await response.json();
    
      setBooks(jsonData);
      //window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  
  return (
    <Fragment>
        <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter ISBN, Title or Author"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>
      {" "}
      <BorrowerInfoModal onCheckout={checkoutBooks}></BorrowerInfoModal>
      <table class="table mt-3 text-center">
        <thead>
          <tr>
            <th><input class="form-check-input" type="checkbox" name="selectAll" checked= { !books.some( (book)=>book?.isChecked!==true)} onChange={ handleChange } value="" id="flexCheckDefault" /></th>
            <th>ISBN</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          {books.map(todo => (
            <tr key={todo.isbn}>
              <td><input class="form-check-input" type="checkbox" name={todo.isbn} checked={todo?.isChecked|| false } onChange={ handleChange } value="" id="flexCheckDefault" /></td>
              <td>{todo.isbn}</td>
              <td>{todo.title}</td>
              <td>{todo.authors}</td>
              <td>{`${!todo.exists ? "Yes" : "No"}`}</td>
              {/* <td>
                <EditTodo todo={todo} />
              </td>
              <td>
    
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;