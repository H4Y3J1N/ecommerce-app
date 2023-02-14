const express = require('express');
const router = express.Router();


// middlewares || adminCheck 메서드도 있는데 일단은 이거만.
const { authCheck } = require("../middlewares/auth");

// controller
const { createUser, loginUser, deleteUser,
    userProfile, updateUserProfile, updateUserPassword,
    generateVerificationToken
} = require("../controllers/userCtrl");

// routing
router.post('/create-user', createUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.get("/profile/:id", authCheck, userProfile);
router.put("/:id", authCheck, updateUserProfile);
router.put("/password", authCheck, updateUserPassword);
router.post("/send-mail", generateVerificationToken);





module.exports = router;