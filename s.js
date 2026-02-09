function addNumbers () {
    let num1= parseFloat(document.getElementById("number1").value);
    let num2= parseFloat(document.getElementById("number2").value);
    document.getElementById("result1").innerHTML= "Result:" + (num1 + num2); 
}

function subNumbers () {
    let num3= parseFloat(document.getElementById("number3").value);
    let num4= parseFloat(document.getElementById("number4").value);
    document.getElementById("result2").innerHTML= "Result:" + (num3 - num4);
}

function multiNumbers () {
    let num5 = parseFloat(document.getElementById("number5").value);
    let num6 = parseFloat(document.getElementById("number6").value); 
    document.getElementById("result3").innerHTML = "Result:" + (num5 * num6);
}

function divNumbers () {
    let num7= parseFloat(document.getElementById("number7").value);
    let num8 = parseFloat(document.getElementById("number8").value);
    if (num8 === 0) {
        document.getElementById("result4").innerHTML = "Error: cannot divide by 0";

    } else { 
        document.getElementById("result4").innerHTML = "Result:" + (num7 / num8);
    }
}
