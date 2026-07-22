/**
 * Parses a f1api.dev /api/{year}/drivers-style JSON body
 * ({ championshipId, drivers: [{ driverId, teamId, ... }] }) and upserts each
 * driver/team pairing into x_1912467_f1now1_driver_season, matched on the
 * (championship, team, driver) unique index. Entries whose championship,
 * driver, or team can't be resolved by business id are skipped, not errored.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    var skipped = 0;
    try {
        var parsed = JSON.parse(inputs.driver_seasons_json);
        var championshipId = parsed && parsed.championshipId;
        var drivers = (parsed && parsed.drivers) || [];

        var championshipSysId = '';
        if (championshipId) {
            var champGr = new GlideRecord('x_1912467_f1now1_championship');
            champGr.addQuery('championship_id', championshipId);
            champGr.query();
            if (champGr.next()) {
                championshipSysId = champGr.getUniqueValue();
            }
        }

        if (!championshipSysId) {
            outputs.created_count = 0;
            outputs.updated_count = 0;
            outputs.skipped_count = drivers.length;
            outputs.error_message = 'Championship not found: ' + championshipId;
            return;
        }

        for (var i = 0; i < drivers.length; i++) {
            var d = drivers[i];
            if (!d || !d.driverId || !d.teamId) {
                skipped++;
                continue;
            }

            var driverGr = new GlideRecord('x_1912467_f1now1_driver');
            driverGr.addQuery('driver_id', d.driverId);
            driverGr.query();
            if (!driverGr.next()) {
                skipped++;
                continue;
            }

            var teamGr = new GlideRecord('x_1912467_f1now1_team');
            teamGr.addQuery('team_id', d.teamId);
            teamGr.query();
            if (!teamGr.next()) {
                skipped++;
                continue;
            }

            var gr = new GlideRecord('x_1912467_f1now1_driver_season');
            gr.addQuery('championship', championshipSysId);
            gr.addQuery('team', teamGr.getUniqueValue());
            gr.addQuery('driver', driverGr.getUniqueValue());
            gr.query();

            if (gr.next()) {
                gr.update();
                updated++;
            } else {
                gr.initialize();
                gr.setValue('championship', championshipSysId);
                gr.setValue('team', teamGr.getUniqueValue());
                gr.setValue('driver', driverGr.getUniqueValue());
                gr.insert();
                created++;
            }
        }
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.skipped_count = skipped;
        outputs.error_message = '';
    } catch (ex) {
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.skipped_count = skipped;
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);
