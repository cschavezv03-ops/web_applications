function saludar(){
    const nombre = prompt("Como te llamas");
    const mensaje = `Hola, ${nombre} Bienvenido al laboratorio de JS`;
    document.getElementById("resultado").innerText=mensaje;
    //bdd
}

function sumar(){
    const n1 = parseFloat(document.getElementById("num1").value);
    const n2 = parseFloat(document.getElementById("num2").value);
    const suma = n1 + n2;
    document.getElementById("resultadoSuma").innerText = `Resultado: ${suma}`;
}

function tabla(){
    const n = parseFloat(document.getElementById("num").value);
    const array = new Array(10);
    for (let i = 0; i < array.length; i++) {
        array[i] = n * (i+1);
    }
    document.getElementById("tablaMulti").innerText = `Tabla:\n ${array.join("\n")}`;
}