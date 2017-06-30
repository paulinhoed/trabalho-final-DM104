var app = angular.module('HomebrewApp', []);
var url = "http://localhost:8089/";

app.controller('MyController', function ($scope, $http, MyService, $interval) {
    $scope.recipe = {
        name: "",
        beerStyle: "",
        og: "",
        fg: "",
        ibu: "",
        abv: "",
        co2: "",
        liter: "",
        firstFermentationDays: "",
        secondFermentationDays: "",
        clarificationDays: "",
        maturationDays: "",
        sugarQtd: "",
        notes: ""
    }
    $scope.newRecipe = {
        name: "",
        beerStyle: "",
        og: "",
        fg: "",
        ibu: "",
        abv: "",
        co2: "",
        liter: "",
        firstFermentationDays: "",
        secondFermentationDays: "",
        clarificationDays: "",
        maturationDays: "",
        sugarQtd: "",
        notes: ""
    }
    //
    $scope.label_name = "Beer Name:";
    $scope.label_beerStyle = "Beer Style:";
    $scope.label_og = "OG:";
    $scope.label_fg = "FG:";
    $scope.label_ibu = "IBU:";
    $scope.label_abv = "ABV(%):";
    $scope.label_co2 = "CO2:";
    $scope.label_liter = "Liters:";
    $scope.label_1ferm = "1ºFermentation(days):";
    $scope.label_2ferm = "2ºFermentation(days):";
    $scope.label_clari = "Clarification(days):";
    $scope.label_matur = "Maturarion(days):";
    $scope.label_sugar = "Sugar(g):";
    $scope.label_notes = "Notes:";
    //
    $scope.recipes = {};
    $scope.error;

    $scope.abvMin = 0;
    $scope.abvMax = 0;

    $scope.showNewBtnFlag = true;
    $scope.showAddBtnFlag = false;
    $scope.showSaveBtnFlag = false;
    $scope.showCancelAddBtnFlag = false;
    $scope.showCancelEditBtnFlag = false;

    $scope.showTable1 = true;
    $scope.showTable2 = false;

    var info = document.getElementById('info');
    
    var formInputText = document.getElementById('formInputText');
    formInputText.style.display = 'none';
    var addBtn = document.getElementById('addBtn');
    addBtn.style.opacity = 0.5;

    $scope.init = function () {
        $scope.list();
    };
    $scope.prepareToAddNew = function () {
        formInputText.style.display = 'block';
        info.style.display = 'none';
        $scope.showNewBtnFlag = false;
        $scope.showAddBtnFlag = true;
        $scope.showCancelAddBtnFlag = true;

        $scope.showSaveBtnFlag = false;
        $scope.showCancelEditBtnFlag = false;
    }

    //LIST ALL RECIPES
    $scope.list = function () {
        //MyService.list();
        var thisURL = url + "list";
        $http({
            method: "GET", url: thisURL
        }).then(function mySuccess(response) {
            $scope.recipes = response.data;
        }, function myError(response) {
            $scope.error = response.statusText;
        });
    }
    //ADD NEW RECIPE
    $scope.addNewRecipe = function () {
        if (MyService.verifyDataRecipe($scope.newRecipe)) {
            var thisURL = url + "add";
            $http({
                method: "POST",
                url: thisURL,
                data: JSON.stringify($scope.newRecipe),
                headers: { 'Content-Type': 'application/json' }
            }).then(function mySuccess(response) {
                MyService.addNewRecipe($scope.newRecipe);
                $scope.cancel();
                $scope.newRecipe = [];
            }, function myError(response) {
                console.log(response.statusText);
                $scope.error = response.statusText;
            });
        }
    }
    //PREPARE TO EDIT RECIPE
    $scope.prepareToEditRecipe = function (recipe, indexRow) {
        $scope.newRecipe = recipe;
        $scope.recipe = recipe;
        formInputText.style.display = 'block';
        info.style.display = 'none';
        $scope.showNewBtnFlag = false;
        $scope.showSaveBtnFlag = true;
        $scope.showCancelEditBtnFlag = true;

        $scope.showAddBtnFlag = false;
        $scope.showCancelAddBtnFlag = false;
    }
    //EDIT RECIPE
    $scope.editRecipe = function (recipe, indexRow) {
        if (MyService.verifyDataRecipe($scope.newRecipe)) {
            var thisURL = url + "update/" + $scope.newRecipe.id;
            $http({
                method: "PUT",
                url: thisURL,
                data: JSON.stringify($scope.newRecipe),
                headers: { 'Content-Type': 'application/json' }
            }).then(function mySuccess(response) {
                $scope.cancel();
                $scope.newRecipe = [];
            }, function myError(response) {
                console.log(response.statusText);
                $scope.error = response.statusText;
            });
        }
    }
    //DELETE RECIPE
    $scope.deleteRecipe = function (recipe, indexRow) {
        $scope.recipe = recipe;
        var thisURL = url + "delete/" + $scope.recipe.id;
        $http({
            method: "DELETE",
            url: thisURL,
            headers: { 'Content-Type': 'application/json' }
        }).then(function mySuccess(response) {
            $scope.recipes.splice(indexRow, 1);
            $scope.cancel();
        }, function myError(response) {
            console.log(response.statusText);
            $scope.error = response.statusText;
        });

    }
    //PREPARE TO ADD
    $scope.toAdd = function () {
        if (MyService.verifyDataRecipe($scope.newRecipe)) {
            addBtn.style.opacity = 1;
        }
        else {
            addBtn.style.opacity = 0.5;
        }
    }
    //CANCEL
    $scope.cancel = function () {
        formInputText.style.display = 'none';
        info.style.display = 'block';
        $scope.showNewBtnFlag = true;
        $scope.showAddBtnFlag = false;
        $scope.showSaveBtnFlag = false;
        $scope.showCancelAddBtnFlag = false;
        $scope.showCancelEditBtnFlag = false;
        $scope.recipe = [];
        $scope.newRecipe = [];
    }
    //SHOW TABLE LIST ALL
    $scope.manageTable1 = function () {
        $scope.showTable1 = true;
        $scope.showTable2 = false;

        $scope.abvMin = 0;
        $scope.abvMax = 0;

        $scope.list();
    }
    //SHOW TABLE LIST ABV RANGE
    $scope.manageTable2 = function () {
        if ($scope.abvMin > 0 && $scope.abvMax > 0) {
            var thisURL = url + "listAbvRange";
            var abv = {
                abvMin: $scope.abvMin,
                abvMax: $scope.abvMax
            }
            $http({
                method: "POST", url: thisURL,
                data: JSON.stringify(abv),
            }).then(function mySuccess(response) {
                $scope.recipes = response.data;

                $scope.showTable1 = false;
                $scope.showTable2 = true;
            }, function myError(response) {
                $scope.error = response.statusText;
            });
        }
    }
});

