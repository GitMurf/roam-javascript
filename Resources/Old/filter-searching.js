document.addEventListener('click', function(evt){
    if(evt.target.className === 'bp3-icon bp3-icon-filter')
    {
        //Check if filter search input box is there, otherwise need to load it (new page)
        var tbInputTest = document.getElementById("fbSearchInput");

        if(tbInputTest === null)
        {
            var debugMode = 0;
            var allByClass = document.querySelectorAll('div.rm-reference-container > div:first-child');
            var pageRefDiv = allByClass[0];

            pageRefDiv.addEventListener('click', function(evt){
                if(debugMode == 1){console.log('clicked');}
                document.getElementById("fbSearchInput").focus();
            });

            var newDiv = document.createElement('div');
                newDiv.id = 'filterBoxSearch';
                newDiv.style.cssText = 'display:flex';
                pageRefDiv.insertBefore(newDiv, pageRefDiv.lastElementChild)

            var newInput = document.createElement('input');
                newInput.value = '';
                newInput.id = 'fbSearchInput';
                newInput.name = 'fbSearchInput';
                newInput.style.cssText = 'width:150px;display:flex;margin-left:10px';
                newDiv.appendChild(newInput);
                newInput.focus();

            newInput.addEventListener('input', function(evt){
                var inputTxtVal = document.getElementById("fbSearchInput").value.toString();
                if(debugMode == 1){console.log(inputTxtVal);}

                //Get filter box (only works when opened)
                var allByClass2 = document.querySelectorAll('.bp3-overlay.bp3-overlay-open.bp3-overlay-inline');
                var filterBox = allByClass2[0];
                if(typeof filterBox !== "undefined")
                {
                    var allFilterButtons = filterBox.querySelectorAll('div:not(.flex-h-box) > div > button.bp3-button');

                    for(var i = 0; i < allFilterButtons.length; i++)
                    {
                        var curElement = allFilterButtons.item(i);

                        if(inputTxtVal !== '')
                        {
                            var curElemText = curElement.innerText.toString().toLowerCase();
                            //if(debugMode == 1){console.log(curElemText);}
                            if(curElemText.indexOf(inputTxtVal.toLowerCase()) > -1){curElement.style.display = "inline-flex"}else{curElement.style.display = "none"}
                        }else{curElement.style.display = "inline-flex"}
                    }
                }else
                {
                    if(debugMode == 1){console.log('filter box is NOT open');}
                }
            });
        }
        else {
            tbInputTest.focus();
        }
    }
    //console.log("document click")
});

/* OLD CODE LINES

    //var filterButClass = document.querySelectorAll('.bp3-icon.bp3-icon-filter');
    //var filterButClass = document.querySelectorAll('');
    //var pageLinkFilter = filterButClass[1];

    var filterButtonIcon = pageRefDiv.querySelectorAll(".bp3-icon.bp3-icon-filter")[0];

    //evt.target

    //pageRefDiv.appendChild(newDiv);
    //pageRefDiv.prepend(newDiv);
    //pageRefDiv.appendChild(newDiv);

    var newBut = document.createElement('button');
        newBut.innerHTML = 'CLEAR';
        newBut.id = 'fbSearchInputClear';
        newBut.name = 'fbSearchInputClear';
        //newBut.style.cssText = 'width:150px;display:flex;margin-left:10px';
        newDiv.appendChild(newBut);

        newBut.addEventListener('click', function(evt){
            if(debugMode == 1){console.log('CLEAR clicked');}
            var tbInput = document.getElementById("fbSearchInput");
            tbInput.value = '';
            tbInput.focus();
        });

    //var inputTxtVal = evt.target.value.toString();

    //var allFilterButtons = filterBox.querySelectorAll('.bp3-button');

    //console.log(curElement.innerText);

*/
