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

//begin function that asks if they would like to shop and triggers the showAll function

function begin(){
	inquirer.prompt({
		name: "welcome",
		message: "Welcome to Bamazon! Would you like to see our products? \n",
		type: "confirm"
	}).then(function(answers){
		if (answers.welcome === true) {
			showAll();
		}else{
			console.log("Ok, bye!");
		}
	});
}


//shows all the products and their prices
function showAll(){
	connection.query("SELECT * FROM products", function(err, res)
	{      
		if(err) throw err;  
		console.log("\n Items for Sale: \n" );
		for (var i = 0; i < res.length; i++) {
		  	console.log("ID #: "+res[i].position +" * " + res[i].product_name + " $"+ res[i].price);
		  }  
		 select();
		  });
	}

//function to select an item for purchase, and then to say how many units.
	function select(){
	inquirer.prompt({
		name:"select",
		message: "If you would like to purchase an item, enter it's ID number \n",
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
			console.log(res[0].product_name + ", " + res[0].department_name +",  $" + res[0].price);  

				inquirer.prompt({
				name: "amount",
				message: "How many units would you like to purchase?",
				type: "input",
				validate: function(value){
      				if (isNaN(value) === false){
        				return true;
      					}
      					return false;
    					}
					}).then(function(input){

						if (input.amount >= res[0].stock_quantity) {
						console.log("insufficient quantity!");
						}else{
						var newstock =	res[0].stock_quantity - input.amount;
						var totalCost = res[0].price*input.amount;
					
						connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newstock}, {position: id}],
							function(err, res){
								if (err) throw err;
							console.log("Your total cost is $" + totalCost + ", THANKS FOR SHOPPING BAMAZON!");
							});
						}
					});

			});
		});
	}


	



begin();










