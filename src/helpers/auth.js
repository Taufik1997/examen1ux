import { db, firebaseAuth } from '../config/constants';


export function auth(email, pw) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(saveUser);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

export function saveUser(user) {
  return(
    db.ref('users/'+user.uid).set({
      email:user.email,
      username : user.displayName,
      photo : user.photoURL,
    })    
  );
}

