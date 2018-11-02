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
        fab>
        <v-icon>add</v-icon>
    </v-btn>
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
        list: {}
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
    }
  }
</script>