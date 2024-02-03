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
    let cleanText = string.match(/--- (.*?) ---/);
    let checksum = string.match(/Checksum=(.*?)\|/);
    let enies = string.match(/\|(.+)\|/)?.[1]?.split(",").map(Number);

    return {cleanText: cleanText[1], checksum: checksum[1], enies
    }
}

function decryptSecuence(string) {

    // Limpiamos el header, el footer del string encriptado y extraemos el checksum
    let cleanedText = cleaningString(string)
    
    // Extraemos el texto limpio y desencriptamos
    let decryptedString = decrypt(cleanedText.cleanText)
    
    // Extraemos el checksum 
    let originalChecksum = cleanedText.checksum

    // Generamos un nuevo checksum y comparamos con el incrustado
    let controlChecksum = checksum(decryptedString)

    if (controlChecksum = originalChecksum) {
        console.log("Los valores son iguales")
    } else {
        console.log("Los valores no son iguales")
    } 

    // Volvemos a colocar las ñ, si las hubiese
    let decryptedCleanString = enieRestore(decryptedString, cleanedText.enies)
    console.log(decryptedCleanString)
    return decryptedCleanString

}