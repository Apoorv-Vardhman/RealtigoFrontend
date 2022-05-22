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
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from "@mui/material/Grid";
import { Link } from 'react-router-dom';
import WebServices from "../../../utils/WebServices";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ServiceQuestion = (props)=>{

    const [rows,setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const account = useSelector((state) => state.account);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
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
        await WebServices.axiosObject(account.token).delete(`service-questions/${row._id}`)
            .then((response) => {
                let responseData = response.data;
                toast(`${responseData.message}`, {position: "bottom-center", autoClose: 2000});
            })
            .catch((error) => {
                console.log(error.response)
                let data = error.response.data;
                if ("error" in data) {
                    toast(`${data.error}`, {position: "bottom-center", autoClose: 2000});
                } else {
                    toast(`${data.message}`, {position: "bottom-center", autoClose: 2000});
                }
            })
    }

    const columns = [
        { id: '_id', label: 'ID', minWidth: 170 },
        { id: 'question', label: 'question', minWidth: 100 },
        {
            id: 'options',
            label: 'options',
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


    useEffect(()=>{
        try {
            axios
                .get( configData.API_SERVER + `service-questions/${props.id}/service`, { headers: { Authorization: `Bearer ${account.token}` } })
                .then(function (response) {
                    console.log(response.data);
                    setRows(response.data.data);
                    toast(`${response.data.message}`, {position: "bottom-center", autoClose: 2000});

                })
                .catch(function (error) {
                    console.log('error - ', error);
                });
        }  catch (err) {
            console.error(err);
        }
    },[])

    return (
        <MainCard title="Service Question">

            <Grid container spacing={2} justifyContent="end" direction="row">
                <Button component={Link} to={{pathname: `/services/${props.id}/questions/create`}}  variant="contained" color="primary">Create Question</Button>
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
                                                {row._id}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.question}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.options}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button component={Link} to={{pathname: `/services/${props.id}/questions/${row._id}/edit`}}  variant="contained" color="primary">Edit</Button>

                                                <Button  startIcon={<DeleteIcon />} variant="contained" color="error" onClick={()=>handleDelete(row,index)} >Delete</Button>
                                            </TableCell>
                                            {/*{columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}*/}
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
        </MainCard>
    )
};
export default ServiceQuestion;
