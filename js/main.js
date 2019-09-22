// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

// if we want to select by a another select box, we can add it here
var selectBoxIds = ['area', 'order_type'];

createVisualization(deliveryData, feedbackData);
dataManipulation(deliveryData, selectBoxIds);

function createVisualization(deliveryInfo, feedbackInfo) {

    /* ************************************************************
     *
     * ADD YOUR CODE HERE
     * (accordingly to the instructions in the HW2 assignment)
     * 
     * 1) Filter data
     * 2) Display key figures
     * 3) Display bar chart
     * 4) React to user input and start with (1)
     *
     * ************************************************************/
    // store the datasets in local variables
    var dInfo = deliveryInfo;
    var fInfo = feedbackInfo;

    // list to modify feedbackInformation
    // so that it interects with delivery info
    var feedbackInDeliveryList = [];

    // using deliveryData
    var deliveryList = [];
    var totalDeliveries = {
        id: 'totalDeliveries',
        value: dInfo.length,
        message: 'total deliveries.'
    };
    var totalPizzaCount = {
        id: 'totalPizzaCount',
        value: 0,
        message: 'total pizzas delivered.'
    };
    var totalCash = {
        id: 'totalCash',
        value: 0,
        message: 'total dollars in revenue.'
    };
    var totalDeliveryTime = 0;

    // get all variables pertaining to delivery
    $.each(dInfo, function() {

        // if we find a matching feedback, add to the feedbackList
        var found = fInfo.filter(el => el.delivery_id == this.delivery_id);
        if (found.length != 0) {
            feedbackInDeliveryList = feedbackInDeliveryList.concat(found);
        }

        // count pizzas, delivery time, cash.
        totalPizzaCount.value += this.count;
        totalDeliveryTime += this.delivery_time;
        totalCash.value += this.price;
    });

    // round the total cash to nearest dollar
    totalCash.value = Math.round(totalCash.value)

    // round the average delivery time to the nearest integer
    var avgDeliveryTime = {
        id: 'avgDeliveryTime',
        value: Math.round(totalDeliveryTime / totalDeliveries.value),
        message: 'minutes average delivery time.'
    };

    // fill the delivery stats list
    deliveryList.push(totalDeliveries, totalPizzaCount, avgDeliveryTime, totalCash);

    // update feedbackData to match deliveryData
    fInfo = feedbackInDeliveryList;

    // using feedbackData
    var feedbackList = []
    var totalFeedback = {
        id: 'totalFeedback',
        value: fInfo.length,
        message: 'customers gave us feedback.'
    };
    var totalLowFb = {
        id: 'totalLowFeedback',
        value: dataFilter(fInfo, "low", "quality").length,
        message: 'customers HATED our pizza.'
    };
    var totalMedFb = {
        id: 'totalMedFeedback',
        value: dataFilter(fInfo, "medium", "quality").length,
        message: 'customers LIKED our pizza.'
    };
    var totalHighFb = {
        id: 'totalHighFeedback',
        value: dataFilter(fInfo, "high", "quality").length,
        message: 'customers LOVED our pizza.'
    };

    // fill the feedback stats list
    feedbackList.push(totalFeedback, totalHighFb, totalMedFb, totalLowFb);

    // clear the delivery stats
    clearInnerHTML('deliveryStats');
    clearInnerHTML('feedbackStats');

    // display the stats
    displayStats("deliveryStats", deliveryList);
    displayStats("feedbackStats", feedbackList);
    drawTable("feedbackTable", fInfo, dInfo);
}

/*** helpers for createVisualization ***/
function clearInnerHTML(statsId) {
    document.getElementById(statsId).innerHTML = "";
}

function addToHTML(statsId, stat, message = 'some statistic') {
    document.getElementById(statsId).innerHTML +=
        "<div class='col-md-3 text-center mb-5'><div class='statnumber'><h2>" +
        stat + "</h2><p>" + message + "</p></div></div>";
}

function displayStats(statsId, statsList) {
    for (var i = 0; i < statsList.length; i++) {
        addToHTML(statsId, statsList[i].value, statsList[i].message);
    }
}
/*** end helpers ***/

/*
dataMainupulation takes in a dataset and a list of selector ids
this way we can keep adding selectors and filtering the data
*/
function dataManipulation(dataset, selectorIdList) {
    var filtered = dataset;

    for (var i = 0; i < selectorIdList.length; i++) {
        var selectorBox = document.getElementById(selectorIdList[i]);
        var selectedValue = selectorBox.options[selectorBox.selectedIndex].value;

        filtered = dataFilter(filtered, selectedValue, selectorIdList[i]);
    }

    createVisualization(filtered, feedbackData);
    renderBarChart(filtered);
}

function dataFilter(dataset, filterOption, filterType) {
    if (filterOption == 'All') {
        return dataset;
    } else {
        return dataset.filter(
            element => element[filterType] == filterOption);
    }
}

/* functions to deal with the table */
function drawTable(tableId, feedbackData, deliveryData) {
    tableBody = document.getElementById(tableId);
    innerHTMLstring = "";

    for (var i = 0; i < feedbackData.length; i++) {
        fbDataElement = feedbackData[i];
        delivery_id = fbDataElement.delivery_id;
        dDataElement = deliveryData.filter(el => el.delivery_id == delivery_id)[0];
        innerHTMLstring += "<tr>" +
            "<td>" + delivery_id + "</td>" +
            "<td>" + dDataElement.area + "</td>" +
            "<td>" + dDataElement.date + "</td>" +
            "<td>" + dDataElement.driver + "</td>" +
            "<td>" + dDataElement.count + "</td>" +
            "<td>" + dDataElement.delivery_time + "</td>" +
            "<td>" + fbDataElement.punctuality + "</td>" +
            "<td>" + fbDataElement.quality + "</td>" +
            "<td>" + fbDataElement.wrong_pizza + "</td>" +
            "</tr>"
    }

    tableBody.innerHTML = innerHTMLstring;
}