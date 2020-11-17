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

        if(clickedElemText.includes("query:") || clickedElemText.includes("[[query]]:"))
        {
            console.log(clickedElem)
            console.log(clickedElem.className)
            console.log(clickedElemText)
            var queryParent = clickedElem.parentElement
            console.log(queryParent.className)
            var queryResults = queryParent.getElementsByClassName("rm-mentions refs-by-page-view");
            queryResults = queryResults[0]
            console.log(queryResults)
            var childrenResult = queryResults.children;
            //
            for (var i = 0; i < childrenResult.length; i++)
            {
                var eachChild = childrenResult[i];
                console.log(eachChild)
                var pageTitle = eachChild.getElementsByClassName("rm-ref-page-view-title");
                pageTitle = pageTitle[0]
                console.log(pageTitle)
                console.log(pageTitle.innerText)
                var eachBlock = eachChild.getElementsByClassName("roam-block dont-unfocus-block hoverparent rm-block-text");
                eachBlock = eachBlock[0]
                console.log(eachBlock)
                console.log(eachBlock.innerText)
                var dateLinks = eachBlock.querySelectorAll('[data-link-title]')
                dateLinks = dateLinks[0]
                if(dateLinks !== null && dateLinks !== 'undefined' && typeof dateLinks !== 'undefined')
                {
                    console.log(dateLinks)
                    console.log(dateLinks.innerText)
                    var startingDate = dateLinks.innerText
                    startingDate = startingDate.replace("st","").replace("rd","").replace("th","").replace("nd","")
                    var dateTimeValue = Date.parse(startingDate)
                    if(isNaN(dateTimeValue))
                    {
                        console.log("Not a date")
                    }
                    else
                    {
                        console.log("Date FOUND!")
                        console.log(dateTimeValue)
                    }

                    startingDate = dateLinks.innerText
                    dateTimeValue = Date.parse(startingDate)
                    if(isNaN(dateTimeValue))
                    {
                        console.log("Not a date")
                    }
                    else
                    {
                        console.log("Date FOUND!")
                        console.log(dateTimeValue)
                    }
                }

                // Do stuff
            }

        }
    }
}

document.addEventListener('click', testingQuery)
