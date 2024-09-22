import { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { format, isToday } from "date-fns"; // Make sure date-fns is installed

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  let formattedDate;
  if (message.date) {
    const date = new Date(message.date);
    formattedDate = isToday(date) 
      ? format(date, "HH:mm a") 
      : format(date, "MM/dd/yyyy"); 
  } else {
    formattedDate = "Unknown time";
  }

  return (
    <div className={`message ${message.senderId === currentUser.uid ? "owner" : ""}`}>
      <div className="messageinfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span className="time">{formattedDate}</span>
      </div>
      <div className="messagecontent">
        {message.text && <p>{message.text}</p>} {/* Only render text if it exists */}
        {message.img && <img src={message.img} alt="" />} {/* Only show image if uploaded */}
      </div>
      <div ref={ref} /> 
    </div>
  );
};

// PropTypes validation
Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    senderId: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date), // Expecting a Date object
    img: PropTypes.string,
  }).isRequired,
};

export default Message;
