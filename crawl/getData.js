const axios = require("axios");
const https = require("https");
axios.defaults.timeout = 300000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });
const checkExit = require("./checkExit.js");
const sql = require("../model/db");
var date = new Date();
//date.setDate(date.getDate() - 1);
date.setHours(7, 0, 0, 0);
var date2 = new Date();
date2.setHours(30, 59, 59, 999);
var isodateSince = date.toISOString().split(".")[0];
var isodateUntil = date2.toISOString().split(".")[0];
async function crawlData(ApiKey) {
  console.log(isodateSince);
  console.log(isodateUntil)
  const res = await axios.get("https://api.accesstrade.vn/v1/order-list", {
    headers: {
      Authorization: "Token " + ApiKey,
    },
    params: {
      since : isodateSince,
      until : isodateUntil,
      limit: 300
    }
  });
  return res.data;
}
async function getOrdersOnePage(page, ApiKey) {
  const res = await axios.get("https://api.accesstrade.vn/v1/order-list", {
    headers: {
      Authorization: "Token " + ApiKey,
    },
    params: {
      since : isodateSince,
      until : isodateUntil ,
      page: page,
      limit : 300
    },
  });
  return res.data.data;
}
async function getOrderDetail(orderId,merchant , ApiKey) {
  const res = await axios.get("https://api.accesstrade.vn/v1/order-products", {
    headers: {
      Authorization: "Token " + ApiKey,
    },
    params: {
      order_id : orderId ,
      merchant : merchant ,   
    },
  });
  return (res.data.data[0]._extra.parameters.click_user_agent);
}

async function getOrderDevice(orderId,merchant , ApiKey) {
  const res = await axios.get("https://api.accesstrade.vn/v1/order-products", {
    headers: {
      Authorization: "Token " + ApiKey,
    },
    params: {
      order_id : orderId ,
      merchant : merchant ,   
    },
  });
  return (res.data.data[0]._extra.device_type);
}

async function calculateCommission(name, commission) {
  return new Promise((resolve) => {
    sql.query(
      `SELECT percentage , unit_price  FROM partners WHERE name = "${name}" ORDER BY parent_id DESC LIMIT 1`,
      async function (error, results, fields) {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            if (results[0].percentage == 0) {
              resolve(results[0].unit_price);
            } else {
              resolve((commission * results[0].percentage) / 100);
            }
          } else {
            resolve((commission * 40) / 100);
          }
        }
      }
    );
  });
}

function checkStatus(order_pending , order_reject , order_approved) {
  if(order_approved == 1)
  {
    return 1
  }
  else 
  {
    if(order_reject == 1){
      return 2
    }
    else if(order_pending == 1 )
    {
      return 0
    }
  }
}

function filterData(arr , ApiKey) {
  arr.forEach(async (order) => {
    const value = {};
    value.order_id = order.order_id;
    value.merchant = order.merchant;
    value.utm_source = order.utm_source;
    value.is_confirmed = order.is_confirmed;
    value.sales_time = order.sales_time;
    value.pub_commission = order.pub_commission;
    value.reality_commission = await calculateCommission(
      order.merchant,
      order.pub_commission
    );
    value.order_status = await checkStatus(order.order_pending , order.order_reject , order.order_approved);
    value.confirmed_time = order.confirmed_time;
    value.click_time = order.click_time;
    value.user_agent = await getOrderDetail(order.order_id , order.merchant , ApiKey);
    value.device = await getOrderDevice(order.order_id , order.merchant , ApiKey);
    filterDataByTime(value);
  });
}



async function filterDataByTime(dataOrders) {
  await checkExit.check(dataOrders);
}
async function getStart(ApiKey) {
  const dataRes = await crawlData(ApiKey);
 var total_page = Math.ceil((dataRes.total) / 300);
  if (total_page > 1) {
    var getAll = [];
    for (let i = 1; i <= total_page; i = i + 2) {
      let j = i + 1;
      const page = await getOrdersOnePage(i, ApiKey);
      const page_next = await getOrdersOnePage(j, ApiKey);
      getAll = getAll.concat(page.concat(page_next));
    }
    console.log(getAll.length);
    await filterData(getAll , ApiKey);
    console.log("done multil  page  " + ApiKey);
  } else {
    console.log(dataRes.data.length);
   await filterData(dataRes.data , ApiKey);
    console.log("done  1 page  " + ApiKey);
  }
}

async function getKey() {
  await sql.query(
    `SELECT API_key FROM accounts `,
    async function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        results.forEach(async (account) => {
          await getStart(account.API_key);
        });
      }
    }
  );
}

(async () => {
  await getKey();
})();
