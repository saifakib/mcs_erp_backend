const { oracledb } = require("../../../db/db");
const { Execute, ExecuteMany } = require("../../../utils/dynamicController");

// use of work
module.exports.getLastReqNo = () =>
  Execute(`select requisitionno from str_requisitions WHERE
  reqid = (SELECT MAX(reqid) FROM str_requisitions)`);

module.exports.lastProRequiId = () =>
  Execute(`SELECT MAX(PROREQID) AS LAST_ID FROM STR_PROREQUISITIONS`);

module.exports.getProductBalance = (id) =>
  Execute(`SELECT PROQTY FROM STR_STOREPRODUCTS WHERE PROID = ${Number(id)}`);

// check requisition is pending or not of a user
module.exports.isReqPending = (employe_id) => {
  return Execute(
    `SELECT REQID, REQUISITIONNO, REQPROFID, REQUISTATUS, APPROVED, STOREACCEPT, PROACCEPT, DENY,
    case 
    WHEN DENY = 0 and PROACCEPT = 1 THEN 'Accepted'
    WHEN DENY = 1 and PROACCEPT = 0 THEN 'Denied'
    WHEN DENY = 0 and PROACCEPT = 0 THEN 'Pending' end Status
    FROM STR_REQUISITIONS 
    WHERE REQID=(SELECT max(REQID) FROM STR_REQUISITIONS WHERE PROFILEHRID = ${Number(
      employe_id
    )})`
  );
};

module.exports.getReqInfo = (id) =>
  Execute(`SELECT REQUITIME || ', ' || REQUIDATE AS DATE_TIME, 
  case
  when REQUISTATUS = 0 and APPROVED = 0 and STOREACCEPT = 0 and PROACCEPT = 0 then 'Pending'
  when REQUISTATUS = 1 and APPROVED = 1 and STOREACCEPT = 0 and PROACCEPT = 0 then 'Approved'
  when REQUISTATUS = 3 and APPROVED = 1 and STOREACCEPT = 1 and PROACCEPT = 0 and STOREACCEPT = 1 then 'Pending To Accept'
  when REQUISTATUS = 2 and DENY = 1 then 'Rejected'
  when REQUISTATUS = 3 and APPROVED = 1 and STOREACCEPT = 1 and PROACCEPT = 1 then 'Delivered' end Status FROM STR_REQUISITIONS WHERE REQID = ${Number(
    id
  )}`);

module.exports.userInfo = (id, status = 0) => {
  return Execute(`SELECT R.REQUITIME, R.REQUIDATE, R.REQUISITIONNO, R.REQUITIME, E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION from STR_REQUISITIONS r 
  left outer join HRM.EMPLOYEE E
    ON E.EMPLOYE_ID = R.PROFILEHRID
    LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
    ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
    LEFT OUTER JOIN HRM.DESIGNATION DG ON
    DG.DESIGNATION_ID = E.DESIGNATION_ID WHERE R.REQID = ${Number(
    id
  )} AND R.REQUISTATUS = ${Number(status)}`);
};

/*------------- Get ------------*/

module.exports.getTotalProReqQuantities = () =>
  Execute(
    "SELECT SUM(PROREQUQTY) AS totalrequisitions, SUM(APROQTY) AS approvedqty FROM STR_PROREQUISITIONS"
  );

