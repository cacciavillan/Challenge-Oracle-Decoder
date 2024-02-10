function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reinicia la altura a auto para recalcularla a la altura actual
    textarea.style.height = textarea.scrollHeight + 'px'; // Actualiza la altura

    // Ajusta la altura del body si es necesario
    document.body.style.height = document.documentElement.scrollHeight + 'px';

}



document.addEventListener('DOMContentLoaded', function () {
    let textarea = document.getElementById('textarea1');
    let maxLength = 3000; // Establece el límite máximo de caracteres según tus necesidades

    textarea1.addEventListener('input', function () {
        var inputText = textarea1.value;

        if (inputText.length > maxLength) {
            textarea.value = inputText.substring(0, maxLength);
        }

        autoResize(textarea); // Llamada a autoResize después de comprobar la longitud máxima
    });
});
