const { ExecuteIT } = require("../../../utils/itDynamicController");


/*------------- Get ------------*/
// Category
const categories = (search = "%%", page = 0, limit = 1000) => {
    let offset = limit * page;
    return ExecuteIT(
        `SELECT * FROM CATEGORIES WHERE LOWER(CATEGORY_NAME) LIKE LOWER('${search}') ORDER BY CATEGORY_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
    );
};
const selectCategory = (category_id) => ExecuteIT(
    `SELECT * FROM CATEGORIES WHERE CATEGORY_ID = ${Number(category_id)}`
);


// ProductLists
const productLists = (search = "%%", page = 0, limit = 1000) => {
    let offset = limit * page;
    return ExecuteIT(
        `SELECT PL.PRODUCT_ID, PL.PRODUCTNAME, PL.CATEGORY_ID, C.CATEGORYNAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID WHERE LOWER(PRODUCTNAME) LIKE LOWER('${search}') OR LOWER(C.CATEGORYNAME) LIKE LOWER('${search}') ORDER BY PRODUCT_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
    );
};
const getSingleProductLists = (product_id) =>
    ExecuteIT(
        `SELECT PL.PRODUCT_ID, PL.PRODUCTNAME, PL.CATEGORY_ID, C.CATEGORYNAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID WHERE PL.PRODUCT_ID = ${Number(product_id)}`
    );
const getCountProductLists = () => {
    return ExecuteIT(
        `select count(product_id) as total_products from product_list`
    );
};



/*------------------ Post -------------------*/
// Category
const insertCategory = ({ category_name }) =>
    ExecuteIT(
        `INSERT INTO CATEGORIES (CATEGORY_NAME) VALUES ('${category_name}')`
    );

// ProductLists
const insertProduct = ({ product_name, category_id }) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_LIST (PRODUCT_NAME, CATEGORY_ID) VALUES ('${product_name}', '${Number(category_id)}')`
    );



/* --------------- Update -------------------*/
// Category
const updateCategory = ({ CATEGORY_NAME, CATEGORY_ID }) =>
    ExecuteIT(
        `UPDATE CATEGORIES SET CATEGORY_NAME = '${CATEGORY_NAME}' WHERE CATEGORY_ID = ${CATEGORY_ID}`
    );

// ProductLists
const updateputProductLists = ({ PRODUCT_NAME, CATEGORY_ID, PRODUCT_ID }) =>
    ExecuteIT(
        `UPDATE PRODUCT_LIST SET PRODUCT_NAME = '${PRODUCT_NAME}', CATEGORY_ID = ${Number(CATEGORY_ID)} WHERE PRODUCT_ID = ${Number(PRODUCT_ID)}`
    );


/*------------------ Delete ----------------*/

// Category
const deleteCategory = ({ CATEGORY_ID }) =>
    ExecuteIT(`DELETE FROM CATEGORIES WHERE CATEGORY_ID = ${CATEGORY_ID}`);

// ProductLists
const deleteProductLists = ({ PRODUCT_ID }) =>
    ExecuteIT(`DELETE FROM PRODUCT_NAME WHERE PRODUCT_ID = ${PRODUCT_ID}`);




module.exports = {
    categories,
    selectCategory,
    insertCategory,
    updateCategory,
    deleteCategory,
    productLists,
    getCountProductLists,
    getSingleProductLists,
    insertProduct,
    updateputProductLists,
    deleteProductLists
}