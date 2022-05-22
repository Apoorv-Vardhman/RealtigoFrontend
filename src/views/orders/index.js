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
import MainCard from "../../component/cards/MainCard";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import configData from "../../config";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid";
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import 'react-toastify/dist/ReactToastify.css';

const Orders = ()=>{

    const [rows,setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [total,setTotal] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [alert,setAlert] = useState({isOpen:false,message:"",type:"success"});

    const [state, setState] = React.useState({
        vertical: 'bottom',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const account = useSelector((state) => state.account);
    const handleChangePage = (event, newPage) => {
        //page===0?setPage(2):setPage(newPage);
        setPage(newPage);
        console.log("new",newPage)
    };

    const handleClose = (event, reason) => {
        let alertTemp = {...alert};
        alertTemp.isOpen = false;
        setAlert(alertTemp);
    };

    const handleChangeRowsPerPage = (event) => {
        console.log("ab",+event.target.value);
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleDelete = (row,index)=>{
        console.log(row);
        let tempRows = [...rows];
        tempRows.splice(index, 1);
        setRows(tempRows);
    }

    const columns = [
        { id: 'order_id_unique', label: 'Order ID', minWidth: 170 },
        { id: 'photo', label: 'Photo', minWidth: 100 },
        { id: 'order_type', label: 'Order Type', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
        {
            id: 'User',
            label: 'User',
            minWidth: 170,
            align: 'left',
        },
        {
            id: 'Phone',
            label: 'Phone',
            minWidth: 170,
            align: 'left',
        },
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
                .get( configData.API_SERVER + `admin-orders?page=${page+1}&limit=${rowsPerPage}`, { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    let alertTemp = {...alert};
                    alertTemp.message = "Data Fetched";
                    alertTemp.isOpen = true;
                    setAlert(alertTemp);
                    setTotal(response.data.total);
                    setRows(response.data.data);
                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[page,rowsPerPage])

    return (
        <MainCard title="Orders">

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
                            {rows.map((row,index) => {
                                    return (
                                        <TableRow  hover role="checkbox"  >
                                            <TableCell align="left">
                                                {row.order_id_unique}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.order_type==="equipment" && (
                                                    <img src={configData.IMAGE_URL+row.equipment.photo} alt="N/A" height={60}  />
                                                )}
                                                {row.order_type==="service" && (
                                                    <img src={configData.IMAGE_URL+row.service.photo} alt="N/A" height={60}  />
                                                )}
                                                {row.order_type==="material" && (
                                                    <img src={configData.IMAGE_URL+row.material.photo} alt="N/A" height={60}  />
                                                )}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.order_type}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.status}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.user.name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.user.phone}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Button component={Link} to={{pathname: `/orders/${row._id}`}} startIcon={<RemoveRedEyeIcon />} variant="contained" color="success">Detail</Button>
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
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
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
export default Orders;
