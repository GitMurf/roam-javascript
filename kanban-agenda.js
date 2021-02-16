
var curBlockRef = roam42.smartBlocks.activeWorkflow.vars["varCurBlockRef"];
console.log(curBlockRef);
var dailyAgendaTag = 'Daily agenda'; //Do NOT include the page brackets
var needToSchedule = '[[Need to Plan]]'; //Use page brackets if you want this tracked as page/tag
var use24HourTime = false; //true = 15:00 / false = 3 PM
var addLeadingZero = false; //true = 03 PM / false = 3 PM (does NOT apply to 24 hr time)
var dateDefault = 'Today';
var selectDate = window.prompt("\nAdd to agenda on what date?\n\nOR pick random date:\n\ntw = this week\nnw = next week\nMonth and Year: tm, nm, ty, ny\n",dateDefault);
var timeDefault = 'All Day';

if(selectDate.toLowerCase() == 'today') {
    //If adding to today, then default will be next hour
    timeDefault = dayjs().add(1,"hour").format("ha");
}
var selectTime = window.prompt("Add to agenda at what time (hours only; blank = unscheduled; All Day = All Day)?",timeDefault);

//Just setting to today to start from (took from defer SB code so fitting it here)
var rmDateParse = new Date(Date.parse(dayjs()));
var howManyDaysInt = 0;

switch(selectDate) {
    //Sunday = 0, Saturday = 6
    case "tw":
        var curDayOfWeek = rmDateParse.getDay();
        if(curDayOfWeek == 6){curDayOfWeek = 0;}
        howManyDaysInt = 1 + (Math.floor(Math.random() * Math.floor(6 - curDayOfWeek)));
        break;
    case "nw":
        var curDayOfWeek = rmDateParse.getDay();
        howManyDaysInt = 6 - curDayOfWeek + 1 + (Math.floor(Math.random() * Math.floor(7)));
        break;
    case "tm":
        var curDayOfMonth = rmDateParse.getDate();
        var endOfMonth = new Date(dayjs(rmDateParse).endOf('month').format('MMMM DD, YYYY 00:00')).getDate();
        var endOfNextMonth = new Date(dayjs(rmDateParse).add(1,'month').endOf('month').format('MMMM DD, YYYY 00:00')).getDate();
        if(curDayOfMonth == endOfMonth){curDayOfMonth = 1; endOfMonth = endOfNextMonth;}
        howManyDaysInt = 1 + (Math.floor(Math.random() * Math.floor(endOfMonth - curDayOfMonth)));
        break;
    case "nm":
        var curDayOfMonth = rmDateParse.getDate();
        var endOfMonth = new Date(dayjs(rmDateParse).endOf('month').format('MMMM DD, YYYY 00:00')).getDate();
        var endOfNextMonth = new Date(dayjs(rmDateParse).add(1,'month').endOf('month').format('MMMM DD, YYYY 00:00')).getDate();
        howManyDaysInt = endOfMonth - curDayOfMonth + 1 + (Math.floor(Math.random() * Math.floor(endOfNextMonth)));
        break;
    case "ty":
        var daysLeftInYear = dayjs().endOf('year').diff(dayjs(rmDateParse),'day');
        howManyDaysInt = 1 + (Math.floor(Math.random() * Math.floor(daysLeftInYear)));
        break;
    case "ny":
        var daysLeftInYear = dayjs().endOf('year').diff(dayjs(rmDateParse),'day');
        howManyDaysInt = 1 + daysLeftInYear + (Math.floor(Math.random() * Math.floor(365)));
        break;
    default:
        if(selectDate.toLowerCase() == 'today') {
            howManyDaysInt = 0;
        } else {
            howManyDaysInt = -1; //Use the NLP date processor from roam42
        }
        break;
}

if(howManyDaysInt == -1) {
    var stringToParse = roam42.dateProcessing.parseTextForDates(selectDate).split(/\[\[|\]\]/);
    if(stringToParse.length > 1) {
        var nextDate = new Date(stringToParse[1].replace("st,","").replace("rd,","").replace("th,","").replace("nd,","").trim());
    } else {
        //Assume today if no match found
        var nextDate = new Date();
    }
} else {
    var nextDate = new Date(rmDateParse.getFullYear(),rmDateParse.getMonth(), rmDateParse.getDate() + howManyDaysInt);
}
var rmDateFormat = roam42.dateProcessing.parseTextForDates( dayjs(nextDate).format('MMMM DD, YYYY') ).trim();
var dnpTitle = rmDateFormat.replace("[[","").replace("]]","");

//Get the index position of the time selected 0 (all day) to 25 (unscheduled)
switch(selectTime.toLowerCase()) {
    case "all day":
        var timeBlockPos = 0;
        break;
    case "":
        var timeBlockPos = 25;
        break;
    default:
        if(!isNaN(Number(selectTime))){selectTime = selectTime + ':00'}
        //Custom time 
        var customNLP = new chrono.Chrono();
        var timeBlockPos = dayjs(customNLP.parse(selectTime)[0].start.date()).hour() + 1;
        break;
}

console.log(selectTime + ' --> ' + timeBlockPos);

//Check to see if the date page you are adding to is created yet
var findBlock = window.roamAlphaAPI.q(`
[
    :find ?page-UID
    :in $ ?page-title
    :where 	[?page-found :node/title ?page-title]
            [?page-found :block/uid ?page-UID]
]
`, dnpTitle);

