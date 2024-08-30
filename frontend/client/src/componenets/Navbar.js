import React, {useEffect} from "react";
import './Navbar.css';

const Navbar = () => {
    const url = window.location.pathname.split('/').pop();

    useEffect(()=> {
        document.querySelectorAll(".nav-link").forEach((link) => {
            console.log(link.href)
            console.log(window.location.href)
            if (link.href === window.location.href) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    }, [url]);

  const updateFines = async e  => {
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:5000/updateFines`, {
                    method: "PUT",
                });
        const jsonData = await response.json();
        console.log(jsonData)
        alert("Update Succesful")

    } catch (error) {
        alert("Update Failed")
    }

  }

return (<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand">Library</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" href="/checkOut">Check-Out</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/checkOutISBN">Check-Out By ISBN</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/checkIn">Check-In</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/createBorrower">Create Borrower</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/payFines">Pay Fines</a>
                </li>
                {/* <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                </li> */}
            </ul>
        </div>
        <form class="d-flex" onSubmit={updateFines}>
            <button class="btn btn-outline-success" type="submit">Update Fines</button>
        </form>
    </div>
    </nav>);

};

export default Navbar;