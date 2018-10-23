<template>
  <v-app>
    
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar
      :tile='tile'
      :size='avatarSize'
      color='grey lighten-4'
      >
        <img v-bind:src="photoURL" alt="avatar">
      </v-avatar>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <HelloWorld/>
      <listsComponent/>
    </v-content>
    
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import listsComponent from "./components/listsComponent";
var firebase = require('firebase');
var provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: "App",
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if(!user) {
        firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;

        }).catch(function(error) {
          console.log(error);
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        })
      }
    })
  },
  components: {
    HelloWorld,
    listsComponent
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ICT Vocab",
      tile: false
    };
  },
  computed: {
    avatarSize() {
      console.log("weee");
      return "35px";
      //for the time being, keep it this way.
    },
    user() {
      console.log("a");
      firebase.auth().onAuthStateChanged(function(user) {
        console.log('AuthChanged');
        if(user) {
          
          return user;
        }
      });
    },
    photoURL() {
      console.log("b");
      if(firebase.auth().currentUser) {
        console.log(firebase.auth().currentUser);
        return firebase.auth().currentUser.providerData[0].photoURL;
      } else {
        firebase.auth().onAuthStateChanged(function(user) {
        console.log('AuthChanged');
        if(user) {
          return user.providerData[0].photoURL;
        }
      });
      }
    }
  }
};
</script>
