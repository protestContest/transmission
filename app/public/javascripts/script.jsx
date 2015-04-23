document.addEventListener("DOMContentLoaded", function() {
  var socket = io.connect();

  var MessageList = React.createClass({
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
        return <div key={index + text} dangerouslySetInnerHTML={{__html: text}}></div>;
      };

      return <div>{this.state.messages.map(createItem)}</div>;
    }
  });

  var InputBox = React.createClass({
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

      if (this.state.text === "exit") {
        socket.disconnect();
        this.setState({text: ""});
        return;
      }

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
        <div style={styles.flexContainer}>
          <span>&gt;&nbsp;</span>
          <form style={styles.form} onSubmit={this.onSubmit}>
            <input ref="input"
                style={styles.input}
                disabled={this.state.disabled}
                onChange={this.onChange}
                value={this.state.text} />
          </form>
        </div>
      );
    }
  });

  var Terminal = React.createClass({
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
          height: "90vh",
          overflow: "hidden"
        }
      };

      return (
        <div style={styles.container}>
          <MessageList ref="ml" />
          <InputBox ref="ib" />
        </div>
      );
    }
  });

  var terminal = React.render(<Terminal />, document.getElementById("terminal"))

  socket.on('message', function(message) {
    terminal.addMessage(message);
  });

  socket.on('connect', function() {
    terminal.addMessage({text: "<p>Connection established.</p>"});
  });

  socket.on('disconnect', function() {
    terminal.addMessage({text: "<p>Connection terminated.</p>"});
  });

});

