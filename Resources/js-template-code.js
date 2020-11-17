//Remove the function from the click event listener
document.removeEventListener('click', testingQuery)
//Set function to undefined so that it can be redefined when you make updates on the fly to test
testingQuery = undefined

function testingQuery(evt){
        var clickedElem = evt.target
        console.log(clickedElem)
}

//Add addEventListener for click action to run your testingQuery function
document.addEventListener('click', testingQuery)
