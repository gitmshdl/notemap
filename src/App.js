import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import React, { useEffect, useState } from "react";
import MessageForm from "./Components/MessageForm";
import { Card, CardText, Button } from "reactstrap";
import { getLocation } from "./api";

function App() {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [messages, setMessages] = useState([]);

  const buttonClickHandler = () => {
    setShowMessageForm(true);
    getLocation().then((location) => {
      setLatitude(location.lat);
      setLongitude(location.lng);
    });
  };

  const formSubmitHandler = (name, message) => {
    setSendingMessage(true);

    const newMessage = {
      name,
      message,
      latitude,
      longitude,
    };

    console.log(newMessage);

    fetch("http://localhost:3001/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });
    setSendingMessage(false);
    setSentMessage(true);
  };

  const cancelMessageHandler = () => {
    setShowMessageForm(false);
  };

  useEffect(() => {
    fetch("http://localhost:3001/read")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((messages) => {
        const haveSeenLocation = {};
        const res = messages.reduce((all, message) => {
          const key = `${message.latitude.toFixed(
            3
          )}${message.longitude.toFixed(3)}`;
          if (haveSeenLocation[key]) {
            haveSeenLocation[key].otherMessages =
              haveSeenLocation[key].otherMessages || [];
            haveSeenLocation[key].otherMessages.push(message);
          } else {
            haveSeenLocation[key] = message;
            all.push(message);
          }
          return all;
        }, []);
        setMessages(res);
      });
  }, []);

  return (
    <div id="container">
      <MapContainer
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={2}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <LocationMarker name={name} message={message} /> */}

        {messages.map((message) => (
          <Marker
            key={message._id}
            position={[message.latitude, message.longitude]}
          >
            <Popup>
              <p>
                <em>{message.name}:</em> {message.message}
              </p>
              {message.otherMessages
                ? message.otherMessages.map((message) => (
                    <p key={message._id}>
                      <em>{message.name}:</em> {message.message}
                    </p>
                  ))
                : ""}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {!showMessageForm ? (
        <Button className="message" onClick={buttonClickHandler}>
          Add a Message!
        </Button>
      ) : !sentMessage ? (
        <MessageForm
          onSubmit={formSubmitHandler}
          onCancel={cancelMessageHandler}
          sendingMessage={sendingMessage}
          sentMessage={sentMessage}
          showForm={showMessageForm}
        />
      ) : sentMessage ? (
        <Card body className="thanks-form">
          <CardText>Thanks for submitting a message!</CardText>
        </Card>
      ) : (
        ""
      )}
      <Card className="footer">
        <CardText> Made by David Lee </CardText>
      </Card>
    </div>
  );
}

export default App;
