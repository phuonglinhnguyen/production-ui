export const numberForReport = number => {
  if (!number) {
    return 0;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseFloatNumber = number => {
  if (!number) {
    return 0;
  }
  
  let n = number.toString()
  if (n.indexOf(".") !== -1) {
    n = parseFloat(number).toFixed(1);
  } else {
    n = Number(number);
  }

  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
