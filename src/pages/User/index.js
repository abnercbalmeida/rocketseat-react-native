import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    loading: true,
    refresing: false,
    page: 1,
    stars: [],
  };

  async componentDidMount() {
    const { navigation } = this.props;

    const { page } = this.state;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loading: false, refresing: false });
  }

  componentDidUpdate(_, prevState) {
    const { page, refresing } = this.state;

    if (prevState.page !== page || refresing) {
      this.componentDidMount();
    }
  }

  loadMore = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };

  refreshList = () => {
    this.setState({ page: 1, refresing: true });
  };

  handleStarredClick = starred => {
    const { navigation } = this.props;

    navigation.navigate('RepositoryWebPage', { starred });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refresing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refresing}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleStarredClick(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