app.service('MyService', function () {
    this.verifyDataRecipe = function (newRecipe) {
        if (newRecipe.name != "" &&
            newRecipe.beerStyle != "" &&
            newRecipe.og != "" &&
            newRecipe.fg != "" &&
            newRecipe.ibu != "" &&
            newRecipe.abv != "" &&
            newRecipe.co2 != "" &&
            newRecipe.liter != "" &&
            newRecipe.firstFermentationDays != "" &&
            newRecipe.secondFermentationDays != "" &&
            newRecipe.clarificationDays != "" &&
            newRecipe.maturationDays != "" &&
            newRecipe.sugarQtd != "" &&
            newRecipe.notes != "") {
            return true;
        }
        else {
            return false;
        }
    }
    this.addNewRecipe = function (newRecipe) {
        var recipe = document.createElement('tr');

        var tdName = document.createElement('td');
        tdName.appendChild(document.createTextNode(newRecipe.name));
        var tdStyle = document.createElement('td');
        tdStyle.appendChild(document.createTextNode(newRecipe.beerStyle));
        var tdNotes = document.createElement('td');
        tdNotes.appendChild(document.createTextNode(newRecipe.notes));
        var tdOg = document.createElement('td');
        tdOg.appendChild(document.createTextNode(newRecipe.og));
        var tdFg = document.createElement('td');
        tdFg.appendChild(document.createTextNode(newRecipe.fg));
        var tdIbu = document.createElement('td');
        tdIbu.appendChild(document.createTextNode(newRecipe.ibu));
        var tdAbv = document.createElement('td');
        tdAbv.appendChild(document.createTextNode(newRecipe.abv));
        var tdCo2 = document.createElement('td');
        tdCo2.appendChild(document.createTextNode(newRecipe.co2));
        var tdLiter = document.createElement('td');
        tdLiter.appendChild(document.createTextNode(newRecipe.liter));
        var tdSugar = document.createElement('td');
        tdSugar.appendChild(document.createTextNode(newRecipe.sugarQtd));
        var td1F = document.createElement('td');
        td1F.appendChild(document.createTextNode(newRecipe.firstFermentationDays));
        var td2F = document.createElement('td');
        td2F.appendChild(document.createTextNode(newRecipe.secondFermentationDays));
        var tdClari = document.createElement('td');
        tdClari.appendChild(document.createTextNode(newRecipe.clarificationDays));
        var tdMatur = document.createElement('td');
        tdMatur.appendChild(document.createTextNode(newRecipe.maturationDays));

        var tdEdit = document.createElement('td');
        tdEdit.innerHTML = '<figure id="editBtnImg" ng-click="editRecipe(recipe,$index)">' +
            '<img src="assets/images/edit.png" alt="">' +
            '</figure>';
        var tdDelete = document.createElement('td');
        tdDelete.innerHTML = '<figure id="deleteBtnImg" ng-click="deleteRecipe(recipe,$index)">' +
            '<img src="assets/images/delete.png" alt="">' +
            '</figure>';

        recipe.appendChild(tdName);
        recipe.appendChild(tdStyle);
        recipe.appendChild(tdNotes);
        recipe.appendChild(tdOg);
        recipe.appendChild(tdFg);
        recipe.appendChild(tdIbu);
        recipe.appendChild(tdAbv);
        recipe.appendChild(tdCo2);
        recipe.appendChild(tdLiter);
        recipe.appendChild(tdSugar);
        recipe.appendChild(td1F);
        recipe.appendChild(td2F);
        recipe.appendChild(tdClari);
        recipe.appendChild(tdMatur);
        recipe.appendChild(tdEdit);
        recipe.appendChild(tdDelete);
        var tbody = document.getElementById("table1").getElementsByTagName('tbody');

        tbody[0].appendChild(recipe);
    }
});