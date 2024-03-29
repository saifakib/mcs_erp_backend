const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");


/*----------------------------------------- SELECT ----------------------------------------------*/

// Dynamic find individula item
const selectDynamicQuery = (tableName, columName, findValue) =>
    ExecuteIT(`SELECT * FROM ${tableName} WHERE ${columName} = '${findValue}'`);

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
        `SELECT PL.PRODUCT_ID, PL.PRODUCT_NAME, PL.CATEGORY_ID, C.CATEGORY_NAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID ORDER BY PRODUCT_ID DESC`
    );
};
const selectProductLists = (product_id) =>
    ExecuteIT(
        `SELECT PL.PRODUCT_ID, PL.PRODUCT_NAME, PL.CATEGORY_ID, C.CATEGORY_NAME FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID WHERE PL.PRODUCT_ID = ${Number(product_id)}`
    );
const getCountProductLists = () => {
    return ExecuteIT(
        `select count(product_id) as total_products from product_list`
    );
};

// Category ProductList
const selectProductListCountByCategories = () => ExecuteIT(`SELECT distinct(C.CATEGORY_ID), C.CATEGORY_NAME, COUNT(P.PRODUCT_ID) OVER(PARTITION BY P.CATEGORY_ID) AS PRODUCT_LISTS FROM CATEGORIES C LEFT OUTER JOIN PRODUCT_LIST P ON C.CATEGORY_ID = P.CATEGORY_ID ORDER BY C.CATEGORY_ID DESC`);
const selectProductListsByCatId = (category_id) => ExecuteIT(`SELECT * FROM PRODUCT_LIST PL LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID  WHERE C.CATEGORY_ID = ${Number(
    category_id
)}`)

// Models
const models = () => {
    return ExecuteIT(
        `SELECT * FROM MODELS`
    );
};
const selectModel = (model_id) =>
    ExecuteIT(
        `SELECT * FROM MODELS M LEFT OUTER JOIN SPECIFICATION S ON M.MODEL_ID = S.MODEL_ID WHERE M.MODEL_ID = ${Number(model_id)}`
    );

// Specifications
const specifications = () => {
    return ExecuteIT(
        `SELECT * FROM SPECIFICATION S LEFT OUTER JOIN MODELS M ON S.MODEL_ID = M.MODEL_ID`
    );
};
const selectSpecification = (specification_id) =>
    ExecuteIT(
        `SELECT * FROM SPECIFICATION S LEFT OUTER JOIN MODELS M ON S.MODEL_ID = M.MODEL_ID WHERE  S.ID = ${Number(specification_id)}`
    );
const selectSpecificationsByModelId = (model_id) =>
    ExecuteIT(
        `SELECT S.ID, M.MODEL_ID, M.MODEL_NAME, S.NAME, S.S_VALUE AS VALUE FROM SPECIFICATION S LEFT OUTER JOIN MODELS M ON S.MODEL_ID = M.MODEL_ID WHERE  S.MODEL_ID = ${Number(model_id)}`
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
        `SELECT * FROM BRAND ORDER BY BRAND_ID DESC`
    );
};
const selectBrand = (brand_id) => ExecuteIT(`SELECT * FROM BRAND WHERE BRAND_ID = ${Number(brand_id)}`)

// Suppliers
const suppliers = () => ExecuteIT(
    `SELECT * FROM SUPPLIERS ORDER BY SUPPLIER_ID DESC`
);
const selectSupplier = (supplier_id) => ExecuteIT(`SELECT * FROM SUPPLIERS WHERE SUPPLIER_ID = ${Number(supplier_id)}`);

/*----------------------------------------- END SELECT ----------------------------------------------*/


