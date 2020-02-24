import React, { Component } from "react";
import { Form, Segment, Button, Grid, Header } from "semantic-ui-react";
import { connect } from 'react-redux';
import { createEvent, updateEvent} from '../eventActions';
import  cuid  from "cuid";
import {reduxForm, Field} from 'redux-form';
import {composeValidators, combineValidators, isRequired, hasLengthGreaterThan} from 'revalidate'
import  Textinput  from "../../common/util/form/Textinput";
import  Textarea  from "../../common/util/form/Textarea";
import  SelectInput  from "../../common/util/form/SelectInput";
import  DateInput  from "../../common/util/form/DateInput";

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {}

  if (eventId && state.events.length > 0 ){
    event= state.events.filter(event => event.id === eventId)[0]
  }

  return {
    initalValues: event
  };
}; 

const actions = {
  createEvent,
  updateEvent
}

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired({message: 'The category is required.'}),
  description: composeValidators(
    isRequired({message: 'Please enter a description.'}),
    hasLengthGreaterThan(4) ({message: 'Description needs to be at least 5 characters.'})
  )(),
  city: isRequired('city'),
  venue: isRequired('venue  '), 
  date: isRequired('date')
})

const category = [
  {key: 'drinks', text: 'Drinks', value: 'drinks'},
  {key: 'culture', text: 'Culture', value: 'culture'},
  {key: 'film', text: 'Film', value: 'film'},
  {key: 'food', text: 'Food', value: 'food'},
  {key: 'music', text: 'Music', value: 'music'},
  {key: 'travel', text: 'Travel', value: 'travel'},
];

class EventForm extends Component {

  // state and componentdidmount sollte eigentlich geloescht werden, aber it broke als ich es geloscht habe, also drin gelassen
  // state = {...this.props.event};

  // componentDidMount(){
  //   if (this.props.selectedEvent !== null) {
  //     this.setState({
  //     ...this.props.selectedEvent
  //   }) 
  //   }
  // }

  onFormSubmit = values => {
    if  (this.props.initalValues.id){
      this.props.updateEvent(values);
      this.props.history.push(`/events/${this.props.initalValues.id}`)
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: '/assets/user.png',
        hostedBy: 'Bob'
      }
    this.props.createEvent(newEvent);
    this.props.history.push(`/events/${newEvent.id}`)
  }
  };

 

  render() {
    const {history, initalValues, invalid, submitting, pristine} = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
        <Segment>
         <Header sub color='teal' content='Event Details'/>
         <Form onSubmit= {this.props.handleSubmit(this.onFormSubmit)} autoComplete="off">
         <Field name = 'title' component={Textinput} placeholder='Give your event a name'/>

         <Field name = 'category' type='text' component={SelectInput} options={category}  placeholder='What is your event about?'/>
         
         <Field name = 'description' component={Textarea}
         rows = {3}
         placeholder='Tell us about your event'/>

         <Header sub color='teal'content='Event Location Details'></Header>
         <Field name = 'city' component={Textinput} placeholder='Event City'/>
         <Field name = 'venue' component={Textinput} placeholder='Event Venue'/>
         {/* <Field name = 'date' component={DateInput} dateFromat='dd LLL YYYY h:mm a'  */}
         showTimeSelect
         timeFormat= 'HH:mm'
         placeholder='Event Date'/>
      

          <Button disabled={invalid || submitting || pristine} positive type="submit">
            Submit
          </Button>
          <Button onClick={
            initalValues.id 
          ? () => history.push(`/events/${initalValues.id}`) 
          : () =>  history.push(`/events`)
        } 
          type="button">
            Cancel
          </Button>
        </Form>
      </Segment>
      </Grid.Column>
      </Grid>
      
    );
  }
}

export default connect(
  mapState, 
   actions
  ) 
  (reduxForm({form: 'eventForm', validate}) (EventForm));