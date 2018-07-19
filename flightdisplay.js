/*
 * Author: C Parr
 * Date: 18 July
 * 
 */
angular.module('flightDisplay', []); 

angular.module('flightDisplay').controller('flightDisplayController', function($scope) {

    var vm = this;

    vm.flightDate = new Date();
    vm.flightDateDay = vm.flightDate.getDay();
       
    vm.getFlightDay = function() {
        var day = vm.flightDate.getDay();
        switch(day) {
            case 0:
                vm.flightDateDay = "Sunday";
                break;
            case 1:
                vm.flightDateDay = "Monday";
                break;
            case 2:
                vm.flightDateDay = "Tuesday";
                break;
            case 3:
                vm.flightDateDay = "Wednesday";
                break;
            case 4:
                vm.flightDateDay = "Thursday";
                break;
            case 5:
                vm.flightDateDay = "Friday";
                break;
            case 6:
                vm.flightDateDay = "Saturday";
        }
    } // end getFlightDay
    
    vm.openCSV = function(e) {        
        /* 
         * Reading in a csv file using fetch  
         * Source: https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
         */
        fetch('flights.csv')
        .then(response => response.text())
        .then(text => {

            /*
             * find out what day of the week the flightDate is
             * 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
             */
            var day = vm.flightDate.getDay();

            vm.getFlightDay();
            
            var targetNode = document.getElementById('board');        
            
            // clear current contents        
            targetNode.innerHTML = '';
            
            var tableRows = text.split('\r');
            var output = '<table>';
            
            var flightDataRow = '';
            var tableData;
            var daysOfWeek = 7;
            var flightAvailable = false;

            var tempArray = [];
            /* 
             * assumption: the date information of when the flight occurs happens in the last 7 columns of the input data, 
             * which allows the CSV file to have additional columns added at the beginning without the code breaking
             */
            for (var row = 0; row < tableRows.length; row++) {
                tableData = tableRows[row].split(',');
                
                flightDataRow += '<tr>';                
                flightAvailable = false;

                for (var index = 0; index < tableData.length; index++) {
                    if (row===0) {
                        if (index < (tableData.length-daysOfWeek)) {
                            // only need flight details, not schedule
                            flightDataRow += '<th>' + tableData[index] + '</th>';
                        }
                    } else if (index < (tableData.length-daysOfWeek)) {
                        // only need flight details, not schedule
                        flightDataRow += '<td>' + tableData[index] + '</td>';
                    } else if (index === (tableData.length-daysOfWeek)+day) {
                        if (tableData[index] == 'x') {                            
                            flightAvailable = true;                            
                        } else {
                            // get rid of any information collated for this flight as flight not available and go to next one
                            flightDataRow = '';
                            break;
                        } // if
                    } // if                   
                } // for

                if (row===0) {
                    flightDataRow += '</tr>';
                    output += flightDataRow;
                    flightDataRow = '';      
                } else if (flightAvailable) {                    
                    flightDataRow += '</tr>';                
                    tempArray.push(flightDataRow);
                    flightDataRow = '';          
                }                   
                
            } // for

            // sort data
            tempArray.sort();

            // get data out to string
            var tempArrayToString = '';
            for (var i = 0; i < tempArray.length; i++) {
                tempArrayToString += tempArray[i];           
            }

            // update html with code for table
            output += tempArrayToString;
            output += '</table>';
            targetNode.innerHTML = output;

        })
    } // end openCSV

    vm.getFlightDay();

    $scope.$watch('vm.flightDate', function(newValue, oldValue) {
        vm.getFlightDay();
    })

});