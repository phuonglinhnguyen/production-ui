
 * @author nhhien@suho
 * @email nhhien@digi-texx.vn
 * @create date 2017-07-25 09:41:34


# Comomn utility
#### Functions support

AutoSave,
GetAutoSave,
debounce,
isObject,
mergeDeep,
mergeDeepPure,
compare,

## Table of Contents

- [Auto Save](#auto-save)
- [GetAutoSave](#get-auto-save)
- [debounce](#debounce)
- [isObject](#is-object)
- [mergeDeep](#merge-deep)
- [mergeDeepPure](#mergeDeepPure)
- [compare](#compare)

## Auto Save
Create autoSave object;
```
import {AutoSave} from '../common'

let autoSave  = new AutoSave();

autoSave.addListener(key,func);

```


