import React, {useEffect, useState} from "react";
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

const UserDetail = (props)=> {
    const account = useSelector((state) => state.account);
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();

    const [reward,setReward] = useState([]);
    const [isSubmitting,setSubmitted] = useState(false);
    const [userPoint,setUserPoint] = useState(0);
    const [user,setUser] = useState({
        name:"",
        phone:"",
        refer:"",
        company:"",
        role:"",
        address:"",
        city:"",
        verified:"",
        state:"",
        zipcode:"",
        point:""
    });

    const fetchDetail = async ()=>{
        await WebServices.axiosObject(account.token).get(`users/${props.id}/detail`)
            .then((response) => {
                let responseData = response.data;
                console.log(responseData)
                //setUser(responseData.user);
                let user1 = responseData.user;
                let v = "No";
                if(user1.isVerified)
                    v = "Yes"
                setUser({...user,name:user1.name,phone:user1.phone,refer:user1.refer,company: user1.company,verified:v,
                    role:user1.role,address: user1.address,city: user1.city,state: user1.state,zipcode: user1.zipcode,point: user1.point})
                console.log("rewards",responseData.rewards)
                setUserPoint(user1.point);
                setReward(responseData.rewards);

                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
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

    useEffect(()=>{
        fetchDetail();
    },[]);

    const onSubmit = async data =>{
        const point = data.point;
        let formData = new FormData();
        formData.append("point",point);
        setSubmitted(true);
        await WebServices.axiosObject(account.token).post(`users/${props.id}/reward`,formData)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
                let finalPoint = parseInt(userPoint) + parseInt(point);
                setUserPoint(finalPoint);
                setValue("point",0);
                setSubmitted(false);
            }).catch((error) => {
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
        <MainCard title={`User Detail(${props.id})`}>
            <div>
                {/*user detail */}
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item md={6} xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography style={{color:"#c10e8e"}} variant="h2">User Detail</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">User Name</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.name || "N/A"}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">User Mobile</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.phone}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Refer ID</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.refer}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Company</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.company}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Role</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.role}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Point</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{userPoint}</h4></TableCell>
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
                                <Typography style={{color:"#c10e8e"}} variant="h2">User</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Verified</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.verified}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Address</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.address || "N/A"}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">City</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.city || "N/A"}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">State</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.state || "N/A"}</h4></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell  style={{padding:"0"}}><Typography style={{color:"#00adb5"}} variant="h3" component="h3">Zipcode</Typography></TableCell>
                                                <TableCell  style={{padding:"0"}}><h4>{user.zipcode || "N/A"}</h4></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </CardContent>
                        </Card>

                    </Grid>

                </Grid>

                <Grid item md={6} xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography style={{color:"#c10e8e"}} variant="h2">User Refer</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableCell><Typography>User</Typography></TableCell>
                                        <TableCell><Typography>rewardPoint</Typography></TableCell>
                                        <TableCell><Typography>Referred By</Typography></TableCell>
                                        <TableCell><Typography>rewardPoint</Typography></TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {reward.map((data,index)=>(
                                            <TableRow>
                                                <TableCell><Typography>{data.user.name}</Typography></TableCell>
                                                <TableCell><Typography>{data.rewardPointNewUser}</Typography></TableCell>
                                                <TableCell><Typography>{user.name}</Typography></TableCell>
                                                <TableCell><Typography>{data.rewardPoint}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{marginTop:30}}>
                    <Grid item md={12} xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography style={{color:"#c10e8e"}} variant="h2">Add Reward</Typography>

                                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid item md={6} xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel htmlFor="outlined-adornment-email-login">Point</InputLabel>
                                                <OutlinedInput id="outlined-adornment-name" error={Boolean(errors.status)} {...register("point", { required: true,min:1 })} type="number"  label="Enter point" />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <AnimateButton>
                                                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                                    Add Point
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
        </MainCard>
    )

}
export default UserDetail
