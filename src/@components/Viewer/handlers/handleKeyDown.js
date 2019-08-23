import { cancelEvent } from '../utils'
export default (self, event) => {
  if (event.altKey) {
    switch (event.code) {
      case 'ArrowLeft':
        cancelEvent(event);
        self.mainController.setData('move', {
          type: 'left',
          payload: 20
        })
        break;

      case 'ArrowRight':
        cancelEvent(event);
        self.mainController.setData('move', {
          type: 'right',
          payload: 20
        })
        break;
      case 'ArrowUp':
        cancelEvent(event);
        self.mainController.setData('move', {
          type: 'down',
          payload: 20
        })
        break;
      case 'ArrowDown':
        cancelEvent(event);
        self.mainController.setData('move', {
          type: 'up',
          payload: 20
        })
        break;
      default:

        break;
    }
  } else if (event.ctrlKey) {
    switch (event.code) {
      case 'ArrowUp':
        // case 'ArrowLeft':
        cancelEvent(event);
        self.mainController.changeRatio('down');
        break;

      case 'ArrowDown':
        // case 'ArrowRight':
        cancelEvent(event);
        self.mainController.changeRatio('up');
        break;
      //   cancelEvent(event);

      //   break;
      //   cancelEvent(event);
      //   self.mainController.setData('move', {
      //     type: 'up',
      //     payload: 20
      //   })
      //   break;
      default:
        break;
    }
  }
}