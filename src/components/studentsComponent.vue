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
                    <v-list-tile
                      v-for="(student, index) in students"
                      :key="index">
                      <v-list-tile-action>
                        <v-checkbox v-model="studentCheckBoxes[index]" />
                      </v-list-tile-action>
                      <v-list-tile-content @click="studentCheckBoxes[index] != studentCheckBoxes[index]">
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
                      <v-list-tile-content @click="listCheckBoxes[index] != listCheckBoxes[index]">
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
    pustToStudents() {
      //TODO: push a list to the students
      this.pushList = false;
    }
  }
}
</script>
