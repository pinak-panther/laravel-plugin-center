/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink} from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
import {makeStyles} from "@material-ui/core/styles";

export function AsideMenuList({layoutProps}) {
    const location = useLocation();

    const useStyles = makeStyles(theme => ({
       menu:{
           fontSize:'1.5rem',
           color:'white',
           listStyleType:'none',
       },
       submenu:{
           paddingTop:'5px',
           fontSize:'1.1rem',
           textDecoration:'none'
       },
       menuLink:{
           color:'white'
       },
       linkBullet:{
           paddingRight:'5px',
           paddingTop:'0px',
           verticalAlign:'middle'
       },
        linkText:{
            fontSize:'1.1rem',
        }
    }));
    const classes = useStyles();
    // return (
    //     <>
    //         {/* begin::Menu Nav */}
    //         <ul className={`menu-nav ${layoutProps.ulClasses}`}>
    //             {/* Material-UI */}
    //             {/*begin::1 Level*/}
    //             <li
    //                 className={`menu-item menu-item-submenu ${getMenuItemActive(
    //                     "/google-material",
    //                     true
    //                 )}`}
    //                 aria-haspopup="true"
    //                 data-menu-toggle="hover"
    //             >
    //                 <NavLink className="menu-link menu-toggle" to="/google-material">
    //                     <span className="svg-icon menu-icon">
    //                       <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
    //                     </span>
    //                     <span className="menu-text">Plugin Center</span>
    //                     <i className="menu-arrow" />
    //                 </NavLink>
    //                 <div className="menu-submenu ">
    //                     <i className="menu-arrow" />
    //                     <ul className="menu-subnav">
    //                         <li className="menu-item  menu-item-parent" aria-haspopup="true">
    //             <span className="menu-link">
    //               <span className="menu-text">Material UI</span>
    //             </span>
    //                         </li>
    //
    //                         {/* Inputs */}
    //                         {/*begin::2 Level*/}
    //                         <li
    //                             className={`menu-item menu-item-submenu ${getMenuItemActive(
    //                                 "/application-list",
    //                                 true
    //                             )}`}
    //                             aria-haspopup="true"
    //                             data-menu-toggle="hover"
    //                         >
    //                             <NavLink
    //                                 className="menu-link menu-toggle"
    //                                 to="/application-list"
    //                             >
    //                                 <i className="menu-bullet menu-bullet-dot">
    //                                     <span />
    //                                 </i>
    //                                 <span className="menu-text">Applications</span>
    //                                 <i className="menu-arrow" />
    //                             </NavLink>
    //                             <div className="menu-submenu ">
    //                                 <i className="menu-arrow" />
    //                                 <ul className="menu-subnav">
    //                                     {/*begin::3 Level*/}
    //                                     <li
    //                                         className={`menu-item  ${getMenuItemActive(
    //                                             "/application-list"
    //                                         )}`}
    //                                         aria-haspopup="true"
    //                                     >
    //                                         <NavLink
    //                                             className="menu-link"
    //                                             to="/application-list"
    //                                         >
    //                                             <i className="menu-bullet menu-bullet-dot">
    //                                                 <span />
    //                                             </i>
    //                                             <span className="menu-text">Application List</span>
    //                                         </NavLink>
    //                                     </li>
    //                                     {/*end::3 Level*/}
    //
    //                                     {/*begin::3 Level*/}
    //                                     <li
    //                                         className={`menu-item ${getMenuItemActive(
    //                                             "/application-add"
    //                                         )}`}
    //                                         aria-haspopup="true"
    //                                     >
    //                                         <NavLink
    //                                             className="menu-link"
    //                                             to="/application-add"
    //                                         >
    //                                             <i className="menu-bullet menu-bullet-dot">
    //                                                 <span />
    //                                             </i>
    //                                             <span className="menu-text">Application Add</span>
    //                                         </NavLink>
    //                                     </li>
    //                                     {/*end::3 Level*/}
    //
    //                                 </ul>
    //                             </div>
    //                         </li>
    //                         {/*end::2 Level*/}
    //
    //                         {/* Stores */}
    //                         {/*begin::2 Level*/}
    //                         <li
    //                             className={`menu-item menu-item-submenu ${getMenuItemActive(
    //                                 "/store-list",
    //                                 true
    //                             )}`}
    //                             aria-haspopup="true"
    //                             data-menu-toggle="hover"
    //                         >
    //                             <NavLink
    //                                 className="menu-link menu-toggle"
    //                                 to="/store-list"
    //                             >
    //                                 <i className="menu-bullet menu-bullet-dot">
    //                                     <span />
    //                                 </i>
    //                                 <span className="menu-text">Stores</span>
    //                                 <i className="menu-arrow" />
    //                             </NavLink>
    //                             <div className="menu-submenu">
    //                                 <i className="menu-arrow" />
    //                                 <ul className="menu-subnav">
    //                                     {/*begin::3 Level*/}
    //                                     <li
    //                                         className={`menu-item ${getMenuItemActive(
    //                                             "/store-list"
    //                                         )}`}
    //                                         aria-haspopup="true"
    //                                     >
    //                                         <NavLink
    //                                             className="menu-link"
    //                                             to="/store-list"
    //                                         >
    //                                             <i className="menu-bullet menu-bullet-dot">
    //                                                 <span />
    //                                             </i>
    //                                             <span className="menu-text">Store List</span>
    //                                         </NavLink>
    //                                     </li>
    //                                     {/*end::3 Level*/}
    //                                 </ul>
    //                             </div>
    //                         </li>
    //                         {/*end::2 Level*/}
    //                     </ul>
    //                 </div>
    //             </li>
    //             {/*end::1 Level*/}
    //         </ul>
    //         {/* end::Menu Nav */}
    //     </>
    // );

    return (
        <>
          <ul style={{marginTop:'80px'}} >
              <li className={classes.menu}>Application</li>
              <div>
                  <ul className={classes.menu} style={{paddingLeft:'20px'}}>
                      <li className={classes.submenu} >
                          <NavLink className={classes.menuLink} to="/application-list" >
                              <i className={"fas fa-angle-double-right "+ classes.linkBullet} ></i>
                              <span className="menu-text ">List Application</span>
                          </NavLink>
                      </li>
                      <li className={classes.submenu}>
                          <NavLink  className={classes.menuLink} to="/application-add" >
                              <i className={"fas fa-angle-double-right "+ classes.linkBullet} ></i>
                              <span >Add Application</span>
                          </NavLink>
                      </li>

                  </ul>
              </div>
              <li className={classes.menu} style={{marginTop:'15px'}}>Store</li>
              <div>
                  <ul className={classes.menu} style={{paddingLeft:'20px'}}>
                      <li className={classes.submenu}>
                          <NavLink className={classes.menuLink} to="/store-list" >
                              <i className={"fas fa-angle-double-right "+ classes.linkBullet} ></i>
                              <span className={"menu-text " }>List Store</span>
                          </NavLink>
                      </li>
                  </ul>
              </div>
          </ul>
        </>
    );
}
