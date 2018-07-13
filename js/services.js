expenses.factory("ExpenseDataService", function ($cookies, $filter, expensesConfig) {
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

	function generateExpenseId(expenses)
	{
		var maxId = Math.max.apply(Math, expenses.map(function(item){return item.id;}));
		return maxId + 1;
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
			
			allExpenses.push(expense);
			createExpensesCookie(allExpenses);
		}
	};

	var _addExpense = function(expense){
		var allExpenses = _getAllExpenses();

		if(allExpenses.length < expensesConfig.expensesLimit)
		{
			expense.paid = false;
			expense.id = generateExpenseId(allExpenses);
			allExpenses.push(expense);
			createExpensesCookie(allExpenses);
			return true;
		}
		return false;
	}

	var _deleteExpense = function(expense){
		var allExpenses = _getAllExpenses();
		var oldExpense = $filter('filter')(allExpenses, {id:expense.id});
		if(oldExpense)
		{
			allExpenses = _.without(allExpenses, _.findWhere(allExpenses, {
			  id: expense.id
			}));
			createExpensesCookie(allExpenses);
		}
	}

	var _resetExpenses = function()
	{
		var allExpenses = _getAllExpenses();
		if(allExpenses)
		{
			var paidExpenses = $filter('filter')(allExpenses, {paid:true});
			paidExpenses.forEach(function(item){
				item.paid = false;
				_updateExpense(item);
			});
		}
	}

	return {
		getAllExpenses: _getAllExpenses,
		updateExpense: _updateExpense,
		addExpense: _addExpense,
		deleteExpense: _deleteExpense,
		resetExpenses: _resetExpenses
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