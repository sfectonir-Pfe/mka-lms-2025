import axios from "axios"

const apiUrl= process.env.REACT_APP_URL
export const api=axios.create({baseURL:"https://htqr4jqc-8000.euw.devtunnels.ms/"})