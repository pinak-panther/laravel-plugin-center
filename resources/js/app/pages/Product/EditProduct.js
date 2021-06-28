
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button} from "@material-ui/core";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
}));
export default function EditProduct(props) {
    const classes = useStyles();
    const history = useHistory()
    const [id,setId]=useState(0);
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [price,setPrice]=useState('');
    const [category,setCategory]=useState('');

    const handleNameChange = (event)=>{
        setName(event.target.value);
    }
    const handleDescriptionChange = (event)=>{
        setDescription(event.target.value);
    }
    const handlePriceChange = (event)=>{
        setPrice(event.target.value);
    }
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }
    useEffect(()=>{
        let id = props.match.params.id;
        API.get(`product/${id}`)
            .then(response=>{
                let data  = response.data.data;
                setId(data.id);
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category);
            })
    },[]);

    const handleFormSubmit = (event) =>{
        event.preventDefault();
        let data = {
            name,description,price,category
        }
        API.put(`product/${id}`,data)
            .then(response=>{
                history.push('/product-list');
            })
            .catch(err=>{
                console.error(err);
            })

    }

    return (
        <form className={classes.container} style={{display:"inline"}} noValidate autoComplete="off" onSubmit={(event)=>{handleFormSubmit(event)}}>
            <TextField
                id="filled-name"
                label="Name"
                className={classes.textField}
                value={name}
                onChange={(event)=>handleNameChange(event)}
                margin="normal"
                variant="filled"
            />
            <TextField
                id="description"
                label="Description"
                className={classes.textField}
                value={description}
                onChange={(event)=>{handleDescriptionChange(event)}}
                margin="normal"
                variant="filled"
            />
            <TextField
                id="price"
                label="Price"
                className={classes.textField}
                value={price}
                onChange={(event)=>{handlePriceChange(event)}}
                margin="normal"
                variant="filled"
            />
             <TextField
                id="category"
                label="Category"
                className={classes.textField}
                value={category}
                onChange={(event)=>{handleCategoryChange(event)}}
                margin="normal"
                variant="filled"
            />
            <div style={{textAlign:"center"}}>
                <Button variant="contained" type={"submit"} color={'secondary'} size={'large'}>
                    Edit Product
                </Button>
            </div>
        </form>
    );
}
