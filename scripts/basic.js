var savedGraphs = [];
var savedGraphColor = undefined;

//When the page first loads.
$(document).ready( function() {
    for (var i = 0; i < 10; i++) {
        savedGraphs.push(undefined);
    }
    savedGraphColor = "#524636";
});

//Runs when the user drags from SAVE GRAPH onto a space on the right
function saveGraph(saveNum, graphNum, swap) {
    if (graphNum == 1 && graph1 == undefined)
        return;
    else if (graphNum == 2 && graph2 == undefined)
        return;

    var destination = saveNum;
    var g = savedGraphs[saveNum - 1];
    if (g != null)
        g.destroy();
    savedGraphs[saveNum - 1] = undefined;
    var tip = document.getElementById("tip" + saveNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";

    var tempGraph = undefined;
    if (graphNum == 1)
        tempGraph = graph1;
    else
        tempGraph = graph2;

    var labelsArr = tempGraph.config.data.labels;
    var dataArr = tempGraph.config.data.datasets[0].data;
    var hoverText = tempGraph.description;
    var db = tempGraph.DB;
    var x = tempGraph.X;
    var y = tempGraph.Y;
    var lowDate = tempGraph.lowDate;
    var highDate = tempGraph.highDate;
    var minDate = tempGraph.minDate;
    var maxDate = tempGraph.maxDate;
    var graph_type = tempGraph.type;
    var color = tempGraph.color;

    //check if current graph is already saved
    for (var i = 0; i < savedGraphs.length; i++) {
        if (savedGraphs[i] != undefined && hoverText == savedGraphs[i].description) {
            if (!swap) {
                alert("Graph " + graphNum + " is already saved at box #" + (i + 1));
            }
            document.getElementById("exit" + saveNum).style.visibility = "hidden";
            document.getElementById("swap" + saveNum).style.visibility = "hidden";
            return;
        }
    }

    var canvas = document.getElementById("saved" + destination);
    canvas = canvas.getContext("2d");
    var g = new Chart(canvas, {
        type: graph_type,
        options: {
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }],
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            animation: {
                duration: 0
            }
        },
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: savedGraphColor,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        }
    });
    g.description = hoverText;
    g.DB = db;
    g.X = x;
    g.Y = y;
    g.lowDate = lowDate;
    g.highDate = highDate;
    g.minDate = minDate;
    g.maxDate = maxDate;
    g.type = graph_type;
    g.color = color;
    savedGraphs[destination - 1] = g;

    var tip = document.getElementById("tip" + destination);
    tip.style.display = "block";
    tip.style.backgroundColor = "#0000005c";
    hoverText = hoverText.replace(/\n( *)/g, function (match, p1) {
        return '<br>' + '&nbsp;'.repeat(p1.length);
    });
    tip.innerHTML = hoverText;
    tip.style.visibility = "hidden";

    document.getElementById("exit" + destination).style.visibility = "visible";
    document.getElementById("swap" + destination).style.visibility = "visible";
}

//Transfers a saved graph to one of the main graphs,
//Saves the main graph in the saved spot
function swap(savedNum, graphNum) {
    var savedGraph = savedGraphs[savedNum - 1];
    var savedDB = savedGraph.DB;
    var savedX = savedGraph.X;
    var savedY = savedGraph.Y;
    var savedLowDate = savedGraph.lowDate;
    var savedHighDate = savedGraph.highDate;
    var savedMinDate = savedGraph.minDate;
    var savedMaxDate = savedGraph.maxDate;
    var savedType = savedGraph.type;
    var savedColor = savedGraph.color;

    saveGraph(savedNum, graphNum, false);
    
    //update menus on the left side and graph data
    setOptions(savedDB, savedY, savedX, savedType, savedLowDate, savedHighDate, savedMinDate, savedMaxDate, graphNum, savedColor, true);
}

