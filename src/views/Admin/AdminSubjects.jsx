import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Star from '@material-ui/icons/Star';
//Admin Components
import fire from '../Firebase/fire';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  }
});

class AdminSubjects extends React.Component {
  state = {
    open: false,
    option: "Home",
    accounts: [],
    acc2: [],
    tableHead: ["Subject ID", "Subject Name", "Category", "Strenght", "Teacher ID", "Rating", "Status", "Action"],
    search: "",
    search2: "",
    searchBy: "subid"
  };

  componentDidMount = () => {

    let currentComponent = this;

    fire.database().ref('subjects/').on('value', function (snapshot) {
      var acc = [];
      snapshot.forEach(function (childSnapshot) {

        acc = acc.concat(childSnapshot.val());

      });
      currentComponent.setState({
        accounts: acc,
        acc2: acc
      });
    });

  }

  handleBlock = (user, status) => {

    var database = fire.database();
    var updates = {};

    if (status === "Blocked") {
      updates['subjects/' + user + '/status'] = "Active";
    } else {
      updates['subjects/' + user + '/status'] = "Blocked";
    }
    return database.ref().update(updates);
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleChange = (event) => {
    this.setState({ searchBy: event.target.value }, () => { console.log(this.state.searchBy); })
  }

  handleSearch = () => {

    if (this.state.search !== "" && this.state.search !== this.state.search2) {
      var st = this.state.search;
      let ac2 = this.state.accounts.filter(x => x[this.state.searchBy].includes(this.state.search));
      this.setState({
        acc2: ac2,
        search2: st
      });
    } else if (this.state.search === "" && this.state.search2 !== "") {
      this.setState({
        acc2: this.state.accounts,
        search2: ""
      });
    }
  }

  handleOpenSubject = () => {

  }

  render() {
    const { classes, theme } = this.props;
    this.handleSearch();
    return (
      <div className={classes.root}>
        <Card>
          <CardHeader style={{ backgroundColor: "#00a1ff" }}>
            <h4 className={classes.cardTitleWhite} style={{ color: '#FFFFFF' }}>Subject's</h4>
            <Paper style={{ width: '340px', padding: '5px 5px 5px 5px' }}>
              <TextField
                name="search"
                placeholder="Search...."
                className={classes.textField}
                hintText="Search"
                onChange={e => this.change(e)}
                value={this.state.search}
              />

              <Select
                value={this.state.searchBy}
                onChange={(event) => this.handleChange(event)}
                style={{ width: '145px', textAlign: 'center', paddingLeft: '5px' }}
              >
                <MenuItem value={"subid"}>Subject ID</MenuItem>
                <MenuItem value={"subname"}>Subject Name</MenuItem>
                <MenuItem value={"lastName"}>Category</MenuItem>
                <MenuItem value={"email"}>Strenght</MenuItem>
                <MenuItem value={"review.RT"}>Rating</MenuItem>
                <MenuItem value={"teacherid"}>Teacher's ID</MenuItem>
                <MenuItem value={"status"}>Status</MenuItem>

              </Select>
            </Paper>
          </CardHeader>
          <CardBody>
            <div className={classes.tableResponsive}>
              <Table
                className={classes.table}
              >
                <TableHead className={classes["Warning" + "TableHeader"]}>
                  <TableRow>
                    {this.state.tableHead.map((prop, key) => {
                      return (
                        <TableCell
                          className={classes.tableCell + " " + classes.tableHeadCell}
                          key={key}
                          style={{padding:'4px 11px 4px 11px'}}
                        >
                          {prop}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>

                  {this.state.acc2.map((prop, key) => {
                    const backColor = (prop.status === "Blocked") ? '#FF5454' : '#FFFFFF';

                    return (

                      <TableRow key={key}>
                        <TableCell style={{ backgroundColor: backColor, whiteSpace: 'nowrap',padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.subid}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.subname}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.category}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.sstrenght}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.teacherid}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>
                          <Grid container direction="row" alignItems="center" style={{ display: '-webkit-inline-box', verticalAlign: 'text-top' }}>
                            {Array.apply(null, Array(parseInt(prop.review.RT, 10))).map((i) =>
                              <Grid item>
                                <Star fontSize="small" />
                              </Grid>

                            )}
                          </Grid>

                        </TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>{prop.status}</TableCell>
                        <TableCell style={{ backgroundColor: backColor,padding:'4px 11px 4px 11px' }} className={classes.tableCell}>
                          <Grid container style={{display: '-webkit-inline-box'}}>
                            <Grid item>
                              <IconButton aria-label="Delete" className={classes.margin} onClick={() => this.handleBlock(prop.subid, prop.status)}>
                                {prop.status === "Blocked" ? (
                                  <Check fontSize="small" />
                                ) : (
                                    <Close fontSize="small" />
                                  )}

                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton aria-label="Delete" className={classes.margin} onClick={() => this.handleOpenSubject()}>
                                <ChromeReaderMode fontSize="small" />

                              </IconButton>
                            </Grid>
                          </Grid>


                        </TableCell>
                      </TableRow>


                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

      </div>
    );
  }
}

AdminSubjects.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AdminSubjects);
