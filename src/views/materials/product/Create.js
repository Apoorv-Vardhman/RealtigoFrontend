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



const MaterialProductCreate = ()=>{

    const [isSubmitting,setSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [materials,setMaterials] = useState([]);
    const [material,setMaterial] = useState("");
    const [materialAttributes,setMaterialAttribute]= useState([]);

    const classes = useStyles();
    const {register,handleSubmit, formState: { errors }} = useForm();


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
        await WebServices.axiosObject(account.token).post("material-products",formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/material-products`);
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

    const handleAttribute = (e,index)=>{
        let r = [...materialAttributes];
        r[index].value = {}
        const updatedData = materialAttributes.map((data,i)=>{
            if(index===i)
            {
                let name = data.name;
                let value = e.target.value;
                let finalValue = name+"_"+value;
                console.log("finalValue",finalValue)
                return Object.assign(data,{["value"]:finalValue});
            }
            else
            {
                return data;
            }
        });
        setMaterialAttribute(updatedData)
    }

    const handleChange = (event)=>{
        setMaterial(event.target.value);
    }

    useEffect(()=>{
        try {
            axios
                .get( configData.API_SERVER + 'materials', { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    console.log(response.data.data)
                    setMaterials(response.data.data);
                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[])

    return (
        <MainCard title="Add new Material Product">
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
                            <Select {...register("material", { required: true })} error={Boolean(errors.material)}  labelId="select-material" id="select-category" value={material} label="Category"
                                    onChange={handleChange}>
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
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.target_quantity)} {...register("target_quantity", { required: true,min:1 })} type="number" defaultValue={100} inputProps={{ min: 1}} label="Enter target quantity" />
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
                {materialAttributes.map((row,index)=>(
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginBottom:"10px"}}>
                        <Grid item md={4} xs={12}>
                            {`${row.name} (${row.identification})`}
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Value</InputLabel>
                                <Select {...register(`attribute${index}`, { required: true })} value={row.attrs.value}   labelId="select-attribute"   label="Category"
                                        onChange={(e)=>handleAttribute(e,index)}>
                                    {row.attrs.map((attr,index)=>
                                        <MenuItem value={attr}>{attr}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                ))}


                <AnimateButton style={{marginTop:"10px"}}>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                        Create
                    </Button>
                </AnimateButton>
            </form>
            <ToastContainer />
        </MainCard>
    )
}
export default MaterialProductCreate;
