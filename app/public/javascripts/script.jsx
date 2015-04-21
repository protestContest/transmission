document.addEventListener("DOMContentLoaded", function() {
  var Message = React.createClass({
    render: function() {
      return <p>{this.props.msg}</p>;
    }
  });

  var MessageList = React.createClass({
    getInitialState: function() {
      return {messages: ["Incoming transmission... please wait."]};
    },
    addMessage: function(msg) {
      this.state.messages.push(msg);
    },
    render: function() {
      var createItem = function(text, index) {
        return <p key={index + text}>{text}</p>;
      };

      return <div>{this.state.messages.map(createItem)}</div>;
    }
  });


  var socket = io.connect("http://localhost:3000");
  var messageList = React.render(<MessageList />, document.getElementById("messages"));

  socket.on('newmessage', function(message) {
    messageList.setState(function(state) {
      return {messages: state.messages.concat(message)};
    });
  });

});

