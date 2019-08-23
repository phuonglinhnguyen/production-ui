import React from "react";
import { chunk, isEqual } from 'lodash'
import clone from "clone"
import GroupImagesListItemComponent from "./group_images_list_item_component";
import LinearProgress from 'material-ui/LinearProgress';


const styles = {
  main: {
    height: "calc(100vh - 76px)",
    display: "grid",
    gridTemplateColumns: "auto auto auto auto",
    gridGap: 5,
    padding: 5
  }
};
const loadImage = (uri, meta) => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.addEventListener('load', () => {
      resolve(meta)
    }, false);
    image.addEventListener('error', function (err) {
      resolve({ ...meta, error: err })
    }, false);
    image.src = uri + "?action=thumbnail&width=150"
  })
}
const getIdsFromChunks = (chunks) => {
  let ids = []
  chunks.forEach(ch => {
    ids = ids.concat(ch.map(item => item.id))
  });
  return ids;
}
class Loader {
  constructor(chunkSize = 1, col = 4) {
    this.running = 0
    this.loading = false;
    this._chunk_size = chunkSize
    this._poolSize = Math.floor(5 * col / chunkSize)
    this._chunks = []
    this.listen = {};
  }
  setData = (datas = []) => {
    const self = this;
    let _ids = getIdsFromChunks(this._chunks)
    let _datas = datas.filter(item => !_ids.includes(item.id))
    let chunks = chunk(_datas, self._chunk_size);
    if (this._poolSize > chunks.length + this._chunks.length) {
      this._chunks = this._chunks.concat(chunks)
    } else {
      let _chunks = this._chunks.concat(chunks)
      this._chunks = _chunks.slice(_chunks.length - this._poolSize);

    }
    return this;
  }
  onLoad = (cb) => {
    this.listen._onLoad = cb
    return this;
  }
  load = async () => {
    if (this.loading) return;
    const self = this;
    for (; this._chunks.length > 0;) {
      this.loading = true;
      let _chunks = self._chunks.shift()
      let dataLoaded = await Promise.all(_chunks.map((item) => {
        return loadImage(item.image_s3, item)
      }))
      self.listen._onLoad(dataLoaded)
    }
    this.loading = false;
  }
}


class GroupImagesListGrid extends React.Component {
  constructor(props) {
    super(props);
    let loader = new Loader(1)
    loader.onLoad(this.onLoad)
    this.state = {
      datas: [],
      images: [],
      loading: false,
      datasRender: [],
      loader: loader
    }
  }
  onLoad = (data) => {
    if (data) {
      let images = clone(this.state.images)
      let ids = data.map(it => it.id)
      images = images.map(item => {
        return {
          ...item,
          loading: !item.loading ? item.loading : !ids.includes(item.id)
        }
      })
      this.setState({ images, process })
    }
  }
  componentWillReceiveProps(nextProps) {
    const self = this;
    const { loader } = this.state
    try {
      if (!isEqual(this.props.datas, nextProps.datas)) {
        if (!(this.props.datas && this.props.datas.images) || !isEqual(this.props.datas.images.map(item => item.image_s3), nextProps.datas.images.map(item => item.image_s3))) {
          this.setState({
            images: nextProps.datas.images.map((item, id) => {
              return {
                ...item,
                id,
                loading: true
              }
            })
          }, () => {
            loader.setData(self.state.images.slice(0, 20)).load()
          })
        } else {
          let _images = clone(this.state.images);
          nextProps.datas.images.map((item, id) => {
            _images[id] = {
              ..._images[id],
              ...item
            }
          })
          this.setState({ images: _images })
        }
      }
    } catch (error) {

    }
  }
  componentDidMount() {
    const self = this;
    const { loader } = this.state;
    this.setState({
      images: this.props.datas && this.props.datas.images ? this.props.datas.images.map((item, id) => {
        return {
          ...item,
          id,
          loading: true
        }
      }) : []
    }, () => {
      loader.setData(self.state.images.slice(0, 24)).load()
    })

  }
  handleOnScroll = (event) => {
    const { loader } = this.state;
    if (loader._chunks.length > 0) {
      loader.load()
    }
    let scroll = event.target.scrollTop;
    let row = Math.floor(scroll / 355) + 1
    let end = row + 4
    let indexStart = (row - 1) * 4
    let indexEnd = (end) * 4
    let needLoad = this.state.images.slice(indexStart, indexEnd).filter(item => item.loading)
    loader.setData(needLoad).load()
  }
  render() {
    const {
      primary1Color,
      is_empty,
      actions,
      datas
    } = this.props;
    const { images } = this.state;
    if (is_empty || !images.length) {
      return "nhhien";
    }

    return (
      <div ref="main_div" className="cool_scroll" style={styles.main}
        onScroll={this.handleOnScroll}
      >
        {images.map((e, i) => (
          <GroupImagesListItemComponent
            key={i}
            {...e}
            primary1Color={primary1Color}
            index={i}
            action_click={actions.clickImage}
            action_showCanvas={actions.showCanvas}
          />
        ))}
      </div>
    );
  }
}

export default GroupImagesListGrid;
