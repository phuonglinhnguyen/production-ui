export function getIndexItem(index_document, cols, keyCode, size_list) {
  let index = index_document + 1;
  if (keyCode === 39) {
    index += 1;
    if (index > size_list) {
      index = 1;
    }
  } else if (keyCode === 38) {
    let real_size_list = Math.ceil(size_list / cols) * cols;
    index -= cols;
    if (index < 1) {
      index = real_size_list + index;
      if (index > size_list) {
        index = index - cols;
      }
    }
  } else if (keyCode === 40) {
    let row = Math.ceil(index / cols) * cols;
    index += cols;
    if (index > size_list) {
      index = index - row;
    }
  } else {
    index -= 1;
    if (index < 1) {
      index = size_list;
    }
  }

  return index - 1;
}
