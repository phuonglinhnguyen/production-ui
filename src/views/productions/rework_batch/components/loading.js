import * as React from "react";
import RefreshIndicator from "material-ui/RefreshIndicator";
export class Loading extends React.Component {
    componentWillMount() {
        const { onInitial } = this.props;
        onInitial && onInitial()
    }
    render() {
        return (
            <div
                style={{
                    ...this.props.style,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <RefreshIndicator
                    size={100}
                    left={0}
                    top={0}
                    status="loading"
                    style={{
                        display: "inline-block",
                        position: "relative"
                    }}
                />
            </div>
        );
    }
}

export default Loading;
