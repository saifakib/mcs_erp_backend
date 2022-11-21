const { getUserByUserName, getMaxEMP } = require("../../services/auth");
const { createResponse } = require("../../utils/responseGenerator");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../../utils/JWT");
const { loginActivity, updateAuditLog } = require("../../services/audit_log");
const { addHours, format } = require("date-fns");
const { sign } = require("jsonwebtoken");

// login
module.exports.login = async (req, res, next) => {
  try {
    const { user, password } = req.body;
    const clientIp = req.ip?.split(":")[3];
    const device = req.device?.type.toUpperCase();

    if (!user || !password) {
      res.json(createResponse(null, "Username or Password missing", true));
    } else {
      const { rows } = await getUserByUserName(user);

      if (rows.length > 0) {
        const mactchedUser = rows[0];
        const isMatchedPass = await bcrypt.compare(
          password,
          mactchedUser.PASSWORD
        );

        if (isMatchedPass) {
          if (mactchedUser.ENABLE !== 1) {
            res.json({ status: 202 });
          } else {
            const entryDate = addHours(new Date(), 6);
            const entryTime = format(new Date(), "hh:mm aa");

            const token = createTokens(
              mactchedUser.USER_ID,
              mactchedUser.EMPLOYE_ID
            );
            const jsontoken = sign({ result: mactchedUser.USER_ID }, "b", {
              expiresIn: "8hr",
            });
            await loginActivity(
              user,
              "Login",
              device,
              clientIp,
              entryDate,
              entryTime,
              null,
              token
            );
            const { PASSWORD, ...rest } = mactchedUser;

            res.cookie("login_time", entryDate, {
              signed: false,
              httpOnly: false,
              path: "/",
              sameSite: "lax",
            });
            res.cookie("token", token, {
              maxAge: 36000000,
            });
            res.cookie("userId", rest.USER_ID, {
              signed: false,
              httpOnly: false,
              path: "/",
              sameSite: "lax",
            });
            res.cookie("Role", rest.ROLE_ID, {
              maxAge: 36000000,
            });
            res.json({ status: 200, token: jsontoken, user: rest });
          }
        } else {
          res.json({ status: 201 });
        }
      } else {
        res.json({ status: 203 });
      }
    }
  } catch (error) {
    next(error.message);
  }
};

// logout
module.exports.logout = async (req, res, next) => {
  //console.log(req.cookies["token"])
  try {
    const user = req.cookies["userId"];
    if (user) {
      const exitDay = addHours(new Date(), 6);
      const exitTime = format(new Date(), "hh:mm aa");

      const token = req.cookies["token"];

      await updateAuditLog(token, exitDay, exitTime);

      res
        .clearCookie("login_time")
        .clearCookie("userId")
        .clearCookie("token")
        .clearCookie("Role")
        .json(createResponse(null, "Logged out successfully"));
    } else {
      res.json(createResponse(null, "User already logged out", true));
    }
  } catch (error) {
    next(error.message);
  }
};

// get loggedin user info with out validation
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.json(
        createResponse(
          { status: 203 },
          "User might be logged out or session has been expired!",
          true
        )
      );
    } else {
      const { rows } = await getUserByUserName(userId);
      if (rows.length > 0) {
        const { PASSWORD, ...rest } = rows[0];
        const data = {
          user_id: rest.USER_ID,
          role_id: rest.ROLE_ID,
          role: rest.ROLE,
          employe_id: rest.EMPLOYE_ID,
          name_english: rest.NAME_ENGLISH,
        };
        res.json({ status: "successfull", user: data });
      } else {
        res.json(
          createResponse({ status: 203 }, "User not found in the system", true)
        );
      }
    }
  } catch (error) {
    next(error.message);
  }
};

// get loggedin user info with validation
module.exports.getSingleUserWithVaidation = async (req, res) => {
  const userId = req.body.userId;
  try {
    const { rows } = await getUserByUserName(userId);
    if (rows.length > 0) {
      const { PASSWORD, ...rest } = rows[0];
      console.log(rest);
      const data = {
        user_id: rest.USER_ID,
        role_id: rest.ROLE_ID,
        designation: rest.DESIGNATION,
        employe_id: rest.EMPLOYE_ID,
        name_english: rest.NAME_ENGLISH,
        enable: rest.ENABLE,
      };
      res.json({ status: 200, user: data });
    } else {
      res.json(createResponse(null, "User does not exist", true));
    }
  } catch (error) {
    res.json({ status: "database connection error" });
  }
  // try {
  //     const result = await axios.get(
  //         `http://192.168.3.8:8085/ords/hrm/use/v_use/id`,
  //         {
  //             headers: {
  //                 id: `${userId}`,
  //             },
  //         })

  //     const userInfo = result.data;
  //     const data = {
  //         user_id: userInfo.user_id,
  //         role_id: userInfo.role_id,
  //         role: userInfo.role,
  //         employe_id: userInfo.employe_id,
  //         name_english: userInfo.name_english,
  //     };
  //     res.json({ status: 200, user: data });
  // }
  // catch {
  //     res.json({ status: 'User does not exist' });

  // }
};
// get loggedin user info with validation
module.exports.getUserWithVaidation = async (req, res, next) => {
  try {
    const userId = req.user;
    const { rows } = await getUserByUserName(userId);
    if (rows.length > 0) {
      const { PASSWORD, ...rest } = rows[0];
      res.json(createResponse(rest));
    } else {
      res.json(createResponse(null, "User does not exist", true));
    }
  } catch (error) {
    next(error.message);
  }
};

// check server
module.exports.checkServer = async (req, res, next) => {
  try {
    const { rows } = await getMaxEMP();
    if (rows.length > 0) {
      res.json(createResponse({ status: 200 }));
    }
  } catch (error) {
    res.json(createResponse({ status: 204 }, error.message, true));
  }
};
