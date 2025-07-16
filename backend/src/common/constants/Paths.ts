
export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Currencies: {
    Base: '/currencies',
    Convert: '/convert',
  },
} as const;
