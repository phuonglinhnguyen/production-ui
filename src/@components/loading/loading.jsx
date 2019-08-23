import * as React from 'react'
export class Loading extends React.Component {
    componentDidMount=()=>{
        const {onInitial}= this.props;
        onInitial&&onInitial()
    }
    render() {
        return (
            <div className="loader-container">
                <div className="loader">Loading...</div>
            </div>
        )
    }
}



