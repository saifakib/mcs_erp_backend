const { ExecuteIT } = require("../../../utils/itDynamicController");


/*------------- Get ------------*/
// Category
const categories = () => {
    return ExecuteIT(
        `SELECT * FROM CATEGORIES ORDER BY CATEGORY_ID DESC`
    );
};
const selectCategory = (category_id) => ExecuteIT(
    `SELECT * FROM CATEGORIES WHERE CATEGORY_ID = ${Number(category_id)}`
);


// ProductLists
const productLists = () => {
    return ExecuteIT(
        `SELECT PL.PRODUCT_ID, PL.PRODUCTNAME, PL.CATEGORY_ID, C.CATEGORYNAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID ORDER BY PRODUCT_ID DESC`
    );
};
const selectProductLists = (product_id) =>
    ExecuteIT(
        `SELECT PL.PRODUCT_ID, PL.PRODUCTNAME, PL.CATEGORY_ID, C.CATEGORYNAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID WHERE PL.PRODUCT_ID = ${Number(product_id)}`
    );
const getCountProductLists = () => {
    return ExecuteIT(
        `select count(product_id) as total_products from product_list`
    );
};

// Models
const models = () => {
    return ExecuteIT(
        `SELECT * FROM MODELS`
    );
};
const selectModel = (model_id) =>
    ExecuteIT(
        `SELECT * FROM MODELS M LEFT OUTER JOIN SPECIFICATION S ON M.MODEL_ID = S.MODEL_ID WHERE  M.MODEL_ID = ${Number(model_id)}`
    );

// Specifications
const specifications = () => {
    return ExecuteIT(
        `SELECT * FROM SPECIFICATION S LEFT OUTER JOIN MODEL M ON S.MODEL_ID = M.MODEL_ID`
    );
};
const selectSpecification = (specification_id) =>
    ExecuteIT(
        `SELECT * FROM SPECIFICATION S LEFT OUTER JOIN MODEL M ON S.MODEL_ID = M.MODEL_ID WHERE  S.ID = ${Number(specification_id)}`
    );

// Units
const units = () => {
    return ExecuteIT(
        `SELECT * FROM UNIT ORDER BY UNIT_ID DESC`
    );
};
const selectUnit = (unit_id) => ExecuteIT(`SELECT * FROM UNIT WHERE UNIT_ID = ${Number(unit_id)}`)

// Brands
const brands = () => {
    return ExecuteIT(
        `SELECT * FROM BRANDORDER BY BRAND_ID DESC`
    );
};
const selectBrand = (brand_id) => ExecuteIT(`SELECT * FROM BRAND WHERE BRAND_ID = ${Number(brand_id)}`)

// Suppliers
const suppliers = () => ExecuteIT(
    `SELECT * FROM SUPPLIERS ORDER BY SUP_ID DESC`
);
const selectSupplier = (supplier_id) => ExecuteIT(`SELECT * FROM SUPPLIERS WHERE SUPPLIER_ID = ${Number(supplier_id)}`)


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

// Models
const insertModel = ({ model_name }) =>
    ExecuteIT(
        `INSERT INTO MODELS (MODEL_NAME) VALUES ('${model_name}')`
    );

// Specifications
const insertSpecification = ({ model_id, name, value }) =>
    ExecuteIT(
        `INSERT INTO SPECIFICATION (MODEL_ID, NAME, S_VALUE) VALUES ('${Number(model_id)}', '${name}', '${value}')`
    );

// Units
const insertUnit = ({ unit_name }) =>
    ExecuteIT(`INSERT INTO UNIT (UNIT_NAME) VALUES ('${unit_name}')`);

// Brands
const insertBrand = ({ brand_name }) =>
    ExecuteIT(`INSERT INTO BRAND (BRAND_NAME) VALUES ('${brand_name}')`);

// Suppliers
const insertSupplier = ({ sup_type, sup_name, sup_details }) =>
    ExecuteIT(`INSERT INTO SUPPLIERS (SUP_TYPE,SUP_NAME,SUPPLIER_DETAILS) VALUES ('${sup_type}', '${sup_name}', '${sup_details}')`);




