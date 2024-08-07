--CREATE DATABASE LIBRARY;

CREATE TABLE BOOK(
    isbn VARCHAR(13),
    title VARCHAR(255),
    CONSTRAINT pk_book PRIMARY KEY (isbn)
);

CREATE TABLE AUTHORS(
    author_id SERIAL PRIMARY KEY,
    author_name VARCHAR(50) UNIQUE
);

CREATE TABLE BOOK_AUTHORS(
    author_id INT,
    isbn VARCHAR(13),
    CONSTRAINT pk_bookAuthors PRIMARY KEY (author_id,isbn),
    CONSTRAINT fk_bookAuthors_authors FOREIGN KEY (author_id) references AUTHORS(author_id),
    CONSTRAINT fk_bookAuthors_book FOREIGN KEY (isbn) references BOOK(isbn) ON DELETE CASCADE
);

CREATE TABLE BORROWER(
    card_id VARCHAR(8),
    ssn VARCHAR(11) UNIQUE, 
    b_fname VARCHAR(50) NOT NULL,
    b_lname VARCHAR(50) NOT NULL,
    b_street_address VARCHAR(255) NOT NULL,
    b_city VARCHAR(100) NOT NULL,
    b_state VARCHAR(50) NOT NULL,
    phone_num VARCHAR(20),
    CONSTRAINT pk_borrower PRIMARY KEY (card_id)
);

CREATE TABLE BOOK_LOANS(
    loan_id SERIAL PRIMARY KEY,
    isbn VARCHAR(13),
    card_id VARCHAR(8) NOT NULL,
    date_out DATE, 
    due_date DATE,
    date_in DATE,
    CONSTRAINT fk_bookLoans_book FOREIGN KEY (isbn) references BOOK(isbn),
    CONSTRAINT fk_bookLoans_borrower FOREIGN KEY (card_id) references BORROWER(card_id) ON DELETE CASCADE
);

CREATE TABLE FINES(
    loan_id INT,
    fine_amt DECIMAL(10,2),
    paid BOOLEAN,
    CONSTRAINT pk_fines PRIMARY KEY (loan_id),
    CONSTRAINT fk_fine_bookLoans FOREIGN KEY (loan_id) references BOOK_LOANS(loan_id) ON DELETE CASCADE
);
