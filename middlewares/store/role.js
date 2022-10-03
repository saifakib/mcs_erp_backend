const { getUserFromRole } = require('../../services/store/storeRole');

const { createResponse } = require('../../utils/responseGenerator')

module.exports.requireRole = async (req, res, next) => {

    const { emp_id } = req.headers;

    try {
        const { rows: role } = await getUserFromRole({emp_id});

        if(role.length === 0 ) {
            res.json(createResponse("You are not authrozed"));
        } 
        else {
            next()
        }

    } catch(err) {
        next(err)
    }
}