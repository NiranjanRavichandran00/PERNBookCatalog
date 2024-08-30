import React, { Fragment, useEffect, useState } from "react";

const BorrowerInfoModal = ({onCheckout}) => {

    const [card_id, setCardId] = useState([]);


    const handleCheckout = e => {
        e.preventDefault();
        onCheckout(card_id);          
    }

    return(
        <Fragment>
            <button type="button" class="btn mt-3 btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Checkout
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Enter Borrower ID</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="text"
                    value={card_id}
                    onChange={e => setCardId(e.target.value)}/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onClick={handleCheckout} class="btn btn-success" data-bs-dismiss="modal">Checkout</button>
                </div>
                </div>
            </div>
            </div>
        </Fragment>
    );
};

export default BorrowerInfoModal