// get requisition by id
module.exports.getRequisitionById = (
  id,
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(`SELECT distinct(R.REQID), R.PROFILEHRID, R.REQUITIME || ', ' || R.REQUIDATE AS DATE_TIME, R.REQUISITIONNO, case
  when REQUISTATUS = 0 and APPROVED = 0 and STOREACCEPT = 0 and PROACCEPT = 0 then 'Pending'
  when REQUISTATUS = 1 and APPROVED = 1 and STOREACCEPT = 0 and PROACCEPT = 0 then 'Approved'
  when REQUISTATUS = 3 and APPROVED = 1 and STOREACCEPT = 1 and PROACCEPT = 0 then 'Pending To Accept'
  when REQUISTATUS = 2 and DENY = 1 then 'Rejected'
  when REQUISTATUS = 3 and APPROVED = 1 and STOREACCEPT = 1 and PROACCEPT = 1 then 'Delivered' end Status,
  sum(PR.PROREQUQTY) over(partition by (PR.REQUIID)) as PROREQUQTY, sum(PR.APROQTY) over(partition by (PR.REQUIID)) as APROQTY
  FROM STR_PROREQUISITIONS PR LEFT OUTER JOIN  STR_REQUISITIONS R ON PR.REQUIID  = R.REQID WHERE PROFILEHRID = ${Number(
    id
  )} AND LOWER(R.REQUISITIONNO) LIKE LOWER('${search}') ORDER BY REQID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.getRequisitionDetailsById = (id) => {
  return Execute(`SELECT PR.REQUIID, PR.PROREQUQTY,
  PR.APROQTY,
  SP.PRONAME || ',' || SP.PRONAMETWO AS PRODUCT_NAME,
  PR.PREMARKS,
  U.UNIT
  FROM STR_PROREQUISITIONS PR
  LEFT OUTER JOIN STR_STOREPRODUCTS SP
  ON SP.PROID = PR.PROID
  LEFT OUTER JOIN STR_UNITS U
  ON U.UNIT_ID = SP.PRODUNIT
  WHERE REQUIID = ${Number(id)} ORDER BY PR.PROREQID DESC`);
};

module.exports.getTotalProductByUser = (id) => {
  return Execute(
    `select distinct(requiid), sum(PROREQUQTY)over(partition by hridno) as total_products,  
    sum(APROQTY)over(partition by hridno) as total_approved
    from str_prorequisitions where hridno = ${Number(id)}`
  );
};

// get pending requisitions
module.exports.pendingRequisitions = (
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(`SELECT distinct(R.REQID), R.REQUISITIONNO, R.REQUIDATE , R.REQUITIME, E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION, sum(p.PROREQUQTY) over(partition by p.REQUIID) REQ_QTY from STR_REQUISITIONS r LEFT OUTER JOIN STR_PROREQUISITIONS P ON P.REQUIID = R.REQID left outer join HRM.EMPLOYEE E
  ON E.EMPLOYE_ID = R.PROFILEHRID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
  ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN  HRM.DESIGNATION DG ON
  DG.DESIGNATION_ID = E.DESIGNATION_ID
  WHERE R.REQUISTATUS = ${Number(
    0
  )} AND (R.REQUISITIONNO LIKE LOWER('${search}') OR E.NAME_ENGLISH LIKE UPPER('${search}') OR UPPER(D.DEPARTEMENT) LIKE UPPER('${search}') OR UPPER(DG.DESIGNATION) LIKE UPPER('${search}'))  ORDER BY R.REQID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.pendingRequisitionDetails = (id) => {
  return Execute(`select pr.proreqid, pr.requiid, pr.hridno, pr.proid, pr.premarks, sp.proname, 
  pr.prorequqty, pr.APPROVEREMARKS, u.unit, sp.procate, sp.proqty from str_prorequisitions pr
  left outer join str_storeproducts sp on pr.proid = sp.proid
  left outer join str_units u on u.unit_id = sp.produnit
  left outer join str_requisitions r on r.reqid = pr.requiid
  left outer join STR_UNITS su on sp.PRODUNIT = su.UNIT_ID
  where pr.requiid = ${Number(id)} and r.requistatus = ${Number(
    0
  )} order by proreqid`);
};

module.exports.getLastReqInfo = (item) => {
  return Execute(
    `select proid, prodate, prorequqty from str_prorequisitions where hridno = ${Number(
      item.HRIDNO
    )} and proid = ${Number(
      item.PROID
    )} order by prodate desc fetch next 2 rows only`
  );
};

module.exports.currentStock = (proid) => {
  return Execute(
    `select proname, proqty from str_storeproducts where proid = ${Number(
      proid
    )}`
  );
};

// get approved requisitions
module.exports.approvedRequisitions = (
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(`SELECT distinct(R.REQID), R.REQUISITIONNO, R.REQUIDATE, R.REQUITIME, E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION, sum(p.PROREQUQTY) over(partition by p.REQUIID) req_qty, sum(p.APROQTY) over( partition by p.REQUIID) approved_qty from STR_REQUISITIONS r LEFT OUTER JOIN STR_PROREQUISITIONS P ON P.REQUIID = R.REQID left outer join HRM.EMPLOYEE E
  ON E.EMPLOYE_ID = R.PROFILEHRID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN  HRM.DESIGNATION DG ON DG.DESIGNATION_ID = E.DESIGNATION_ID
  WHERE R.REQUISTATUS = ${Number(
    1
  )} AND (R.REQUISITIONNO LIKE LOWER('${search}') OR E.NAME_ENGLISH LIKE UPPER('${search}') OR  UPPER(D.DEPARTEMENT) LIKE UPPER('${search}') OR UPPER(DG.DESIGNATION) LIKE UPPER('${search}')) ORDER BY R.REQID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};


module.exports.approvedRequisitionDetails = (id) => {
  return Execute(`select pr.proreqid, pr.requiid, pr.hridno, pr.proid, pr.premarks, pr.approveremarks, sp.proname, sp.pronametwo, 
  pr.prorequqty, pr.prodate, u.unit, sp.procate, sp.proqty, pr.aproqty from str_prorequisitions pr
  left outer join str_storeproducts sp on pr.proid = sp.proid
  left outer join str_units u on u.unit_id = sp.produnit
  left outer join str_requisitions r on r.reqid = pr.requiid
  where pr.requiid = ${Number(id)} and r.requistatus = ${Number(1)}`);
};

module.exports.adminApproved = (item) => {
  return Execute(`select pr.aproqty, sp.proname from str_prorequisitions pr
  left outer join str_storeproducts sp on sp.proid = pr.proid
  
  where pr.requiid = ${Number(item.REQUIID)} and pr.proid = ${Number(
    item.PROID
  )} 
  order by pr.proreqid desc`);
};

// get done requisitions
module.exports.doneRequisitions = (search = "%%", page = 0, limit = 1000, given) => {
  let offset = limit * page;
  return Execute(`SELECT distinct(R.REQID), R.REQUISITIONNO, R.REQUIDATE , E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION, case
  WHEN R.GIVEN = 0 THEN 'Not Given'
  WHEN R.GIVEN = 1 THEN 'Given' END GIVEN,
  sum(p.PROREQUQTY) over(partition by p.REQUIID) req_qty, sum(p.APROQTY) over( partition by p.REQUIID) approved_qty from STR_REQUISITIONS r LEFT OUTER JOIN STR_PROREQUISITIONS P ON P.REQUIID = R.REQID left outer join HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.PROFILEHRID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN  HRM.DESIGNATION DG ON DG.DESIGNATION_ID = E.DESIGNATION_ID
  WHERE R.REQUISTATUS = ${Number(
    3
  )} AND R.GIVEN = ${Number(given)} AND (R.REQUISITIONNO LIKE LOWER('${search}') OR E.NAME_ENGLISH LIKE UPPER('${search}') OR  UPPER(D.DEPARTEMENT) LIKE UPPER('${search}') OR UPPER(DG.DESIGNATION) LIKE UPPER('${search}')) ORDER BY R.REQID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.doneRequisitionsDetails = (id) => {
  return Execute(
    `SELECT R.REQID, R.REQUISITIONNO, R.REQUIDATE, E.NAME_ENGLISH, E.MOBILE_PHONE, D.DEPARTEMENT, DG.DESIGNATION FROM str_requisitions R
    LEFT OUTER JOIN HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.PROFILEHRID
    LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
    ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
    LEFT OUTER JOIN  HRM.DESIGNATION DG ON
    DG.DESIGNATION_ID = E.DESIGNATION_ID    
    WHERE R.REQID = ${Number(id)} AND R.REQUISTATUS = ${Number(3)}`
  );
};

module.exports.doneReqProducts = (id) => {
  return Execute(
    `select pr.proreqid, sp.proname, pr.prorequqty, pr.aproqty, pr.premarks from str_requisitions r left outer join str_prorequisitions pr on pr.requiid = r.reqid left outer join str_storeproducts sp on sp.proid = pr.proid where r.reqid = ${Number(
      id
    )} and r.requistatus = ${Number(3)}`
  );
};

module.exports.signaturesOfApproval = () =>
  Execute(
    "select r.role_id, r.emp_id, s.SIGNATURE_PATH from str_role r left outer join hrm.employee_signature s on s.employe_id = r.emp_id order by r.role_id"
  );

module.exports.employeeSignature = (id) =>
  Execute(
    `select distinct(r.profilehrid) as emp_id, s.signature_path from str_requisitions r
    left outer join hrm.employee_signature s on s.employe_id = r.profilehrid
    where r.reqid = ${Number(id)}`
  );

// denied requisitions
module.exports.deniedRequisitions = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(`SELECT distinct(R.REQID), R.REQUISITIONNO, R.REQUIDATE , E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION, R.DENYTIME from STR_REQUISITIONS r LEFT OUTER JOIN STR_PROREQUISITIONS P ON P.REQUIID = R.REQID left outer join HRM.EMPLOYEE E
  ON E.EMPLOYE_ID = R.PROFILEHRID
  LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
  ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
  LEFT OUTER JOIN  HRM.DESIGNATION DG ON
  DG.DESIGNATION_ID = E.DESIGNATION_ID
  WHERE R.REQUISTATUS = ${Number(
    2
  )} AND R.REQUISITIONNO LIKE LOWER('${search}') ORDER BY R.REQID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`);
};

module.exports.deniedRequisitionsDetails = (id) => {
  return Execute(
    `SELECT R.REQID, R.REQUISITIONNO, R.REQUIDATE, E.NAME_ENGLISH, E.MOBILE_PHONE, D.DEPARTEMENT, DG.DESIGNATION FROM str_requisitions R
    LEFT OUTER JOIN HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.PROFILEHRID
    LEFT OUTER JOIN HRM.DEPARTMENT_LIST D
    ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
    LEFT OUTER JOIN  HRM.DESIGNATION DG ON
    DG.DESIGNATION_ID = E.DESIGNATION_ID    
    WHERE R.REQID = ${Number(id)} AND R.REQUISTATUS = ${Number(2)}`
  );
};

module.exports.deniedReqProducts = (id) => {
  return Execute(
    `select pr.proreqid, sp.proname, pr.prorequqty, pr.aproqty, pr.premarks from str_requisitions r left outer join str_prorequisitions pr on pr.requiid = r.reqid left outer join str_storeproducts sp on sp.proid = pr.proid where r.reqid = ${Number(
      id
    )} and r.requistatus = ${Number(3)}`
  );
};

/*------------- Post ------------*/
// post requisition information
module.exports.postRequisitionInfo = ({
  profilehrId,
  requiTime,
  requiMonth,
  requiDate,
  lastReqNo,
  status,
  approve,
  storeaccept,
  proaccept,
  deny,
}) =>
  Execute(
    `INSERT INTO STR_REQUISITIONS (REQUISITIONNO, REQUITIME, REQUIDATE, REQUIMONTH, REQUISTATUS, PROFILEHRID, APPROVED, STOREACCEPT, PROACCEPT, DENY) VALUES ('${lastReqNo}', '${requiTime}', '${requiDate}', '${requiMonth}', ${Number(
      status
    )}, ${Number(profilehrId)}, ${Number(approve)}, ${Number(
      storeaccept
    )}, ${Number(proaccept)}, ${Number(deny)}) RETURN REQID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

//manual post requisition

module.exports.manualPostRequisitionInfo = (
  lastReqN,
  hrid,
  requitime,
  requidate,
  requimonth,
  approvedby
) =>
  Execute(
    `INSERT INTO STR_REQUISITIONS (REQUISITIONNO, PROFILEHRID, REQUITIME, REQUIDATE, REQUIMONTH, REQUISTATUS, APPROVED, APPROVEDBY, APROVEDTIME, APPROVEDDATE, STOREACCEPT, PROACCEPT, PROACCEPTTIME, PROACCEPTDATE) VALUES ('${lastReqN}', ${Number(
      hrid
    )}, '${requitime}', '${requidate}', '${requimonth}', ${Number(3)}, ${Number(
      1
    )}, '${approvedby}', '${requitime}', '${requidate}', ${Number(1)}, ${Number(
      1
    )}, '${requitime}', '${requidate}') RETURN REQID INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

//manual post prorequisition
module.exports.postProRequisition = (array) => {
  const newArray = array;
  const statement = `INSERT INTO STR_PROREQUISITIONS (HRIDNO, REQUIBY, REQUIID, PROID, PROREQUUNIT, PROREQUQTY, PREMARKS, APROQTY, REQUPRODSTATUS, PRODATE, PROMONTH) VALUES (:HRIDNO, :REQUIBY, :REQUIID, :PROID, :PROREQUUNIT, :PROREQUQTY, :PREMARKS, :APROQTY, :REQUPRODSTATUS, :PRODATE, :PROMONTH)`;
  return ExecuteMany(statement, newArray);
};

// manual post product summaries
module.exports.postProductSummaries = (array) => {
  let newArray = array;
  const statement = `INSERT INTO STR_PRODUCTSUMMARIES (PRODUCTID, PROCAT, INTIALQTY, TOTALBALANCE, TOTALOUT, PRESENTBALANCE, SUMMDATE, SUMMMONTH) VALUES (:PRODUCTID, :PROCAT, :INTIALQTY, :TOTALBALANCE, :TOTALOUT, :PRESENTBALANCE, :SUMMDATE, :SUMMMONTH)`;
  return ExecuteMany(statement, newArray);
};

// post requisition details
module.exports.postReqProduct = (array) => {
  const newArray = array;
  const statement = `INSERT INTO STR_PROREQUISITIONS (PROREQID, HRIDNO, REQUIID, PROID, PROREQUQTY, PREMARKS, APROQTY, PRODATE, PROMONTH) VALUES (:PROREQID, :HRIDNO, :REQUIID, :PROID, :PROREQUQTY, :PREMARKS, :APROQTY, :PRODATE, :PROMONTH)`;
  return ExecuteMany(statement, newArray);
};

/*------------- Put ------------*/

/*------- update requisition for admin ------ */
module.exports.updateRequisitionInfo = (updatedInfo) => {
  const {
    REQUISTATUS,
    APPROVED,
    APPROVEDBY,
    APROVEDTIME,
    APPROVEDDATE,
    REQID,
  } = updatedInfo;

  return Execute(
    `UPDATE STR_REQUISITIONS SET REQUISTATUS = ${Number(
      REQUISTATUS
    )}, APPROVED = ${Number(
      APPROVED
    )}, APPROVEDBY = '${APPROVEDBY}', APROVEDTIME = '${APROVEDTIME}', APPROVEDDATE = '${APPROVEDDATE}' WHERE REQID = ${REQID}`
  );
};

module.exports.updateReqProducts = (products) => {
  const newArray = products.map((item) => {
    const obj = {
      APPROVEQTY: item.qty,
      ADMINAPPRO: item.qty,
      APPROVEREMARKS: item.remarks,
      PROREQID: item.proreqid,
    };
    return obj;
  });

  const statement = `UPDATE STR_PROREQUISITIONS SET APROQTY = :APPROVEQTY, ADMINAPPRO = :ADMINAPPRO, APPROVEREMARKS = :APPROVEREMARKS WHERE PROREQID = :PROREQID`;

  return ExecuteMany(statement, newArray);
};

/*------- update requisition for store_officer ------ */
module.exports.updateBalance = ({ PROID, PROQTY }) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET PROQTY = ${Number(
      PROQTY
    )} WHERE PROID = ${Number(PROID)}`
  );

module.exports.updateStoreProducts = ({
  APPROQTY,
  REQUPRODSTATUS,
  STOREREMARKS,
  PROREQID,
}) => {
  return Execute(
    `UPDATE STR_PROREQUISITIONS SET APROQTY = ${Number(
      APPROQTY
    )}, REQUPRODSTATUS = ${Number(
      REQUPRODSTATUS
    )}, STOREREMARKS = '${STOREREMARKS}' WHERE PROREQID = ${Number(PROREQID)}`
  );
};

module.exports.insertSummeries = (data) => {
  const {
    PRODUCTID,
    PRODUCTNAME,
    PROCAT,
    INTIALQTY,
    TOTALBALANCE,
    TOTALOUT,
    PRESENTBALANCE,
    SUMMDATE,
    SUMMMONTH,
    REQUISITIONFOR,
    SUMMERTYPE,
  } = data;

  return Execute(
    `INSERT INTO STR_PRODUCTSUMMARIES (PRODUCTID, PRODUCTNAME, INTIALQTY, TOTALBALANCE, TOTALOUT, PRESENTBALANCE, SUMMDATE, SUMMMONTH, REQUISITIONFOR, SUMMERTYPE, PROCAT) VALUES (${Number(
      PRODUCTID
    )}, '${PRODUCTNAME}', ${Number(INTIALQTY)}, ${Number(
      TOTALBALANCE
    )}, ${Number(TOTALOUT)}, ${Number(
      PRESENTBALANCE
    )}, '${SUMMDATE}', '${SUMMMONTH}', ${Number(
      REQUISITIONFOR
    )}, '${SUMMERTYPE}', ${Number(PROCAT)})`
  );
};

// manual Update Store Product
module.exports.updateStoreProduct = (array) => {
  let newArray = array;
  const statement = `UPDATE STR_STOREPRODUCTS SET PROQTY = :PROQTY WHERE PROID = :PROID`;
  return ExecuteMany(statement, newArray);
};

/*------- update requisition by store ------ */
module.exports.updateReqByStore = (data, given) => {
  if (given) {
    return Execute(
      `UPDATE STR_REQUISITIONS SET REQUISTATUS = ${Number(
        data.REQUISTATUS
      )}, STOREACCEPT = ${Number(data.STOREACCEPT)}, APPROVEDBY = '${data.APPROVEDBY
      }', APROVEDTIME = '${data.APROVEDTIME}', APPROVEDDATE = '${data.APPROVEDDATE
      }', GIVEN = ${Number(1)} WHERE REQID = ${Number(data.REQID)}`
    );
  } else {
    return Execute(
      `UPDATE STR_REQUISITIONS SET REQUISTATUS = ${Number(
        data.REQUISTATUS
      )}, STOREACCEPT = ${Number(data.STOREACCEPT)}, APPROVEDBY = '${data.APPROVEDBY
      }', APROVEDTIME = '${data.APROVEDTIME}', APPROVEDDATE = '${data.APPROVEDDATE
      }' WHERE REQID = ${Number(data.REQID)}`
    );
  }
};


