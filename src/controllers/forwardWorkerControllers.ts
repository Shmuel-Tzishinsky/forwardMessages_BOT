// const { getUser } = require("../services/Session.services");

// const validation = {
//     register: registerValidation,
//     login: loginValidation,
//     verifyUser: tokenValidation,
//     ensureUniqueName: ensureUniqueNameValidation,
//     passwordReset: passwordResetValidation,
//     passwordChange: passwordChangeValidation,
//     editUser: userEditValidation,
// };

// const handleValidation = (body, res, type) => {
//     const { error } = validation[type](body);
//     if (error) {
//         throw Error(error.details[0].message);
//     }
// };

// const registerUser = async (req, res) => {
//     console.log(req.body);
//     // Validate data before creating a user

//     //   Hash password
//     try {
//         await handleValidation(req.body, res, "register");
//         //   Checking if the user is already in the db
//         const uniqueNameExist = await User.findOne({
//             uniqueName: req.body.uniqueName,
//         });

//         if (uniqueNameExist) {
//             return res.status(400).json({ error_msg: "The unique name already exists" });
//         }
//         req.body.password = await passwordEncrypt(req.body.password);

//         // Create a new user
//         const user = new User(req.body);

//         const savedUser = await user.save();
//         // Generate and send token
//         const token = await randomTokenGen(savedUser);
//         // const userToken = new Token({ _userId: savedUser._id, token: token })
//         // await userToken.save()
//         if (!token) {
//             res.status(500).json({ error_msg: "An error occurred" });
//         }
//         // Send UniqueName using senders here
//         return res.status(201).json({ data: savedUser });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// const loginUser = async (req, res) => {
//     // Validate data before creating a user
//     try {
//         handleValidation(req.body, res, "login");

//         //   Checking if the user is already in the db
//         const user = await getUser({ uniqueName: req.body.uniqueName });

//         // Password check
//         const validPass = await bcrypt.compare(req.body.password, user.password);

//         if (!validPass) {
//             return res.status(400).json({ error_msg: "הסיסמה שגויה" });
//         }

//         const h = parseFloat(moments.tz("Asia/Jerusalem")?.format("HH")) || 0;
//         // Create and assign a token
//         const token = jwt.sign(
//             {
//                 _id: user._id,
//                 role: user.role,
//                 name: user.name,
//                 changeRide: req.changeRide || false,
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             {
//                 expiresIn: req.changeRide ? "1H" : `${h >= 3 ? 24 - h + 3 : 3 - h || 24}H`,
//             },
//         );

//         return res.status(200).json({
//             name: user.name,
//             _id: user._id,
//             uniqueName: user.uniqueName,
//             access_token: token,
//         });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// // const editUserAction = (req, res) => {
// //   handleValidation(req.body, res, 'editUser');
// // };

// const verifyUserRegistration = async (req, res) => {
//     // Validate the incoming data
//     try {
//         handleValidation(req.body, res, "verifyUser");
//         const token = await getToken({ token: req.body.token });
//         const user = await getUser({ uniqueName: req.body.uniqueName });

//         if (user.isActive) {
//             return res.status(400).json({ error_msg: "User already verified" });
//         }

//         // This should not even happen. I am checking if the user UniqueName matches the user id in the token
//         if (!(token._userId !== user._id)) {
//             return res.status(400).json({ error_msg: "Token does not match user" });
//         }

//         user.isActive = true;
//         await user.save();
//         await token.remove();
//         return res.status(200).json({ data: "success" });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// const resendVerificationToken = async (req, res) => {
//     try {
//         handleValidation(req.body, res, "ensureUniqueName");

//         const { uniqueName } = req.body;
//         const user = await getUser({ uniqueName });
//         if (user.isActive) {
//             return res.status(400).json({ error_msg: "This user is already verified" });
//         }
//         // Generate and send token
//         const token = await randomTokenGen(user);
//         // send UniqueName using the token to user
//         return res.status(200).json({ data: "success" });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// const sendPasswordResetToken = async (req, res) => {
//     try {
//         handleValidation(req.body, res, "ensureUniqueName");

//         const { uniqueName } = req.body;
//         const user = await getUser({ uniqueName });
//         // Generate and send token
//         const token = await randomTokenGen(user);
//         // send UniqueName to user
//         return res.status(200).json({ data: token });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// const passwordReset = async (req, res) => {
//     try {
//         handleValidation(req.body, res, "passwordReset");
//         const { uniqueName, token: reqToken, password: newPassword } = req.body;
//         const token = await getToken({ token: reqToken });
//         // User confirmation
//         const user = await getUser({ uniqueName });

//         // Ensure new password not equals to old password
//         const passwordCompare = await bcrypt.compare(newPassword, user.password);

//         if (passwordCompare) {
//             return res.status(400).json({ error_msg: "You can't use this password again" });
//         }
//         user.password = await passwordEncrypt(req.body.password);
//         await user.save();
//         // Delete token if user is verified
//         await token.remove();
//         // Send an UniqueName to the user telling the password change successful
//         return res.status(200).json({ data: "Success" });
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// const changePassword = async (req, res) => {
//     try {
//         const { newPassword, oldPassword, admin } = req.body;
//         const user = await getUser({ _id: req.user._id });
//         if (user.role === "admin") {
//             return res.status(401).json({ error_msg: "אין לך את ההרשאות המתאימות" });
//         }
//         if (admin) {
//             user.password = await passwordEncrypt(newPassword);
//         } else {
//             handleValidation(req.body, res, "passwordChange");

//             if (newPassword === oldPassword) {
//                 return res.status(400).json({
//                     error_msg: "New and Current password is the same, use a new password",
//                 });
//             }

//             // Ensure old password is equal to db pass
//             const validPass = await bcrypt.compare(oldPassword, user.password);

//             if (!validPass) {
//                 return res.status(400).json({ error_msg: "Current password is wrong" });
//             }
//             user.password = await passwordEncrypt(newPassword);
//         }
//         // Ensure new password not equals to old password
//         await user.save();
//         return res.json("Success");
//     } catch (err) {
//         return res.status(400).json({ error_msg: err.message });
//     }
// };

// module.exports = {
//     registerUser,
//     loginUser,
//     verifyUserRegistration,
//     resendVerificationToken,
//     sendPasswordResetToken,
//     passwordReset,
//     changePassword,
// };
