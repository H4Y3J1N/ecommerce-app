const express = require('express');
const router = express.Router();


// middlewares || adminCheck 메서드도 있는데 일단은 이거만.
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { createUser, loginUser, deleteUser,
    userProfile, updateUserProfile, updateUserPassword,
    generateVerificationToken, fetchUsers,
    currentUser, accountVerification
} = require("../controllers/userCtrl");

// routing
router.post('/create-user', createUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);
router.get("/fetch",authCheck, fetchUsers);
router.get("/profile/:id", authCheck, userProfile);
router.put("/:id", authCheck, updateUserProfile);
router.put("/password", authCheck, updateUserPassword);
router.post("/generate-verify-email-token", authCheck, generateVerificationToken);
router.put("/verify-account", authCheck, accountVerification);


router.post("/current-user", authCheck, currentUser);  // 중급코드
router.post("/current-admin", authCheck, adminCheck, currentUser);  // 중급코드



module.exports = router;