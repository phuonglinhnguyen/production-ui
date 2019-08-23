import { INIT_FIELD_ELEMENT_DATA_FROM } from "../actions";

export const initFieldElement = (payload:{fieldName:string,element:any}) => ({
   type: INIT_FIELD_ELEMENT_DATA_FROM,
   payload,
   meta: {
      resource: 'form'
   }
})