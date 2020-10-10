//v0.3
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
    //Get the sort button clicked by user to activate the filter
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
                    var querySyntax = eachFilterText.split("{blank}").join("{||}{blank}{||}").split("{not}").join("{||}{not}{||}").split("{and}").join("{||}{and}{||}").split("{or}").join("{||}{or}{||}")

                    //Current row / col value in table to check against filter
                    var curCell = curRow.cells[itm]
                    var curValue = curCell.innerText
                    var curElemText = curValue.toString().toLowerCase()
                    var queryArray = querySyntax.split('{||}')
                    var lastOperator = ''
                    var isNot = 0

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
