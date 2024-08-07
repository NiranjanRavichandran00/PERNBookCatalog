#!/usr/bin/python3


fileObj = open('books.csv', 'r', encoding="utf-8")
f = open("books.sql", "w", encoding="utf-8")
text_file = list(fileObj)
author_id = 0
author_list = []
queries = ""
for line in text_file[1:25002]:
    line = line.strip()
    column_list = line.split('\t')
    # print(column_list)
    isbn13 = column_list[1]
    title = column_list[2]
    title = title.replace("'","''")
    authors = column_list[3]
    authors = authors.replace("'","''")
    queries += "INSERT INTO Book VALUES (\'" + isbn13 + "\',\'" + title + "\'); \n"
    authors = authors.split(',')
    print(authors)
    for author in authors:
        if (author in author_list):
            # Deal with duplicate author
            #print(author + " already exists")
            queries += "INSERT INTO Book_authors VALUES (\'" + str(author_list.index(author) + 1) + "\',\'" + isbn13 + "\'); \n"
            # Lookup existing author_id and populate author_id variable
        else:
            author_id += 1
            # Add author to list
            author_list += [author]
            # Be sure to look up existing author if applicable
            queries += "INSERT INTO Authors VALUES (\'" + str(author_id) + "\',\'" + author + "\'); \n"
            queries += "INSERT INTO Book_authors VALUES (\'" + str(author_id) + "\',\'" + isbn13 + "\'); \n"

f.write(queries)
    
f.close()
fileObj.close()
