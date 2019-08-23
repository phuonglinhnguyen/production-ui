(function (global) {
   const getValitionFunc = (validation) => {
      try {
         const argDefined = validation.arguments;
         const script = validation.content;
         const argMapKey = Object.keys(argDefined);
         const argMapValue = Object.values(argDefined);
         // const value_broadcast = validation.value_broadcast;
         const input = ['fetchJSON', 'value', 'rowId', 'record', 'section', 'layout', 'dataExtractField', 'dataExtract'].concat(argMapKey).join(',');
         const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
         const fnc = new AsyncFunction(input, script);//eslint-disable-line no-new-func
         return (fetchJSON, value = '', rowId, record = {}, section = [], layout = {}, dataExtractField, dataExtract) => {
            let parameters = [fetchJSON, value, rowId, record, section, layout, dataExtractField, dataExtract]
            try {
               parameters = parameters.concat(argMapValue.map(arg => {
                  try {
                     return record[rowId][arg].text || ''
                  } catch (_) {
                     return '';
                  }
               }));
            } catch (_) {
            }
            try {
               let result = fnc.apply(this, parameters);
               return result;
            } catch (e) {
               return;
            }
         }
      } catch (error) {
         return;
      }
   }


   class Process {
      constructor(props) {
         this.id = props.id;
         this.guid = props.guid;
         this.body = props.body;
         this.validationFn = getValitionFunc(props.body.validation)
      }
      run(data) {
         if (data) {
            // if (data.body.current!==this.body.current || data.body.value !== this.body.value) {
            if (this.running) {
               global.postMessage({ type: 'abort', id: data.id, guid: this.running })
            }
            this.current = data.current;
            this.guid = data.guid;
            this.process(data.id, data.guid, data.body)
            // }
         } else {
            this.process(this.id, this.guid, this.body)
         }
      }
      done(id, guid, data) {
         this.running = null;
         if (guid === this.guid) {
            global.postMessage({ type: 'result', id, guid, body: data })
         }
      }
      process(id, guid, body) {
         const self = this;
         if (this.controler) {
            try {
               this.controler.abort();
            } catch (error) {
               console.error(error);
            }
         }
         this.controler = new AbortController();
         self.running = guid;
         const fetchJSON = async (uri, options = { method: 'get' }) => {
            let res = await fetch(uri, { ...options, signal: this.controler.signal })
            let result = await res.json()
            return result;
         }

         this.validationFn(fetchJSON, body.value, body.rowId, body.record, body.section, body.layout, body.dataExtractField, body.dataExtract).then(data => {
            self.done(id, guid, data)
         }).catch(error => {
            global.postMessage({ type: 'error', id, guid, body: String(error) })
         })
      }
   }
   let controler;
   let processInstance = [];
   global.onmessage = (ms) => {
      if (ms.data.type === "reset") {
         processInstance = [];
         return;
      }
      let { id } = ms.data;
      let process = processInstance.filter(item => item.id === id)[0]
      if (!process) {
         process = new Process(ms.data);
         processInstance.push(process)
         process.run();
      } else {
         process.run(ms.data)
      }
   }
})(this)