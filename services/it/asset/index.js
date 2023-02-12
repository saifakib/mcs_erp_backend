const {
  ExecuteIT
} = require("../../../utils/itDynamicController");


// asset Products
const assetProducts = () => ExecuteIT(`SELECT * FROM ASSET_PRODUCT`);

// Check Product Already Exit
const assetIndProduct = (prodName) => ExecuteIT(`SELECT * FROM ASSET_PRODUCT WHERE P_NAME = '${prodName}'`);
const userIndProduct = (employee_id, product_id) => ExecuteIT(`SELECT ID FROM ASSET_M_ENTRY WHERE EMP_ID = ${Number(employee_id)} AND PRODUCT_ID = ${Number(product_id)}`);

const userNotExitProducts = (employee_id) => ExecuteIT(`SELECT * FROM ASSET_PRODUCT WHERE ID NOT IN(SELECT PRODUCT_ID FROM ASSET_M_ENTRY  WHERE EMP_ID = ${Number(employee_id)})`)



const insertAssetProduct = (data) => {
  return ExecuteIT(`INSERT INTO ASSET_PRODUCT (P_NAME) VALUES ('${data.p_name}')`);
}
const deleteAssetProduct = ({ ID }) =>
  ExecuteIT(`DELETE FROM ASSET_PRODUCT WHERE ID = ${Number(ID)}`);

const updateAssetProduct = ({ P_NAME, ID }) =>
  ExecuteIT(
    `UPDATE ASSET_PRODUCT SET P_NAME = '${P_NAME}' WHERE ID = ${Number(ID)}`
  );

// asset Manual
const assetManual = () => {
  return ExecuteIT(`SELECT AM.ID, VE.NAME_ENGLISH,VE.DEPARTEMENT,VE.DESIGNATION,VE.DESIGNATION_BANGLA,VE.MOBILE_PHONE,VE.NAME_BANGLA,AP.P_NAME,AM.DETAILS,AM.YEAR,AM.QUANTITY,AM.SOURCE,AM.FILES,AM.V_FILE,AM.EMP_ID from ASSET_M_ENTRY AM 
LEFT OUTER JOIN VIEW_EMP_DETAILS VE 
ON VE.EMPLOYE_ID =AM.EMP_ID
LEFT OUTER JOIN ASSET_PRODUCT AP
ON AP.ID=AM.PRODUCT_ID
WHERE AM.STATUS=0
`);
};

const assetManualById = (data) => {
  return ExecuteIT(`SELECT AM.ID, VE.NAME_ENGLISH,VE.DEPARTEMENT,VE.DESIGNATION,VE.DESIGNATION_BANGLA,VE.MOBILE_PHONE,VE.NAME_BANGLA,AP.P_NAME,AM.DETAILS,AM.YEAR,AM.QUANTITY,AM.SOURCE,AM.FILES,AM.V_FILE from ASSET_M_ENTRY AM 
  LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID =AM.EMP_ID LEFT OUTER JOIN ASSET_PRODUCT AP ON AP.ID=AM.PRODUCT_ID
  WHERE AM.ID= ${Number(data.ID)}`);
};


const insertAssetManual = (data) => {
  return ExecuteIT(
    `INSERT INTO ASSET_M_ENTRY (EMP_ID,PRODUCT_ID,DETAILS,YEAR,QUANTITY,FILES,SOURCE) VALUES (${Number(
      data.employee_id
    )},${Number(data.product_id)},'${data.details}','${data.year}',${Number(
      data.quanity
    )},'${data.files}','${data.source}')`
  );
};

const updateAssetManual = (data) => {
  return ExecuteIT(
    `UPDATE ASSET_M_ENTRY
     SET V_FILE='${data.V_FILE}'
     WHERE EMP_ID=${Number(data.ID)}`
  );
};
const updateAssetManualStatus = (data) => {
  return ExecuteIT(
    `UPDATE ASSET_M_ENTRY
     SET STATUS='${Number(data.STATUS)}'
     WHERE ID=${Number(data.ID)}`
  );
};
const assetManualPersonReport = (emp_id) => {
  return ExecuteIT(`SELECT AM.ID, VE.NAME_ENGLISH,VE.DEPARTEMENT,VE.DESIGNATION,VE.DESIGNATION_BANGLA,VE.MOBILE_PHONE,VE.NAME_BANGLA,AP.P_NAME,AM.DETAILS,AM.YEAR,AM.QUANTITY,AM.SOURCE,AM.FILES,AM.V_FILE,AM.EMP_ID, TO_CHAR(AM.ENTRY_DATE,'DD-MM-YYYY') AS ENTRY_DATE from ASSET_M_ENTRY AM 
LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID =AM.EMP_ID
LEFT OUTER JOIN ASSET_PRODUCT AP ON AP.ID=AM.PRODUCT_ID WHERE AM.STATUS=0 AND AM.EMP_ID=${Number(emp_id)} `);
};

const assetManualDepReport = (dep_id) => {
  return ExecuteIT(`SELECT AM.ID, VE.NAME_ENGLISH, ED.DEPARTEMENT_ID, VE.DEPARTEMENT,VE.DESIGNATION,VE.DESIGNATION_BANGLA,VE.MOBILE_PHONE,VE.NAME_BANGLA, 
AP.P_NAME,AP.ID as PRO_ID,AM.DETAILS,AM.YEAR,AM.QUANTITY,AM.SOURCE,AM.FILES,AM.V_FILE,AM.EMP_ID, 
TO_CHAR(AM.ENTRY_DATE,'DD-MM-YYYY') AS ENTRY_DATE from ASSET_M_ENTRY AM
LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID = AM.EMP_ID
LEFT OUTER JOIN VIEW_EMPLOYEE ED ON ED.EMPLOYE_ID = AM.EMP_ID
LEFT OUTER JOIN ASSET_PRODUCT AP ON AP.ID=AM.PRODUCT_ID
WHERE AM.STATUS=0 AND ED.DEPARTEMENT_ID = ${Number(dep_id)}`)
};

module.exports = {
  assetProducts, assetIndProduct, userIndProduct, userNotExitProducts,
  insertAssetProduct,
  deleteAssetProduct,
  updateAssetProduct,
  assetManual,
  insertAssetManual,
  assetManualById,
  updateAssetManual,
  updateAssetManualStatus,
  assetManualPersonReport,
  assetManualDepReport,
};
