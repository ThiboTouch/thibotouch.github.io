expenses.controller("dashboardCtrl", function ($scope, $filter, expenses, ExpenseBalanceService) {
	$scope.paidExpenses = $filter('filter')(expenses, {paid:true});
	$scope.outstandingExpenses = $filter('filter')(expenses, {paid:false});
	
	$scope.balance = ExpenseBalanceService.calculateBalance();
	$scope.updateStatus = function(bal)
	{
		if(bal > 0)
		{
			$scope.status = "Arrears";
			$scope.inArrears = true;
		}
		else{
			$scope.status = "Clear";
			$scope.inArrears = false;
		}
	}
	
	$scope.updateStatus($scope.balance);
});

expenses.controller("expenseCtrl", function ($scope, $routeParams, $location, expense) {
	
});