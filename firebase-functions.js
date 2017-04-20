// https://stackoverflow.com/questions/39187424/is-there-a-way-to-authenticate-user-role-in-firebase-storage-rules

function isAdminUser() {
    return (request.auth != null) && request.auth.uid in {
        "yaddayadddayaddUserIDKey":"User Name1"
    };
}

service firebase.storage {
    match /b/<appName>.appspot.com/o {
        match /{allPaths=**} {
            allow read;
            allow write: if request.auth != null && isAdminUser();
        }
   }
}




function isValidTopicID() {
    return something;
}


