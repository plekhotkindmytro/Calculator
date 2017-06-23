function enterMathSymbol() {
    console.log($(this).attr("op"));
}

function enterNumber() {
    console.log(parseInt($(this).text()));
}

function updateCalcState(newValue, update) {
    var output = $("#output").text();
    if (output[output.length - 1] === "")
        update(newValue);
}

$(document).ready(function () {

    $(".calc-math").on("click", enterMathSymbol);
    $(".calc-number").on("click", enterNumber);
    $(".calc-number").on("click", enterNumber);


});

// divide - has special meaning for %. E.g. 1/2% = 50, but 1-2 = 0.98. Sor division it replaces % with *100 and for other /100.
// all ops can be changed
// but -/+ change only itself
// zero can be the first digit only if then is dot, else zero is replaced by other characters.
// AC - All clear -> clear all
// CE - Clear Entry -> clear prev entry (number or operation)
