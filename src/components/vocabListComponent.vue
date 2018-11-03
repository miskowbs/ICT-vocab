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
          slot="header"
          @click="viewItem(index)">
          <v-flex xs8>
            <v-layout>
              <v-flex 
                xs5
                class="display-1 mb-auto text-capitalize">
                {{ word.word }}
              </v-flex>
              <v-flex
                xs3
                class="headline mb-auto"
                v-if="word.languageLevel != 'en'"
                v-show="showWordDetails[index]">
                {{ word.jpWord }}
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <h4 class="title mb-auto" >
              Last Viewed: {{ word.lastViewed.toDate().toLocaleDateString('ja-JP') }}
            </h4>
            <h4 
              class="body-1 mb-auto" 
              v-show="showWordDetails[index]">
              Last Changed: {{ word.lastChanged.toDate().toLocaleDateString('ja-JP') }}
            </h4>
            <h4 
              class="body-1 mb-auto" 
              v-show="showWordDetails[index]">
              Created: {{ word.created.toDate().toLocaleDateString('ja-JP') }}
            </h4>
            <h4 
              class="body-1 mb-auto" 
              v-show="showWordDetails[index]">
              LanguageLevel: {{ word.languageLevel }}
            </h4>
          </v-flex>
        </v-layout>
        <v-card>
          <v-card-text>
            <v-layout
              row
              wrap>
              <v-flex xs12>
                <v-layout
                  row
                  wrap>
                  <v-flex 
                    xs12
                    md6
                    class="headline">
                    <strong>Definition:</strong> {{ word.def }} 
                  </v-flex>
                  <v-flex
                    xs12
                    md6
                    class="headline"
                    v-if="word.languageLevel == 'jp'">
                    <strong>定義:</strong> {{ word.jpDef }}
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 md6>
                Memo: {{ word.memo }}
              </v-flex>
              <v-flex xs12 md6>
                Mnemonic: {{ word.mnemo }}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
          </v-card-actions>
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

      this.newWord = { };
      this.newWordShow = false;
      this.showWordDetails = [ ];
    },
    viewItem(index) {
      if(!this.showWordDetails[index]){
        var userId = this.userId;
        var listId = this.listId;
        var words = this.words;
        users.doc(userId)
              .collection('wordLists')
              .doc(listId)
              .collection('words')
              .doc(words[index].id)
              .update({
                lastViewed: firebase.firestore.Timestamp.fromDate(new Date())
              });
      }
    }
  }
}
</script>