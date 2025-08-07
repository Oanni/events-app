import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';
export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  EVENTS: 'events',
  MY_EVENTS: 'my_events',
  MY_REGISTRATIONS: 'my_registrations',
  CREATE_EVENT: 'create_event',
  EVENT_DETAILS: 'event_details',
  REGISTER_EVENT: 'register_event',
  HELP: 'help',
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.EVENTS, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.MY_EVENTS, '/my-events', []),
      createPanel(DEFAULT_VIEW_PANELS.MY_REGISTRATIONS, '/my-registrations', []),
      createPanel(DEFAULT_VIEW_PANELS.CREATE_EVENT, '/create-event', []),
      createPanel(DEFAULT_VIEW_PANELS.EVENT_DETAILS, '/event/:id', []),
      createPanel(DEFAULT_VIEW_PANELS.REGISTER_EVENT, '/register/:id', []),
      createPanel(DEFAULT_VIEW_PANELS.HELP, '/help', []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