/* --------------- Update -------------------*/
// Category
const updateCategory = ({ CATEGORY_NAME, CATEGORY_ID }) =>
    ExecuteIT(
        `UPDATE CATEGORIES SET CATEGORY_NAME = '${CATEGORY_NAME}' WHERE CATEGORY_ID = ${Number(CATEGORY_ID)}`
    );

// ProductLists
const updateputProductLists = ({ PRODUCT_NAME, CATEGORY_ID, PRODUCT_ID }) =>
    ExecuteIT(
        `UPDATE PRODUCT_LIST SET PRODUCT_NAME = '${PRODUCT_NAME}', CATEGORY_ID = ${Number(CATEGORY_ID)} WHERE PRODUCT_ID = ${Number(PRODUCT_ID)}`
    );

// Models
const updateModel = ({ MODEL_NAME, MODEL_ID }) =>
    ExecuteIT(
        `UPDATE MODELS SET MODEL_NAME = '${MODEL_NAME}' WHERE MODEL_ID = ${Number(MODEL_ID)}`
    );

// Specifications
const updateSpecification = ({ SPECIFICATION_ID, NAME, VALUE }) =>
    ExecuteIT(
        `UPDATE SPECIFICATION SET NAME = '${NAME}', S_VALUE = '${VALUE}', WHERE ID = ${Number(SPECIFICATION_ID)}`
    );

// Units
const updateUnit = ({ UNIT_NAME, UNIT_ID }) =>
    ExecuteIT(`UPDATE UNIT SET UNIT_NAME = '${UNIT_NAME}' WHERE UNIT_IT = ${Number(UNIT_ID)}`);

// Brands
const updateBrand = ({ BRAND_NAME, BRAND_ID }) =>
    ExecuteIT(`UPDATE BRAND SET BRAND_NAME = '${BRAND_NAME}' WHERE BRAND_ID = ${Number(BRAND_ID)}`);

// Suppliers
const updateSupplier = ({ SUP_ID, SUP_TYPE, SUP_NAME, SUPPLIER_DETAILS }) =>
    ExecuteIT(`UPDATE SUPPLIERS SET SUP_TYPE = '${SUP_TYPE}', SUP_NAME = '${SUP_NAME}', SUPPLIER_DETAILS = '${SUPPLIER_DETAILS}' WHERE SUPPLIER_ID = ${Number(SUP_ID)}`);

/*------------------ Delete ----------------*/

// Category
const deleteCategory = ({ CATEGORY_ID }) =>
    ExecuteIT(`DELETE FROM CATEGORIES WHERE CATEGORY_ID = ${Number(CATEGORY_ID)}`);

// ProductLists
const deleteProductLists = ({ PRODUCT_ID }) =>
    ExecuteIT(`DELETE FROM PRODUCT_NAME WHERE PRODUCT_ID = ${Number(PRODUCT_ID)}`);

// Models
const deleteModel = ({ MODEL_ID }) =>
    ExecuteIT(`DELETE FROM MODELS WHERE MODEL_ID = ${Number(MODEL_ID)}`);

// Specifications
const deleteSpecification = ({ SPECIFICATION_ID }) =>
    ExecuteIT(`DELETE FROM SPECIFICATION WHERE ID = ${Number(SPECIFICATION_ID)}`);

// Units
const deleteUnit = ({ UNIT_ID }) =>
    ExecuteIT(`DELETE FROM UNIT WHERE UNIT_ID = ${Number(UNIT_ID)}`);

// Brands
const deleteBrand = ({ BRAND_ID }) =>
    ExecuteIT(`DELETE FROM BRAND WHERE BRAND_ID = ${Number(BRAND_ID)}`);

// Suppliers
const deleteSupplier = ({ SUP_ID }) =>
ExecuteIT(`DELETE FROM SUPPLIERS WHERE SUPPLIER_ID = ${Number(SUP_ID)}`);



module.exports = {
    categories, selectCategory, insertCategory, updateCategory, deleteCategory,
    productLists, getCountProductLists, selectProductLists, insertProduct, updateputProductLists, deleteProductLists,
    models, selectModel, insertModel, updateModel, deleteModel,
    specifications, selectSpecification, insertSpecification, updateSpecification, deleteSpecification,
    units, selectUnit, insertUnit, updateUnit, deleteUnit,
    brands, selectBrand, insertBrand, updateBrand, deleteBrand,
    suppliers, selectSupplier, insertSupplier, updateSupplier, deleteSupplier,

}