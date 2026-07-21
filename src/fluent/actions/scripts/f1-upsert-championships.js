/**
 * Parses a f1api.dev /api/seasons-style JSON body ({ championships: [...] })
 * and upserts each entry into x_1912467_f1now1_championship, matched by
 * championship_id.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    try {
        var parsed = JSON.parse(inputs.championships_json);
        var championships = (parsed && parsed.championships) || [];
        for (var i = 0; i < championships.length; i++) {
            var c = championships[i];
            if (!c || !c.championshipId) continue;

            var gr = new GlideRecord('x_1912467_f1now1_championship');
            gr.addQuery('championship_id', c.championshipId);
            gr.query();

            var isUpdate = gr.next();
            if (!isUpdate) {
                gr.initialize();
                gr.setValue('championship_id', c.championshipId);
            }
            gr.setValue('name', c.championshipName || '');
            gr.setValue('url', c.url || '');
            if (c.year !== undefined && c.year !== null) {
                gr.setValue('year', c.year);
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
