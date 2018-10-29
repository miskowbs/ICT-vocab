<template>
  <v-container fluid grid-list-lg class="elevation-12 ma-0"> 
    <v-layout row align-center> 
        <v-flex xs12>
            <v-card>
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline mb-auto">Mitochondria</h3>
                        <h4 class="mb-auto">Biology-1B</h4>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-auto">Last Viewed: 2018/10/19</h4>
                        <h4 class="mb-auto">Last Changed: 2018/10/17</h4>
                    </v-flex>
                    <v-flex xs2>
                        <h3>Words: 46</h3>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout row align-center > 
        <v-flex xs12>
            <v-card>
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline auto">Mitochondria</h3>
                        <h4 class="mb-auto">Biology-1B</h4>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-auto">Last Viewed: 2018/10/19</h4>
                        <h4 class="mb-auto">Last Changed: 2018/10/17</h4>
                    </v-flex>
                    <v-flex xs2>
                        <h3>Words: 46</h3>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout row align-center > 
        <v-flex xs12>
            <v-card>
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline mb-auto">Mitochondria</h3>
                        <h4 class="mb-auto">Biology-1B</h4>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-auto">Last Viewed: 2018/10/19</h4>
                        <h4 class="mb-auto">Last Changed: 2018/10/17</h4>
                    </v-flex>
                    <v-flex xs2>
                        <h3>Words: 46</h3>
                    </v-flex>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
    <v-dialog
        v-model="newList"
    >
        <v-card>
          <v-card-title>
            <span class="headline">New List</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="List Name*" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Subject"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="['en', 'someJp', 'jp']"
                    label="Language Level*"
                    required
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="newList = false">Close</v-btn>
            <v-btn color="blue darken-1" flat @click.native="newList = false">Save</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-btn
        color="pink"
        dark
        small
        sticky
        top
        right
        fab
        @click="newList = true">
        <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { users } from "../firebase";

export default {
  name: "listsComponent",
  props: {},
  data() {
    return {
      newList: false
    };
  },
  firestore() {
    return {
      users: users
    }
  },
    methods: {
        addList() {

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