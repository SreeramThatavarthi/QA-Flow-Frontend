import { Button, Paper } from "@material-ui/core";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import React, { useState, useEffect, useRef } from "react";
import BasePage from "./BasePage";
import { config } from "../config";
import { useHistory, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import TextEditor from '../components/TextEditor'
import 'react-toastify/dist/ReactToastify.min.css';
import "./AskQuestion.css";

import { WithContext as ReactTags } from 'react-tag-input';
import { useMediaQuery } from 'react-responsive';
import ReactHtmlParser from 'html-react-parser';
import MiniTextEditor from "../components/MiniTextEditor";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [ KeyCodes.enter];

function AskQuestion() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)'
  })

  const inputFile = useRef(null)
  const history = useHistory();
  const location = useLocation()
  let questionTitle = location.state === undefined ? "" : location.state.QTitle
  let questionBody = location.state === undefined ? "" : location.state.body
  let questionTags = location.state === undefined ? [] : location.state.tags
  const [title, setTitle] = useState(questionTitle);
  const [file, setFile] = useState('');
  const [question, setQuestion] = useState(questionBody);
  const [tags, setTags] = useState([]);
  const [productTags,setProductTags]=useState([]);
  const [suggestions,setSuggestions]=useState([
    { id: "", text: "" },
    ]);

    const handleDelete=(i)=> {
      setTags(tags.filter((tag, index) => index !== i))
    }

    const handleAddition=(tag)=>{
      setTags([...tags,tag])
    }

    const handleDrag=(tag, currPos, newPos)=> {
      const newTags = tags.slice();
  
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);
  
    //  setTags(newTags);
    }

  const createQuestion = () => {
    if(title!=''&&question!='' )
    {
     
        Object.entries(tags).map((s,t)=>{
          productTags.push(s[1].id);
        })
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/new/question`, {
      body: JSON.stringify({
        postedBy: `${userData.user._id}`,
        title: title,
        body: question,
        tags: productTags,
        file: file
      }),
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setTags([]);
      setQuestion("");
      setTitle("");
      toast.success('Question Posted 👍🏻', {
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: function () {
          history.push("/");
        }
      });
    })
    .catch((err)=>{
      toast(err,{type:"error"});
    })
  }
  else{
    toast("Please Enter Title and Description of the question",{type:"error"});
  }
  };

  const updateQuestion = () => {
    Object.entries(tags).map((s,t)=>{
      productTags.push(s[1].id);
    })
    const userData = JSON.parse(localStorage.getItem('userData'))
    fetch(`${config.apiUrl}/api/edit/question`, {
      body: JSON.stringify({
        questionId: `${location.state.id}`,
        title: title,
        body: question,
        tags: productTags,
        file: file
      }),
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      toast("You have updated the question successfully",{type:"success"})
      setTags([]);
      setQuestion("");
      setTitle("");
      history.push({
        pathname: "/activity",
        state: { pos: 0 },
      });
    })
    .catch((err)=>{console.log("err",err)})
  }

  const uploadDoc = (e) => {
    setFile('')
    var FileSize = e.target.files[0].size / 1024 / 1024; // in MiB
    if (FileSize > 0.05) {
      toast.error('Max file size is 50 KB ❕', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function () {
        setFile(reader.result);
      };
    }
  }

  useEffect(() => {
    questionTags.map((q)=>{
      tags.push({ id:q, text: q });
    })

    if (localStorage.getItem("userData") === null) {
      toast("Please login",{type:"warning"})
      history.push('/login')
    }
  }, []);

  return (
    <BasePage>
     
      <Paper className="form-container" elevation={2}>
        <div style={{ marginBottom: "15px" }}>
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" onChange={(e) => {
              setTitle(e.target.value);
            }} placeholder="Enter Question Title" value={title} />
          </InputGroup>
        </div>
        <div style={{ marginBottom: "15px" }}>
            <InputGroup size="lg">
              <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" as="textarea" rows={7} onChange={(e) => {
                setQuestion(e.target.value);
              }} value={question} placeholder="Enter Description..."/>
            </InputGroup>
           </div>
        {/* {
          isDesktopOrLaptop &&
        <TextEditor setText={setQuestion} text={question}></TextEditor>
        }
        {
          isTabletOrMobileDevice &&
          // <div style={{ marginBottom: "15px" }}>
          //   <InputGroup size="lg">
          //     <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" as="textarea" rows={7} onChange={(e) => {
          //       setQuestion(e.target.value);
          //     }} placeholder="Description"/>
          //   </InputGroup>
          // </div>
          <MiniTextEditor setText={setQuestion} text={question}></MiniTextEditor>
        } */}
        <div style={{ marginTop: "15px" }}>

        <ReactTags 
          tags={tags}
          suggestions={suggestions}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          delimiters={delimiters}
        />

        </div>
        <div>
          <Button
            onClick={() => {
              inputFile.current.click();
            }}
            color="primary"
            className="submit-btn"
            variant="contained"
            style={{ color: "white", textTransform: "none", maxWidth: "400px" }}
          >
            <b>Upload File</b>
          </Button>
          {' '}
          {
            file !== '' ?
              <>
                < span style={{ marginTop: "190px" }}> <b>File Uploaded 👍🏻</b></span>
              </>
              :
              null
          }
          {
            location.state === undefined ?
              <Button
                onClick={createQuestion}
                color="primary"
                className="submit-btn"
                variant="contained"
                style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none", float: "right" }}
              >
                <b>Submit</b>
              </Button> :
              <Button
                onClick={updateQuestion}
                color="primary"
                className="submit-btn"
                variant="contained"
                style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none", float: "right" }}
              >
                <b>Update</b>
              </Button>
          }
        </div>
        <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={uploadDoc} />
      </Paper>
    </BasePage >
  );
}

export default AskQuestion;
