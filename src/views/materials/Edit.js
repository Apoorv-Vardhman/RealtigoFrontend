import React, {useEffect, useState} from "react";
import MainCard from "../../component/cards/MainCard";
import {Button, FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import AnimateButton from "../../component/extended/AnimateButton";
import Grid from '@mui/material/Grid';
import IconButton from "@mui/material/IconButton";
import {PhotoCamera,DeleteForever} from "@mui/icons-material";
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



const MaterialEdit = (props)=>{

    const [isSubmitting,setSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const classes = useStyles();
    const {register,handleSubmit, formState: { errors },setValue} = useForm();
    const [attributes,setAttributes] = useState([]); // all attributes
    const [materialAttributes,setMaterialAttributes] = useState([{attribute:""}]); // all row data
    const [selectedAttribute,setSelectedAttribute] = useState([{attribute:""}]);
    const [materialImage,setMaterialImage] = useState("");
    const handleCapture = ({ target }) => {
        setSelectedFile(target.files[0]);
        console.log("capture ",selectedFile);
    };
    const account = useSelector((state) => state.account);

    let history = useHistory();

    const onSubmit = async data => {
        console.log(data);
        let attrs = [];
        materialAttributes.forEach((data,index)=>{
            if(data.attribute!=="")
                attrs.push(data.attribute);
        })
        console.log(attrs);
        let formData = new FormData();
        formData.append("name", data.name);
        formData.append("unit", data.unit);
        if(selectedFile)
            formData.append("photo", selectedFile);
        formData.append("attributes",JSON.stringify(attrs));
        setSubmitted(true);
        await WebServices.axiosObject(account.token).put(`materials/${props.id}`,formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                history.push(`/materials`);
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

    const handleChange = (e,index)=>{
        const updatedData = materialAttributes.map((data,i)=> index===i?Object.assign(data,{["attribute"]:e.target.value}):data);
        setMaterialAttributes(updatedData);
        console.log(updatedData)
    }

    const handleDelete = (e,index)=>{
        let tempRows = [...materialAttributes];
        console.log(tempRows)
        tempRows.splice(index, 1);
        console.log("after delete ",tempRows);
        setMaterialAttributes(tempRows);
    }

    const addRow = ()=>{
        if(materialAttributes.length<attributes.length)
        {
            let tempRows = [...materialAttributes];
            tempRows.push({attribute: ""});
            setMaterialAttributes(tempRows);
        }

    }

    const fetchAttribute =async ()=>{
        try {
            await axios.get( configData.API_SERVER + 'attributes', { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    setAttributes(response.data.data);

                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    }

    const fetchMaterial = async ()=>{
        await WebServices.axiosObject(account.token).get(`${configData.API_SERVER}materials/${props.id}`)
            .then((response)=>{
                console.log(response)
                setValue('name', response.data.data.name, { shouldValidate: true })
                setValue('unit', response.data.data.unit, { shouldValidate: true })
                setMaterialImage(`${configData.IMAGE_URL}${response.data.data.photo}`);
                setMaterialAttributes(response.data.data.attributes);
                let a  = [];
                response.data.data.attributes.forEach((data,index)=>{
                    a.push({attribute:data._id});
                    setMaterialAttributes(a);
                })
            })
            .catch((error)=>{
                console.log('error - ', error);
            })
    }



    useEffect(()=>{
        fetchAttribute();
        try {
            fetchMaterial();
        }catch (e) {
            console.log(e);
        }
    },[])


    return (
        <MainCard title="Edit Material">
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
                            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                            <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.unit)} {...register("unit", { required: true })} type="text"  label="Enter unit" />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                        {!selectedFile && <img src={materialImage} height="50" width="50"/>}


                    </Grid>

                </Grid>
                {attributes.length>0 &&
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginLeft:"10px",marginBottom:"10px",marginTop:"10px"}}>
                    <Typography variant="h5" component="h5" >Attributes</Typography>
                </Grid>
                }
                {materialAttributes.map((row,index)=>(
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:"10px"}}>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Attribute</InputLabel>
                                <Select {...register(`attribute`)} value={row.attribute} error={Boolean(errors.attribute)}  labelId="select-attribute"   label="Category"
                                        onChange={(e)=>handleChange(e,index)}>
                                    {attributes.map((attr,index)=>
                                        <MenuItem value={attr._id}>{`${attr.name} (${attr.identification})`}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <IconButton color="error" aria-label="Delete" onClick={(e)=>{
                                handleDelete(e,index)
                            }} component="span">
                                <DeleteForever fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                {((materialAttributes.length!==selectedAttribute.length) || attributes.length>0)&&
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginBottom:"10px",marginTop:"10px"}}>
                    <Grid item md={3} xs={12}>
                        <AnimateButton>
                            <Button disableElevation onClick={addRow}  fullWidth size="large" type="button" variant="contained" color="primary">
                                Add one more
                            </Button>
                        </AnimateButton>
                    </Grid>

                </Grid>
                }

                <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                        Update
                    </Button>
                </AnimateButton>
            </form>
            <ToastContainer />
        </MainCard>
    )
}
export default MaterialEdit;
