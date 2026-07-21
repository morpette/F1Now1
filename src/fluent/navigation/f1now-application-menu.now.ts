import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

/**
 * F1Now application menu — top-level navigator entry with one module per
 * tracking table, so each table has a "List" link in the sidebar.
 */
export const f1NowApplicationMenu = ApplicationMenu({
    $id: Now.ID['f1now-app-menu'],
    title: 'F1Now',
    hint: 'F1Now Formula 1 tracking',
    description: 'Navigate the F1Now Formula 1 tracking tables.',
    active: true,
})

export const f1NowModuleChampionship = Record({
    $id: Now.ID['f1now-module-championship'],
    table: 'sys_app_module',
    data: {
        title: 'Championship',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_championship',
        active: true,
        order: 100,
    },
})

export const f1NowModuleCircuit = Record({
    $id: Now.ID['f1now-module-circuit'],
    table: 'sys_app_module',
    data: {
        title: 'Circuit',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_circuit',
        active: true,
        order: 200,
    },
})

export const f1NowModuleRace = Record({
    $id: Now.ID['f1now-module-race'],
    table: 'sys_app_module',
    data: {
        title: 'Race',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_race',
        active: true,
        order: 300,
    },
})

export const f1NowModuleSession = Record({
    $id: Now.ID['f1now-module-session'],
    table: 'sys_app_module',
    data: {
        title: 'Session',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_session',
        active: true,
        order: 400,
    },
})

export const f1NowModuleSessionResult = Record({
    $id: Now.ID['f1now-module-session-result'],
    table: 'sys_app_module',
    data: {
        title: 'Session Result',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_session_res',
        active: true,
        order: 500,
    },
})

export const f1NowModuleDriver = Record({
    $id: Now.ID['f1now-module-driver'],
    table: 'sys_app_module',
    data: {
        title: 'Driver',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_driver',
        active: true,
        order: 550,
    },
})

export const f1NowModuleTeam = Record({
    $id: Now.ID['f1now-module-team'],
    table: 'sys_app_module',
    data: {
        title: 'Team',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_team',
        active: true,
        order: 600,
    },
})

export const f1NowModuleDriverStanding = Record({
    $id: Now.ID['f1now-module-driver-standing'],
    table: 'sys_app_module',
    data: {
        title: 'Driver Standing',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_driver_stand',
        active: true,
        order: 700,
    },
})

export const f1NowModuleConstructorStanding = Record({
    $id: Now.ID['f1now-module-constructor-standing'],
    table: 'sys_app_module',
    data: {
        title: 'Constructor Standing',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_team_standing',
        active: true,
        order: 800,
    },
})

export const f1NowModuleDriverTeamSeason = Record({
    $id: Now.ID['f1now-module-driver-team-season'],
    table: 'sys_app_module',
    data: {
        title: 'Driver Team Season',
        application: f1NowApplicationMenu,
        link_type: 'LIST',
        name: 'x_1912467_f1now1_driver_season',
        active: true,
        order: 900,
    },
})
