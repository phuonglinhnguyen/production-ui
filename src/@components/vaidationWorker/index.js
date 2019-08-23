import { EventEmitter } from 'events'
import { worker_script } from "./worker";
export function guid() {
   function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
   }
   return s4() + s4() + '-' + s4() + s4() + s4() + '-' + s4() + s4() + s4();
}


function indexOfMinArr(arr) {
   if (arr.length === 0) {
      return -1;
   }
   let max = arr[0].length;
   let maxIndex = 0;
   for (var i = 1; i < arr.length; i++) {
      if (arr[i].length > max) {
         maxIndex = i;
         max = arr[i].length;
      }
   }
   return maxIndex;
}

class ValidationPool extends EventEmitter {
   constructor(numOfWorker) {
      super();
      this.workers = [];
      this.running = [];
      this.messages = [];
      this.initWorker(numOfWorker)

   }
   initWorker = (num) => {
      const self = this;
      for (let index = 0; index < num; index++) {
         const worker = new Worker(worker_script, { name: 'validation' + index });
         // const worker = new Worker('/validation.js', { name: 'validation' + index });
         worker.onmessage = (ms) => {
            self.handleRecive(ms.data)
         }
         worker.onerror = (ms) => {
            console.log('===onerror=================================');
            console.log(ms);
            console.log('====================================');
            self.handleError(ms.data)
         }
         this.workers.push(worker)
         this.running.push([]);
      }
   }
   clear = () => {
      this.workers.forEach(worker => {
         worker.terminate();
      })
      this.running = [];
      this.workers = [];
   }
   handleRecive = (message) => {
      const self = this;
      self.releaseWorkerByGuid(message.id)
      self.emit(`message-${message.guid}`, message)
   }
   handleError = (message) => {
      try {
         const self = this;
         self.releaseWorkerByGuid(message.id)
         self.emit(`error-${message.id}`, message)
      } catch (error) {
         console.log('====================================');
         console.log(error);
         console.log('====================================');
      }
   }
   runMessage = () => {
      const self = this;
      if (self.messages.length) {
         let worker = self.claimWorkerByGuid(self.messages[0].id);
         if (worker) {
            worker.postMessage(self.messages.shift())
         }
      }
   }
   releaseWorkerByGuid = (id) => {
      let index = this.running.findIndex(item => item.includes(id));
      if (index === -1) {
      } else {
         this.running[index] = this.running[index].filter(item => item !== id);
      }
   }
   claimWorkerByGuid = (id) => {
      let index = this.running.findIndex(item => item.includes(id));
      if (index === -1) {
         index = indexOfMinArr(this.running)
         this.running[index].push(id);
      }
      if (index > -1) {
         return this.workers[index];
      }
   }
   addMessage = (message) => {
      const self = this;
      let worker = self.claimWorkerByGuid(message.id);
      if (worker) {
         worker.postMessage(message)
      } else {
         self.messages.push(message);
      }

   }
   reset = () => {
      this.workers.forEach(worker => worker.postMessage({ type: "reset" }))
   }
   sendMessage = (message) => {
      const self = this;
      let _ms = {
         ...message,
         guid: `${message.id}--value=${message.body.value}`
      }
      const result = new Promise((resolve, reject) => {
         self.on(`message-${_ms.guid}`, resolve)
         self.on(`error-${_ms.guid}`, reject)
      })
      self.addMessage(_ms);
      return result;
   }
}
let proccess = Math.max((navigator.hardwareConcurrency - 2), 1)
export default new ValidationPool(proccess);