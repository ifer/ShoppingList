import React from "react";
import ReactDOM from 'react-dom';
import {
    Dialog
} from "evergreen-ui"

class PopupDialog extends React.Component {
        constructor(props) {
            super(props);
            this.show = this.show.bind(this);
            this.closeModal = this.closeModal.bind(this);
            this.setOptions = this.setOptions.bind(this);

            this.state = {
                isShown: false,
            }

            this.default_options = {
                title: 'Ειδοποίηση',
                confirmLabel: 'ΟΚ',
                cancelLabel: 'Άκυρο',
                message: 'Παρακαλώ επιβεβαιώστε',
                callback: null
            };

            this.options = this.default_options;

        }


        setOptions(userOptions){
            if (userOptions.title) this.options.title = userOptions.title ;
            if (userOptions.confirmLabel) this.options.confirmLabel = userOptions.confirmLabel ;
            if (userOptions.cancelLabel) this.options.cancelLabel = userOptions.cancelLabel;
            if (userOptions.message) this.options.message = userOptions.message;
            if (userOptions.callback) this.options.callback = userOptions.callback;
        }

        closeModal(callbackState) {
            this.setState({
                isShown: false
            });
            this.options.callback(callbackState);
        }

        show(userOptions) {
            if (userOptions){
                this.setOptions(userOptions);
            }

            this.setState({
                isShown: true
            });
        }


    render () {
        return (
            <Dialog
               isShown={this.state.isShown}
               title={this.options.title}
               onCloseComplete={() => this.setState({ isShown: false })}
               confirmLabel={this.options.confirmLabel}
               cancelLabel={this.options.cancelLabel}
               onCancel={() => this.closeModal(false)}
               onConfirm={() => this.closeModal(true)}
             >
              {this.options.message}
            </Dialog>

        );
    }
}
export default PopupDialog;
