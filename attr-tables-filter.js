//v0.1
function filterAttr(evt){
    //Get the sort button clicked by user to activate the filter
    var clickedElem = evt.target
    var clickedElemClass = clickedElem.className

    if(clickedElemClass == 'bp3-icon bp3-icon-sort' || clickedElemClass == 'bp3-icon bp3-icon-sort-alphabetical' || clickedElemClass == 'bp3-icon bp3-icon-sort-alphabetical-desc')
    {
        //console.log('clicked filter button')
        //Check what column index/number it is that was clicked to know which column to filter
        var colIndexClicked = clickedElem.parentElement.parentElement.cellIndex

        //Get the roam-table parent element
        var roamTableElem = clickedElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
        if(roamTableElem.className == 'roam-table')
        {
            //Get current parent DIV and InputBox element for filtering
            var newInput = document.getElementById("fbFilterInput")
            var newDiv = document.getElementById("filterBox")

            if(newInput !== null && newInput !== 'undefined' && typeof newInput !== 'undefined')
            {
                //Already have filter box present, need to remove to re-create later (need the input event listener to be removed)
                //console.log('Filter exists... remove it')
                newInput.remove()
            }

            //Cannot remove DIV each time because it keeps track of the other filtered items in hidden elements
            if(newDiv !== null && newDiv !== 'undefined' && typeof newDiv !== 'undefined')
            {
                //DIV already created, do nothing
            }
            else
            {
                //Create the parent DIV for the filter input box
                newDiv = document.createElement('div')
                newDiv.id = 'filterBox'
                newDiv.style.cssText = 'display:flex;margin-bottom:5px'
                roamTableElem.insertBefore(newDiv, roamTableElem.lastElementChild)
            }

            //Create the input box that user enters filter criteria
            newInput = document.createElement('input')
            newInput.value = ''
            newInput.id = 'fbFilterInput'
            newInput.name = 'fbFilterInput'
            newInput.setAttribute('data-filter-index', colIndexClicked)
            newInput.style.cssText = 'width:150px;display:flex;color:black;caret-color:black'
            newDiv.appendChild(newInput)

            //Check if already created the hidden element that tracks the current last filter for that column
            var curHiddenElem = document.getElementById("hiddenSpan" + colIndexClicked)
            if(curHiddenElem !== null && curHiddenElem !== 'undefined' && typeof curHiddenElem !== 'undefined')
            {
                //Already present... check to see what filter was previously
                var curFilterVal = curHiddenElem.getAttribute('data-filter-value')
            }
            else
            {
                //Need to create hidden element for this filter column
                curHiddenElem = document.createElement('span')
                curHiddenElem.value = ''
                curHiddenElem.id = "hiddenSpan" + colIndexClicked
                curHiddenElem.name = "hiddenSpan" + colIndexClicked
                newDiv.appendChild(curHiddenElem)
                var curFilterVal = ''
            }

            //Set the filter attribute value and set input box to match previously filter if there was one
            curHiddenElem.setAttribute('data-filter-value', curFilterVal)
            newInput.value = curFilterVal
            newInput.focus()
            newInput.select()

            //Create event listener to activate filter as typing in box
            newInput.addEventListener('input', function(inputevt){
                //Get the input box element for filtering
                var curFilterInput = document.getElementById("fbFilterInput")
                //Get the current value from the filter box
                var inputTxtVal = curFilterInput.value.toString()

                //Get the current col index of the col being filtered
                colIndexClicked = curFilterInput.getAttribute('data-filter-index')
                //Get the value of the input box that just changed from input event and set hidden attribute
                var curHiddenElem = document.getElementById("hiddenSpan" + colIndexClicked)
                curHiddenElem.setAttribute('data-filter-value', inputTxtVal)
                //Get the table element
                var roamTableElem = curFilterInput.parentElement.parentElement

                //Get the rows of attribute table
                var tableRows = roamTableElem.getElementsByTagName("table")[0].rows
                //Get the column count of the attribute table
                var tableCols = tableRows[0].cells.length

                //Set color of filter/sort button if a filter is present
                var headerRow = tableRows[0]
                var filterCell = headerRow.cells[colIndexClicked]
                //Get filter/sort icon
                var filterIcon = filterCell.getElementsByClassName("bp3-icon")[0]

                //Set color of filter icon if it has filter value in input box
                if(inputTxtVal == '')
                {
                    filterIcon.style.cssText = 'border-width:unset;border-color:green;border-style:unset'
                }
                else
                {
                    filterIcon.style.cssText = 'border-width:2px;border-color:green;border-style:dotted'
                }

                for(var i = 1; i < tableRows.length; i++) //Skip header row starting with 1 instead of 0
                {
                    //Loop through each row
                    var curRow = tableRows[i]

                    //Start by showing each row and then filter with each column below
                    curRow.style.display = "table-row"

                    //Looping through each column
                    //See if any other filters present based on their hidden elements
                    for(var j = 0; j < tableCols; j++)
                    {
                        //Check if hidden filter value present from column filters
                        var eachHiddenElem = document.getElementById("hiddenSpan" + j)

                        if(eachHiddenElem !== null && eachHiddenElem !== 'undefined' && typeof eachHiddenElem !== 'undefined')
                        {
                            //Col filter value
                            var eachFilterVal = eachHiddenElem.getAttribute('data-filter-value')
                            var eachFilterText = eachFilterVal.toString().toLowerCase()

                            if(eachFilterText !== '')
                            {
                                //Current row / col value in table to check against filter
                                var curCell = curRow.cells[j]
                                var curValue = curCell.innerText
                                var curElemText = curValue.toString().toLowerCase()

                                if(curElemText.indexOf(eachFilterText.toLowerCase()) > -1)
                                {
                                    //found a match; don't have to do anything
                                    //console.log('FOUND')
                                }
                                else
                                {
                                    //Did not match the filter
                                    //console.log('NOT FOUND')
                                    //Hide the item
                                    curRow.style.display = "none"
                                }
                            }
                            else
                            {
                                //Hidden filter value is blank. Don't need to filter anything for this column
                            }
                        }
                        else
                        {
                            //Filter not present for this column
                        }
                    }
                }
            });
        }
    }
}

document.addEventListener('click', filterAttr)
