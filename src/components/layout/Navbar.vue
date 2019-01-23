<template>
    <div class="navbar">
        <nav class="deep-purple darken-1">
            <div class="container">
                <!--breand-logo pushes the <a> tag a little to the left of the navbar
                    but to ensure it remains at the left, we just have to use the left 
                    class of materialise-->
                <router-link :to="{ name : 'GMap' }" class="brand-logon left">Stealth Geo</router-link>
                <!--aligning the unordered list to the right-->
                <ul class="right">
                    <li v-if="!user"><router-link :to="{ name : 'Signup' }">Sign Up</router-link></li>
                    <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
                    <li v-if="user"><a>{{ user.email }}</a></li>
                    <li v-if="user"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase';

    export default{
        name: 'Navbar',
        data(){
            return{
                user: null
            }
        },
        methods:{
            logout(){
                firebase.auth().signOut().then(() => {
                    this.$router.push({ name: 'Login' });
                })
            }
        },
        created() {
            //let user = firebase.auth().currentUser;
            //this is to constantly watch the state of users 
            //if they are logged in or not
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.user = user;
                    console.log(this.user);
                } else {
                    this.user = null;
                    console.log(this.user);
                }
            })
        },
    }
</script>

<style>

</style>
