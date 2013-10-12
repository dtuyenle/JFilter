function JFilter(objectsArray) {

    this.loadFilterObject = function(filterObject) {
        this.filterObject = filterObject;
    }

    this.getResult = function(filterObject,option) {

        var end       = 999999;
        var start     = 0;
        var rankName  = '';
        var rankValue = '';

        if(isNumber(option.startId) === true) {
            start = option.startId;
        }
        else {
            //console.log('startId is not a number ' + startId);
        }
        if(isNumber(option.limit) === true) {
            end = option.limit + start;
        }
        else {
            //console.log('limit is not a number ' + limit);
        }
        if(option.rankName) {
            rankName = option.rankName;
        }
        if(option.rankValue) {
            rankValue = option.rankValue;
        }
       
        var resultObjects            = getFilteredObjects(filterObject,objectsArray);
        var totalObjects             = resultObjects.length;
        var resultFilters            = getNewFilters(filterObject,resultObjects);
        var numberOfObjectsForFilter = getNumberOfObjectsForFilter(resultFilters,resultObjects);

        if(totalObjects < option.limit) {
            end   = 999999;
            start = 0;
        }

        resultObjects.sort(function(a,b) {
            if(rankValue === 'ASC') {
                return parseFloat(a[rankName]) - parseFloat(b[rankName])
            }
            else if(rankValue === 'DESC'){
                return parseFloat(b[rankName]) - parseFloat(a[rankName])
            }           
        });  

        return { objectsArray   : resultObjects.slice(start,end),
                 filterObject   : resultFilters, 
                 numberArray    : numberOfObjectsForFilter,
                 totalObjects   : totalObjects
                }
    }

    function getNumberOfObjectsForFilter(resultFilters,resultObjects) {    
                
        var numberOfObjectsForFilter = [];       

        for( var property in resultFilters) {

            if(isArray(resultFilters[property]) === true) {

                var filter = {};
                var filter = cloneFilters(resultFilters);

                for(var i = 0, length = resultFilters[property].length; i < length; i++) {

                    filter[property]  = null;
                    filter[property]  = [resultFilters[property][i]];

                    var test = getFilteredObjects(filter,resultObjects);
                    var numberOfObjects = test.length;
                    
                    var object          = {};                            
                    object[resultFilters[property][i]] = numberOfObjects;

                    numberOfObjectsForFilter.push(object);
                }
            }
        }

        return numberOfObjectsForFilter
    }

    function getNewFilters(filterObject,filteredObjectsArray) {

        var newFilterObject = getRawFilterObject(filterObject);

        for( var property in newFilterObject) {

            var filterValue = newFilterObject[property];
            var filterName  = property;

            var firstTime   = 0;

            for(var i = 0, length = filteredObjectsArray.length; i < length; i++) {
                        
                if(checkFilterType(filterValue) === 'range') {

                    if(filteredObjectsArray[i].hasOwnProperty(filterName)) {

                        if( filteredObjectsArray[i][filterName] !== '' 
                            && (i === 0 || parseInt(filteredObjectsArray[i][filterName]) < parseInt(newFilterObject[property].min))
                        ) {                       
                            newFilterObject[property].min = filteredObjectsArray[i][filterName];       
                        }

                        if( filteredObjectsArray[i][filterName] !== '' 
                           && (i === 0 || parseInt(filteredObjectsArray[i][filterName]) > parseInt(newFilterObject[property].max))
                        ) {
                            newFilterObject[property].max = filteredObjectsArray[i][filterName];
                        }
                    }
                    
                    if(filteredObjectsArray[i].hasOwnProperty(filterName + 'Min') && filteredObjectsArray[i].hasOwnProperty(filterName + 'Max')) {
                        
                      
                        if( filteredObjectsArray[i][filterName + 'Min'] !== '') {      
                            if(i === 0 || parseInt(filteredObjectsArray[i][filterName + 'Min']) <= parseInt(newFilterObject[property].min)) {
                                newFilterObject[property].min = filteredObjectsArray[i][filterName + 'Min'];
                            }
                        }
                      

                        if( filteredObjectsArray[i][filterName + 'Max'] !== '') {
                             if(i === 0 || parseInt(filteredObjectsArray[i][filterName + 'Max']) >= parseInt(newFilterObject[property].max)) {
                                newFilterObject[property].max = filteredObjectsArray[i][filterName + 'Max'];
                            }
                        }

                    }
                }
                else if(checkFilterType(filterValue) === 'equal'){

                    if(isArray(filteredObjectsArray[i][property]) === false) {
                        var index = indexOf.call(newFilterObject[property], filteredObjectsArray[i][property]);
                        if(index === -1) {
                            newFilterObject[property].push(filteredObjectsArray[i][property]);
                        }
                    }
                    else {
                        for(var j = 0, l = filteredObjectsArray[i][property].length; j < l; j++) {
                            var index = indexOf.call(newFilterObject[property], filteredObjectsArray[i][property][j]);
                            if(index === -1) {
                                newFilterObject[property].push(filteredObjectsArray[i][property][j]);
                            }
                        }
                    }

                }
            }
                
        }

        return newFilterObject
    }   

    function cloneFilters(resultFilters) {

        var cloneFilter = {};

        for(var property in resultFilters) {

            if(isArray(resultFilters[property]) === true) {

                cloneFilter[property] = [];

                for(var i = 0, length = resultFilters[property].length; i < length; i++) {
                    cloneFilter[property].push(resultFilters[property][i]);
                }
            }
            else if (isObject(resultFilters[property]) === true) {
                cloneFilter[property] = {min:resultFilters[property].min,max:resultFilters[property].max};
            }   

        }

        return cloneFilter
    }

    function getRawFilterObject(filterObject) {

        var rawFilterObject = {};

        for(var property in filterObject) {
            if(isArray(filterObject[property]) === true) {
                rawFilterObject[property] = [];
            }
            else if (isObject(filterObject[property]) === true) {
                rawFilterObject[property] = {min:0,max:0};
            }                    
        }

        return rawFilterObject
    }

    function getFilteredObjects(filterObject,objectsArray) {

        var filteredObjectsArray   = [];
       
        for(var i = 0, length = objectsArray.length; i < length; i++) {

            var check           = true;
            var checkFilter     = [];
            var checkName       = [];

            for(var property in filterObject) {
                    
                var filterValue = filterObject[property];
                var filterName  = property;

                if(checkFilterType(filterValue) === 'range') {
                    // checkFilter.push(filterName);
                    checkFilter.push(checkRangeFilterObject(objectsArray[i],filterName,filterValue));
            
                    /*console.log(checkRangeFilterObject(objectsArray[i],filterName,filterValue));
                    console.log(filterName);
                    console.log(filterValue);
                    console.log(objectsArray[i]);*/
                }
                else if(checkFilterType(filterValue) === 'equal'){
                    // checkFilter.push(filterName);
                    checkFilter.push(checkEqualFilterObject(objectsArray[i],filterName,filterValue));

                    /*console.log(checkEqualFilterObject(objectsArray[i],filterName,filterValue));
                    console.log(filterName);
                    console.log(filterValue);
                    console.log(objectsArray[i]);*/

                }
             
            }
            //console.log(objectsArray[i]);
               // console.log(checkFilter);
    

            for(var j = 0, l = checkFilter.length; j < l; j++) {
                if(checkFilter[j] === false) {
                    check = false;
                    break;
                }
            }    

            if(check === true) {
                filteredObjectsArray.push(objectsArray[i]);
            }              
                    
        }
        
      

       
     
       
        return filteredObjectsArray
    }

    function checkIfSameRangeFilter(filterName) {
        for(var i = 0, length = sameRangeFilter.length; i < length; i++) {
            if(filterName === sameRangeFilter[i]) {
                return true
            }
        }

        return false
    }

    function checkFilterType(filterValue) {

        if(isArray(filterValue) === true) { 
            if(filterValue.length >= 0) {
                if(isObject(filterValue[0]) === true) {
                    if(!filterValue[0].hasOwnProperty('max') && !filterValue[0].hasOwnProperty('min')) {
                        //console.log('Object must have property names: max and min');
                    }
                    return 'multiple range'
                }
                else {
                    return 'equal'
                }
            }
        }
        else if(isObject(filterValue) === true) {
            if(!filterValue.hasOwnProperty('max') && !filterValue.hasOwnProperty('min')) {
                //console.log('Object must have property names: max and min');
            }
            return 'range'
        }
        else {
            //console.log('Wrong data type. Supposed to be an array.');
        }

        return 'equal'
    }

    function checkRangeFilterObject(object,filterName,filterValue) {

        var check = false;

        if(object.hasOwnProperty(filterName)) {  
            if(object[filterName] === '') {
                //console.log('Object ' + object.id + ' doesn\'t have ' + filterName);
                return true;
            }           
         
            if(parseInt(object[filterName]) <= parseInt(filterValue.max) && parseInt(object[filterName]) >= parseInt(filterValue.min)) {                      
                return true
            }
            else {
                return false
            }
        }
                
        if(object.hasOwnProperty(filterName + 'Min')) {  

            if(object[filterName + 'Min'] === '') {
                //console.log('Object ' + object.id + ' doesn\'t have ' + filterName +'Min');
                check = true;
            }

            if(parseInt(object[filterName + 'Min']) <= parseInt(filterValue.max) && parseInt(object[filterName + 'Min']) >= parseInt(filterValue.min)) {                      
                check = true;
            }
        }
        else {
            //console.log('Object does not have property ' + filterName + 'Min');
        }
                
        if(object.hasOwnProperty(filterName + 'Max')) {
                    
            if(object[filterName + 'Max'] === '') {
                //console.log('Object ' + object.id + ' doesn\'t have ' + filterName +'Max');
                check = true;
            }

            if(parseInt(object[filterName + 'Max']) <= parseInt(filterValue.max) && parseInt(object[filterName + 'Max']) >= parseInt(filterValue.min) && check === false) {
                check = true;
            }
        }
        else {
            //console.log('Object does not have property ' + filterName + 'Max');
        }
               
        return check
    }

    function checkEqualFilterObject(object,filterName,filterValue) {

        if(object.hasOwnProperty(filterName)) {   

            for(var i = 0, length = filterValue.length; i < length; i++) {      

                if(!isArray(object[filterName]) && object[filterName] === filterValue[i]) {
                    return true
                }
                else if (isArray(object[filterName])) {

                    for(var j = 0, l = object[filterName].length; j < l; j++) {                 
                        if(object[filterName][j] === filterValue[i]) {
                            return true
                        }
                    }

                }

            }

        }
        else {
            console.log('Object does not have property ' + filterName);
        }

        return false
    }

    isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    isArray = function(a) {
        return (!!a) && (a.constructor === Array);
    };

    isObject = function(a) {
        return (!!a) && (a.constructor === Object);
    };

    indexOf = function(needle) {
        if(typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    if(this[i] === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle);
    };
}
