import React from "react";
import ReactDOM from "react-dom";
import { Dialog } from "evergreen-ui"

const UserConfirmation = (message, callback) => {
    // Dialog.setOptions({defaultOkLabel: messages.btnOK, defaultCancelLabel: messages.btnCancel, primaryClassName: 'btn-primary'})

   const container = document.createElement("div");

   container.setAttribute("custom-confirmation-navigation", "");

   document.body.appendChild(container);

   const closeModal = (callbackState) => {
      ReactDOM.unmountComponentAtNode(container);
      callback(callbackState);
   };

   const textObj = JSON.parse(message);

   ReactDOM.render(
      <Dialog
        cancelLabel={textObj.cancelText}
        confirmLabel={textObj.confirmText}
         isShown={true}
         onCancel={() => closeModal(false)}
         onConfirm={() => closeModal(true)}
         title={textObj.title}
      >
         {textObj.messageText}
      </Dialog>,
      container
  );
};
export default UserConfirmation;
