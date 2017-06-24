var CALC_CONTINUE = true;

function getOutput() {
    return $("#output").text();
}

function setOutput(value) {
    $("#output").text(value);
    $("#history").text(value);
}

function isDigit(c) {
    return c >= '0' && c <= '9';
}

function isDot(c) {
    return c === '.';
}


function isPercent(c) {
    return c === '%';
}

function isZero(c) {
    return c === '0';
}

function isOp(c) {
    return c === '/' || c === '*' || c === '-' || c === '+';
}

function getLastNumber(output) {
    var lastNumber = "";
    var i = output.length - 1;
    while (i >= 0 && (isDigit(output[i]))) {
        lastNumber = output[i] + lastNumber;
        i--;
    }

    // continue if number is float
    if (i >= 0 && isDot(output[i])) {
        lastNumber = output[i] + lastNumber;
        i--;
    }
    while (i >= 0 && (isDigit(output[i]))) {
        lastNumber = output[i] + lastNumber;
        i--;
    }
    return lastNumber;
}

function enterMathSymbol(output, that) {
    if (!CALC_CONTINUE) {
        CALC_CONTINUE = true;
    }
    var newValue;
    var lastChar = output.slice(-1);

    var mathSymbol = $(that).attr("op");
    if (isDigit(lastChar) || isPercent(lastChar)) {
        newValue = output + mathSymbol;
    } else if (isOp(lastChar)) {
        newValue = output.slice(0, -1) + mathSymbol;
    } else {
        newValue = output;
    }

    return newValue;
}

function enterNumber(output, that) {
    if (!CALC_CONTINUE) {
        output = allClear();
        CALC_CONTINUE = true;
    }
    var newValue;
    var lastChar = output.slice(-1);
    var number = $(that).text();
    if (isZero(output)) {
        newValue = number;
    } else if (isPercent(lastChar)) {
        newValue = output;
    } else if (isZero(lastChar) && isZero(number) && isZero(getLastNumber(output))) {
        newValue = output;
    } else {
        newValue = output + number;
    }

    return newValue;
}

function changeSign(output) {
    if (!CALC_CONTINUE) {
        CALC_CONTINUE = true;
    }
    var newValue;
    var length = output.length;
    var lastChar = output.slice(-1);
    var lastNumber = getLastNumber(output);
    var lastNumberIndex = output.lastIndexOf(lastNumber);
    var prefix = output[lastNumberIndex - 1];
    var preprefix = output[lastNumberIndex - 2];

    if (!isDigit(lastChar) || lastNumber === "0") {
        newValue = output;
    } else if (prefix === "-") {
        if (isOp(preprefix) || !preprefix) {
            newValue = output.slice(0, lastNumberIndex - 1) + lastNumber;
        } else if (isDigit(preprefix) || isPercent(preprefix)) {
            newValue = output.slice(0, lastNumberIndex - 1) + "+" + lastNumber;
        }
    } else if (prefix === "+") {
        newValue = output.slice(0, lastNumberIndex - 1) + "-" + lastNumber;
    } else {
        newValue = output.slice(0, lastNumberIndex) + "-" + lastNumber;
    }

    return newValue;
}

function enterDot(output) {
    if (!CALC_CONTINUE) {
        CALC_CONTINUE = true;
    }
    var newValue;
    var lastChar = output.slice(-1);
    var lastNumber = getLastNumber(output);
    if (isDigit(lastChar) && lastNumber.length > 0 && lastNumber.indexOf(".") === -1) {
        newValue = output + ".";
    } else {
        newValue = output;
    }
    return newValue;
}

function enterPercent(output) {
    if (!CALC_CONTINUE) {
        CALC_CONTINUE = true;
    }
    var newValue;

    var lastChar = output.slice(-1);
    if (isDigit(lastChar)) {
        newValue = output + "%";
    } else {
        newValue = output;
    }
    return newValue;
}

function enterEquals(output) {
    var lastChar = output.slice(-1);
    if (isOp(lastChar)) {
        return output;
    }

    var percent = output.indexOf("%");
    var i, op;
    while (percent != -1) {
        i = percent;
        while (i >= 0 && !isOp(output[i])) {
            i--;
        }
        // For division it replaces % with *100 and for other /100.
        op = output[i] === "/" ? "*100" : "/100";
        output = output.replace("%", op);
        percent = output.indexOf("%");
    }

    var result;
    try {
        result = eval(output);
    } catch (err) {
        result = allClear();
    }

    CALC_CONTINUE = false;
    return result;
}

function clearEntry(output) {
    output = output.length <= 1 ? "0" : output.slice(0, -1);
    output = isOp(output) ? "0" : output;
    return output;
}

function allClear() {
    CALC_CONTINUE = true;
    return "0";
}

function valid(output) {
    var result = true;
    var validSymbols = "0123456789%.*/-+";
    for (var i = 0; i < output.length; i++) {
        if (validSymbols.indexOf(output[i]) === -1) {
            result = false;
            break;
        }
    }

    return result;
}


function calcEvent(callback) {
    return function () {
        var that = this;
        var output = getOutput();
        output = valid(output) ? output : allClear();

        var newValue = callback(output, that);
        setOutput(newValue);
    }

}

$(document).ready(function () {

    $("#calc-equals").on("click", calcEvent(enterEquals));
    $("#calc-sign-op").on("click", calcEvent(changeSign));

    $("#calc-dot").on("click", calcEvent(enterDot));
    $("#cal-percent").on("click", calcEvent(enterPercent));

    $("#ac").on("click", calcEvent(allClear));
    $("#ce").on("click", calcEvent(clearEntry));

    $(".calc-math").on("click", calcEvent(enterMathSymbol));
    $(".calc-number").on("click", calcEvent(enterNumber));

});


// divide - has special meaning for %. E.g. 1/2% = 50, but 1-2 = 0.98. For division it replaces % with *100 and for other /100.
// all ops can be changed
// but -/+ change only itself
// zero can be the first digit only if then is dot, else zero is replaced by other characters.
// AC - All clear -> clear all
// CE - Clear Entry -> clear prev entry (number or operation)
