import React, {useState} from "react";
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
import 'react-toastify/dist/ReactToastify.css';
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



const EquipmentCreate = ()=>{

    const [isSubmitting,setSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const classes = useStyles();
    const {register,handleSubmit, formState: { errors }} = useForm();

    const handleCapture = ({ target }) => {
        setSelectedFile(target.files[0]);
        console.log("capture ",selectedFile);
    };
    const account = useSelector((state) => state.account);

    const handleCaptureBanner = ({ target }) => {
        setSelectedBanner(target.files[0]);
        console.log(selectedBanner);
    };
    let history = useHistory();
    const onSubmit = async data => {
        console.log(data);
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("photo", selectedFile);
        formData.append("banner", selectedBanner);
        await WebServices.axiosObject(account.token).post("equipments",formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/equipments`);
            })
            .catch((error) => {
                console.log(error.response)
                let data = error.response.data;
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
        <MainCard title="Add new Equipment">
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
                            <InputLabel htmlFor="outlined-adornment-desc">Description</InputLabel>
                            <OutlinedInput multiline id="outlined-adornment-desc" error={Boolean(errors.description)} {...register("description", { required: true })} type="tel" label="Description" />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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

                    <Grid item md={6} xs={12}>
                        <label>Banner</label>
                        <input accept="image/*" {...register("banner", { required: true })} className={classes.input} id="faceBanner" type="file" onChange={handleCaptureBanner}/>
                        <Tooltip title="Select banner">
                            <label htmlFor="faceBanner">
                                <IconButton className={classes.faceImage} color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera fontSize="large" />
                                </IconButton>
                            </label>
                        </Tooltip>
                        <label>{selectedBanner ? selectedBanner.name : "Select Image"}</label>. . .
                        {Boolean(errors.banner) && (
                            <Typography variant="h5" component="h5" color="error">
                                Upload banner
                            </Typography>
                        )}
                    </Grid>

                </Grid>

                <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                        Create
                    </Button>
                </AnimateButton>
            </form>
            <ToastContainer />
        </MainCard>
    )
}
export default EquipmentCreate;
