//v0.4.2
    //Added "grouping" operator with {(} and {)} to allow for combo of and/or conditions
//Github Gist: https://gist.github.com/GitMurf/aece9f105628640cb79925d1310449ec
//DEMO on how to use: https://user-images.githubusercontent.com/64155612/95652671-9f198c80-0aa7-11eb-8f8e-bc08fe81b985.gif
    //Click the '---' in header row of attribute table (1st column)
    //Click a filter icon and start typing filter in input box above the table
    //CONDITIONS and "BLANK" cells
        //Add {not} before any search term to exclude the term e.g., {not}invoice
        //Add {and} to require multiple e.g., invoice {and} payment {and} {not} september
            //Notice on the last example i combined {and} with the {not} clause for the third term
        //Add {or} to find "either" criteria e.g., invoice {or} payment {or} purchase
            //NOTE: You CANNOT combine {and} with {or} conditions
        //TIP: For large attr-tables it may be a bit laggy since it updates filter with every keystroke.
            //To speed it up, you can also enclose a search term in {search term} and it won't apply filter until the closing "}" is pressed
//MUST have David's Sorting Attribute Tables script installed
//Details on David Vargas' Sorting Attribute Tables script:
  //Website: https://roam.davidvargas.me/extensions/attr-tables/
  //Tweet: https://twitter.com/dvargas92495/status/1313897302201958401?s=20

