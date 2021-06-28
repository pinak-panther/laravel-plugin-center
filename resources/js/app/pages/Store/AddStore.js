
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, MenuItem} from "@material-ui/core";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from 'react-router-dom'
import {connect} from "react-redux";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from 'yup';

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
function AddStore(props) {
    const classes = useStyles();
    const history = useHistory();

    const prepareAuthHeader = ()=>{
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }

    const validationSchema = Yup.object({
        name:Yup.string()
            .required('NAME FIELD IS REQUIRED'),
        email:Yup.string()
            .required('EMAIL FIELD IS REQUIRED')
            .email('PLEASE PROVIDE VALID EMAIL')
    });

    const formikSubmitHandler = (values) => {
        API.post('store',values,prepareAuthHeader())
            .then(response=>{
                history.push('/store-list');
            })
            .catch(err=>{
                console.error(err);
            })
    }


    const initialValues = {
        name:'',
        email:'',
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize={true} onSubmit={values => formikSubmitHandler(values)}>
            <Form autoComplete="off" noValidate className={classes.container} style={{display:"inline"}}>
                <Field name='name' id='name' label='Name' className={classes.textField} margin='normal' variant='filled' as={TextField} />
                <ErrorMessage name='name' className={classes.error} component={'div'}/>
                <Field name='email' id='email' label='Email' className={classes.textField} margin='normal' variant='filled' as={TextField} />
                <ErrorMessage name='email' className={classes.error} component={'div'}/>
                <div style={{textAlign:"center"}}>
                    <Button variant="contained" type={"submit"} color={'secondary'} size={'large'} >
                        Add Store
                    </Button>
                </div>
            </Form>
        </Formik>
    );
}

const mapStateToProps = (state, ownProps) =>{
    const {auth:{authToken}}=state;
    return {authToken};
}
export default connect(mapStateToProps)(AddStore)
