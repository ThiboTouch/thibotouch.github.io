expenses.config(function ($routeProvider) {
  $routeProvider.
    when("/dashboard", {
      templateUrl: "partials/dashboard.html",
      controller: "dashboardCtrl",
      resolve: {
        "expenses": function (ExpenseDataService) {
          return ExpenseDataService.getAllExpenses();
        }
      }
    }).
    when("/expense/:id?", {
      templateUrl: "partials/expense.html",
      controller: "expenseCtrl",
      resolve: {
        "expense": function () {
          return {"name":"expense1"};
        }
      }
    }).
    otherwise({
      redirectTo: '/dashboard'
    });
});