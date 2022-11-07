const { updateUserPassword } = require("../../../services/hr/user");
const { createResponse } = require("../../../utils/responseGenerator");
const bcrypt = require("bcryptjs");
const { getUserByUserName } = require("../../../services/auth");

// update user password
module.exports.updateUserPassword = async (req, res, next) => {
  try {
    const { user, newPassword, oldPassword } = req.body;

    if (!user) {
      res.json(createResponse(null, "User might be logged out!", true));
    } else if (!oldPassword || !newPassword) {
      res.json(
        createResponse(
          null,
          "New password or old password might missing!",
          true
        )
      );
    } else {
      const { rows } = await getUserByUserName(user);
      if (rows.length === 0) {
        res.json(createResponse({ status: 203 }, "User does not exist", true));
      } else {
        const matched = rows[0];
        const isPassMatched = await bcrypt.compare(
          oldPassword,
          matched.PASSWORD
        );
        if (!isPassMatched) {
          res.json(
            createResponse({ status: 201 }, "Password does not matched", true)
          );
        } else {
          const salt = await bcrypt.genSalt(10);
          if (!salt) {
            res.json(
              createResponse(
                { status: 203 },
                "Some error occured on generating salt!",
                true
              )
            );
          } else {
            const hashed = await bcrypt.hash(newPassword, salt);
            if (!hashed) {
              res.json(
                createResponse(
                  { status: 202 },
                  "Error occured on hashing password!",
                  true
                )
              );
            } else {
              const updated = await updateUserPassword(user, hashed);
              if (updated) {
                res.json(
                  createResponse(
                    { status: 200 },
                    "Password updated successfully"
                  )
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    next(error.message);
  }
};

// update user password from admin
module.exports.updateUserPasswordByAdmin = async (req, res, next) => {
  try {
    const { user, password } = req.body;
    if (!user) {
      res.json(
        createResponse({ status: 203 }, "User might be logged out!", true)
      );
    } else if (!password) {
      res.json(
        createResponse({ status: 401 }, "Password might be missing!", true)
      );
    } else {
      const { rows } = await getUserByUserName(user);
      if (rows.length === 0) {
        res.json(createResponse({ status: 203 }, "User does not exist", true));
      } else {
        const salt = await bcrypt.genSalt(10);
        if (!salt) {
          res.json(
            createResponse(
              { status: 203 },
              "Some error occured on generating salt!",
              true
            )
          );
        } else {
          const hashed = await bcrypt.hash(password, salt);
          if (!hashed) {
            res.json(
              createResponse(
                { status: 202 },
                "Error occured on hashing password!",
                true
              )
            );
          } else {
            const updated = await updateUserPassword(user, hashed);
            if (updated) {
              res.json(
                createResponse({ status: 200 }, "Password updated successfully")
              );
            }
          }
        }
      }
    }
  } catch (error) {
    next(error.message);
  }
};
