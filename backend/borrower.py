#!/usr/bin/python3


fileObj = open('borrowers.csv', 'r', encoding="utf-8")
f = open("borrowers.sql", "w", encoding="utf-8")
text_file = list(fileObj)
queries = ""
for line in text_file[1:1001]:
    print('-' * 80)
    line = line.strip()
    column_list = line.split(',')
    # print(column_list)
    b_id = column_list[0]
    ssn = column_list[1]
    b_fname = column_list[2]
    b_lname = column_list[3]
    b_saddr = column_list[5]
    b_city = column_list[6]
    b_state = column_list[7]
    b_pno = column_list[8]
    
    queries += "INSERT INTO BORROWER VALUES (\'" + b_id + "\',\'" + ssn+ "\',\'" + b_fname + "\',\'" + b_lname + "\',\'" + b_saddr + "\',\'" + b_city + "\',\'" + b_state + "\',\'" +  b_pno + "\');\n"

f.write(queries)  
print('=' * 80)

f.close()
fileObj.close()
