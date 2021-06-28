
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

function createData(id,name, price, duration) {
    return { id, name, price, duration };
}

function ListPlan(props) {
    const classes = useStyles();
    const history = useHistory();
    const [plan,setPlan] = useState([]);
    const [changeFlag,setChangFlag] = useState(true);
    const [page,setPage]=useState(1);
    const [loading,setLoading]=useState(false);
    const [open, setOpen] = useState(false);
    const [selectedId,setSelectedId]=useState('');

    const loadProducts = () => {
        API.get(`plan?page=${page}`,prepareAuthHeader())
            .then(response => {
                setLoading(response.data.data.next_page_url == null ? false : true);
                setPage(prev => prev + 1);
                let data = response.data.data;
                let plans = data.data;
                if (plans.length > 0) {
                    let tempArr = [];
                    plans.map(plan => {
                        tempArr.push(createData(plan.id, plan.name, plan.price, plan.duration));
                    });
                    setPlan(prevState => prevState.concat(tempArr));
                }
            }).catch(err => console.error(err))
    }

    useEffect(()=>{
        loadProducts();
    },[changeFlag]);

    const userClickHandler = (id)=>{
       history.push(`plan-edit/${id}`);
    }
    const userDeleteHandler = () =>{
         API.delete(`plan/${selectedId}`,prepareAuthHeader()).then(response=>{
             let filteredPlan = plan.filter(singlePlan => singlePlan.id != selectedId);
             setPlan(filteredPlan);
             setSelectedId('');
             setOpen(false);
         })
    }
    const prepareAuthHeader = ()=>{
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }

    const loadMoreClickHandler = () => {
        setChangFlag(!changeFlag);
    }

    function handleClickOpen(id) {
        setSelectedId(id);
        setOpen(true);
    }

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="center">Price</StyledTableCell>
                        <StyledTableCell align="center">Duration (In Days)</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {plan.map(row => (
                        <StyledTableRow key={row.id} >
                            <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                            <StyledTableCell align="center">{row.price}</StyledTableCell>
                            <StyledTableCell align="center">{row.duration}</StyledTableCell>
                            <StyledTableCell align="center">
                                <Button size="small" variant="contained" onClick={(event)=>userClickHandler(row.id)} color={"secondary"} className={classes.margin}> Update </Button>
                                <Button size="small" variant="contained" onClick={(event)=>handleClickOpen(row.id)} color={"secondary"}> Delete </Button>
                            </StyledTableCell>

                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.loadMore}>
            <Button variant="contained" disabled={!loading} onClick={()=>{loadMoreClickHandler()}} color={"secondary"} size={"large"} className={classes.button}>Load More</Button>
            </div>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Plan Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this Plan ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpen(false)} color="secondary" variant="contained" size={'small'}>
                        Disagree
                    </Button>
                    <Button variant="contained" onClick={()=>userDeleteHandler()} color="secondary" autoFocus size={'small'}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
const mapStateToProps = (state, ownProps) => {
    const {auth:{authToken}} = state ;
    return {authToken};
}
export default connect(mapStateToProps)(ListPlan)
