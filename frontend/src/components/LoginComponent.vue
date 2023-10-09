<template>
<div v-if="loggedIn">
    <b-button type="button" @click="logout()">Logout</b-button>
    <h2>Logged in as {{account.name}}</h2>
</div>

<!-- Login modal -->
<div class="container" v-if="!loggedIn">
    <div>
        <b-button v-b-modal.login>Login</b-button>

        <b-modal hide-footer="true" id="login" title="Login">
            <div v-if="this.loginMsg" class="alert alert-danger" role="alert">{{ this.loginMsg }}</div>
            <div class="modal-content">
                <div class="modal-body" style="padding:40px 50px;">
                    <form role="form">
                        <div class="form-group">
                            <label for="loginUsrname"> Email</label>
                            <input type="loginEmail" class="form-control" id="loginUsrname" v-model="input.email" placeholder="Enter email">
                        </div>
                        <div class="form-group">
                            <label for="psw"> Password</label>
                            <input type="password" class="form-control" id="loginPsw" v-model="input.password" placeholder="Enter password">
                        </div>
                        <button @click="login()" type="button" id="loginBtn" class="btn btn-success btn-block"> Login</button>
                    </form>
                </div>
            </div>
        </b-modal>
    </div>
</div>

<div class="container" v-if="loggedIn">
    <!-- user settings modal -->
    <b-button v-b-modal.userSettings>Settings</b-button>
    <b-modal hide-footer="true" id="userSettings" title="User Settings">
        <div v-if="this.settingsErrorMsg" class="alert alert-danger" role="alert">{{ this.settingsErrorMsg }}</div>
        <div v-if="this.settingsOkMsg" class="alert alert-success" role="alert">{{ this.settingsOkMsg }}</div>
        <div class="modal-content">
            <div class="modal-body" style="padding: 40px 50px;">
                <form role="form">
                    <!-- New Password -->
                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input type="password" class="form-control" id="newPassword" v-model="user.newPassword" placeholder="Enter new password" required>
                    </div>
                    <button @click="changePassword()" type="button" id="changePswdBtn" class="btn btn-primary btn-block">Change Password</button>
                </form>
            </div>
        </div>
    </b-modal>
</div>
</template>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'LoginComponent',
    computed: {
        ...mapState(['loggedIn']),
    },
    data() {
        return {
            input: {
                email: "",
                password: "",
            },
            account: {
                name: "",
            },
            user: {
                newPassword: "",
            },
            settingsErrorMsg: "",
            settingsOkMsg: "",
            loginMsg: "",
        }
    },
    methods: {
        toggleLogin() {
            this.$store.commit('toggleLoggedIn');
        },
        async login() {
            try {
                const res = await fetch('https://lahepela-wom-project.azurewebsites.net/users/login', {
                //const res = await fetch('http://localhost:3030/users/login', {
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
                console.log(resJson);
                if (resJson.msg == "ERROR") {
                    this.loginMsg = resJson.error;
                    console.log(this.loginMsg);
                } else {
                    this.account.name = resJson.userEmail.split('@')[0];
                    this.toggleLogin();
                    localStorage.setItem('jwt_token', resJson.token);
                    this.loginMsg = "";
                }
            } catch (e) {
                console.log(e);
            }

        },
        async changePassword() {
            try {
                const jwt = JSON.parse(atob(localStorage.getItem('jwt_token').split('.')[1]));
                const res = await fetch(`https://lahepela-wom-project.azurewebsites.net/changePassword/${jwt.sub}`, {
                //const res = await fetch(`http://localhost:3030/changePassword/${jwt.sub}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('jwt_token')}`
                    },
                    body: JSON.stringify({
                        newPassword: this.user.newPassword,
                        oldPassword: this.user.oldPassword,
                    })
                });
                const resJson = await res.json();
                console.log(resJson);
                if (resJson.msg === "ERROR") {
                    this.settingsErrorMsg = resJson.error;
                    console.log(this.settingsErrorMsg);
                } else {
                    this.settingsErrorMsg = "";
                    this.settingsOkMsg = resJson.msg;
                }
            } catch (e) {
                console.log(e);
            }
        },
        logout() {
            localStorage.removeItem('jwt_token');
            this.toggleLogin();
        },

    },

    // Checks if a user has a JWT token in local storage, keeps a user logged in.
    mounted: function () {
        this.$nextTick(async function () {
            if (localStorage.getItem('jwt_token')) {
                console.log("jwt token found");
                try {
                    const jwt = JSON.parse(atob(localStorage.getItem('jwt_token').split('.')[1]));
                    console.log('Still logged in as: ' + jwt.email);
                    this.account.name = jwt.email.split('@')[0];
                    this.toggleLogin();
                } catch (e) {
                    console.log(e);
                    this.logout();
                }
            }
        })
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
#registerBtn,
#changePswdBtn {
    margin-top: 30px;
}

#loginMsg {
    color: red;
}

#regMsg {
    color: red;
}

h2 {
    font-size: 20px;
}
</style>
