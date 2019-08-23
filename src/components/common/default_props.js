import AutoComplete from 'material-ui/AutoComplete';

const styles = {
  chip: {
    margin: 4
  },
  grid_list: {
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap'
  },
  inline: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  icon_button: {
    marginTop: 25
  },
  main_div: {
    height: 'calc(100%)',
    overflow: 'auto'
  },
  preview_div: {
    height: 'calc(100%)',
    marginTop: 1
  }
};

const default_props = {
  text_field: {
    floatingLabelFixed: true,
    autoComplete: 'off',
    fullWidth: true
  },
  auto_complete: {
    filter: AutoComplete.fuzzyFilter,
    popoverProps : { canAutoPosition : true},
    fullWidth: true,
    maxSearchResults: 5,
    floatingLabelFixed: true
  },
  select_field: {
    floatingLabelFixed: true,
    fullWidth: true
  },
  chip: {
    style: styles.chip
  },
  grid_list: {
    padding: 30,
    cellHeight: 'auto',
    style: styles.grid_list
  },
  main_div: {
    style: styles.main_div
  },
  preview_div: {
    style: styles.preview_div
  }
};

export default default_props;
