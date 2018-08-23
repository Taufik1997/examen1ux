import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import './Dashboard.css';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { db, firebaseAuth } from '../../config/constants';
import List from '@material-ui/core/List';
import TextsmsIcon from '@material-ui/icons/Textsms';

const styles = {

  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};



class Dashboard extends Component {
  classes = {};

  constructor(props) {
    super(props)
    this.classes = props.classes;
    this.writeNewPost = this.writeNewPost.bind(this);
    //this.createCard = this.createCard.bind(this);
    this.state = {
      list: [],
      statusPerson: 1
    }
  }

  componentDidMount() {
    db.ref('/posts').on('value', (snapshot) => {
      let list = []
      snapshot.forEach(doc => {
        if (doc.val().uid === (firebaseAuth().currentUser).uid) {
          list.push(doc)
          this.setState({
            list: list
          })
        }
      })
    })
  }

  addLike(doc) {
    var likesN = parseInt(doc.val().likes, 10) + 1;

    var updates = {};
    updates['/posts/' + doc.key + '/likes/'] = likesN;

    return db.ref().update(updates);
  }


  writeNewPost() {
    if (document.getElementById("textAreaMensaje").value === "" || document.getElementById("inputText").value === "") {
      alert("Can't add with blank fields!")
    } else {
      // A post entry.
      var postData = {
        uid: firebaseAuth().currentUser.uid,
        author: firebaseAuth().currentUser.displayName,
        body: document.getElementById("textAreaMensaje").value,
        title: document.getElementById("inputText").value,
        likes: 0,
        date: Date.now(),
        status: this.state.statusPerson
      };

      // Get a key for a new Post.
      var newPostKey = db.ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      var updates = {};
      updates['/posts/' + newPostKey] = postData;
      updates['/user-posts/' + postData.uid + '/' + newPostKey] = postData;

      return db.ref().update(updates);
    }

  }

  selectStatus1 = () => {
    this.setState({ statusPerson: 1 });
  };

  selectStatus2 = () => {
    this.setState({ statusPerson: 2 });
  }

  selectStatus3 = () => {
    this.setState({ statusPerson: 3 });
  };

  render() {
    const { classes } = this.props;
    return (

      <div>
        <div className="btn-group" role="group" aria-label="Basic example">
          <button onClick={this.selectStatus1} type="button" className="btn btn-secondary">Publico</button>
          <button onClick={this.selectStatus2} type="button" className="btn btn-secondary">Privado</button>
          <button onClick={this.selectStatus3} type="button" className="btn btn-secondary">Solo Seguidores</button></div>
        <div className="form-group text-left">
          <label for="formGroupExampleInput">Tema</label>
          <input id="inputText" type="text" className="form-control input-comp" name="tema" placeholder="¿De que trata?" />

        </div>
        <div className="form-group">
          <label for="textAreaMensaje">Mensaje</label>
          <textarea className="form-control" id="textAreaMensaje" rows="3" name="mensaje" placeholder="¡Di tu opinion!"></textarea>
        </div>

        <div className="form-group text-left">
          <button onClick={this.writeNewPost} type="submit" className="btn btn-primary btn-block">Write Post</button>
          <p id="demo"></p>
        </div>

        <List className={classes.root} subheader={<li />}>
          {this.state.list.map((doc, i) => (
            <li key={`section-${i}`} className={classes.listSection}>
              <ul className={classes.ul}>
                <div>
                  <Card className={this.classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label="Recipe" className={this.classes.avatar}>
                          T
                        </Avatar>
                      }
                      action={
                        <IconButton>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={doc.val().author}
                      subheader={doc.val().date}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="headline" component="h2">
                        {doc.val().title}
                      </Typography>
                      <Typography component="p">
                        {doc.val().body}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => this.addLike(doc)} variant="fab" mini color="primary" aria-label="Add" className={this.classes.button}>
                        <FavoriteIcon />
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              </ul>
            </li>
          ))}
        </List>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
