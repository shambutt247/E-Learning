import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
// react plugin for creating charts
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrownDownward from "@material-ui/icons/ArrowDownward";
import Star from '@material-ui/icons/Star';
// core components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
//Admin Components
import {Doughnut} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import School from '@material-ui/icons/School';
import Person from '@material-ui/icons/Person';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
//Firebase
import fire from '../Firebase/fire';


const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class AdminHome extends React.Component {
  state = {
    open: false,
    option: "Home",
    totalTeacher:0,
    activeT:0,
    blockT:0,
    TeahcerPie:[],
    totalStudent:0,
    activeS:0,
    blockS:0,
    StudentPie:[],
    totalSubject:0,
    activeSu:0,
    blockSu:0,
    matric:0,
    intermediate:0,
    SubjectPie:[],
    allThreePie:[]
  };

  componentDidMount = () => {

    let currentComponent = this;
    
    var totalT=0;
    var TActive=0;
    var TBlock=0;
    var totalS=0;
    var SActive=0;
    var SBlock=0;

    var totalSu=0;
    var SuActive=0;
    var SuBlock=0;
    var Matric=0;
    var Intermediate=0;


    fire.database().ref('users/').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
       
       if(childSnapshot.val().userType==="teacher"){
        totalT=totalT+1;
        if(childSnapshot.val().status==="Active"){
          TActive=TActive+1;
        }else{
          TBlock=TBlock+1;
        }

       }else if(childSnapshot.val().userType==="student"){
        totalS=totalS+1;
        if(childSnapshot.val().status==="Active"){
          SActive=SActive+1;
        }else{
          SBlock=SBlock+1;
        }
       }
        
      });
      let datasetT = {
        datasets: [{
          data: [TActive, TBlock],
          backgroundColor: [
          '#23d123',
          '#ff3434'
          ],
          hoverBackgroundColor: [
          '#00d300',
          '#ff0000'
          ]
        }]
      };
      let datasetS = {
        datasets: [{
          data: [SActive, SBlock],
          backgroundColor: [
          '#23d123',
          '#ff3434'
          ],
          hoverBackgroundColor: [
          '#00d300',
          '#ff0000'
          ]
        }]
      };
      currentComponent.setState({
        totalTeacher:totalT,
        activeT:TActive,
        blockT:TBlock,
        TeahcerPie:datasetT,
        totalStudent:totalS,
        activeS:SActive,
        blockS:SBlock,
        StudentPie:datasetS,
      });
    });

    fire.database().ref('subjects/').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
       
       
        totalSu=totalSu+1;
        if(childSnapshot.val().status==="Active"){
          SuActive=SuActive+1;
        }else if(childSnapshot.val().status==="Blocked"){
          SuBlock=SuBlock+1;
        }
        if(childSnapshot.val().category==="Matric"){
          Matric=Matric+1;
        }else if(childSnapshot.val().category==="Intermediate"){
          Intermediate=Intermediate+1;
        }

      });
      let datasetSu = {
        datasets: [{
          data: [SuActive, SuBlock],
          backgroundColor: [
          '#23d123',
          '#ff3434'
          ],
          hoverBackgroundColor: [
          '#00d300',
          '#ff0000'
          ]
        }]
      };
      let datasetAll ={
        labels: ['Teachers', 'Students', 'Subjects'],
        datasets: [
          {
            label: 'Comparative Statistics',
            backgroundColor: '#b584ff',
            borderColor: '#a76dff',
            borderWidth: 1,
            hoverBackgroundColor: '#934cff',
            hoverBorderColor: '#6500ff',
            data: [totalT,totalS,totalSu]
          }
        ]
      }; 
      currentComponent.setState({
        totalSubject:totalSu,
        activeSu:SuActive,
        blockSu:SuBlock,
        matric:Matric,
        intermediate:Intermediate,
        SubjectPie:datasetSu,
        allThreePie:datasetAll
      });
    });



  }

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">

          <Grid item xs={7}>

            <Grid item xs={12} style={{display:'flex',width:'100%'}}>
            <Grid item xs={6}>

            <Card>
              <CardHeader color="success" stats icon style={{ width:'fit-content',height:'57px',display:'flex'}}>
                <h4 className={classes.cardTitle} style={{marginTop:'1px',marginRight:'11px'}}>Teachers</h4>
                <School />
              </CardHeader>
              <CardBody style={{paddingTop:'0px',paddingBottom:'0px',paddingRight:'0px'}}>
              <Grid container>
                  <Grid item xs={6}>
                  <h4 className={classes.cardTitle}>Total : {this.state.totalTeacher}</h4>
                <p className={classes.cardCategory} >
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrowUpward fontSize="small" style={{color:'#00ff00'}}/> Active Users : {this.state.activeT}
                  </span>
                </p>
                <p className={classes.cardCategory}>
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrownDownward fontSize="small" style={{color:'#ff0000'}}/> Blocked Users : {this.state.blockT}
                  </span>
                </p>
                  </Grid>
                  <Grid item xs={6}>
                  <Doughnut data={this.state.TeahcerPie} />
                  </Grid>
                </Grid>
                   
              </CardBody>
            </Card>

            </Grid>
            <Grid item xs={6} style={{marginLeft:'20px'}}>

            <Card>
              <CardHeader color="warning" stats icon style={{ width:'fit-content',height:'57px',display:'flex'}}>
                <h4 className={classes.cardTitle} style={{marginTop:'1px',marginRight:'11px'}}>Students</h4>
                <Person />
              </CardHeader>
              <CardBody style={{paddingTop:'0px',paddingBottom:'0px',paddingRight:'0px'}}>
              <Grid container>
                  <Grid item xs={6}>
                  <h4 className={classes.cardTitle}>Total : {this.state.totalStudent}</h4>
                <p className={classes.cardCategory} >
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrowUpward fontSize="small" style={{color:'#00ff00'}}/> Active Users : {this.state.activeS}
                  </span>
                </p>
                <p className={classes.cardCategory}>
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrownDownward fontSize="small" style={{color:'#ff0000'}}/> Blocked Users : {this.state.blockS}
                  </span>
                </p>
                  </Grid>
                  <Grid item xs={6}>
                  <Doughnut data={this.state.StudentPie} />
                  </Grid>
                </Grid>
              </CardBody>
            </Card>

          </Grid>
          </Grid>

          <Grid item xs={8}>

          <Card style={{marginLeft:'100px',marginRight:'100px'}}>
          <CardHeader color="danger" stats icon style={{ width:'fit-content',height:'57px',display:'flex'}}>
                <h4 className={classes.cardTitle} style={{marginTop:'1px',marginRight:'11px'}}>Subjects</h4>
                <ChromeReaderMode />
              </CardHeader>
              <CardBody style={{paddingTop:'0px',paddingBottom:'5px',paddingRight:'0px'}}>
                <Grid container>
                  <Grid item xs={6}>
                  <h4 className={classes.cardTitle}>Total : {this.state.totalSubject}</h4>
                <p className={classes.cardCategory} >
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <Star fontSize="small" /> Matric Level : {this.state.matric}
                  </span>
                </p>
                <p className={classes.cardCategory}>
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <Star fontSize="small" /> Intermediate Level : {this.state.intermediate}
                  </span>
                </p>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item xs={12} style={{textAlign:'center'}}>
                    <p className={classes.cardCategory} style={{display:'inline'}}>
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrowUpward fontSize="small" style={{color:'#00ff00'}}/> Active : {this.state.activeSu}
                  </span>
                </p>
                 
                <p className={classes.cardCategory} style={{display:'inline'}}>
                  <span className={classes.successText} style={{verticalAlign:'top'}}>
                    <ArrownDownward fontSize="small" style={{color:'#ff0000'}}/> Blocked : {this.state.blockSu}
                  </span>
                </p>
                    </Grid>
                  <Doughnut data={this.state.SubjectPie} />
                  </Grid>
                </Grid>
              
              </CardBody>
            </Card>

          </Grid>
          
          </Grid>
          <Grid item xs={5} >

          
          <Bar
          data={this.state.allThreePie}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: false
          }}
        />
          </Grid>
          </Grid>

        

      </div>
    );
  }
}

AdminHome.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AdminHome);
/*<Pie data={this.state.allThreePie} />





            
*/