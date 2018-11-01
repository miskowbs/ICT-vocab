<template>
  <v-container fluid grid-list-lg class="elevation-12 ma-0"> 
    <v-layout
      v-for="list in vocabLists"
      :key="list['.key']">
      <v-flex xs12>
            <v-card>
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline mb-auto">{{ list.listTitle }}</h3>
                        <h4 class="mb-auto">{{ list.subject }}</h4>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-auto">Last Viewed: {{ list.lastViewed.toDate().toLocaleDateString('ja-JP') }} </h4>
                        <h4 class="mb-auto">Last Changed: {{ list.lastChanged.toDate().toLocaleDateString('ja-JP') }} </h4>
                    </v-flex>
                    <v-flex xs2>
                        <h3>Words: {{ list.wordCount }} </h3>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
    <v-dialog
        v-model="newListShow"
    >
        <v-card>
          <v-card-title>
            <span class="headline">New List</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="List Name*" v-model="newList.listTitle" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Subject" v-model="newList.subject"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="['en', 'someJp', 'jp']"
                    label="Language Level*"
                    v-model="newList.languageLevel"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="newListShow = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addList()">Save</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-btn
        color="pink"
        dark
        small
        sticky
        top
        right
        fab
        @click="newListShow = true">
        <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { users } from "../firebase";
var firebase = require('firebase');

export default {
  name: "listsComponent",
  props: {
    firebaseUser: {}
  },
  data() {
    return {
      newListShow: false,
      newList: {},
      vocabLists: []
    };
  },
  firestore() {
    return {
      vocabLists: users.doc(this.firebaseUser.uid).collection('wordLists')
    }
  },
  methods: {
    addList() {
      console.log('Uid ' + this.firebaseUser.uid); //<-- This is the User UID stored in Firebase auth

      if(this.newList) {
        console.log('adding List');
        var toAdd = this.newList;
        users.doc(this.firebaseUser.uid).collection('wordLists').add({
          listTitle: toAdd.listTitle,
          subject: toAdd.subject,
          languageLevel: toAdd.languageLevel,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          lastViewed: firebase.firestore.FieldValue.serverTimestamp(),
          lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
          wordCount: 0
        });
        
      }

      this.newListShow = false;
      this.newList = { };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>