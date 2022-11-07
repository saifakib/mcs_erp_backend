const { getUserByUserName, getMaxEMP } = require("../../services/auth");
const { createResponse } = require("../../utils/responseGenerator");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../../utils/JWT");
const { loginActivity, logOutActivity } = require("../../services/audit_log");
const { addHours, format, differenceInMinutes } = require("date-fns");

// login
module.exports.login = async (req, res, next) => {
  try {
    const { user, password } = req.body;
    const clientIp = req.ip?.split(":")[3];
    const device = req.device.type.toUpperCase();

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
            res.json(
              createResponse(
                { status: 202 },
                "You are not authorized to the system!",
                true
              )
            );
          } else {
            const entryDate = addHours(new Date(), 6);
            const entryTime = format(new Date(), "hh:mm aa");

            await loginActivity(
              user,
              "Login",
              device,
              clientIp,
              entryDate,
              entryTime,
              null
            );
            const { PASSWORD, ...rest } = mactchedUser;
            const token = createTokens(rest.USER_ID, rest.EMPLOYE_ID);
            res.cookie("login_time", entryDate);
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
            res.json(
              createResponse(
                { status: 200, token: token, user: rest },
                "Login successfull"
              )
            );
          }
        } else {
          res.json(
            createResponse({ status: 201 }, "Enter a valid password!", true)
          );
        }
      } else {
        res.json(createResponse({ status: 203 }, "User does not exist", true));
      }
    }
  } catch (error) {
    next(error.message);
  }
};

// logout
module.exports.logout = async (req, res, next) => {
  try {
    const user = req.cookies["userId"];
    if (user) {
      const clientIp = req.ip?.split(":")[3];
      const device = req.device.type.toUpperCase();
      const loginTime = req.cookies["login_time"];
      const entryDate = addHours(new Date(), 6);
      const entryTime = format(new Date(), "hh:mm aa");

      const difference = differenceInMinutes(
        addHours(new Date(), 6),
        new Date(loginTime)
      );
      await logOutActivity(
        user,
        "Logout",
        device,
        clientIp,
        entryDate,
        entryTime,
        difference
      );
      res.clearCookie("userId");
      res.clearCookie("token").clearCookie("Role").clearCookie("login_time");
      res.json(createResponse(null, "Logged out successfully"));
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
        res.json(createResponse({ staus: 200, user: rest }));
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
