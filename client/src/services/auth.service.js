import axios from "axios";
import { config } from '../config.js';

const API_URL = "http://" + config.serverAddress + "/api/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    const now = new Date();
                    const item = {
                        value: response.data,
                        expiry: now.getTime() + 6000000
                    }
                    localStorage.setItem("user", JSON.stringify(item));
                    localStorage.setItem('server', response.data.server);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        const itemStr = localStorage.getItem('user');

        // if the item doesn't exist, return null
        if (!itemStr) {
            return null;
        }

        const item = JSON.parse(itemStr);
        const now = new Date();

        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            localStorage.removeItem("user");
            return null;
        }
        return item.value;
    }

    getServer() {
        return localStorage.getItem('server');
    }
}

export default new AuthService();