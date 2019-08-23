import PropTypes from 'prop-types';
/**
 * @description Recomment use GetAutoSave for using AutoSave;
 * @export
 * @class AutoSave
 */
export class AutoSave {
  /**
     * @param {string} [name='AutoSavse'] 
     * @memberof AutoSave
     */
  constructor(name = 'AutoSavse') {
    this.name = name;
    this.timeOuts = {};
    this.listListen = {};
    this.statusListen = {};
    this.waiting = {};
  }
  /**
     * @param {any} key 
     * @param {func} fn 
     * @memberof AutoSave
     */
  addListener(key, fn) {
    this.listListen[key] = fn;
  }
  removeListener(key) {
    this.listListen[key] = null;
  }
  /**
     * @param {any} key 
     * @param {any} data 
     * @param {number} [time=2000] 
     * @param {func} fn 
     * @memberof AutoSave
     */
  stop(key) {
    if (this.timeOuts[key]) {
      clearTimeout(this.timeOuts[key]);
    }
  }

  showStatus(key) {
    return this.statusListen[key] || 1;
  }

  save(key, data, time = 2000, fn) {
    if (fn) {
      this.addListen(key, fn);
    }
    if (typeof this.listListen[key] === 'function') {
      this.statusListen[key] = 2;
      if (this.timeOuts[key]) {
        clearTimeout(this.timeOuts[key]);
      }
      this.timeOuts[key] = setTimeout(() => {
        this.statusListen[key] = 1;
        this.listListen[key](data);
      }, time);
    } else {
      this.statusListen[key] = 3;
    }
  }
  saveById(key, data, time = 2000, fn) {
    /**@description: set listern if exits*/
    if (fn) {
      this.addListen(key, fn);
    }

    if (typeof this.listListen[key] === 'function') {
      this.statusListen[key] = 2;
      if (this.waiting[key]) {
        if (this.waiting[key][data.id]) {
          clearTimeout(this.waiting[key][data.id]);
        }
      } else {
        this.waiting[key] = {};
      }
      this.waiting[key][data.id] = setTimeout(() => {
        this.statusListen[key] = 1;
        this.listListen[key](data);
        this.waiting[key][data.id] = undefined;
      }, time);
    } else {
      this.statusListen[key] = 3;
    }
  }
  stopById(key, data) {
    if (typeof this.listListen[key] === 'function') {
      if (this.waiting[key]) {
        if (this.waiting[key][data.id]) {
          clearTimeout(this.waiting[key][data.id]);
        }
      }
    }
  }
}
AutoSave.propTypes = {
  save: PropTypes.func,
  saveById: PropTypes.func,
  stopById: PropTypes.func,
  addListen: PropTypes.func
};

var _instance = new AutoSave();

export const GetAutoSave = () => {
  return _instance;
};
