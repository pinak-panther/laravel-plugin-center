import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, MenuItem} from "@material-ui/core";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from 'react-router-dom'
import {connect} from "react-redux";
import {Formik, Field, ErrorMessage, Form} from "formik";
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
    error: {
        paddingLeft: 10,
        color: "red"
    }
}));

const initialValues = {
    name: '',
    shopifyAppId: '',
    shopifyAppUrl: '',
    description: '',
}

const validationSchema = Yup.object({
    name: Yup.string()
        .required('NAME FIELD IS REQUIRED !!'),
    shopifyAppId: Yup.string()
        .required('SHOPIFY APP ID FIELD IS REQUIRED !!'),
    shopifyAppUrl: Yup.string()
        .required('SHOPIFY APP URL FIELD IS REQUIRED !!'),
    description: Yup.string()
        .required('DESCRIPTION FIELD IS REQUIRED !!'),
})

function AddApplication(props) {
    const classes = useStyles();
    const history = useHistory();

    const formikHandleSubmit = (values) => {
        API.post('application', values, prepareAuthHeader())
            .then(response => {
                history.push('/application-list');
            })
            .catch(err => {
                console.error(err);
            })
    }
    const prepareAuthHeader = () => {
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema}
                onSubmit={(values) => formikHandleSubmit(values)}>
            <Form autoComplete="off" noValidate className={classes.container} style={{display: "inline"}}>
                <Field name="name" as={TextField} margin="normal" variant="filled" id="name" label="Name"
                       className={classes.textField}/>
                <ErrorMessage name="name" className={classes.error} component={'div'}/>
                <Field name="shopifyAppId" as={TextField} margin="normal" variant="filled" id="shopifyAppId"
                       label="Shopify App ID" className={classes.textField}/>
                <ErrorMessage name="shopifyAppId" className={classes.error} component={'div'}/>
                <Field name="shopifyAppUrl" as={TextField} margin="normal" variant="filled" id="shopifyAppUrl"
                       label="Shopify App URL" className={classes.textField}/>
                <ErrorMessage name="shopifyAppUrl" className={classes.error} component={'div'}/>
                <Field name="description" as={TextField} margin="normal" variant="filled" id="description"
                       label="Description" className={classes.textField}/>
                <ErrorMessage name="description" className={classes.error} component={'div'}/>
                <div style={{textAlign: "center"}}>
                    <Button variant="contained" type={"submit"} color={'secondary'} size={'large'}>
                        Add Application
                    </Button>
                </div>
            </Form>
        </Formik>
    );
}

const mapStateToProps = (state, ownProps) => {
    const {auth: {authToken}} = state;
    return {authToken};
}
export default connect(mapStateToProps)(AddApplication);
