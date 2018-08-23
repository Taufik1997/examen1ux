import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TextsmsIcon from '@material-ui/icons/Textsms';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import { CardHeader, Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { db, firebaseAuth } from '../config/constants';
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';

const styles = {

    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
};

class Home extends Component {
    classes = {};
    constructor(props) {
        super(props)
        this.classes = props.classes;
        this.state = {
            list: [],
            status: 1,
            open: false,
            content: ""
        }
        this.addFollower = this.addFollower.bind(this);
        
    }

    addFollower=(id)=> {
        if (firebaseAuth().currentUser === null) {
            var followerData = {
                uid: null
            }
        } else {
            var followerData = {
                uid: firebaseAuth().currentUser.uid
            }

        }
        //var newPostKey = db.ref().child('posts').push().key;

        var updates = {};
        updates['/users/' + id + '/followers'] = followerData;

        return db.ref().update(updates);
    }

    addLike=(doc)=> {
        var likesN = parseInt(doc.val().likes, 10) + 1;

        var updates = {};
        updates['/posts/' + doc.key + '/likes/'] = likesN;

        return db.ref().update(updates);
    }

    addComment=(e)=> {
        if (this.content === "") {
            alert("lol");
        } else {
            var updates = {};
            updates['/posts/' + e + '/comments/'] = this.state.content;
 
            return db.ref().update(updates);
        }
        this.handleClose
        
    }


    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleContent = (e) => {
        this.setState({ content: e.target.value });
    }

    componentDidMount() {
        if (firebaseAuth().currentUser === null) {
            db.ref('/posts').on('value', (snapshot) => {
                let list = []
                snapshot.forEach(doc => {
                    if (doc.val().status === 1) {
                        list.push(doc)
                        this.setState({
                            list: list
                        })
                    }
                })
            })
        } else {
            db.ref('/posts').on('value', (snapshot) => {
                let list = []
                snapshot.forEach(doc => {
                    if (doc.val().status === 1 || doc.val().status === 3) {
                        list.push(doc)
                        this.setState({
                            list: list
                        })
                    }
                })
            })
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <List className={classes.root} subheader={<li />}>
                {this.state.list.map((doc, i) => (
                    <li key={`section-${i}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <div>
                                <Card className={this.classes.card}>
                                    <CardHeader
                                        avatar={
                                            <Avatar src={doc.val().photoURL} aria-label="Recipe" className={this.classes.avatar}>
                                                A
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

                                        <Button onClick={()=>this.addFollower(doc.val().uid)} variant="fab" mini color="primary" aria-label="Add" className={this.classes.button}>
                                            <PersonAddIcon />
                                        </Button>
                                        <Button onClick={this.handleClickOpen} variant="fab" mini color="primary" aria-label="Add" className={this.classes.button}>
                                            <TextsmsIcon />
                                        </Button>
                                        <Dialog
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                            aria-labelledby="form-dialog-title"
                                        >
                                            <DialogTitle id="form-dialog-title">¿Que Opinas?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Agregue su comentario
                                                </DialogContentText>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="content"
                                                    label="Comentario"
                                                    type="text"
                                                    onChange={this.handleContent}
                                                    fullWidth
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={this.handleClose} color="primary">
                                                    Cancel
                                                </Button>
                                                <Button onClick={()=>this.addComment(doc.key)} color="primary">
                                                    Comment
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </CardActions>
                                </Card>
                            </div>
                        </ul>
                    </li>
                ))}
            </List>


        )
    }


}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);