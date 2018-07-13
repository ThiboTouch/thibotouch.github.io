expenses.controller("dashboardCtrl", function ($scope, $filter, expenses, ExpenseBalanceService) {
	$scope.paidExpenses = $filter('filter')(expenses, {paid:true});
	$scope.outstandingExpenses = $filter('filter')(expenses, {paid:false});
	
	$scope.balObj = { balance: ExpenseBalanceService.calculateBalance()};
	$scope.updateStatus = function()
	{
		if($scope.balObj.balance > 0)
		{
			$scope.status = "Arrears";
			$scope.inArrears = true;
		}
		else{
			$scope.status = "Clear";
			$scope.inArrears = false;
		}
	}
	
	$scope.updateStatus();
});

expenses.controller("expenseCtrl", function ($scope, $routeParams, $location, ExpenseDataService, toaster) {
	if($routeParams.id)
	{
		//Load existing expense model
	}
	
	$scope.addExpense = function(expense)
	{
		var success = ExpenseDataService.addExpense(expense);

		if(success)
		{
			toaster.pop({
                type: 'success',
                title: 'Success!',
                body: 'Expense has been successfully added.',
				showCloseButton: true
            });
		}
		else
		{
			toaster.pop({
                type: 'error',
                title: 'Error!',
                body: 'Failed to add expense, expenses limit has been reached.',
				showCloseButton: true
            });
		}
	}
});