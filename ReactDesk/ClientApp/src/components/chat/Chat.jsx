import React, { Component } from 'react';
//https://www.codementor.io/ibrahimsuta/asp-net-core-signalr-chat-with-react-js-eme35qs5e
class Chat extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  sendMessage = (ev) => {
      ev.preventDefault()
      alert('sending message')
    // this.state.hubConnection
    //   .invoke('sendToAll', this.state.nick, this.state.message)
    //   .catch(err => console.error(err));
  
      this.setState({message: ''});      
  };

  componentDidMount = () => {
    let user = localStorage.getItem('currentUser');
    let username = JSON.parse(user).username;

    this.setState({username: username})
    //npm install @aspnet/signalr-client
    // const hubConnection = new HubConnection('http://localhost:5000/chat');

    // this.setState({ hubConnection, nick }, () => {
    //     this.state.hubConnection
    //       .start()
    //       .then(() => console.log('Connection started!'))
    //       .catch(err => console.log('Error while establishing connection :('));
    //   });

    // this.state.hubConnection.on('sendToAll', (nick, receivedMessage) => {
    //     const text = `${nick}: ${receivedMessage}`;
    //     const messages = this.state.messages.concat([text]);
    //     this.setState({ messages });
    //   });
}

  render() {
     

    return (
        <div>
            <div class="row">
    <form class="form-horizontal col-md-6 col-lg-offset-3" onSubmit={this.sendMessage}>
        <input class="form-control text-center" type="text" id="username" value={this.state.username} style={{'background-color': '#36648B', 'color': 'white'}} disabled />
        <textarea class="form-control" id="question" placeholder="What is on your mind?" rows="5"  onChange={e => this.setState({ message: e.target.value })}></textarea>
        <br />
        <input type="submit" value="Submit" id="submit-button"  class="btn btn-info  col-md-offset-6" />
    </form>
    </div>

    <br />

        {/* <br />
        <input
          type="text"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
  
        <button onClick={this.sendMessage}>Send</button> */}
{/*   
        <div>
          {this.state.messages.map((message, index) => (
            <span style={{display: 'block'}} key={index}> {message} </span>
          ))}
        </div> */}
      </div>
    )
  }
}

export default Chat;