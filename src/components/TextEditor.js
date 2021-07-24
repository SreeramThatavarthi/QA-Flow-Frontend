import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import "./TextEditor.css";

function TextEditor({ setText, text }) {
    const editorConfiguration = {
        toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "fontSize",
            "fontColor",
            "fontFamily",
            "|",
            "highlight",
            "link",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
            "|",
            "imageUpload",
            "blockQuote",
            "insertTable",
            "MathType",
            "ChemType",
            "superscript",
            "subscript",
            "code",
            "codeBlock",
            "undo",
            "redo",
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

export default TextEditor;
