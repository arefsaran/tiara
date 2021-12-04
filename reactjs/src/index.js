import React from "react";
import ReactDOM from "react-dom";
const getMessage = (siteName, message) => {
    return `${siteName} says: ${message}`;
};
ReactDOM.render(getMessage("aref.ir", "Hi"), document.getElementById("app"));
