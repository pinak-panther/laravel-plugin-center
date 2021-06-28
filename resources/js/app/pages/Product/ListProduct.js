
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

function createData(id,name, description, price, category) {
    return { id, name, description, price, category };
}

export default function ListProduct() {
    const classes = useStyles();
    const history = useHistory();
    const [product,setProduct] = useState([]);
    const [changeFlag,setChangFlag] = useState(true);
    const [page,setPage]=useState(1);
    const [loading,setLoading]=useState(false);
    const [open, setOpen] = useState(false);
    const [selectedId,setSelectedId]=useState('');

    const loadProducts = () => {
        API.get(`product?page=${page}`)
            .then(response => {
                setLoading(response.data.data.next_page_url == null ? false : true);
                setPage(prev => prev + 1);
                let data = response.data.data;
                let products = data.data;
                if (products.length > 0) {
                    let tempArr = [];
                    products.map(product => {
                        tempArr.push(createData(product.id, product.name, product.description, product.price, product.category));
                    });
                    setProduct(prevState => prevState.concat(tempArr));
                }
            }).catch(err => console.error(err))
    }

    useEffect(()=>{
        loadProducts();
    },[changeFlag]);

    const userClickHandler = (id)=>{
       history.push(`product-edit/${id}`);
    }
    const userDeleteHandler = () =>{
         API.delete(`product/${selectedId}`).then(response=>{
             let filteredProducts = product.filter(singleProduct => singleProduct.id != selectedId);
             setProduct(filteredProducts);
             setSelectedId('');
             setOpen(false);
         })
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
                        <StyledTableCell align="center">Description</StyledTableCell>
                        <StyledTableCell align="center">Price</StyledTableCell>
                        <StyledTableCell align="center">Category</StyledTableCell>
                        <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {product.map(row => (
                        <StyledTableRow key={row.id} >
                            <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                            <StyledTableCell align="center">{row.description}</StyledTableCell>
                            <StyledTableCell align="center">{row.price}</StyledTableCell>
                            <StyledTableCell align="center">{row.category}</StyledTableCell>
                            <StyledTableCell align="center">
                                <Button size="small" variant="contained" onClick={(event)=>userClickHandler(row.id)} color={"secondary"} className={classes.margin}> Update </Button>
                                <Button size="small" variant="contained" onClick={(event)=>handleClickOpen(row.id)} color={"secondary"}> Delete </Button>
                                {/*<Button size="small" variant="contained" onClick={(event)=>userDeleteHandler(row.id)} color={"secondary"}> Delete </Button>*/}
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
                <DialogTitle id="alert-dialog-title">{"Product Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this product ?
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
