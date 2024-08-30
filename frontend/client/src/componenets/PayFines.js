import React, { Fragment, useEffect, useState } from "react";

const PayFines = () => {
  const [fines, setFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
 // const [checkedBooks, setCheckedBooks] = useState([]);


  const markPaid = async () => {

    try {
        //Preprocess the loans
        var card_list = [];
        for(let i = 0; i < fines.length; i++)
        {
            if(fines[i].isChecked == true)
            {
                card_list.push(fines[i].card_id)
                var notReturned = await fetch(`http://localhost:5000/allBooksReturned/${fines[i].card_id}`);
                notReturned = await notReturned.json();
                if(notReturned.case == 'true')
                {
                    alert(`Operation Failed: ${fines[i].card_id} has not returned all the books`)
                    return
                }
            }
        }
        
        const body = { card_list };
        var jsonData;

        const response = await fetch(`http://localhost:5000/markPaid`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        jsonData = await response.json();
        window.location = "/payFines";
        alert(`Marked Successfully`)
            
    } catch (error) {
        console.error(error.message);
        alert(`Operation Failed`)
    }
  }

  const handleChange = e => {

    const {name, checked} = e.target;

    if(name == "selectAll")
    {
        const checkedValue = fines.map((fine) => {return {...fine, isChecked:checked}})
        setFines(checkedValue)
    }
    else
    {
        const checkedValue = fines.map((fine) =>fine.card_id == name? {...fine, isChecked:checked}:fine)
        setFines(checkedValue)
    }
  }

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/getFinesFor/${searchTerm}`);
      const jsonData = await response.json();
    
      setFines(jsonData);
      //window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  const getFines = async () => {
    try {
      const response = await fetch("http://localhost:5000/getOutFines");
      const jsonData = await response.json();

      setFines(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getFines();
  }, []);

  
  return (
    <Fragment>
        <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Borrower ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>
      {" "}
      <button type="button" onClick={markPaid} class="btn mt-3 btn-success">Mark Paid</button>
      <table class="table mt-3 text-center">
        <thead>
          <tr>
            <th><input class="form-check-input" type="checkbox" name="selectAll" checked= { !fines.some( (fine)=>fine?.isChecked!==true)} onChange={ handleChange } value="" id="flexCheckDefault" /></th>
            <th>Card ID</th>
            <th>Borrower Name</th>
            <th>Total Fines</th>
          </tr>
        </thead>
        <tbody>
          {/*<tr>
            <td>John</td>
            <td>Doe</td>
            <td>john@example.com</td>
          </tr> */}
          {fines.map(fine => (
            <tr key={fine.card_id}>
              <td><input class="form-check-input" type="checkbox" name={fine.card_id} checked={fine?.isChecked|| false } onChange={ handleChange } value="" id="flexCheckDefault" /></td>
              <td>{fine.card_id}</td>
              <td>{fine.b_fname + " " + fine.b_lname}</td>
              <td>{"$" + fine.total_fine}</td>
              {/* <td>
                <EditTodo fine={fine} />
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

export default PayFines;