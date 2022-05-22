import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Button, FormControl, InputLabel, OutlinedInput} from "@mui/material";
import MainCard from "../../../../component/cards/MainCard";
import AnimateButton from "../../../../component/extended/AnimateButton";
import {toast, ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import WebServices from "../../../../utils/WebServices";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configData from "../../../../config";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const MaterialAttributeCreate = (props)=>{
    const [isSubmitting,setSubmitted] = useState(false);
    const account = useSelector((state) => state.account);
    const [attributes,setAttributes] = useState([]);
    const [attribute,setAttribute] = useState("");
    const {register,handleSubmit, formState: { errors }} = useForm();
    let history = useHistory();
    const onSubmit = async data => {
        console.log(data);
        let formData = new FormData();
        formData.append("product",props.id);
        formData.append("attribute",data.attribute);
        formData.append("value",data.value);
        setSubmitted(true);
        await WebServices.axiosObject(account.token).post("product-attributes",formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/material-products/${props.id}/attributes`);
            })
            .catch((error) => {
                console.log(error.response)
                let data = error.response.data;
                setSubmitted(false);
                if("error" in data)
                {
                    toast(`${data.error}`, {position: "bottom-center", autoClose: 2000});
                }
                else
                {
                    toast(`${data.message}`, {position: "bottom-center", autoClose: 2000});
                }
            })
    }

    useEffect(()=>{
        try {
            axios
                .get( configData.API_SERVER + 'attributes', { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    setAttributes(response.data.data);
                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[])

    const handleChange = (event)=>{
        setAttribute(event.target.value)
    }

    return (
        <MainCard title="Add new Product Material Attribute">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Attribute</InputLabel>
                            <Select {...register("attribute", { required: true })} error={Boolean(errors.attribute)}  labelId="select-attribute" id="select-attribute" value={attribute} label="Category"
                                    onChange={handleChange}>
                                {attributes.map((attribute,index)=>
                                    <MenuItem value={attribute._id}>{attribute.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-email-login">Value</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.value)} {...register("value", { required: true })} type="text"  label="Enter value" />
                        </FormControl>
                    </Grid>

                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"20px"}}>
                    <Grid item md={6} xs={12}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                Create
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer />
        </MainCard>
    )
}

export default MaterialAttributeCreate