function filterAttr(evt){
    //Add the filter icons and activate this script when user clicks the --- of first col of first row (header)
    var clickedElem = evt.target
    var clickedElemTag = clickedElem.tagName
    if(clickedElemTag !== 'TH'){return}
    if(clickedElem.cellIndex !== 0){return}
    //if(clickedElem.innerText !== '---'){return}

    //Get table header element
    var tableHeaderRow = clickedElem.parentElement
    //check if filter already created
    var filtersCreated = tableHeaderRow.querySelectorAll('[data-filter-index]')[0]
    if(filtersCreated !== null && filtersCreated !== 'undefined' && typeof filtersCreated !== 'undefined')
    {
        //Found a filter already so exit function
        //console.log("found filter")
        return
    }

    //Get the roam-table parent element
    var roamTableElem = clickedElem.parentElement.parentElement.parentElement.parentElement

    //Create the parent DIV for the filter input box
    var newDiv = document.createElement('div')
    newDiv.id = 'filterBox'
    newDiv.style.cssText = 'display:flex;margin-bottom:5px'
    roamTableElem.insertBefore(newDiv, roamTableElem.lastElementChild)

    //Create the input box that user enters filter criteria
    var newInput = document.createElement('input')
    newInput.value = ''
    newInput.id = 'fbFilterInput'
    newInput.name = 'fbFilterInput'
    newInput.style.cssText = 'width:150px;display:flex;color:black;caret-color:black'
    newDiv.appendChild(newInput)

    //Create span that shows row count
    var filterRowCt = document.createElement("span")
    filterRowCt.id = 'filterRowCt'
    filterRowCt.style.cssText = 'display:flex;color:yellow;'
    filterRowCt.textContent = ''
    newInput.parentNode.insertBefore(filterRowCt, newInput.nextSibling)

    //Add filter buttons next to each sort button
    for(var col = 0; col < tableHeaderRow.cells.length; col++)
    {
        var curHeader = tableHeaderRow.cells[col]
        //Find sort icon span
        var curSortIcon = curHeader.getElementsByClassName("bp3-icon")[0]
        //Find parent span of icon
        var sortParSpan = curSortIcon.parentElement

        //Create new parent span for filter icon next to the parent of sort icon
            //add BEFORE sort so its "attr-table-priority-label" still goes on end and stays next to it
        var filterIconParent = document.createElement("span")
        filterIconParent.className = 'bp3-button bp3-minimal bp3-small'
        //Add the new parent span for the filter icon being created below
        sortParSpan.parentNode.insertBefore(filterIconParent, sortParSpan);
        //Create the filter icon
        var filterIcon = document.createElement("span")

        //Had to remove bp3-icon from front of class because David sort extension looks for first bp3-icon (it was 'bp3-icon bp3-icon-filter')
            //Will fix when integrate with David's code
        filterIcon.className = 'bp3-icon-filter' //Choose icons (add after bp3-icon-NAMEofICON) from https://blueprintjs.com/docs/#icons

        //Because of issue above with conflict with David's script, need to add these css formats to make up for know bp3-icon class
        filterIcon.style.cssText = 'margin:0 -7px;font-family:Icons20;font-weight:400'
        filterIcon.id = 'filter' + col
        filterIcon.setAttribute('data-filter-index', col)
        filterIcon.setAttribute('data-filter-value', '')

        //Add onclick function to each filter icon
        filterIcon.onclick = function () {
            var clickedElem = this
            //Get current InputBox element for filtering
            var newInput = document.getElementById("fbFilterInput")
            //console.log('clicked filter button')
            //Check what column index/number it is that was clicked to know which column to filter
            var colIndexClicked = clickedElem.getAttribute('data-filter-index')
            //Set the attribute to the input box
            newInput.setAttribute('data-filter-index', colIndexClicked)

            //Get the current last filter for that column
            var curFilterVal = clickedElem.getAttribute('data-filter-value')
            //Populate the input box with that previous filter
            newInput.value = curFilterVal
            newInput.focus()
            newInput.select()
        }

        filterIconParent.appendChild(filterIcon)
    }

    //Add oninput function to the input box where user types their filter
    newInput.oninput = function () {
        var curFilterInput = this
        //Check what column index/number it is that was clicked to know which column to filter
        var colIndexClicked = curFilterInput.getAttribute('data-filter-index')
        //Get the current value from the filter box
        var inputTxtVal = curFilterInput.value.toString()

        //if opened up an operator like {not} {or} {and} {blank}, do not run all the code below until you close it with } to speed up filtering
        if((inputTxtVal.split("{").length - 1) > (inputTxtVal.split("}").length - 1)){return}

        //Set the corresponding filter span data attribute to the value the user just typed in input box
        var curFilterIcon = document.getElementById("filter" + colIndexClicked)
        curFilterIcon.setAttribute('data-filter-value', inputTxtVal)

        //Get the table element
        var roamTableElem = curFilterInput.parentElement.parentElement

        //Get the rows of attribute table
        var tableRows = roamTableElem.getElementsByTagName("table")[0].rows
        //Get the column count of the attribute table
        var tableCols = tableRows[0].cells.length

        //Set color of filter/sort button if a filter is present
        if(inputTxtVal == '')
        {
            curFilterIcon.style.borderWidth = 'unset'
            curFilterIcon.style.borderStyle = 'unset'
        }
        else
        {
            curFilterIcon.style.borderWidth = '2px'
            curFilterIcon.style.borderStyle = 'dotted'
            curFilterIcon.style.borderColor = 'springgreen'
            curFilterIcon.style.marginLeft = '5px'
        }

        //Adding functions to parse the filter logic
fSplitArray = undefined
fCompare = undefined
fParseGroup = undefined

var testLogic = 'this OR that OR other'
var rowVal = 'that time'

findString = undefined
evaluateString = undefined

var stringLogic = 'this OR that OR other'
var valToMatch = 'that time'

        //See whether the filter criteria matches / is found in the row being analyzed
        function findString(valToMatch,findString)
        {
console.log('Checking if "' + findString + '" is found in "' + valToMatch + '"')
            if(valToMatch.indexOf(findString) > -1) //case sensitive
            {
console.log('found it')
                return true
            }
            else
            {
console.log('NOT found')
                return false
            }
        }

        function findClosingPar(logicString)
        {
console.log('Finding the location of closing parenthesis in "' + logicString + '"')
            logicStringTrimmed = logicString.trim()
            var trimAmount = logicString.length - logicStringTrimmed.length
//console.log('trimAmount: ' + trimAmount)
            var startLen = logicStringTrimmed.length
            var foundOpen = 0
            var foundClose = 0

            for (var i = 0; i < startLen; i++)
            {
//console.log('char# ' + i + ' - ' + logicStringTrimmed.substring(i,i+1))
                if(logicStringTrimmed.substring(i,i+1) == '(')
                {
                    //Found open parenthesis
                    foundOpen++
                }
                else
                {
                    if(logicStringTrimmed.substring(i,i+1) == ')')
                    {
                        //Found close parenthesis
                        foundClose++
                    }
                }
//console.log('foundOpen: ' + foundOpen)
//console.log('foundClose: ' + foundClose)
                if(foundOpen > 0 && foundOpen == foundClose)
                {
                    //Found closing / matching parentheses
console.log('found the closing parenthesis at char: ' + i)
console.log('The entire group is: ' + logicStringTrimmed.substring(0,i+1))
                    return logicString.substring(0,i+1+trimAmount)
                }
            }
        }

        function evaluateString(valToMatch, stringLogic)
        {
            valToMatch = valToMatch.toLowerCase()
            stringLogic = stringLogic.toLowerCase()
            var logicLength = stringLogic.length
            var stringRemaining
            var findOr
            var findAnd
            var findPar
            var foundChar
            var prevCondition = ''
            var newCondition = ''
            var bool1
            var bool2
            var loopCtr = 0

            //Loop throught he string logic
            for (var i = 0; i < logicLength; i++)
            {
                loopCtr++
                if(loopCtr > logicLength)
                {
                    console.log('Endless loop exit')
                    break
                }
console.log('Starting at: ' + i)
                stringRemaining = stringLogic.substring(i)
console.log('stringRemaining: ' + stringRemaining)
                findOr = stringRemaining.indexOf(' or ')
                findAnd = stringRemaining.indexOf(' and ')
                findPar = stringRemaining.indexOf('(')
console.log('findOr: ' + findOr)
console.log('findAnd: ' + findAnd)
console.log('findPar: ' + findPar)
                if(findOr == -1 && findAnd == -1 && findPar == -1)
                {
                    //End of string logic
                    foundChar = -1
                    newCondition = ''
                }
                else if ((findPar < findOr || findOr == -1) && (findPar < findAnd || findAnd == -1) && findPar > -1)
                {
                    //Found a parenthesis group
                    foundChar = findPar
                    newCondition = '('
                }
                else if ((findOr < findAnd && findOr > -1) || findAnd == -1)
                {
                    //Found OR condition
                    foundChar = findOr
                    newCondition = 'or'
                }
                else
                {
                    //Found AND condition
                    foundChar = findAnd
                    newCondition = 'and'
                }
console.log('foundChar: ' + foundChar)
console.log('prevCondition: ' + prevCondition)
console.log('newCondition: ' + newCondition)
                if(prevCondition != '')
                {
console.log('bool1 PREVIOUS: ' + bool1)
                    //Finding boolean2
                    if(newCondition == '')
                    {
                        //End of the logic string
                        i = logicLength
                        var string2 = stringRemaining.substring(0).trim()
                        bool2 = findString(valToMatch, string2)
console.log('****** RESULT ******')
console.log('FOUND END OF STRING')
console.log('stringRemaining: ' + stringRemaining)
console.log('Looked for string2: ' + string2)
console.log('bool1: ' + bool1)
console.log('prevCondition: ' + prevCondition)
console.log('bool2: ' + bool2)
                        if(prevCondition == 'or'){bool1 = (bool1 || bool2)}else{bool1 = (bool1 && bool2)}
console.log('FINAL RESULT: ' + bool1)
console.log('****** END OF RESULT ******')
                    }
                    else if(newCondition == 'and' || newCondition == 'or')
                    {
                        //Find the string that is before the operator to be used for comparison
                        var string2 = stringRemaining.substring(0,foundChar).trim()

                        //Set boolean 2
                        bool2 = findString(valToMatch, string2)
console.log('****** RESULT ******')
console.log('stringRemaining: ' + stringRemaining)
console.log('Looked for string2: ' + string2)
console.log('bool1: ' + bool1)
console.log('prevCondition: ' + prevCondition)
console.log('bool2: ' + bool2)
                        if(prevCondition == 'or'){bool1 = (bool1 || bool2)}else{bool1 = (bool1 && bool2)}
console.log('FINAL RESULT: ' + bool1)
console.log('****** END OF RESULT ******')
                    }
                    else
                    {
                        console.log("PARENTHESES... Calling evaluateString recursively...")
                        //Find the matching closing parenthesis
                        var foundGrouping = findClosingPar(stringRemaining)
                        foundChar = foundGrouping.length - 1
                        newCondition = '' //Need this to make sure at correct point at end of the loop where it adds to i = ...
console.log('foundGrouping PRE trimmed: ' + foundGrouping)
//console.log('set foundChar to match: ' + foundChar)
//console.log('This would extend to: ' + stringLogic.substring(i + foundChar + 1))
                        foundGrouping = foundGrouping.trim()
//console.log('foundGrouping trimmed: ' + foundGrouping)
                        foundGrouping = foundGrouping.substring(1) //Remove opening parenthesis
                        foundGrouping = foundGrouping.substring(0,foundGrouping.length - 1) //Remove opening parenthesis
console.log('foundGrouping after removing parentheses: ' + foundGrouping)
                        bool2 = evaluateString(valToMatch, foundGrouping)
console.log('bool2 after the grouping logic: ' + bool2)
console.log('****** RESULT ******')
console.log('stringRemaining: ' + stringRemaining)
console.log('foundGrouping: ' + foundGrouping)
console.log('bool1: ' + bool1)
console.log('prevCondition: ' + prevCondition)
console.log('bool2: ' + bool2)
                        if(prevCondition == 'or'){bool1 = (bool1 || bool2)}else{bool1 = (bool1 && bool2)}
console.log('FINAL RESULT: ' + bool1)
console.log('****** END OF RESULT ******')
                    }
                }
                else
                {
                    if(bool1 !== undefined)
                    {
                        //Likely right after group parenthesis logic and need to skip ahead one more condition
                        //Won't do anything this time around and wait for it to loop back around
console.log('SKIPPING AHEAD as likley just finished group logic and needs to pickup the next operator or parenthesis')
                    }
                    else
                    {
                        if(newCondition == 'and' || newCondition == 'or')
                        {
                            //Find the string that is before the operator to be used for comparison
                            var string1 = stringRemaining.substring(0,foundChar).trim()
                            //Set boolean 1
                            bool1 = findString(valToMatch, string1)
console.log('****** RESULT ******')
console.log('FIRST BOOLEAN ONLY... STARTING')
console.log('stringRemaining: ' + stringRemaining)
console.log('Looked for string1: ' + string1)
console.log('bool1: ' + bool1)
console.log('prevCondition: ' + prevCondition)
console.log('****** END OF RESULT ******')
                        }
                        else
                        {
                            console.log("STARTING with a PARENTHESES...")
                            //Find the matching closing parenthesis
                            var foundGrouping = findClosingPar(stringRemaining)
                            foundChar = foundGrouping.length - 1
                            newCondition = '' //Need this to make sure at correct point at end of the loop where it adds to i = ...
    console.log('foundGrouping PRE trimmed: ' + foundGrouping)
    //console.log('set foundChar to match: ' + foundChar)
    //console.log('This would extend to: ' + stringLogic.substring(i + foundChar + 1))
                            foundGrouping = foundGrouping.trim()
    //console.log('foundGrouping trimmed: ' + foundGrouping)
                            foundGrouping = foundGrouping.substring(1) //Remove opening parenthesis
                            foundGrouping = foundGrouping.substring(0,foundGrouping.length - 1) //Remove opening parenthesis
    console.log('foundGrouping after removing parentheses: ' + foundGrouping)
                            bool1 = evaluateString(valToMatch, foundGrouping)
    console.log('bool1 after the grouping logic: ' + bool1)
console.log('****** RESULT ******')
console.log('FIRST BOOLEAN ONLY... STARTING')
console.log('stringRemaining: ' + stringRemaining)
console.log('foundGrouping: ' + foundGrouping)
console.log('bool1: ' + bool1)
console.log('prevCondition: ' + prevCondition)
console.log('****** END OF RESULT ******')
                        }
                    }
                }

                prevCondition = newCondition
                i = i + foundChar + newCondition.length
//console.log('string1 end: ' + string1)
console.log('bool1 bottom of loop: ' + bool1)
//console.log('string2: ' + string2)
console.log('bool2 bottom of loop: ' + bool2)
//console.log('end string char count: ' + i)
            }

            return bool1
        }

var rowVal = 'that time'
var testLogic = 'this OR that OR other' //WORKING
var rowVal = 'that time this man'
var testLogic = 'this AND that AND other' //WORKING
var rowVal = 'that time this man'
var testLogic = 'this AND (that OR other)' //WORKING
var rowVal = 'that time this man'
var testLogic = 'this AND ((that AND other) OR (time AND man))' //WORKING
var rowVal = 'that time this man'
var testLogic = 'this AND ((that AND other) OR (times AND man))' //WORKING
var rowVal = 'that time this man'
var testLogic = '(that AND other) OR this OR ((times AND man) OR brutal)' //WORKING
var rowVal = 'that time this man'
var testLogic = '((that AND other) OR this OR ((times AND man) OR brutal)) AND nope'
console.log(evaluateString(rowVal, testLogic))


















        //Looping through each column
        const filterArr = [];

        for(var j = 0; j < tableCols; j++)
        {
            //Check if filter value present from column filters
            var eachFilterElem = document.getElementById("filter" + j)
            if(eachFilterElem !== null && eachFilterElem !== 'undefined' && typeof eachFilterElem !== 'undefined')
            {
                //Col filter value
                var eachFilterVal = eachFilterElem.getAttribute('data-filter-value')
                filterArr.push(eachFilterVal.toString());
            }
        }

        var rowCtr = 0
        for(var i = 1; i < tableRows.length; i++) //Skip header row starting with 1 instead of 0
        {
            //Loop through each row
            var curRow = tableRows[i]

            //Start by showing each row and then filter with each column below
            curRow.style.display = "table-row"
            var hideRow = 0
            for (itm = 0; itm < filterArr.length; itm++)
            {
                var eachFilterElem = filterArr[itm]
                if(eachFilterElem !== '')
                {
                    //Col filter value
                    var eachFilterTextOrig = eachFilterElem.toString()
                    var eachFilterText = eachFilterTextOrig.toLowerCase()

                    //Replace the operators to put into query syntax form for the loop below
                    var querySyntax = eachFilterText.split("{(}").join("{||}{(}{||}").split("{)}").join("{||}{)}{||}").split("{blank}").join("{||}{blank}{||}").split("{not}").join("{||}{not}{||}").split("{and}").join("{||}{and}{||}").split("{or}").join("{||}{or}{||}")

                    //Current row / col value in table to check against filter
                    var curCell = curRow.cells[itm]
                    var curValue = curCell.innerText
                    var curElemText = curValue.toString().toLowerCase()
                    var queryArray = querySyntax.split('{||}')
                    var lastOperator = ''
                    var isNot = 0
                    var isOpenGroup = 0

                    //Loop through each criteria to see if row qualifies
                    for(var ctr = 0; ctr < queryArray.length; ctr++)
                    {
                        var eachArrVal = queryArray[ctr].trim()
                        if(eachArrVal != '')
                        {
                            if(eachArrVal == '{not}'){isNot = 1}
                            if(eachArrVal == '{and}'){lastOperator = 'and'}
                            if(eachArrVal == '{or}'){lastOperator = 'or'}

                            if(eachArrVal != '{not}' && eachArrVal != '{and}' && eachArrVal != '{or}' && eachArrVal != '{blank}')
                            {
                                //Clean out / remove the leading and trailing {SEARCH TERM} around a search
                                eachArrVal = eachArrVal.split("{").join("").split("}").join("")
                            }

                            if(eachArrVal != '{not}' && eachArrVal != '{and}' && eachArrVal != '{or}')
                            {
                                if(lastOperator == '' && isNot == 0)
                                {
                                    //No operators so just simply filter for this value
                                    switch(eachArrVal)
                                    {
                                        case '{blank}':
                                            if(curElemText != '')
                                            {
                                                hideRow = 1
                                            }else{hideRow = -1}
                                            break;
                                        default:
                                            if(curElemText.indexOf(eachArrVal) == -1)
                                            {
                                                hideRow = 1
                                            }else{hideRow = -1}
                                    }
                                }
                                else
                                {
                                    if(isNot == 1)
                                    {
                                        //NOT clause is activated so look for inverse of search term
                                        isNot = 0
                                        if(lastOperator != 'or')
                                        {
                                            //Looking to exclude/hide row if matches this value
                                            if((curElemText.indexOf(eachArrVal) > -1 && eachArrVal != '{blank}') || (eachArrVal == '{blank}' && curElemText == ''))
                                            {
                                                hideRow = 1
                                            }
                                        }
                                        else
                                        {
                                            //OR clause means show the row if found this time because may have been hidden from the first or clause
                                            if((curElemText.indexOf(eachArrVal) == -1 && eachArrVal != '{blank}') || (eachArrVal == '{blank}' && curElemText != ''))
                                            {
                                                //Using -1 to account for situation where any can be satisfied with OR
                                                hideRow = -1
                                            }
                                            else
                                            {
                                                if(hideRow == 0){hideRow = 1}
                                            }
                                        }
                                    }
                                    else
                                    {
                                        //NOT clause is not activated
                                        if(lastOperator != 'or')
                                        {
                                            //Looking to exclude/hide row if does not match this
                                            if(curElemText.indexOf(eachArrVal) == -1 || (eachArrVal == '{blank}' && curElemText != ''))
                                            {
                                                hideRow = 1
                                            }
                                        }
                                        else
                                        {
                                            //OR clause means show the row if found this time because may have been hidden from the first or clause
                                            if((curElemText.indexOf(eachArrVal) > -1 && eachArrVal != '{blank}') || (eachArrVal == '{blank}' && curElemText == ''))
                                            {
                                                //Using -1 to account for situation where any can be satisfied with OR
                                                hideRow = -1
                                            }
                                            else
                                            {
                                                if(hideRow == 0){hideRow = 1}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    //No filter entered for this column
                }
                if(hideRow == 1)
                {
                    curRow.style.display = "none"
                    break
                }
            }
            if(hideRow != 1){rowCtr = rowCtr + 1}
        }
        var filterRowCt = document.getElementById("filterRowCt")
        filterRowCt.textContent = 'Results: ' + rowCtr
    };
}

document.addEventListener('click', filterAttr)
