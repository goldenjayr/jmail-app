import React, { useEffect, useState } from "react";
import { useSubscription } from "react-apollo";

import { Message } from '../Message'
import "./inbox.css";
import { NEW_MAIL_SUBSCRIPTION } from "../queries";

function Inbox() {
  const [mail, setMail] = useState([]);
  const { data, loading, error } = useSubscription(NEW_MAIL_SUBSCRIPTION);

  useEffect(() => {
    if (data?.newMail) {
      setMail(state => {
        return [
          <Message key={Date.now()} {...data.newMail} />,
          ...state
        ];
      });
    }
  }, [data]);

  if (loading) {
    return <div>No Mail</div>;
  }

  return (
      <div className="inbox">
          All Mail
          {mail}
      </div>
  );
}

export default Inbox;
