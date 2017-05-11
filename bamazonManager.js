var mysql = require("mysql");
var inquirer = require("inquirer");

var config = ({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: 'bamazon'

});

var connection = mysql.createConnection(config);

connection.connect(function (err){
	if (err) throw err;

});



// Begin function of menu options
function begin(){
	inquirer.prompt([
	{
		name: "menu",
		type: "list",
		message: "Welcome Manager - choose an option",
		choices: ["view all products", "view low inventory", "add to inventory", "add new product", "log out"]

	}
	]).then(function(answer) {
		switch (answer.menu){
			case "view all products":
			showAll();
			break;
			case "view low inventory":
			lowInventory();
			break;
			case "add to inventory":
			showAllInventory();
			break;
			case  "add new product":
			addNew();
			break;
			case "log out":
			console.log("Ok, bye!");
			process.exit();
		}
	});
}

//shows all the items for sale and their price
function showAll(){
	connection.query("SELECT * FROM products", function(err, res)
	{      
		if(err) throw err;  
		console.log("\n Items for Sale: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log("ID #: "+res[i].position +" * " + res[i].product_name + " $"+ res[i].price);
		  }  
		  	 returnMenu();
		  });
	}
// shows items with less than 3 in stock and their stock levels
function lowInventory(){
	connection.query("SELECT product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity <= 3", function(err, res){ 
	if(err) throw err;  
		console.log("\n Items with less 3 or less in stock: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log(" * " + res[i].product_name + ", " + res[i].department_name + "- $"+ res[i].price + ", " + res[i].stock_quantity+ " left in stock");
		  }  
		  	 returnMenu();
		  });
}


// shows all the inventory triggers the next function...
function showAllInventory(){
	connection.query("SELECT * FROM products", function(err, res)
	{      
		if(err) throw err;  
		console.log("\n Inventory of Items: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log("ID: "+res[i].position +" * " + res[i].product_name + ", in stock:"+ res[i].stock_quantity);
		  }  
		 selectInventory();
		  });
	}

//asks if you would like to increase the inventory of any item, increases the inventory number in mysql for that ID #
	function selectInventory(){
	inquirer.prompt({
		name:"select",
		message: "To increase an items inventory, enter it's ID number \n",
		type: "input",
		validate: function(value){
      	if (isNaN(value) === false){
        	return true;
      		}
      		return false;
    	}
	}).then(function(answers){
		//answer corresponding to ID number
		var id = answers.select;
			
		connection.query("SELECT * FROM products WHERE position = " + id, function(err, res){
			if(err) throw err; 
			console.log(res[0].product_name + ", " + res[0].department_name +",  # in stock:" + res[0].stock_quantity);  

				inquirer.prompt({
				name: "amount",
				message: "How many units would you like to increase inventory by?",
				type: "input",
				validate: function(value){
      				if (isNaN(value) === false){
        				return true;
      					}
      					return false;
    					}
					}).then(function(input){

						var newstock =	parseInt(res[0].stock_quantity) + parseInt(input.amount);
				
						connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newstock}, {position: id}],
							function(err, res){
								if (err) throw err;
							console.log("updated! New stock is: " + newstock);
		  	 				returnMenu();
							});
					});

			});
		});


	}
// returns to main manager menu
function returnMenu(){
	inquirer.prompt([
		{	
			name: "return",
			type:"confirm",
			message: "Return to Main Menu?"
		}
		]).then(function(answer){
			if (answer.return === true) {
				begin();
			} else{
				console.log("Ok, Bye!");
				process.exit();
			}
		});
}

//add new product function, series of prompts to get the information to add a new row to our table
function addNew() {
		inquirer.prompt([
		{	
			name: "name",
			type:"input",
			message: "What is the Product Name?"
		},

		{	
			name: "department",
			type:"input",
			message: "What Department is the Product in?"
		},

		{	
			name: "price",
			type:"input",
			message: "What is Product Price?",
			validate: function(value){
      		if (isNaN(value) === false){
        	return true;
      		}
      		return false;
    	}

		},

		{	
			name: "stock",
			type:"input",
			message: "How many are you adding? ",
			validate: function(value){
      		if (isNaN(value) === false){
        	return true;
      		}
      		return false;
    	}
		}

		]).then(function(answers){
			var newName = answers.name;
			var newDepartment = answers.department;
			var newPrice = answers.price;
			var newStock = answers.stock;
			

			connection.query("INSERT INTO products SET ?",{product_name: newName, department_name: newDepartment, price: newPrice, stock_quantity: newStock},
				function(err, res){
					if (err) throw err;
					console.log(newName + " added to " + newDepartment + " for $" + newPrice + " and " + newStock + " in stock");
					returnMenu();
				});
			
	});
}

// WHERE IT ALL BEGINS!
 begin();




