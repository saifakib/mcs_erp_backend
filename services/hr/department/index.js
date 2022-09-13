const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getAllDepartments = (search = "%%", page = 0, limit = 1000) => {
    let offset = limit * page;
    return Execute(
      `SELECT * FROM hrm.department_list WHERE LOWER(DEPARTEMENT) LIKE LOWER('${search}') ORDER BY DEPARTEMENT_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
    );
}



/*--------------------------------END SELECT --------------------------------*/


module.exports = {
    getAllDepartments
}
