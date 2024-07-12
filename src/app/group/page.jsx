//This is the group chat, Same as the chats
import { useState, useEffect, Suspense } from "react";
import { MdArrowBackIos, MdDelete } from "react-icons/md";
import {useSearchParams } from "react-router-dom";
import Loader from "../../components/loader/loader";
import { Log, Profile,Groups, Deletegroup,Exitgroup } from "./log.js";
import { io } from "socket.io-client";
import GroupScreen from "../../components/groupscreen/screen.jsx";
import { useNavigate } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
const userd = window.localStorage.getItem("userid")
    
const SERVER_URL = "https://swiftback.onrender.com";
const socket = io(SERVER_URL);

export default function Group() {
  const router = useNavigate();
  const [searchparam,setSearchparams] = useSearchParams();
  const [msgArray, setMsgArray] = useState([]);
  const [myname, setname] = useState("User");
  const [forum, setforum] = useState("");
  const [members,setMembers] = useState([])
  const [title,setTitle] = useState('')
  const [groupimage,setGroupimage] = useState('')
  const [realsender,setSender] = useState('')
  const [load,setLoad] = useState(false)
  const [admin,setAdmin]= useState('')
 
  const FetchData = async (id) => {
    setLoad(true)
    try {
      const response = await Profile()
      if(response.success){
        setname(`${response.data.displayname}`)
      }
      
    } catch (error) {
     //router(-1)
    }
    try {
      const response = await Log(id)
      if(Array.isArray(response)){
        setSender(response[0].sender)
        setMsgArray(response)
      }
      else{
       // router()
      }
    } catch (error) {
      //router()
    } 
    try {
      const response = await Groups(id)
      if(response.success){
        const mydata = response.data;
        const {image,name,members,admin} = mydata;
        setTitle(name)
        setGroupimage(image)
        setMembers(members)
        setAdmin(admin)

      }
      else{
       alert(response.message)
       router(-1)
      }
    } catch (error) {
      //router()
    } 
  
    finally {
      setLoad(false);
    }
  };

  const search = async () => {
    try {
      const groupid = searchparam.get("id");
      if (groupid === "") {
        router(-1);
        return;
      }
      setforum(groupid);
      FetchData(groupid)
    } catch (error) {
     // router();
    }
  };

  socket.on("groupmessage", (data) => {
    if (data.sender !== userd) {
      setMsgArray((prevmessage) => [...prevmessage, data]);
    }
  });

  useEffect(() => {
    
    return () => {
      socket.off("groupmessage");
    };
  }, [socket]);

  useEffect(() => {
    search();
    socket.emit("connection", "love");
  }, [searchparam,socket]);

  const deletemsg = (ide) => {
    const newArray = msgArray.filter((item) => item._id !== ide);
    setMsgArray(newArray);
  };
  const blocker = (ide) => {
    const newArray = msgArray.filter((item) => item.sender !== ide);
    setMsgArray(newArray);
  };
  const handleSubmit = async (data) => {
    const hydon = {
      groupid:forum,
      message: data.text,
      type: data.type,
      sender: userd,
      sendername:myname,
    };
      socket.emit("groupmessage", hydon);
      setMsgArray((prevmessage) => [...prevmessage, hydon]);
      return;
    
  };

  const handleGroupDeletion = async() =>{
    const confirmed = window.confirm(
      "Are you sure you want to delete this group, Action can't be reversed"
    );
    if (confirmed){
    try{
     const response = await Deletegroup(forum)
     if(response.success){
      alert(response.message)
      router(-1)
     }
     else{
      alert(response.message)
     }
    }
    catch(error){
      if(error && error.message){
        alert(error.message)
      }
    }
  }}
  const handleExit = async() =>{
    const confirmed = window.confirm(
      "Leave this group ?"
    );
    if (confirmed){
    try{
     const response = await Exitgroup(forum)
     if(response.success){
      alert(response.message)
      router(-1)
     }
     else{
      alert(response.message)
     }
    }
    catch(error){
      if(error && error.message){
        alert(error.message)
      }
    }
  }}

  return (
    <>
    <main className="w-screen h-screen min-h-full flex flex-col items-center">
      <main className="w-screen h-screen min-h-full flex dark:bg-gray-900">
      <main className="w-screen min-h-full h-auto flex flex-col lg:w-3/4 md:border-2 relative">
        <header className="w-full h-auto px-2 py-2 flex items-center justify-between border-b-[0.5px] dark:border-gray-500 absolute top-0 bg-white">
          <span className="flex items-center md:hidden" onClick={() => router(-1)}>
            <MdArrowBackIos size={20} className="" />
          </span>
          <div className="flex items-center px-2 flex-grow">
            <img src={`/${groupimage || "lavender.jpeg"}`} className="w-8 h-8 rounded-sm" />
            <span className="flex flex-col mx-3">
             <p className="font-interbold text-md">{title || '....'}</p>
             <p className="text-sm font-inter">{members.length || '....'} participant</p>
            </span>
          </div>
          <span className="flex w-auto h-auto">
            { admin === userd ? (
              <MdDelete className="fill-red-600 mx-2 cursor-pointer" size={20} onClick={() => handleGroupDeletion()}/>
            ) :(
              <IoMdExit className="fill-red-600 mx-2 cursor-pointer" size={20} onClick={() => handleExit()}/>
            )}
          </span>
        </header>
        <GroupScreen
          submit={(data) => handleSubmit(data)}
          receivedData={msgArray}
          optiondelete={(e) => deletemsg(e)}
          blockuser={(e) => blocker(e)}
        />
      </main>
      </main>
      {load && <Loader />}
    </main>
    </>
  );
}


