import React, { useState, useRef } from "react";
import { Form, FormGroup, Input, Col, Button, Spinner } from "reactstrap";
import { useMutation } from "react-apollo";
import './composeMail.css'
import { CREATE_MAIL } from "../queries";

function ComposeMail({username}) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [sendLoading, setSendLoading] = useState(null)

  const [createMail, { data }] = useMutation(CREATE_MAIL, {
    onCompleted: () => {
      setSendLoading(<span className="message-sent">Message Sent</span>)
      setTimeout(() => {
        setSendLoading(null)
      }, 2000)
    }
  });
  console.log("Mutation data", data)
  return (
    <>
    <Form onSubmit={onSubmitHandler} className="compose-mail">
    Compose New Mail
      <FormGroup>
        <Input
          type="text"
          name="email"
          id="recipient"
          placeholder="To"
          value={email}
          onChange={e => onChangeHandler(e, setEmail)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="text"
          name="subject"
          id="subject"
          placeholder="Subject"
          value={subject}
          onChange={e => onChangeHandler(e, setSubject)}
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="textarea"
          name="text"
          id="message"
          placeholder="Type a message..."
          value={text}
          onChange={e => onChangeHandler(e, setText)}
        />
      </FormGroup>
      <Button type="submit" color="primary">
        Send
      </Button>
      <span className="spinner">
       {sendLoading}
      </span>
    </Form>
    </>
  );

  function onSubmitHandler(e) {
    e.preventDefault();
    createMail({
      variables: {
        mailInput: {
          from: username,
          to: email,
          subject,
          text
        }
      }
    });
    setSendLoading(<Spinner color="light" />)
    clearInputFields()
  }

  function onChangeHandler(e, setState) {
    setState(e.target.value);
  }

  function clearInputFields() {
    setEmail("")
    setSubject("")
    setText("")


  }
}

export default ComposeMail;
