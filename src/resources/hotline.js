import Config from '../config.json';

let _hotlines = Config.HOTLINES;

if (typeof _hotlines !== "object") {
    _hotlines = JSON.parse(_hotlines);
}

const hotlines = _hotlines;

export default hotlines;
