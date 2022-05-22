import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Button, FormControl, InputLabel, OutlinedInput} from "@mui/material";
import MainCard from "../../../component/cards/MainCard";
import AnimateButton from "../../../component/extended/AnimateButton";
import {toast, ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router-dom";
import WebServices from "../../../utils/WebServices";
import 'react-toastify/dist/ReactToastify.css';

const AttributeEdit = (props)=>{
    const [isSubmitting,setSubmitted] = useState(false);
    const account = useSelector((state) => state.account);
    const {register,handleSubmit, formState: { errors },setValue } = useForm();
    let history = useHistory();


    const onSubmit = async data => {
        console.log(data);
        let formData = new FormData();
        formData.append("name",data.name);
        formData.append("values",data.values);
        formData.append("identification",data.identification);
        setSubmitted(true);
        await WebServices.axiosObject(account.token).put(`attributes/${props.id}`,formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/attributes`);
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
        WebServices.axiosObject(account.token).get(`attributes/${props.id}`)
            .then((response)=>{
                setValue('name', response.data.data.name, { shouldValidate: true })
                setValue('identification', response.data.data.identification, { shouldValidate: true })
                setValue('values', response.data.data.values, { shouldValidate: true })
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
    },[])
    return (
        <MainCard title="Edit Material Attribute">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-email-login">Name</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.name)} {...register("name", { required: true })} type="text"  label="Enter name" />
                        </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-email-login">Values(Comma separated)</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.values)} {...register("values", { required: true })} type="text"  label="Enter values" />
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-identification">identification</InputLabel>
                            <OutlinedInput id="outlined-adornment-identification" error={Boolean(errors.identification)} {...register("identification", { required: true })}  type="text"  label="Enter identification" />
                        </FormControl>
                    </Grid>

                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"20px"}}>
                    <Grid item md={6} xs={12}>
                        <AnimateButton>
                            <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                Update
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer />
        </MainCard>
    )
}

export default AttributeEdit
