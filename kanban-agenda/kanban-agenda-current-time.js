
; (async () => {
    //When testing you can use this in the Chrome Dev Tools console to stop the notifications at any time: clearInterval(window.agendaInterval)
    window.agendaCheckEveryMinutes = 5; //default check every 5 minutes

    var mySleep = m => new Promise(r => setTimeout(r, m));
    //Loop to check if roam42 is loaded yet
    for (let y = 1; y < 30; y++) {
        await mySleep(1000);
        if (window.dayjs && window.roam42) { break; }
    }

    await mySleep(1000);

    console.log('Started up Kanban Agenda current hour check timer');

    const agendaHourCheck = async () => {
        //console.log('Checking agenda hour...');
        //Check if added stylesheet is already present
        var foundStyleSheet = document.getElementById('agendaHourStyle');
        //Add css stylesheet
        if (!foundStyleSheet) {
            var cssSheet = document.createElement('style');
            cssSheet.type = "text/css";
            cssSheet.id = 'agendaHourStyle';
            cssSheet.appendChild(document.createTextNode(""));
            var findRoamBody = document.getElementsByClassName('roam-body')[0];
            findRoamBody.prepend(cssSheet); //appendChild adds AFTER roam/css where prepend adds BEFORE roam/css
            foundStyleSheet = document.getElementById('agendaHourStyle');
        }

        foundStyleSheet.innerHTML = ':root {--current-hr-bg: #ff8994; --sliver-color: yellow}'; //Can change color here

        var dnpString = roam42.dateProcessing.parseTextForDates('Today').trim().replace("[[", "").replace("]]", "");
        var currentHourInt = dayjs().hour();
        var currentMinInt = dayjs().minute();
        var shadowSize = ((currentMinInt / 60) * 40) - 20;
        var newCssStr = `.roam-article > div > div > div[data-path-page-links*='${dnpString}","Daily agenda'] .kanban-column-container > .kanban-column:nth-of-type(n+${currentHourInt + 2}):nth-of-type(-n+${currentHourInt + 2}),
            #right-sidebar div[data-path-page-links*='${dnpString}","Daily agenda'] .kanban-column-container > .kanban-column:nth-of-type(n+${currentHourInt + 2}):nth-of-type(-n+${currentHourInt + 2}) {
                background-color: var(--sliver-color) !important;
                box-shadow: -22px ${shadowSize}px 0px 23px var(--current-hr-bg) inset !important;
}
`;
        foundStyleSheet.innerHTML = foundStyleSheet.innerHTML + newCssStr;
    }

    await agendaHourCheck();
    try { if (window.agendaInterval > 0) clearInterval(window.agendaInterval) } catch (e) { }
    window.agendaInterval = setInterval(async () => {
        await agendaHourCheck();
    }, window.agendaCheckEveryMinutes * 60000);
})();
