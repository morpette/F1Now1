/**
 * Parses a f1api.dev /api/drivers-style JSON body ({ drivers: [...] }) and
 * upserts each entry into x_1912467_f1now1_driver, matched by driver_id.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    try {
        var parsed = JSON.parse(inputs.drivers_json);
        var drivers = (parsed && parsed.drivers) || [];
        for (var i = 0; i < drivers.length; i++) {
            var d = drivers[i];
            if (!d || !d.driverId) continue;

            var gr = new GlideRecord('x_1912467_f1now1_driver');
            gr.addQuery('driver_id', d.driverId);
            gr.query();

            var isUpdate = gr.next();
            if (!isUpdate) {
                gr.initialize();
                gr.setValue('driver_id', d.driverId);
            }
            gr.setValue('name', d.name || '');
            gr.setValue('surname', d.surname || '');
            gr.setValue('abbreviation', d.shortName || '');
            gr.setValue('nationality', d.nationality || '');
            gr.setValue('date_of_birth', d.birthday || '');
            gr.setValue('url', d.url || '');
            if (d.number !== undefined && d.number !== null) {
                gr.setValue('number', d.number);
            }

            if (isUpdate) {
                gr.update();
                updated++;
            } else {
                gr.insert();
                created++;
            }
        }
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.error_message = '';
    } catch (ex) {
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);
