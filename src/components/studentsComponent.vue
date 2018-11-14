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
          slot="header"
          @click="viewStudentsList(index)">
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
          <!-- TODO: Put Lists Component here
          Factor in that if something is added/changed
          here, that it will not be reflected in the last
          seen fields -->
          
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script>
import { users } from "../firebase";
var firebase = require('firebase');
import listsComponent from "./listsComponent";

export default {
  props: {

  },
  data() {
    return {
    showStudentDetails: [],
    students: []
    }
  },
  firestore() {
    return {
      students: users.where("role", "==", "student")
    } 
  },
  methods: {
    viewStudentsList(index) {

    }
  }
}
</script>
