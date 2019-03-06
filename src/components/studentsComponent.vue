<template>
  <v-container fluid grid-list-lg class="elevation-12 ma-0"> 
    <h3 class="display-3 mb-auto">All Students</h3>
    <v-expansion-panel
      v-model="showStudentDetails"
      popout>
      <v-expansion-panel-content
        v-for="(student, index) in students"
        :key="index">
        <v-layout 
          slot="header">
          <v-flex 
            xs8
            class="display-1 mb-auto text-capitalize">
            {{ student.name }}
          </v-flex>
          <v-spacer/>
          <v-flex xs2>
            <h4 class="title mb-auto">Last Sign In:</h4>
            <h4 class="title mb-auto">Latest Change:</h4>
          </v-flex>
          <v-flex>
            <h4 class="title mb-auto">{{ student.lastSignIn.toDate().toLocaleDateString('ja-JP') }} </h4>
            <h4 class="title mb-auto">{{ student.latestChange.toDate().toLocaleDateString('ja-JP') }} </h4>
          </v-flex>
        </v-layout>
        <v-card>
          <v-card-text>
            <listsComponent
              :userId="student.id"
              :updateViewDate="false" />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-btn 
      top
      right
      color="blue"
      @click="pushList = true">Push Lists
      <v-icon right>playlist_add</v-icon>
    </v-btn>
    <v-dialog
      v-model="pushList"
      >
      <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-subheader>Students</v-subheader>
                  <v-list subheader>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-checkbox color="pink" v-model="allStudentsChecked"/>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>All Students</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                      v-for="(student, index) in students"
                      :key="index">
                      <v-list-tile-action>
                        <v-checkbox v-model="studentCheckBoxes[index]"/>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ student.name }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-subheader>Vocab Lists</v-subheader>
                  <v-list subheader>
                    <v-list-tile
                      v-for="(list, index) in vocabLists"
                      :key="index">
                      <v-list-tile-action>
                        <v-checkbox v-model="listCheckBoxes[index]" />
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ list.listTitle }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" flat @click="pushList = false">Close</v-btn>
            <v-btn color="blue" :disabled="disabledPushButton" flat @click="pushToStudents()">Push</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { users } from "../firebase";
var firebase = require('firebase');
import listsComponent from "./listsComponent";

export default {
  props: {
    userId: {
      required: true,
      type: String
    }
  },
  components: {
    listsComponent
  },
  data() {
    return {
    showStudentDetails: [],
    students: [],
    vocabLists: [],
    pushList: false,
    studentCheckBoxes: [],
    listCheckBoxes: []
    }
  },
  computed: {
    disabledPushButton() {
      var condition = this.studentCheckBoxes.every(e => { return !e }) ||
                      this.listCheckBoxes.every(e => { return !e })

      return condition
    },
    studentIDsToPushTo() {
      var stus = this.students;
      var boxes = this.studentCheckBoxes;

      var result = [];

      for(var i=0; i<boxes.length; i++) {
        if(boxes[i]) {
          result.push(stus[i].id)
        }
      }

      return result;
    },
    listsToPush() {
      var lists = this.vocabLists;
      var boxes = this.listCheckBoxes;

      var result = [];

      for(var i=0; i<boxes.length; i++) {
        if(boxes[i]) {
          result.push(lists[i])
        }
      }

      return result;
    },
    allStudentsChecked: {
      get: function() {
        var stus = this.students;
        var stuCheckBoxes = this.studentCheckBoxes;
        if(stus.length == stuCheckBoxes.length) {
          for(var i = 0; i<stuCheckBoxes.length; i++) {
            if(typeof stuCheckBoxes[i] == 'undefined' || !stuCheckBoxes[i]) {
              return false;
            }
          }
          return true;
        }
        return false;
      },
      set: function(newValue) {
        //For other calculated values to be reevaluated in a function, 
        //the whole array must be updated
        var stus = this.students;
        var newStuCheckBoxes = [];

        stus.forEach(() => newStuCheckBoxes.push(newValue));

        this.studentCheckBoxes = newStuCheckBoxes;
      }
    }
  },
  firestore() {
    return {
      students: users.where("role", "==", "student"),
      vocabLists: users.doc(this.userId)
                              .collection('wordLists')
                              .orderBy('listTitle')
    } 
  },
  methods: {
    pushToStudents() {
      var em = this;
      var studentIDs = this.studentIDsToPushTo;
      var lists = this.listsToPush;
      
      studentIDs.forEach(id => {
        lists.forEach(list => {
          users.doc(id).collection('wordLists').add({
            languageLevel : list.languageLevel,
            listTitle : list.listTitle,
            subject : list.subject,
            wordCount : list.wordCount,
            created : firebase.firestore.Timestamp.fromDate(new Date()),
            lastChanged : firebase.firestore.Timestamp.fromDate(new Date())
          }).then((docRef) => {
            users.doc(em.userId)
            .collection('wordLists')
            .doc(list.id)
            .collection('words').get().then(words => {
              words.forEach(wordDoc => {
                var word = wordDoc.data();
                docRef.collection('words').add({
                  word: word.word,
                  def: word.def,
                  jpWord: word.jpWord ? word.jpWord : "",
                  jpDef: word.jpDef ? word.jpDef : "",
                  memo: word.memo ? word.memo : "",
                  mnemo: word.mnemo ? word.mnemo : "",
                  languageLevel: word.languageLevel,
                  created: firebase.firestore.Timestamp.fromDate(new Date()),
                  lastChanged: firebase.firestore.Timestamp.fromDate(new Date())
                })
              })
            }).then(() => {
              em.pushList = false;
              em.studentCheckBoxes = [];
              em.listCheckBoxes = [];
            })
          })
        })
      })
    }
  }
}
</script>
