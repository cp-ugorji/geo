<template>
    <div class="map">
        <h2>Stealth Map</h2>
        <div class="google-map" id="map">

        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import db from '@/firebase/firebase_init';
export default {
    name: 'GMap',
    data(){
        return{
            //this longitude and latitude is the area of the map 
            //that will be used to center the map
            lat: 53,
            lng: -2,
        }
    },
    methods: {
        //function to render google map
        renderMap(){
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: this.lat, lng: this.lng},
                zoom: 6,
                maxZoom: 15,
                minZoom: 3,
                streetViewControl: false
            });
            //get all users on the database and 
            //display their location on the map as markers/pointers
            db.collection('users').get()
            .then(users => {
                users.docs.forEach(doc => {
                    let data = doc.data();
                    if (data.geolocation) {
                        let marker = new google.maps.Marker({
                            position: {
                                lat: data.geolocation.lat,
                                lng: data.geolocation.lng
                            },
                            map
                        })
                        //add click event to marker
                        marker.addListener('click', () => {
                            console.log(doc.id);
                            this.$router.push({ name: 'ViewProfile', params: { id: doc.id }})
                        })
                    }
                })
            })
        }
    },
    mounted(){

        let user = firebase.auth().currentUser;
        console.log(user);

        //get user geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.lat = pos.coords.latitude;
                this.lng = pos.coords.longitude;
                //find user record then update user coordinates
                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                   snapshot.forEach((doc) => {
                       console.log(doc.id);//thi is the slug
                       //updating the record in the database
                       db.collection('users').doc(doc.id).update({
                           geolocation: {
                               lat: pos.coords.latitude,
                               lng: pos.coords.longitude
                           }
                       });
                   }); 
                })
                .then(() => {
                    this.renderMap();
                })

                //center the map around user location
                this.renderMap();
            }, (err) => {
                console.log(err);
                this.renderMap();
            }, {
                maximumAge: 60000,
                timeout: 3000
            })
        } else {
            this.renderMap();
        }
        //callint the google map to be rendered as soon as it's mounted
        //this.renderMap();
        //note that whenever one sign up, the user is automatically logged in
        //console.log(firebase.auth().currentUser);
    },
    
}
</script>

<style>
.google-map{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    /* this, places the map behind the navbar 
    else it will overflow over the navbar because 
    of the absolute positioning*/
    z-index: -1;
}
</style>
