import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import {Button, FormControl, InputLabel, OutlinedInput} from "@mui/material";
import MainCard from "../../../component/cards/MainCard";
import {useForm} from "react-hook-form";
import AnimateButton from "../../../component/extended/AnimateButton";
import WebServices from "../../../utils/WebServices";
import {toast, ToastContainer} from "react-toastify";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const ServiceQuestionCreate = (props)=>{
    const [isSubmitting,setSubmitted] = useState(false);
    const account = useSelector((state) => state.account);
    const {register,handleSubmit, formState: { errors }} = useForm();
    let history = useHistory();

    const onSubmit = async data => {
        console.log(data);
        setSubmitted(true)
        let formData = new FormData();
        formData.append("question",data.question);
        formData.append("options",data.options);
        formData.append("service",props.id);
        await WebServices.axiosObject(account.token).post("service-questions",formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/services/${props.id}/questions`);
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
    return (
        <MainCard title="Add new Service Question">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-email-login">Question</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.question)} {...register("question", { required: true })} type="text"  label="Enter question" />
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="outlined-adornment-email-login">Options(comma separated)</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.options)} {...register("options", { required: true })} type="text"  label="Enter options" />
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
export default ServiceQuestionCreate
