
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button} from "@material-ui/core";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {useHistory} from "react-router-dom";
import {connect} from "react-redux";
import {Formik,Field,ErrorMessage,Form} from "formik";
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

function EditApplication(props) {
    const classes = useStyles();
    const history = useHistory()
    const [id,setId]=useState(0);
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [shopifyAppId,setShopifyAppId]=useState('');
    const [shopifyAppUrl,setShopifyAppUrl]=useState('');


    const formikHandleSubmit = (values) => {
        API.put(`application/${id}`,values,prepareAuthHeader())
            .then(response=>{
                history.push('/application-list');
            })
            .catch(err=>{
                console.error(err);
            })
    }
    const prepareAuthHeader = ()=>{
        return {
            headers: {
                'Authorization': `Bearer ${props.authToken}`
            },
        }
    }
    useEffect(()=>{
        let id = props.match.params.id;
        API.get(`application/${id}`,prepareAuthHeader())
            .then(response=>{
                let data  = response.data.data;
                setId(data.id);
                setName(data.name);
                setShopifyAppId(data.shopify_app_id);
                setShopifyAppUrl(data.shopify_app_url);
                setDescription(data.description);
            })
    },[]);

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

    const initialValues={name,description,shopifyAppId,shopifyAppUrl};
    return (
        <Formik  initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={values=>formikHandleSubmit(values)}>
            <Form autoComplete="off" noValidate className={classes.container} style={{display:"inline"}}>
                <Field name="name" as={TextField} margin="normal" variant="filled" id="name" label="Name" className={classes.textField}/>
                <ErrorMessage name="name" className={classes.error} component={'div'}/>
                <Field name="shopifyAppId" as={TextField} margin="normal" variant="filled" id="shopifyAppId" label="Shopify App Id" className={classes.textField}/>
                <ErrorMessage name="shopifyAppId" className={classes.error} component={'div'}/>
                <Field name="shopifyAppUrl" as={TextField} margin="normal" variant="filled" id="shopifyAppUrl"
                       label="Shopify App Url" className={classes.textField}/>
                <ErrorMessage name="shopifyAppUrl" className={classes.error} component={'div'}/>
                <Field name="description" as={TextField} margin="normal" variant="filled" id="description" label="Description" className={classes.textField}/>
                <ErrorMessage name="description" className={classes.error} component={'div'}/>
                <div style={{textAlign:"center"}}>
                    <Button variant="contained" type={"submit"} color={'secondary'} size={'large'} >
                        Update Application
                    </Button>
                </div>
            </Form>
        </Formik>
    );
}
const mapStateToProps = (state,ownProps)=>{
    const {auth:{authToken}}=state;
    return {authToken};
}
export default connect(mapStateToProps)(EditApplication);
