document.getElementById("assignments-tab-btn").onclick = function() {showTab(1)};
document.getElementById("notifications-tab-btn").onclick = function() {showTab(2)};
document.getElementById("grade-calc-tab-btn").onclick = function() {showTab(3)};
document.getElementById("access-token-tab-btn").onclick = function() {showTab(4)};


function showTab(tabNum) {
    console.log(tabNum);
    for (var i = 1; i <= 4; i++) {
        if (i == tabNum)
            document.getElementById("tab" + i).style.display = "block";
        else
            document.getElementById("tab" + i).style.display = "none";
    }
}
