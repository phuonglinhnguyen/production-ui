// New, holds the 8 tiny boxes that will be our selection handles
// the selection handles will be in this order:
// 0  1  2
// 3     4
// 5  6  7
import Shape from './shape';

const Corners = [];

// set up the selection handle boxes
for (let i = 0; i < 4; i++) {
  let rect = new Shape();
  Corners.push(rect);
}

export default Corners;
