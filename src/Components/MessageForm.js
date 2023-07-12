import React, { useRef } from "react";
import {
  Form,
  FormGroup,
  Col,
  Input,
  Label,
  Button,
  CardText,
  CardHeader,
  Card,
  Spinner,
} from "reactstrap";

export default function MessageForm(props) {
  const nameRef = useRef();
  const messageRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    props.onSubmit(nameRef.current.value, messageRef.current.value);
    nameRef.current.value = "";
    messageRef.current.value = "";
  };

  return (
    <Card body className="message_form">
      <CardHeader tag="h5">
        <strong>Welcome to Note Map!</strong>
      </CardHeader>
      <CardText>Leave your message!</CardText>
      {!props.sendingMessage && !props.sentMessage ? (
        <Form onSubmit={submitHandler}>
          <FormGroup row>
            <Label for="name">Name</Label>
            <Col sm={10}>
              <Input
                innerRef={nameRef}
                id="name"
                name="name"
                placeholder="Enter your name"
                type="text"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="message">Message</Label>
            <Col sm={10}>
              <Input
                id="message"
                name="message"
                placeholder="Leave your message"
                type="textarea"
                innerRef={messageRef}
              />
            </Col>
          </FormGroup>
          <Button type="submit" color="success">
            Post
          </Button>{" "}
          <Button color="danger" onClick={props.onCancel}>
            Cancel
          </Button>
        </Form>
      ) : props.sendingMessage ? (
        <Spinner color="primary" size="">
          Loading...
        </Spinner>
      ) : (
        <CardText>Thank you. Come again!</CardText>
      )}
    </Card>
  );
}
