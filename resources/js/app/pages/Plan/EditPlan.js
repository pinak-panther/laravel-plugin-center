
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button} from "@material-ui/core";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from "react-router-dom";
import {connect} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

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
    error:{
        paddingLeft:10,
        color:"red"
    }
}));
function EditPlan(props) {
    const classes = useStyles();
    const history = useHistory()
    const [id,setId]=useState(0);
    const [name,setName]=useState('');
    const [price,setPrice]=useState('');
    const [duration,setDuration]=useState('');

    const prepareAuthHeader = ()=>{
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }
    useEffect(()=>{
        let id = props.match.params.id;
        API.get(`plan/${id}`,prepareAuthHeader())
            .then(response=>{
                let data  = response.data.data;
                setId(data.id);
                setName(data.name);
                setPrice(data.price);
                setDuration(data.duration);
            })
    },[]);

    const validationSchema = Yup.object({
        name:Yup.string()
            .required('NAME IS REQUIRED FIELD'),
        price:Yup.string()
            .required('PRICE IS REQUIRED FIELD'),
        duration:Yup.string()
            .required('DURATION IS REQUIRED FIELD')
    });

    const formikHandleSubmit = (values)=> {
        API.put(`plan/${id}`,values,prepareAuthHeader())
            .then(response=>{
                history.push('/plan-list');
            })
            .catch(err=>{
                console.error(err);
            })
    }

    const initialValues={ name,price,duration }
    return (
    <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={values => formikHandleSubmit(values)}>
        <Form autoComplete="off" noValidate className={classes.container} style={{display:"inline"}}>
            <Field name="name" as={TextField} margin="normal" variant="filled" className={classes.textField} id="name" label="Name"/>
            <ErrorMessage name="name" className={classes.error} component="div"/>
            <Field name="price" as={TextField} margin="normal" variant="filled" className={classes.textField} id="price" label="Price"/>
            <ErrorMessage name="price" className={classes.error} component="div"/>
            <Field name="duration" as={TextField} margin="normal" variant="filled" className={classes.textField} id="duration" label="Duration"/>
            <ErrorMessage name="duration" className={classes.error} component="div"/>
            <div style={{textAlign:"center"}}>
                <Button variant="contained" type={"submit"} color={'secondary'} size={'large'} >
                    Add Plan
                </Button>
            </div>
        </Form>
    </Formik>
    );
}
const mapStateToProps = (state,ownProps) =>{
    const {auth:{authToken}} = state;
    return {authToken};
}
export default connect(mapStateToProps)(EditPlan)
