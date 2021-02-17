import React, { Component } from "react";
import "./App.css";
import axios from "axios";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portlist: null,
      blockchain: null,
      files: null,
      file: null,
      name: null,
      selected: "blockchain",
      check: null,
    };
  }
  componentDidMount() {
    this.checkServers([], 8000);
  }

  checkServers = (portlist, port) => {
    axios
      .get("http://127.0.0.1:" + port + "/ping", {
        timeout: 3000,
      })
      .then(() => {
        portlist.push(port);
        port = port + 1;
        this.checkServers(portlist, port);
      })
      .catch(() => {
        this.setState({
          portlist,
        });
        this.updateBlockChain();
        this.updateFiles();
      });
  };

  updateBlockChain() {
    const { portlist } = this.state;
    const randomPort = portlist[Math.floor(Math.random() * portlist.length)];
    axios
      .get("http://127.0.0.1:" + randomPort + "/chain", {
        timeout: 3000,
      })
      .then((resp) => {
        this.setState({
          blockchain: resp.data,
        });
      });
  }

  updateFiles() {
    const { portlist } = this.state;
    const randomPort = portlist[Math.floor(Math.random() * portlist.length)];
    axios
      .get("http://127.0.0.1:" + randomPort + "/files", {
        timeout: 3000,
      })
      .then((resp) => {
        this.setState({
          files: resp.data,
        });
      });
  }

  postNewFile = (event) => {
    event.preventDefault();
    const { portlist } = this.state;
    const randomPort = portlist[Math.floor(Math.random() * portlist.length)];
    var formData = new FormData();
    formData.append("fileupload", this.state.file);
    formData.append("name", this.state.name);
    fetch("http://localhost:" + randomPort + "/new_transaction", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.status === 201) {
        this.updateFiles();
        this.updateBlockChain();
        this.setState({
          file: null,
          name: "",
        });
      }
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleFile = (name) => (event) => {
    this.setState({ [name]: event.target.files[0] });
  };

  checkfile = (idfile) => {
    const { portlist } = this.state;
    const randomPort = portlist[Math.floor(Math.random() * portlist.length)];
    axios
      .get("http://127.0.0.1:" + randomPort + "/check?idfile=" + idfile, {
        timeout: 3000,
      })
      .then((resp) => {
        this.setState({
          check: resp.data.file_is_safe,
        });
      });
  };

  render() {
    const {
      portlist,
      blockchain,
      file,
      name,
      selected,
      files,
      check,
    } = this.state;
    return (
      <div className="App">
        <div className="TopBar">
          <h1 className="TopBarTitle">ControlCare</h1>
        </div>
        {/* UPLOAD FILE */}
        <div className="MainDiv">
          <div className="DivColumn">
            <div className="UploadDiv">
              <h2 className="UploadTitle">Upload a new file</h2>
              <div className="UploadForm">
                <form onSubmit={this.postNewFile}>
                  <p>Identity :</p>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    onChange={this.handleChange("name")}
                  />
                  <p>File :</p>
                  <input
                    type="file"
                    id="avatar"
                    name="fileupload"
                    onChange={this.handleFile("file")}
                  />
                  <p></p>
                  <input
                    className="UploadButton"
                    type="submit"
                    disabled={!file || !name}
                    value="Upload"
                  />
                </form>
              </div>
            </div>
          </div>
          {/* GET BLOCKCHAIN */}
          <div className="DivColumn">
            <div>
              <div className="ButtonChoiceBar">
                <button
                  onClick={() => this.setState({ selected: "blockchain" })}
                  className={
                    selected === "blockchain"
                      ? "selectedButtonBar"
                      : "ButtonBar"
                  }
                >
                  Blockchain
                </button>
                <button
                  onClick={() => this.setState({ selected: "files" })}
                  className={
                    selected === "files" ? "selectedButtonBar" : "ButtonBar"
                  }
                >
                  Files
                </button>
              </div>
              <div className="blockListDiv">
                {blockchain && selected === "blockchain"
                  ? blockchain.chain.map((elem) => (
                      <div className="blockDiv">
                        <p>
                          <b>
                            Hash of block:
                            <br />
                          </b>
                          {elem.hash}
                        </p>
                        <p>
                          {elem.idfile === 0
                            ? "Genesis block"
                            : "Block of file ID " + elem.idfile}
                        </p>
                      </div>
                    ))
                  : files
                  ? files.map((elem) => (
                      <div className="blockDiv">
                        <p>
                          <b>
                            Author:
                            <br />
                          </b>
                          {JSON.parse(elem).name}
                        </p>
                        <p>
                          <b>
                            File:
                            <br />
                          </b>
                          {JSON.parse(elem).file}
                        </p>
                        <p>
                          <b>
                            ID File:
                            <br />
                          </b>
                          {JSON.parse(elem).id}{" "}
                          <button
                            onClick={() => this.checkfile(JSON.parse(elem).id)}
                            className="CIButton"
                          >
                            Check Integrity
                          </button>
                        </p>
                      </div>
                    ))
                  : "No data available"}
              </div>
            </div>
          </div>
          {/* GET ONLINE SERVERS */}
          <div className="DivColumn">
            <div className="OnlineMinerDiv">
              <div>
                <h2 className="UploadTitle">Online miners</h2>
              </div>
              {portlist ? (
                portlist.map((elem) => (
                  <div className="PortList">Port - {elem}</div>
                ))
              ) : (
                <p style={{ color: "red" }}>None</p>
              )}
            </div>
          </div>
        </div>
        {/* MODAL */}
        <div
          className={
            check === null
              ? "modalOff"
              : check === true
              ? "modalOk"
              : "modalBad"
          }
        >
          {check === null ? null : check === true ? (
            <div className="modalDiv">
              <p>The file integrity is safe</p>
              <button
                className="modalButtonOk"
                onClick={() => this.setState({ check: null })}
              >
                Ok
              </button>
            </div>
          ) : (
            <div className="modalDiv">
              <p>The file has probably been modified</p>
              <button
                className="modalButtonBad"
                onClick={() => this.setState({ check: null })}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
