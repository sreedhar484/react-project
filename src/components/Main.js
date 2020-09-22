import React, { Component } from "react";
import { Stack, Box, Text } from "@chakra-ui/core";
import "../App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import DbForm from "./DbForm";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Submit from "./Submit";
import Register from "./Register";
import Cookie from "js-cookie";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      cou: [],
      temp: [],
      userName: "",
      user: "",
      password: "",
      password1: "",
      errorp: false,
      errorp1: false,
      erroru: false,
      log: false,
      reg: false,
      logout: false,
      search: "",
      search1: true,
      totalpledged: 0,
      totalrecieved: 0,
      offset: 0,
      logStatus: true,
      perPage: 4,
      currentPage: 0,
      name: "",
      phone: "",
      email: "",
      type: "",
      notes: "",
      edit: false,
      editone: false,
      userid: 0,
      errorum: "",
      errorpm: "",
      errorpm1: "",
      erroruser: "",
      errorphone: "",
      erroremail: "",
      errortype: "",
      errornote: "",
      entry: false,
      amountCount: 0,
      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      patternphone: /^\d{10}$/,
    };
    toast.configure();
  }
  onDownClick = () => {
    this.setState({ amountCount: Number(this.state.amountCount) + 1 });
  };

  // page change method
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        const data = this.state.array;

        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          cou: slice,
        });
      }
    );
  };
  componentDidMount() {
    if (Cookie.get("user") !== undefined) {
      this.setState({ log: true });
      this.getData1();
    }
  }
  // get the data from server
  getData1() {
    const user = Cookie.get("user");
    console.log(user);
    Axios.get("http://localhost:2733/" + user + "/details")
      .then((res) => {
        console.log(res.data);
        if (res.data.length !== 0) {
          this.setState(
            {
              array: res.data.records.slice(0, res.data.records.length - 1),
              cou: res.data.records.slice(0, res.data.records.length - 1),
            },
            () => {
              this.setState({
                totalpledged:
                  this.state.array.length === 0
                    ? 0
                    : this.state.array
                        .map((data) => data.pledgedAmount)
                        .reduce((a, b) => a + b),
              });
              this.setState({
                totalrecieved:
                  this.state.array.length === 0
                    ? 0
                    : this.state.array
                        .map((data) =>
                          data.recievedAmount ? data.recievedAmount : 0
                        )
                        .reduce((a, b) => a + b),
              });
            }
          );
          console.log(this.state.totalpledged, this.state.totalrecieved);
          this.getData(this.state.array);
        }
      })
      .catch((err) => console.log(err));
  }
  // devide the data into pages and calculate total pledged amount and recieved amount
  getData(data) {
    var tdata = data;
    var slice1 = tdata.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    this.setState({
      pageCount: Math.ceil(tdata.length / this.state.perPage),
      cou: slice1,
    });
  }
  // edit the form deatails
  onEdit = (id) => {
    const data = this.state.array.filter((data) => data.debID === id);
    this.setState(
      {
        name: data[0].userName,
        phone: data[0].phone,
        email: data[0].email,
        userid: data[0].debID,
        amountCount: data[0].pledgedAmount / 1000,
        edit: true,
        editone: true,
      },
      () => console.log(this.state.userid)
    );
  };
  nameChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  changeHandle = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  // sorting the names
  nameAsci = () => {
    this.setState(
      {
        temp: this.state.array.sort((a, b) =>
          a.userName > b.userName ? 1 : b.userName > a.userName ? -1 : 0
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  nameDsci = () => {
    this.setState(
      {
        temp: this.state.array.sort((a, b) =>
          a.userName < b.userName ? 1 : b.userName < a.userName ? -1 : 0
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  // sorting the recieved amount
  recievedAsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => a.recievedAmount - b.recievedAmount
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  recievedDsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => b.recievedAmount - a.recievedAmount
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  recievedDateAsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => new Date(a.recievedDate) - new Date(b.recievedDate)
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  recievedDateDsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => new Date(b.recievedDate) - new Date(a.recievedDate)
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  // delete the record
  onDelete = (id) => {
    Axios.delete(
      "http://localhost:2733/" + Cookie.get("user") + "/deldetails/" + id
    )
      .then((res) => {
        console.log(res);
        toast.success(res.data, { position: toast.POSITION.TOP_CENTER });
        this.getData1();
      })
      .catch((err) => console.log(err));
  };
  // sort the pledged amount
  pledgedAsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => a.pledgedAmount - b.pledgedAmount
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  pledgedDsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => b.pledgedAmount - a.pledgedAmount
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  // sort dates
  pledgedDateAsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => new Date(a.pledgedDate) - new Date(b.pledgedDate)
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  pledgedDateDsci = () => {
    this.setState(
      {
        temp: this.state.array.sort(
          (a, b) => new Date(b.pledgedDate) - new Date(a.pledgedDate)
        ),
      },
      () => this.getData(this.state.temp)
    );
  };
  // login form method
  btnClick = (event) => {
    event.preventDefault();
    if (this.state.userName.length !== 0) {
      if (this.state.password.length !== 0) {
        Axios.post("http://localhost:2733/login", {
          userName: this.state.userName,
          password: this.state.password,
        })
          .then((res) => {
            console.log(res.data);
            if (res.data === "You don't have a account") {
              this.setState({ errorum: "incorrect username" });
            } else if (res.data === "Invalid credentials") {
              this.setState({ errorpm: "incorrect password", errorum: "" });
            } else {
              this.setState(
                { log: true, errorpm: "", userName: "", password: "" },
                () => {
                  Cookie.set("user", res.data.id);
                  Cookie.set("userName", res.data.userName);
                  this.getData1();
                }
              );
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.setState({ errorpm: "Please enter password", errorum: "" });
      }
    } else {
      this.setState({ errorum: "Please enter username" });
    }
  };
  btnClick1 = (event) => {
    event.preventDefault();
    if (this.state.userName.length !== 0) {
      if (this.state.password.length !== 0) {
        if (this.state.password1.length !== 0) {
          Axios.post("http://localhost:2733/register", {
            userName: this.state.userName,
            pwd1: this.state.password,
            pwd2: this.state.password1,
          })
            .then((res) => {
              console.log(res.data);
              if (res.data === "Password doesn't match") {
                this.setState({
                  errorpm1: "incorrect username",
                  errorum: "",
                  errorpm: "",
                  userName: "",
                  password: "",
                  password1: "",
                });
              } else {
                this.setState({ reg: true, errorpm1: "" });
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.setState({ errorpm1: "Please confirm password", errorpm: "" });
        }
      } else {
        this.setState({ errorpm: "Please enter password", errorum: "" });
      }
    } else {
      this.setState({ errorum: "Please enter username" });
    }
  };
  onApplyStatus = (statusVal) => {
    let status = [];
    statusVal.forEach((data, id) => {
      if (data) {
        status.push(id);
      }
    });
    console.log(status);
    let result = [];
    for (let i = 0; i < status.length; i++) {
      if (status[i] === 0) {
        this.getData(this.state.array);
        break;
      } else if (status[i] === 1) {
        this.state.array.forEach((data) => {
          if (data.status === "Recieved") result.push(data);
        });
      } else if (status[i] === 2) {
        this.state.array.forEach((data) => {
          if (data.status === "pledged") result.push(data);
        });
      } else if (status[i] === 3) {
        this.state.array.forEach((data) => {
          if (data.status === "Increased") result.push(data);
        });
      } else {
        this.state.array.forEach((data) => {
          if (data.status === "Reduced") result.push(data);
        });
      }
    }
    console.log(result);
    var resArr = [];
    result.forEach(function (item) {
      var i = resArr.findIndex((x) => x.debID === item.debID);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    // this.setState({
    //   cou: resArr,
    // });
    this.getData(resArr);
  };
  // search method
  searchEvent = (event) => {
    this.setState({ search: event.target.value }, () => {
      if (this.state.search.length > 0) {
        let arr1 = this.state.array.filter((ele) =>
          ele.userName.toLowerCase().startsWith(this.state.search.toLowerCase())
        );
        let arr2 = this.state.array.filter((ele) =>
          ele.pledgedDate
            .toLowerCase()
            .startsWith(this.state.search.toLowerCase())
        );
        let arr = [...arr1, ...arr2];
        var resArr = [];
        arr.forEach(function (item) {
          var i = resArr.findIndex((x) => x.debID === item.debID);
          if (i <= -1) {
            resArr.push(item);
          }
        });
        this.setState(
          {
            search1: false,
          },
          () => this.getData(resArr)
        );
      } else {
        this.setState({ search1: true });
        this.getData(this.state.array);
      }
    });
  };
  onFilterChange = (name, pledged, filter, ranges) => {
    if (name !== undefined && pledged !== undefined) {
      name === "nasci" ? this.nameAsci() : this.nameDsci();
      pledged === "pasci" ? this.pledgedAsci() : this.pledgedDsci();
    }
    let status = [];
    filter.forEach((data, id) => {
      if (data) {
        status.push(id);
      }
    });
    console.log(status);
    let result = [];
    for (let i = 0; i < status.length; i++) {
      if (status[i] === 1) {
        this.getData(this.state.array);
        break;
      } else if (status[i] === 0) {
        console.log(this.state.range1, this.state.range2);
        this.state.array.forEach((data) => {
          if (
            data.pledgedAmount > Number(ranges[0]) &&
            data.pledgedAmount < Number(ranges[1])
          )
            result.push(data);
        });
      } else if (status[i] === 2) {
        this.state.array.forEach((data) => {
          if (data.pledgedAmount > 10000 && data.pledgedAmount < 19000)
            result.push(data);
        });
      } else if (status[i] === 3) {
        this.state.array.forEach((data) => {
          if (data.pledgedAmount > 20000 && data.pledgedAmount < 49000)
            result.push(data);
        });
      } else {
        this.state.array.forEach((data) => {
          if (data.pledgedAmount > 50000 && data.pledgedAmount < 100000)
            result.push(data);
        });
      }
    }
    console.log(result);
    var resArr = [];
    result.forEach(function (item) {
      var i = resArr.findIndex((x) => x.debID === item.debID);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    // this.setState({
    //   cou: resArr,
    // });
    this.getData(resArr);
  };
  onFilterChange1 = (filter, ranges) => {
    let status = [];
    filter.forEach((data, id) => {
      if (data) {
        status.push(id);
      }
    });
    console.log(status);
    let result = [];
    for (let i = 0; i < status.length; i++) {
      if (status[i] === 1) {
        this.getData(this.state.array);
        break;
      } else if (status[i] === 0) {
        console.log(this.state.range1, this.state.range2);
        this.state.array.forEach((data) => {
          if (
            data.recievedAmount === null
              ? 0
              : data.recievedAmount > Number(ranges[0]) &&
                data.recievedAmount === null
              ? 0
              : data.recievedAmount < Number(ranges[1])
          )
            result.push(data);
        });
      } else if (status[i] === 2) {
        this.state.array.forEach((data) => {
          if (
            data.recievedAmount === null
              ? 0
              : data.recievedAmount > 10000 && data.recievedAmount === null
              ? 0
              : data.recievedAmount < 19000
          )
            result.push(data);
        });
      } else if (status[i] === 3) {
        this.state.array.forEach((data) => {
          if (
            data.recievedAmount === null
              ? 0
              : data.recievedAmount > 20000 && data.recievedAmount === null
              ? 0
              : data.recievedAmount < 49000
          )
            result.push(data);
        });
      } else {
        this.state.array.forEach((data) => {
          if (
            data.recievedAmount === null
              ? 0
              : data.recievedAmount > 50000 && data.recievedAmount === null
              ? 0
              : data.recievedAmount < 100000
          )
            result.push(data);
        });
      }
    }
    console.log(result);
    var resArr = [];
    result.forEach(function (item) {
      var i = resArr.findIndex((x) => x.debID === item.debID);
      if (i <= -1) {
        resArr.push(item);
      }
    });
    this.setState({
      cou: resArr,
    });
  };
  onLogout = () => {
    Axios.post("http://localhost:2733/" + Cookie.get("user") + "/logout")
      .then((res) => {
        console.log(res);
        Cookie.remove("user");
        Cookie.remove("userName");
        this.setState({ log: false });
      })
      .catch((err) => console.log(err));
  };
  // deb form submit method
  onSubmit1 = (event) => {
    if (this.state.name.length > 0) {
      this.setState({ erroruser: "" });
      if (this.state.patternphone.test(this.state.phone)) {
        this.setState({ errorphone: "" });
        if (this.state.pattern.test(this.state.email)) {
          this.setState({ erroremail: "" });
          if (this.state.type !== "") {
            this.setState({ entry: true, errortype: "" });
            this.state.editone
              ? Axios.put(
                  "http://localhost:2733/" +
                    Cookie.get("user") +
                    "/editdetails/" +
                    this.state.userid,
                  {
                    userName: this.state.name,
                    phone: Number(this.state.phone),
                    email: this.state.email,
                    deb_type: this.state.type,
                    deb_amount: this.state.amountCount * 1000 + 10000,
                    notes: this.state.notes,
                  }
                )
                  .then((res) => {
                    console.log(res);
                    toast.success(res.data, {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    this.setState({
                      name: "",
                      phone: "",
                      email: "",
                      type: "",
                      editone: false,
                      amountCount: 0,
                    });
                    this.getData1();
                  })
                  .catch((err) => console.log(err))
              : Axios.post(
                  "http://localhost:2733/" + Cookie.get("user") + "/deb_form",
                  {
                    userName: this.state.name,
                    phone: Number(this.state.phone),
                    email: this.state.email,
                    deb_type: this.state.type,
                    deb_amount: this.state.amountCount * 1000 + 10000,
                  }
                )

                  .then((res) => {
                    console.log(res);
                    toast.success(res.data, {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    this.setState({
                      name: "",
                      phone: "",
                      email: "",
                      type: "",
                      amountCount: 0,
                    });
                    this.getData1();
                  })
                  .catch((err) => console.log(err));
          } else {
            this.setState({ errortype: "plese select any type" });
          }
        } else {
          this.setState({ erroremail: "please enter a valid email" });
        }
      } else {
        this.setState({ errorphone: "please enter a valid phone number" });
      }
    } else {
      this.setState({ erroruser: "please enter user name" });
    }
    event.preventDefault();
  };
  render() {
    return (
      <Box>
        <Stack spacing={8}>
          <Router>
            <Switch>
              <Route exact path="/">
                <Login
                  state={this.state}
                  btnClick={this.btnClick}
                  changeHandle={this.changeHandle}
                />
              </Route>
              <Route exact path="/register">
                <Register
                  state={this.state}
                  btnClick1={this.btnClick1}
                  changeHandle={this.changeHandle}
                />
              </Route>
              <Route exact path="/dashboard">
                {this.state.log ? (
                  <div>
                    <Header
                      handlePageClick={this.handlePageClick}
                      state={this.state}
                      onLogout={this.onLogout}
                    />
                    <Dashboard
                      state={this.state}
                      searchEvent={this.searchEvent}
                      nameAsci={this.nameAsci}
                      nameDsci={this.nameDsci}
                      pledgedAsci={this.pledgedAsci}
                      pledgedDsci={this.pledgedDsci}
                      pledgedDateAsci={this.pledgedDateAsci}
                      pledgedDateDsci={this.pledgedDateDsci}
                      recievedAsci={this.recievedAsci}
                      recievedDsci={this.recievedDsci}
                      recievedDateAsci={this.recievedDateAsci}
                      recievedDateDsci={this.recievedDateDsci}
                      handlePageClick={this.handlePageClick}
                      onEdit={this.onEdit}
                      onFilterChange={this.onFilterChange}
                      onFilterChange1={this.onFilterChange1}
                      onDelete={this.onDelete}
                      onApplyStatus={this.onApplyStatus}
                      nameChange={this.nameChange}
                      statusFilter={this.statusFilter}
                      statusFilter1={this.statusFilter1}
                      nameChange1={this.nameChange1}
                    />
                  </div>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route exact path="/newentry">
                {this.state.log ? (
                  <div>
                    <Header
                      handlePageClick={this.handlePageClick}
                      state={this.state}
                      onLogout={this.onLogout}
                    />
                    <DbForm
                      nameChange={this.nameChange}
                      state={this.state}
                      onSubmit1={this.onSubmit1}
                      onDownClick={this.onDownClick}
                    />
                  </div>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route exact path="/submit">
                {this.state.log ? (
                  <div>
                    <Header
                      handlePageClick={this.handlePageClick}
                      state={this.state}
                      onLogout={this.onLogout}
                    />
                    <Submit state={this.state} />
                  </div>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route
                path="*"
                component={() => (
                  <Text
                    textAlign="center"
                    color="red.500"
                    fontSize={["30px", "30px", "35px", "40px"]}
                  >
                    404 Page Not Found
                  </Text>
                )}
              ></Route>
            </Switch>
          </Router>
        </Stack>
      </Box>
    );
  }
}

export default Main;
