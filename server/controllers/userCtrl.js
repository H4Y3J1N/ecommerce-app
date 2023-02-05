// 초급코드의 usersCtrl 에서 적용할 수 있을 기능 추가
// 중급코드에서 유저 로그아웃 추가해야 함

// 유저 가입, 로그인, 삭제, 프로필 조회, 프로필 업데이트, 비밀번호 변경
// 유저의 기본 활동에 대한 기능들

const User = require('../models/user');
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateAuthToken");
const validateMongodbId = require("../config/validateMongodbID");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


// --------------------------------
// register
exports.createUser = expressAsyncHandler(async (req,res) => {
    // check if user is already registered
    const userExits = await User.findOne({ email: req?.body?.email});
    if (userExits) throw new Error("User already exists");
    try{
        const user = await User.create({
            name: req?.body?.firstName,
            email : req?.body?.email,
            password : req?.body?.password
        });
        res.json("user is Successfully created");
    } catch(error){
        res.json(error);
    }
});


// --------------------------------
// login 
exports.loginUser = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body;
    //check if user exists
    const userFound = await User.findOne({email});
    //check if password is match
    if (userFound){
        res.json({
            _id : userFound?._id,
            name: userFound?.name,
            email : userFound?.email,
            token : generateToken(userFound?.id)
        })
    } else {
        res.status(401);
        throw new Error ("invalid login credentials");
    }
});


//------------------------------
// deleteUser
exports.deleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    //check if user id is valid
    validateMongodbId(id);
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.json(deletedUser);
    } catch (error) {
      res.json(error);
    }
  });


//------------------------------
// user profile view
exports.userProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update profile
exports.updateUserProfile = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});


//------------------------------
//Update password
exports.updateUserPassword = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});


//------------------------------
// Account Verification - Send email
exports.generateVerificationToken = expressAsyncHandler(async (req, res) => {
    try {
      //build your message
      const msg = {
        to: "wikidipy@naver.com",
        from: "wikidipy@gmail.com",
        subject: "My first Node js email sending",
        text: "Hey check me out for this email",
      };
      await sgMail.send(msg);
      res.json("Email sent");
    } catch (error) {
      res.json(error);
    }
  });
  