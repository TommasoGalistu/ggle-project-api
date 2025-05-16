// npm i dompurify
import DOMPurify from "dompurify";


export function validaPassword(password, confirmPassword = null){
  const lunghezzaMinima = 8;
  const haMaiuscola = /[A-Z]/.test(password);
  const haMinuscola = /[a-z]/.test(password);
  const haNumero = /[0-9]/.test(password);
  const haSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const haSpazi = /\s/.test(password);

  if(password != confirmPassword ){
    return "Conferma password non corrisponde";
  }
  if (password.length < lunghezzaMinima) {
    return "La password deve contenere almeno 8 caratteri.";
  }
  if (!haMaiuscola) {
    return "La password deve contenere almeno una lettera maiuscola.";
  }
  if (!haMinuscola) {
    return "La password deve contenere almeno una lettera minuscola.";
  }
  if (!haNumero) {
    return "La password deve contenere almeno un numero.";
  }
  if (!haSpeciale) {
    return "La password deve contenere almeno un carattere speciale.";
  }
  if (haSpazi) {
    return "La password non deve contenere spazi.";
  }

  return true;
}

export function sanitizeInput(inputElement){
    return DOMPurify.sanitize(inputElement);
}

export function validInput(str) {
  return typeof str === "string" && str.trim().length >= 3;
}

export function invertDataString(dataString, separator = "/"){
  
  return dataString.split(separator).reverse().join(separator);
}

export function catchDateISO(stringDateIso){
  // stringDateIso = 2025-05-15T18:00:00+02:00


   const dateHour = stringDateIso.split('+')[0]
  //  ritorna una stringa = 2025-05-15T
   return dateHour.replace(/([a-zA-Z]).*$/, "$1");
}


//ottieni il fuso orario
export function getTimezoneOffsetFormatted() {
  const offset = -new Date().getTimezoneOffset(); // invertito per ottenere +/-
  const sign = offset >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

//otieni orario
export function getHourAndMinute(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// controlla che il form non sia vuoto
export function getFormValuesAndCheck(formArray) {
  const values = {};
  const checkedRadios = new Set();
  
  for (let i = 0; i < formArray.length; i++) {
    const el = formArray[i];
    const name = el.name;

    if (!name || el.disabled || el.localName === 'button') continue;

    if (el.type === 'radio') {
      if (checkedRadios.has(name)) continue; // già gestito questo gruppo
      const selected = [...formArray].find(e => e.name === name && e.checked);
      if (!selected) return { valid: false, values: null };
      values[name] = selected.value;
      checkedRadios.add(name);
    } else if (el.type === 'checkbox') {
      // checkbox multipli con lo stesso name: raccogli tutti quelli spuntati
      if (!values[name]) values[name] = [];
      if (el.checked) {
        values[name].push(el.value);
      }
    } else {
      if (el.value.trim() === '') return { valid: false, values: null };
      values[name] = el.value.trim();
    }
  }

  return { valid: true, values };
}

