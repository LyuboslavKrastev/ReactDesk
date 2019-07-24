import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';

const signalR = require("@aspnet/signalr");

function clearTextArea() {
    document.getElementById('chatTextArea').value = "";
};

class Chat extends Component {
    constructor(props) {
        super(props);


        this.state = {
            nick: '',
            message: '',
            messages: [],
            hubConnection: null,
        };
    }
    sendMessage = () => {
        if (!this.state.message) {
            NotificationManager.error('You cannot send empty messages.');

            return;
        }
        clearTextArea();

        this.state.hubConnection
            .invoke('sendToAll', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({ message: '' });

        console.log(this.state.messages)
    };

    componentDidMount = () => {
        let user = localStorage.getItem('currentUser');
        let nick = JSON.parse(user).username;

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('sendToAll', (nick, receivedMessage) => {
                const text = `${nick}: ${receivedMessage}`;
                const messages = this.state.messages.concat([text]);
                this.setState({ messages });
            });
        });
    }

    render() {


        return (
            <div>
                <h2 className="text-center">Chat</h2>
                <div className="row">
                    <input className="form-control text-center" type="text" id="username" value={this.state.nick} style={{ backgroundColor: '#36648B', 'color': 'white' }} disabled />
                    <textarea className="form-control" id="chatTextArea" placeholder="What is on your mind?" rows="5" onChange={e => this.setState({ message: e.target.value })}></textarea>
                    <br />
                    <div className="text-center">
                        <button onClick={this.sendMessage} className="btn btn-success">Send Message</button>
                    </div>
                </div>

                {this.state.messages.length > 0 ?
                    <div className="alert alert-info" style={{ wordBreak: "break-all" }}>
                        {this.state.messages.map((message, index) => (
                            <div className="row" key={index}>
                                <div><strong>{message}</strong> </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                    : null}
            </div>
        )
    }
}

export default Chat;