//Relocates a saved graph to another spot
//Swaps if both saved spots have graphs
function relocate(prevSave, nextSave) {
    if (prevSave == nextSave) return;

    if (savedGraphs[nextSave - 1] == undefined || savedGraphs[nextSave - 1] == null) {  //move graph
        var prevSavedGraph = savedGraphs[prevSave - 1];
        var prevLabelsArr = prevSavedGraph.config.data.labels;
        var prevDataArr = prevSavedGraph.config.data.datasets[0].data;
        var prevHoverText = prevSavedGraph.description;
        var prevDB = prevSavedGraph.DB;
        var prevX = prevSavedGraph.X;
        var prevY = prevSavedGraph.Y;
        var prevLowDate = prevSavedGraph.lowDate;
        var prevHighDate = prevSavedGraph.highDate;
        var prevMinDate = prevSavedGraph.minDate;
        var prevMaxDate = prevSavedGraph.maxDate;
        var prevGraphType = prevSavedGraph.type;
        var prevColor = prevSavedGraph.color;

        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

        var canvas = document.getElementById("saved" + nextSave);
        canvas = canvas.getContext("2d");
        var g = new Chart(canvas, {
            type: prevGraphType,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: prevLabelsArr,
                datasets: [{
                    data: prevDataArr,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g.description = prevHoverText;
        g.DB = prevDB;
        g.X = prevX;
        g.Y = prevY;
        g.lowDate = prevLowDate;
        g.highDate = prevHighDate;
        g.minDate = prevMinDate;
        g.maxDate = prevMaxDate;
        g.type = prevGraphType;
        g.color = prevColor;
        savedGraphs[nextSave - 1] = g;

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        prevHoverText = prevHoverText.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = prevHoverText;
        tip.style.visibility = "hidden";

        document.getElementById("exit" + nextSave).style.visibility = "visible";
        document.getElementById("swap" + nextSave).style.visibility = "visible";
    }
    else {  //swap saved graphs, as opposed to just moving one
        var savedGraph1 = savedGraphs[prevSave - 1];
        var labelsArr1 = savedGraph1.config.data.labels;
        var dataArr1 = savedGraph1.config.data.datasets[0].data;
        var hoverText1 = savedGraph1.description;
        var db1 = savedGraph1.DB;
        var x1 = savedGraph1.X;
        var y1 = savedGraph1.Y;
        var lowDate1 = savedGraph1.lowDate;
        var highDate1 = savedGraph1.highDate;
        var minDate1 = savedGraph1.minDate;
        var maxDate1 = savedGraph1.maxDate;
        var graphType1 = savedGraph1.type;
        var color1 = savedGraph1.color;

        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

        var savedGraph2 = savedGraphs[nextSave - 1];
        var labelsArr2 = savedGraph2.config.data.labels;
        var dataArr2 = savedGraph2.config.data.datasets[0].data;
        var hoverText2 = savedGraph2.description;
        var db2 = savedGraph2.DB;
        var x2 = savedGraph2.X;
        var y2 = savedGraph2.Y;
        var lowDate2 = savedGraph2.lowDate;
        var highDate2 = savedGraph2.highDate;
        var minDate2 = savedGraph2.minDate;
        var maxDate2 = savedGraph2.maxDate;
        var graphType2 = savedGraph2.type;
        var color2 = savedGraph2.color;

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(nextSave);

        var canvas1 = document.getElementById("saved" + nextSave);
        canvas1 = canvas1.getContext("2d");
        var g1 = new Chart(canvas1, {
            type: graphType1,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: labelsArr1,
                datasets: [{
                    data: dataArr1,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g1.description = hoverText1;
        g1.DB = db1;
        g1.X = x1;
        g1.Y = y1;
        g1.lowDate = lowDate1;
        g1.highDate = highDate1;
        g1.minDate = minDate1;
        g1.maxDate = maxDate1;
        g1.type = graphType1;
        g1.color = color1;
        savedGraphs[nextSave - 1] = g1;

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText1 = hoverText1.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText1;
        tip.style.visibility = "hidden";

        document.getElementById("exit" + nextSave).style.visibility = "visible";
        document.getElementById("swap" + nextSave).style.visibility = "visible";

        var canvas2 = document.getElementById("saved" + prevSave);
        canvas2 = canvas2.getContext("2d");
        var g2 = new Chart(canvas2, {
            type: graphType2,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: labelsArr2,
                datasets: [{
                    data: dataArr2,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g2.description = hoverText2;
        g2.DB = db2;
        g2.X = x2;
        g2.Y = y2;
        g2.lowDate = lowDate2;
        g2.highDate = highDate2;
        g2.minDate = minDate2;
        g2.maxDate = maxDate2;
        g2.type = graphType2;
        g2.color = color2;
        savedGraphs[prevSave - 1] = g2;

        tip = document.getElementById("tip" + prevSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText2 = hoverText2.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText2;
        tip.style.visibility = "hidden";

        document.getElementById("exit" + prevSave).style.visibility = "visible";
        document.getElementById("swap" + prevSave).style.visibility = "visible";
    }
}

//Removes a graph from the saved section
function deleteGraph(savedNum) {
    var g = savedGraphs[savedNum - 1];
    g.destroy();
    savedGraphs[savedNum - 1] = undefined;

    var tip = document.getElementById("tip" + savedNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";
    tip.style.visibility = "hidden";

    document.getElementById("exit" + savedNum).style.visibility = "hidden";
    document.getElementById("swap" + savedNum).style.visibility = "hidden";
}

//Shows tooltip over saved graph
function showToolTip(savedNum) {
    var tip = document.getElementById("tip" + savedNum);
    if (tip.style.visibility != "visible")
        tip.style.visibility = "visible";
    else
        tip.style.visibility = "hidden";
}

//Runs when dragging to save a graph into a saved region
function drag(ev, graph) {
    ev.dataTransfer.setData("text", graph);
}

//Runs when dropping a graph over a saved region
function drop(ev, destination) {
    ev.preventDefault();
    
    var data = ev.dataTransfer.getData("text");
    if (data.startsWith("graph")) {
        if (destination.startsWith("graph")) {
            //do nothing
        }
        else if (destination.startsWith("saved")) {
            var graphNum = data.substring(5);
            var saveNum = destination.substring(5);
            if (savedGraphs[saveNum - 1] == undefined || savedGraphs[saveNum - 1] == null) {
                saveGraph(saveNum, graphNum, false)
            }
            else {
                swap(saveNum, graphNum);
            }
        }
    }
    else if (data.startsWith("saved")) {
        if (destination.startsWith("graph")) {
            var graphNum = destination.substring(5);
            var saveNum = data.substring(5);
            swap(saveNum, graphNum);
            if ((graphNum == 1 && graph1 == undefined) || (graphNum == 2 && graph2 == undefined))
                deleteGraph(saveNum);
        }
        else if (destination.startsWith("saved")) {
            var prevSave = data.substring(5);
            var nextSave = destination.substring(5);
            relocate(prevSave, nextSave);
        }
    }
}

//Allows drops to occur
function allowDrop(ev) {
    ev.preventDefault();
}

//Changes site color theme
function changeColorTheme(element) {
    if (element.checked) {  //dark
        Chart.defaults.global.defaultFontColor = "white";
        //redraw graphs 1 and 2
        regraph(1);
        regraph(2);

        savedGraphColor = "white";
        for (var i = 1; i <= 10; i++) {
            resave(i);
        }

        var x = document.getElementsByClassName("logo")[0];
        x.src = "img/HistoryInDatalogodark.png";

        x = document.getElementsByTagName("BODY")[0];
        x.style.backgroundColor = "#413f3d";

        x = document.getElementsByClassName("col1")[0];
        x.style.color = "white";

        x = document.getElementsByClassName("row")[0];
        x.style.backgroundColor = "#263859";
        x = document.getElementsByClassName("row")[1];
        x.style.backgroundColor = "#263859";

        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "black";
            x[y].style.color = "white";
        }

        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#525252";
        x.style.color = "white";

        x = document.getElementsByClassName("col3")[0];
        x.style.backgroundColor = "#160f30";
        x.style.color = "white";

        x = document.getElementsByClassName("tile");
        for (var y = 0; y < x.length; y++) {
            x[y].style.border = "1px solid white";
        }

        x = document.getElementsByClassName("exit");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }

        x = document.getElementsByClassName("swap");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }

        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "#555555";
        x.style.color = "white";

        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }
    }
    else {  //light
        Chart.defaults.global.defaultFontColor = "#524636";
        //redraw graphs 1 and 2
        regraph(1);
        regraph(2);

        savedGraphColor = "#524636";
        for (var i = 1; i <= 10; i++) {
            resave(i);
        }

        var x = document.getElementsByClassName("logo")[0];
        x.src = "img/HistoryInDatalogolight.png";

        x = document.getElementsByTagName("BODY")[0];
        x.style.backgroundColor = "#c2edce";

        x = document.getElementsByClassName("col1")[0];
        x.style.color = "#524636";

        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "white";
            x[y].style.color = "black";
        }

        x = document.getElementsByClassName("row")[0];
        x.style.backgroundColor = "#92bbbd";
        x = document.getElementsByClassName("row")[1];
        x.style.backgroundColor = "#92bbbd";

        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#f6f6f2";
        x.style.color = "#524636";

        x = document.getElementsByClassName("col3")[0];
        x.style.backgroundColor = "#66aedb";
        x.style.color = "524636";

        x = document.getElementsByClassName("tile");
        for (var y = 0; y < x.length; y++) {
            x[y].style.border= "1px solid #524636";
        }

        x = document.getElementsByClassName("exit");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "#524636";
        }

        x = document.getElementsByClassName("swap");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "#524636";
        }

        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "white";
        x.style.color = "black";

        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "black";
        }
    }
}

//redraws a graph in the saved region
function resave(saveNum) {
    var savedGraph = savedGraphs[saveNum - 1];
    if (savedGraph == undefined)
        return;
    else if (savedGraph != null)
        savedGraph.destroy();
    savedGraph[saveNum - 1] = undefined;
    
    var labelsArr = savedGraph.config.data.labels;
    var dataArr = savedGraph.config.data.datasets[0].data;
    var hoverText = savedGraph.description;
    var db = savedGraph.DB;
    var x = savedGraph.X;
    var y = savedGraph.Y;
    var lowDate = savedGraph.lowDate;
    var highDate = savedGraph.highDate;
    var minDate = savedGraph.minDate;
    var maxDate = savedGraph.maxDate;
    var graph_type = savedGraph.type;
    var color = savedGraph.color;

    var canvas = document.getElementById("saved" + saveNum);
    canvas = canvas.getContext("2d");
    var g = new Chart(canvas, {
        type: graph_type,
        options: {
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }],
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            animation: {
                duration: 0
            }
        },
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: savedGraphColor,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        }
    });
    g.description = hoverText;
    g.DB = db;
    g.X = x;
    g.Y = y;
    g.lowDate = lowDate;
    g.highDate = highDate;
    g.minDate = minDate;
    g.maxDate = maxDate;
    g.type = graph_type;
    g.color = color;
    savedGraphs[saveNum - 1] = g;

    document.getElementById("tip" + saveNum).style.visibility = "hidden";

    document.getElementById("exit" + saveNum).style.visibility = "visible";
    document.getElementById("swap" + saveNum).style.visibility = "visible";
}

function exportGraph(n) {
    var tempGraph = undefined;
    if (n == 1)
        tempGraph = graph1;
    else if (n == 2)
        tempGraph = graph2;

    sessionStorage.setItem("labelsArr", tempGraph.config.data.labels);
    sessionStorage.setItem("dataArr", tempGraph.config.data.datasets[0].data);
    sessionStorage.setItem("db", tempGraph.DB);
    sessionStorage.setItem("x", tempGraph.X);
    sessionStorage.setItem("y", tempGraph.Y);
    sessionStorage.setItem("lowDate", tempGraph.lowDate);
    sessionStorage.setItem("highDate", tempGraph.highDate);
    sessionStorage.setItem("minDate", tempGraph.minDate);
    sessionStorage.setItem("maxDate", tempGraph.maxDate);
    sessionStorage.setItem("graph_type", tempGraph.type);
    sessionStorage.setItem("color", tempGraph.color);

    window.open("/export.html", "_blank");
}