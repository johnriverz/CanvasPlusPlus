
document.getElementById("notifications-tab-btn").onclick = function() {showTab(2)};


function showTab(tabNum) {
    console.log(tabNum);
    for (var i = 1; i <= 3; i++) {
        if (i == tabNum)
            document.getElementById("tab" + i).style.display = "block";
        else
            document.getElementById("tab" + i).style.display = "none";
    }
}
