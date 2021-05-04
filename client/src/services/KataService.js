import { http } from './HttpService.js';

export function getAllKatas() {
  return http().get('/Kata?populate');
}

export function getKataById(id) {
  return http().get(`/Kata/${id}`);
}

export function createKata(kata) {
  return http().post('/Kata', kata);
}

export function deleteKata(id) {
  return http().delete(`/Kata/${id}`);
}

export function getAllWorkshops() {
  return http().get('/Workshop?populate');
}

export function getWorkshopById(id) {
  return http().get(`/Workshop/${id}`);
}

export function createWorkshop(workshop) {
  return http().post('/Workshop', workshop);
}

export function deleteWorkshop(id) {
  return http().delete(`/Workshop/${id}`);
}
// TODO: figure out which update type to use
// export function updateKata(kata){
//     return http().put('/Kata',Kata);
// }
