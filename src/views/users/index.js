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
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import WebServices from "../../utils/WebServices";
import {toast, ToastContainer} from "react-toastify";

const Users = ()=>{

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

    const columns = [
        { id: 'ID', label: 'User ID', minWidth: 170 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'photo', label: 'Photo', minWidth: 100 },
        { id: 'role', label: 'Role', minWidth: 100 },
        {
            id: 'Phone',
            label: 'Phone',
            minWidth: 170,
            align: 'center',
        },
        {
            id: 'action',
            label: 'Action ',
            minWidth: 170,
            align: 'center'
        }
    ];

    const handleDelete = async (row, index) => {
        console.log(row);
        let tempRows = [...rows];
        tempRows.splice(index, 1);
        setRows(tempRows);
        await WebServices.axiosObject(account.token).delete(`users/${row._id}/delete`)
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


    useEffect(()=>{
        try {
            axios
                .get( configData.API_SERVER + `users?page=${page+1}&limit=${rowsPerPage}`, { headers: { Authorization: `Bearer ${account.token}` } })
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
        <MainCard title="Users">

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
                                            {row._id}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <img src={configData.IMAGE_URL+row.photo} alt="N/A" height={60}  />
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.role}
                                        </TableCell>
                                        <TableCell align="left">
                                            {row.phone}
                                        </TableCell>
                                        <TableCell>
                                            <Button component={Link} to={{pathname: `/users/${row._id}/detail`}} startIcon={<RemoveRedEyeIcon />} variant="contained" color="success">Detail</Button>
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
                    count={total}
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
export default Users;
