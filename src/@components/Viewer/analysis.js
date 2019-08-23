import { getDataObject } from "@dgtx/coreui";

export const analyzeConfig = (config) => {
   let { sections = [], active, lines } = config;
   const section = sections.filter(item => item.name === active.sectionName)[0];
   let field;
   let sectionsDataDraw=[];
   try {
      let { field_setting, field_display, name } = section.fields.filter(item => item.name === active.fieldName)[0]
      if (field_setting.position_percent.w > 0) {
         field = {
            ...field_setting.position_percent,
            title: field_display || name
         }
      }
   } catch (error) {
   }
   try {
      sectionsDataDraw = sections.map(section => {
         try {
            let _lines = getDataObject('settings.multiple.record_no', section)
            _lines = _lines ? Number(_lines) : null
            return {
               lines: lines,
               base: {
                  lines: Math.max(_lines, 1),
                  start: section.position_percent.y,
                  end: section.position_percent.y + section.position_percent.h
               }
            }
         } catch (error) {
            return {}
         }
      })

   } catch (error) {

   }
   return {
      field,
      sections: sectionsDataDraw
   }
}


