CREATE database Bamazon;

USE Bamazon;

CREATE TABLE products (
  position INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR (100) NOT NULL,
  department_name VARCHAR (100) NULL,
  price FLOAT NOT NULL,
  stock_quantity INT (5) NOT NULL, 
  product_sales FLOAT  NULL, 
  PRIMARY KEY (position)
);

CREATE TABLE departments (
	department_ID INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR (100) NOT NULL,
	over_head_costs INT (5) NOT NULL,
	total_sales INT (5) NOT NULL
)