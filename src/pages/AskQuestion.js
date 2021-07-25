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

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [ KeyCodes.enter];

const AskQuestion=()=> {
  const inputFile = useRef(null)
  const history = useHistory();
  const [questionTitle,setQuestionTitle]=useState("");
  const [questionBody,setQuestionBody]=useState("");
  const [questionTags,setQuestionTags]=useState([]);
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
      
      console.log("tags",tags);
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
    console.log(file);
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
      console.log("res",res);
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

  const uploadDoc = (e) => {
    console.log(e.target.files[0])
    setFile('')
    var FileSize = e.target.files[0].size / 1024 / 1024; // in MiB
    console.log(FileSize);
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
      console.log("true")
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function () {
        console.log(reader.result)
        setFile(reader.result);
      };
    }
  }

  useEffect(() => {
    if (localStorage.getItem("userData") === null) {
      toast("Please login",{type:"warning"})
      history.push('/login')
    }
  }, []);

  return (
    <BasePage>
      <ToastContainer position="top-center" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Paper className="form-container" elevation={2}>
        <div style={{ marginBottom: "15px" }}>
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" onChange={(e) => {
              setTitle(e.target.value);
            }} placeholder="Enter Question Title" value={title} />
          </InputGroup>
        </div>
        <TextEditor setText={setQuestion} text={question}></TextEditor>
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
              <Button
                onClick={createQuestion}
                color="primary"
                className="submit-btn"
                variant="contained"
                style={{ backgroundColor: "#4caf50", color: "white", textTransform: "none", float: "right" }}
              >
                <b>Submit</b>
              </Button> 
        </div>
        <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={uploadDoc} />
      </Paper>
    </BasePage >
  );
}

export default AskQuestion;
