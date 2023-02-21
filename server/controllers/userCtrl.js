// 초급코드의 usersCtrl 에서 적용할 수 있을 기능 추가
// 중급코드에서 유저 로그아웃 추가해야 함

// 유저 가입, 로그인, 삭제, 프로필 조회, 프로필 업데이트, 비밀번호 변경
// 유저의 기본 활동에 대한 기능들

const User = require('../models/user');
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
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
            name: req?.body?.name,
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
    if (userFound && (await userFound.isPasswordMatched(password))) {
        res.json({
            _id : userFound?._id,
            name: userFound?.name,
            email : userFound?.email,
            token : generateToken(userFound?.id),
            role : userFound?.role
        });
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
//fetchUsers
exports.fetchUsers = expressAsyncHandler(async (req, res) => {
  console.log(req.headers);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});


//------------------------------
// user profile view  // 중급코드의 current user와  비슷한 역할 
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
// Generate email Verification - Send email
exports.generateVerificationToken = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;
  const user = await User.findById(loginUserId);
  try {
    //Generate token
    const verificationToken = await user.createAccountVerificationToken();
    //save the user
    await user.save();
    console.log(verificationToken);
    //build your message

    const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
    const msg = {
      to: "wikidipy@naver.com",
      from: "wikidipy@gmail.com",
      subject: "My first Node js email sending",
      html: resetURL,
    };
    await sgMail.send(msg);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});
  


//------------------------------
//Account verification
exports.accountVerification = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find this user by token

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");
  //update the proport to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});





//------------------------------
// current user  - 중급코드에서는 이걸 frontend에서 현재유저를 바로 찾기위해 사용
exports.currentUser = async(req,res) => {
  User.findOne({ email: req.user.email}).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};