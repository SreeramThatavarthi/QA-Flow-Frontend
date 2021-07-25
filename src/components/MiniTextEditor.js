import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import "./TextEditor.css";

function MiniTextEditor({ setText, text }) {
    const editorConfiguration = {
        toolbar: [
            "heading",
            
        ],
        placeholder: "Enter Description....",
    };
    function handelOnChange(e, editor) {
        const data = editor.getData();
        setText(data);
    }
    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            onChange={handelOnChange}
            data={text}
            placeHolder={'Enter Desc'}
        ></CKEditor>
    );
}

export default MiniTextEditor;
