import React from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "../style.css";
import Screenshot from "../Screenshot 2023-05-24 at 3.47.16 PM.png";

const UserHome = () => {
  const { context } = useParams();
  const [filteredComp, setFilteredComp] = useState([]);
  const [nextComp, setComp] = useState([]);
  const [socket] = useState(() => io(":8000"));
  const [selected, setSelected] = useState([]);
  const [update, setUpdate] = useState([]);
  const [final, setFinalComp] = useState([]);
  const [battery, setBattery] = useState([]);
  const [adapter, setAdapter] = useState();
  const arr = [];

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/companys")
      .then((serverResponse) => {
        console.log(
          "THIS IS WHAT WERE ARE GETTING BACK",
          serverResponse.data.Companys
        );
        setFilteredComp(serverResponse.data.Companys);
      })
      .catch((err) => {
        console.log("this is the error", err);
      });
  }, []);

  useEffect(() => {
    // we need to set up all of our event listeners
    // in the useEffect callback function
    socket.on("connect", (arg) => {
      socket.on("product", (arg) => {
        console.log("this is what is on client side", arg);
        setUpdate([...update, arg]);
      });
    });
    socket.on("yo", (arg) => {
      console.log(arg);
    });

    return () => {
      socket.off("connect");
      socket.off("product");
      socket.off("yo");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    setComp(
      filteredComp
        .filter((e) => e.type === context)
        .sort((a, b) => b.likes - a.likes)
    );
  }, [filteredComp, context]);

  const handleButton = (e) => {
    if (e.likes === undefined || e.likes == [] || e.likes == "") {
      e.likes = 0;
    }

    // Calculate();
    // function Calculate() {
    //   console.log("this the mean", ADAPTER / nextComp.length);
    //   console.log("this the like", e.likes);
    //   if (e.likes < 0.6 * (ADAPTER / nextComp.length)) {
    //     setBattery([1]);
    //     return;
    //   }
    //   if (
    //     e.likes < 0.8 * (ADAPTER / nextComp.length) &&
    //     e.likes > 0.6 * (ADAPTER / nextComp.length)
    //   ) {
    //     setBattery([1, 1]);
    //     return;
    //   }
    //   if (
    //     e.likes < ADAPTER / nextComp.length &&
    //     e.likes > 0.8 * (ADAPTER / nextComp.length)
    //   ) {
    //     setBattery([1, 1, 1]);
    //     return;
    //   }
    //   if (
    //     e.likes > 1.2 * (ADAPTER / nextComp.length) &&
    //     e.likes < 1.4 * (ADAPTER / nextComp.length)
    //   ) {
    //     setBattery([1, 1, 1, 1]);
    //     return;
    //   }
    //   if (e.likes > 1.3 * (ADAPTER / nextComp.length)) {
    //     setBattery([1, 1, 1, 1, 1]);
    //     return;
    //   }
    // }

    socket.emit(
      "theThrow",
      `user ${socket.id} just added ${e.businessName} to their favorites!`
    );

    console.log("below emit");
    let newAmt = {
      filteredComp,
      likes: e.likes + 1,
    };
    axios
      .patch("http://localhost:8000/api/companys/edit/" + e._id, newAmt)
      .then((serverRes) => {
        console.log("THE PATCH WENT THROUGH!", serverRes);
      })
      .catch((err) => {
        console.log("Patch did not work :(", err);
      });
  };

  useEffect(() => {
    battery();
    function battery() {
      let arr = [];
      console.log("THIS NEXTCOMP", nextComp);
      console.log(
        nextComp.map((single) => {
          if (!isNaN(single.likes)) {
            arr.push(single.likes);
            console.log("this is arr", arr);
          }
          let total = 0;
          for (let i = 0; i < arr.length; i++) {
            total += arr[i];
          }
          setAdapter([total]);
          console.log("this is adapter", adapter);
          return total;
        })
      );
    }
  }, [nextComp]);
  console.log("this is battery", adapter);
  return (
    <div style={{ overflow: "auto" }}>
      <h4 style={{ color: "limegreen" }}>
        {update.map((e, key) => {
          return <p key={key}>{e}</p>;
        })}
      </h4>
      <h1
        style={{
          margin: "10px",
          padding: "0",
          fontFamily: "'Righteous'",
          color: "white",
        }}
      >
        {selected}
      </h1>
      <select
        style={{
          width: "80%",
          height: "45px",
          border: "2px solid #fe2d8c",
          backgroundColor: "#212121",
          fontFamily: "'Righteous'",
          fontSize: "1.5rem",
          color: "#fe2d8c",
          textAlign: "center",
          borderRadius: "5px",
        }}
        // value={final}
        // onChange={(e) => {
        //   setFinalComp(e);
        // }}
      >
        <option value=""></option>
        <option value="Clubs">Clubs</option>
        <option value="Bars">Bars</option>
        <option value="Restaraunts">Restaraunts</option>
        <option value="Other">Other</option>
      </select>
      <h2
        style={{
          margin: "10px",
          padding: "0",
          fontFamily: "'Righteous'",
          color: "#fe2d8c",
          textAlign: "center",
        }}
      >
        {context}
      </h2>
      <div style={{ overflow: "auto" }}>
        {nextComp.map((single, key) => {
          return (
            <div
              style={{
                border: "3px solid white",
                borderRadius: "10px",
                marginBottom: "20px",
                marginRight: "5px",
                marginLeft: "5px",
                display: "flex",
                overflow: "auto",
              }}
              key={key}
            >
              <div
                style={{
                  height: "90px",
                  width: "130px",
                  backgroundColor: "#212121",
                  border: "5px solid black",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    margin: "0 auto",
                    height: "80px",
                    opacity: "50%",
                  }}
                  src={Screenshot}
                ></img>
              </div>
              <div style={{ display: "flex" }}>
                <div>
                  <h1
                    style={{
                      margin: "0px",
                      padding: "0px",
                      margin: "10px",
                      fontFamily: "'Righteous'",
                      color: "#fe2d8c",
                    }}
                  >
                    {single.businessName}
                  </h1>
                  <p
                    style={{
                      margin: "0px",
                      padding: "0px",
                      margin: "0px",
                      padding: "0px",
                      margin: "10px",
                      fontFamily: "'Righteous'",
                      color: "white",
                      width: "100px",
                      fontSize: ".7rem",
                    }}
                  >
                    {single.description}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "0px",
                      padding: "0px",
                      margin: "0px",
                      padding: "0px",
                      margin: "10px",
                      fontFamily: "'Righteous'",
                      color: "limegreen",
                    }}
                  >
                    {console.log("this is length", nextComp.length)}
                    <div>
                      <div style={{ display: "flex" }}>
                        {single.likes <= 0.6 * (adapter / nextComp.length) ? (
                          <div
                            style={{
                              width: "15px",
                              height: "5px",
                              backgroundColor: "green",
                            }}
                          ></div>
                        ) : single.likes < 0.8 * (adapter / nextComp.length) &&
                          single.likes > 0.6 * (adapter / nextComp.length) ? (
                          <div style={{ display: "flex", gap: "3px" }}>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                          </div>
                        ) : single.likes < adapter / nextComp.length &&
                          single.likes > 0.8 * (adapter / nextComp.length) ? (
                          <div style={{ display: "flex", gap: "3px" }}>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                          </div>
                        ) : single.likes < 1.3 * (adapter / nextComp.length) &&
                          single.likes > 1 * (adapter / nextComp.length) ? (
                          <div style={{ display: "flex", gap: "3px" }}>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                          </div>
                        ) : single.likes > 1.3 * (adapter / nextComp.length) ? (
                          <div style={{ display: "flex", gap: "3px" }}>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "15px",
                                height: "5px",
                                backgroundColor: "green",
                              }}
                            ></div>
                          </div>
                        ) : (
                          <h1></h1>
                        )}
                      </div>
                    </div>
                    {single.likes} Users
                  </p>

                  <label
                    style={{ fontFamily: "'Righteous'", color: "limegreen" }}
                  >
                    <button
                      style={{
                        fontFamily: "'Righteous'",
                        color: "#fe2d8c",
                        backgroundColor: "#212121",
                        border: "2px solid limegreen",
                        margin: "5px",
                      }}
                      onClick={() => {
                        handleButton(single);
                      }}
                    >
                      I'm interested in this spot.
                    </button>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserHome;
