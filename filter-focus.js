document.addEventListener('click', function(evt){
    if(evt.target.className === 'bp3-icon bp3-icon-filter')
    {
        var clickedElem = evt.target
        //console.log("Clicked filter button")

        //Check if filter search input box is there
        var tbInputSearch = document.getElementsByClassName("bp3-input bp3-minimal search-input");

        if(tbInputSearch !== null && tbInputSearch !== 'undefined' && typeof tbInputSearch !== 'undefined')
        {
            var tbInputSearchFocus = tbInputSearch[0]
            if(tbInputSearchFocus !== null && tbInputSearchFocus !== 'undefined' && typeof tbInputSearchFocus !== 'undefined')
            {
                //console.log("Found and focusing now...")
                tbInputSearchFocus.focus();
            }
        }
    }

    if(evt.target.className === 'bp3-button')
    {
        var clickedElem = evt.target
        //console.log("Clicked one of the filter choices")

        //Check to make sure it is a button that is part of the filter box so that we don't run code on other buttons in Roam that may have the bp3-button class
            //This check is probably unnecessary but I like to be sure since who know how the future of Roam changes things
        var parentNode4Class = clickedElem.parentElement.parentElement.parentElement.parentElement.className
        var parentNode5Class = clickedElem.parentElement.parentElement.parentElement.parentElement.parentElement.className
        if(parentNode4Class == 'bp3-popover-content' || parentNode4Class == 'bp3-popover' || parentNode5Class == 'bp3-popover' || parentNode5Class == 'bp3-popover-content')
        {
            //console.log("Confirmed click of a filter page reference button")
            var tbInputSearch = document.getElementsByClassName("bp3-input bp3-minimal search-input");
            if(tbInputSearch !== null && tbInputSearch !== 'undefined' && typeof tbInputSearch !== 'undefined')
            {
                var tbInputSearchFocus = tbInputSearch[0]
                if(tbInputSearchFocus !== null && tbInputSearchFocus !== 'undefined' && typeof tbInputSearchFocus !== 'undefined')
                {
                    tbInputSearchFocus.focus();
                    tbInputSearchFocus.select();
                }
            }
        }
    }
});
