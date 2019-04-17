import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { EvaluationsService } from '../../services/evaluations.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-eval-comment',
  templateUrl: './eval-comment.component.html',
  styleUrls: ['./eval-comment.component.css']
})
export class EvalCommentComponent implements OnInit {

  _exclude;
  @Input() 
  set comment_ids(comment_ids: Array<String>){
    this._comment_ids = comment_ids;
    console.log(this._comment_ids);
    this.populateComments();
  }
  @Input() 
  set evaluation_id(evaluation_id: String){
    this._evaluation_id = evaluation_id;
  }
  @Input() 
  set counselor_id(counselor_id: String){
    this._counselor_id = counselor_id;
  }
  @Input() 
  set answer_id(answer_id: String){
    this._answer_id = answer_id;
  }

  @Input() 
  set ssc(ssc: String){
    this._ssc = ssc;
  }

  @Output() selection = new EventEmitter();
  _comment_ids;
  comments;
  commentForm: FormGroup;
  _evaluation_id;
  _counselor_id;
  _answer_id;
  _ssc;


  constructor(
    private evalService: EvaluationsService,
    private formBuilder: FormBuilder,
  ) {
    this.createForms();
   }

  createForms() {
    this.commentForm = this.formBuilder.group({
      type:['start'],
      comment: ['', Validators.required],
    });
  }

  populateComments(){
    if(this._comment_ids){
      this.evalService.populateComments(this._comment_ids).subscribe(data => {
        this.comments = data.comments;
        console.log(this.comments);
      });
    }
  }

  createComment(){
    var comment = {
      type: this.commentForm.get('type').value,
      comment: this.commentForm.get('comment').value,
      date:  new Date()

    }
    this.evalService.createComment(this._counselor_id,this._evaluation_id,this._answer_id,comment).subscribe(data => {
      if(this._comment_ids)
        this._comment_ids.push(data.comment_id);
      else
        this._comment_ids = [data.comment_id];
      this.populateComments();
    });
  }
  
  deleteComment(comment_id){
    this.evalService.deleteComment(this._counselor_id,this._evaluation_id,this._answer_id,comment_id).subscribe(data => {
      this.populateComments();
    });
  }

  formatDate(date){
    return new Date(date).toLocaleDateString("en-US");
  }

  ngOnInit() {}

}