/*------- update requisition given or notgiven ------ */
module.exports.updateReqGivenByStore = (id) => {
  return Execute(
    `UPDATE STR_REQUISITIONS SET GIVEN = ${Number(1)} WHERE REQID = ${id}`
  );
};

/*------- update requisition for requisitionar ------ */
module.exports.reqAcceptByUser = (data) => {
  return Execute(
    `UPDATE STR_REQUISITIONS SET PROACCEPT = ${Number(
      data.PROACCEPT
    )}, PROACCEPTTIME = '${data.PROACCEPTTIME}', PROACCEPTDATE = '${data.PROACCEPTDATE
    }' WHERE REQID = ${data.REQID}`
  );
};

/*------- deny requisition ------ */
module.exports.denyRequisition = (data) => {
  return Execute(
    `UPDATE STR_REQUISITIONS SET REQUISTATUS = ${Number(
      data.REQUISTATUS
    )}, DENY = ${Number(data.DENY)}, DENYREMARKS = '${data.DENYREMAKRS
    }', DENYBY = '${data.DENYBY}', DENYTIME = '${data.DENYTIME}', DENYDATE = '${data.DENYDATE
    }' WHERE REQID = ${Number(data.REQID)}`
  );
};

// update pro_requisition table
module.exports.updateProReqOnDeny = (req_id) => {
  return Execute(
    `UPDATE STR_PROREQUISITIONS SET REQUPRODSTATUS = ${Number(
      2
    )} WHERE REQUIID = ${Number(req_id)}`
  );
};

