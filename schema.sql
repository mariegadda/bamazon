CREATE database Bamazon;

USE Bamazon;

CREATE TABLE products (
  position INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR (100) NOT NULL,
  department_name VARCHAR (100) NULL,
  price INT (5),
  stock_quantity INT (5) NOT NULL,  
  PRIMARY KEY (position)
);

