<template>
  <v-container fluid grid-list-lg class="elevation-12 ma-0"> 
    <v-layout
      v-for="(list, index) in vocabLists"
      :key="list.id">
      <v-flex xs12>
            <v-card
              @click.native="showList(index)/* On click of card do stuff */"
              v-show="showListInfo.length == 0 ? true : showListInfo[index]">
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
    <v-btn
        color="pink"
        dark
        small
        sticky
        top
        right
        fab
        @click="newListShow = true"
        v-show="showFab">
        <v-icon>add</v-icon>
    </v-btn>
    <vocabListComponent
      v-if="showVocabList"
      :listId="vocabListId"
      :userId="firebaseUser.uid" />
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
  </v-container>
</template>

<script>
import { users } from "../firebase";
import vocabListComponent from "./vocabListComponent";
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
      vocabLists: [],
      showListInfo: [],
      showFab: true,
      showVocabList: false,
      vocabListId: ""
    };
  },
  created() {
    
  },
  firestore() {
    return {
      vocabLists: users.doc(this.firebaseUser.uid).collection('wordLists')
    }
  },
  components: {
    vocabListComponent
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
    },
    showList(clicked) {
      var showListInfo = this.showListInfo;
      
      this.vocabListId = this.vocabLists[clicked].id;

      users.doc(this.firebaseUser.uid).collection('wordLists').doc(this.vocabListId).update({
          lastViewed: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          console.log(clicked);
          if(showListInfo.length > 0) {//showListInfo is populated: a card has been clicked before
            for(var i = 0; i < showListInfo.length; i++){
              i == clicked ? showListInfo[i] = true : showListInfo[i] = false;
            }
          } else {//showListInfo is not populated: a card hasn't been clicked before
            for(var i = 0; i < this.vocabLists.length; i++){
              i == clicked ? showListInfo.push(true) : showListInfo.push(false);
            }
          }

          this.showFab = false;
          this.showVocabList = true;
        });
    },
    showAllLists() {
      this.showFab = true;
      this.showVOcabList = false;
      for(var i = 0; i < this.showListInfo.length; i++){
        this.showListInfo[i] = true;
      }
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