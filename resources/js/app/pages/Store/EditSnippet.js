import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, LinearProgress, Tab, Tabs} from "@material-ui/core";
import TabPanel from "../../../_metronic/_partials/controls/tabs/TabPanel";
import {API} from "../../../_metronic/_helpers/AxiosHelper";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
function EditSnippet(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            height: 500,
            fontFamily:'poppins'
        },
        tabs: {
            borderRight: `1px solid ${theme.palette.divider}`,
        },
        buttons:{
            marginRight: '10px'
        },
        buttonContainer:{
            textAlign:'center'
        },
        loadingBarContainer:{
            width : '825px',
            paddingLeft:'27px',
            paddingTop:'180px',
            textAlign:'center'
        },
        loaderText:{
            color:'#848383'
        }

    }));

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState({});
    const [updateSnippet, setUpdateSnippet] = useState(false);
    const [pushSnippetToShopify, setPushSnippetToShopify] = useState(false);
    const [resetSnippet, setResetSnippet] = useState(false);
    const [loading,setLoading] = useState(true);
    const params = useParams();
    const {appId,storeId} = params;


    useEffect(() => {
        let filesFromLocalStorage = localStorage.getItem('files');
        if (filesFromLocalStorage != null) {
            filesFromLocalStorage = JSON.parse(filesFromLocalStorage);
            setFiles(filesFromLocalStorage);
            setSelectedFile(filesFromLocalStorage[0]);
            setLoading(false);
        } else {
            API.get(`/store/get-all-snippets?appId=${appId}&storeId=${storeId}`,prepareAuthHeader())
                .then(response=>{
                    let data = response.data
                    const tempArray = [];
                    tempArray.push(...data.data);
                    setFiles(tempArray);
                    setSelectedFile(tempArray[0]);
                    // console.log(tempArray);
                    resetSnippet ? setValue(0) : null ;
                    setLoading(false);
                    setResetSnippet(false);
                })
                .catch(error=>{
                    console.log(error);
                    setLoading(false);
                })
        }
    }, [resetSnippet]);

    const generateTabContent = () => {
        const allTab = files.map((file) => {
            return (
                <Tab label={file.filename} key={file.index}/>
            )
        });
        return allTab;
    }

    const prepareAuthHeader = () => {
        const header={
            headers:{
                'Authorization':`${props.authToken}`
            }
        }
        return header;
    };

    const handleFileContentChange = event => {
        setSelectedFile({...selectedFile, "content": event.target.value});
        setUpdateSnippet(false);
    };

    const handleUpdateSnippet = event => {
        let filteredFiles = files.filter(file => file.filename !== selectedFile.filename)
        filteredFiles = [...filteredFiles, selectedFile];
        let sortedFiles = filteredFiles.sort(function (f1, f2) {
            if (f1.index == f2.index)
                return 0;
            return f1.index > f2.index ? 1 : -1;
        });
        setFiles(sortedFiles);
        localStorage.setItem('files', JSON.stringify(sortedFiles));
        setUpdateSnippet(true);
        setPushSnippetToShopify(true);
    };

    const handlePushSnippetToShopify = event => {
        let filesFromLocalStorage = localStorage.getItem('files');
        // console.log("filesFromLocalStorage");
        // console.log(filesFromLocalStorage);
        if (filesFromLocalStorage != null) {
            API.post('/store/update-all-snippets',{storeId, files:filesFromLocalStorage},prepareAuthHeader())
                .then(response=>{
                    // console.log(response);
                    setPushSnippetToShopify(true);
                    localStorage.removeItem('files');
                    history.back();
                });
            // axios.post(shopifyUpdateSnippetURL,{data:selectedFile.content})
            // .then(response=>{
            //     setUpdateSnippet(true);
            //     setPushSnippetToShopify(true);
            //     localStorage.removeItem('files');
            // }).catch(error=>console.log(error));
        }

    };

    const handleResetClick = () => {
        localStorage.removeItem('files');
        setResetSnippet(true);
    };
    const showLoader = (text)=>{
        return (
            <div className={classes.loadingBarContainer}>
                <p>
                    <span className={classes.loaderText}>{text.toUpperCase()}...</span>
                </p>
                <LinearProgress color={"secondary"}/>
            </div>
        );
    }
    const generateTabPanelContent = () => {
        return files.map((file) => {
            return (
                <TabPanel value={value} index={file.index} key={file.index}>
                <h4>{file.filename.toUpperCase()}</h4>
                    {loading ?
                        showLoader('fetching snippet'):
                        <textarea name={`tab_${file.index}`} id={`test_${file.index}`} cols={120} rows={20} value={selectedFile.content}
                          onChange={(event) => handleFileContentChange(event)}
                          onBlur={()=>handleUpdateSnippet(event)}/>
                    }
                    {
                        loading ? null :
                        <div className={classes.buttonContainer}>
                            {/*<Button className={classes.buttons} variant={"contained"} color={"secondary"} onClick={(event) => handleUpdateSnippet(event)}*/}
                            {/*        disabled={updateSnippet}>Update Snippet</Button>*/}
                            <Button className={classes.buttons} variant={"contained"} color={"secondary"}
                                    onClick={(event) => handlePushSnippetToShopify(event)} disabled={!pushSnippetToShopify}>Push
                                All Snippet to Shopify</Button>
                            <Button variant={"contained"} color={"secondary"}
                                    onClick={(event) => handleResetClick()}>Reset Snippets</Button>
                        </div>
                    }

                </TabPanel>
            )
        })
    }

    const checkLocalStorageForSnippet = (newValue)=>{
        let filesFromLocalStorage = localStorage.getItem('files');
        if (filesFromLocalStorage == null)
            return false;
        filesFromLocalStorage = JSON.parse(filesFromLocalStorage);
        let filteredFileFromStorage = filesFromLocalStorage.find(file=>file.index==newValue);
        return filteredFileFromStorage.content != '';
    }
    const handleChange = (event, newValue) => {
        setLoading(true);
        if(checkLocalStorageForSnippet(newValue)){
            let filesFromLocalStorage = localStorage.getItem('files');
            filesFromLocalStorage = JSON.parse(filesFromLocalStorage);
            let filteredFileFromStorage = filesFromLocalStorage.find(file=>file.index==newValue);
            setSelectedFile(filteredFileFromStorage);
            setValue(newValue);
            setLoading(false);
        }
        else{
            const url = `/store/get-single-snippet?appId=${appId}&storeId=${storeId}&snippetIndex=${newValue}`;
            API.get(url,prepareAuthHeader())
                .then(response=>  {
                    let responseData = response.data.data[0]
                    let composedData = {
                        "index":parseInt(responseData.index),
                        "filename":responseData.filename,
                        "content":responseData.content,
                    }
                    const filteredFiles = files.filter(file=>file.index != newValue)
                    filteredFiles.push(composedData);
                    let sortedFiles = filteredFiles.sort(function (f1, f2) {
                        if (f1.index == f2.index)
                            return 0;
                        return f1.index > f2.index ? 1 : -1;
                    });
                    setFiles(sortedFiles);
                    const findedFile = sortedFiles.find(file => file.index == newValue); // used sortedFiles instead files to avoid async issues.
                    setSelectedFile(findedFile);
                    setValue(newValue);
                    setLoading(false);
                })
                .catch(error=>{
                    console.log(error);
                    setLoading(false);
                })
        }

    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                {generateTabContent().length > 0 ? generateTabContent() : null}
            </Tabs>
            {generateTabPanelContent().length > 0 ? generateTabPanelContent() : null}
        </div>
    )
}

const mapStateToProps = (state,ownProps)=> {
    const {auth:{authToken}} = state;
    return {authToken};
}
export default connect(mapStateToProps)(EditSnippet);
