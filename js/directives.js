expenses.directive("status", function () {
	
	var controller = ['$scope', function ($scope) {
		$scope.expand = false;
		
		$scope.showAlert = function(){
			if($scope.expand)
			{
				$scope.expand = false;
			}
			else
			{
				$scope.expand = true;
			}
		}
		
		$scope.period = new Date();
		$scope.period.setDate($scope.period.getDate());
	}]
	
	return {
		restrict: 'E',
		scope: {
		   balObj: '=balobj',
		   status: '=',
		   inArrears: '=inarrears'
		},
		templateUrl: "partials/status.html",
		replace: true,
		controller: controller
	};
});

expenses.directive("expenseinfo", function(ExpenseBalanceService, ExpenseDataService){
	var controller = ['$scope', function ($scope) {
		$scope.markAsPaid = function(expense){
			if(!expense.paid)
			{
				var index = $scope.outstandingExpenses.indexOf(expense);
				expense.paid = true;
				$scope.outstandingExpenses.splice(index, 1);
				$scope.paidExpenses.push(expense);
				
				ExpenseDataService.updateExpense(expense);
				$scope.balObj.balance = ExpenseBalanceService.calculateBalance();
				$scope.updateStatus();
			}
		}
		
		$scope.removeExpense = function(expense){
			if(expense.paid)
			{
				var index = $scope.paidExpenses.indexOf(expense);
				expense.paid = false;
				$scope.paidExpenses.splice(index, 1);
				$scope.outstandingExpenses.push(expense);
				ExpenseDataService.updateExpense(expense);
			}
			else{
				var index = $scope.outstandingExpenses.indexOf(expense);
				$scope.outstandingExpenses.splice(index, 1);
				ExpenseDataService.deleteExpense(expense);
			}
			$scope.balObj.balance = ExpenseBalanceService.calculateBalance();
			$scope.updateStatus();
		}
	}];
	
	return{
		restrict: 'E',
		scope:{
			expensesToDisplay: "=expensestodisplay",
			paidExpenses: "=paidexpenses",
			outstandingExpenses: "=outstandingexpenses",
			balObj: "=balobj",
			updateStatus: "&updatestatus"
		},
		templateUrl: "partials/expenseinfo.html",
		controller: controller
	};
});

expenses.directive("alert", function () {
	return {
		restrict: 'E',
		scope: {
			topic: '@'
		},
		templateUrl: "partials/alert.html",
		replace: true,
		transclude: true
	};
});