console.log(dnpTitle);
console.log(findBlock.length);

if(findBlock.length > 0) {
    //Page is already created
    console.log('Page already created for this day');
} else {
    //DNP page not created so need to create it now
    //Do NOT create a custom UID as Roam automatically created the correct DNP format of 02-15-2021
    await window.roamAlphaAPI.createPage(
        {"page": 
            {
                "title": dnpTitle
            }
        }
    );
    await roam42.common.sleep(5);

    //Get UID of the page after it was created
    findBlock = window.roamAlphaAPI.q(`
    [
        :find ?page-UID
        :in $ ?page-title
        :where 	[?page-found :node/title ?page-title]
                [?page-found :block/uid ?page-UID]
    ]
    `, dnpTitle);
}

var agendaPageUid = findBlock[0][0];
console.log(agendaPageUid);

//Check to see if the Daily Template tag with kanban has been created yet
var findBlock = window.roamAlphaAPI.q(`
[
    :find (pull ?block-child [:block/uid])
    :in $ ?page-uid ?agenda-tag
    :where 	[?page-found :block/uid ?page-uid]
            [?agenda-page :node/title ?agenda-tag]
            [?block-found :block/page ?page-found]
            [?block-found :block/refs ?agenda-page]
            [?block-found :block/uid ?block-uid]
            [?block-found :block/children ?block-child]
]
`, agendaPageUid, dailyAgendaTag);

if(findBlock.length > 0) {
    //Kanban is already created
    console.log('Kanban already created for this day');
} else {
    //Need to create kanban and its 26 children blocks
    //Create array of the blocks to add
    if(use24HourTime) {
        //Use 24 hour time
        var arrBlockStrings = [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00"
        ]
    } else {
        //Use AM/PM time
        if(addLeadingZero){var leadingZero = '0'}else{var leadingZero = ''}
        var timeSuffix = ' AM';
        var arrBlockStringsAM = [
            "12" + timeSuffix,
            leadingZero + "1" + timeSuffix,
            leadingZero + "2" + timeSuffix,
            leadingZero + "3" + timeSuffix,
            leadingZero + "4" + timeSuffix,
            leadingZero + "5" + timeSuffix,
            leadingZero + "6" + timeSuffix,
            leadingZero + "7" + timeSuffix,
            leadingZero + "8" + timeSuffix,
            leadingZero + "9" + timeSuffix,
            "10" + timeSuffix,
            "11" + timeSuffix
        ];
        timeSuffix = ' PM';
        var arrBlockStringsPM = [
            "12" + timeSuffix,
            leadingZero + "1" + timeSuffix,
            leadingZero + "2" + timeSuffix,
            leadingZero + "3" + timeSuffix,
            leadingZero + "4" + timeSuffix,
            leadingZero + "5" + timeSuffix,
            leadingZero + "6" + timeSuffix,
            leadingZero + "7" + timeSuffix,
            leadingZero + "8" + timeSuffix,
            leadingZero + "9" + timeSuffix,
            "10" + timeSuffix,
            "11" + timeSuffix
        ];
        var arrBlockStrings = arrBlockStringsAM.concat(arrBlockStringsPM);
    }

    //Add on the first and last kanban items
    arrBlockStrings.unshift(timeDefault);
    arrBlockStrings.push(needToSchedule);

    //Create the blocks
    //The daily agenda template root block
    var blockString = '[[' + dailyAgendaTag + ']]';
    var rootBlockUid = await roam42.common.createBlock(agendaPageUid, 0, blockString);
    console.log(rootBlockUid);
    //The kanban block
    blockString = '{{[[' + 'kanban' + ']]}}';
    var kanbanBlockUid = await roam42.common.createBlock(rootBlockUid, 0, blockString);
    //The timeslot children
    arrBlockStrings.forEach(eachString => {
        var eachBlock = roam42.common.createBlock(kanbanBlockUid, -1, eachString)
    });

    await roam42.common.sleep(5); 
    var findBlock = window.roamAlphaAPI.q(`
    [
        :find (pull ?block-child [:block/uid])
        :in $ ?page-uid ?agenda-tag
        :where 	[?page-found :block/uid ?page-uid]
                [?agenda-page :node/title ?agenda-tag]
                [?block-found :block/page ?page-found]
                [?block-found :block/refs ?agenda-page]
                [?block-found :block/uid ?block-uid]
                [?block-found :block/children ?block-child]
    ]
    `, agendaPageUid, dailyAgendaTag);
}

var kanbanUid = findBlock[0][0]["uid"];
console.log(kanbanUid);

//Find the block of the time on the agenda the user entered
var findBlock = window.roamAlphaAPI.q(`
[
    :find (pull ?block-found [:block/uid])
    :in $ ?kanban-uid ?time-pos
    :where 	[?kanban-found :block/uid ?kanban-uid]
            [?kanban-found :block/children ?block-found]
            [?block-found :block/order ?time-pos]
]
`, kanbanUid, timeBlockPos);

var timeUid = findBlock[0][0]["uid"];
console.log(timeUid);

//Add the block reference to the time on agenda
var blockString = curBlockRef;
var rootBlockUid = await roam42.common.createBlock(timeUid, -1, blockString);

return '';
