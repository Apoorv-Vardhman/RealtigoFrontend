import React, {useEffect, useState} from "react";
import MainCard from "../../component/cards/MainCard";
import {Button, FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import AnimateButton from "../../component/extended/AnimateButton";
import Grid from '@mui/material/Grid';
import IconButton from "@mui/material/IconButton";
import {PhotoCamera} from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
import Tooltip from "@mui/material/Tooltip";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import Typography from "@mui/material/Typography";
import {useSelector} from "react-redux";
import WebServices from "../../utils/WebServices";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import configData from "../../config";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: "none",
    },
    faceImage: {
        color: theme.palette.primary.light,
    },
}));



const SliderCreate = ()=>{

    const [isSubmitting,setSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [type,setType] = useState('');
    const classes = useStyles();
    const {register,handleSubmit, formState: { errors }} = useForm();

    const handleCapture = ({ target }) => {
        setSelectedFile(target.files[0]);
        console.log("capture ",selectedFile);
    };
    const account = useSelector((state) => state.account);

    let history = useHistory();

    const onSubmit = async data => {
        console.log(data);
        let formData = new FormData();
        formData.append("type",data.type);
        formData.append("photo", selectedFile);
        setSubmitted(true)
        await WebServices.axiosObject(account.token).post("sliders",formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/sliders`);
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

    const handleChange = (event)=>{
        setType(event.target.value)
    }


    return (
        <MainCard title="Add new Slider">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select {...register("type", { required: true })} error={Boolean(errors.type)}  labelId="select-type" id="select-type" value={type} label="type"
                                    onChange={handleChange}>
                                <MenuItem value="material">Material</MenuItem>
                                <MenuItem value="equipment">Equipment</MenuItem>
                                <MenuItem value="services">Services</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <label>Photo</label>
                        <input accept="image/*"  {...register("photo", { required: true })} className={classes.input} id="faceImage" type="file" onChange={handleCapture}/>
                        <Tooltip title="Select Image">
                            <label htmlFor="faceImage">
                                <IconButton className={classes.faceImage} color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera fontSize="large" />
                                </IconButton>
                            </label>
                        </Tooltip>
                        <label>{selectedFile ? selectedFile.name : "Select Image"}</label>. . .
                        {Boolean(errors.photo) && (
                            <Typography variant="h5" component="h5" color="error">
                                Upload Photo
                            </Typography>
                        )}

                    </Grid>
                </Grid>


                <div style={{marginTop:"10px"}}>
                    <AnimateButton >
                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                            Create
                        </Button>
                    </AnimateButton>
                </div>
            </form>
            <ToastContainer />
        </MainCard>
    )
}
export default SliderCreate;
