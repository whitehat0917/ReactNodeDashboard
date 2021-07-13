import AuthService from './auth.service';

export default function authHeader() {
    const user = AuthService.getCurrentUser();

    if (user && user.accessToken) {
        // for Node.js Express back-end
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
}