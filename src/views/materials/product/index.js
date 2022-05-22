import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import axios from 'axios';
import MainCard from "../../../component/cards/MainCard";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import configData from "../../../config";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid";
import { Link } from 'react-router-dom';
import WebServices from "../../../utils/WebServices";
import { ToastContainer, toast } from 'react-toastify';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import 'react-toastify/dist/ReactToastify.css';

const MaterialProduct = ()=>{

    const [rows,setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [alert,setAlert] = useState({isOpen:false,message:"",type:"success"});
    const [state, setState] = React.useState({
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const account = useSelector((state) => state.account);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleClose = (event, reason) => {
        let alertTemp = {...alert};
        alertTemp.isOpen = false;
        setAlert(alertTemp);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDelete = async (row, index) => {
        console.log(row);
        let tempRows = [...rows];
        tempRows.splice(index, 1);
        setRows(tempRows);
        await WebServices.axiosObject(account.token).delete(`material-products/${row._id}`)
            .then((response) => {
                let responseData = response.data;
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

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },

        { id: 'photo', label: 'Photo', minWidth: 100 },
        { id: 'material', label: 'Material', minWidth: 170 },
        { id: 'price', label: 'Price', minWidth: 170 },
        { id: 'discount', label: 'Discount', minWidth: 170 },
        {
            id: 'action',
            label: 'Action ',
            minWidth: 170,
            align: 'center'
        }
    ];



    useEffect(()=>{
        try {
            axios
                .get( configData.API_SERVER + 'material-products', { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    console.log(response.data);
                    setRows(response.data.data);
                    let alertTemp = {...alert};
                    alertTemp.message = "Data Fetched";
                    alertTemp.isOpen = true;
                    setAlert(alertTemp);
                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[])

    return (
        <MainCard title="Material Products">
            <Grid container spacing={2} justifyContent="end" direction="row">
                <Button component={Link} to={{pathname: `/material-products/create`}}  variant="contained" color="primary">Create Material Product</Button>
            </Grid>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow >
                                {columns.map((column) => (
                                    <TableCell align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row,index) => {
                                    return (
                                        <TableRow  hover role="checkbox" tabIndex={-1} >
                                            <TableCell align="left">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="left">
                                                <img src={configData.IMAGE_URL+row.photo} alt="N/A" height={60}  />
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.material.name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.price}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.discount}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Button component={Link} to={{pathname: `/material-products/${row._id}/edit`}} startIcon={<RemoveRedEyeIcon />} variant="contained" color="primary" >Edit</Button>
                                                <Button  startIcon={<DeleteIcon />} variant="contained" color="error" onClick={()=>handleDelete(row,index)} >Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <ToastContainer />
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={alert.isOpen} autoHideDuration={2000} anchorOrigin={{ vertical, horizontal }} onClose={handleClose} >
                    <Alert severity={alert.type} >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Stack>

        </MainCard>
    )
};
export default MaterialProduct;
