<template>
  <v-container fluid grid-list-lg class="elevation-6 ma-0"> 
    <v-layout>
      <v-flex xs2>
        <v-btn 
          color="blue" 
          dark
          @click="closeList()">Close
          <v-icon dark right>close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4>
        <v-select
          :items="['Alphabetical', 'Date Added']"
          v-model="sortEnum"
          menu-props="auto"
          label="Sort By"
          hide-details
          @change="showWordDetails = [ ]">
        </v-select>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs2>
        <v-btn 
          color="red" 
          dark
          @click="deleteList()">Delete List
          <v-icon dark right>delete</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
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
            <v-btn 
              icon
              @click="wordDialog(word)">
              <v-icon>notes</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              icon
              @click="deleteWord(index)">
              <v-icon>delete</v-icon>
            </v-btn>
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
        @click="wordDialog()">
        <v-icon>add</v-icon>
    </v-btn>
    <editWordComponent 
      v-if="wordShow"
      v-on:closeDialog="closeDialog()"
      v-on:updateParent="updateCount()"
      :word="word"
      :wordCount="words.length"
      :listId="listId"
      :userId="userId"
      :wordShow="true"/>
  </v-container>
</template>


<script>
import editWordComponent from './editWordComponent';
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
      wordsByAlpha: [],
      wordsByDate: [],
      sortEnum: "Alphabetical",
      wordShow: false,
      word: { },
      showWordDetails: []
    }
  },
  firestore() {
    const listId = this.$props.listId;
    const userId = this.$props.userId;

    return {
      wordsByAlpha: users.doc(userId)
                        .collection('wordLists')
                        .doc(listId)
                        .collection('words').orderBy('word'),
      wordsByDate: users.doc(userId)
                        .collection('wordLists')
                        .doc(listId)
                        .collection('words').orderBy('created')
    }
  },
  computed: {
    words() {
      if(this.sortEnum === "Date Added") {
        return this.wordsByDate;
      }else if(this.sortEnum === "Alphabetical") {
        return this.wordsByAlpha;
      }
    }
  },
  components: {
    editWordComponent
  },
  methods: {
    wordDialog() {
      this.wordShow = !this.wordShow;
    },
    wordDialog(editWord) {
      this.word = editWord;
      this.wordShow = !this.wordShow;
    },
    closeDialog() {
      this.wordDialog();
      this.word = { };
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
    },
    deleteWord(index) {
      var userId = this.userId;
      var listId = this.listId;
      var idToDelete = this.words[index].id;
      var vm = this;

      vm.showWordDetails[index] = false;
      for(var i = index; i < vm.showWordDetails.length; i++) {
        vm.showWordDetails[i] = vm.showWordDetails[i+1];
      }
      users.doc(userId)
            .collection('wordLists')
            .doc(listId)
            .collection('words')
            .doc(idToDelete)
            .delete()
            .then(() => {
              vm.updateCount();
            })
    },
    updateCount() {
      var userId = this.userId;
      var listId = this.listId;
      var words = this.words;
      users.doc(userId)
                .collection('wordLists')
                .doc(listId)
                .update({
                  wordCount:  words.length,
                  lastChanged: firebase.firestore.Timestamp.fromDate(new Date())
                })
    },
    closeList() {
      this.showWordDetails = [];
      this.$emit('closeList');
    },
    deleteList() {
      this.$emit('deleteList', this.listId);
    }
  }
}
</script>