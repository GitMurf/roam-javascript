function convertText(evt){
    var clickedElem = evt.target
    if(clickedElem.id == 'output-text1')
    {
        var inputTextBox = document.getElementById('input-text')
        var outputTextBox2 = document.getElementById('output-text2')
        var outputTextBox3 = document.getElementById('output-text3')
        var inputTextHTML = inputTextBox.innerHTML
        var inputTextText = inputTextBox.innerText
        var inputTextVal = inputTextBox.value

        //If you want to insert HTML tags you need to use InnerHTML.
            //innerText property sets or returns the text content as plain text of the specified node, and all its descendants
            //whereas the innerHTML property gets and sets the plain text or HTML contents in the elements.
        clickedElem.innerHTML = inputTextHTML
        outputTextBox2.innerText = inputTextText
        outputTextBox3.value = inputTextVal
    }
}

document.addEventListener('focus', convertText)
