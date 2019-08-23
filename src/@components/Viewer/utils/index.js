import * as StateViewer from "./StateViewer"
export *  from "./storageState"
export {
   StateViewer
}
export const cancelEvent = (event) => {
   event.preventDefault();
   event.stopPropagation();
 }