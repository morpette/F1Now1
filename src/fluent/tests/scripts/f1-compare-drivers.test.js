/**
 * ATF server-side script — invokes the "F1: Compare Two Drivers" action via the
 * scriptable Flow runner and asserts a 200 valid-JSON response.
 *
 * NOTE: The upstream f1api.dev /compare endpoint currently returns HTTP 500
 * ("Server error") for every input, so this test's parent Test is set
 * active:false. Re-enable it once the endpoint is fixed. The response shape of a
 * successful compare is unverified, hence the assertion only checks for valid
 * JSON (tighten with a key check once a 200 payload can be observed).
 */
(function () {
    function fail(msg) {
        stepResult.setOutputMessage(msg);
        stepResult.setFailed();
    }

    var result = sn_fd.FlowAPI.getRunner()
        .action('x_1912467_f1now1.f1_compare_drivers')
        .inForeground()
        .withInputs({ year: 2024, driver_id_1: 'max_verstappen', driver_id_2: 'lewis_hamilton' })
        .run();
    var out = result.getOutputs();

    var status = parseInt(out.status_code, 10);
    var err = out.error_message || '';
    var body = out.response_body || '';

    if (status !== 200) return fail('Expected status 200, got ' + status + ' (error_message: ' + err + ')');
    if (err) return fail('Expected empty error_message, got: ' + err);

    try {
        JSON.parse(body);
    } catch (e) {
        return fail('response_body is not valid JSON: ' + e);
    }

    stepResult.setOutputMessage('OK: 200, valid JSON');
})();