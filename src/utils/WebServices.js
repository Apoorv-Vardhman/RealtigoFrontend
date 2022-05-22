import configData from "../config";
const axios = require("axios");

const axiosObject = (token)=> axios.create({
    baseURL: configData.API_SERVER ,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
    },
});

export default {axiosObject}
