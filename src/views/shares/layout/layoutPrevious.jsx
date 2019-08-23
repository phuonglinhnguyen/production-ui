import * as React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import elrondThemeBlue from "../../../styles/themes/elrond_blue";
import elrondThemeGrey from "../../../styles/themes/elrond_grey";
import elrondThemePurple from "../../../styles/themes/elrond_purple";
import elrondThemeCyan from "../../../styles/themes/elrond_cyan";
export const LayoutPrevious = (options) => Target => {
    const muiTheme = getMuiTheme(elrondThemeBlue)
    return function (props) {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div
                    style={
                     {   height: 'calc(100vh)',
                        width: 'calc(100vw)',
                        overflow: 'hidden'
                }}>
                    <div style={{
                        marginTop: 64,
                        height: 'calc(100% - 64px)',
                        width: 'calc(100%)',
                        display: 'flex',
                        minWidth: "180px",
                        minHeight: "180px",
                        flexDirection: 'row',
                        flexGrow: 1,
                        padding: 0
                    }} >
                    <Target  {...props} muiTheme={muiTheme} />
                    </div>
                </div>
            </MuiThemeProvider >
        )
    }
}