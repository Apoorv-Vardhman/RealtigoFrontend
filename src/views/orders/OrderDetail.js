import React, {useState} from "react";
import MainCard from "../../component/cards/MainCard";
import Grid from '@mui/material/Grid';
import axios from "axios";
import configData from "../../config";
import {useSelector} from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia";
import moment from 'moment';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import {Button, FormControl, InputLabel, OutlinedInput} from "@mui/material";
import AnimateButton from "../../component/extended/AnimateButton";
import WebServices from "../../utils/WebServices";
import {toast, ToastContainer} from "react-toastify";


const OrderDetail = (props)=>{
    const account = useSelector((state) => state.account);
    const [order,setOrder]  = useState(null);
    const {register,handleSubmit, formState: { errors },setValue} = useForm();

    const formatDate = (date)=>{
        let date1 = new Date(date);
        return moment(date1).format("DD-MM-YYYY")
    }
    useState(()=>{
        try {
            axios
                .get( configData.API_SERVER + `orders/${props.id}/detail`, { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    setValue("status",response.data.data.status)
                    if(response.data.data.order_type==="material")
                    {
                        let orderData = response.data.data;
                        setOrder(orderData);
                    }
                    else
                    {
                        setOrder(response.data.data);
                    }
                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[])
    const [isSubmitting,setSubmitted] = useState(false);
    const getAttributeValue = (product_attribute)=>{
        let attr = "";
        product_attribute.forEach((value)=>{
            attr=attr+value.attribute.name+" - "+value.value+"\n"
        });
        return attr;
    }

    const getAttributes = (attributes)=>{
        let data = "";
        attributes.forEach((attribute,index)=>{
            data+= ` ${attribute.name} : ${attribute.attribute_value} `;
            if(index!==attributes.length-1)
                data+=","
        })
        return data;
    }

    const onSubmit = async data => {
        console.log(data);
        let formData = new FormData();
        formData.append("status",data.status);
        setSubmitted(true);
        await WebServices.axiosObject(account.token).post(`admin-order/${props.id}/update`,formData)
            .then((response) => {
                let responseData = response.data;
                console.log(responseData)


                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                setSubmitted(false);
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
        <MainCard title={`Order Detail(${props.id})`}>
            {order!==null && (
                <div>
                    {/*user detail */}
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item md={6} xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography style={{color:"#c10e8e"}} variant="h2">Order</Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">User Name</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{order.user.name}</h4></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">User Mobile</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{order.user.phone}</h4></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Order Status</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{order.status}</h4></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item md={6} xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography style={{color:"#c10e8e"}} variant="h2">Order Detail</Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Order ID</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{order.order_id_unique}</h4></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Order Type</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{order.order_type}</h4></TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Order Date</Typography></TableCell>
                                                    <TableCell  style={{padding:"0"}}><h4>{formatDate(order.date)}</h4></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </CardContent>
                            </Card>

                        </Grid>

                    </Grid>
                    {order.order_type === "service"&&(
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:30}}>
                            <Grid item md={12} xs={12}>
                                <Card variant="outlined"  sx={{ display: 'flex',padding:'20px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia style={{objectFit:"none"}} component="img" height="100" width="100" image={configData.IMAGE_URL+order.service.photo} alt="Service Image"/>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" component="div">{order.service.name}</Typography>
                                        </CardContent>
                                    </Box>


                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Question</TableCell>
                                                    <TableCell align="right">Answer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    order.s_questions.map((row,index)=>(
                                                        <TableRow>
                                                            <TableCell>{row.question.question}</TableCell>
                                                            <TableCell align="right">{row.answer}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>

                        </Grid>
                    )}
                    {order.order_type === "material"&&(
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:30}}>
                            <Grid item md={12} xs={12}>
                                <Card variant="outlined"  sx={{ display: 'flex',padding:'20px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia style={{objectFit:"none"}} component="img" height="100" width="100" image={configData.IMAGE_URL+order.material.photo} alt="Material Image"/>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" component="div">{order.material.name}</Typography>
                                        </CardContent>
                                    </Box>


                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Attributes</TableCell>
                                                    <TableCell align="right">Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    order.products.map((row,index)=>(
                                                        <TableRow>
                                                            <TableCell>{row.product.name}</TableCell>
                                                            <TableCell>{getAttributes(row.attributes)}</TableCell>
                                                            <TableCell align="right">{row.value}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>

                        </Grid>
                    )}
                    {order.order_type === "equipment"&&(
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:30}}>
                            <Grid item md={12} xs={12}>
                                <Card variant="outlined"  sx={{ display: 'flex',padding:'20px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia style={{objectFit:"none"}} component="img" height="100" width="100" image={configData.IMAGE_URL+order.equipment.photo} alt="Service Image"/>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" component="div">{order.equipment.name}</Typography>
                                        </CardContent>
                                    </Box>


                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Question</TableCell>
                                                    <TableCell align="right">Answer</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    order.e_questions.map((row,index)=>(
                                                        <TableRow>
                                                            <TableCell>{row.question.question}</TableCell>
                                                            <TableCell align="right">{row.answer}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>

                        </Grid>
                    )}

                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:30}}>
                        <Grid item md={12} xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography style={{color:"#c10e8e"}} variant="h2">Update Order</Typography>

                                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            <Grid item md={6} xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel htmlFor="outlined-adornment-email-login">Status</InputLabel>
                                                    <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.status)} {...register("status", { required: true })} type="text"  label="Enter status" />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <AnimateButton>
                                                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                                        Update
                                                    </Button>
                                                </AnimateButton>
                                            </Grid>

                                        </Grid>
                                    </form>
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>
                    <ToastContainer />

                </div>
            )}
        </MainCard>
    )
}
export default OrderDetail;
