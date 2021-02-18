
function kanbanAgendaClick(evt) {
    var clickedElem = evt.target
    var clickedElemClass = clickedElem.className

    if (clickedElemClass == 'kanban-board') {
        var kanbanContainer = clickedElem.getElementsByClassName('kanban-column-container')[0];
        var kanbanHeight = kanbanContainer.offsetHeight;
        var numOfPeriods = parseInt(kanbanHeight / 49) - 2;
        var lowerLimitNum = numOfPeriods / 2;
        var upperLimitNum = parseInt(24 - lowerLimitNum);
        var currentHourInt = dayjs().hour();

        //Get the next task up
        try {
            var arrColumns = Array.from(kanbanContainer.getElementsByClassName('kanban-column'));
            var nextItem = arrColumns.filter((eachItem, index) => eachItem.getElementsByClassName('kanban-title')[0].innerText != eachItem.innerText && currentHourInt < (index - 1));
            var nextTask = nextItem[0].getElementsByClassName('kanban-card')[0].innerText.trim();
            var nextTime = nextItem[0].getElementsByClassName('kanban-title')[0].innerText.trim();
            var itemsLeft = 0;
            nextItem.forEach(eachTime => itemsLeft += eachTime.getElementsByClassName('kanban-card').length);
        } catch (e) { nextTask = '' }

        if (nextTask != '') { nextTask = ` - NEXT of ${itemsLeft}: ${nextTask} (${nextTime})`; }

        try {
            var dnpString = clickedElem.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.pathPageLinks
            if (dnpString.split('","').length > 1) {
                dnpString = dnpString.replace('Daily agenda', '').replace('","', '').replace('[', '').replace(']', '').replace(/\"/g, '');
            } else { dnpString = 'No Date in Parent Block' }
        } catch (e) { var dnpString = 'No Date in Parent Block' }

        if (dnpString == 'No Date in Parent Block') {
            try {
                var dnpString = clickedElem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.pathPageLinks
                if (dnpString.split('","').length > 1) {
                    dnpString = dnpString.replace('Daily agenda', '').replace('","', '').replace('[', '').replace(']', '').replace(/\"/g, '');
                } else { dnpString = 'No Date in Parent Block' }
            } catch (e) { var dnpString = 'No Date in Parent Block' }
        }

        clickedElem.setAttribute('data-Kanban-Agenda', dnpString);

        //Check if added stylesheet is already present
        var foundStyleSheet = document.getElementById('agendaName');
        //Add css stylesheet
        if (!foundStyleSheet) {
            var cssSheet = document.createElement('style');
            cssSheet.type = "text/css";
            cssSheet.id = 'agendaName';
            cssSheet.appendChild(document.createTextNode(""));
            var findRoamBody = document.getElementsByClassName('roam-body')[0];
            findRoamBody.prepend(cssSheet); //appendChild adds AFTER roam/css where prepend adds BEFORE roam/css
            foundStyleSheet = document.getElementById('agendaName');
        }

        foundStyleSheet.innerHTML = `div[data-Kanban-Agenda*='${dnpString}']::before {content: '${dnpString}${nextTask}' !important; font-size: 1.5em !important; line-height: 1.2em;}`

        if (dnpString != roam42.dateProcessing.parseTextForDates('Today').trim().replace("[[", "").replace("]]", "")) {
            kanbanContainer.scrollTop = (12 - parseInt(((kanbanHeight / 49) - 2) / 2) + 1) * 49;
        } else {
            if (currentHourInt <= lowerLimitNum) {
                kanbanContainer.scrollTop = 0; //542 is very bottom; 340 is centered on 7am to 7pm
            } else if (currentHourInt >= upperLimitNum) {
                kanbanContainer.scrollTop = kanbanHeight;
            } else {
                kanbanContainer.scrollTop = (currentHourInt - parseInt(lowerLimitNum)) * 49;
            }
        }
    } else { return; }
}

document.getElementById('app').addEventListener('click', kanbanAgendaClick);
