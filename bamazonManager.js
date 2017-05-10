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
	// console.log("connected as id ", connection.threadId);
});




function begin(){
	inquirer.prompt([
	{
		name: "menu",
		type: "list",
		message: "Welcome Manager - choose an option",
		choices: ["view all products", "view low inventory", "add to inventory", "add new product", "log out"]

	}
	]).then(function(answer) {
		if (answer.menu === "view all products") {
			showAll();
		
		} if (answer.menu === "view low inventory"){
			lowInventory();
			
		} if (answer.menu === "add to inventory"){
			showAllInventory();
			
		}if(answer.menu === "add new product"){
			//function here
			console.log("lets add new product!");
		}if(answer.menu === "log out"){
			process.exit();
		}
	});
}

function showAll(){
	connection.query("SELECT * FROM products", function(err, res)
	{      
		if(err) throw err;  
		console.log("\n Items for Sale: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log("ID #: "+res[i].position +" * " + res[i].product_name + " $"+ res[i].price);
		  }  
		  	console.log("\n");
		  	 returnMenu();
		  });
	}

function lowInventory(){
	connection.query("SELECT product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity <= 3", function(err, res){ 
	if(err) throw err;  
		console.log("\n Items with less 3 or less in stock: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log(" * " + res[i].product_name + ", " + res[i].department_name + "- $"+ res[i].price + ", " + res[i].stock_quantity+ " left in stock");
		  }  
		
		  console.log("\n");
		  	 returnMenu();
		  });
}



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
							console.log("\n");
		  	 				returnMenu();
							});
					});

			});
		});


	}

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
				process.exit();
			}
		});
}


function addNew() {
	// body...
}


begin();
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.