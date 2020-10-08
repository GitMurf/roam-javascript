//v0.2
//To apply TODO filter, use Shift + Click on the query syntax when a query is loaded with results
//Use this link to see GIF of DEMO: https://user-images.githubusercontent.com/64155612/95497383-168bd680-0957-11eb-8949-e8e428ab44f0.gif
//The goal of this script is to filter out TODOs that only show up because they were added on daily notes page
//Mainly it is if you want to find overdue tasks, like from the last week, by default a TODO due next week will still
    //show up if you added that TODO on a daily notes page from last week (within the between range)
//Resources about the script:
    //For detailed discussion, see this Slack thread: https://roamresearch.slack.com/archives/C012WK8E9DK/p1601992542022100
    //Here is my github repo: https://github.com/GitMurf/roam-javascript

function todoQueryFilter(evt){
    if(evt.shiftKey || evt.altKey)
    {
        var clickedElem = evt.target
        var clickedElemText = clickedElem.innerText
        clickedElemText = clickedElemText.toLowerCase()

        if(clickedElemText.includes("query:") || clickedElemText.includes("[[query]]:"))
        {
            var querySyntax = clickedElemText
            var startOfBetween = querySyntax.indexOf('between:')
            if(startOfBetween < 0){return;} //Exit function as no between query parameter
            var hiddenCtr = 0;

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

            //console.log(startDateStr)
            //console.log(endDateStr)

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

            var queryParent = clickedElem.parentElement
            var queryResults = queryParent.getElementsByClassName("rm-mentions refs-by-page-view");
            queryResults = queryResults[0]
            var childrenResult = queryResults.children;

            //Loop through each page that has query results
            for (var i = 0; i < childrenResult.length; i++)
            {
                //LOOPING THROUGH EACH "PAGE" that has query results under it

                var eachChild = childrenResult[i];
                var pageTitle = eachChild.getElementsByClassName("rm-ref-page-view-title");
                pageTitle = pageTitle[0]
                var pageTitleStr = pageTitle.innerText
                //Check if page title is a date
                //Don't actually use this part for anything but leaving in for future
                pageTitleStr = pageTitleStr.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",")
                var pgDateTimeValue = Date.parse(pageTitleStr)
                if(isNaN(pgDateTimeValue))
                {
                    //console.log("PAGE is Not a date")
                }
                else
                {
                    //console.log("PAGE is a date")
                }

                var childSections = eachChild.getElementsByClassName("rm-reference-item");
                for (var j = 0; j < childSections.length; j++)
                {
                    //LOOPING THROUGH EACH "SECTION" (nested location of the blocks) THAT HAS BLOCK RESULTS FOR QUERY

                    eachSection = childSections[j]

                    //console.log('*******************************')
                    //console.log(eachSection.innerText)
                    //console.log('*******************************')

                    //Look for any dates in the "parent" blocks which are called "zoom mentions" in Roam html
                    var zoomMentions = eachSection.getElementsByClassName("rm-zoom zoom-mentions-view");
                    zoomMentions = zoomMentions[0]
                    //Find all page links / tags to see if are dates
                    var parentDateLinks = zoomMentions.querySelectorAll('[data-link-title], [data-tag]')
                    //Counting how many dates found in parent blocks inside the between range and also in future outside between range
                    var parDatesFound = 0
                    var parDatesIn = 0
                    var parDatesFuture = 0

                    for (var y = 0; y < parentDateLinks.length; y++)
                    {
                        //LOOPING THROUGH EACH PAGE/TAG TO SEE IF IT IS A DATE
                        eachTag2 = parentDateLinks[y]

                        if(eachTag2 !== null && eachTag2 !== 'undefined' && typeof eachTag2 !== 'undefined')
                        {
                            var startingDate2 = eachTag2.innerText
                            //console.log(startingDate2)
                            startingDate2 = startingDate2.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",").replace("#","")
                            var dateTimeValue2 = Date.parse(startingDate2)
                            if(isNaN(dateTimeValue2))
                            {
                                //console.log("Not a date...")
                            }
                            else
                            {
                                parDatesFound = parDatesFound + 1
                                if(dateTimeValue2 >= startDate && dateTimeValue2 <= endDate)
                                {
                                    parDatesIn = parDatesIn + 1
                                    //console.log("Date FOUND in range!")
                                }
                                else
                                {
                                    //console.log("Date FOUND, but OUTSIDE range...")
                                    //Check if future date (as opposed to before the between range)
                                    if(dateTimeValue2 > endDate)
                                    {
                                        //If future date then we want to hide because it really isn't "past due"
                                        parDatesFuture = parDatesFuture + 1
                                    }
                                }
                            }
                        }
                        else
                        {
                            //No pages/tags in block
                            //console.log("No pages/tags found in parents")
                        }
                    }

                    var foundCtr = 0
                    var childBlocks = eachSection.getElementsByClassName("roam-block dont-unfocus-block hoverparent rm-block-text");
                    for (var k = 0; k < childBlocks.length; k++)
                    {
                        //LOOPING THROUGH EACH BLOCK THAT IS RESULT OF QUERY

                        eachBlock = childBlocks[k]
                        //console.log(eachBlock.innerText)
                        var dateLinks = eachBlock.querySelectorAll('[data-link-title], [data-tag]')
                        var foundDates = 0
                        var foundDateInRange = 0
                        var foundDateInFuture = 0
                        for (var x = 0; x < dateLinks.length; x++)
                        {
                            //LOOPING THROUGH EACH PAGE/TAG TO SEE IF IT IS A DATE

                            eachTag = dateLinks[x]

                            if(eachTag !== null && eachTag !== 'undefined' && typeof eachTag !== 'undefined')
                            {
                                //console.log(eachTag.innerText)
                                var startingDate = eachTag.innerText
                                startingDate = startingDate.replace("st,",",").replace("rd,",",").replace("th,",",").replace("nd,",",").replace("#","")
                                var dateTimeValue = Date.parse(startingDate)
                                if(isNaN(dateTimeValue))
                                {
                                    //console.log("Not a date...")
                                }
                                else
                                {
                                    foundDates = foundDates + 1
                                    if(dateTimeValue >= startDate && dateTimeValue <= endDate)
                                    {
                                        foundDateInRange = foundDateInRange + 1
                                        //console.log("Date FOUND!")
                                        //console.log(dateTimeValue)
                                    }
                                    else
                                    {
                                        //console.log("Date FOUND, but OUTSIDE between range...")
                                        //Check if future date (as opposed to before the between range)
                                        if(dateTimeValue > endDate)
                                        {
                                            //If future date then we want to hide because it really isn't "past due"
                                            foundDateInFuture = foundDateInFuture + 1
                                        }
                                    }
                                }
                            }
                            else
                            {
                                //No pages/tags in block
                            }
                        }

                        if(foundDates > 0)
                        {
                            //Date(s) in child/TODO block
                            if(foundDateInFuture > 0)
                            {
                                //Hide block as there is a future date in TODO block (not past due)
                                eachBlock.style.display = "none"
                                hiddenCtr = hiddenCtr + 1
                            }
                            else
                            {
                                //Keep showing block
                                foundCtr = foundCtr + 1
                            }
                        }
                        else if(parDatesFound > 0)
                        {
                            //Date(s) in parent block(s)
                            if(parDatesFuture > 0)
                            {
                                //Hide block as no dates in child/TODO and there is a future date in parent block (not past due)
                                eachBlock.style.display = "none"
                                hiddenCtr = hiddenCtr + 1
                            }
                            else
                            {
                                //Keep showing block
                                foundCtr = foundCtr + 1
                            }
                        }
                        else
                        {
                            //No dates found in child/TODO or Parent blocks
                            //Since it is showing up in query results, then the page its on must be a daily notes page within between range
                            foundCtr = foundCtr + 1
                        }
                    }

                    //Checks to see if any child/TODO block(s) were left shown, if so, do NOT hide the SECTION
                    if(foundCtr == 0)
                    {
                        //console.log("Hiding this section...")
                        //console.log(eachSection)
                        eachSection.style.display = "none"
                    }
                }
            }
            console.log(hiddenCtr + " items hidden")
        }
    }
}

document.addEventListener('click', todoQueryFilter)
