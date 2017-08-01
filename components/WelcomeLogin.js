import React, {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import styles from '../styles/styles.js';
import Spinner from '../components/Spinner.js';
// import fbLogin from '../services/fbookExpoAuth.js';
// import gglLogin from '../services/googleExpoAuth.js';
import fbFirebaseAuth from '../services/fbFirebaseAuth.js';

export default class WelcomeLogin extends Component {
  constructor(props){
    super(props);
    this.state = {isDoingBackgroundStuff: false}
  }


  renderNormal() {
    return(
      <Button color='steelblue'
        onPress={
          async () => {
            this.setState({isDoingBackgroundStuff: true});
            await fbFirebaseAuth();
            this.setState({isDoingBackgroundStuff: false});
            this.props.chk();
          }
        }
        title = "LOGIN WITH FACEBOOK"
      />
    );
  }


  render() {
    return (
      <View style={styles.bottomPart}>
        { this.state.isDoingBackgroundStuff ? <Spinner /> : this.renderNormal() }

      </View>
    );
  }
}