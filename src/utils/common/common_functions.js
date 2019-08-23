import {find} from 'lodash'
export const findItemInList=(list,key,value)=>{
    find(list,[key,value]);
}