(function (global) {
   const getValitionFunc = (validation) => {
      try {
         const argDefined = validation.arguments;
         const script = validation.content;
         const argMapKey = Object.keys(argDefined);
         const argMapValue = Object.values(argDefined);
         // const value_broadcast = validation.value_broadcast;
         const input = ['fetchJSON', 'value', 'rowId', 'record', 'section', 'layout'].concat(argMapKey).join(',');
         const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
         const fnc = new AsyncFunction(input, script);//eslint-disable-line no-new-func
         return (fetchJSON, value = '', rowId, record = {}, section = [], layout = {}) => {
            const parameters = [fetchJSON, value, rowId, record, section, layout].concat(argMapValue.map(arg => record[arg] || ''));
            try {
               let result = fnc.apply(this, parameters);
               return result;
            } catch (e) {
               return e.toString();
            }
         }
      } catch (error) {
         return;
      }
   }
   let controler ;
   global.onmessage = (ms) => {
      //body ={validation, value,rowId,record,section,layout}
      let { id, guid, body } = ms.data;
      if (controler) {
         try {
            controler.abort();
         } catch (error) {
            console.error(error);

         }
      }
      controler = new AbortController();
      const fetchJSON = async (uri, options = { method: 'get' }) => {
         let res = await fetch(uri, { ...options, signal: controler.signal })
         let result = await res.json()
         return result;
      }
      getValitionFunc(body.validation)(fetchJSON, body.value, body.rowId, body.record, body.section, body.layout).then(data => {
         global.postMessage({ id, guid, body: data })
      }).catch(error => {
         global.postMessage({ id, guid, error: String(error) })
      })
   }
})(this)