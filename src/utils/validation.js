const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid Name");
  }

  if (!validator.isEmail(emailId)) {
    throw    new Error("Email id is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))

  if(isEditAllowed){
    if(req.body.firstName){
      if(!validator.isLength(req.body.firstName, { min: 4, max: 15 })){
        throw new Error("First name must be between 4 and 15 characters");
      }
    }
    if(req.body.lastName){
      if(!validator.isLength(req.body.lastName, { min: 4, max: 15 })){
        throw new Error("Last name must be between 4 and 15 characters");
      }
    }
    if(req.body.age){
      if(!validator.isInt(String(req.body.age), { min: 20 })){
        throw new Error("Age must be greater than 20");
      }
    }
    if(req.body.photoUrl){
      if(!validator.isURL(req.body.photoUrl)){
        throw new Error("Photo URL is not valid");
      }
    }
    if(req.body.skills){
      if(!Array.isArray((req.body.skills))){
        throw new Error("Skills must be an array");
      }
      if(req.body.skills.length > 10){
        throw new Error("Skills must be less than 10");
      }
    }
    if(req.body.about){
      if(!validator.isLength(req.body.about, { min: 10, max: 1000 })){
        throw new Error("About must be between 10 and 1000 characters");
  }
  if(req.body.gender){
    if(!validator.isIn(req.body.gender, ["Male", "Female", "Others"])){
      throw new Error("Gender must be male, female or others");
    }
  }
}}
  return isEditAllowed;
}

const validatePasswordUpdate = (req) => {
  const oldPassword = req.body.oldPassword;

  
}


module.exports = { validateSignUpData, validateProfileEditData, validatePasswordUpdate };
