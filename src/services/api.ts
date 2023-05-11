import axios from "axios";

const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2/"
})

export const AddLeadingZeros = (number: number) => {
    return Math.floor(number).toString().padStart(5, "0");
}

export default api