import { http } from './HttpService.js';
export function getUserById(id) {
  return http().get(`/User/${id}`);
}

export function getKatasByUserId(id) {
  return http().get(`/userKatas/${id}`);
}

export function updateUser(id, update, token) {
  return http().patch(`/User/${id}`, update, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getSubmissions(id, token) {
  return http().get(`/submissions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export function getSubmissionById(id, submissionId, token) {
  return http().get(`/submission/${id}/${submissionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
