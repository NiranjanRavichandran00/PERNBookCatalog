import React, { Fragment, useEffect, useState } from "react";
import BorrowerInfoModal from "./BorrowerInfoModal";

const ListTodos = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
 // const [checkedBooks, setCheckedBooks] = useState([]);


  const checkInBooks = async () => {

    try {
        //Preprocess the loans
        var loan_list = [];
        for(let i = 0; i < books.length; i++)
        {
            if(books[i].isChecked == true)
            {
                loan_list.push(books[i].loan_id)
                console.log("Test")
            }
        }
        
        const body = { loan_list };
        var jsonData;

        const response = await fetch(`http://localhost:5000/checkInBooks`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        jsonData = await response.json();
        console.log(jsonData)
        window.location = "/checkIn";
        alert(`Checkin Successful`)
            
    } catch (error) {
        console.error(error.message);
        alert(`Checkin Failed`)
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
      const response = await fetch(`http://localhost:5000/findBookLoans/${searchTerm}`);
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
          placeholder="Enter Borrower ID, Borrower Name or ISBN"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>
      {" "}
      <button type="button" onClick={checkInBooks} class="btn mt-3 btn-success">Check In</button>
      <table class="table mt-3 text-center">
        <thead>
          <tr>
            <th><input class="form-check-input" type="checkbox" name="selectAll" checked= { !books.some( (book)=>book?.isChecked!==true)} onChange={ handleChange } value="" id="flexCheckDefault" /></th>
            <th>Loan ID</th>
            <th>ISBN</th>
            <th>Card ID</th>
            <th>Borrower Name</th>
            <th>Date Out</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          {books.map(todo => (
            <tr key={todo.loan_id}>
              <td><input class="form-check-input" type="checkbox" name={todo.isbn} checked={todo?.isChecked|| false } onChange={ handleChange } value="" id="flexCheckDefault" /></td>
              <td>{todo.loan_id}</td>
              <td>{todo.isbn}</td>
              <td>{todo.card_id}</td>
              <td>{todo.b_fname + " " + todo.b_lname}</td>
              <td>{todo.date_out}</td>
              <td>{todo.due_date}</td>
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