/*-----------------------------------------  INSERT ----------------------------------------------*/
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
        `INSERT INTO MODELS (MODEL_NAME) VALUES ('${model_name}') RETURN MODEL_ID INTO :id`, { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

// Specifications
const insertSpecification = ({ model_id, name, value }) =>
    ExecuteIT(
        `INSERT INTO SPECIFICATION (MODEL_ID, NAME, S_VALUE) VALUES ('${Number(model_id)}', '${name}', '${value}')`
    );
    
const insertManySpecification = (model_id, array) => {
    let newArray = array;
    const statement = `INSERT INTO SPECIFICATION (MODEL_ID, NAME, S_VALUE) VALUES ('${Number(model_id)}', :name, :value)`;
    return ExecuteITMany(statement, newArray);
};

// Units
const insertUnit = ({ unit_name }) =>
    ExecuteIT(`INSERT INTO UNIT (UNIT_NAME) VALUES ('${unit_name}')`);

// Brands
const insertBrand = ({ brand_name }) =>
    ExecuteIT(`INSERT INTO BRAND (BRAND_NAME) VALUES ('${brand_name}')`);

// Suppliers
const insertSupplier = ({ sup_type, sup_name, sup_details }) =>
    ExecuteIT(`INSERT INTO SUPPLIERS (SUP_TYPE,SUP_NAME,SUPPLIER_DETAILS) VALUES ('${sup_type}', '${sup_name}', '${sup_details}')`);

/*----------------------------------------- END INSERT ----------------------------------------------*/






/*----------------------------------------- UPDATE ----------------------------------------------*/
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
        `UPDATE SPECIFICATION SET NAME = '${NAME}', S_VALUE = '${VALUE}' WHERE ID = ${Number(SPECIFICATION_ID)}`
    );

// Units
const updateUnit = ({ UNIT_NAME, UNIT_ID }) =>
    ExecuteIT(`UPDATE UNIT SET UNIT_NAME = '${UNIT_NAME}' WHERE UNIT_ID = ${Number(UNIT_ID)}`);

// Brands
const updateBrand = ({ BRAND_NAME, BRAND_ID }) =>
    ExecuteIT(`UPDATE BRAND SET BRAND_NAME = '${BRAND_NAME}' WHERE BRAND_ID = ${Number(BRAND_ID)}`);

// Suppliers
const updateSupplier = ({ SUP_ID, SUP_TYPE, SUP_NAME, SUPPLIER_DETAILS }) =>
    ExecuteIT(`UPDATE SUPPLIERS SET SUP_TYPE = '${SUP_TYPE}', SUP_NAME = '${SUP_NAME}', SUPPLIER_DETAILS = '${SUPPLIER_DETAILS}' WHERE SUPPLIER_ID = ${Number(SUP_ID)}`);

/*----------------------------------------- END UPDATE ----------------------------------------------*/






/*------------------------------------------- DELETE ----------------------------------------------*/

// Category
const deleteCategory = ({ CATEGORY_ID }) =>
    ExecuteIT(`DELETE FROM CATEGORIES WHERE CATEGORY_ID = ${Number(CATEGORY_ID)}`);

// ProductLists
const deleteProductLists = ({ PRODUCT_ID }) =>
    ExecuteIT(`DELETE FROM PRODUCT_LIST WHERE PRODUCT_ID = ${Number(PRODUCT_ID)}`);

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


/*------------------------------------------- END DELETE ----------------------------------------------*/



module.exports = {
    selectDynamicQuery,
    categories, selectCategory, insertCategory, updateCategory, deleteCategory,
    productLists, getCountProductLists, selectProductLists, insertProduct, updateputProductLists, deleteProductLists,
    models, selectModel, insertModel, updateModel, deleteModel,
    specifications, selectSpecification, insertSpecification, updateSpecification, deleteSpecification,
    selectSpecificationsByModelId,
    insertManySpecification,
    units, selectUnit, insertUnit, updateUnit, deleteUnit,
    brands, selectBrand, insertBrand, updateBrand, deleteBrand,
    suppliers, selectSupplier, insertSupplier, updateSupplier, deleteSupplier,

    selectProductListCountByCategories, selectProductListsByCatId,

}