export default {

  dashboardQuery(data) {
    let paymentStatus = data['payment_status'] ?? []
    let transactionStatus = data['transaction_status'] ?? []
    let transactionTypeCode = data['transaction_type_code'] ?? []
    let canNumber = data['canNumber'] ?? null;
    let folioNumber = data['folio_number'] ?? null;
    let utrn = data['utrn'] ?? 0;

    return `SELECT txnResponseTransactionRsp.id, txnResponseTransactionRsp.units, (ROUND(SUM(txnResponseTransactionRsp.amount), 2) + ROUND(SUM(txnResponseSystematicRsps.price), 2)) AS sum_amount
            FROM
                txn_response_transaction_rsps AS txnResponseTransactionRsp
            RIGHT JOIN txn_response_systematic_rsps as txnResponseSystematicRsps ON txnResponseSystematicRsps.folio_number = txnResponseTransactionRsp.folio_number
            WHERE
                txnResponseTransactionRsp.folio_number IS NOT ${folioNumber}
                AND txnResponseTransactionRsp.utrn NOT IN (${utrn})
                AND txnResponseTransactionRsp.payment_status IN (${paymentStatus})
                AND txnResponseTransactionRsp.transaction_status IN (${transactionStatus})
                AND txnResponseTransactionRsp.transaction_type_code IN (${transactionTypeCode})
                AND txnResponseTransactionRsp.can_number = '${canNumber}'
            GROUP BY txnResponseTransactionRsp.id LIMIT 1;`;
  },

};
