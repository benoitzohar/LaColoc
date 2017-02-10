angular.module('lacoloc')
    .directive('multiselect', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                multiselectoptions: '=',
                maxlenghttoshowselectedvalues: '=',
                onchangeeventofcheckbox: '&',
            },
            templateUrl: '/javascripts/components/shared/multiselect/multiselect.template.html',
            controller: function($scope) {

                $scope.toggledropdown = function() {
                    $scope.open = !$scope.open;
                };

                $scope.toggleselectall = function($event) {
                    var selectallclicked = true;
                    if ($scope.model.selectall == false) {
                        selectallclicked = false;
                    }
                    $scope.doonselectallclick(selectallclicked, $scope.filteredOptions);
                };

                $scope.doonselectallclick = function(selectallclicked, optionArrayList) {
                    $scope.model = [];
                    if (selectallclicked) {
                        angular.forEach(optionArrayList, function(item, index) {
                            item["Selected"] = true;
                            $scope.model.push(item);
                        });

                        if (optionArrayList.length == $scope.multiselectoptions.length) {
                            $scope.model.selectall = true;
                        }
                    } else {
                        angular.forEach(optionArrayList, function(item, index) {
                            item["Selected"] = false;
                        });
                        $scope.model.selectall = false;
                    }
                    $scope.settoggletext();
                }

                $scope.toggleselecteditem = function(option) {
                    var intIndex = -1;
                    angular.forEach($scope.model, function(item, index) {
                        if (item.Value == option.Value) {
                            intIndex = index;
                        }
                    });

                    if (intIndex >= 0) {
                        $scope.model.splice(intIndex, 1);
                    } else {
                        $scope.model.push(option);
                    }

                    if ($scope.model.length == $scope.multiselectoptions.length) {
                        $scope.model.selectall = true;
                    } else {
                        $scope.model.selectall = false;
                    }
                    $scope.settoggletext();
                };

                $scope.clearsearch = function() {
                    $scope.model.query = "";
                }

                $scope.settoggletext = function() {
                    if ($scope.model.length > $scope.maxlenghttoshowselectedvalues) {
                        $scope.model.toggletext = $scope.model.length + " Selected";
                    } else {
                        $scope.model.toggletext = "";
                        angular.forEach($scope.model, function(item, index) {
                            if (index == 0) {
                                $scope.model.toggletext = item.Text;
                            } else {
                                $scope.model.toggletext += ", " + item.Text;
                            }
                        });

                        if (!($scope.model.toggletext.length > 0)) {
                            $scope.model.toggletext = "None Selected"
                        }
                    }
                }

                $scope.isselected = function(option) {
                    var selected = false;
                    angular.forEach($scope.model, function(item, index) {
                        if (item.Value == option.Value) {
                            selected = true;
                        }
                    });
                    option.Selected = selected;
                    return selected;
                }

                $scope.doOnChangeOfCheckBox = function() {
                    $scope.onchangeeventofcheckbox();
                }

                var onload = function() {
                    if ($scope.model.length == $scope.multiselectoptions.length) {
                        $scope.doonselectallclick(true, $scope.multiselectoptions);
                    }
                    $scope.settoggletext();
                }();
            }
        }
    });
