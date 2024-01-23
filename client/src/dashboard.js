import React,{useEffect,useState} from "react";
import axios from "axios"
import { v4 as uuidV4 } from "uuid";
import { Link } from "react-router-dom";

export default function Dashboard(props){

    useEffect(() => {
        axios.get("/login/success",{withCredentials:true})
          .then((response) => {
            props.setUser(response.data.user);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      },[]);
      
    return <div className="dashboard">
    {props.user ? (
      <>
      <div className="user-details">
        <p>Name: {props.user.name}</p>
        <p>Email: {props.user.email}</p>

        <div className="create-document">
            <Link to={`/document/${uuidV4()}`}>
              <button>Create New Document</button>
            </Link>
          </div>

        </div>

        <h3>Documents: </h3>

        {props.user.documents.length > 0 ? (
          <>
            <ul>
              {props.user.documents.map((document) => (
                <li key={document._id}>
                  <Link to={`/document/${document._id}`}>
                    <strong>Name:</strong> {document.name[0]}, <strong>ID:</strong> {document._id}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ):"No Documents Found..."}
      </>
    ) : (
      <p>Loading user data...</p>
    )}
  </div>
}