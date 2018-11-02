<template>
  <v-container fluid grid-list-lg class="elevation-6 ma-0"> 
    <v-layout
      v-for="word in words"
      :key="word.id">
      <v-flex xs12>
            <v-card
              @click.native="/*showList(index) On click of card do stuff */">
              <!-- v-show="showListInfo.length == 0 ? true : showListInfo[index]"> -->
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline mb-auto">{{ word.word }}</h3>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-auto">Last Viewed: {{ word.lastViewed.toDate().toLocaleDateString('ja-JP') }} </h4>
                        <h4 class="mb-auto">Last Changed: {{ word.lastChanged.toDate().toLocaleDateString('ja-JP') }} </h4>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
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
        newWord: { }
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

        this.newWord = { }
        this.newWordShow = false;
      }
    }
  }
</script>