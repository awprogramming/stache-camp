import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CampsService } from '../../services/camps.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { EvaluationsService } from '../../services/evaluations.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {
  messageClass;
  message;
  previousUrl;
  counselors;
  options;
  divisions;
  perSession;
  approver;
  sessions;
  ready = false;
  loading;
  allSessions;
  divisionShowing = {
    name:"Show All"
  };
  genderShowing = "all";
  dropdownDivisions;
  ssc;

  constructor(
    private campsService: CampsService,
    private evaluationsService: EvaluationsService,
    public authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {}

  getAllCurrent(){
    this.loading = true;
    this.ssc = this.campsService.hasModule('ssc');
    this.evaluationsService.getCurrentEvals().subscribe(data => {
      this.divisions = [];
      this.counselors = [];
      if(this.authService.admin()){
        this.sessions = data.output;
        for(let session of this.sessions){
          for(let counselor of session.counselors){
            if(counselor.evaluations[0] && counselor.evaluations[0].number > 1){
              counselor.preFiller = Array.from(Array(counselor.evaluations[0].number - 1).keys());
            }
            if(counselor.evaluations[counselor.evaluations.length-1].number < this.options.evaluationOpts.perSession){
              counselor.postFiller = Array.from(Array(this.options.evaluationOpts.perSession - counselor.evaluations[counselor.evaluations.length-1].number).keys());
            }
            for(let evaluation of counselor.evaluations){
              const sub_evals = []
              for(let answer of evaluation.answers){
                if(sub_evals[answer.question.byWho.type])
                  sub_evals[answer.question.byWho.type].push(answer);
                else
                sub_evals[answer.question.byWho.type] = [answer];
              }
              evaluation.sub_evals = []
              for(let key of Object.keys(sub_evals).sort()){
                evaluation.sub_evals[key] = sub_evals[key];
              }
            }
            
          }
        }
        this.allSessions = Object.assign([],this.sessions);
      }
      else{
      for(let counselor of data.output){
          if(this.approver){

            if(counselor.division && counselor.division.approver_ids){
              for(let leader_id of counselor.division.approver_ids){
                if(leader_id == JSON.parse(localStorage.getItem('user'))._id){
                    if(this.divisions.indexOf(counselor.division.name)==-1){  
                      this.divisions.push(counselor.division.name);
                    }
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id,
                      first: counselor.first,
                      last: counselor.last,
                    }
                    if(this.counselors[counselor.division.name])
                      this.counselors[counselor.division.name].push(c);
                    else
                      this.counselors[counselor.division.name] = [c]
                    break;
                  }
              }
            }
          }
          else if(this.getType() == "leader" && counselor.division){
            if(counselor.division){
              for(let leader_id of counselor.division.leader_ids){
                if(leader_id == JSON.parse(localStorage.getItem('user'))._id){
                    if(this.divisions.indexOf(counselor.division.name)==-1)  
                      this.divisions.push(counselor.division.name);
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id,
                      first: counselor.first,
                      last: counselor.last,
                    }
                    if(this.counselors[counselor.division.name])
                      this.counselors[counselor.division.name].push(c);
                    else
                      this.counselors[counselor.division.name] = [c]
                    break;
                  }
              }
            }
          }
          else{
            if(counselor.specialty){
              for(let leader_id of counselor.specialty.head_specialist_ids){
                if(leader_id == JSON.parse(localStorage.getItem('user'))._id){
                    if(this.divisions.indexOf(counselor.specialty.name)==-1)  
                      this.divisions.push(counselor.specialty.name);
                    const c = {
                      evals:counselor.evaluations,
                      _id:counselor._id,
                      first: counselor.first,
                      last: counselor.last,
                    }
                    if(this.counselors[counselor.specialty.name])
                      this.counselors[counselor.specialty.name].push(c);
                    else
                      this.counselors[counselor.specialty.name] = [c]
                    break;
                  }
              }
            }
          }
      }
      for(var type in this.counselors){
        for(let counselor of this.counselors[type]){
          if(counselor.evals[0] && counselor.evals[0].number > 1){
            counselor.preFiller = Array.from(Array(counselor.evals[0].number - 1).keys());
          }
          if(counselor.evals[counselor.evals.length-1].number < this.options.evaluationOpts.perSession){
            counselor.postFiller = Array.from(Array(this.options.evaluationOpts.perSession - counselor.evals[counselor.evals.length-1].number).keys());
          }
          for(let evaluation of counselor.evals){
            const sub_evals = []
            for(let answer of evaluation.answers){
              if(sub_evals[answer.question.byWho.type])
                sub_evals[answer.question.byWho.type].push(answer);
              else
              sub_evals[answer.question.byWho.type] = [answer];
            }
            evaluation.sub_evals = []
            for(let key of Object.keys(sub_evals).sort()){
              evaluation.sub_evals[key] = sub_evals[key];
            }
          }
        }
      }
    }
    this.ready = true;
    this.loading = false;
    });
  }

  getOptions(){
    this.loading = true;
    this.campsService.getOptions().subscribe(data => {
      this.options = data.options;
      this.perSession = Array.from(Array(data.options.evaluationOpts.perSession).keys());
      this.getAllCurrent();
    });
  }

  userIsApprover(){
    this.evaluationsService.isApprover().subscribe(data => {
      this.approver = data.approver;
    });
  }

  getClass(evaluation){
    if(evaluation.approved)
      return "green";
    else if(evaluation.submitted)
      return "yellow";
    else if(evaluation.started)
      return "red";
    else
      return "";
  }

  splitSubs(evaluation){
    const sub_evals = []
    for(let answer of evaluation.answers){
      if(sub_evals[answer.question.byWho.type])
        sub_evals[answer.question.byWho.type].push(answer);
      else
      sub_evals[answer.question.byWho.type] = [answer];
    }
    evaluation.sub_evals = sub_evals;
  }

  getSubKeys(evaluation){

    return Object.keys(evaluation.sub_evals);
  }

  getScore(answers){
   var total = 0;
    for(let answer of answers){
      total+=answer.numerical
    }
    return Math.round(total/(answers.length*this.options.evaluationOpts.high)*100);
  }

  getLevel(score){
      if(score >= this.options.evaluationOpts.gold){
        return this.options.howWeSay["gold"];
      }
      else if(score >= this.options.evaluationOpts.silver){
        return this.options.howWeSay["silver"];
      }
      else if(score >= this.options.evaluationOpts.green){
        return this.options.howWeSay["green"];
      }
      else{
        return this.options.howWeSay["red"];
      }
  }

  export(session_id){
    this.loading = true;
    var session;
    for(let sess of this.sessions){
      if(sess._id._id==session_id){
        session = sess;
        break;
      }
    }
    var data = [];

    var labels = {
      first:"First",
      last:"Last"
    };
      
    for(var i = 0; i < this.options.evaluationOpts.perSession;i++){
      for(let type of this.options.headStaff_types){
        labels[type.type+(i+1)+" Score"] = type.type+(i+1)+" Score";
        labels[type.type+(i+1)+" Level"] = type.type+(i+1)+" Level";
      }
      labels[(i+1)+" Average"] = (i+1)+" Average";
    }
    
    data.push(labels);

    for(let counselor of session.counselors){
      var rowObj = {};
      var count = 0;
      rowObj["first"] = counselor.first;
      rowObj["last"] = counselor.last;
      if(counselor.preFiller){
        for(let pre of counselor.preFiller){
          count++;
          for(let type of this.options.headStaff_types){
            rowObj[type.type+"score"+count] = "-"; 
            rowObj[type.type+"level"+count] = "-"; 
          }
          rowObj["avg"+count] = "-";
        }
      }
      for(let evaluation of counselor.evaluations){
        count++;
        var score_total = 0;
        var num_subs = 0;
        for(let type of this.options.headStaff_types){
          if(evaluation.sub_evals[type.type]){
            var sub_eval_score = this.getScore(evaluation.sub_evals[type.type]);
            score_total += sub_eval_score;
            num_subs++;
            rowObj[type.type+"score"+count] = sub_eval_score;
            rowObj[type.type+"level"+count] = this.getLevel(sub_eval_score);
          }
          else{
            rowObj[type.type+"score"+count] = "-"; 
            rowObj[type.type+"level"+count] = "-";
          }
        }
        if(num_subs!= 0){
          var avg = score_total/num_subs;
          rowObj["avg"+count] = avg;
        }
        else{
          rowObj["avg"+count] = "-";
        }
      }
      if(counselor.postFiller){
      for(let post of counselor.postFiller){
          count++;
          for(let type of this.options.headStaff_types){
            rowObj[type.type+"score"+count] = "-"; 
            rowObj[type.type+"level"+count] = "-"; 
          }
          rowObj["avg"+count] = "-";
        }
      }
      data.push(rowObj)
    }
   new Angular2Csv(data, session._id.name+'_Eval_Report');
   this.loading = false;
  }

   async downloadPDF(){
    var docDefinition = { 
      content: [],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
    };

    for(let division of this.divisions){
      // var divText = {text: division, style: 'subheader'}
      for(let counselor of this.counselors[division]){
        var cText = {text: counselor.first+" "+counselor.last+" - "+division, style: 'subheader'}
        docDefinition.content.push(cText);
        var table = {
          headerRows: 1,
          body: [
            [{text: 'Question', style: 'tableHeader'}, {text: 'Notes', style: 'tableHeader'}, {text: 'Score', style: 'tableHeader'}]
          ]
        };
        var curEval;
        for(let evaluation of counselor.evals){
          if(evaluation.number = this.options.evaluationOpts.currentEval){
            curEval = evaluation;
            break;
          }
        }
        if(curEval){
          for(let answer of curEval.answers){
            if(answer.comment_ids && answer.comment_ids.length > 0){
              var comments = await this.evaluationsService.populateComments(answer.comment_ids).toPromise();
              var commentBody = {
									text: []
              }
              for(let comment of comments.comments){
                if(this.ssc)
                  commentBody.text.push({text:comment.commenter + " on "+ new Date(comment.date).toLocaleDateString("en-US")+" ("+comment.type+")\n",bold:true});
                else
                commentBody.text.push({text:comment.commenter + " on "+ new Date(comment.date).toLocaleDateString("en-US")+"\n",bold:true});
                commentBody.text.push(comment.comment+"\n\n")

              }
              table.body.push([answer.question.content,commentBody,answer.numerical]);
            }
            else{
              table.body.push([answer.question.content,answer.text,answer.numerical]);
            }
          }
        }
        docDefinition.content.push({
          style: 'tableExample',
          table: table,
        },);
       
        if(curEval.additional_comment_ids){
          console.log("hello world");
          docDefinition.content.push({text: "Additional Notes", style: 'subheader'});
          var comments = await this.evaluationsService.populateComments(curEval.additional_comment_ids).toPromise();
            var commentBody = {
                text: []
            }
            for(let comment of comments.comments){
              if(this.ssc)
                commentBody.text.push({text:comment.commenter + " on "+ new Date(comment.date).toLocaleDateString("en-US")+" ("+comment.type+")\n",bold:true});
              else
              commentBody.text.push({text:comment.commenter + " on "+ new Date(comment.date).toLocaleDateString("en-US")+"\n",bold:true});
              commentBody.text.push(comment.comment+"\n\n")
            }
            docDefinition.content.push(commentBody);
        }
        var score = this.getScore(curEval.answers);
        docDefinition.content.push({text: "Score: "+score, style: 'subheader'})
        docDefinition.content.push({text: "Level: "+this.getLevel(score), style: 'subheader',pageBreak:"after"})
      }
    }
    pdfMake.createPdf(docDefinition).download('pdf_export.pdf');
  }

  getType(){
    return JSON.parse(localStorage.getItem('user')).type.type;
  }

  filterDivision(e){
    this.divisionShowing = e;
    this.filter();

  }
  filterGender(e){
    this.genderShowing = e;
    this.filter()
  }

  filter(){
      this.sessions = this.allSessions;
      var allGenders = this.genderShowing == "all";
      var allDivisions = this.divisionShowing.name == "Show All"
      var tempSessions = [];
      for(let session of this.sessions){
        var tempSession = Object.assign({},session);;
        var tempCounselors = [];
        for(let counselor of session.counselors){

          if(((counselor.division && counselor.division.gender.toLowerCase() == this.genderShowing) || allGenders) && ((counselor.division && counselor.division.name == this.divisionShowing.name) || allDivisions)){
            tempCounselors.push(counselor);
          }
        }
        tempSession.counselors = tempCounselors
        tempSessions.push(tempSession);
      }
      this.sessions = tempSessions;
  }

  divGenders(gender){
    if(gender.toLowerCase()=="female"){
      return this.dropdownDivisions["female"];
    }
    else if(gender.toLowerCase()=="male")
      return this.dropdownDivisions["male"];
  }

  populateDivisions(){
    this.loading = true;
    this.campsService.getAllDivisions().subscribe(data=>{
      this.dropdownDivisions = []
      for(let gender of data.divisions)
        this.dropdownDivisions[gender._id.gender] = gender.divisions;
      if(this.authService.admin()){
        this.dropdownDivisions["male"].unshift({
          name:"Show All"
        });
        this.dropdownDivisions["female"].unshift({
          name:"Show All"
        });
      }
      this.loading = false;
      // if(this._gender=="female")
      //   this.divisions = data.divisions[0].divisions;
      // else if(this._gender=="male")
      //   this.divisions = data.divisions[1].divisions;
      
      // this.selectedChanged.emit(this.divisions[0]);
    });
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to view that page';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
    this.userIsApprover();
    this.getOptions();
    this.populateDivisions();
    
  }

}

