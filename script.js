 const addNumbers = () => {
        let num1 = document.getElementById("number1").value;
        let num2 = document.getElementById("number2").value;
        let sum = Number(num1)+ Number(num2);
        document.getElementById("result").innerHTML = sum;
    }

 const subNumbers = () => {
        let num1 = document.getElementById("number3").value;
        let num2 = document.getElementById("number4").value;
        let sum = Number(num1)- Number(num2);
        document.getElementById("result2").innerHTML = sum;
    }