// get roles
module.exports.getStoreRoles = () =>
  Execute(
    "SELECT R.ROLE_ID, R.ROLE_NAME, E.EMPLOYE_ID, E.NAME_ENGLISH, D.DEPARTEMENT, DG.DESIGNATION from STR_ROLE R left outer join HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.EMP_ID LEFT OUTER JOIN HRM.DEPARTMENT_LIST D ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID LEFT OUTER JOIN HRM.DESIGNATION DG ON  DG.DESIGNATION_ID = E.DESIGNATION_ID"
  );

// get single roles
module.exports.singleStoreRoles = (id) =>
  Execute(
    `SELECT R.ROLE_ID, R.ROLE_NAME, E.NAME_ENGLISH, E.EMPLOYE_ID, D.DEPARTEMENT, DG.DESIGNATION from STR_ROLE R left outer join HRM.EMPLOYEE E ON E.EMPLOYE_ID = R.EMP_ID LEFT OUTER JOIN HRM.DEPARTMENT_LIST D ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID LEFT OUTER JOIN HRM.DESIGNATION DG ON  DG.DESIGNATION_ID = E.DESIGNATION_ID WHERE ROLE_ID = ${Number(
      id
    )}`
  );

// update roles
module.exports.updateStoreRoles = (role_id, emp_id) => {
  return Execute(
    `UPDATE STR_ROLE SET EMP_ID = ${Number(emp_id)} WHERE ROLE_ID = ${Number(
      role_id
    )}`
  );
};
