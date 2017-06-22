$(document).ready(function () {

    $(".calc-math").on("click", function () {
        console.log($(this).attr("op"));
    });

    $(".calc-number").on("click", function () {
        console.log(parseInt($(this).text()));
    });
});

// divide - has special meaning for %. E.g. 1/2% = 50, but 1-2 = 0.98. Sor division it replaces % with *100 and for other /100.
// all ops can be changed
// but -/+ change only itself
// zero can be the first digit only if then is dot, else zero is replaced by other characters.
