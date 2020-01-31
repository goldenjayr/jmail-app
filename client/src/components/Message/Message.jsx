import React from "react";
import { Card, CardText, CardBody, CardTitle, CardSubtitle } from "reactstrap";

import "./message.css";

function Message({ from, to, subject, text }) {
  return (
    <Card>
      <CardBody className="cardd">
        <CardSubtitle>From: {from}</CardSubtitle>
        <CardSubtitle>To: {to}</CardSubtitle>
        <CardTitle>Subject: {subject}</CardTitle>
        <CardText>Text: {text}</CardText>
      </CardBody>
    </Card>
  );
}

export default Message;
