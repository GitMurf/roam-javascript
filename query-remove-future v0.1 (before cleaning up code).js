//testingQuery = undefined
//document.removeEventListener('click', testingQuery)

function testingQuery(evt){
    if(evt.shiftKey || evt.altKey)
    {
        var clickedElem = evt.target
        //console.log(clickedElem)
        var clickedElemText = clickedElem.innerText
        //console.log(clickedElemText)
        clickedElemText = clickedElemText.toLowerCase()
        console.log(clickedElemText)

        if(clickedElemText.includes("query:") || clickedElemText.includes("[[query]]:"))
        {
            var querySyntax = clickedElemText
            var startOfBetween = querySyntax.indexOf('between:')
            if(startOfBetween < 0){return;} //Exit function as no between query parameter

            var phToday = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
            var phTomorrow = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()+1)
            var phNextWeek = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()+7)
            var phNextMonth = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()+31)
            var phYesterday = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()-1)
            var phLastWeek = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()-7)
            var phLastMonth = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()-31)

                //Find "between"

                var afterBetween = querySyntax.substring(startOfBetween + 8)
                var endOfBetween = afterBetween.indexOf('}')
                var dateRangeStr = afterBetween.substring(0,endOfBetween).trim()
                var startDateStr = dateRangeStr.substring(0,dateRangeStr.indexOf(' [[')).trim().split("[").join("").split("]").join("")
                var endDateStr = dateRangeStr.substring(dateRangeStr.indexOf(' [[')).trim().split("[").join("").split("]").join("")
                var startDate
                var endDate

            console.log(startDateStr)
            console.log(endDateStr)

            switch(startDateStr)
            {
                case 'today':
                    startDate = Date.parse(phToday)
                    break;
                case 'tomorrow':
                    startDate = Date.parse(phTomorrow)
                    break;
                case 'next week':
                    startDate = Date.parse(phNextWeek)
                    break;
                case 'next month':
                    startDate = Date.parse(phNextMonth)
                    break;
                case 'yesterday':
                    startDate = Date.parse(phYesterday)
                    break;
                case 'last week':
                    startDate = Date.parse(phLastWeek)
                    break;
                case 'last month':
                    startDate = Date.parse(phLastMonth)
                    break;
                default:
                    startDateStr = startDateStr.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",")
                    startDate = Date.parse(startDateStr)
            }

            switch(endDateStr)
            {
                case 'today':
                    endDate = Date.parse(phToday)
                    break;
                case 'tomorrow':
                    endDate = Date.parse(phTomorrow)
                    break;
                case 'next week':
                    endDate = Date.parse(phNextWeek)
                    break;
                case 'next month':
                    endDate = Date.parse(phNextMonth)
                    break;
                case 'yesterday':
                    endDate = Date.parse(phYesterday)
                    break;
                case 'last week':
                    endDate = Date.parse(phLastWeek)
                    break;
                case 'last month':
                    endDate = Date.parse(phLastMonth)
                    break;
                default:
                    endDateStr = endDateStr.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",")
                    endDate = Date.parse(endDateStr)
            }

            if(endDate < startDate)
            {
                var tmpEndDate = endDate
                endDate = startDate
                startDate = tmpEndDate
            }

            console.log("Start Date:")
            console.log(startDate)
            console.log("End Date:")
            console.log(endDate)

            //console.log(clickedElem)
            //console.log(clickedElem.className)
            //console.log(clickedElemText)
            var queryParent = clickedElem.parentElement
            //console.log(queryParent.className)
            var queryResults = queryParent.getElementsByClassName("rm-mentions refs-by-page-view");
            queryResults = queryResults[0]
            //console.log(queryResults)
            var childrenResult = queryResults.children;
            //Loop through each page that has query results
            for (var i = 0; i < childrenResult.length; i++)
            {
                //LOOPING THROUGH EACH "PAGE" that has query results under it

                var eachChild = childrenResult[i];
                //console.log(eachChild)
                var pageTitle = eachChild.getElementsByClassName("rm-ref-page-view-title");
                pageTitle = pageTitle[0]
                //console.log(pageTitle)
                var pageTitleStr = pageTitle.innerText
                console.log(pageTitleStr)
                //Check if page title is a date
                pageTitleStr = pageTitleStr.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",")
                var pgDateTimeValue = Date.parse(pageTitleStr)
                if(isNaN(pgDateTimeValue))
                {
                    console.log("PAGE is Not a date")
                }
                else
                {
                    console.log("PAGE is date and is the following...")
                    console.log(pgDateTimeValue)
                }

                var childSections = eachChild.getElementsByClassName("rm-reference-item");
                for (var j = 0; j < childSections.length; j++)
                {
                    //LOOPING THROUGH EACH "SECTION" (nested location of the blocks) THAT HAS BLOCK RESULTS FOR QUERY

                    eachSection = childSections[j]
                    //console.log(eachSection)
                    console.log(eachSection.innerText)
                    var foundCtr = 0

                    var childBlocks = eachSection.getElementsByClassName("roam-block dont-unfocus-block hoverparent rm-block-text");
                    for (var k = 0; k < childBlocks.length; k++)
                    {
                        //LOOPING THROUGH EACH BLOCK THAT IS RESULT OF QUERY

                        eachBlock = childBlocks[k]
                        //console.log(eachBlock)
                        console.log(eachBlock.innerText)
                        var dateLinks = eachBlock.querySelectorAll('[data-link-title], [data-tag]')
                        var foundDates = 0
                        var foundDateInRange = 0
                        for (var x = 0; x < dateLinks.length; x++)
                        {
                            //LOOPING THROUGH EACH PAGE/TAG TO SEE IF IT IS A DATE

                            eachTag = dateLinks[x]

                            if(eachTag !== null && eachTag !== 'undefined' && typeof eachTag !== 'undefined')
                            {
                                //console.log(eachTag)
                                console.log(eachTag.innerText)
                                var startingDate = eachTag.innerText
                                startingDate = startingDate.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",").replace("#","")
                                var dateTimeValue = Date.parse(startingDate)
                                if(isNaN(dateTimeValue))
                                {
                                    console.log("Not a date...")
                                    //eachBlock.style.display = "none"
                                }
                                else
                                {
                                    foundDates = foundDates + 1
                                    if(dateTimeValue >= startDate && dateTimeValue <= endDate)
                                    {
                                        foundCtr = foundCtr + 1
                                        foundDateInRange = foundDateInRange + 1
                                        console.log("Date FOUND!")
                                        console.log(dateTimeValue)
                                    }
                                    else
                                    {
                                        console.log("Date FOUND, but OUTSIDE between range...")
                                        //console.log(dateTimeValue)
                                        //eachBlock.style.display = "none"
                                    }
                                }
                            }
                            else
                            {
                                //No pages/tags in block
                            }
                        }

                        if(foundDates == 0)
                        {
                            //No date in block
                            console.log("No date was found in this block...")
                            if(isNaN(pgDateTimeValue))
                            {
                                console.log("PAGE is Not a date AND block is not a Date... HIDING")
                                eachBlock.style.display = "none"
                            }
                            else
                            {
                                console.log("No date found in block BUT the page it is on is a Date")
                                if(pgDateTimeValue >= startDate && pgDateTimeValue <= endDate)
                                {
                                    console.log("PAGE date is between the range so keeping this bullet!")
                                    foundCtr = foundCtr + 1
                                    foundDateInRange = foundDateInRange + 1
                                }
                                else
                                {
                                    console.log("PAGE date is NOT between the range so HIDING this bullet!")
                                    eachBlock.style.display = "none"
                                }
                            }
                        }
                        else
                        {
                            if(foundDateInRange > 0)
                            {
                                console.log("Found at least one date in range so keeping it...")
                            }
                            else
                            {
                                console.log("Dates were FOUND, but ALL were OUTSIDE the between range... HIDING")
                                eachBlock.style.display = "none"
                            }
                        }
                    }

                    if(foundCtr == 0)
                    {
                        console.log("Hiding this section...")
                        eachSection.style.display = "none"
                    }
                }
            }
        }
    }
}

document.addEventListener('click', testingQuery)
