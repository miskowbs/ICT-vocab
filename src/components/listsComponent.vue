<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center class="elevation-12"> 
        
        <v-flex xs12>
            <v-card>
                <v-card-title primary-title>
                    <v-flex xs4>
                        <h3 class="headline mb-4">Mitochondria</h3>
                        <h4 class="mb-0">Biology-1B</h4>
                    </v-flex>
                    <v-spacer/>
                    <v-flex xs4>
                        <h4 class="mb-4">Last Viewed: 2018/10/19</h4>
                        <h4 class="mb-0">Last Changed: 2018/10/17</h4>
                    </v-flex>
                    <v-flex xs2>
                        <h3>Words: 46</h3>
                    </v-flex>
                </v-card-title>
            </v-card>
            <v-card>

            </v-card>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'listsComponent',
  props: {
    msg: String
  }
}
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