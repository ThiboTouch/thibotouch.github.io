expenses.factory("ExpenseDataService", function ($cookies, $filter) {
	function setCookieExpiresDate (expiryDays) {
		var expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + expiryDays);

		return expiryDate;
	}
	
	function createExpensesCookie(expenses)
	{
		var hasCookie = $cookies.getObject('myExpenses');
		if(hasCookie)
		{
			$cookies.remove('myExpenses');
		}
		$cookies.putObject('myExpenses', expenses, {path: '/', expires: setCookieExpiresDate(30)});
	}

	var _getAllExpenses = function(){
	   var allExpenses = $cookies.getObject('myExpenses');
	   if(!allExpenses)
	   {
			allExpenses = [];
			var demoExpense = {
			   title: "Demo Expense",
			   description: "This is a demo expense, you can start adding and monitoring your expenses!",
			   cost: 560,
			   paid: false,
			   id: -1
			};
			var demoExpense2 = {
			   title: "Demo Expense",
			   description: "This is a demo expense, you can start adding and monitoring your expenses!",
			   cost: 1250,
			   paid: true,
			   id: 0
			};
			allExpenses.push(demoExpense);
			allExpenses.push(demoExpense2);
			createExpensesCookie(allExpenses);
	   }
	   return allExpenses;
	};
	
	var _updateExpense = function(expense){
		var allExpenses = _getAllExpenses();
		var oldExpense = $filter('filter')(allExpenses, {id:expense.id});
		if(oldExpense)
		{
			allExpenses = _.without(allExpenses, _.findWhere(allExpenses, {
			  id: expense.id
			}));
			
			allExpenses.push(expense)
			createExpensesCookie(allExpenses);
		}
	};


	return {
		getAllExpenses: _getAllExpenses,
		updateExpense: _updateExpense
	};
});

expenses.factory("ExpenseBalanceService", function(ExpenseDataService,$filter){
	var _calculateBalance = function(){
		var allExpenses = ExpenseDataService.getAllExpenses();
		var balance = 0;
		if(allExpenses)
		{
			var outstandingExpenses = $filter('filter')(allExpenses, {paid:false});
			outstandingExpenses.forEach(function(item){
				balance += item.cost;
			});
		}
		return balance;
	};
	
	return{
		calculateBalance: _calculateBalance
	};

});