export const getIn = (state: any, path: string[]) => {
   try {
      let result: any = state
      for (let i = 0; i < path.length && result; ++i) {
         result = result[path[i]]
      }
      return result
   } catch (error) {
      return;
   }
}
export default getIn;