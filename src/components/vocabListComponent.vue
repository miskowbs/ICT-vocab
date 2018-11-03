<template>
  <v-container fluid grid-list-lg class="elevation-6 ma-0"> 
    <v-expansion-panel
      v-model="showWordDetails"
      expand
      popout>
      <v-expansion-panel-content
        v-for="(word, index) in words"
        :key="index">
        <v-layout
          slot="header">
            <v-flex xs8>
              <h3 class="headline mb-auto">{{ word.word }}</h3>
            </v-flex>
            <v-flex xs4>
              <h4 class="mb-auto" >Last Viewed: {{ word.lastViewed.toDate().toLocaleDateString('ja-JP') }}</h4>
              <h4 class="mb-auto" v-show="showWordDetails[index]">Last Changed: {{ word.lastChanged.toDate().toLocaleDateString('ja-JP') }}</h4>
            </v-flex>
        </v-layout>
        <v-card>
            <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
     
    <v-btn
        color="blue"
        dark
        small
        sticky
        top
        right
        fab
        @click="newWordShow = true">
        <v-icon>add</v-icon>
    </v-btn>
    <v-dialog
      v-model="newWordShow"
    >
      <v-card>
        <v-card-title>
          <span class="headline">New Word</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md4>
                <v-text-field label="Word*" v-model="newWord.word" required></v-text-field>
              </v-flex>
              <v-flex xs12 md8>
                <v-textarea
                  box
                  label="Definition*"
                  auto-grow
                  required
                  v-model="newWord.def"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field label="言葉" v-model="newWord.jpWord"></v-text-field>
              </v-flex>
              <v-flex xs12 md8>
                <v-textarea
                  box
                  label="定義"
                  auto-grow
                  v-model="newWord.jpDef"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-textarea
                  box
                  label="memo"
                  auto-grow
                  v-model="newWord.memo"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-textarea
                  box
                  label="mnemonic"
                  auto-grow
                  v-model="newWord.mnemo"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  :items="['en', 'someJp', 'jp']"
                  label="Language Level*"
                  v-model="newWord.languageLevel"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="newWordShow = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="addWord()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import { users } from '../firebase';
var firebase = require('firebase');

  export default { 
    props: {
      listId: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        words: [],
        list: {},
        newWordShow: false,
        newWord: { },
        showWordDetails: []
      }
    },
    firestore() {
      const listId = this.$props.listId;
      const userId = this.$props.userId;
      return {
        words: users.doc(userId)
                    .collection('wordLists')
                    .doc(listId)
                    .collection('words'),
        list: users.doc(userId)
                    .collection('wordLists')
                    .doc(listId)
      }
    },
    methods: {
      addWord() {

        if(this.newWord) {
          var toAdd = this.newWord;
          var userId = this.userId;
          var listId = this.listId;
          var words = this.words;

          users.doc(userId)
                .collection('wordLists')
                .doc(listId)
                .collection('words')
                .add({
            word: toAdd.word,
            def: toAdd.def,
            jpWord: toAdd.jpWord ? toAdd.jpWord : "",
            jpDef: toAdd.jpDef ? toAdd.jpDef : "",
            memo: toAdd.memo ? toAdd.memo : "",
            mnemo: toAdd.mnemo ? toAdd.mnemo : "",
            created: firebase.firestore.FieldValue.serverTimestamp(),
            lastViewed: firebase.firestore.FieldValue.serverTimestamp(),
            lastChanged: firebase.firestore.FieldValue.serverTimestamp()
          }).then(function () {
              users.doc(userId)
                  .collection('wordLists')
                  .doc(listId)
                  .update({
                    wordCount:  words.length,
                    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
                  })
          });
        }

        this.newWord = { };
        this.newWordShow = false;
        this.showWordDetails = [ ];
      },
      toggleWordDetails(index) {
        
        var wordsList = this.words;
        var showWordDetails = this.showWordDetails;
        if(showWordDetails.length != wordsList.length) {/*No details have been seen yet OR
                                                          a new list has been created, hiding
                                                          all details*/
          for(var i = 0; i < wordsList.length; i++) {
            if(i == index) {
              showWordDetails.push(true);
            } else {
              showWordDetails.push(false);
            }
          }
          console.log('populated showWordDetails, showWordDetails[' + index + '] set to true');
        } else { //Toggle the showWordDetails of that word
          showWordDetails[index] = !showWordDetails[index];
          console.log('toggled showWordDetails[' + index + '] to ' + showWordDetails[index]);
        }
      }
    }
  }
</script>