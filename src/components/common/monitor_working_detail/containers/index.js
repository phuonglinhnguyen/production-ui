import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Actions from '../actions'
import { NAME_STORE } from '../constants'
import DialogDrag from '../components/dialog_drag_component'

const mapStateToProps = (state) => ({
    working_detail:state.common[NAME_STORE],
    username: state.user.user.username,
})
const mapDispatchToProps = (dispatch)=>
({
  actions:bindActionCreators({...Actions},dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DialogDrag);
