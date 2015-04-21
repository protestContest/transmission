
document.addEventListener("DOMContentLoaded", function() {
  var socket = io.connect("http://localhost:3000");

  var MessageList = React.createClass({displayName: "MessageList",
    getInitialState: function() {
      return {messages: ["Incoming transmission... please wait."]};
    },
    addMessage: function(msg) {
      this.state.messages.push(msg);
    },
    render: function() {
      var createItem = function(text, index) {
        return React.createElement("p", {key: index + text, dangerouslySetInnerHTML: {__html: text}});
      };

      return React.createElement("div", null, this.state.messages.map(createItem));
    }
  });

  var InputBox = React.createClass({displayName: "InputBox",
    getInitialState: function() {
      return {text: "", disabled: true, request: "_"};
    },
    componentDidMount: function() {
      this.refs.input.getDOMNode().focus();
    },
    onChange: function(e) {
      this.setState({text: e.target.value});
    },
    onSubmit: function(e) {
      e.preventDefault();
      socket.send({
        text: this.state.text,
        requested: this.state.request
      });
      this.setState({text: ""});
    },
    enableInput: function() {
      this.setState({disabled: false});
      this.refs.input.getDOMNode().focus();
    },
    disableInput: function() {
      this.setState({disabled: true});
    },
    request: function(name) {
      this.setState({request: name});
    },
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("span", {class: "prompt"}, "> "), 
          React.createElement("form", {onSubmit: this.onSubmit}, 
            React.createElement("input", {ref: "input", 
                disabled: this.state.disabled, 
                onChange: this.onChange, 
                value: this.state.text})
          )
        )
      );
    }
  });

  var messageList = React.render(React.createElement(MessageList, null), document.getElementById("messages"));
  var inputBox = React.render(React.createElement(InputBox, null), document.getElementById("inputBox"))

  socket.on('message', function(message) {
    messageList.setState(function(state) {
      return {messages: state.messages.concat(message.text)};
    });

    if (message.request) {
      inputBox.request(message.request);

      if (message.request === "_") {
        inputBox.disableInput();
      } else {
        inputBox.enableInput();
      }
    }
  });

});

