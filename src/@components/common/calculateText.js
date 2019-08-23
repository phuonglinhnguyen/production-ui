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

const initTextSize =()=>{
   elemtText =  document.createElement("p")
   elemtText.setAttribute('id',guid())
   let body = document.getElementsByTagName('html')[0];
   body.appendChild(elemtText)
   // elemtText.style.fontSize="1em"
   elemtText.style.position = "fixed";
   elemtText.style.visibility = "hidden";
   elemtText.style.height = "auto";
   elemtText.style.width = "auto";
   elemtText.style['white-space'] = "nowrap";
}

const getTextSize =(text, fontSize)=>{
   elemtText.style['font-size'] = fontSize;
   elemtText.style.fontSize = fontSize;
   elemtText.innerText =text
   let rs = {
      height: elemtText.clientHeight,
      width: elemtText.clientWidth + 6,
    }
    elemtText.innerText=''
   return rs
}


const mergeSize =(sizeHeader,body,minSize=0)=>{
   return  sizeHeader.map((sh,id)=>Math.max(sh,body[id]||0,minSize))
}

const calculatorWidthTableHeader=(fields)=>{
   if(!elemtText){
      initTextSize();
   }
   let sizes =  fields.map(field=>{
            return getTextSize(field.name,'0.75rem').width
   })
   return sizes
}

const calculatorWidthTableBody =(values,fields)=>{
   if(!elemtText){
      initTextSize();
   }
   let _record = values.map(value=>{
      let fieldData ={}
      Object.values(value).forEach(sectionData=>{
         sectionData.forEach(sectionRecord=>{
            Object.keys(sectionRecord).forEach(fieldName=>{
               fieldData[fieldName]= fieldData[fieldName]?[...fieldData[fieldName],sectionRecord[fieldName].text] :[sectionRecord[fieldName].text]
            })
         })
      })
      return fieldData
   })
   let sizes =  fields.map(field=>{
      return  Math.max(..._record.map(record=>{
         if(record[field.name]&&record[field.name].length){
            return getTextSize(record[field.name].join('`'),'1.2em').width
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

