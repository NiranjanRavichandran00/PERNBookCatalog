import React, { Fragment, useEffect, useState } from "react";

const CreateBorrower = () => {

    const [ssn, setSsn] = useState([]);
    const [fname, setFname] = useState([]);
    const [lname, setLname] = useState([]);
    const [streetAddress, setStreetAddress] = useState([]);
    const [city, setCity] = useState([]);
    const [state, setState] = useState([]);
    const [phoneNum, setPhoneNum] = useState([]);

    const validateForm = async e => {
        e.preventDefault();

        if(!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn))
        {
            alert("Invalid SSN, Use format 123-45-6789")
            return
        }
        else if(/\d/.test(fname) || /\d/.test(lname))
        {
            alert("First Name and Last Name can't contain numbers")
            return
        }
        else if(/\d/.test(city))
        {
            alert("City can't contain number")
            return
        }
        else if(/\d/.test(state))
        {
            alert("State can't contain numbers")
            return
        }

        //var phoneNumIndex = phoneNum.firstIndexOf('-')
        var phoneNumMod = '(' + phoneNum.toString().replace("-", ') ')
        await setPhoneNum(phoneNumMod)

        const body = { ssn, fname, lname, streetAddress, city, state, phoneNum};
        var jsonData;
        var valid_ssn = await fetch(`http://localhost:5000/checkBorrowerSsn/${ssn}`);
        valid_ssn = await valid_ssn.json();
        console.log(valid_ssn)
        if(valid_ssn.case == 'false')
        {
            const response = await fetch(`http://localhost:5000/borrower`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            jsonData = await response.json();
            console.log(jsonData)
            window.location = "/createBorrower";
            alert(`Account Created Successfully`)
        }
        else
        {
            alert(`Account with this SSN already exists`)
        }

    }


    return(
        <Fragment>
            <form onSubmit={validateForm} >
                <div class="mt-3 mb-3">
                    <label for="ssn" class="form-label">SSN</label>
                    <input type="text" class="form-control" id="ssn" value={ssn} onChange={e => setSsn(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="fname" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="fname" value={fname} onChange={e => setFname(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="lname" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lname"  value={lname} onChange={e => setLname(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="streetAddress" class="form-label">Street Address</label>
                    <input type="text" class="form-control" id="streetAddress" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="city" class="form-label">City</label>
                    <input type="text" class="form-control" id="city" value={city} onChange={e => setCity(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="state" class="form-label">State</label>
                    <input type="text" class="form-control" id="state" value={state} onChange={e => setState(e.target.value)} required/>
                </div>
                <div class="mb-3">
                    <label for="phoneNum" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="phoneNum" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} required/>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </Fragment>
    );
};

export default CreateBorrower