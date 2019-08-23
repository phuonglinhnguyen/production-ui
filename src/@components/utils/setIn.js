export const setIn = (state: any, path: string[], value: any) => {
   let [current, ...nextPath] = path;
   if (nextPath.length) {
      state[current] = state[current] || {}
      setIn(state[current], nextPath, value)
   } else {
      state[current] = value
   }
}
export default setIn;