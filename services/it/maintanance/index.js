const { ExecuteIT } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");

/*------------- GET ------------*/
// Get all maintanance
const selectMaintanances = (hrid) => {
    if (hrid) {
        return ExecuteIT(`SELECT M.MAINTENANCE_ID, M.IND_PRO_ID, M.IND_PRO_REQ_ID, TO_CHAR(M.REQ_DATE, 'MON DD, YYYY') AS REQUEST_DATE, C.CATEGORY_NAME, M.STATUS, PL.PRODUCT_NAME,
        IP.UNIQUE_V, M.HR_ID, VE.NAME_ENGLISH, VE.DEPARTEMENT, VE.DESIGNATION, B.BRAND_NAME, MO.MODEL_NAME,
        CASE
          WHEN M.STATUS = 0 THEN 'Pending'
          WHEN M.STATUS = 1 THEN 'Approved'
          WHEN M.STATUS = 2 THEN 'Accepted'
          WHEN M.STATUS = 3 THEN 'Servicing'
          WHEN M.STATUS = 4 THEN 'Servicing Back'
          WHEN M.STATUS = 5 THEN 'Dead'
          WHEN M.STATUS = 6 THEN 'Notify User'
          WHEN M.STATUS = 7 THEN 'User Accepted'
        end STATUSS
        FROM MAINTENANCE M
        LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID = M.HR_ID
        LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
        LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = IP.STR_PRO_ID
        LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = SP.PRO_ID
        LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
        LEFT OUTER JOIN BRAND B ON B.BRAND_ID = SP.BRAND_ID
        LEFT OUTER JOIN MODELS MO ON MO.MODEL_ID = SP.MODEL_ID WHERE M.HR_ID = ${Number(hrid)}`);
    } else {
        return ExecuteIT(`  SELECT M.MAINTENANCE_ID, M.IND_PRO_ID, M.IND_PRO_REQ_ID, TO_CHAR(M.REQ_DATE, 'MON DD, YYYY') AS REQUEST_DATE, C.CATEGORY_NAME, M.STATUS, PL.PRODUCT_NAME,
        IP.UNIQUE_V, M.HR_ID, VE.NAME_ENGLISH, VE.DEPARTEMENT, VE.DESIGNATION, B.BRAND_NAME, MO.MODEL_NAME,
        CASE
          WHEN M.STATUS = 0 THEN 'Pending'
          WHEN M.STATUS = 1 THEN 'Approved'
          WHEN M.STATUS = 2 THEN 'Accepted'
          WHEN M.STATUS = 3 THEN 'Servicing'
          WHEN M.STATUS = 4 THEN 'Servicing Back'
          WHEN M.STATUS = 5 THEN 'Dead'
          WHEN M.STATUS = 6 THEN 'Notify User'
          WHEN M.STATUS = 7 THEN 'User Accepted'
        end STATUSS
        FROM MAINTENANCE M
        LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID = M.HR_ID
        LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
        LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = IP.STR_PRO_ID
        LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = SP.PRO_ID
        LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
        LEFT OUTER JOIN BRAND B ON B.BRAND_ID = SP.BRAND_ID
        LEFT OUTER JOIN MODELS MO ON MO.MODEL_ID = SP.MODEL_ID`);
    }
}

const selectMaintanance = (maintanance_id) => ExecuteIT(`SELECT M.MAINTENANCE_ID, M.IND_PRO_ID, M.IND_PRO_REQ_ID, 
    TO_CHAR(M.REQ_DATE, 'MON DD, YYYY') AS REQUEST_DATE, C.CATEGORY_NAME, M.STATUS, PL.PRODUCT_NAME,
    IP.UNIQUE_V, M.HR_ID, VE.NAME_ENGLISH, VE.NAME_BANGLA, VE.DEPARTEMENT, VE.DESIGNATION, VE.DESIGNATION_BANGLA, B.BRAND_NAME, MO.MODEL_NAME,
    CASE
        WHEN M.STATUS = 0 THEN 'Pending'
        WHEN M.STATUS = 1 THEN 'Approved'
        WHEN M.STATUS = 2 THEN 'Accepted'
        WHEN M.STATUS = 3 THEN 'Servicing'
        WHEN M.STATUS = 4 THEN 'Servicing Back'
        WHEN M.STATUS = 5 THEN 'Dead'
        WHEN M.STATUS = 6 THEN 'Notify User'
        WHEN M.STATUS = 7 THEN 'User Accepted'
    end STATUSS
    FROM MAINTENANCE M
    LEFT OUTER JOIN VIEW_EMP_DETAILS VE ON VE.EMPLOYE_ID = M.HR_ID
    LEFT OUTER JOIN IND_PRODUCT IP ON IP.IND_PRODUCT_ID = M.IND_PRO_ID
    LEFT OUTER JOIN STORE_PRODUCTS SP ON SP.STR_PRO_ID = IP.STR_PRO_ID
    LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = SP.PRO_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN BRAND B ON B.BRAND_ID = SP.BRAND_ID
    LEFT OUTER JOIN MODELS MO ON MO.MODEL_ID = SP.MODEL_ID WHERE M.MAINTENANCE_ID = ${Number(maintanance_id)}`)

/*------------- INSERT ------------*/
// INSERT maintanance request
const insertMaintananceReq = (data) =>
    ExecuteIT(
        `INSERT INTO MAINTENANCE (HR_ID, IND_PRO_ID, IND_PRO_REQ_ID, STATUS, USER_REMARKS) VALUES (${Number(data.hrid)}, ${Number(data.indProId)}, ${Number(data.indProReqId)}, ${Number(data.status)}, '${data.userRemarks}')`
    );

// INSERT servicing request
const insertServicing = (maintanance_id, problem) =>
    ExecuteIT(
        `INSERT INTO SERVICES (PROBLEM, STATUS, MAINTENANCE_ID) VALUES ('${problem}', ${Number(0)}, ${Number(maintanance_id)})`,
    );


/*-------------- UPDATE ---------------*/
// maintanance statue
const updateMaintanance = (status, maintanance_id) => ExecuteIT(`UPDATE MAINTENANCE SET STATUS = ${Number(status)} WHERE MAINTENANCE_ID = ${Number(maintanance_id)} `);

// servicing statue
const updateServicing = (maintanance_id, remarks) => ExecuteIT(`UPDATE SERVICES SET STATUS = ${Number(1)}, REMARKS = '${remarks}' WHERE MAINTENANCE_ID = ${Number(maintanance_id)} `);

module.exports = {
    selectMaintanances, selectMaintanance, insertMaintananceReq, insertServicing, updateMaintanance, updateServicing
}