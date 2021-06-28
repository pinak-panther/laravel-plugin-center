import React, {useEffect, useState} from "react";
// import {useSubheader} from "../../_metronic/layout";
import {Button, responsiveFontSizes} from "@material-ui/core";
import {API, WEB} from "../../_metronic/_helpers/AxiosHelper";
import {useHistory} from "react-router-dom";
import {actions} from "../modules/Auth";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {customLogin, customGetUserByToken, CUSTOM_LOGIN_URL} from "../modules/Auth/_redux/authCrud";

export const MyPage = () => {
  // const subheader = useSubheader();
  //   subheader.setTitle("My Custom title");
    const [token,setToken]=useState('');
    const [user,setUser] = useState({});
    const history = useHistory();
    const dispatch = useDispatch();
    const { authToken } = useSelector(
        ({ auth }) => ({
            authToken: auth.authToken,
        }),
        shallowEqual
    );

    useEffect(()=>{
        //clickLoginHandler('admin@demo.com','password');
        buttonLoginHandler();
    },[])
    const testButtonHandler = (event) => {
      API.get('/test',{
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }).then((response)=>{

      })
  }
    const clickLoginHandler = (email,password) => {
        let data = {email,password};
        WEB.get('/sanctum/csrf-cookie').then(resp=>{
            API.post('/login',data).then(response=>{
                setToken(response.data.token);
            }).catch(err =>{
                console.error(err);
                history.push('/auth/login');
            })
        })
    }
    const clickLogoutHandler = () => {
        API.post('/logout',{},{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response=>{
            setToken('');
        }).catch(err =>{
            console.error(err);
        })
    }
    const getUser = () => {
        API.get('/user',{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response=>{
        }).catch(err =>{
            console.error(err);
        })
    }
    //custom redux events
    const buttonLoginHandler = (email='admin@demo.com',password='password') => {
        customLogin(email,password).then(response=>{
            setToken(response.data.token);
            dispatch(actions.customLogin(response.data.token));
        });
    }

    const buttonLogoutHandler = () => {
        dispatch(actions.logout());
    }
    const buttonUserHandler = () => {
        customGetUserByToken(authToken).then(response=>{
            let user = response.data.data;
            dispatch(actions.customRequestUser(user));
        })
    }

    const button4Handler = () => {

    }


    return (<>
      My Page
      <Button color={"secondary"} onClick={()=>{clickLoginHandler('admin@demo.com','password')}}>Login</Button>
      <Button color={"secondary"} onClick={(event)=>{testButtonHandler(event)}}>Test Button</Button>
      <Button color={"secondary"} onClick={()=>clickLogoutHandler()}>Logout</Button>
      <Button color={"secondary"} onClick={()=>getUser()}>User</Button>

      Redux actions
      <Button color={"secondary"} onClick={()=>{buttonLoginHandler()}}>Login</Button>
      <Button color={"secondary"} onClick={(event)=>{buttonLogoutHandler()}}>Logout</Button>
      <Button color={"secondary"} onClick={()=>{buttonUserHandler()}}>User Request</Button>
      <Button color={"secondary"} onClick={()=>{button4Handler()}}>Button4</Button>
  </>);
}
