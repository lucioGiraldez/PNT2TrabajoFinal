import axios from 'axios'

const API_UTILIZADA = 'https://www.weatherapi.com/'

export const getClima = () => axios.get(API_UTILIZADA)
export const getClimaPorId = (id) => axios.get(`${API_UTILIZADA}/${id}`)
export const postClima = (climaACrear) => axios.post(API_UTILIZADA, climaACrear)
export const putClima = (id, climaAActualizar) => axios.put(`${API_UTILIZADA}/${id}`, climaAActualizar)
export const deleteClima = (id) => axios.delete(`${API_UTILIZADA}/${id}`)