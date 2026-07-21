import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1912467_f1now1_race',
    view: default_view,
    columns: ['championship', 'round', 'name', 'circuit', 'laps', 'fastest_lap_time'],
})
