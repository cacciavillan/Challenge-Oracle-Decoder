let state
let copiar

function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reinicia la altura a auto para recalcularla a la altura actual
    textarea.style.height = textarea.scrollHeight + 'px'; // Actualiza la altura

    // Ajusta la altura del body si es necesario
    document.body.style.height = document.documentElement.scrollHeight + 'px';

}

// ENCRIPTADO

// Normalizamos el input string del usuario
function normalizeEntry(inputString) {

    let normalizedString = inputString
    .normalize('NFD')
    //.replace(/[\u0300-\u0302\u0308-\u030B\u0360-\u0362\u20D0-\u20D1\u20D8-\u20DB\u20E1]/g, "")
    .replace(/[\u0300-\u036f]/g, "") 
    .normalize('NFC') 
    .toLowerCase(); 

  return normalizedString;

  
}

// Contamos la posición de las "ñ" para volverlas a colocar al desencriptar
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

// Calculamos un checksum del input
function sumAscii(string) {
    let sum = 0;
    for (let i = 0; i < string.length; i++) {
        sum += string.charCodeAt(i);
    }
    return sum
}

// Encriptado del texto
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

// Secuencia de encriptado
function encryptionSequence() {
    // Está encapsulado en un try/catch para manejar los errores que puede generar la función inputString cuando no se ingresa un valor.
    try {
        let inputString = document.getElementById('textarea1').value;
        
        if (inputString === "") {
            corruptedMessage('empty')
            throw new Error('No se ha ingresado ningun string')
        }
        
        // Normaliza el texto quitando mayusculas y los acéntos.
        let normalizedText = normalizeEntry(inputString);

        // Crea un array con la posición de las "ñ" para volver a colocarlas al desencriptar.
        let eniesPosition = eniesCount(inputString);

        // Crea un checksum para aumentar la seguridad del mensaje.
        let sumaAscii = sumAscii(normalizedText);

        // Encripta el texto normalizado
        let encryptedText = encrypted(normalizedText);
        
        // Creamos la variable "copiar" para que el resultado de la función esté disponible para el boton "copiar"
        copiar = `Checksum=${sumaAscii}|${eniesPosition}|Mensaje Encriptado --- ${encryptedText} --- FIN MENSAJE ENCRIPTADO`;

        // Actualizamos el textarea de salida solo con el texto encriptado, sin el checksum y la posición de las "ñ".
        outText.value = encryptedText;

        // Mostramos el textarea de salida, ocultamos los párrafos y actualizamos la altura del textarea
        setActive();
        autoResize(outText);
        state = "encrypt";
        let textarea = document.getElementById('textarea1');
        textarea.value = '';
        textarea.style.height = '';

        return copiar;

    } catch (error) {
        console.error(error.message);
        return null

    }
}
// DESENCRIPTADO

// Desencripta el input después de haber sido limpiado (Sin caracteres especiales)
function decrypt(str) {
    // Declaro la const wordsArray y le asigno el resultado de split sobre el string.
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

// Calcula un checksum
function checksum(string) {
    let suma = 0;
    for (let i = 0; i < string.length; i++) {
        suma += string.charCodeAt(i);
    }
    return suma
}

// Restaura las "ñ"
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

// Normalizamos el texto a lowercase y sin acentos.
function cleaningString(string) {

    // Nos aseguramos de que el string tenga datos válidos
    let cleanTextMatch = string.match(/--- (.*?) ---/);
    let checksumMatch = string.match(/Checksum=(.*?)\|/);
    let eniesMatch = string.match(/\|(.+)\|/);

    if (!cleanTextMatch || !checksumMatch /*|| !eniesMatch*/) {
        // Manejar el caso en el que no se encuentran coincidencias
        return null;
    };

    // Extraemos el texto normalizado, el checksum y el array con las posiciones de las "ñ"
    let cleanText = string.match(/--- (.*?) ---/);
    let checksum = string.match(/Checksum=(.*?)\|/);
    let enies = string.match(/\|(.+)\|/)?.[1]?.split(",").map(Number);

    return {cleanText: cleanText[1], checksum: checksum[1], enies
    };
}


// Si el input no es el esperado muestra mensajes de alerta.
function corruptedMessage(state) {
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

// Secuencia de desencriptación.
function decryptSequence() {
    try {
        let string = document.getElementById('textarea1').value;

        if (string === "") {
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

        copiar = decryptedCleanString

        outText.value = decryptedCleanString;
        setActive()
        autoResize(outText);
        state = "decrypt";
        let textarea = document.getElementById('textarea1');
        textarea.value = '';
        textarea.style.height = '';

        return decryptedCleanString;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Oculta los parrafos y muestra el textarea cuando hay un output
function setActive() {
    let standBy = document.querySelector('.standBy');
    let active = document.querySelector('.active');

    if (standBy) {
        standBy.style.visibility = 'hidden'
    }
    if (active) {
        active.style.visibility = 'visible'
    }

}

// Función copiar para el boton.
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
        
        if (state == "encrypt") {
        alert('Texto copiado al portapapeles =>\n' + copiar + '\n\nPARA DESENCRIPTAR PEGAR EL TEXTO COPLETO');
        } else {
            alert('Texto copiado al portapapeles =>\n' + copiar)
        }
    });
});