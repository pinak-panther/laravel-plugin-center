import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Tab, Tabs} from "@material-ui/core";
import TabPanel from "../../../_metronic/_partials/controls/tabs/TabPanel";

function EditSnippet(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            height: 500,
        },
        tabs: {
            borderRight: `1px solid ${theme.palette.divider}`,
        },
        buttons:{
            marginRight: '10px'
        }
    }));

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState({});
    const [updateSnippet, setUpdateSnippet] = useState(false);
    const [pushSnippetToShopify, setPushSnippetToShopify] = useState(false);
    const [resetSnippet, setResetSnippet] = useState(false);
    const shopifyUpdateSnippetURL = '';

    useEffect(() => {
        const tempArray = [
            {"filename": "test1.liquid", "content": "1 test file content", "index": 0},
            {"filename": "test2.liquid", "content": "2 test file content", "index": 1},
            {"filename": "test3.liquid", "content": "3 test file content", "index": 2},
            {"filename": "test4.liquid", "content": "4 test file content", "index": 3},
            {"filename": "test5.liquid", "content": "5 test file content", "index": 4},
            {"filename": "test6.liquid", "content": "6 test file content", "index": 5},
            {"filename": "test7.liquid", "content": "7 test file content", "index": 6},
            {"filename": "test8.liquid", "content": "8 test file content", "index": 7},
            {"filename": "test9.liquid", "content": "9 test file content", "index": 8},
            {"filename": "test10.liquid", "content": "10 test file content", "index": 9},
            {"filename": "test11.liquid", "content": "11 test file content", "index": 10},
            {"filename": "test12.liquid", "content": "12 test file content", "index": 11},
        ]
        let filesFromLocalStorage = localStorage.getItem('files');
        if (filesFromLocalStorage != null) {
            filesFromLocalStorage = JSON.parse(filesFromLocalStorage);
            setFiles(filesFromLocalStorage);
            setSelectedFile(filesFromLocalStorage[0]);

        } else {
            setFiles(tempArray);
            setSelectedFile(tempArray[0]);
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

    useEffect(() => {
        // console.log(selectedFile);
    }, [selectedFile.content]);

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
    };

    const handlePushSnippetToShopify = event => {

        let filesFromLocalStorage = localStorage.getItem('files');
        if (filesFromLocalStorage != null) {
            setUpdateSnippet(true);
            setPushSnippetToShopify(true);
            localStorage.removeItem('files');
            history.back();

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
        setResetSnippet(!resetSnippet);
    };

    const generateTabPanelContent = () => {
        return files.map((file) => {
            return (
                <TabPanel value={value} index={file.index} key={file.index}>
                <textarea name={`tab_${file.index}`} id={`test_${file.index}`} cols={150} rows={20}
                          value={selectedFile.content}
                          onChange={(event) => handleFileContentChange(event)}/>
                    <Button className={classes.buttons} variant={"contained"} color={"secondary"} onClick={(event) => handleUpdateSnippet(event)}
                            disabled={updateSnippet}>Update Snippet</Button>
                    <Button className={classes.buttons} variant={"contained"} color={"secondary"}
                            onClick={(event) => handlePushSnippetToShopify(event)} disabled={pushSnippetToShopify}>Push
                        All Snippet to Shopify</Button>
                    <Button variant={"contained"} color={"secondary"}
                            onClick={(event) => handleResetClick()}>Reset Snippets</Button>
                </TabPanel>
            )
        });
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
        const filteredFile = files.filter(file => file.index == newValue);
        setSelectedFile(filteredFile[0]);
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

export default EditSnippet;
