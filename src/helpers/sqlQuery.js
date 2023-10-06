export default {
  dashboardQuery(data) {
    let paymentStatus = data['payment_status'] ?? []
    let transactionStatus = data['transaction_status'] ?? []
    let transactionTypeCode = data['transaction_type_code'] ?? []
    let canNumber = data['canNumber'] ?? null;
    let folioNumber = data['folio_number'] ?? null;
    let utrn = data['utrn'] ?? 0;

    return `SELECT txnResTrans.id, txnResTrans.units, 
              (IFNULL(ROUND(SUM(txnResTrans.amount), 2), 0) + (
                  (
                    (SELECT IFNULL(ROUND(SUM(response_amount), 2), 0) FROM txn_response_systematic_rsps WHERE folio_number = txnResTrans.folio_number AND transaction_type_code = 'V') -
                    (SELECT IFNULL(ROUND(SUM(response_amount), 2), 0) FROM txn_response_systematic_rsps WHERE folio_number = txnResTrans.folio_number AND transaction_type_code = 'R')
                  )
                )
              ) AS sum_amount
            FROM
                txn_response_transaction_rsps AS txnResTrans
            WHERE
                txnResTrans.folio_number IS NOT ${folioNumber}
                AND txnResTrans.utrn NOT IN (${utrn})
                AND txnResTrans.payment_status IN (${paymentStatus})
                AND txnResTrans.transaction_status IN (${transactionStatus})
                AND txnResTrans.transaction_type_code IN (${transactionTypeCode})
                AND txnResTrans.can_number = '${canNumber}'
            GROUP BY txnResTrans.id LIMIT 1;`;
  },

};
