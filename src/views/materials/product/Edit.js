import React, {useEffect, useState} from "react";
import MainCard from "../../../component/cards/MainCard";
import {Button, FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import AnimateButton from "../../../component/extended/AnimateButton";
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
import WebServices from "../../../utils/WebServices";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import configData from "../../../config";
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



const MaterialProductEdit = (props)=>{

    const [isSubmitting,setSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [materials,setMaterials] = useState([]);
    const [material,setMaterial] = useState("");
    const classes = useStyles();
    const {register,handleSubmit, formState: { errors },setValue} = useForm();


    const handleCapture = ({ target }) => {
        setSelectedFile(target.files[0]);
    };
    const account = useSelector((state) => state.account);

    let history = useHistory();

    const onSubmit = async data => {
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("material", data.material);
        formData.append("price", data.price);
        formData.append("discount", data.discount);
        formData.append("target_quantity", data.target_quantity);
        formData.append("photo", selectedFile);
        setSubmitted(true);
        await WebServices.axiosObject(account.token).put(`${configData.API_SERVER}material-products/${props.id}`,formData)
            .then((response)=>{
                console.log(response);
                setSubmitted(false);
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/material-products`);
            })
            .catch((error)=>{
                console.log(error);
                setSubmitted(false);
            })
    }

    const fetchMaterial = async ()=>{
        await WebServices.axiosObject(account.token).get(configData.API_SERVER + 'materials')
            .then((response)=>{
                setMaterials(response.data.data);
            })
            .catch(function (error) {
                console.log('error - ', error);
            });
    }

    const fetchProduct = async ()=>{
        await WebServices.axiosObject(account.token).get(`material-products/${props.id}`)
            .then((response)=>{
                console.log(response.data.data);
                setValue('name', response.data.data.name, { shouldValidate: true })
                setValue('price', response.data.data.price, { shouldValidate: true })
                setValue('discount', response.data.data.discount, { shouldValidate: true })
                setValue('material', response.data.data.material)
                setValue('target_quantity', response.data.data.target_quantity)
                setMaterial(response.data.data.material);
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    useEffect(()=>{
        fetchMaterial().then()
        fetchProduct()
    },[])

    return (
        <MainCard title="Edit Material Product">
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
                            <InputLabel id="demo-simple-select-label">Material</InputLabel>
                            <Select  labelId="select-material" id="select-category" value={material} label="Category"
                                    onChange={(event)=>{
                                        setMaterial(event.target.value);
                                    }}>
                                {materials.map((mat,index)=>
                                    <MenuItem value={mat._id}>{mat.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>


                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"10px"}}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Price</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.price)} {...register("price", { required: true,min:0 })} type="number"  label="Enter price" />
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Discount</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.discount)} {...register("discount", { required: true,min:0,max:90 })} type="number" defaultValue={0} inputProps={{ min: 0, max: 90 }} label="Enter discount" />
                        </FormControl>
                    </Grid>

                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"10px"}}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Target Quantity</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.target_quantity)} {...register("target_quantity", { required: true,min:1 })} type="number" inputProps={{ min: 1}} label="Enter target quantity" />
                        </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <label>Photo</label>
                        <input accept="image/*"  {...register("photo")} className={classes.input} id="faceImage" type="file" onChange={handleCapture}/>
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
                <AnimateButton style={{marginTop:"10px"}}>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                        Update
                    </Button>
                </AnimateButton>
            </form>
            <ToastContainer />
        </MainCard>
    )
}
export default MaterialProductEdit;
