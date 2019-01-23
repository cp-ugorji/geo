<template>
    <div class="signup container">
        <form class="card-panel" @submit.prevent="signUp">
            <h2 class="center deep-purrple-text">
                Sign Up
            </h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="text" name="email" v-model="email"/>
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password"/>
            </div>
            <div class="field">
                <label for="alias">Alias:</label>
                <input type="text" name="alias" v-model="alias"/>
            </div>
            <p class="red-text center" v-if="feedback">{{ feedback }}</p>
            <div class="field center">
                <button class="btn deep-purple">Sign Up</button>
            </div>

        </form>
    </div>
</template>

<script>
import slugify from 'slugify';
import db from '@/firebase/firebase_init';
import firebase from 'firebase';

export default {
    name: 'Signup',
    data(){
        return{
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null
        }
    },
    methods: {
        signUp(){
            if (this.alias && this.email && this.password) {
                //creating a slug to use as the unique id for user authentication verification
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove:  /[$*_+~.()'"!\-:@]/g,
                    lower: true
                });
                //console.log(this.slug);
                //checking if this slug already exist in the users database
                let ref = db.collection('users').doc(this.slug);
                ref.get().then(doc => {
                    //if the user exist, prompt the error
                    if (doc.exists) {
                        this.feedback = "This alias already exist";
                    } else {
                        //using the authentication services of firebase
                        //create the user on the platform with the passed in username and password
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        //if the user authentication creation was successful without error, 
                        .then(cred => {
                             //console.log(cred);
                             //console.log(cred.user);
                             //console.log(cred.user.uid);
                            //go to the users database and save the alias, geolocation and the auto-generated
                            //user_id from the created authentication
                            ref.set({
                                alias: this.alias,
                                geolocation: null,
                                user_id: cred.user.uid //randomly generated uid from the authentication created for the user
                            });
                        })
                        //if the save of the user in users database is successful,
                        .then(() => {
                            //route our page to GMap
                            this.$router.push({
                                name: 'GMap'
                            })
                        })
                        //incase of eny error, output it in feedback
                        .catch(err => {
                            console.log(err);
                            this.feedback = err.message;
                        });
                        //this.feedback = "This alias is free to use";
                    }
                })
            }else{
                this.feedback = "You must enter an alias";
            }
        }
    }
}
</script>

<style>
.signup{
    max-width: 400px;
    margin-top: 60px;
}
.signup h2{
    font-size: 2.5em;
}

.signup .field{
    margin-bottom: 16px;
}
</style>

