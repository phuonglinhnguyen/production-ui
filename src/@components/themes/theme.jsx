import { darkTheme ,blueLightTheme } from './data'
export const THEME_BLUE = 'theme_blue'
export const THEME_GREY = 'theme_grey'
export const THEME_PURPLE = 'theme_purple'
export const THEME_CYAN = 'theme_cyan'
export const themes =
{
    [THEME_BLUE]: {
        theme: blueLightTheme,
        color: '#3F51B5'
    },
    [THEME_CYAN]: {
        theme:darkTheme,
        color:'#2196F3'
    }
    ,
    [THEME_GREY]:{
      theme:darkTheme,
      color:'607D8B',  
    } ,
    [THEME_PURPLE]:{
        theme:blueLightTheme,
        color:'#673AB7'
    },
}