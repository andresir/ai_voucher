# ai_voucher

## API Documentation:

## Documentation on PDF:
https://github.com/andresir/ai_voucher/blob/main/Documentation%20API%20and%20Application.pdf

### Running or port: 8080
### Base URL: localhost:8080

### List API:
1.	Customer eligible check:
    - Endpoint: /api/campaign/checking

2.	Validate photo submission:
    - Endpoint: /api/campaign/checking

3.	API for create customer:
    - Endpoint: /api/customer/add

4.	API for create balance / topup:
    - Endpoint: /api/balance/topup

5.	API for create transaction:
    - Endpoint: /api/transaction/add

6.	API for create voucher:
    - Endpoint: /api/voucher/add

## Usage steps:
1.	Hit query sql for generate Database
2.	Hit API for create customer
3.	Hit API for create balance (topup)
4.	Hit API for create transaction
5.	Hit API for create voucher
6.	Hit API for customer eligible check
7.	Hit API for validate photo submission

## Technology:

### Framework:
-	Node JS for Backend

### Run Application:
-	npm install
-	npm run start

### ORM:
-	Sequelize

### DB Manager:
-	MySql

### Packages:
-	cors
-	express
-	mysql2
-	sequelize
-	nodemon
