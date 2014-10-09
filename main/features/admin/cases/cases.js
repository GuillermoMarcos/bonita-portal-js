(function () {
    'use strict';

    angular.module('org.bonita.features.admin.cases', ['ui.router', 'org.bonita.features.admin.cases.list'])
        .config([ '$stateProvider', function ($stateProvider) {
            $stateProvider.state('applications', {
                url: '/admin/cases/list',
                templateUrl: 'features/admin/cases/cases-list.html',
                controller: 'casesListCtrl'
              });
          }]);

  })();