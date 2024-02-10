// ENCRIPTADO


function normalizeEntry(inputString) {

    let normalizedString = inputString
    .normalize('NFD')
    //.replace(/[\u0300-\u0302\u0308-\u030B\u0360-\u0362\u20D0-\u20D1\u20D8-\u20DB\u20E1]/g, "")
    .replace(/[\u0300-\u036f]/g, "") 
    .normalize('NFC') 
    .toLowerCase(); 

  return normalizedString;

  
}

function eniesCount(text) {
    let inputText = text.toLowerCase();
    let positions = [];
    for (let i = 0; i < text.length; i++) {
        if (inputText[i] === "ñ") {
            positions.push(i);
        }
    }
    return positions;
}

function sumAscii(string) {
    let sum = 0;
    for (let i = 0; i < string.length; i++) {
        sum += string.charCodeAt(i);
    }
    return sum
}

function encrypted(str) {
    // Declaro la cont wordsArray y le asigno el resultado de split sobre str
    const wordsArray=str.split("");
    
    const encryptedArray = wordsArray.map(element => {
        
        if (element === "a") {
            return "ai";
        } else if (element === "e") {
            return "enter"
        } else if (element === "i") {
            return "imes"
        } else if (element === "o") {
            return "ober"
        } else if (element === "u") {
            return "ufat"
        } else {
            return element
        }

      });
    
    const resultString = encryptedArray.join("");
    
    return resultString;
  }

let copiar

function encryptionSequence() {
    console.log('function called')
    try {
        let inputString = document.getElementById('textarea1').value;
        console.log(inputString)
        
        if (inputString === "") {
            corruptedMessage('empty')
            throw new Error('No se ha ingresado ningun string')
        }
        
        let normalizedText = normalizeEntry(inputString);
        console.log(normalizedText);

        let eniesPosition = eniesCount(inputString);
        console.log(eniesPosition)

        let sumaAscii = sumAscii(normalizedText);
        console.log(sumaAscii)

        let encryptedText = encrypted(normalizedText);
        console.log(encryptedText)

        copiar = `Checksum=${sumaAscii}|${eniesPosition}|Mensaje Encriptado --- ${encryptedText} --- FIN MENSAJE ENCRIPTADO`;

        outText.value = encryptedText;
        setActive();
        autoResize(outText);

        return copiar;

    } catch (error) {
        console.error(error.message);
        return null

    }
}
// DESENCRIPTADO

function decrypt(str) {
    // Declaro la cont wordsArray y le asigno el resultado de split sobre str
    const wordsArray = str.split(" ");    

    const encryptedArray = wordsArray.map(element => {

        let result = element

        if (element.includes("ai")) {
            result = result.split("ai").join("a");
        } 
        if (element.includes("enter")) {
            result = result.split("enter").join("e")
        } 
        if (element.includes("imes")) {
            result = result.split("imes").join("i")
        } 
        if (element.includes("ober")) {
            result = result.split("ober").join("o")
        } 
        if (element.includes("ufat")) {
            result = result.split("ufat").join("u")
        } 

        return result

      });
    
    const resultString = encryptedArray.join(" ");
    
    return resultString;
}

function checksum(string) {
    let suma = 0;
    for (let i = 0; i < string.length; i++) {
        suma += string.charCodeAt(i);
    }
    console.log(suma)
    return suma
}


/* function extractChecksum(string) {
    
    let resultado = string.match(/@@(.*?)@@/);

    return resultado[1]
}*/

function enieRestore(string, indexs) {
    const newCharacter = "ñ"; // caracter que va a reemplazar el caracter especificado en index
    if (indexs === undefined) {
        return string
    } else {
        // Creamos un bucle for para iterar sobre el string segun indexs
        for (let i = 0; i < indexs.length; i++) {
            let index = indexs[i];
            
            // Verificamos si el index esta dentro de los limites del string
            if (index >=0 && index < string.length) {
                // 
                string = string.substring(0, index) + newCharacter + string.substring(index + 1)
            }
        } return string
    }
}

function cleaningString(string) {

    let cleanTextMatch = string.match(/--- (.*?) ---/);
    let checksumMatch = string.match(/Checksum=(.*?)\|/);
    let eniesMatch = string.match(/\|(.+)\|/);

    if (!cleanTextMatch || !checksumMatch /*|| !eniesMatch*/) {
        // Manejar el caso en el que no se encuentran coincidencias
        return null;
    }

    let cleanText = string.match(/--- (.*?) ---/);
    let checksum = string.match(/Checksum=(.*?)\|/);
    let enies = string.match(/\|(.+)\|/)?.[1]?.split(",").map(Number);

    return {cleanText: cleanText[1], checksum: checksum[1], enies
    }
}

function corruptedMessage(state) {
    console.log(state)
    let message = document.querySelector('.message');
    let outMessage = document.getElementById('outMessage');
    let standBy = document.querySelector('.standBy');
    let active = document.querySelector('.active');

    if (message) {
        message.style.color = 'red';
    }
    if (outMessage) {
        outMessage.innerText = state === 'corrupted' ? "Mensaje Corrupto" : "Ningún mensaje fue encontrado";
    }
    if (standBy) {
        standBy.style.visibility = 'visible';
    }
    if (active) {
        active.style.visibility = 'hidden';
    }

}

function decryptSequence() {
    try {
        let string = document.getElementById('textarea1').value;

        if (string === "") {
            console.log(string)
            corruptedMessage('empty');
            throw new Error('Cadena de texto vacía');
        }

        // Limpiamos el header, el footer del string encriptado y extraemos el checksum
        let cleanedText = cleaningString(string);

        if (cleanedText == null) {
            corruptedMessage('corrupted')
            throw new Error('El formato de mensaje encriptado no es válido.')
        }

        // Extraemos el texto limpio y desencriptamos
        let decryptedString = decrypt(cleanedText.cleanText);

        // Extraemos el checksum 
        let originalChecksum = cleanedText.checksum;

        // Generamos un nuevo checksum y comparamos con el incrustado
        let controlChecksum = checksum(decryptedString);

        if (controlChecksum == originalChecksum) {
            console.log("Los valores son iguales");
        } else {
            console.log("Los valores no son iguales");
        }

        // Volvemos a colocar las ñ, si las hubiese
        let decryptedCleanString = enieRestore(decryptedString, cleanedText.enies);

        outText.value = decryptedCleanString;
        setActive()
        autoResize(outText);

        return decryptedCleanString;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

function setActive() {
    console.log('setActive Called');
    let standBy = document.querySelector('.standBy');
    let active = document.querySelector('.active');

    if (standBy) {
        standBy.style.visibility = 'hidden'
    }
    if (active) {
        active.style.visibility = 'visible'
    }

}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('copiar').addEventListener('click', function() {


        // Crea un elemento de texto temporal

        var tempInput = document.createElement('input');
        tempInput.setAttribute('type', 'text');
        tempInput.setAttribute('value', copiar);

        // Añade el elemento al DOM
        document.body.appendChild(tempInput);

        // Selecciona y copia el contenido del elemento temporal
        tempInput.select();
        document.execCommand('copy');

        // Elimina el elemento temporal del DOM
        document.body.removeChild(tempInput);

        alert('Texto copiado al portapapeles =>\n' + copiar + '\n\nPARA DESENCRIPTAR PEGAR EL TEXTO COPLETO');
    });
});