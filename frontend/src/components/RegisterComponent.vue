<template>
<!-- Register modal -->
<div class="container" v-if="!loggedIn">
    <div>
        <b-button v-b-modal.Register>Register</b-button>

        <b-modal hide-footer="true" id="Register" title="Register">
            <div v-if="regMsg.includes('email') || regMsg.includes('Password')" class="alert alert-danger" role="alert">{{ this.regMsg }}</div>
            <div v-if="regMsg.includes('User')" class="alert alert-success" role="alert">{{ this.regMsg }} <a data-bs-dismiss="modal" v-b-modal.login>Please Login</a></div>
            <div class="modal-content">
                <div class="modal-body" style="padding:40px 50px;">
                    <form role="form">
                        <div class="form-group">
                            <label for="regUsrname"> Email</label>
                            <input type="email" class="form-control" id="regUsrname" v-model="input.email" placeholder="example@gmail.com">
                        </div>
                        <div class="form-group">
                            <label for="regPsw"> Password</label>
                            <input type="password" class="form-control" id="regPsw" v-model="input.password" placeholder="Enter password">
                        </div>
                        <button @click="register()" type="button" id="registerBtn" class="btn btn-success btn-block"> Register</button>
                    </form>
                </div>
            </div>
        </b-modal>
    </div>
</div>
</template>

    
<script>
import {mapState} from 'vuex';

export default {
    name: 'RegisterComponent',
    computed: {
        ...mapState(['loggedIn']),
    },
    data() {
        return {
            input: {
                email: "",
                password: "",
            },
            regMsg: ""
        }
    },
    methods: {
        async register() {
            if (!this.input.email.includes('@')) {
                this.regMsg = "You need to provide a valid email address.";
                return;
            }
            if (this.input.password.length < 5) {
                this.regMsg = "Password must be longer than 5 symbols.";
                return;
            }
            try {
                const res = await fetch('http://localhost:3030/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.input.email,
                        password: this.input.password
                    })
                });
                const resJson = await res.json();
                if (resJson.msg == "ERROR") {
                    this.regMsg = resJson.error;
                } else {
                    this.regMsg = resJson.msg;
                    this.registered = true;
                }
            } catch (e) {
                console.log(e);
            }
        },
    }
}
</script>

    
<style scoped>
#header {
    font-family: fantasy;
}

h4,
.close {
    background-color: #4782ff;
    color: white !important;
    text-align: center;
    font-size: 30px;
}

#loginBtn,
#registerBtn {
    margin-top: 30px;
}

#loginMsg {
    color: red;
}

#regMsg {
    color: red;
}
</style>
