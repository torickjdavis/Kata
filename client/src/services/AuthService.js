import store from '../store';
import { http } from './HttpService';
import jwt from 'jsonwebtoken';

export function isLoggedIn() {
  const token = localStorage.getItem('token');
  return token != null;
}

export function login(user) {
  return http()
    .post('/login', user)
    .then((res) => {
      if (res) {
        setToken(res.data.accessToken);
      }
    });
}
// export function verifyEmail(uniqueString) {
//   return http().get(`/verify/${uniqueString}`);
// }
export function validatePassword(user) {
  return http().post('/validate', user);
}

export function logout() {
  localStorage.clear();
  store.dispatch('authenticate');
}

export function registerUser(user) {
  return http().post('/User', user);
}

export function getUserId() {
  const token = decodeToken();
  if (!token) {
    return null;
  }
  return token.id;
}

export function getName() {
  const token = decodeToken();
  if (!token) {
    return null;
  }
  return token.name.full;
}

function setToken(token) {
  localStorage.setItem('token', token);
  store.dispatch('authenticate');
}

function decodeToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return jwt.decode(token);
}
