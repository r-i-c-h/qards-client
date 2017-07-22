import React from 'react';
import { StyleSheet, Text, View, TextInput, AppRegistry, Button, Picker } from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../styles/styles.js';
import ReactNativeComponentTree from 'react-native/Libraries/Renderer/src/renderers/native/ReactNativeComponentTree';
import GameListItem from './GameListItem.js';

export default class Lobby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game: 'Gin Straight',
      games: []
    }

    this.onPressListItem = this.onPressListItem.bind(this);
  }

  componentWillMount() {
    fetch('https://qards.herokuapp.com/api/games')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({
        games: data
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onPressListItem(e) {
    const { navigate } = this.props.navigation;
    let selectedGameName = ReactNativeComponentTree.getInstanceFromNode(e.nativeEvent.target)._stringText;
    let selectedGame = this.state.games.find((game) => game.name === selectedGameName);
    console.log(selectedGame);
    if (selectedGame !== undefined) {
      fetch('https://qards.herokuapp.com/api/addPlayer', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          gameId: selectedGame._id,
          player: {
            name: 'aChicken',
            username: 'iLayEggs'
          }
        })
      })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
        navigate('PreGameArea', {
          gameId: responseJson.gameId,
          playerId: responseJson.playerId
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lobby</Text>
          <View>
            <Text style={styles.smallTitle}>Games</Text>
            <View style={styles.pickerView}>
            <Picker
              selectedValue={this.state.game}
              onValueChange={(itemValue, itemIndex) => this.setState({ game: itemValue })}
              style={styles.picker}>
              <Picker.Item label="Gin Straight" value="Gin Straight" />
            </Picker>
            </View>
            <Button
              color='darkviolet'
              onPress={() => navigate(this.state.game.split(' ').join('') + 'Rules')}
              title="Rules"
            />
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={styles.smallTitle}>Join a {this.state.game} Game</Text>
            { this.state.games.filter((game) => game.type === this.state.game).map((game, i) => <GameListItem game={game} key={i} onPressListItem={this.onPressListItem}/>) }
          </View>
          <Button
            color='darkviolet'
            onPress={() => navigate('GameOptions')}
            title="Create a Game"
          />
      </View>
    );
  }
}