import React from 'react';

import Loading from '../../../../components/Loading/Loading';

class VerifyKeyLoading extends React.Component {
  componentWillMount() {
    const { projectId, layoutName, sectionName } = this.props.match.params;
    this.props.action_getRelateDefinition(projectId, layoutName, sectionName);
  }

  render() {
    return <Loading />;
  }
}

export default VerifyKeyLoading;
