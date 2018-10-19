<template>
  <v-app>
    
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar
      :tile='tile'
      :size='avatarSize'
      color='grey lighten-4'
      >
        <img src="./assets/photo.jpg" alt="avatar">
      </v-avatar>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <HelloWorld/>
      <listsComponent/>
    </v-content>
    
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import listsComponent from "./components/listsComponent";

export default {
  name: "App",
  components: {
    HelloWorld,
    listsComponent
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ICT Vocab",
      tile: false
    };
  },
  computed: {
    avatarSize() {
      return "35px";
      //for the time being, keep it this way.
    }
  }
};
</script>
