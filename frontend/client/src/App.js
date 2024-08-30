import React,{Fragment} from 'react';
import './App.css';

//components

import Navbar from './componenets/Navbar';
import SearchBooks from './componenets/SearchBooks';
import CheckIn from './componenets/CheckIn';
import CreateBorrower from './componenets/CreateBorrower';
import PayFines from './componenets/PayFines';
import CheckOutIsbn from './componenets/CheckOutIsbn';

function App() {
  let component 
  switch(window.location.pathname) {
    case "/checkOut":
      component = <SearchBooks />
      break
    case "/checkIn":
      component = <CheckIn />
      break
    case "/createBorrower":
      component = <CreateBorrower /> 
      break
    case "/payFines":
      component = <PayFines />
    break
    case "/checkOutISBN":
      component = <CheckOutIsbn />
      break
  }
  return (<Fragment>
    <Navbar/>
    <div className='container'>
      {component}
    </div>
  </Fragment>);
}

export default App;
