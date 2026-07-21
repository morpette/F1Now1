/**
 * Thin invoker for F1 API REST function `getAllCircuits` (GET /api/circuits).
 * All HTTP detail lives in the 'F1 API Circuit Endpoints' REST Message; this step only wires
 * inputs to ${vars} and surfaces the raw response as action outputs.
 */
(function execute(inputs, outputs) {
    try {
        var rm = new sn_ws.RESTMessageV2('F1 API Circuit Endpoints', 'getAllCircuits');
        rm.setStringParameterNoEscape('limit', String(inputs.limit));
        rm.setStringParameterNoEscape('offset', String(inputs.offset));
        var response = rm.execute();
        outputs.status_code = response.getStatusCode();
        outputs.response_body = response.getBody();
        outputs.error_message = '';
    } catch (ex) {
        outputs.status_code = 0;
        outputs.response_body = '';
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);
