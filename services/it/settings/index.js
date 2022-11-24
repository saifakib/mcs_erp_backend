const { ExecuteIT } = require("../../../utils/itDynamicController");


/*------------- Get ------------*/
const categories = (search = "%%", page = 0, limit = 1000) => {
    let offset = limit * page;
    return ExecuteIT(
        `SELECT * FROM CATEGORIES WHERE LOWER(CATEGORY_NAME) LIKE LOWER('${search}') ORDER BY CATEGORY_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
    );
};
const selectCategory = (category_id) => ExecuteIT(
    `SELECT * FROM CATEGORIES WHERE CATEGORY_ID = ${category_id}`
);



/*------------------ Post -------------------*/
const insertCategory = ({ category_name }) =>
    ExecuteIT(
        `INSERT INTO CATEGORIES (CATEGORY_NAME) VALUES ('${category_name}')`
    );



/* --------------- Update -------------------*/
const updateCategory = ({ CATEGORY_NAME, CATEGORY_ID }) =>
    ExecuteIT(
        `UPDATE CATEGORIES SET CATEGORY_NAME = '${CATEGORY_NAME}' WHERE CATEGORY_ID = ${CATEGORY_ID}`
    );


/*------------------ Delete ----------------*/
const deleteCategory = ({ CATEGORY_ID }) =>
    ExecuteIT(`DELETE FROM CATEGORIES WHERE CATEGORY_ID = ${CATEGORY_ID}`);




module.exports = {
    categories,
    selectCategory,
    insertCategory,
    updateCategory,
    deleteCategory
}