
import React, {useEffect, useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from "react-router-dom";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

import {connect} from "react-redux";

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);



const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    loadMore: {
     textAlign:"center"
    }
}));

function createData(id,name, description, shopify_app_id, shopify_app_url) {
    return { id, name, description, shopify_app_id, shopify_app_url };
}


function ListApplication(props) {
    const classes = useStyles();
    const history = useHistory();
    const [application,setApplication] = useState([]);
    const [changeFlag,setChangFlag] = useState(true);
    const [page,setPage]=useState(1);
    const [loading,setLoading]=useState(false);

    const loadApplications = () => {
        API.get(`application?page=${page}`)
            .then(response => {
                setLoading(response.data.data.next_page_url == null ? false : true);
                setPage(prev => prev + 1);
                let data = response.data.data;
                let applications = data.data;
                if (applications.length > 0) {
                    let tempArr = [];
                    applications.map(application => {
                        tempArr.push(createData(application.id, application.name, application.description,application.shopify_app_id, application.shopify_app_url));
                    });
                    setApplication(prevState => prevState.concat(tempArr));
                }
            }).catch(err => console.error(err))
    }

    useEffect(()=>{
        loadApplications();
    },[changeFlag]);

    const userClickHandler = (id)=>{
       history.push(`application-edit/${id}`);
    }

    const loadMoreClickHandler = () => {
        setChangFlag(!changeFlag);
    }

    const handleViewStoreClick = id => {
        history.push(`/store-filtered/${id}`)
    };

    function planClickHandler(url='https://apps.shopify.com') {
        return window.open(
            `${url}`,
            '_blank'
        );
    }

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>NAME</StyledTableCell>
                        <StyledTableCell align="center">DESCRIPTION</StyledTableCell>
                        <StyledTableCell align="center">VIEW STORE</StyledTableCell>
                        <StyledTableCell align="center">ACTIONS</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {application.map(row => (
                        <StyledTableRow key={row.id} >
                            <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                            <StyledTableCell align="center">{row.description}</StyledTableCell>
                            <StyledTableCell align="center">
                                <Button size="small" variant="contained" onClick={(event)=>handleViewStoreClick(row.id)} color={"secondary"}> View Store </Button>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Button size="small" variant="contained" onClick={(event)=>userClickHandler(row.id)} color={"secondary"} className={classes.margin}> Update </Button>
                                <Button size="small" variant="contained" onClick={(event)=>planClickHandler(row.shopify_app_url)} color={"secondary"} className={classes.margin}> Show Plan </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.loadMore}>
            <Button variant="contained" disabled={!loading} onClick={()=>{loadMoreClickHandler()}} color={"secondary"} size={"large"} className={classes.button}>Load More</Button>
            </div>
        </Paper>
    );
}
export default ListApplication;
