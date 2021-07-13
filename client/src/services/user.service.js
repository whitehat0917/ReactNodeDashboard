import axios from 'axios';
import authHeader from './auth-header';
import authService from './auth.service';
import { config } from '../config.js';

const API_URL = 'http://' + config.serverAddress + '/api/test/';

class UserService {
    getDashboardData() {
        return axios.post(API_URL + 'getDashboardData', { server: authService.getServer() }, { headers: authHeader() });
    }

    getAvailableIpList() {
        return axios.post(API_URL + 'getAvailableIpList', { server: authService.getServer() }, { headers: authHeader() });
    }

    getProxyHistory() {
        return axios.post(API_URL + 'getProxyHistory', { server: authService.getServer() }, { headers: authHeader() });
    }

    getUsedProxy() {
        return axios.post(API_URL + 'getUsedProxy', { server: authService.getServer() }, { headers: authHeader() });
    }

    getUsers() {
        return axios.post(API_URL + 'getUsers', { server: authService.getServer() }, { headers: authHeader() });
    }

    getUserProxy(userid) {
        return axios.post(API_URL + 'getUserProxy', { userid: userid, server: authService.getServer() }, { headers: authHeader() });
    }

    getBlacklist() {
        return axios.post(API_URL + 'getBlacklist', { server: authService.getServer() }, { headers: authHeader() });
    }

    addBlacklist(url) {
        return axios.post(API_URL + 'addBlacklist', { url: url, server: authService.getServer() }, { headers: authHeader() });
    }

    editBlacklist(id, url) {
        return axios.post(API_URL + 'editBlacklist', { id: id, url: url, server: authService.getServer() }, { headers: authHeader() });
    }

    addUserProxy(userid, port, days, count, type, sdate) {
        return axios.post(API_URL + 'addUserProxy', { userid: userid, port: port, days: days, count: count, type: type, sdate: sdate, server: authService.getServer() }, { headers: authHeader() });
    }

    editUserProxy(id, port, days, type, sdate) {
        return axios.post(API_URL + 'editUserProxy', { id: id, port: port, days: days, type: type, sdate: sdate, server: authService.getServer() }, { headers: authHeader() });
    }

    addUser(username, password) {
        return axios.post(API_URL + 'addUser', { username: username, password: password, server: authService.getServer() }, { headers: authHeader() });
    }

    addIp(id, startIp, count, subnet) {
        return axios.post(API_URL + 'addIp', { id: id, startIp: startIp, count: count, subnet: subnet, server: authService.getServer() }, { headers: authHeader() });
    }

    setMaxIp(count) {
        return axios.post(API_URL + 'setMaxIp', { count: count, server: authService.getServer() }, { headers: authHeader() });
    }

    deleteIp(startIp, count, subnet) {
        return axios.post(API_URL + 'deleteIp', { startIp: startIp, count: count, subnet: subnet, server: authService.getServer() }, { headers: authHeader() });
    }

    deleteBlacklist(url) {
        return axios.post(API_URL + 'deleteBlacklist', { url: url, server: authService.getServer() }, { headers: authHeader() });
    }

    deleteUser(userid) {
        return axios.post(API_URL + 'deleteUser', { userid: userid, server: authService.getServer() }, { headers: authHeader() });
    }

    deleteUserProxy(id) {
        return axios.post(API_URL + 'deleteUserProxy', { id: id, server: authService.getServer() }, { headers: authHeader() });
    }

    getServers() {
        return axios.post(API_URL + 'getServers', { server: authService.getServer() }, { headers: authHeader() });
    }

    deleteServer(id) {
        return axios.post(API_URL + 'deleteServer', { id: id, server: authService.getServer() }, { headers: authHeader() });
    }

    addServer(address, password, tag) {
        return axios.post(API_URL + 'addServer', { address: address, password: password, tag:tag, server: authService.getServer() }, { headers: authHeader() });
    }

    editServer(id, address, password, tag) {
        return axios.post(API_URL + 'editServer', { id: id, address: address, password: password, tag: tag, server: authService.getServer() }, { headers: authHeader() });
    }

    downloadFile(userid) {
        return axios({
            url: API_URL + 'downloadFile?userid=' + userid + "&server=" + authService.getServer(),
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ProxyFile.txt');
            document.body.appendChild(link);
            link.click();
        });
    }

    deleteUserAllProxy(id) {
        return axios.post(API_URL + 'deleteUserAllProxy', { id: id, server: authService.getServer() }, { headers: authHeader() });
    }

    deleteAllIp() {
        return axios.post(API_URL + 'deleteAllIp', { server: authService.getServer() }, { headers: authHeader() });
    }

    setUserNotes(notes, userid) {
        return axios.post(API_URL + 'setUserNotes', { userid: userid, notes: notes, server: authService.getServer() }, { headers: authHeader() });
    }
}

export default new UserService();