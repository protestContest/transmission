
document.addEventListener("DOMContentLoaded", function() {
  var socket = io.connect();

  var MessageList = React.createClass({displayName: "MessageList",
    getInitialState: function() {
      return {messages: [""]};
    },
    addMessage: function(msg) {
      this.setState(function(state) {
        return {messages: state.messages.concat(msg)};
      });
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
      var styles = {
        flexContainer: {
          display: "flex"
        },
        form: {
          display: "inline",
          flexGrow: 1
        },
        input: {
          border: "none",
          width: "100%",
          background: "none",
          outline: "none",
          font: "14px monospace"
        }
      };

      return (
        React.createElement("div", {style: styles.flexContainer}, 
          React.createElement("span", null, "> "), 
          React.createElement("form", {style: styles.form, onSubmit: this.onSubmit}, 
            React.createElement("input", {ref: "input", 
                style: styles.input, 
                disabled: this.state.disabled, 
                onChange: this.onChange, 
                value: this.state.text})
          )
        )
      );
    }
  });

  var Terminal = React.createClass({displayName: "Terminal",
    componentDidUpdate: function() {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    },
    addMessage: function(message) {
      this.refs.ml.addMessage(message.text);

      if (message.request) {
        this.refs.ib.request(message.request);

        if (message.request === "_") {
          this.refs.ib.disableInput();
        } else {
          this.refs.ib.enableInput();
        }
      }

      this.forceUpdate();
    },
    render: function() {
      var styles = {
        container: {
          height: "100vh",
          overflow: "scroll"
        }
      };

      return (
        React.createElement("div", {style: styles.container}, 
          React.createElement(MessageList, {ref: "ml"}), 
          React.createElement(InputBox, {ref: "ib"})
        )
      );
    }
  });

  var terminal = React.render(React.createElement(Terminal, null), document.getElementById("terminal"))

  socket.on('message', function(message) {
    terminal.addMessage(message);
  });

  socket.on('connect', function() {
    terminal.addMessage({text: "Connection established."});
  });

  socket.on('disconnect', function() {
    terminal.addMessage({text: "Connection terminated."});
  });

});

