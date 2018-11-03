<template>
  <v-dialog
      v-model="wordShow"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ titleText }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md4>
                <v-text-field label="Word*" v-model="word.word" required></v-text-field>
              </v-flex>
              <v-flex xs12 md8>
                <v-textarea
                  box
                  label="Definition*"
                  auto-grow
                  required
                  v-model="word.def"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field label="言葉" v-model="word.jpWord"></v-text-field>
              </v-flex>
              <v-flex xs12 md8>
                <v-textarea
                  box
                  label="定義"
                  auto-grow
                  v-model="word.jpDef"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-textarea
                  box
                  label="memo"
                  auto-grow
                  v-model="word.memo"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-textarea
                  box
                  label="mnemonic"
                  auto-grow
                  v-model="word.mnemo"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  :items="['en', 'someJp', 'jp']"
                  label="Language Level*"
                  v-model="word.languageLevel"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="wordShow = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="addWord()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { users } from '../firebase';
var firebase = require('firebase');

export default {
  
  props: {
    word: {
    },
    listId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    wordShow: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      fbWord: { },
      titleText: ""
    }
  },
  firebase() {
    const listId = this.$props.listId;
    const userId = this.$props.userId;
    const wordId = this.$props.word.id;
     
    return {
      fbWord: users.doc(userId)
              .collection('wordLists')
              .doc(listId)
              .collection('words')
              .doc(wordId)
    }
  },
  methods: {
    addWord() {
      if(this.word) {
        var toAdd = this.word;
        var userId = this.userId;
        var listId = this.listId;
        var words = this.words; //TODO: figure out how to deal with updating wordCount

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
          languageLevel: toAdd.languageLevel,
          created: firebase.firestore.Timestamp.fromDate(new Date()),
          lastViewed: firebase.firestore.Timestamp.fromDate(new Date()),
          lastChanged: firebase.firestore.Timestamp.fromDate(new Date())
        }).then(function () {
            users.doc(userId)
                .collection('wordLists')
                .doc(listId)
                .update({
                  wordCount:  words.length,
                  lastChanged: firebase.firestore.Timestamp.fromDate(new Date())
                })
        });
      }

      this.wordShow = false;
    }
  }

}
</script>
