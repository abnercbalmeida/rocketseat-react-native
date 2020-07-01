import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

const RepositoryWebPage = props => {
  const { navigation } = props;
  const starred = navigation.getParam('starred');

  return <WebView source={{ uri: starred.html_url }} style={{ flex: 1 }} />;
};

RepositoryWebPage.navigationOptions = () => ({ title: '' });

RepositoryWebPage.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

export default RepositoryWebPage;
