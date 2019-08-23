let elemtText
function guid() {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }
   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
// const fontSize = 17.6;
// const fontSize = 12;

const initTextSize = () => {
   elemtText = document.createElement("p")
   elemtText.setAttribute('id', guid())
   let body = document.getElementsByTagName('html')[0];
   body.appendChild(elemtText)
   // elemtText.style.fontSize="1em"
   elemtText.style.position = "fixed";
   elemtText.style.visibility = "hidden";
   elemtText.style.height = "auto";
   elemtText.style.width = "auto";
   elemtText.style['white-space'] = "nowrap";
}

const getTextSize = (text, fontSize) => {
   elemtText.style['font-size'] = fontSize;
   elemtText.style.fontSize = fontSize;
   elemtText.innerText = text
   let rs = {
      height: elemtText.clientHeight,
      width: elemtText.clientWidth + 6,
   }
   elemtText.innerText = ''
   return rs
}


const mergeSize = (sizeHeader, body, minSize = 0) => {
   return sizeHeader.map((sh, id) => Math.max(sh, body[id] || 0, minSize))
}

const calculatorWidthTableHeader = (fields) => {
   if (!elemtText) {
      initTextSize();
   }
   let sizes = fields.map(field => {
      return getTextSize(field.title, '0.75rem').width + 15
   })
   return sizes
}

const calculatorWidthTableBody = (values, fields, fontSize, isSpecial = false) => {
   if (!elemtText) {
      initTextSize();
   }
   let sizes = fields.map(field => {
      return Math.max(...values.map(record => {
         let _text = isSpecial ? record : (record[field.key_value] || '');
         if (_text.length) {
            return getTextSize(_text, '1.2em').width + 15
         }
         return 0;
      }))
   })
   return sizes
}

export default {
   initTextSize,
   getTextSize,
   calculatorWidthTableBody,
   calculatorWidthTableHeader,
   mergeSize
}

