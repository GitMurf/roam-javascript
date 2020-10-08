function convertText(evt){
    var clickedElem = evt.target
    if(clickedElem.id == 'output-text1')
    {
        var inputTextBox = document.getElementById('input-text')
        //var outputTextBox2 = document.getElementById('output-text2')
        //var outputTextBox3 = document.getElementById('output-text3')
        var inputTextVal = inputTextBox.value
        inputTextVal = inputTextVal.split("•	").join("    -").split("o	").join("        -").split("	").join("            -")
        clickedElem.value = inputTextVal
        clickedElem.focus();
        clickedElem.select();
    }
}

document.getElementById('output-text1').addEventListener('focus', convertText)
