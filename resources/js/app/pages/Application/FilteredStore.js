import React, {useEffect, useState} from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory, useLocation, useParams} from "react-router-dom";
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
        textAlign: "center"
    }
}));

function createData(id, email, name, current_plan, status) {
    return {id, email, name, current_plan, status};
}

function FilteredStore(props) {
    const classes = useStyles();
    const [store, setStore] = useState([]);
    const [changeFlag, setChangFlag] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false); //for enabling and disabling the Load More button
    const params = useParams();
    const {appId} = params;

    const loadStores = (url) => {
        API.get(url, prepareAuthHeader())
            .then(response => {
                setLoading(response.data.data.next_page_url == null ? false : true);
                setPage(prev => prev + 1);
                let data = response.data.data;
                let stores = data.data;
                if (stores.length > 0) {
                    let tempArr = [];
                    stores.map(store => {
                        tempArr.push(createData(store.id, store.email, store.name, store.current_plan, store.status));
                    });
                    setStore(prevState => prevState.concat(tempArr));
                }
            }).catch(err => console.error(err))
    }

    useEffect(() => {
        const url = `/store?page=${page}&appId=${appId}`;
        loadStores(url);
    }, [changeFlag]);

    const prepareAuthHeader = () => {
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }

    const loadMoreClickHandler = () => {
        setChangFlag(!changeFlag);
    }

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>DOMAIN</StyledTableCell>
                        <StyledTableCell align="center">EMAIL</StyledTableCell>
                        <StyledTableCell align="center">PLAN</StyledTableCell>
                        <StyledTableCell align="center">STATUS</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {store.map(row => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                            <StyledTableCell align="center">{row.email}</StyledTableCell>
                            <StyledTableCell align="center">{row.current_plan.toUpperCase()}</StyledTableCell>
                            <StyledTableCell align="center">{row.status == '1'? 'Enable' : 'Disable'}</StyledTableCell>

                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.loadMore}>
                <Button variant="contained" disabled={!loading} onClick={() => {
                    loadMoreClickHandler()
                }} color={"secondary"} size={"large"} className={classes.button}>Load More</Button>
            </div>
        </Paper>
    );
}

const mapStateToProps = (state, ownProps) => {
    const {auth: {authToken}} = state;
    return {authToken};
}
export default connect(mapStateToProps)(FilteredStore)
